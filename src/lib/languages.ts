import colors from '../data/language-colors.json';

const languageColors: Record<string, string> = colors;

export const ALL_LANGUAGES = Object.keys(languageColors).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' }),
);

export const POPULAR_LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C++',
  'C',
  'C#',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'Zig',
  'Shell',
  'Jupyter Notebook',
  'HTML',
];

const FALLBACK_COLOR = '#a3a3a3';

export function getLanguageColor(language: string | null) {
  if (!language) {
    return FALLBACK_COLOR;
  }

  return languageColors[language] ?? FALLBACK_COLOR;
}
