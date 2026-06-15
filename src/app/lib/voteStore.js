import { supabase } from './supabase';
import { songs } from './songs';

const SONG_COUNT = songs.length;

// Module-level store — survives across requests within the same process.
// globalThis trick keeps state alive across Next.js hot-reloads in dev.
function createStore() {
  const store = {};
  for (let id = 1; id <= SONG_COUNT; id++) {
    store[id] = { wins: 0, losses: 0 };
  }
  return store;
}

if (!globalThis.__phonkVoteStore) {
  globalThis.__phonkVoteStore = createStore();
}

const votesFallback = globalThis.__phonkVoteStore;

/**
 * Record the outcome of a single battle.
 * @param {number} winnerId  Song that won (1-10)
 * @param {number} loserId   Song that lost (1-10)
 */
export async function recordVote(winnerId, loserId) {
  const wId = Number(winnerId);
  const lId = Number(loserId);

  // If Supabase is connected, save to DB
  if (supabase) {
    const { error } = await supabase
      .from('votes')
      .insert([{ winner_id: wId, loser_id: lId }]);
    
    if (error) {
      console.error('Supabase error recording vote:', error);
      throw error;
    }
    return;
  }

  // Fallback to in-memory store
  if (!votesFallback[wId] || !votesFallback[lId]) {
    throw new Error(
      `Invalid song IDs: winner=${wId}, loser=${lId}. Must be 1-${SONG_COUNT}.`
    );
  }
  votesFallback[wId].wins += 1;
  votesFallback[lId].losses += 1;
}

/**
 * Get stats for every song.
 * If Supabase is connected, queries all votes and aggregates wins/losses.
 * Otherwise, uses the in-memory store.
 * @returns {Promise<Array<{ songId: number, wins: number, losses: number, totalBattles: number, winRate: number }>>}
 */
export async function getAllStats() {
  const statsMap = {};
  for (let id = 1; id <= SONG_COUNT; id++) {
    statsMap[id] = { wins: 0, losses: 0 };
  }

  if (supabase) {
    const { data, error } = await supabase
      .from('votes')
      .select('winner_id, loser_id');

    if (error) {
      console.error('Supabase error fetching vote stats:', error);
      throw error;
    }

    if (data) {
      for (const row of data) {
        const w = Number(row.winner_id);
        const l = Number(row.loser_id);
        if (statsMap[w]) statsMap[w].wins += 1;
        if (statsMap[l]) statsMap[l].losses += 1;
      }
    }
  } else {
    // Fallback to in-memory store
    for (let id = 1; id <= SONG_COUNT; id++) {
      statsMap[id].wins = votesFallback[id].wins;
      statsMap[id].losses = votesFallback[id].losses;
    }
  }

  const stats = [];
  for (let id = 1; id <= SONG_COUNT; id++) {
    const entry = statsMap[id];
    const totalBattles = entry.wins + entry.losses;
    const winRate = totalBattles === 0 ? 0 : entry.wins / totalBattles;
    stats.push({ songId: id, wins: entry.wins, losses: entry.losses, totalBattles, winRate });
  }

  // Sort by winRate descending, then by total wins descending as tiebreaker
  stats.sort((a, b) => {
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return b.wins - a.wins;
  });
  return stats;
}

/**
 * Get stats for a single song.
 * @param {number} songId
 */
export async function getVoteStats(songId) {
  const stats = await getAllStats();
  const found = stats.find(s => s.songId === Number(songId));
  if (found) return found;
  return { songId, wins: 0, losses: 0, totalBattles: 0, winRate: 0 };
}

/**
 * Calculate display percentages for a specific matchup.
 * If Supabase is connected, fetches wins from the DB.
 * Otherwise, uses the in-memory store.
 *
 * @param {number} winnerId
 * @param {number} loserId
 * @returns {Promise<{ winnerPercent: number, loserPercent: number }>}
 */
export async function getBattlePercent(winnerId, loserId) {
  const wId = Number(winnerId);
  const lId = Number(loserId);

  let winnerWins = 0;
  let loserWins = 0;

  if (supabase) {
    // Fetch counts from Supabase
    const { count: wCount, error: wErr } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('winner_id', wId);

    const { count: lCount, error: lErr } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('winner_id', lId);

    if (wErr || lErr) {
      console.error('Supabase error fetching matchup counts:', wErr || lErr);
      throw wErr || lErr;
    }

    winnerWins = wCount || 0;
    loserWins = lCount || 0;
  } else {
    // Use fallback store
    winnerWins = votesFallback[wId]?.wins || 0;
    loserWins = votesFallback[lId]?.wins || 0;
  }

  const totalWins = winnerWins + loserWins;
  if (totalWins === 0) {
    return { winnerPercent: 50, loserPercent: 50 };
  }

  const winnerPercent = Math.round((winnerWins / totalWins) * 100);
  const loserPercent = 100 - winnerPercent;

  return { winnerPercent, loserPercent };
}
