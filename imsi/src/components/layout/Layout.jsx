import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';

const Layout = ({ children, title = 'Whaaay? 포트폴리오 갤러리' }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`app-container ${theme}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="개인 작업물을 모아놓은 포트폴리오 갤러리입니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="main-content">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout; 