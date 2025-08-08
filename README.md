# limaetam-playground
Limaetam is short for 리눅스 매력 탐구하기 — a hands-on Linux exploration series. It's the first playground in the Jingaego Project (진정한 개발자로 거듭나자), built by the Oops2Ops crew to turn mistakes into mastery.

## 기능
- `/editor`에서 웹으로 글 작성
- Markdown 파일이 `posts/`에 저장되고 GitHub에 커밋
- 커밋 시 GitHub Actions 빌드 → Vercel로 배포

## 빠른 시작
1) 의존성 설치
```bash
npm ci
```

2) 환경변수 파일 생성
```bash
cp .env.example .env.local
# 값 채우기: GITHUB_TOKEN/OWNER/REPO/...
```

3) 로컬 실행
```bash
npm run dev
```
http://localhost:3000/editor 접속 → 글 작성 → Save & Commit

4) 배포
- GitHub 연결 후, 리포의 **Actions Secrets**에 다음 등록
  - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
  - `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_DEFAULT_BRANCH`
  - 선택: `POST_API_SECRET`
- main 브랜치로 push되면 자동 배포

## 참고
- 첫 글 예시: `posts/hello-world.md`
- 인증/권한은 추후 GitHub OAuth(NextAuth)로 확장 가능
