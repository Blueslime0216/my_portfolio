import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { useWork, useSimilarWorks } from '../../hooks/useWorks';
import Link from 'next/link';
import styles from '../../styles/WorkDetail.module.css';
import WorkCard from '../../components/gallery/WorkCard';
import { useTheme } from '../../context/ThemeContext';
import DescriptionTab from '../../components/work-detail/DescriptionTab';
import ShareButton from '../../components/work-detail/ShareButton';

export default function WorkDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { work, loading: workLoading, error: workError } = useWork(id);
  const { works: similarWorks, loading: similarLoading } = useSimilarWorks(id);
  
  if (workLoading) {
    return (
      <Layout>
        <div className={styles['loading-container']}>
          <div className={styles['loading-spinner']}></div>
          <p>작품 정보를 불러오는 중...</p>
        </div>
      </Layout>
    );
  }
  
  if (workError || !work) {
    return (
      <Layout>
        <div className={styles['error-container']}>
          <h2>작품을 찾을 수 없습니다</h2>
          <p>{workError || '요청한 작품이 존재하지 않습니다'}</p>
          <Link href="/" className={styles['btn-primary']}>
            갤러리로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }
  
  // 작업 기간 포맷팅
  const formatDate = (timestamp) => {
    if (!timestamp) return '미정';
    return new Date(timestamp).toLocaleDateString('ko-KR');
  };
  
  // 작품 상태에 따른 클래스
  const statusClass = {
    '완성': styles['status-complete'],
    '진행 중': styles['status-in-progress'],
    '무기한 연기': styles['status-postponed'],
    '중단': styles['status-stopped']
  };

  // 작품 진행률에 따른 색상 계산
  const getProgressColor = () => {
    if (work.progressPercentage >= 80) return '#38c986';
    if (work.progressPercentage >= 40) return '#5680f9';
    if (work.progressPercentage >= 20) return '#f7aa4f';
    return '#f25767';
  };

  // 상세 JSON과 호환성을 위한 보조 변환 ----------------------
  // description 필드가 없으면 fullDescription 사용
  const descriptionText = work.description || work.fullDescription;

  // progressPercentage 문자열 → 숫자 변환
  const progress = Number(work.progressPercentage);

  // ratings 객체가 없으면 개별 rating 필드에서 구성
  const ratingsData = work.ratings || {
    quality: Number(work.qualityRating) || 0,
    satisfaction: Number(work.satisfactionRating) || 0,
    difficulty: Number(work.difficultyRating) || 0,
  };

  return (
    <Layout>
      <div className={styles['work-detail-container']}>
        {/* 헤더 영역 */}
        <div className={styles['work-detail-header']}>
          <Link href="/" className={styles['back-link']}>
            &larr; 갤러리로 돌아가기
          </Link>
          
          <div className={styles['title-area']}>
            <div className={styles['title-status-group']}>
              <h1 className={styles['work-title']}>{work.title}</h1>
              {work.status && (
                <span className={`${styles['status-badge']} ${statusClass[work.status]}`}>
                  {work.status}
                </span>
              )}
            </div>
            <p className={styles['work-description']}>{work.shortDescription}</p>
          </div>
        </div>

        <div className={styles['main-content-container']}>
          {/* 히어로 이미지 영역 */}
          <div className={styles['hero-image-container']}>
            {((work.media && work.media.thumbnail) || work.thumbnail) && (
              <img 
                src={(work.media && work.media.thumbnail) || work.thumbnail} 
                alt={work.title}
                className={styles['hero-image']}
              />
            )}
            
            {/* 태그 영역 */}
            {work.tags && work.tags.length > 0 && (
              <div className={styles['work-tags']}>
                {work.tags.map((tag, index) => (
                  <Link 
                    href={`/search?tag=${encodeURIComponent(tag)}`} 
                    key={index}
                    className={styles.tag}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            {/* 공유 버튼 추가 */}
            <div className={styles['share-button-container']}>
              <ShareButton />
            </div>
          </div>
          
          {/* 하단 내용 영역 */}
          <div className={styles['work-content']}>
            {/* 탭 네비게이션 */}
            <div className={styles['tabs-container']}>
              <div className={styles['tabs-nav']}>
                <button 
                  className={`${styles['tab-btn']} ${activeTab === 'overview' ? styles['active'] : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  개요
                </button>
                {descriptionText && (
                  <button 
                    className={`${styles['tab-btn']} ${activeTab === 'description' ? styles['active'] : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    상세 설명
                  </button>
                )}
                {work.media && work.media.items && work.media.items.length > 0 && (
                  <button 
                    className={`${styles['tab-btn']} ${activeTab === 'gallery' ? styles['active'] : ''}`}
                    onClick={() => setActiveTab('gallery')}
                  >
                    갤러리
                  </button>
                )}
              </div>
              
              {/* 탭 컨텐츠 */}
              <div className={styles['tab-content']}>
                {/* 개요 탭 */}
                {activeTab === 'overview' && (
                  <div className={styles['overview-content']}>
                    <div className={styles['info-card']}>
                      <h3>프로젝트 정보</h3>
                      
                      <div className={styles['progress-section']}>
                        <div className={styles['progress-header']}>
                          <span>진행률</span>
                          <span>{progress}%</span>
                        </div>
                        <div className={styles['progress-bar']}>
                          <div 
                            className={styles['progress-fill']} 
                            style={{ 
                              width: `${progress}%`,
                              backgroundColor: getProgressColor()
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className={styles['info-grid']}>
                        <div className={styles['info-item']}>
                          <span className={styles['info-label']}>시작일</span>
                          <span className={styles['info-value']}>{formatDate(work.workPeriod?.startDate)}</span>
                        </div>
                        <div className={styles['info-item']}>
                          <span className={styles['info-label']}>종료일</span>
                          <span className={styles['info-value']}>{formatDate(work.workPeriod?.endDate)}</span>
                        </div>
                        {work.workPeriod?.totalHours && (
                          <div className={styles['info-item']}>
                            <span className={styles['info-label']}>총 소요 시간</span>
                            <span className={styles['info-value']}>{work.workPeriod.totalHours}시간</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {ratingsData && (
                      <div className={styles['info-card']}>
                        <h3>평가</h3>
                        <div className={styles['ratings-container']}>
                          <div className={styles['rating-item']}>
                            <div className={styles['rating-header']}>
                              <span className={styles['rating-label']}>품질</span>
                              <span className={styles['rating-value']}>{ratingsData.quality}</span>
                            </div>
                            <div className={styles['rating-bar-container']}>
                              <div 
                                className={styles['rating-bar']} 
                                style={{width: `${(ratingsData.quality / 5) * 100}%`}}
                              ></div>
                            </div>
                          </div>
                          
                          <div className={styles['rating-item']}>
                            <div className={styles['rating-header']}>
                              <span className={styles['rating-label']}>만족도</span>
                              <span className={styles['rating-value']}>{ratingsData.satisfaction}</span>
                            </div>
                            <div className={styles['rating-bar-container']}>
                              <div 
                                className={styles['rating-bar']} 
                                style={{width: `${(ratingsData.satisfaction / 5) * 100}%`}}
                              ></div>
                            </div>
                          </div>
                          
                          <div className={styles['rating-item']}>
                            <div className={styles['rating-header']}>
                              <span className={styles['rating-label']}>난이도</span>
                              <span className={styles['rating-value']}>{ratingsData.difficulty}</span>
                            </div>
                            <div className={styles['rating-bar-container']}>
                              <div 
                                className={styles['rating-bar']} 
                                style={{width: `${(ratingsData.difficulty / 5) * 100}%`}}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {work.links && work.links.length > 0 && (
                      <div className={styles['info-card']}>
                        <h3>관련 링크</h3>
                        <div className={styles['links-list']}>
                          {work.links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${styles['link-item']} ${styles[link.type]}`}
                            >
                              {link.label || (link.type === 'github' ? 'GitHub 레포지토리' : 
                                             link.type === 'website' ? '프로젝트 웹사이트' : link.type)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 상세 설명 탭 */}
                {activeTab === 'description' && descriptionText && (
                  <DescriptionTab content={descriptionText} />
                )}
                
                {/* 갤러리 탭 */}
                {activeTab === 'gallery' && work.media && work.media.items && work.media.items.length > 0 && (
                  <div className={styles['gallery-content']}>
                    <div className={styles['media-grid']}>
                      {work.media.items.map((item, index) => (
                        <div key={index} className={styles['media-item']}>
                          {item.type === 'image' && (
                            <img 
                              src={item.url} 
                              alt={item.caption || `이미지 ${index + 1}`}
                              className={styles['gallery-image']}
                              loading="lazy"
                            />
                          )}
                          {item.type === 'video' && (
                            <video src={item.url} controls className={styles['gallery-video']}></video>
                          )}
                          {item.type === 'youtube' && (
                            <iframe
                              src={`https://www.youtube.com/embed/${item.url.split('v=')[1]}`}
                              title={item.caption || "YouTube video"}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className={styles['youtube-frame']}
                              loading="lazy"
                            ></iframe>
                          )}
                          {item.caption && <p className={styles.caption}>{item.caption}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 관련 작품 */}
            {!similarLoading && similarWorks && similarWorks.length > 0 && (
              <div className={styles['related-works']}>
                <h3>비슷한 작품</h3>
                <div className={styles['related-grid']}>
                  {similarWorks.slice(0, 3).map((relatedWork) => (
                    <WorkCard key={relatedWork.id} work={relatedWork} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}