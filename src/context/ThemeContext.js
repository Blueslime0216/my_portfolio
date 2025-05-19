import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const ThemeContext = createContext({
  theme: 'pastel',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  // 쿠키에서 테마 불러오기 (최초 1회)
  useEffect(() => {
    const savedTheme = Cookies.get('whaaay-theme');
    setTheme(savedTheme || 'pastel');
  }, []);

  // 테마 변경시 쿠키에 저장 및 HTML/body에 테마 클래스 적용
  useEffect(() => {
    if (!theme) return;
    Cookies.set('whaaay-theme', theme, { expires: 365 });
    document.documentElement.classList.remove('light', 'dark', 'pastel');
    document.body.classList.remove('light', 'dark', 'pastel');
    document.documentElement.classList.add(theme);
    document.body.classList.add(theme);
  }, [theme]);

  // theme가 결정되기 전에는 아무것도 렌더하지 않음
  if (!theme) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 