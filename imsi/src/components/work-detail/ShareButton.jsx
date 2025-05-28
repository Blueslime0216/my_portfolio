import React, { useState, useEffect } from 'react';
import styles from './ShareButton.module.css';

const ShareButton = () => {
  const [copied, setCopied] = useState(false);
  const [canCopy, setCanCopy] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 navigator.clipboard 확인
    if (typeof window !== 'undefined' && navigator.clipboard) {
      setCanCopy(true);
    }
  }, []);

  const handleCopyLink = () => {
    if (!canCopy) {
      alert('클립보드 접근이 불가능한 환경입니다.');
      return;
    }

    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 메시지 숨김
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert('링크 복사에 실패했습니다. 콘솔을 확인해주세요.');
    });
  };

  return (
    <button 
      onClick={handleCopyLink} 
      className={styles.shareButton}
      disabled={!canCopy && typeof window !== 'undefined'} // SSR 시 비활성화, 클라이언트에서 canCopy false시 비활성화
      title={!canCopy && typeof window !== 'undefined' ? "클립보드 사용 불가" : "현재 페이지 링크 복사"}
    >
      {copied ? '링크 복사됨!' : '페이지 링크 복사'}
    </button>
  );
};

export default ShareButton;
