import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const WorksContext = createContext({
  works: [],
  loading: true,
  error: null,
  tags: [],
  tagsLoading: true,
  tagsError: null,
  filter: {
    tag: null,
    status: null,
    search: '',
  },
  setFilter: () => {},
  clearFilters: () => {},
});

export const WorksProvider = ({ children }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState(null);
  
  const [filter, setFilter] = useState({
    tag: null,
    status: null,
    search: '',
  });
  
  // 모든 작품 가져오기
  useEffect(() => {
    async function fetchWorks() {
      try {
        setLoading(true);
        const res = await fetch('/api/works');
        
        if (!res.ok) {
          throw new Error('작품 데이터를 불러오는데 실패했습니다');
        }
        
        const data = await res.json();
        // 최신 작품이 먼저 오도록 정렬
        const sorted = data.sort((a, b) => {
          // updatedAt이 문자열일 경우를 대비해 Number 변환
          return Number(b.updatedAt) - Number(a.updatedAt);
        });
        setWorks(sorted);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchWorks();
  }, []);
  
  // 모든 태그 가져오기
  useEffect(() => {
    async function fetchTags() {
      try {
        setTagsLoading(true);
        const res = await fetch('/api/tags');
        
        if (!res.ok) {
          throw new Error('태그 데이터를 불러오는데 실패했습니다');
        }
        
        const data = await res.json();
        setTags(data);
        setTagsLoading(false);
      } catch (err) {
        setTagsError(err.message);
        setTagsLoading(false);
      }
    }
    
    fetchTags();
  }, []);
  
  // 필터 업데이트 함수
  const updateFilter = (newFilter) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };
  
  // 필터 초기화 함수
  const clearFilters = () => {
    setFilter({
      tag: null,
      status: null,
      search: '',
    });
  };
  
  // 필터링된 작품 목록 – useMemo로 메모이제이션하여 렌더링 성능 향상
  const filteredWorks = useMemo(() => works.filter(work => {
    // 태그 필터
    if (filter.tag && (!work.tags || !work.tags.includes(filter.tag))) {
      return false;
    }
    
    // 상태 필터
    if (filter.status && work.status !== filter.status) {
      return false;
    }
    
    // 검색어 필터
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const titleMatch = work.title?.toLowerCase().includes(searchLower);
      const descMatch = work.shortDescription?.toLowerCase().includes(searchLower);
      const tagsMatch = work.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!titleMatch && !descMatch && !tagsMatch) {
        return false;
      }
    }
    
    return true;
  }), [works, filter]);
  
  return (
    <WorksContext.Provider 
      value={{
        works: filteredWorks,
        allWorks: works,
        loading,
        error,
        tags,
        tagsLoading,
        tagsError,
        filter,
        setFilter: updateFilter,
        clearFilters,
      }}
    >
      {children}
    </WorksContext.Provider>
  );
};

export const useWorks = () => useContext(WorksContext);

export default WorksContext; 