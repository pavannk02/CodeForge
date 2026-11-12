// ──────────────────────────────────────────
// AI Matching Engine — Weighted Similarity
// ──────────────────────────────────────────
import type { Item, Match } from '@/types';

const WEIGHTS = {
  description: 0.35,
  category: 0.25,
  location: 0.25,
  date: 0.15,
};

// ─── Text Similarity (Jaccard + keyword overlap) ─────────
function tokenize(text: string): Set<string> {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'was', 'it', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'and', 'or', 'my', 'i', 'had', 'have', 'has', 'this',
    'that', 'from', 'be', 'been', 'being', 'there', 'their', 'they',
  ]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 1 && !stopWords.has(w))
  );
}

function descriptionSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  tokensA.forEach(t => { if (tokensB.has(t)) intersection++; });

  const union = new Set([...tokensA, ...tokensB]).size;
  return union > 0 ? intersection / union : 0;
}

// ─── Category Similarity ─────────────────────────────────
const RELATED_CATEGORIES: Record<string, string[]> = {
  'Electronics': ['Accessories'],
  'Accessories': ['Electronics', 'Keys'],
  'Documents / ID Cards': ['Wallets'],
  'Wallets': ['Documents / ID Cards', 'Accessories'],
  'Bags': ['Books', 'Clothing'],
  'Keys': ['Accessories'],
  'Bottles': [],
  'Books': ['Bags'],
  'Clothing': ['Bags', 'Accessories'],
  'Other': [],
};

function categorySimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (RELATED_CATEGORIES[a]?.includes(b)) return 0.5;
  return 0.1;
}

// ─── Location Similarity ─────────────────────────────────
const NEARBY_LOCATIONS: Record<string, string[]> = {
  'Main Building': ['Library', 'Canteen', 'Auditorium'],
  'Library': ['Main Building', 'Computer Lab'],
  'Canteen': ['Main Building', 'Sports Ground', 'Parking Area'],
  'Computer Lab': ['Library', 'Laboratory'],
  'Laboratory': ['Computer Lab', 'Main Building'],
  'Auditorium': ['Main Building'],
  'Sports Ground': ['Canteen', 'Parking Area'],
  'Parking Area': ['Canteen', 'Sports Ground', 'Hostel'],
  'Hostel': ['Parking Area', 'Canteen'],
  'Other': [],
};

function locationSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (NEARBY_LOCATIONS[a]?.includes(b)) return 0.6;
  return 0.15;
}

// ─── Date Similarity ─────────────────────────────────────
function dateSimilarity(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  const diffDays = Math.abs(a - b) / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return 1;
  if (diffDays <= 1) return 0.9;
  if (diffDays <= 3) return 0.7;
  if (diffDays <= 7) return 0.4;
  if (diffDays <= 14) return 0.2;
  return 0.05;
}

// ─── Build Match Reasons ─────────────────────────────────
function buildReasons(
  descScore: number,
  catScore: number,
  locScore: number,
  dateScore: number,
  lost: Item,
  found: Item
): string[] {
  const reasons: string[] = [];

  if (catScore === 1) reasons.push(`Same category: ${lost.category}`);
  else if (catScore >= 0.5) reasons.push(`Related categories: ${lost.category} ↔ ${found.category}`);

  if (locScore === 1) reasons.push(`Same location: ${lost.location}`);
  else if (locScore >= 0.5) reasons.push(`Nearby locations: ${lost.location} ↔ ${found.location}`);

  if (dateScore >= 0.7) reasons.push('Dates are very close');
  else if (dateScore >= 0.4) reasons.push('Dates within a week');

  if (descScore >= 0.4) reasons.push('Strong description overlap');
  else if (descScore >= 0.2) reasons.push('Some description similarity');

  if (lost.colour.toLowerCase() === found.colour.toLowerCase()) {
    reasons.push(`Matching colour: ${lost.colour}`);
  }

  return reasons;
}

// ─── Main Matching Function ──────────────────────────────
export function calculateMatch(lost: Item, found: Item): Omit<Match, 'id' | 'created_at'> {
  const descScore = descriptionSimilarity(
    `${lost.item_name} ${lost.description} ${lost.colour}`,
    `${found.item_name} ${found.description} ${found.colour}`
  );
  const catScore = categorySimilarity(lost.category, found.category);
  const locScore = locationSimilarity(lost.location, found.location);
  const dateScore = dateSimilarity(lost.item_date, found.item_date);

  const similarity_score = Math.round(
    (descScore * WEIGHTS.description +
      catScore * WEIGHTS.category +
      locScore * WEIGHTS.location +
      dateScore * WEIGHTS.date) *
      100
  );

  return {
    lost_item_id: lost.id,
    found_item_id: found.id,
    similarity_score,
    description_score: Math.round(descScore * 100),
    category_score: Math.round(catScore * 100),
    location_score: Math.round(locScore * 100),
    date_score: Math.round(dateScore * 100),
    match_reasons: buildReasons(descScore, catScore, locScore, dateScore, lost, found),
    status: 'PENDING',
  };
}

/**
 * Find all matches for a given item against a list of opposite-type items.
 * Returns matches sorted by score descending, filtered by min threshold.
 */
export function findMatches(
  item: Item,
  candidates: Item[],
  minScore = 40
): Omit<Match, 'id' | 'created_at'>[] {
  const oppositeType = item.type === 'LOST' ? 'FOUND' : 'LOST';
  const filtered = candidates.filter(
    c => c.type === oppositeType && c.status === 'ACTIVE'
  );

  return filtered
    .map(c =>
      item.type === 'LOST'
        ? calculateMatch(item, c)
        : calculateMatch(c, item)
    )
    .filter(m => m.similarity_score >= minScore)
    .sort((a, b) => b.similarity_score - a.similarity_score);
}

/**
 * Classify a match score
 */
export function classifyMatch(score: number): 'high' | 'medium' | 'low' | 'none' {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'low';
  return 'none';
}

export function matchColorClass(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-gray-400';
}

