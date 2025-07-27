import { Cookies, Dark } from 'quasar';

export const clearSpace = (value: string): string => {
  return value.replace(/\s+/g, '');
};

export const setTheme = (theme: 'dark' | 'light') => {
  Cookies.set('theme', theme, {
    expires: 365,
  });
  Dark.set(theme === 'dark');
};

export const getTheme = (): 'dark' | 'light' => {
  return Cookies.get('theme') === 'dark' ? 'dark' : 'light';
};

export const toggleTheme = () => {
  const newTheme = Dark.isActive ? 'light' : 'dark';
  setTheme(newTheme);
};
