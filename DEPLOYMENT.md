# Team Race - Vercel 배포 가이드

## 개요

이 프로젝트는 Vercel을 통해 배포되며, GitHub Actions를 사용하여 자동 배포됩니다.
main 브랜치에 push할 때마다 자동으로 빌드되고 배포됩니다.

## 배포 아키텍처

```
GitHub Push (main)
    ↓
GitHub Actions (deploy.yml)
    ↓
Build Frontend (npm run build)
    ↓
Deploy to Vercel
    ↓
Live Site (https://your-app.vercel.app)
```

## 초기 설정 (한 번만 수행)

### 1단계: Vercel 로그인 및 프로젝트 생성

```bash
# Vercel CLI로 로그인
vercel login

# 프로젝트 디렉토리로 이동
cd /Users/joono/Projects/team_race

# Vercel 프로젝트 초기화
vercel
```

**프롬프트 응답 가이드:**
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → 본인의 Vercel 계정 선택
- **Link to existing project?** → `N` (처음이라면 No)
- **What's your project's name?** → `team-race` (또는 원하는 이름)
- **In which directory is your code located?** → `./`
- **Want to override the settings?** → `Y` (Yes)
- **Build Command:** → `cd frontend && npm run build`
- **Output Directory:** → `frontend/dist`
- **Development Command:** → `cd frontend && npm run dev`

### 2단계: 프로젝트 ID 및 조직 ID 확인

초기화 후 `.vercel` 폴더가 생성되며, 다음 명령어로 정보를 확인할 수 있습니다:

```bash
# 프로젝트 정보 확인
cat .vercel/project.json
```

출력 예시:
```json
{
  "projectId": "prj_xxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxx"
}
```

이 값들을 기록해두세요. GitHub Secrets 설정에 필요합니다.

### 3단계: Vercel 액세스 토큰 생성

1. **Vercel 대시보드 접속**: https://vercel.com/account/tokens
2. **"Create Token" 클릭**
3. **Token 이름 입력**: `GitHub Actions - Team Race`
4. **Scope 선택**:
   - **Full Account** 권장 (또는 특정 프로젝트만 선택)
5. **Expiration**: `No Expiration` 권장
6. **"Create" 클릭**
7. **생성된 토큰을 복사**하여 안전한 곳에 보관

⚠️ **중요**: 토큰은 한 번만 표시되므로 반드시 복사해두세요!

### 4단계: GitHub Secrets 설정

1. **GitHub 저장소 접속**: https://github.com/YOUR_USERNAME/team_race
2. **Settings → Secrets and variables → Actions 이동**
3. **"New repository secret" 클릭**하여 다음 3개의 시크릿 추가:

#### 추가할 Secrets:

| Name | Value | 설명 |
|------|-------|------|
| `VERCEL_TOKEN` | `vercel_xxxxxxxxxxxx` | 3단계에서 생성한 토큰 |
| `VERCEL_ORG_ID` | `team_xxxxxxxxxxxx` | 2단계에서 확인한 orgId |
| `VERCEL_PROJECT_ID` | `prj_xxxxxxxxxxxx` | 2단계에서 확인한 projectId |

**각 시크릿 추가 방법:**
1. "New repository secret" 클릭
2. Name 입력 (위 표의 Name 컬럼 참조)
3. Secret 입력 (해당하는 값 붙여넣기)
4. "Add secret" 클릭
5. 3개 모두 추가할 때까지 반복

### 5단계: 첫 배포 테스트

모든 설정이 완료되면, 변경사항을 커밋하고 푸시합니다:

```bash
# 설정 파일들을 스테이징
git add vercel.json .vercelignore .github/workflows/deploy.yml DEPLOYMENT.md

# .vercel 폴더는 .gitignore에 추가 (민감한 정보 포함)
echo ".vercel" >> .gitignore
git add .gitignore

# 커밋
git commit -m "Add Vercel deployment configuration"

# 푸시 (GitHub Actions 자동 배포 트리거)
git push origin main
```

### 6단계: 배포 상태 확인

1. **GitHub Actions 확인**:
   - GitHub 저장소의 **Actions** 탭 이동
   - "Deploy to Vercel" 워크플로우 실행 확인
   - 빌드 로그 확인

2. **Vercel 대시보드 확인**:
   - https://vercel.com/dashboard
   - 프로젝트 클릭
   - 배포 상태 및 로그 확인

3. **라이브 사이트 접속**:
   - Vercel이 제공하는 URL로 접속 (예: `https://team-race.vercel.app`)
   - 또는 GitHub Actions 로그에서 배포 URL 확인

## 일상적인 배포 워크플로우

초기 설정 완료 후에는 다음과 같이 작동합니다:

```bash
# 1. 코드 변경 작업
# 2. 변경사항 커밋
git add .
git commit -m "Implement new feature"

# 3. main 브랜치에 푸시
git push origin main

# 4. 자동 배포 시작 (2-3분 소요)
# GitHub Actions가 자동으로:
# - 프론트엔드 빌드
# - Vercel에 배포
# - 라이브 사이트 업데이트
```

## 자동 데이터 업데이트 + 배포

매일 밤 10PM UTC에:
1. `fetch-stock-data.yml` 워크플로우가 실행됩니다
2. 최신 주식 데이터를 가져와 `frontend/public/data/`에 저장
3. 변경사항을 main 브랜치에 푸시
4. `deploy.yml` 워크플로우가 자동 트리거
5. 업데이트된 데이터로 사이트 재배포

## 수동 배포 (필요시)

