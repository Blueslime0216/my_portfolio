import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './DescriptionTab.module.css';

const DescriptionTab = ({ content }) => {
  return (
    <div className={styles.descriptionContainer}>
      {typeof content === 'string' ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      ) : (
        <p>상세 설명이 없습니다.</p>
      )}
    </div>
  );
};

export default DescriptionTab;
