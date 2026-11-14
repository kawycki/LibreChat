import '@testing-library/jest-dom';
import React from 'react';
import { ThemeContext } from '@librechat/client';
import { fireEvent, render, screen } from '@testing-library/react';
import HeaderThemeToggle from '../HeaderThemeToggle';

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => key,
}));

function renderToggle(theme: string, setTheme = jest.fn()) {
  render(
    <ThemeContext.Provider
      value={
        {
          theme,
          setTheme,
          resolvedMode: theme === 'dark' ? 'dark' : 'light',
          highContrast: false,
          setThemeRGB: () => undefined,
          setThemeDefinition: () => undefined,
          setThemeName: () => undefined,
          resetTheme: () => undefined,
        } as React.ContextType<typeof ThemeContext>
      }
    >
      <HeaderThemeToggle />
    </ThemeContext.Provider>,
  );
  return { setTheme };
}

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation((media: string) => ({
    matches: false,
    media,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

describe('HeaderThemeToggle', () => {
  it('switches from light to dark', () => {
    const { setTheme } = renderToggle('light');
    fireEvent.click(screen.getByRole('button', { name: 'com_nav_theme_toggle_dark' }));
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('switches from dark to light', () => {
    const { setTheme } = renderToggle('dark');
    fireEvent.click(screen.getByRole('button', { name: 'com_nav_theme_toggle_light' }));
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('resolves system theme via matchMedia before toggling', () => {
    (window.matchMedia as jest.Mock).mockImplementation((media: string) => ({
      matches: true,
      media,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { setTheme } = renderToggle('system');
    fireEvent.click(screen.getByRole('button', { name: 'com_nav_theme_toggle_light' }));
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('exposes accessible label and aria-pressed state', () => {
    renderToggle('dark');
    const button = screen.getByRole('button', { name: 'com_nav_theme_toggle_light' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
