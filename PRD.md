# PRD: 주식 섹터 레이스 시각화 웹앱

**Team Race - 자본 흐름 추적 플랫폼**

---

## 1. 프로젝트 개요

### 1.1 프로젝트 소개

**Team Race**는 미국 주식 시장의 섹터별 대장주들의 시가총액 변화를 차트 레이스 애니메이션으로 시각화하는 웹 애플리케이션입니다. 청팀(미래 섹터)과 백팀(전통 섹터)으로 나누어 거대 자본의 이동 패턴을 직관적으로 보여줍니다.

### 1.2 프로젝트 배경

- 섹터 단위로 움직이는 자본의 흐름을 시각적으로 추적
- 거대 자본과 부호들의 투자 전략과 경로 파악
- 미래 섹터와 전통 섹터 간의 자본 이동 패턴 분석
- 투자자들이 자본의 이동을 몸으로 느끼고 직감할 수 있는 경험 제공

### 1.3 핵심 가치 제안

- **시각적 직관성**: 복잡한 주가 데이터를 차트 레이스 애니메이션으로 쉽게 이해
- **섹터 기반 분석**: 개별 종목이 아닌 섹터 단위의 자본 흐름 파악
- **전략적 인사이트**: 어떤 섹터가 먼저 움직이는지 순서를 통해 투자 전략 수립
- **재무 지표 통합**: 부채비율, 유동비율 등 핵심 재무 지표를 함께 제공

---

## 2. 목표 및 성공 지표

### 2.1 프로젝트 목표

1. 청팀/백팀 섹터별 대장주 1~3위의 시간별 시가총액 순위 변화 시각화
2. 섹터 간 자본 이동 패턴의 직관적 표현
3. 사용자가 자유롭게 기간과 섹터를 선택하여 분석할 수 있는 인터랙티브 환경 제공
4. 재무 지표를 통한 심층 분석 기능 제공

### 2.2 성공 지표 (KPI)

- **기능적 지표**

  - 청팀/백팀 모든 섹터 대장주 데이터 커버리지 100%
  - 애니메이션 부드러움 (60fps 유지)
  - 데이터 로딩 시간 < 3초

- **사용자 경험 지표**
  - 평균 세션 시간 > 5분
  - 기간 변경 인터랙션 > 3회/세션
  - 섹터 필터링 사용률 > 50%

---

## 3. 타겟 사용자

### 3.1 주요 사용자 페르소나

**페르소나 1: 개인 투자자 (김투자, 35세)**

- **목표**: 장기 투자를 위한 섹터 선택
- **니즈**: 자본이 어느 섹터로 이동하는지 트렌드 파악
- **사용 시나리오**: 주말에 다음 주 투자 전략 수립

**페르소나 2: 금융 분석가 (박분석, 28세)**

- **목표**: 섹터 로테이션 분석 및 리포트 작성
- **니즈**: 과거 데이터를 통한 패턴 분석
- **사용 시나리오**: 분기별 섹터 분석 리포트 작성

**페르소나 3: 데이 트레이더 (이단타, 42세)**

- **목표**: 단기 변동성 큰 섹터 찾기
- **니즈**: 최근 자본 유입이 급증한 섹터 파악
- **사용 시나리오**: 장 시작 전 전날 섹터별 흐름 확인

---

## 4. 핵심 기능

### 4.1 섹터 분류 체계

#### 청팀 (미래 섹터)

1. **양자 컴퓨터**: IonQ(IONQ), Rigetti Computing(RGTI)
2. **우주 항공**: 록히드 마틴(LMT), 노스럽 그루먼(NOC), 레이시온 테크놀로지스(RTX), L3Harris Technologies(LHX)
3. **장수 과학**: Intellia Therapeutics(NTLA), CRISPR Therapeutics(CRSP)
4. **합성 생물학**: Ginkgo Bioworks(DNA), Twist Bioscience(TWST)
5. **위성 통신**: Iridium Communications(IRDM), Starlink(비상장)
6. **소형 모듈 원자로 (SMR)**: BWX Technologies(BWXT), Oklo(비상장)
7. **그린 수소/암모니아**: Air Products(APD), Linde(LIN), Plug Power(PLUG)
8. **차세대 배터리/ESS**: Tesla(TSLA), Fluence Energy(FLNC), QuantumScape(QS)
9. **BCI (뇌-컴퓨터 인터페이스)**: Neuralink(비상장), Synchron(비상장)

#### 백팀 (전통 섹터)

