import { useState, useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (items, itemsPerPage = 6) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  
  // 아이템 추가 로딩
  useEffect(() => {
    if (!items || items.length === 0) {
      setVisibleItems([]);
      setHasMore(false);
      return;
    }
    
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    const newVisibleItems = items.slice(startIndex, endIndex);
    
    setVisibleItems(newVisibleItems);
    setHasMore(endIndex < items.length);
  }, [items, page, itemsPerPage]);
  
  // 마지막 아이템 관찰 함수
  const lastItemRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setLoading(true);
        setTimeout(() => {
          setPage(prevPage => prevPage + 1);
          setLoading(false);
        }, 300); // 로딩 시뮬레이션
      }
    }, { threshold: 0.5 });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore]);
  
  // 초기화 함수
  const reset = useCallback(() => {
    setPage(1);
    setVisibleItems([]);
    setHasMore(true);
  }, []);
  
  return { visibleItems, hasMore, loading, lastItemRef, reset };
};

export default useInfiniteScroll; 