import { useState, useEffect } from 'react';

// 작품 목록 가져오기
export function useWorks(limit = null) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchWorks() {
      try {
        setLoading(true);
        const res = await fetch('/api/works');
        
        if (!res.ok) {
          throw new Error('작품 데이터를 불러오는데 실패했습니다');
        }
        
        const data = await res.json();
        
        // 한정된 수의 작품만 반환하거나 모든 작품 반환
        setWorks(limit ? data.slice(0, limit) : data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchWorks();
  }, [limit]);
  
  return { works, loading, error };
}

// 특정 작품 가져오기
export function useWork(id) {
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    async function fetchWork() {
      try {
        setLoading(true);
        const res = await fetch(`/api/works/${id}`);
        
        if (!res.ok) {
          throw new Error('작품 데이터를 불러오는데 실패했습니다');
        }
        
        const data = await res.json();
        setWork(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchWork();
  }, [id]);
  
  return { work, loading, error };
}

// 유사한 작품 가져오기
export function useSimilarWorks(id, limit = 4) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    async function fetchSimilarWorks() {
      try {
        setLoading(true);
        const res = await fetch(`/api/works/similar?id=${id}&limit=${limit}`);
        
        if (!res.ok) {
          throw new Error('유사한 작품 데이터를 불러오는데 실패했습니다');
        }
        
        const data = await res.json();
        setWorks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchSimilarWorks();
  }, [id, limit]);
  
  return { works, loading, error };
}

// 태그별 작품 가져오기
export function useWorksByTag(tag) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!tag) {
      setWorks([]);
      setLoading(false);
      return;
    }
    
    async function fetchWorksByTag() {
      try {
        setLoading(true);
        const res = await fetch(`/api/search/by-tag?tag=${encodeURIComponent(tag)}`);
        
        if (!res.ok) {
          throw new Error('태그별 작품 데이터를 불러오는데 실패했습니다');
        }
        
        const data = await res.json();
        setWorks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchWorksByTag();
  }, [tag]);
  
  return { works, loading, error };
}

// 상태별 작품 가져오기
export function useWorksByStatus(status) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!status) {
      setWorks([]);
      setLoading(false);
      return;
    }
    
    async function fetchWorksByStatus() {
      try {
        setLoading(true);
        const res = await fetch(`/api/search/by-status?status=${encodeURIComponent(status)}`);
        
        if (!res.ok) {
          throw new Error('상태별 작품 데이터를 불러오는데 실패했습니다');
        }
        
        const data = await res.json();
        setWorks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchWorksByStatus();
  }, [status]);
  
  return { works, loading, error };
}

// 모든 태그 가져오기
export function useTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        const res = await fetch('/api/tags');
        
        if (!res.ok) {
          throw new Error('태그 데이터를 불러오는데 실패했습니다');
        }
        
        const data = await res.json();
        setTags(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchTags();
  }, []);
  
  return { tags, loading, error };
} 