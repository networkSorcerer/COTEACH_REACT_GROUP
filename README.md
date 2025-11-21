 # Emotion Diary (React + Vite)

 3일 내에 빠르게 완성할 수 있도록 최대한 단순하게 구성했습니다. 아래 순서대로 설치/실행하고, 페이지별 디렉토리를 기준으로 작업을 나눠 진행하세요.

 ## 실행 방법 (Installation & Run)

 1) 의존성 설치
 ```bash
 npm install
 # 필수 라이브러리 설치 (라우팅/쿼리/상태/스타일/API)
 npm i react-router-dom @tanstack/react-query zustand react-bootstrap bootstrap axios
 ```

 2) 개발 서버 실행
 ```bash
 npm run dev
 ```

 3) (선택) 환경변수
 - Google 로그인/GPT 사용 시 `.env` 파일에 아래 설정을 추가합니다.
 ```env
 VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
 # 브라우저 직접 호출은 키 노출 위험이 있어 개발용으로만 사용 권장
 VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY
 ```

 ## Node/React 버전

 - Node: 20.x (권장: 20 LTS)
 - React: 19.2.0
 - react-dom: 19.2.0

 개발 도구
 - Vite: 7.x

 위 버전 정보는 현재 `package.json` 기준입니다.

 ## 프로젝트 구조(필수 작업 위치 표시)

```
src/
  app/
    providers/
      QueryClientProvider.jsx      # 전역 React Query Provider
    router/
      index.jsx                    # 라우팅 정의(페이지 경로 등록)
    store/
      auth.js                      # 전역 인증(필요 시)
      diary.js                     # 전역 선택 상태 등(필요 시)
    styles/
      global.css                   # 전역 최소 스타일
    hooks/
      useMoodFillNavigation.js     # 카드 클릭 시 감정색 물결 애니메이션 후 네비게이션(전역 위임)

  asset/                          # 이미지 저장

  components/
    common/
      GoogleLoginButton.jsx        # Google 로그인 버튼(필요 시 구현)
      GoogleLoginButton.css        # 버튼 스타일
    # (선택) Chat 관련 공용 컴포넌트를 추가할 수 있으나,
    # DiaryDetailPage 내부에서 모달 UI를 구현 가능

  layouts/
    RootLayout.jsx                 # 공용 레이아웃(Navbar + Outlet)

  pages/
    auth/
      LoginPage.jsx                # 로그인 페이지(필요 시 구현)
      RegisterPage.jsx             # 회원가입 페이지(필요 시 구현)

    diary/
      diary-List/
        DiaryListPage.jsx          # [담당 작업] 감정일기 목록 페이지
        DiaryListPage.style.css    #   목록 전용 스타일
      diary-create/
        DiaryCreatePage.jsx        # [담당 작업] 감정일기 작성 페이지
        DiaryCreatePage.style.css  #   작성 전용 스타일
      diary-detail/
        DiaryDetailPage.jsx        # [담당 작업] 감정일기 상세 페이지
        DiaryDetailPage.style.css  #   상세 전용 스타일

    my/
      MyPage.jsx                   # 내 정보/아바타 업로드/월별 감정 그래프/명언
      MyPage.style.css             # My 페이지 스타일

  hooks/
    useChatGPT.js                  # OpenAI 호출용 React Query 훅
    useAdvice.js                   # 오늘의 명언 React Query 훅

  services/
    openaiClient.js                # OpenAI Chat Completions API 호출 함수
    adviceClient.js                # 오늘의 명언 API 클라이언트(fetchKoreanAdvice)

  main.jsx                         # 엔트리: Router/Provider/스타일 연결
  App.jsx                          # Vite 템플릿 기본 파일(사용 안 해도 됨)
```

- 페이지는 기능별 디렉토리로 분리되어 있습니다.
- 각 페이지는 자신의 `.style.css`만 import해서 스타일 충돌을 최소화합니다.
- 라우팅은 `app/router/index.jsx` 한 곳에서만 관리합니다.
- 등록된 경로: `/`, `/diary/new`, `/diary/:id`, `/my`
- GPT 호출은 `services/openaiClient.js`(API) + `hooks/useChatGPT.js`(훅)로 구성하고,
  UI는 현재 `DiaryDetailPage.jsx` 내 모달로 구현했습니다.
  - "AI 요청" 버튼 클릭 → 모달 열림 → 요청(최대 3회) → 확인 시 본문 하단에 AI 답변 추가
  - 답변이 길면 ...으로 줄이고 "더보기/접기"로 토글
  (현재 프로젝트에서는 OpenAI 연동을 보류할 수 있으며, 별도의 명언 API를 사용합니다.)

