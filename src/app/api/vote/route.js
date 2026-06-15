import { recordVote, getBattlePercent } from "../../lib/voteStore";
import { songs } from "../../lib/songs";

const VALID_IDS = new Set(songs.map(s => s.id));

export async function POST(request) {
  try {
    const body = await request.json();
    const { winnerId, loserId } = body;

    // --- Validation ---
    if (winnerId == null || loserId == null) {
      return Response.json(
        { success: false, error: "winnerId and loserId are required." },
        { status: 400 }
      );
    }

    const wId = Number(winnerId);
    const lId = Number(loserId);

    if (!VALID_IDS.has(wId) || !VALID_IDS.has(lId)) {
      return Response.json(
        { success: false, error: "Song IDs must be between 1 and 10." },
        { status: 400 }
      );
    }

    if (wId === lId) {
      return Response.json(
        { success: false, error: "winnerId and loserId must be different." },
        { status: 400 }
      );
    }

    // --- Record the vote ---
    await recordVote(wId, lId);

    // --- Calculate percentages ---
    const { winnerPercent, loserPercent } = await getBattlePercent(wId, lId);

    return Response.json({ success: true, winnerPercent, loserPercent });
  } catch (error) {
    console.error("[POST /api/vote] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
