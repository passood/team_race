# 프론트엔드 개발 가이드라인

**버전**: 1.0.0
**최종 업데이트**: 2025-01-02
**목적**: React 18+, Vite, D3.js, TailwindCSS, TanStack 생태계를 사용한 프론트엔드 개발을 위한 종합 가이드라인

## 개요

이 스킬은 Team Race 프론트엔드 애플리케이션을 위한 패턴과 모범 사례를 제공합니다. 필요한 경우에만 상세한 리소스 파일을 로드하는 progressive disclosure를 사용합니다.

## 기술 스택

- **프레임워크**: React 18+ with TypeScript
- **빌드 도구**: Vite 5+
- **라우팅**: TanStack Router (파일 기반 라우팅)
- **상태 관리**: Zustand
- **데이터 패칭**: TanStack Query v5
- **스타일링**: TailwindCSS v3
- **시각화**: D3.js v7 (자세한 내용은 `d3-visualization-guidelines` 스킬 참조)
- **HTTP 클라이언트**: Axios
- **아이콘**: Lucide React
- **날짜 처리**: date-fns

## 빠른 참조

### 리소스 파일 로드 시기

| 주제 | 리소스 파일 | 로드 시기 |
|------|------------|----------|
| React 패턴 | `react-patterns.md` | 컴포넌트 생성/수정 시 |
| TanStack Query | `tanstack-query.md` | 데이터 패칭, 캐싱 시 |
| TanStack Router | `tanstack-router.md` | 라우팅, 내비게이션 시 |
| Zustand | `zustand-patterns.md` | 상태 관리 시 |
| TailwindCSS | `tailwind-patterns.md` | 컴포넌트 스타일링 시 |
| 컴포넌트 구조 | `component-organization.md` | 프로젝트 구조 질문 시 |
| TypeScript | `typescript-patterns.md` | 타입 정의, 제네릭 시 |
| 성능 | `performance-optimization.md` | 최적화, 번들 크기 시 |
| 테스팅 | `frontend-testing.md` | 테스트 작성 시 |
| 폼 & 검증 | `forms-validation.md` | 폼 처리 시 |

필요 시 리소스 파일 로드: `@.claude/skills/resources/<filename>`

---

## 핵심 원칙

### 1. TypeScript First
- **항상** TypeScript 사용, `any` 타입 절대 사용 금지
- 모든 props, state, API 응답에 대한 인터페이스 정의
- 가능한 경우 타입 추론 사용
- union/intersection에는 interface보다 type 선호

```typescript
// ✅ 좋음
interface StockData {
  ticker: string;
  price: number;
  change: number;
}

const StockCard: React.FC<{ data: StockData }> = ({ data }) => {
  // ...
};

// ❌ 나쁨
const StockCard = ({ data }: any) => {
  // ...
};
```

### 2. Hooks를 사용한 함수형 컴포넌트
- **항상** 함수형 컴포넌트 사용
- 클래스 컴포넌트 절대 사용 금지
- hooks 규칙 준수 (최상위 레벨, 조건문 금지)
- 재사용 가능한 로직을 위한 커스텀 hooks 추출

```typescript
// ✅ 좋음
const useStockData = (ticker: string) => {
  return useQuery({
    queryKey: ['stocks', ticker],
    queryFn: () => api.getStock(ticker),
  });
};

// ❌ 나쁨
class StockDataProvider extends React.Component {
  // 클래스 컴포넌트 사용하지 말 것
}
```

### 3. 컴포넌트 구성
```
frontend/src/
├── components/
│   ├── ChartRace/           # 기능 기반 그룹화
│   │   ├── ChartRace.tsx
│   │   ├── ChartRaceCanvas.tsx
│   │   ├── ChartRaceControls.tsx
│   │   └── index.ts         # Barrel export
│   ├── StockCard/
│   │   ├── StockCard.tsx
│   │   ├── StockMetrics.tsx
│   │   └── index.ts
│   └── common/              # 공유 컴포넌트
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Loader.tsx
├── pages/                   # 라우트 페이지
├── hooks/                   # 커스텀 hooks
├── stores/                  # Zustand 스토어
├── services/                # API 클라이언트
├── utils/                   # 유틸리티 함수
└── types/                   # TypeScript 타입
```