1. **전통 에너지**: ExxonMobil(XOM), Chevron(CVX), ConocoPhillips(COP)
2. **미래 에너지**: NextEra Energy(NEE), Enphase Energy(ENPH), First Solar(FSLR)
3. **데이터 인프라**: Google(GOOGL), Meta(META), Microsoft(MSFT)
4. **필수 소비재**: Amazon(AMZN), Coca-Cola(KO), Procter & Gamble(PG)
5. **결제 시스템**: Visa(V), Mastercard(MA), American Express(AXP), PayPal(PYPL)
6. **자산운용**: BlackRock(BLK), Vanguard(비상장)
7. **명품**: LVMH(MC.PA), Hermès(RMS.PA)
8. **물과 식량**: American Water Works(AWK), Essential Utilities(WTRG)

### 4.2 차트 레이스 애니메이션

- **시간축 기반 애니메이션**: 선택한 기간 동안의 시가총액 순위 변화를 부드럽게 표현
- **막대 차트 레이스**: 각 종목이 막대 형태로 표현되며 순위에 따라 위치 변경
- **색상 코딩**: 청팀(파란색 계열), 백팀(회색/흰색 계열)
- **종목 정보 표시**: 티커 심볼, 기업명, 현재 시가총액
- **섹터 아이콘**: 각 종목 옆에 섹터를 나타내는 아이콘 표시

### 4.3 사용자 컨트롤 기능

#### 4.3.1 기간 선택 (필수)

- **프리셋 옵션**: 1개월, 3개월, 6개월, 1년, 3년, 5년
- **커스텀 기간**: 시작일과 종료일을 직접 선택
- **기본값**: 최근 1년

#### 4.3.2 섹터 필터링 (필수)

- **전체 보기**: 청팀 + 백팀 모두
- **청팀만**: 미래 섹터 대장주만
- **백팀만**: 전통 섹터 대장주만
- **개별 섹터 선택**: 특정 섹터(예: 우주 항공, 필수 소비재)만 선택 가능
- **다중 선택**: 여러 섹터 동시 비교

#### 4.3.3 재생 속도 조절 (필수)

- **속도 옵션**: 0.5x, 1x, 2x, 5x, 10x
- **재생/일시정지**: 애니메이션 재생 컨트롤
- **특정 날짜로 이동**: 타임라인 바를 드래그하여 원하는 날짜로 이동

#### 4.3.4 상세 정보 표시 (필수)

- **종목 클릭 시 모달/사이드바 표시**:
  - 기업명, 티커 심볼
  - 현재 시가총액
  - 부채비율 (Debt-to-Equity Ratio)
  - 유동비율 (Current Ratio)
  - 주가 차트 (선택 기간)
  - 섹터 정보
- **호버 시 툴팁**: 간단한 정보 미리보기

#### 4.3.5 비교 분석 (필수)

- **청팀 vs 백팀 전체 흐름 비교**:
  - 청팀 평균 시가총액 변화
  - 백팀 평균 시가총액 변화
  - 라인 차트로 비교 표시
- **섹터별 성과 비교**:
  - 각 섹터의 평균 수익률
  - 히트맵 형태로 시각화
- **상관관계 분석**:
  - 어떤 섹터가 먼저 움직이는지 순서 표시
  - 섹터 간 상관계수 표시

### 4.4 데이터 업데이트 (필수)

- **수동 새로고침**: 사용자가 새로고침 버튼 클릭 시 최신 데이터 로드
- **마지막 업데이트 시간 표시**: "마지막 업데이트: 2025-11-02 09:30 EST"
- **로딩 인디케이터**: 데이터 로딩 중 상태 표시

---

## 5. 기술 스택

### 5.1 Frontend

- **프레임워크**: React 18+ with Vite
- **시각화**: D3.js v7 (차트 레이스 애니메이션)
- **스타일링**: TailwindCSS v3
- **상태 관리**: Zustand or React Context API
- **HTTP 클라이언트**: Axios
- **날짜 처리**: date-fns
- **아이콘**: Lucide React or React Icons

### 5.2 Data Infrastructure (Serverless)

- **Data Fetching**: GitHub Actions + TypeScript
  - Daily cron job (10 PM UTC, after US market close)
  - `yahoo-finance2` npm package for Yahoo Finance API
  - Batch processing (5 stocks at a time)
  - 3-retry logic with exponential backoff
  - Generates static JSON files

