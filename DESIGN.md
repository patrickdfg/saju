# 2026-10-14 · 이미지 중심 디자인 개편

- 홈: 짧은 제목, 온도책 대표 이미지, 오늘의 흐름, 그림 메뉴 카드 4개.
- 모바일: 여섯 메뉴를 하단에 고정하고 업데이트 알림·토스트가 메뉴를 가리지 않도록 배치.
- 사주: 자연 상징 일러스트와 핵심 두 가지를 먼저 표시. 생활 제안과 계산표를 구분.
- AI: 9개 주제 미리보기는 접고, 전송 동의와 생성 버튼은 명확하게 유지.
- 기존 계산·저장·생일·온도책·API 동작은 유지. 숨겨진 타로는 그대로 숨김.
- 그림 파일은 로컬 제공하며 외부 이미지 서비스에 의존하지 않음. 본문 15~16px, 높은 명도 대비, 키보드 초점과 동작 줄이기 설정 지원.

## 이미지 제작

`assets/design/ondo-book-hero.webp`: 내장 image_gen으로 생성한 원본 PNG를 웹용 WebP로 압축. 원본의 장면을 바꾸지 않음.
프롬프트: premium matte-clay and paper illustration of an open ivory book with lavender cloth binding, floating golden star and crescent moon; deep plum background, book concentrated on the right with empty left space for HTML copy; warm studio lighting; landscape; no letters, logo, UI, watermark.

`assets/design/*.svg`: 이 프로젝트에서 작성한 달력·달·거울·책·오행 상징·내비게이션 벡터 그래픽.

## 확인

기존 npm test 전체 통과. 실제 AI 생성·사진 전송은 디자인 검증에서 실행하지 않음. 배포 후 공개 화면의 레이아웃과 탐색 흐름을 확인.
