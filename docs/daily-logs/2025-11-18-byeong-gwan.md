# Daily Log
작성자: Byeong-gwan <br>
작업 기간: 7h

### 2025. 11. 18. 화요일
- 한일
  - [x] .gitignore 복구 및 불필요 산출물 추적 방지 설정
  - [x] Zustand 일기 스토어(useDiaryStore) 복원 및 동작 확인
  - [x] MoodPicker 컴포넌트/스타일 파일 복원
  - [x] Vite 실행 권한 오류(permission denied) 원인 분석 및 해결 가이드 정리
  - [x] docs 템플릿/일일 로그 파일 생성
  - [x] 프로젝트 디렉토리 구조 정리/생성
  - [x] README 작성/정리


- 상세
  - git: .gitignore에 node_modules, dist, build, .vite, 로그, 환경파일 등 추가. 이미 추적된 산출물은 `git rm -r --cached <paths>`로 추적 해제 권고
  - 상태관리: Zustand 스토어(persist, localStorage) 재구성. `addDiary/getDiary/listDiaries` 확인
  - UI: MoodPicker.jsx / MoodPicker.style.css 복원. 키보드 내비게이션 및 선택 스타일 유지
  - Dev 서버: `node_modules/.bin/vite` 실행 권한 부재로 인한 오류 → `chmod +x` 또는 node_modules 재설치 절차 제시
  - 문서: docs/daily-logs/2025-11-18-byeong-gwan.md 생성, templates/daily-log-template.md 유지
  - 디렉토리 구조: 주요 경로 생성/정리
    - src/app/store (zustand 스토어)
    - src/pages/diary/diary-List, diary-create, diary-detail (페이지 구성)
    - src/components/mood-picker (MoodPicker 컴포넌트)
    - docs/templates, docs/daily-logs (문서/템플릿)
  - README: 프로젝트 개요/커밋 규칙/일지 작성 규칙 정리
  
  
- 회고
  - 디렉토리 구조 셋팅을 했으며 생각보다 시간 소모가 많이 되었다. 혼자 하는게 아니다 보니 각자의 편의성을 생각해보고 명확하게 해야 혼돈이 안생길거 같아서 
    여러가지 고민을 해보고 구조를 짰지만 여전히 마음에 안드는거 같음...
  - README 파일을 통해 실행 방법 구체적인 스텟 등등 정리했고, 최대한 모르는 사람들이 봐도 이해할 수 있게 하려고 노력
  - 문서 작업 권유 추후 발표나 기록을 통해서 각자가 했던 작업 내용을 구체적으로 볼 수 있으면 좋을거 같아서 권유
    (문서 템플릿도 통일성 있게 하면 깔끔할거 같아서 샘플링 정리) 
  - 환경/권한/외부 인증 설정 이슈를 빠르게 진단·정리하여 개발 흐름을 회복했다.

.
