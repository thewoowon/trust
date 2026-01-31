# Trust - Vibe Security Scanner

웹 애플리케이션 보안 취약점을 자동으로 스캔하고, AI가 분석 결과와 수정 가이드를 제공하는 서비스입니다.

## 주요 기능

- **URL 보안 스캔**: Nuclei 기반 취약점 탐지
- **AI 분석**: Claude API를 활용한 취약점 설명 및 수정 가이드 (한국어)
- **Trust Badge**: 보안 점수 기반 신뢰 배지 발급
- **대시보드**: 스캔 결과 시각화 및 상세 리포트
- **MCP Server**: Claude Code, Claude Desktop, Cursor 등에서 바로 사용 가능

---

## MCP Server (Model Context Protocol)

Claude Code, Claude Desktop, Cursor IDE 등에서 **한 줄로 설치**하여 코딩 중 실시간 보안 피드백을 받을 수 있습니다.

### 설치 (Claude Code)

```bash
claude mcp add --transport http trust-security "https://trust-mcp-knnd76vaqq-du.a.run.app/mcp"
```

### 설치 (Claude Desktop / Cursor)

설정 파일에 추가:

```json
{
  "mcpServers": {
    "trust-security": {
      "type": "http",
      "url": "https://trust-mcp-knnd76vaqq-du.a.run.app/mcp"
    }
  }
}
```

**설정 파일 위치:**
- Claude Desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude Desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
- Cursor: Settings > MCP

### 사용 가능한 도구

| 도구 | 설명 | 사용 예시 |
|------|------|----------|
| `scan_url` | 웹사이트 보안 스캔 | "https://my-app.com 스캔해줘" |
| `check_secrets` | API 키/비밀번호 탐지 | "이 코드에 노출된 키 있어?" |
| `analyze_code_security` | SQL Injection, XSS 등 분석 | "이 코드 보안 문제 확인해줘" |
| `get_scan_result` | 스캔 결과 조회 | "스캔 결과 보여줘" |
| `get_fix_suggestion` | 수정 방법 제안 | "SQL Injection 어떻게 고쳐?" |

### 탐지 가능한 시크릿

AWS, GitHub, OpenAI, Anthropic, Stripe, Slack, Discord, Google, Firebase, Supabase, JWT, Private Keys 등 20+ 종류

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| **Frontend** | Next.js 16, React 19, TailwindCSS 4, Radix UI |
| **Backend** | FastAPI, Python 3.11+, Nuclei |
| **Database** | Supabase (PostgreSQL) |
| **AI** | Claude API (Anthropic) |
| **Deployment** | Vercel (Frontend), Cloud Run (Backend) |

---

## 프로젝트 구조

```
.
├── app/                      # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/               # React 컴포넌트
│   ├── trust/                # 주요 뷰 컴포넌트
│   │   ├── landing-view.tsx
│   │   ├── scanning-view.tsx
│   │   ├── dashboard-view.tsx
│   │   └── mcp-view.tsx
│   └── ui/                   # 공통 UI 컴포넌트
├── lib/                      # 유틸리티 및 API 클라이언트
│   ├── api.ts
│   ├── types.ts
│   └── utils.ts
│
├── backend/                  # Backend 소스
│   ├── app/
│   │   ├── main.py           # FastAPI 엔트리포인트
│   │   ├── config.py         # 환경설정
│   │   ├── api/routes/       # API 라우터
│   │   │   ├── scan.py       # 스캔 API
│   │   │   ├── analyze.py    # AI 분석 API
│   │   │   └── badge.py      # 배지 API
│   │   ├── models/           # Pydantic 스키마
│   │   └── services/         # 비즈니스 로직
│   │       ├── nuclei_scanner.py
│   │       ├── claude_analyzer.py
│   │       └── supabase_client.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── mcp-server/               # MCP Server (독립 서비스)
│   ├── server.py             # FastMCP Streamable HTTP
│   ├── requirements.txt
│   └── Dockerfile
│
├── supabase/                 # 데이터베이스
│   ├── schema.sql            # 테이블 DDL
│   └── DATABASE_SCHEMA.md    # 스키마 문서
│
└── docs/                     # 문서
    ├── DEVELOPMENT_PLAN.md
    └── IMPLEMENTATION_CHECKLIST.md
```

