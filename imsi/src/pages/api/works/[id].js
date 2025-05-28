import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;
  
  try {
    // 작품 목록 데이터 읽기
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const indexPath = path.join(dataDir, 'index.json');
    
    if (!fs.existsSync(indexPath)) {
      return res.status(404).json({ message: '작품 목록을 찾을 수 없습니다' });
    }
    
    // 작품 목록에서 해당 ID의 작품 찾기
    const indexContents = fs.readFileSync(indexPath, 'utf8');
    const allWorks = JSON.parse(indexContents);
    const work = allWorks.find(w => w.id === id);
    
    if (!work) {
      return res.status(404).json({ message: '해당 ID의 작품을 찾을 수 없습니다' });
    }
    
    // 상세 정보 파일이 있는지 확인
    const workDetailPath = path.join(dataDir, 'works', `${id}.json`);
    
    // 상세 정보 파일이 있으면 기본 정보와 병합
    if (fs.existsSync(workDetailPath)) {
      const detailContents = fs.readFileSync(workDetailPath, 'utf8');
      const detailData = JSON.parse(detailContents);
      
      // 기본 작품 정보와 상세 정보 병합
      const fullWorkData = { ...work, ...detailData };
      res.status(200).json(fullWorkData);
    } else {
      // 상세 정보가 없으면 기본 정보만 추가 필드와 함께 반환
      // 예시 데이터를 추가해서 반환
      const workWithDetails = {
        ...work,
        fullDescription: work.shortDescription + "에 대한 더 자세한 설명입니다. 이 작품에 대한 상세 정보는 아직 등록되지 않았습니다.",
        workPeriod: {
          startDate: work.createdAt,
          endDate: work.status === '완성' ? work.updatedAt : null,
          totalHours: Math.floor(Math.random() * 100) + 20
        },
        ratings: {
          quality: (Math.random() * 2 + 3).toFixed(1),
          difficulty: (Math.random() * 2 + 2).toFixed(1),
          satisfaction: (Math.random() * 2 + 3).toFixed(1)
        },
        feedback: "이 작품에 대한 피드백과 회고가 아직 작성되지 않았습니다.",
        links: [
          {
            type: "github",
            url: "https://github.com/example/project-repo"
          },
          {
            type: "website",
            url: "https://example.com/project-demo"
          }
        ],
        media: {
          thumbnail: (work.media && work.media.thumbnail) || work.thumbnail || "https://via.placeholder.com/800x600?text=No+Image",
          items: [
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1420&auto=format&fit=crop&ixlib=rb-4.0.3",
              caption: "작품 스크린샷 1"
            },
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3",
              caption: "작품 스크린샷 2"
            }
          ]
        }
      };
      
      res.status(200).json(workWithDetails);
    }
  } catch (error) {
    console.error('작품 정보를 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '작품 정보를 가져오는데 실패했습니다' });
  }
} 