- **Data Storage**: Static JSON Files
  - Stored in `frontend/public/data/`
  - `stocks-latest.json`: Latest data (~9.6MB)
  - `stocks-YYYY-MM-DD.json`: Dated archives
  - `metadata.json`: Update timestamps and counts

- **No Traditional Backend**:
  - Zero server infrastructure
  - Zero hosting costs
  - Infinite scalability via CDN

### 5.3 데이터 소스

- **Yahoo Finance API**: yfinance (Python) or yahoo-finance2 (Node.js)
- **데이터 타입**:
  - 역사적 주가 데이터 (OHLCV)
  - 시가총액 데이터
  - 재무 비율 데이터

### 5.4 배포

- **Frontend + Data**: Vercel / Netlify / Cloudflare Pages
  - 자동 CI/CD
  - Global CDN (Edge Network)
  - Static JSON files served from CDN
  - Zero backend infrastructure

- **Data Updates**: GitHub Actions
  - Automated daily cron job
  - Manual trigger available
  - Commits updated JSON files to repository

### 5.5 개발 도구

- **버전 관리**: Git + GitHub
- **패키지 관리**: npm (Frontend + Scripts)
- **코드 포맷팅**: Prettier, ESLint
- **타입 체킹**: TypeScript

---

## 6. 데이터 요구사항

### 6.1 필수 데이터

#### 6.1.1 종목 마스터 데이터

```json
{
  "ticker": "TSLA",
  "name": "Tesla, Inc.",
  "sector": "차세대 배터리/ESS",
  "team": "청팀",
  "rank": 1,
  "icon": "battery"
}
```

#### 6.1.2 시계열 주가 데이터

```json
{
  "ticker": "TSLA",
  "date": "2024-01-01",
  "close": 248.42,
  "marketCap": 788000000000,
  "volume": 120000000
}
```

#### 6.1.3 재무 지표 데이터

```json
{
  "ticker": "TSLA",
  "debtToEquity": 0.09,
  "currentRatio": 1.73,
  "lastUpdated": "2024-12-31"
}
```

### 6.2 데이터 수집 전략

1. **초기 로드**: 백엔드에서 모든 종목의 과거 데이터 수집 (최대 5년)
2. **캐싱**: 일일 데이터는 24시간 캐싱
3. **배치 처리**: 여러 종목의 데이터를 병렬로 수집
4. **에러 핸들링**: API 실패 시 재시도 로직 (3회)

### 6.3 데이터 처리

- **정규화**: 모든 시가총액 데이터를 USD 기준으로 통일
- **결측치 처리**: 거래 없는 날은 이전 종가 사용
- **이상치 제거**: 주식 분할, 배당 등을 고려한 조정 종가 사용

---

## 7. UI/UX 설계

### 7.1 레이아웃 구조

```
┌─────────────────────────────────────────────────────┐
│  Header: Team Race 로고 | 새로고침 버튼             │
├─────────────────────────────────────────────────────┤
│  Control Panel                                       │
│  [기간 선택] [섹터 필터] [속도 조절] [비교 분석 ON/OFF]│
├─────────────────────────────────────────────────────┤
│                                                       │
│                                                       │
│          Chart Race Animation                         │
│          (Main Visualization Area)                    │
│                                                       │
│                                                       │
├─────────────────────────────────────────────────────┤
│  Timeline Control                                     │
│  [◀] [▶] ━━━━●━━━━━━━━━━━━━━━━ [2024-06-15]      │
├─────────────────────────────────────────────────────┤
│  Comparison Chart (청팀 vs 백팀)                      │
│  (Optional, 비교 분석 ON 시 표시)                     │
└─────────────────────────────────────────────────────┘
```

### 7.2 색상 시스템

#### 청팀 (미래 섹터)

- 메인: `#3B82F6` (Blue-500)
- 보조: `#60A5FA` (Blue-400), `#2563EB` (Blue-600)
- 그라데이션: 청록색 계열

#### 백팀 (전통 섹터)

- 메인: `#6B7280` (Gray-500)
- 보조: `#9CA3AF` (Gray-400), `#4B5563` (Gray-600)
- 그라데이션: 회색 계열

#### 시스템 색상

- 배경: `#0F172A` (Slate-900) - 다크 테마
- 텍스트: `#F8FAFC` (Slate-50)
- 강조: `#10B981` (Green-500) - 상승
- 경고: `#EF4444` (Red-500) - 하락

### 7.3 반응형 디자인

- **Desktop (1280px+)**: 3-컬럼 레이아웃
- **Tablet (768px~1279px)**: 2-컬럼 레이아웃
- **Mobile (< 768px)**: 1-컬럼 레이아웃, 축약된 컨트롤

