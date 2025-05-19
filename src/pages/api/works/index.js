import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // data 디렉토리 내 index.json 파일 읽기
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const filePath = path.join(dataDir, 'index.json');
    
    if (!fs.existsSync(filePath)) {
      // 파일이 없으면 빈 배열 반환
      return res.status(200).json([]);
    }
    
    // JSON 파일 읽기
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // 최신 작품이 먼저 오도록 정렬
    const sortedData = data.sort((a, b) => b.updatedAt - a.updatedAt);
    
    res.status(200).json(sortedData);
  } catch (error) {
    console.error('작품 목록을 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '작품 목록을 가져오는데 실패했습니다' });
  }
} 