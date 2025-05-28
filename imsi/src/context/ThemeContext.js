import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const ThemeContext = createContext({
  theme: 'pastel',
  setTheme: () => {}
}); // setTheme는 Provider에서 덮어쓰기

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);

  // 초기 테마 결정: 쿠키 → 시스템 선호 → 기본 pastel
  useEffect(() => {
    const savedTheme = Cookies.get('whaaay-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      return;
    }

    // 시스템 라이트 / 다크 감지
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme('pastel');
    }
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