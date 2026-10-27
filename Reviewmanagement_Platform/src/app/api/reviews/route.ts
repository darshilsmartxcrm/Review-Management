import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const filePath = path.join(process.cwd(), 'src', 'data', 'used_reviews.json');
const tmpReviewsPath = path.join(os.tmpdir(), 'review_hub_used_reviews.json');
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

interface UsedReviewEntry {
  clientId: string;
  reviewText: string;
  normalized: string;
  timestamp: number;
}

// In-memory fallback
let memoryUsedReviews: UsedReviewEntry[] = [];

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
}

function readUsedReviewsFromFile(): UsedReviewEntry[] {
  try {
    const activePath = fs.existsSync(tmpReviewsPath)
      ? tmpReviewsPath
      : fs.existsSync(filePath)
      ? filePath
      : null;

    if (activePath) {
      const data = fs.readFileSync(activePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const now = Date.now();
        // Purge records older than 24 hours
        const active = parsed.filter(
          (entry: UsedReviewEntry) => entry && entry.timestamp && now - entry.timestamp <= TWENTY_FOUR_HOURS_MS
        );
        memoryUsedReviews = active;
        // If purged some old entries, sync back to file
        if (active.length !== parsed.length) {
          try {
            fs.writeFileSync(activePath, JSON.stringify(active, null, 2), 'utf-8');
          } catch {}
        }
        return active;
      }
    }
  } catch (err) {
    console.error('Error reading used_reviews.json:', err);
  }
  return memoryUsedReviews;
}

function writeUsedReviewsToFile(entries: UsedReviewEntry[]): boolean {
  try {
    memoryUsedReviews = entries;
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');
    return true;
  } catch (err) {
    try {
      fs.writeFileSync(tmpReviewsPath, JSON.stringify(entries, null, 2), 'utf-8');
      return true;
    } catch (tmpErr) {
      console.error('Error writing used_reviews fallback:', tmpErr);
    }
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  const allActive = readUsedReviewsFromFile();

  if (clientId) {
    const clientReviews = allActive
      .filter((entry) => entry.clientId === clientId)
      .map((entry) => entry.reviewText);

    return NextResponse.json({
      success: true,
      clientId,
      usedReviews: clientReviews,
      count: clientReviews.length
    });
  }

  return NextResponse.json({
    success: true,
    totalActive: allActive.length,
    entries: allActive
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, reviewText } = body;

    if (!clientId || !reviewText || typeof reviewText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'clientId and reviewText are required' },
        { status: 400 }
      );
    }

    const normalized = normalizeText(reviewText);
    const now = Date.now();
    const current = readUsedReviewsFromFile();

    // Remove duplicates or old instances of the same review for this client
    const filtered = current.filter(
      (entry) => !(entry.clientId === clientId && entry.normalized === normalized)
    );

    const newEntry: UsedReviewEntry = {
      clientId,
      reviewText: reviewText.trim(),
      normalized,
      timestamp: now
    };

    const updated = [newEntry, ...filtered];
    writeUsedReviewsToFile(updated);

    return NextResponse.json({
      success: true,
      message: 'Review locked across all users for 24 hours',
      lockedUntil: now + TWENTY_FOUR_HOURS_MS,
      entry: newEntry
    });
  } catch (err) {
    console.error('API /api/reviews POST error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
