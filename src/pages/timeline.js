import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import { useWorks } from '../hooks/useWorks';
import styles from '../styles/Timeline.module.css';

export default function Timeline() {
  const { works, loading, error } = useWorks();
  const router = useRouter();
  
  // 작업 기간 정보가 있는 작품만 필터링
  const timelineWorks = !loading && works
    ? works.filter(work => 
        work.workPeriod && 
        (work.workPeriod.startDate || work.workPeriod.endDate)
      )
    : [];
  
  // 시간순으로 정렬 (종료일 기준 내림차순, 없으면 시작일 기준)
  const sortedWorks = [...timelineWorks].sort((a, b) => {
    const aDate = a.workPeriod.endDate || a.workPeriod.startDate;
    const bDate = b.workPeriod.endDate || b.workPeriod.startDate;
    
    if (!aDate) return 1;
    if (!bDate) return -1;
    
    return bDate - aDate;
  });
  
  // 연도별로 그룹화
  const groupedByYear = sortedWorks.reduce((groups, work) => {
    const endDate = work.workPeriod.endDate;
    const startDate = work.workPeriod.startDate;
    const date = endDate || startDate;
    
    if (!date) return groups;
    
    const year = new Date(date).getFullYear();
    
    if (!groups[year]) {
      groups[year] = [];
    }
    
    groups[year].push(work);
    return groups;
  }, {});
  
  // 연도 배열 (내림차순)
  const years = Object.keys(groupedByYear).sort((a, b) => b - a);
  
  // 작업 상태에 따른 클래스
  const statusClass = {
    '완성': styles['status-complete'],
    '진행 중': styles['status-in-progress'],
    '무기한 연기': styles['status-postponed'],
    '중단': styles['status-stopped']
  };
  
  // 날짜 포맷팅
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <Layout>
      <div className={styles['timeline-container']}>
        <div className={styles['page-header']}>
          <h1>작업 타임라인</h1>
          <p className={styles.subtitle}>시간순으로 정렬된 작업물들을 확인해보세요.</p>
        </div>
        
        {error && (
          <div className={styles['error-message']}>
            <p>타임라인을 불러오는데 문제가 발생했습니다: {error}</p>
          </div>
        )}
        
        {loading ? (
          <div className={styles['loading-container']}>
            <div className={styles['loading-spinner']}></div>
            <p>타임라인 불러오는 중...</p>
          </div>
        ) : sortedWorks.length === 0 ? (
          <div className={styles['empty-state']}>
            <h3>아직 등록된 타임라인 정보가 없습니다</h3>
            <p>작업 기간 정보가 있는 작품이 등록되면 이곳에 표시됩니다.</p>
            <Link href="/" className={styles['btn-primary']}>
              갤러리로 돌아가기
            </Link>
          </div>
        ) : (
          <div className={styles.timeline}>
            {years.map(year => (
              <div key={year} className={styles['timeline-year']}>
                <div className={styles['year-marker']}>
                  <span>{year}</span>
                </div>
                
                <div className={styles['timeline-items']}>
                  {groupedByYear[year].map(work => (
                    <div key={work.id} className={styles['timeline-item']}>
                      <div className={styles['timeline-item-dot']}></div>
                      
                      <div 
                        className={`${styles['timeline-card']} ${work.status ? statusClass[work.status] : ''}`}
                        onClick={() => router.push(`/works/${work.id}`)}
                      >
                        <div className={styles['timeline-date']}>
                          {work.workPeriod.startDate && (
                            <span className={styles['start-date']}>
                              시작: {formatDate(work.workPeriod.startDate)}
                            </span>
                          )}
                          {work.workPeriod.endDate && (
                            <span className={styles['end-date']}>
                              완료: {formatDate(work.workPeriod.endDate)}
                            </span>
                          )}
                        </div>
                        
                        <div className={styles['timeline-thumbnail']}>
                          {((work.media && work.media.thumbnail) || work.thumbnail) ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                              <Image
                                src={(work.media && work.media.thumbnail) || work.thumbnail}
                                alt={work.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          ) : (
                            <div className={styles['no-thumbnail']}>이미지 없음</div>
                          )}
                        </div>
                        
                        <div className={styles['timeline-content']}>
                          <h3 className={styles['timeline-title']}>{work.title}</h3>
                          <p className={styles['timeline-description']}>{work.shortDescription}</p>
                          
                          {work.status && (
                            <div className={`${styles['status-badge']} ${statusClass[work.status]}`}>
                              {work.status}
                            </div>
                          )}
                          
                          {work.workPeriod.totalHours && (
                            <div className={styles['work-duration']}>
                              총 작업 시간: {work.workPeriod.totalHours}시간
                            </div>
                          )}
                          
                          {work.tags && work.tags.length > 0 && (
                            <div className={styles['timeline-tags']}>
                              {work.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                              {work.tags.length > 3 && (
                                <span className={styles['tag-more']}>+{work.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 