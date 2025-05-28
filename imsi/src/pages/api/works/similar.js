import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id, limit = 4 } = req.query;
  
  try {
    // 모든 작품 목록 가져오기
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const indexPath = path.join(dataDir, 'index.json');
    
    if (!fs.existsSync(indexPath)) {
      return res.status(200).json([]);
    }
    
    const indexContents = fs.readFileSync(indexPath, 'utf8');
    const allWorks = JSON.parse(indexContents);
    
    // 현재 작품 찾기
    const currentWork = allWorks.find(work => work.id === id);
    
    if (!currentWork) {
      return res.status(404).json({ message: '작품을 찾을 수 없습니다' });
    }
    
    // 현재 작품 제외
    const otherWorks = allWorks.filter(work => work.id !== id);
    
    // 태그 기반으로 유사도 계산
    const currentTags = currentWork.tags || [];
    
    const similarWorks = otherWorks
      .map(work => {
        const workTags = work.tags || [];
        const commonTags = currentTags.filter(tag => workTags.includes(tag));
        return {
          ...work,
          similarity: commonTags.length
        };
      })
      .filter(work => work.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity || b.updatedAt - a.updatedAt)
      .slice(0, Number(limit));
    
    // 유사한 작품이 없거나 부족한 경우 랜덤으로 몇 개 추가
    if (similarWorks.length < Number(limit)) {
      const remainingCount = Number(limit) - similarWorks.length;
      const remainingWorks = otherWorks
        .filter(work => !similarWorks.some(sw => sw.id === work.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingCount);
      
      similarWorks.push(...remainingWorks);
    }
    
    res.status(200).json(similarWorks);
  } catch (error) {
    console.error('유사 작품을 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '유사 작품을 가져오는데 실패했습니다' });
  }
} 