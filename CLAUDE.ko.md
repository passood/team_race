# Team Race - Claude Code 프로젝트 가이드

## 프로젝트 정보

**프로젝트**: 주식 섹터 차트 레이스 시각화
**타임라인**: 11주 개발 로드맵
**스택**: React 18 + Vite + D3.js + Node.js + Express
**아키텍처**: 1개 프론트엔드 + 7개 백엔드 마이크로서비스 모노레포

## 빠른 시작 명령어

### 개발 환경
```bash
# 모든 의존성 설치
pnpm install

# 프론트엔드만 시작
pnpm dev:frontend

# PM2로 모든 백엔드 서비스 시작
pnpm pm2:start

# 모든 것 시작
pnpm dev

# 모든 패키지 빌드
pnpm build

# 테스트 실행
pnpm test
```

### PM2 백엔드 관리
```bash
# 모든 백엔드 서비스 시작
pnpm pm2:start

# 모든 서비스 로그 보기
pnpm pm2:logs

# 특정 서비스 로그 보기
pm2 logs data-service

# 모든 서비스 모니터링
pnpm pm2:monit

# 특정 서비스 재시작
pm2 restart data-service

# 모든 서비스 중지
pnpm pm2:stop

# 서비스 상태 확인
pnpm pm2:status
```

### 워크스페이스 관리
```bash
# 프론트엔드에 의존성 추가
pnpm add <package> --filter frontend

# 특정 백엔드 서비스에 의존성 추가
pnpm add <package> --filter data-service

# 루트에 개발 의존성 추가
pnpm add -D -w <package>

# 특정 워크스페이스에서 명령어 실행
pnpm --filter frontend <command>
```

## 문서 구조

### 핵심 문서
- **CLAUDE.md** (이 파일): 빠른 명령어와 프로젝트별 사항
- **PROJECT_KNOWLEDGE.md**: 아키텍처 개요 및 시스템 설계
- **TROUBLESHOOTING.md**: 일반적인 문제 및 해결 방법
- **PRD.md**: 완전한 제품 요구사항 문서

### 추가 리소스
- `docs/architecture/`: 시스템 아키텍처 다이어그램 및 문서
- `docs/api/`: 백엔드 서비스 API 문서
- `docs/dev/active/`: 활성 개발 작업 추적
- `.claude/skills/`: 자동 활성화 시스템용 스킬
- `.claude/hooks/`: 품질 관리용 훅

## Skills 시스템

Skills는 컨텍스트(키워드, 파일 경로, 콘텐츠 패턴)에 따라 자동으로 활성화됩니다.

### 사용 가능한 Skills
1. **frontend-dev-guidelines**: React 19, Vite, D3.js, TailwindCSS, TanStack Router/Query 패턴
2. **backend-dev-guidelines**: Express.js 아키텍처, TypeScript, API 설계, 에러 처리
3. **d3-visualization-guidelines**: D3.js v7 + React 통합, 차트 레이스 애니메이션, 60fps 최적화
4. **data-service-guidelines**: Yahoo Finance API 통합, 캐싱, 배치 데이터 처리
5. **testing-guidelines**: Vitest, Playwright E2E, API 테스팅 전략
6. **skill-developer**: 새 스킬 생성용 메타 스킬

Skills는 관련성이 있을 때 자동으로 로드됩니다. 수동 활성화: `/skill <skill-name>`

## Dev Docs 시스템

이 시스템은 (Skills 외에) 제가 CC에서 얻는 결과에 가장 큰 영향을 준 것 같습니다. Claude는 극도로 자신감 넘치는 주니어 개발자처럼 극심한 기억상실증을 앓고 있어서, 쉽게 무엇을 하고 있는지 잊어버립니다. 이 시스템은 그러한 단점을 해결하는 것을 목표로 합니다.

### 대규모 작업 시작하기

계획 모드를 종료하고 승인된 계획이 있을 때:

1. **작업 디렉토리 생성**:
   ```bash
   mkdir -p ~/git/project/dev/active/[task-name]/
   ```

2. **문서 생성**:
   - `[task-name]-plan.md` - 승인된 계획
   - `[task-name]-context.md` - 주요 파일, 결정사항, 아키텍처 노트
   - `[task-name]-tasks.md` - 작업 항목 체크리스트

3. **정기적으로 업데이트**: 작업 완료 즉시 표시, 발견한 대로 컨텍스트 추가

### 작업 계속하기

- 기존 작업은 `/dev/active/`에서 확인
- 진행하기 전에 세 파일 모두 읽기
- "마지막 업데이트" 타임스탬프 업데이트
- 자동 압축 전에 `/dev-docs-update` 사용

## 프로젝트별 구성

### 주식 티커
Blue Team vs White Team 주식 티커는 다음에 중앙 정의되어 있습니다:
- `shared/config/stock-tickers.ts`

모든 티커 관련 로직에 이 파일 참조.

### 색상 시스템
프로젝트는 Blue Team(미래 지향) vs White Team(전통)에 대한 특정 색상 코딩을 사용합니다:
- 전체 색상 팔레트는 `.claude/skills/resources/color-system.md` 참조
- 모든 색상은 WCAG 2.1 AA 접근성 기준 충족 필요

### Yahoo Finance API
- **속도 제한**: 무료 티어에 제한이 있으므로 적극적으로 캐싱
- **캐싱 전략**: 일일 데이터에 대해 24시간 캐시
- **에러 처리**: 지수 백오프를 사용한 3회 재시도 로직
- **테스트 스크립트**: `node scripts/test-yahoo-finance.ts [ticker]`

## 백엔드 서비스

### 아키텍처 패턴
모든 백엔드 서비스는 다음을 따릅니다: **Routes → Controllers → Services → Repositories**

