# 기술 블로그 사이트

Next.js 기반의 기술 블로그 사이트입니다. 웹에서 마크다운으로 글을 작성하고, 자동으로 Git에 커밋되며, CI/CD를 통해 배포되는 현대적인 블로그 시스템입니다.

## 주요 기능

- 🖊️ **웹 기반 마크다운 에디터**: 브라우저에서 직접 글 작성
- 🔄 **자동 Git 커밋**: 글 작성 시 GitHub에 자동 커밋
- 🚀 **CI/CD 파이프라인**: GitHub Actions를 통한 자동 빌드 및 배포
- ⚡ **빠른 성능**: Next.js 정적 사이트 생성으로 최적화된 성능
- 🎨 **반응형 디자인**: 모든 기기에서 최적화된 경험

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Content Management**: Markdown/MDX, Gray Matter
- **Git Integration**: Octokit (GitHub API)
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 설치 및 실행

1. 프로젝트 클론 및 의존성 설치:
```bash
git clone <repository-url>
cd limaetam-playground
npm install
```

2. 환경 변수 설정:
```bash
cp .env.example .env.local
```

`.env.local` 파일에서 다음 값들을 설정하세요:
```bash
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repo-name
GITHUB_TOKEN=your-github-personal-access-token
```

3. 개발 서버 실행:
```bash
npm run dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 사용법

### 새 글 작성
1. 메인 페이지에서 "새 글 작성" 버튼 클릭
2. `/editor` 페이지에서 글 작성
3. "저장 및 커밋" 버튼으로 GitHub에 자동 커밋

### 배포 설정

#### Vercel 배포
1. Vercel에 프로젝트 연결
2. 환경 변수 설정:
   - `GITHUB_OWNER`
   - `GITHUB_REPO` 
   - `GITHUB_TOKEN`

#### GitHub Actions 설정
다음 Secrets를 GitHub 리포지토리에 추가:
- `VERCEL_TOKEN`: Vercel 토큰
- `VERCEL_ORG_ID`: Vercel 조직 ID
- `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID

## 프로젝트 구조

```
├── src/
│   ├── app/
│   │   ├── api/posts/          # API 엔드포인트
│   │   ├── editor/             # 글 작성 페이지
│   │   ├── posts/[slug]/       # 개별 포스트 페이지
│   │   └── page.tsx            # 메인 페이지
│   ├── components/
│   │   ├── PostEditor.tsx      # 글 작성 에디터
│   │   └── PostList.tsx        # 포스트 목록
│   ├── lib/
│   │   ├── posts.ts            # 포스트 관리 유틸리티
│   │   ├── git.ts              # Git 자동화
│   │   └── utils.ts            # 공통 유틸리티
│   └── types/
│       └── post.ts             # 타입 정의
├── content/posts/              # 마크다운 포스트 파일들
├── .github/workflows/          # GitHub Actions 워크플로우
└── public/                     # 정적 자산
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.
