import { songs } from "../../lib/songs";
import { getAllStats } from "../../lib/voteStore";

export async function GET() {
  try {
    const stats = await getAllStats(); // already sorted by winRate desc, then wins desc

    // Build a lookup map: songId → song metadata
    const songMap = {};
    for (const song of songs) {
      songMap[song.id] = song;
    }

    // Merge stats with song data, preserving the sorted order from getAllStats
    const leaderboard = stats.map((stat, index) => {
      const song = songMap[stat.songId] || {};
      return {
        rank: index + 1,
        id: stat.songId,
        title: song.title || "Unknown",
        artist: song.artist || "Unknown",
        image: song.imageSrc || "",
        audio: song.audioSrc || "",
        wins: stat.wins,
        losses: stat.losses,
        totalBattles: stat.totalBattles,
        winRate: stat.winRate,
      };
    });

    return Response.json({ leaderboard });
  } catch (error) {
    console.error("[GET /api/leaderboard] Error:", error);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
