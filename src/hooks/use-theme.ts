import { useEffect } from 'react';
import { STORAGE_KEYS } from './use-preferences';
import { useLocalStorage } from './use-local-storage';

export type Theme = 'system' | 'light' | 'dark';

const darkQuery = '(prefers-color-scheme: dark)';

function applyTheme(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia(darkQuery).matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.theme, 'system');

  useEffect(() => {
    applyTheme(theme);

    if (theme !== 'system') {
      return;
    }

    const media = window.matchMedia(darkQuery);
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  return [theme, setTheme] as const;
}
