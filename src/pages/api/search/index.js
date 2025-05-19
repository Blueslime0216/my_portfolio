import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ message: '검색어가 지정되지 않았습니다' });
  }
  
  try {
    // 모든 작품 목록 가져오기
    const indexPath = path.join(process.cwd(), 'public', 'data', 'index.json');
    
    if (!fs.existsSync(indexPath)) {
      return res.status(200).json([]);
    }
    
    const indexContents = fs.readFileSync(indexPath, 'utf8');
    const allWorks = JSON.parse(indexContents);
    
    // 검색어로 작품 필터링 (제목, 짧은 설명, 태그 포함)
    const searchLower = query.toLowerCase();
    const filteredWorks = allWorks.filter(work => {
      const titleMatch = work.title?.toLowerCase().includes(searchLower);
      const descMatch = work.shortDescription?.toLowerCase().includes(searchLower);
      const tagsMatch = work.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      return titleMatch || descMatch || tagsMatch;
    });
    
    // 최신 작품이 먼저 오도록 정렬
    const sortedWorks = filteredWorks.sort((a, b) => b.updatedAt - a.updatedAt);
    
    res.status(200).json(sortedWorks);
  } catch (error) {
    console.error('검색 결과를 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '검색 결과를 가져오는데 실패했습니다' });
  }
} 