### 4. Props 패턴
```typescript
// ✅ 좋음 - 명시적 인터페이스
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  onClick,
  children
}) => {
  return (
    <button
      className={cn(buttonVariants[variant], sizeVariants[size])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ 나쁨 - 인라인 타입, 기본값 없음
const Button = ({ variant, size, onClick, children }: {
  variant: string;
  size: string;
  onClick: Function;
  children: any;
}) => {
  // ...
};
```

---

## 파일 구성

### 1. 컴포넌트 파일
```typescript
// StockCard.tsx
import React from 'react';
import { Card } from '@/components/common/Card';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import type { StockData } from '@/types/stock';

interface StockCardProps {
  data: StockData;
  onClick?: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ data, onClick }) => {
  return (
    <Card onClick={onClick} className="hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{data.ticker}</h3>
      <p className="text-2xl">{formatCurrency(data.price)}</p>
      <p className={data.change >= 0 ? 'text-green-500' : 'text-red-500'}>
        {formatPercent(data.change)}
      </p>
    </Card>
  );
};
```

### 2. Index Barrel Exports
```typescript
// components/StockCard/index.ts
export { StockCard } from './StockCard';
export { StockMetrics } from './StockMetrics';
export type { StockCardProps } from './StockCard';
```

### 3. 페이지 컴포넌트
```typescript
// pages/Home.tsx
import { ChartRace } from '@/components/ChartRace';
import { useStockData } from '@/hooks/useStockData';

export const Home: React.FC = () => {
  const { data, isLoading } = useStockData();

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Team Race</h1>
      <ChartRace data={data} />
    </div>
  );
};
```

---

## 상태 관리

### 서버 상태를 위한 TanStack Query
모든 서버 데이터에 TanStack Query 사용. 서버 데이터에 useState 절대 사용 금지.

```typescript
// ✅ 좋음 - TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),
  staleTime: 1000 * 60 * 60 * 24, // 24시간
  gcTime: 1000 * 60 * 60 * 24,
});

// ❌ 나쁨 - 서버 데이터에 useState
const [data, setData] = useState(null);
useEffect(() => {
  fetchData().then(setData);
}, []);
```

**주요 TanStack Query 패턴**:
- 안정적인 queryKey 배열 사용
- 적절한 staleTime 설정 (주식 데이터는 24시간)
- POST/PUT/DELETE에 mutations 사용
- mutation 후 쿼리 무효화

자세한 내용: `@.claude/skills/resources/tanstack-query.md` 로드

### UI 상태를 위한 Zustand
클라이언트 사이드 UI 상태에만 Zustand 사용.

```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  selectedTeam: 'blue' | 'white' | 'all';
  setSelectedTeam: (team: 'blue' | 'white' | 'all') => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: true,
  selectedTeam: 'all',
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

// 컴포넌트에서 사용
const { selectedTeam, setSelectedTeam } = useUIStore();
```

자세한 내용: `@.claude/skills/resources/zustand-patterns.md` 로드

---

## TailwindCSS로 스타일링

### 1. 유틸리티 클래스 사용
```typescript
// ✅ 좋음 - Tailwind 유틸리티
<div className="flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
  <h2 className="text-xl font-semibold text-white">Title</h2>
  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
    Click me
  </button>
</div>

// ❌ 나쁨 - 인라인 스타일
<div style={{ display: 'flex', padding: '16px', backgroundColor: '#1f2937' }}>
  {/* ... */}
</div>
```

