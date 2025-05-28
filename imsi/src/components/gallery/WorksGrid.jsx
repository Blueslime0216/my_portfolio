import React from 'react';
import { motion } from 'framer-motion';
import WorkCard from './WorkCard';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import styles from '../../styles/Home.module.css';

const WorksGrid = ({ works, itemsPerPage = 9 }) => {
  const { visibleItems, hasMore, loading, lastItemRef } = useInfiniteScroll(works, itemsPerPage);
  
  if (!works || works.length === 0) {
    return (
      <div className={styles['empty-state']}>
        <h3>등록된 작품이 없습니다</h3>
        <p>아직 포트폴리오에 작품이 등록되지 않았습니다.</p>
      </div>
    );
  }
  
  return (
    <div className={styles['works-container']}>
      <motion.div 
        className={styles['masonic-grid']}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {visibleItems.map((work, index) => (
          <WorkCard 
            key={work.id} 
            work={work} 
            index={index}
            ref={index === visibleItems.length - 1 ? lastItemRef : null}
          />
        ))}
      </motion.div>
      
      {loading && (
        <div className={styles['loading-indicator']}>
          <motion.div 
            className={styles['loading-spinner']}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <p>작품 불러오는 중...</p>
        </div>
      )}
      
      {!hasMore && works.length > 0 && (
        <motion.div 
          className={styles['end-message']}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p>모든 작품을 불러왔습니다</p>
          <div className={styles['cosmic-line']}></div>
        </motion.div>
      )}
    </div>
  );
};

export default WorksGrid; 