### 사용 가능한 서비스
1. **data-service**: Yahoo Finance API 통합, 주식 데이터 가져오기
2. **form-service**: 사용자 입력 처리
3. **email-service**: 이메일 알림
4. **auth-service**: 인증 및 권한 부여
5. **notification-service**: 시스템 알림
6. **workflow-service**: 복잡한 워크플로우 관리
7. **api-gateway**: API 게이트웨이 및 라우팅

각 서비스는 PM2를 통해 독립적으로 실행됩니다. 로그는 `backend/[service]/logs/`에 있습니다.

## 프론트엔드 구조

### 주요 기술
- **프레임워크**: React 18 with TypeScript
- **빌드 도구**: Vite
- **라우팅**: TanStack Router (파일 기반)
- **상태 관리**: Zustand
- **데이터 패칭**: TanStack Query v5
- **스타일링**: TailwindCSS v3
- **시각화**: D3.js v7
- **아이콘**: Lucide React

### 컴포넌트 구조
```
frontend/src/
├── components/       # 재사용 가능한 컴포넌트
│   └── ChartRace/   # D3.js 차트 레이스 시각화
├── pages/           # 라우트 페이지
├── hooks/           # 커스텀 React 훅
├── stores/          # Zustand 스토어
├── services/        # API 클라이언트 서비스
├── utils/           # 유틸리티 함수
└── types/           # TypeScript 타입
```

## 테스팅

### 프론트엔드 테스트
```bash
# Vitest로 유닛 테스트
pnpm --filter frontend test

# Playwright로 E2E 테스트
pnpm --filter frontend test:e2e
```

### 백엔드 테스트
```bash
# 모든 백엔드 서비스 테스트
pnpm test:backend

# 특정 서비스
pnpm --filter data-service test
```

### 테스트 커버리지 목표
- 최소: 70% 코드 커버리지
- 중점: API 엔드포인트, 데이터 처리, 차트 레이스 로직

## 애니메이션 성능

**핵심 요구사항**: 60fps 차트 레이스 애니메이션

### 성능 체크리스트
- ✅ 모든 D3.js 애니메이션에 `requestAnimationFrame` 사용
- ✅ easing 함수 구현 (ease-in-out)
- ✅ DOM 업데이트 배치 처리
- ✅ position 변경 대신 CSS transforms 사용
- ✅ Chrome DevTools Performance 탭으로 모니터링
- ✅ 저사양 디바이스에서 테스트

자세한 최적화 기법은 `d3-visualization-guidelines` 스킬 참조.

## 개발 워크플로우

### 계획 프로세스
1. **기능 구현 전 항상 계획 모드 사용**
2. `/strategic-plan-architect` 에이전트 또는 `/dev-docs` 명령어 사용
3. 진행하기 전에 계획 철저히 검토
4. dev docs 구조 생성 (`plan.md`, `context.md`, `tasks.md`)

### 코드 리뷰 프로세스
1. 한 번에 1-2개 섹션만 구현
2. 각 작업 세트 사이에 코드 검토
3. 자동 검토를 위해 `/code-review` 명령어 사용
4. 빌드를 자주 확인 (훅이 자동 체크)

### 에러 처리
- **빌드 에러**: 훅이 자동 감지 및 보고
- **TypeScript 에러**: 다음 작업으로 이동하기 전에 0개여야 함
- **런타임 에러**: PM2 로그 확인 (`pm2 logs [service]`)

## Hooks (자동 품질 관리)

활성 훅이 자동으로:
1. **skill-auto-activation**: 프롬프트를 보기 전에 관련 스킬 로드
2. **build-error-checker**: 편집 후 빌드 실행, 즉시 에러 보고
3. **error-handling-reminder**: 적절한 try-catch 및 에러 처리 확인
4. **performance-reminder**: D3.js 코드에서 60fps 요구사항 검증

## 전문 에이전트

특정 작업을 위한 사용 가능한 에이전트:
- `/strategic-plan-architect`: 상세한 구현 계획 생성
- `/code-review`: 아키텍처 코드 검토
- `/build-and-fix`: 빌드 실행 및 모든 에러 수정
- `/d3-animation-specialist`: 전문 D3.js + React 통합 검토
- `/yahoo-finance-specialist`: Yahoo Finance API 통합 도움

## 개발 단계 (11주)

1. **Phase 1**: 프로젝트 설정 (1주) ← 현재
2. **Phase 2**: 백엔드 API 개발 (2주)
3. **Phase 3**: 프론트엔드 UI 기반 (2주)
4. **Phase 4**: D3.js 차트 레이스 구현 (3주) ⚠️ 가장 복잡
5. **Phase 5**: 주식 상세 및 비교 (1주)
6. **Phase 6**: 테스팅 및 QA (1주)
7. **Phase 7**: 배포 및 문서화 (1주)

## 중요한 알림

- **계획이 왕**: 간단하지 않은 작업에 대해 계획 모드를 건너뛰지 마세요
- **Dev docs는 컨텍스트 손실을 방지**: >1일 작업에 사용
- **빌드 에러 = 차단**: 미해결 TypeScript 에러에 대한 무관용
- **60fps가 핵심**: 모든 애니메이션에 대한 성능 테스트 필요
- **자주 검토**: 문제를 조기에 발견하는 것이 좋습니다
- **디버깅에 PM2**: Claude가 로그를 자율적으로 읽을 수 있습니다

## 빠른 참조 링크

- PRD: `PRD.md`
- 아키텍처: `docs/architecture/`
- API 문서: `docs/api/`
- 주식 티커: `shared/config/stock-tickers.ts`
- 색상 시스템: `.claude/skills/resources/color-system.md`
- Skills: `.claude/skills/`
- 활성 작업: `docs/dev/active/`
