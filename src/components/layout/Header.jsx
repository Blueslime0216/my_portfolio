import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  
  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);
  
  // 현재 활성화된 네비게이션 아이템 확인
  const isActive = (path) => {
    return router.pathname === path ? 'active' : '';
  };
  
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="header-container">
        <Link href="/" className="logo-container">
          <div className="logo-text">
            <svg className="logo-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 9.5V20.5H9V14H15V20.5H21V9.5L12 2Z" />
            </svg>
            Whaaay?
          </div>
        </Link>
        
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li>
              <Link href="/" className={isActive('/')}>
                <span className="nav-text">갤러리</span>
                <span className="nav-indicator"></span>
              </Link>
            </li>
            <li>
              <Link href="/timeline" className={isActive('/timeline')}>
                <span className="nav-text">타임라인</span>
                <span className="nav-indicator"></span>
              </Link>
            </li>
            <li>
              <Link href="/search" className={isActive('/search')}>
                <span className="nav-text">검색</span>
                <span className="nav-indicator"></span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header; 