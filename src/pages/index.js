import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import WorksGrid from '../components/gallery/WorksGrid';
import { useWorks } from '../context/WorksContext';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { works, loading, error } = useWorks();
  
  return (
    <Layout>
      <div className={styles['home-container']}>
        <motion.div 
          className={styles['page-header']}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1>Whaaay?</h1>
          <p className={styles.subtitle}>푸슬이 작업한 모든 작품들을 담을 갤러리입니다.</p>
        </motion.div>
        
        {error && (
          <motion.div 
            className={styles['error-message']}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>작품을 불러오는데 문제가 발생했습니다: {error}</p>
          </motion.div>
        )}
        
        {loading ? (
          <motion.div 
            className={styles['loading-container']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={styles['loading-spinner']}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <p>작품을 탐색하는 중...</p>
          </motion.div>
        ) : (
          <WorksGrid works={works} />
        )}
      </div>
    </Layout>
  );
} 