### 7.4 애니메이션 원칙

- **부드러움**: 60fps 유지, requestAnimationFrame 사용
- **이징**: ease-in-out 함수로 자연스러운 움직임
- **전환 속도**: 0.5초 (기본 속도 1x 기준)
- **순위 변경**: Y축 위치 변경 시 부드러운 전환

### 7.5 접근성 (Accessibility)

- **키보드 내비게이션**: 모든 컨트롤 키보드로 조작 가능
- **색상 대비**: WCAG 2.1 AA 기준 준수
- **대체 텍스트**: 모든 시각 요소에 alt 텍스트
- **스크린 리더**: ARIA 레이블 추가

---

## 8. 데이터 접근 설계 (Serverless)

### 8.1 정적 JSON 파일 구조

#### `/data/stocks-latest.json`

전체 종목의 최신 데이터 (5년 히스토리 포함)

```json
[
  {
    "ticker": "IONQ",
    "name": "IonQ Inc",
    "sector": "Quantum Computing",
    "team": "blue",
    "category": "quantum",
    "history": [
      {
        "date": "2021-01-04",
        "open": 11.125,
        "high": 11.25,
        "low": 10.5,
        "close": 10.80,
        "volume": 150500,
        "adjClose": 10.80
      },
      ...
    ],
    "financials": {
      "debtToEquity": 0.09,
      "currentRatio": 1.73,
      "marketCap": 788000000000,
      "lastUpdated": "2025-11-03"
    }
  },
  ...
]
```

#### `/data/metadata.json`

데이터 메타정보

```json
{
  "lastUpdated": "2025-11-03T14:03:33.790Z",
  "dateRange": {
    "start": "2020-11-03",
    "end": "2025-11-03"
  },
  "totalStocks": 32,
  "successfulStocks": 32,
  "failedStocks": 0,
  "blueTeamCount": 17,
  "whiteTeamCount": 15
}
```

### 8.2 Frontend API Layer

#### `getAllStocks(): Promise<StockData[]>`
최신 주식 데이터 전체 조회

#### `getStocksByDate(date: string): Promise<StockData[]>`
특정 날짜의 주식 데이터 조회 (아카이브)

#### `getStockMetadata(): Promise<StockMetadata>`
데이터 메타정보 조회

#### Utility Functions
- `filterStocksByTeam(stocks, team)`: 팀별 필터링
- `filterStocksByCategory(stocks, category)`: 카테고리별 필터링
- `filterHistoricalDataByDateRange(stocks, start, end)`: 기간별 필터링
- `calculateTeamMarketCap(stocks, team)`: 팀별 시가총액 계산

### 8.3 캐싱 전략

- **TanStack Query 설정**:
  - `staleTime: Infinity` (데이터는 일일 업데이트)
  - `cacheTime: Infinity` (브라우저 세션 동안 유지)
  - `refetchOnWindowFocus: false` (포커스 시 재조회 안 함)

- **CDN 캐싱**: 정적 파일이므로 CDN 엣지에서 캐싱
- **브라우저 캐싱**: 적절한 Cache-Control 헤더 설정

### 8.4 데이터 업데이트 프로세스

1. **GitHub Actions** (매일 10 PM UTC)
2. **fetch-stock-data.ts** 실행
3. Yahoo Finance API에서 32개 종목 데이터 수집
4. JSON 파일 생성 (stocks-latest.json, stocks-YYYY-MM-DD.json)
5. Git 커밋 및 푸시
6. Vercel/Netlify 자동 재배포 (새로운 JSON 파일 포함)

---

## 9. 비기능적 요구사항

### 9.1 성능

- **초기 로딩 시간**: < 3초
- **애니메이션 FPS**: 60fps 유지
- **API 응답 시간**: < 1초
- **번들 크기**: < 500KB (gzip)

### 9.2 확장성

- **동시 사용자**: 1,000명 지원
- **데이터 증가**: 5년치 데이터 처리 가능
- **섹터 추가**: 새로운 섹터 쉽게 추가 가능

### 9.3 보안

- **HTTPS**: 모든 통신 암호화
- **CORS**: 허용된 도메인만 API 접근
- **환경 변수**: API 키 등 민감 정보 보호
- **Rate Limiting**: DDoS 방어

### 9.4 신뢰성

- **업타임**: 99.5% 이상
- **에러 복구**: API 실패 시 자동 재시도
- **데이터 백업**: 일일 백업
- **모니터링**: Sentry 또는 LogRocket 연동