---

## 시작하기

### 사전 요구사항

- Node.js 20+
- Python 3.11+
- Nuclei (보안 스캐너)
- Supabase 계정
- Anthropic API 키

### 1. 저장소 클론

```bash
git clone https://github.com/[your-username]/trust-security-scanner.git
cd trust-security-scanner
```

### 2. Frontend 설정

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 값을 설정하세요

# 개발 서버 실행
npm run dev
```

**Frontend 환경변수 (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Backend 설정

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# Nuclei 설치 (macOS)
brew install nuclei

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어 값을 설정하세요

# 개발 서버 실행
uvicorn app.main:app --reload --port 8000
```

**Backend 환경변수 (.env)**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLAUDE_API_KEY=sk-ant-api03-your-key
ENVIRONMENT=development
```

### 4. 데이터베이스 설정

Supabase SQL Editor에서 `supabase/schema.sql` 실행

---

## API 엔드포인트

### 스캔 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/api/scan` | 새 스캔 시작 |
| `GET` | `/api/scan/{scan_id}` | 스캔 상태 조회 |
| `GET` | `/api/scan/{scan_id}/vulnerabilities` | 취약점 목록 |

### 분석 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/api/analyze/{scan_id}` | AI 분석 시작 |
| `GET` | `/api/analyze/{vuln_id}` | 분석 결과 조회 |

### 배지 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/api/badge/{scan_id}` | 배지 발급 |
| `GET` | `/api/badge/{badge_id}` | 배지 조회 |

### MCP Server (독립 서비스)

MCP 서버는 별도 Cloud Run 서비스로 배포됩니다:
- **URL**: `https://trust-mcp-knnd76vaqq-du.a.run.app/mcp`
- **트랜스포트**: Streamable HTTP

---

## 배포

### Frontend (Vercel)

1. [Vercel Dashboard](https://vercel.com)에서 GitHub 저장소 연결
2. Framework Preset: `Next.js`
3. 환경변수 설정
4. Deploy

### Backend (Cloud Run)

```bash
cd backend

# Docker 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/[PROJECT_ID]/trust-backend

# Cloud Run 배포
gcloud run deploy trust-backend \
  --image gcr.io/[PROJECT_ID]/trust-backend \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars "SUPABASE_URL=...,CLAUDE_API_KEY=..."
```

---

## 개발 가이드

### 브랜치 전략

- `main`: 프로덕션 배포
- `develop`: 개발 통합
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드, 설정 변경
```

### PR 체크리스트

- [ ] 로컬에서 테스트 완료
- [ ] 린트 에러 없음 (`npm run lint`)
- [ ] 타입 에러 없음
- [ ] 환경변수 추가 시 `.env.example` 업데이트

---

## 데이터베이스 스키마

자세한 내용은 [DATABASE_SCHEMA.md](./supabase/DATABASE_SCHEMA.md) 참조

### 주요 테이블

| 테이블 | 설명 |
|--------|------|
| `scans` | 스캔 기록 |
| `vulnerabilities` | 발견된 취약점 |
| `ai_cache` | AI 분석 캐시 |
| `trust_badges` | 발급된 배지 |

---

## 문제 해결

### Nuclei 설치 오류

```bash
# macOS
brew install nuclei

# Linux
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 템플릿 업데이트
nuclei -update-templates
```

### CORS 오류

Backend의 `main.py`에서 allowed origins 확인:
```python
origins = [
    "http://localhost:3000",
    "https://your-domain.vercel.app"
]
```

### Supabase 연결 오류

1. Supabase 대시보드에서 API 키 확인
2. RLS(Row Level Security) 정책 확인
3. 서비스 롤 키 사용 여부 확인 (Backend)

---

## 라이선스

MIT License

---

## 팀

2026 빌더톤 프로젝트
