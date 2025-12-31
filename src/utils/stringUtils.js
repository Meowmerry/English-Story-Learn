/**
 * Normalize text for comparison by removing punctuation and converting to lowercase
 */
export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Returns a percentage score (0-100)
 */
export const calculateSimilarity = (str1, str2) => {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  // If strings are identical, return 100
  if (s1 === s2) return 100;

  // Calculate Levenshtein distance
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);

  // Convert to similarity percentage
  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.round(similarity);
};

/**
 * Calculate Levenshtein distance between two strings
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

/**
 * Highlight differences between two strings
 */
export const highlightDifferences = (correct, user) => {
  const words1 = correct.split(' ');
  const words2 = user.split(' ');
  const result = [];

  const maxLength = Math.max(words1.length, words2.length);

  for (let i = 0; i < maxLength; i++) {
    const word1 = words1[i] || '';
    const word2 = words2[i] || '';

    result.push({
      correct: word1,
      user: word2,
      isMatch: normalizeText(word1) === normalizeText(word2)
    });
  }

  return result;
};
