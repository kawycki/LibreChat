import { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button, ThemeContext, isDark } from '@librechat/client';
import { useLocalize } from '~/hooks';

export type BinaryTheme = 'light' | 'dark';

export function resolveNextBinaryTheme(currentTheme: string): BinaryTheme {
  return isDark(currentTheme) ? 'light' : 'dark';
}

export default function HeaderThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const localize = useLocalize();
  const dark = isDark(theme);
  const label = localize(dark ? 'com_nav_theme_toggle_light' : 'com_nav_theme_toggle_dark');

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={label}
      aria-pressed={dark}
      title={label}
      className={className}
      onClick={() => setTheme(resolveNextBinaryTheme(theme))}
    >
      {dark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
