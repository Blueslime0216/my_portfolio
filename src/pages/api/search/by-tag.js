import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { tag } = req.query;
  
  if (!tag) {
    return res.status(400).json({ message: '태그가 지정되지 않았습니다' });
  }
  
  try {
    // 모든 작품 목록 가져오기
    const indexPath = path.join(process.cwd(), 'public', 'data', 'index.json');
    
    if (!fs.existsSync(indexPath)) {
      return res.status(200).json([]);
    }
    
    const indexContents = fs.readFileSync(indexPath, 'utf8');
    const allWorks = JSON.parse(indexContents);
    
    // 지정된 태그를 포함하는 작품만 필터링
    const filteredWorks = allWorks.filter(work => 
      work.tags && Array.isArray(work.tags) && work.tags.includes(tag)
    );
    
    // 최신 작품이 먼저 오도록 정렬
    const sortedWorks = filteredWorks.sort((a, b) => b.updatedAt - a.updatedAt);
    
    res.status(200).json(sortedWorks);
  } catch (error) {
    console.error('태그별 작품을 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '태그별 작품을 가져오는데 실패했습니다' });
  }
} 