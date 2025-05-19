/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // 이미지 최적화 비활성화
    domains: [
      'img.youtube.com',  // 유튜브 썸네일 이미지를 위한 도메인 설정
      'images.unsplash.com',  // Unsplash 이미지
      'picsum.photos',  // Lorem Picsum 이미지
      'fastly.picsum.photos',  // Lorem Picsum 이미지 CDN
      'placehold.co',  // 플레이스홀더 이미지
      'via.placeholder.com',  // 플레이스홀더 이미지
      'placekitten.com',  // 플레이스홀더 이미지
      'dummyimage.com',  // 더미 이미지
      'avatars.githubusercontent.com',  // GitHub 아바타
      'localhost' // 로컬 개발 환경
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig; 