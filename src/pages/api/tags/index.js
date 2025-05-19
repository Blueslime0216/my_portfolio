import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // 작품 목록에서 모든 태그 추출
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const indexPath = path.join(dataDir, 'index.json');
    
    // 기존 태그 파일이 있으면 사용
    const tagsPath = path.join(dataDir, 'tags.json');
    if (fs.existsSync(tagsPath)) {
      const tagsContents = fs.readFileSync(tagsPath, 'utf8');
      const tagsData = JSON.parse(tagsContents);
      return res.status(200).json(tagsData);
    }
    
    // 작품 목록이 없으면 빈 배열 반환
    if (!fs.existsSync(indexPath)) {
      return res.status(200).json([]);
    }
    
    // 작품 목록에서 태그 추출
    const indexContents = fs.readFileSync(indexPath, 'utf8');
    const works = JSON.parse(indexContents);
    
    // 모든 작품에서 태그 추출 및 중복 제거
    const allTags = new Set();
    works.forEach(work => {
      if (work.tags && Array.isArray(work.tags)) {
        work.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    // 배열로 변환하고 알파벳 순으로 정렬
    const tagsArray = Array.from(allTags).sort();
    
    res.status(200).json(tagsArray);
  } catch (error) {
    console.error('태그 목록을 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '태그 목록을 가져오는데 실패했습니다' });
  }
} 