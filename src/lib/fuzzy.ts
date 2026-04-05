// src/lib/fuzzy.ts
// Lightweight fuzzy matching — no external dependencies needed.
// Used to rank search suggestions when the user misspells or phonetically
// approximates a medication/condition name.

/**
 * Levenshtein edit distance between two strings.
 * Handles insertions, deletions, and substitutions.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Simple phonetic normaliser — collapses common sound-alike letter groups
 * (e.g. ph→f, ck→k, double letters) so "parasetamol" ≈ "paracetamol".
 * NOT a full Soundex/Metaphone but extremely fast with no dependencies.
 */
export function phonetify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ph/g, 'f')
    .replace(/ck/g, 'k')
    .replace(/qu/g, 'k')
    .replace(/x/g, 'ks')
    .replace(/[aeiou]+/g, 'a') // collapse vowels
    .replace(/(.)\1+/g, '$1')   // collapse repeated chars
    .replace(/[^a-z]/g, '');
}

/**
 * Returns a fuzzy similarity score in range [0, 1] where 1 = perfect match.
 * Combines:
 *   - Exact prefix bonus
 *   - Levenshtein ratio on the query vs. each word in the candidate
 *   - Phonetic similarity bonus
 */
export function fuzzyScore(query: string, candidate: string): number {
  const q = query.toLowerCase().trim();
  const c = candidate.toLowerCase().trim();

  if (!q || !c) return 0;

  // Exact prefix: highest priority
  if (c.startsWith(q)) return 1.0;

  // Word-level prefix match
  const words = c.split(/\s+/);
  if (words.some(w => w.startsWith(q))) return 0.92;

  // Substring anywhere
  if (c.includes(q)) return 0.85;

  // Check each word in the candidate with Levenshtein
  const wordScores = words.map(word => {
    const maxLen = Math.max(q.length, word.length);
    if (maxLen === 0) return 0;
    const dist = levenshtein(q, word.slice(0, q.length + 2)); // window
    const ratio = 1 - dist / maxLen;
    return ratio;
  });
  const bestWordScore = Math.max(...wordScores);

  // Phonetic similarity on whole string
  const qPhon = phonetify(q);
  const cPhon = phonetify(c);
  const phonLen = Math.max(qPhon.length, cPhon.length);
  const phonDist = phonLen > 0 ? levenshtein(qPhon, cPhon.slice(0, qPhon.length + 2)) / phonLen : 1;
  const phoneticBonus = 1 - phonDist;

  // Weighted combination
  return Math.max(bestWordScore * 0.7 + phoneticBonus * 0.3, 0);
}

/**
 * Given a query and a list of objects, returns them sorted by fuzzy relevance.
 * `getStrings` should return all searchable strings for a given item (name, brands, generic).
 * Items with score below `threshold` are filtered out.
 */
export function fuzzySort<T>(
  query: string,
  items: T[],
  getStrings: (item: T) => string[],
  threshold = 0.35
): T[] {
  if (!query || !items.length) return items;

  const scored = items.map(item => {
    const strings = getStrings(item);
    const best = Math.max(...strings.map(s => fuzzyScore(query, s)));
    return { item, score: best };
  });

  return scored
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
