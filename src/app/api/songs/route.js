import { songs } from "../../lib/songs";
import { getAllStats } from "../../lib/voteStore";

export async function GET() {
  try {
    const stats = await getAllStats();

    // Build a lookup map: songId → stats
    const statsMap = {};
    for (const entry of stats) {
      statsMap[entry.songId] = entry;
    }

    // Merge song metadata with vote stats
    const enrichedSongs = songs.map((song) => {
      const stat = statsMap[song.id] || {
        wins: 0,
        losses: 0,
        totalBattles: 0,
        winRate: 0,
      };
      return {
        ...song,
        wins: stat.wins,
        losses: stat.losses,
        totalBattles: stat.totalBattles,
        winRate: stat.winRate,
      };
    });

    return Response.json({ songs: enrichedSongs });
  } catch (error) {
    console.error("[GET /api/songs] Error:", error);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
