import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '../../styles/Home.module.css';

const WorkCard = ({ work, index, forwardedRef }) => {
  // 작품이 없으면 렌더링하지 않음
  if (!work) return null;
  
  // 애니메이션 변수
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };
  
  // 상태별 배지 색상 
  const statusColor = {
    '완성': styles['status-complete'],
    '진행 중': styles['status-in-progress'],
    '무기한 연기': styles['status-postponed'],
    '중단': styles['status-stopped']
  };
  
  return (
    <motion.div 
      className={`${styles['work-card']} ${work.status ? statusColor[work.status] : ''}`}
      variants={variants}
      ref={forwardedRef}
    >
      <Link href={`/works/${work.id}`}>
        <div className={styles['work-card-inner']}>
          <div className={styles['work-thumbnail']}>
            {(((work.media && work.media.thumbnail && work.media.thumbnail.trim()) || (work.thumbnail && work.thumbnail.trim()))) ? (
              <img 
                src={((work.media && work.media.thumbnail && work.media.thumbnail.trim()) || (work.thumbnail && work.thumbnail.trim()))} 
                alt={work.title}
                className={styles['thumbnail-img']}
              />
            ) : (
              <div className={styles['no-thumbnail']}>
                <span className={styles['cosmic-icon']}>✧</span>
                <span>이미지 없음</span>
              </div>
            )}
            
            {work.status && (
              <div className={styles['status-badge']}>
                {work.status}
              </div>
            )}
          </div>
          
          <div className={styles['work-info']}>
            <h3 className={styles['work-title']}>{work.title}</h3>
            <p className={styles['work-description']}>{work.shortDescription}</p>
            
            {work.tags && work.tags.length > 0 && (
              <div className={styles['work-tags']}>
                {work.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {tag}
                  </span>
                ))}
                {work.tags.length > 3 && (
                  <span className={styles['tag-more']}>+{work.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.forwardRef((props, ref) => (
  <WorkCard {...props} forwardedRef={ref} />
)); 