### 2. 조건부 클래스를 위한 `cn()` 헬퍼 사용
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// 사용법
<button className={cn(
  'px-4 py-2 rounded',
  variant === 'primary' && 'bg-blue-600 text-white',
  variant === 'secondary' && 'bg-gray-600 text-white',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
  {children}
</button>
```

### 3. 색상 시스템
`@.claude/skills/resources/color-system.md`의 프로젝트 색상 팔레트 사용

```typescript
// Blue Team 색상
'text-blue-400'  // #60A5FA
'bg-blue-600'    // #3B82F6

// White Team 색상
'text-gray-400'  // #9CA3AF
'bg-gray-600'    // #6B7280

// 다크 테마 배경
'bg-slate-900'   // #0F172A
```

자세한 내용: `@.claude/skills/resources/tailwind-patterns.md` 로드

---

## TanStack Router로 라우팅

### 파일 기반 라우팅 구조
```
frontend/src/routes/
├── __root.tsx              # 루트 레이아웃
├── index.tsx               # / (Home - Chart Race)
├── stocks/
│   ├── index.tsx           # /stocks (주식 목록)
│   └── $ticker.tsx         # /stocks/:ticker (주식 상세)
└── comparison.tsx          # /comparison
```

### 라우트 파일 예시
```typescript
// routes/stocks/$ticker.tsx
import { createFileRoute } from '@tanstack/react-router';
import { stockApi } from '@/services/api/stockApi';

export const Route = createFileRoute('/stocks/$ticker')({
  loader: async ({ params }) => {
    // 렌더링 전 데이터 미리 로드
    return await stockApi.getStockData(params.ticker);
  },
  component: StockDetails,
});

function StockDetails() {
  const { ticker } = Route.useParams();
  const data = Route.useLoaderData();

  return (
    <div>
      <h1>{ticker}</h1>
      {/* 미리 로드된 데이터 사용 */}
    </div>
  );
}
```

자세한 내용: `@.claude/skills/resources/tanstack-router.md` 로드

---

## 성능 모범 사례

### 1. 코드 분할
```typescript
// 라우트 지연 로딩
import { lazy } from 'react';

const StockDetails = lazy(() => import('./pages/StockDetails'));

// Suspense로 감싸기
<Suspense fallback={<Loader />}>
  <StockDetails />
</Suspense>
```

### 2. 메모이제이션
```typescript
import { useMemo, useCallback } from 'react';

// 비용이 많이 드는 계산
const sortedStocks = useMemo(() => {
  return stocks.sort((a, b) => b.change - a.change);
}, [stocks]);

// 콜백 함수
const handleClick = useCallback(() => {
  console.log('Clicked', ticker);
}, [ticker]);
```

### 3. React 18 Concurrent 기능
```typescript
// 데이터 패칭에 Suspense 사용
<Suspense fallback={<Skeleton />}>
  <StockList />
</Suspense>

// 긴급하지 않은 업데이트에 transitions 사용
const [isPending, startTransition] = useTransition();

const handleSearch = (query: string) => {
  startTransition(() => {
    setSearchQuery(query);
  });
};
```

자세한 내용: `@.claude/skills/resources/performance-optimization.md` 로드

---

## 에러 처리

### 1. Error Boundaries
```typescript
// components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // 선택사항: 에러 리포팅 서비스로 전송
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-500">
            문제가 발생했습니다
          </h2>
          <p className="text-gray-600 mt-2">
            {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. TanStack Query 에러 처리
```typescript
const { data, error, isError } = useQuery({
  queryKey: ['stocks', ticker],
  queryFn: () => stockApi.getStockData(ticker),
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  return <ErrorMessage error={error} />;
}
```

---

## 접근성

### 1. 시맨틱 HTML
```typescript
// ✅ 좋음
<button onClick={handleClick}>Click me</button>
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/stocks">Stocks</a></li>
  </ul>
</nav>

// ❌ 나쁨
<div onClick={handleClick}>Click me</div>
```

### 2. ARIA 레이블
```typescript
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={onClose}
>
  <XIcon />
</button>
```

### 3. 키보드 내비게이션
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  {children}
</div>
```

### 4. 색상 대비
모든 색상은 WCAG 2.1 AA 표준 (텍스트에 대해 4.5:1 명암비)을 충족해야 합니다.
참조: `@.claude/skills/resources/color-system.md`

---

## 테스팅

### 1. Vitest + Testing Library로 컴포넌트 테스트
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StockCard } from './StockCard';

describe('StockCard', () => {
  it('renders stock data correctly', () => {
    const data = {
      ticker: 'AAPL',
      price: 150.25,
      change: 2.5,
    };

    render(<StockCard data={data} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('$150.25')).toBeInTheDocument();
    expect(screen.getByText('+2.50%')).toBeInTheDocument();
  });
});
```

자세한 내용: `@.claude/skills/resources/frontend-testing.md` 로드

---

## 일반적인 패턴

### 1. 로딩 상태
```typescript
const { data, isLoading, isError } = useStockData(ticker);

if (isLoading) return <Skeleton />;
if (isError) return <ErrorMessage />;
if (!data) return null;

return <StockCard data={data} />;
```

### 2. 조건부 렌더링
```typescript
// ✅ 좋음 - 조기 반환
if (isLoading) return <Loader />;
if (isError) return <Error />;

return <Content />;

// ❌ 나쁨 - 중첩된 삼항 연산자
return isLoading ? <Loader /> : isError ? <Error /> : <Content />;
```

### 3. Key가 있는 리스트
```typescript
// ✅ 좋음 - 안정적인 key
{stocks.map((stock) => (
  <StockCard key={stock.ticker} data={stock} />
))}

// ❌ 나쁨 - key로 index 사용 (불안정)
{stocks.map((stock, index) => (
  <StockCard key={index} data={stock} />
))}
```

---

## D3.js와의 통합

D3.js 특정 패턴에 대해서는 `d3-visualization-guidelines` 스킬을 사용하세요.

**기본 React + D3 패턴**:
```typescript
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChartRaceCanvas: React.FC<{ data: ChartData }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    // 여기에 D3 작업

    return () => {
      // 정리
      svg.selectAll('*').remove();
    };
  }, [data]);

  return <svg ref={svgRef} className="w-full h-full" />;
};
```

---

## 리소스 파일 참조

상세한 가이드를 위해 필요 시 이 파일들을 로드하세요:

1. **react-patterns.md**: React 18 hooks, Suspense, concurrent 기능
2. **tanstack-query.md**: 데이터 패칭, 캐싱, mutations
3. **tanstack-router.md**: 파일 기반 라우팅, loaders, 내비게이션
4. **zustand-patterns.md**: 상태 관리 패턴
5. **tailwind-patterns.md**: 스타일링 패턴, 반응형 디자인
6. **component-organization.md**: 컴포넌트 구조, barrel exports
7. **typescript-patterns.md**: 타입 정의, 제네릭, 유틸리티 타입
8. **performance-optimization.md**: 번들 최적화, 코드 분할
9. **frontend-testing.md**: Vitest, Testing Library, Playwright E2E
10. **forms-validation.md**: 폼 처리, 검증, React Hook Form

---

## 커밋 전 체크리스트

- [ ] TypeScript 에러 없음 (`pnpm exec tsc --noEmit`)
- [ ] ESLint 에러 없음 (`pnpm lint`)
- [ ] 코드 포맷 완료 (`pnpm format`)
- [ ] 모든 import 정리됨 (external, internal, relative로 그룹화)
- [ ] 프로덕션 코드에 `console.log` 없음
- [ ] Props 인터페이스 정의됨
- [ ] 접근성 고려됨 (시맨틱 HTML, ARIA 레이블)
- [ ] 반응형 디자인 테스트됨
- [ ] 로딩/에러 상태 처리됨
- [ ] 새 컴포넌트에 대한 테스트 작성됨

---

**최종 업데이트**: 2025-01-02
**스킬 버전**: 1.0.0
**호환 가능**: React 18+, Vite 5+, TypeScript 5.3+