### 9.5 유지보수성

- **코드 품질**: ESLint, Prettier 규칙 준수
- **테스트**: 단위 테스트 커버리지 > 70%
- **문서화**: README, API 문서, 주석
- **버전 관리**: Semantic Versioning

---

## 10. 개발 단계 및 마일스톤

### Phase 1: 프로젝트 설정 및 데이터 인프라 (1주) ✅ Complete

- [x] 프로젝트 구조 설정 (Vite + React, Serverless)
- [x] 디자인 시스템 및 TailwindCSS 설정
- [x] 청팀/백팀 종목 리스트 정리 (shared/config/stock-tickers.ts)
- [x] Yahoo Finance API 연동 (yahoo-finance2)
- [x] GitHub Actions 워크플로우 생성 (일일 데이터 수집)
- [x] 데이터 수집 스크립트 (scripts/fetch-stock-data.ts)
- [x] Frontend API 레이어 (frontend/src/services/stockApi.ts)
- [x] 정적 JSON 파일 생성 테스트 (성공)

### Phase 2: 프론트엔드 - 기본 UI (2주)

- [ ] 프로젝트 초기 설정 (Vite, React, TypeScript)
- [ ] 라우팅 설정 (TanStack Router)
- [ ] 헤더 및 레이아웃 구조
- [ ] 컨트롤 패널 (기간 선택, 섹터 필터, 속도 조절)
- [ ] 타임라인 컨트롤
- [ ] 상태 관리 (Zustand)
- [ ] 데이터 로딩 (TanStack Query with Infinity cache)
- [ ] 로딩 및 에러 상태 UI

### Phase 3: D3.js 차트 레이스 구현 (3주)

- [ ] 기본 차트 레이스 애니메이션
- [ ] 순위 변경 애니메이션 (60fps 보장)
- [ ] 색상 및 아이콘 시스템 (Blue Team vs White Team)
- [ ] 호버 및 클릭 인터랙션
- [ ] 재생/일시정지/속도 조절 기능
- [ ] 반응형 차트 (모바일 대응)

### Phase 4: 상세 정보 및 비교 분석 (1주)

- [ ] 종목 상세 정보 모달/사이드바
- [ ] 청팀 vs 백팀 비교 차트
- [ ] 섹터별 성과 히트맵
- [ ] 상관관계 분석 시각화

### Phase 5: 최적화 및 테스트 (1주)

- [ ] 성능 최적화 (lazy loading, memoization, code splitting)
- [ ] 크로스 브라우저 테스트
- [ ] 접근성 테스트 및 개선 (WCAG 2.1 AA)
- [ ] 단위 테스트 작성 (Vitest)
- [ ] E2E 테스트 (Playwright)

### Phase 6: 배포 (1주)

- [ ] Vercel/Netlify 배포 설정
- [ ] GitHub Actions CI/CD 파이프라인
- [ ] 환경 변수 설정
- [ ] 성능 모니터링 (Sentry, Analytics)
- [ ] 사용자 피드백 수집 체계 구축

**총 예상 기간: 8주 (11주에서 3주 단축)**

**절감된 시간**: 백엔드 개발 2주 제거, 배포 복잡도 감소로 1주 절감

---

## 11. 리스크 및 완화 전략

### 11.1 기술적 리스크

| 리스크                        | 영향도 | 확률 | 완화 전략                                        |
| ----------------------------- | ------ | ---- | ------------------------------------------------ |
| Yahoo Finance API 장애        | 높음   | 중간 | Alpha Vantage 등 대체 API 준비                   |
| D3.js 성능 이슈 (많은 데이터) | 중간   | 중간 | 데이터 샘플링, 가상화 기법 사용                  |
| 비상장 기업 데이터 부족       | 높음   | 높음 | 대체 상장 기업으로 교체                          |
| 브라우저 호환성 문제          | 낮음   | 낮음 | 주요 브라우저(Chrome, Safari, Firefox) 지원 명시 |

### 11.2 데이터 리스크

| 리스크                  | 영향도 | 확률 | 완화 전략                 |
| ----------------------- | ------ | ---- | ------------------------- |
| 데이터 정확성           | 높음   | 낮음 | 여러 소스 교차 검증       |
| API Rate Limit          | 중간   | 중간 | 캐싱 전략, 유료 API 고려  |
| 재무 지표 업데이트 지연 | 낮음   | 높음 | 마지막 업데이트 시간 명시 |