### UI/UX 보완 사항(요약)
- 목록 카드: 감정별 좌측 포인트 바, 클릭 시 감정색 물결 애니메이션 후 상세 이동(전역 훅)
- 목록 페이징: 로그인 상태이면서 2페이지 이상일 때만 노출, 페이지 전환 시 상단으로 스무스 스크롤
- New 버튼: 로그인 필요 안내 처리
- My 페이지: 동그란 아바타 업로드(+), 사용자 정보, 월별 감정 그래프(막대 클릭 시 해당 월/감정으로 목록 이동), 오늘의 명언 노출

## 필수 라이브러리 용도

- react-router-dom
  - 페이지 이동(목록/작성/상세 라우팅)
- @tanstack/react-query
  - 서버 데이터(목록/상세/작성 요청) 캐싱/상태관리
- zustand
  - 클라이언트 전역 상태(예: 로그인 사용자, 선택된 아이템 등) — 최소 사용 권장
- react-bootstrap, bootstrap
  - UI 컴포넌트/유틸리티 클래스(간단하고 빠른 화면 구성)
- axios
  - API 통신 클라이언트(필요 시 서비스 레이어에서 사용)

## 작업 가이드

- 목록/작성/상세는 각각 독립 페이지입니다.
  - `/` → DiaryListPage
  - `/diary/new` → DiaryCreatePage
  - `/diary/:id` → DiaryDetailPage
- 각자 맡은 페이지 디렉토리에서 JSX/CSS를 수정하면 됩니다.
- 전역 변경(레이아웃/라우팅/프로바이더)은 각각 `layouts/`, `app/router/`, `app/providers/`에서만 수정합니다.
- 가능하면 Bootstrap 유틸리티 클래스로 빠르게 스타일링하고, 필요한 최소 커스텀만 각 페이지 `.style.css`에 작성합니다.

## 팁(3일 완성용 최소 규칙)

- 페이지/컴포넌트 이름은 PascalCase
- 훅 이름은 `use*`
- 서비스(API 호출)는 `src/services/`에 함수로 분리 후 페이지 훅에서 사용
- 전역 상태는 꼭 필요한 것만 `zustand`로 관리
- true/false 값 확인 하는 변수인 경우 is~ 로 시작

 ## 커밋 메시지 규칙 (팀 통일)
 
 - 형식: `type: [scope] subject`
 - 예시: `feat: [login] auth 로그인 기능 추가 (Google 연동)`
 - 가이드: `feat: ['어떤작업'] '작업한 폴더 이름 + 기능 내용(상세 내용 요약)`
 
 허용 type
 - feat: 새로운 기능
 - fix: 버그 수정
 - refactor: 리팩토링(기능변화 없음)
 - docs: 문서 변경(README 등)
 - style: 코드 스타일(포맷팅, 세미콜론 등)
 - test: 테스트 추가/수정
 - chore: 빌드/설정/잡무
 
 scope(예)
 - login, diary-list, diary-detail, diary-create, router, layout, hooks, services 등
 
 subject(예)
 - `auth 로그인 기능 추가 (Google 연동)`
 - `diary 목록 카드 UI 정리`
 
 ## 데일리 로그 규칙 (개인별 md)
 
 - 위치: `docs/daily-logs/{memberId}.md`
 - 매일 항목: 날짜 / 한일 / 상세 내용 / 회고
 - 템플릿: `docs/templates/daily-log-template.md` 참고(복사해서 사용)
 
 템플릿 예시
 ```md
 # {memberId} Daily Log
 
 ## 2025-11-18
 - 한일: [예] diary 상세 페이지 AI 요청 모달 구현 (3회 제한, 더보기/접기)
 - 상세: [예] useChatGPT 훅 사용해 openaiClient 연결, 모달 UI, 미리보기/확인 버튼 처리
 - 회고: [예] API 키 브라우저 노출 이슈로 프록시 검토 필요
 ```

# 실행이 되지 않으면 
```bash
rm -rf node_modules package-lock.json
npm cache verify
npm install
npm run dev
```

 ---

 필요한 내용만 최소한으로 담았습니다. 각자 맡은 페이지 폴더에서 바로 작업을 시작하세요.
