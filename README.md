# 🎨 My Portfolio

나만의 포트폴리오 웹사이트입니다. 다양한 프로젝트와 이력을 한눈에 볼 수 있고, 직관적인 검색과 멋진 애니메이션 효과로 누구나 쉽게 둘러볼 수 있습니다.

## 👀 주요 특징
- **프로젝트 갤러리**: 내가 만든 다양한 작품을 이미지와 함께 소개합니다.
- **타임라인**: 연도별로 정리된 나의 성장과정과 활동을 한눈에 볼 수 있습니다.
- **검색 기능**: 원하는 프로젝트나 태그를 빠르게 찾을 수 있습니다.
- **세련된 인터페이스**: 3D 효과와 부드러운 애니메이션으로 보는 재미를 더했습니다.

---

# 📚 개발자를 위한 정보

## 🛠️ 기술 스택
- **Next.js 14**
- **React 18**
- **Three.js** (3D 효과)
- **Framer Motion** (애니메이션)
- **React Markdown, Remark GFM** (마크다운 지원)
- **ESLint, TypeScript** (코드 품질 및 타입 안정성)

## 🚀 설치 및 실행 방법
1. 저장소 클론
   ```bash
   git clone [저장소 주소]
   cd my_portfolio
   ```
2. 패키지 설치
   ```bash
   npm install
   ```
3. 개발 서버 실행
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000` 접속

## 📁 폴더 구조
```
my_portfolio/
├── src/
│   ├── pages/         # 라우팅 및 주요 페이지
│   │   ├── index.js   # 메인 페이지
│   │   ├── timeline.js
│   │   ├── search.js
│   │   └── works/     # 작품 상세 페이지
│   ├── components/    # UI 컴포넌트
│   ├── styles/        # 스타일 파일
│   ├── context/       # 전역 상태 관리
│   ├── hooks/         # 커스텀 훅
│   └── utils/         # 유틸 함수
├── public/            # 정적 파일
├── .gitignore
├── package.json
└── README.md
```

## 📝 라이선스
MIT