### 11.3 사용자 경험 리스크

| 리스크                | 영향도 | 확률 | 완화 전략                       |
| --------------------- | ------ | ---- | ------------------------------- |
| 복잡한 UI로 인한 혼란 | 중간   | 중간 | 온보딩 튜토리얼 추가            |
| 모바일 성능 저하      | 중간   | 높음 | 모바일 최적화, 간소화된 뷰 제공 |

---

## 12. 향후 확장 가능성

### 12.1 Phase 2 기능 (출시 후)

- **알림 기능**: 특정 섹터가 급등/급락 시 알림
- **포트폴리오 추적**: 사용자 보유 종목 추적
- **AI 인사이트**: GPT 기반 섹터 분석 및 예측
- **소셜 기능**: 분석 공유, 커뮤니티 인사이트
- **CSV/PDF 내보내기**: 차트 및 데이터 다운로드

### 12.2 글로벌 확장

- **다국어 지원**: 영어, 일본어, 중국어
- **다른 시장**: 한국, 유럽, 일본 주식 시장 추가
- **암호화폐**: 암호화폐 섹터 추가

### 12.3 비즈니스 모델

- **무료 티어**: 최근 1년 데이터, 기본 기능
- **프리미엄 티어**: 5년+ 데이터, AI 인사이트, 알림 기능
- **엔터프라이즈**: 기관 투자자용 커스텀 대시보드

---

## 13. 부록

### 13.1 청팀/백팀 전체 종목 리스트

#### 청팀 상세 리스트

**양자 컴퓨터**

1. IonQ (IONQ)
2. Rigetti Computing (RGTI)

**우주 항공**

1. Lockheed Martin (LMT)
2. Northrop Grumman (NOC)
3. Raytheon Technologies (RTX)
4. L3Harris Technologies (LHX)

**장수 과학**

1. Intellia Therapeutics (NTLA)
2. CRISPR Therapeutics (CRSP)

**합성 생물학**

1. Ginkgo Bioworks (DNA)
2. Twist Bioscience (TWST)

**위성 통신**

1. Iridium Communications (IRDM)
2. AST SpaceMobile (ASTS) - 대체

**소형 모듈 원자로 (SMR)**

1. BWX Technologies (BWXT)
2. NuScale Power (SMR)

**그린 수소/암모니아**

1. Air Products and Chemicals (APD)
2. Linde plc (LIN)
3. Plug Power (PLUG)

**차세대 배터리/ESS**

1. Tesla (TSLA)
2. Fluence Energy (FLNC)
3. QuantumScape (QS)

**BCI (뇌-컴퓨터 인터페이스)**

- _상장 기업 부족으로 Phase 2에서 추가 검토_

#### 백팀 상세 리스트

**전통 에너지**

1. ExxonMobil (XOM)
2. Chevron (CVX)
3. ConocoPhillips (COP)

**미래 에너지**

1. NextEra Energy (NEE)
2. Enphase Energy (ENPH)
3. First Solar (FSLR)

**데이터 인프라**

1. Alphabet/Google (GOOGL)
2. Meta Platforms (META)
3. Microsoft (MSFT)

**필수 소비재**

1. Amazon (AMZN)
2. Coca-Cola (KO)
3. Procter & Gamble (PG)

**결제 시스템**

1. Visa (V)
2. Mastercard (MA)
3. American Express (AXP)
4. PayPal (PYPL)

**자산운용**

1. BlackRock (BLK)
2. The Charles Schwab Corporation (SCHW)
3. Morgan Stanley (MS)

**명품**

1. LVMH (MC.PA - 유로넥스트 파리)
2. Estée Lauder (EL)
3. Tapestry (TPR)

**물과 식량**

1. American Water Works (AWK)
2. Essential Utilities (WTRG)
3. Archer-Daniels-Midland (ADM)

### 13.2 참고 자료

- [D3.js 공식 문서](https://d3js.org/)
- [React + D3.js 통합 가이드](https://2019.wattenberger.com/blog/react-and-d3)
- [Yahoo Finance API 문서](https://www.yahoofinanceapi.com/)
- [TailwindCSS 문서](https://tailwindcss.com/)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Railway 배포 가이드](https://docs.railway.app/)

---

**문서 버전**: 1.0
**작성일**: 2025-11-02
**최종 수정일**: 2025-11-02
**작성자**: Claude Code
**승인자**: [이름]

---

**변경 이력**
| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0 | 2025-11-02 | Claude Code | 초안 작성 |