GitHub Actions 외에도 CLI로 직접 배포 가능:

```bash
# 프로덕션 배포
vercel --prod

# 또는 미리보기 배포 (테스트용)
vercel
```

## 환경 변수 설정 (필요시)

환경 변수가 필요한 경우:

1. **Vercel 대시보드**:
   - 프로젝트 → Settings → Environment Variables
   - 변수 추가

2. **CLI를 통한 설정**:
   ```bash
   vercel env add VARIABLE_NAME
   ```

## 프리뷰 배포

Pull Request를 생성하면 자동으로 프리뷰 배포가 생성됩니다:
- 각 PR마다 고유한 미리보기 URL 제공
- PR 코멘트에 자동으로 링크 추가
- 변경사항을 프로덕션 배포 전에 테스트 가능

## 배포 최적화

### 캐싱 전략

`vercel.json`에 설정된 캐싱:

- **데이터 파일** (`/data/*`): 1시간 캐싱 (`max-age=3600`)
  - 매일 업데이트되므로 짧은 캐싱
  - `must-revalidate`로 최신 데이터 보장

- **에셋 파일** (`/assets/*`): 1년 캐싱 (`max-age=31536000`)
  - 빌드마다 해시가 변경되므로 긴 캐싱 가능
  - `immutable` 플래그로 캐시 효율 극대화

### 번들 크기 모니터링

Vercel은 자동으로 번들 크기를 추적합니다:
- 대시보드에서 번들 크기 변화 확인
- 경고가 표시되면 코드 스플리팅 검토

## 도메인 설정 (옵션)

커스텀 도메인을 연결하려면:

1. **Vercel 대시보드**:
   - 프로젝트 → Settings → Domains
   - "Add" 클릭하여 도메인 입력

2. **DNS 설정**:
   - Vercel이 제공하는 DNS 레코드를 도메인 제공업체에 추가
   - A 레코드 또는 CNAME 레코드 설정

3. **SSL 인증서**:
   - Vercel이 자동으로 Let's Encrypt 인증서 발급
   - HTTPS 자동 적용

## 문제 해결

### 배포 실패 시

1. **GitHub Actions 로그 확인**:
   ```
   Actions 탭 → 실패한 워크플로우 → 로그 확인
   ```

2. **Vercel 로그 확인**:
   ```
   Vercel 대시보드 → 프로젝트 → Deployments → 실패한 배포 클릭
   ```

3. **로컬 빌드 테스트**:
   ```bash
   cd frontend
   npm run build
   ```

### 일반적인 오류

#### "Invalid credentials"
- `VERCEL_TOKEN`이 올바른지 확인
- 토큰이 만료되지 않았는지 확인

#### "Project not found"
- `VERCEL_PROJECT_ID`가 정확한지 확인
- `.vercel/project.json` 파일 내용 재확인

#### "Build failed"
- TypeScript 에러: `npm run build`로 로컬 테스트
- 의존성 문제: `npm ci`로 클린 설치

#### "Out of memory"
- Vercel 빌드 메모리 제한 초과
- 빌드 최적화 필요 (코드 스플리팅, 트리쉐이킹)

## 모니터링

### Vercel Analytics (옵션)

무료 분석 도구를 활성화하려면:

1. Vercel 대시보드 → 프로젝트 → Analytics
2. "Enable Analytics" 클릭
3. 방문자 수, 성능 지표 등 확인 가능

### 성능 모니터링

- **Web Vitals**: Core Web Vitals 자동 추적
- **빌드 시간**: 각 배포의 빌드 소요 시간 확인
- **번들 크기**: JavaScript 번들 크기 변화 추적

## 보안

### 환경 변수 보안
- `.env` 파일을 절대 커밋하지 마세요
- 민감한 정보는 Vercel 환경 변수로 관리
- GitHub Secrets는 암호화되어 저장됩니다

### 토큰 관리
- Vercel 토큰을 주기적으로 교체 (6개월마다 권장)
- 토큰 유출 시 즉시 재발급

## 유용한 명령어

```bash
# Vercel 프로젝트 정보 확인
vercel inspect

# 배포 목록 확인
vercel ls

# 특정 배포 제거
vercel rm <deployment-url>

# 로그 확인 (실시간)
vercel logs <deployment-url>

# 프로젝트 환경 변수 확인
vercel env ls
```

## 지원 및 문서

- **Vercel 공식 문서**: https://vercel.com/docs
- **GitHub Actions 문서**: https://docs.github.com/actions
- **프로젝트 문서**:
  - `CLAUDE.md`: 프로젝트 개요 및 명령어
  - `PRD.md`: 제품 요구사항
  - `PROJECT_KNOWLEDGE.md`: 아키텍처 문서

## 배포 체크리스트

초기 배포 시 확인사항:

- [ ] Vercel CLI 설치 완료
- [ ] Vercel 로그인 완료
- [ ] 프로젝트 초기화 완료
- [ ] GitHub Secrets 3개 모두 추가
- [ ] `.vercel` 폴더를 `.gitignore`에 추가
- [ ] 첫 배포 푸시 완료
- [ ] GitHub Actions 워크플로우 성공 확인
- [ ] 라이브 사이트 접속 확인
- [ ] 데이터 로딩 및 차트 렌더링 확인
- [ ] 라우팅 작동 확인 (페이지 이동 테스트)

---

**마지막 업데이트**: 2025-11-04
**배포 플랫폼**: Vercel
**CI/CD**: GitHub Actions
**프레임워크**: React 18 + Vite
