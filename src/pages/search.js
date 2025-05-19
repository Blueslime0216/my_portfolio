import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import WorksGrid from '../components/gallery/WorksGrid';
import { useTags } from '../hooks/useWorks';
import styles from '../styles/Search.module.css';

export default function Search() {
  const router = useRouter();
  const { query, tag, status } = router.query;
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const { tags: allTags } = useTags();
  
  // 쿼리 파라미터 변경 시 검색어 상태 업데이트
  useEffect(() => {
    if (query) setSearchQuery(query);
    if (tag) setSelectedTag(tag);
    if (status) setSelectedStatus(status);
  }, [query, tag, status]);
  
  // 검색 실행
  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      setError(null);
      
      try {
        let url = '';
        
        if (searchQuery) {
          url = `/api/search?query=${encodeURIComponent(searchQuery)}`;
        } else if (selectedTag) {
          url = `/api/search/by-tag?tag=${encodeURIComponent(selectedTag)}`;
        } else if (selectedStatus) {
          url = `/api/search/by-status?status=${encodeURIComponent(selectedStatus)}`;
        } else {
          // 검색 조건이 없으면 모든 작품 가져오기
          url = '/api/works';
        }
        
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error('검색 결과를 가져오는데 실패했습니다');
        }
        
        const data = await res.json();
        setSearchResults(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    // 라우터가 준비되었을 때만 검색 실행
    if (router.isReady) {
      performSearch();
    }
  }, [searchQuery, selectedTag, selectedStatus, router.isReady]);
  
  // 검색 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 검색 조건에 따라 URL 파라미터 업데이트
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('query', searchQuery);
    if (selectedTag) params.set('tag', selectedTag);
    if (selectedStatus) params.set('status', selectedStatus);
    
    router.push(`/search?${params.toString()}`);
  };
  
  // 검색 필터 초기화
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedStatus('');
    router.push('/search');
  };
  
  // 현재 적용된 필터 표시
  const getActiveFilters = () => {
    const filters = [];
    
    if (searchQuery) filters.push(`검색어: "${searchQuery}"`);
    if (selectedTag) filters.push(`태그: ${selectedTag}`);
    if (selectedStatus) filters.push(`상태: ${selectedStatus}`);
    
    return filters;
  };
  
  return (
    <Layout>
      <div className={styles['search-container']}>
        <div className={styles['page-header']}>
          <h1>작품 검색</h1>
          <p className={styles.subtitle}>키워드, 태그, 상태별로 작품을 검색해보세요.</p>
        </div>
        
        <div className={styles['search-form-container']}>
          <form onSubmit={handleSubmit} className={styles['search-form']}>
            <div className={styles['search-input-group']}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                className={styles['search-input']}
              />
              <button type="submit" className={styles['search-button']}>검색</button>
            </div>
            
            <div className={styles['search-filters']}>
              <div className={styles['filter-group']}>
                <label htmlFor="tag-filter">태그:</label>
                <select
                  id="tag-filter"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className={styles['filter-select']}
                >
                  <option value="">모든 태그</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles['filter-group']}>
                <label htmlFor="status-filter">상태:</label>
                <select
                  id="status-filter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={styles['filter-select']}
                >
                  <option value="">모든 상태</option>
                  <option value="완성">완성</option>
                  <option value="진행 중">진행 중</option>
                  <option value="무기한 연기">무기한 연기</option>
                  <option value="중단">중단</option>
                </select>
              </div>
              
              {getActiveFilters().length > 0 && (
                <button 
                  type="button" 
                  onClick={clearFilters}
                  className={styles['clear-filters-button']}
                >
                  필터 초기화
                </button>
              )}
            </div>
          </form>
          
          {getActiveFilters().length > 0 && (
            <div className={styles['active-filters']}>
              <span>적용된 필터:</span>
              {getActiveFilters().map((filter, index) => (
                <span key={index} className={styles['filter-tag']}>
                  {filter}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {error && (
          <div className={styles['error-message']}>
            <p>검색 결과를 불러오는데 문제가 발생했습니다: {error}</p>
          </div>
        )}
        
        <div className={styles['search-results']}>
          <h2>
            {getActiveFilters().length > 0 
              ? `검색 결과 (${searchResults.length}개)`
              : '모든 작품'}
          </h2>
          
          {loading ? (
            <div className={styles['loading-container']}>
              <div className={styles['loading-spinner']}></div>
              <p>검색 결과 불러오는 중...</p>
            </div>
          ) : (
            <WorksGrid works={searchResults} />
          )}
        </div>
      </div>
    </Layout>
  );
} 