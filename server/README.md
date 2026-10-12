# 온도 · Supabase 공용 Gemini 서버

현재 운영 방식은 성령말씀과 같은 **Supabase Edge Functions → Secrets**입니다. 사주 전용 함수 `saju-ai`와 독립 한도 테이블을 배포했습니다.

## 키 등록 · 운영자가 할 일

1. [성령말씀 Supabase 프로젝트의 Secrets 화면](https://supabase.com/dashboard/project/maoylwwnluyyfmwqfkfl/functions/secrets)을 엽니다.
2. 새 Secret의 **Name / Key**에 `SAJU_GEMINI_API_KEY`를 입력합니다.
3. **Value**에 사용할 Gemini API 키를 붙여 넣고 **Save**를 누릅니다. 기존 성령말씀의 `GEMINI_API_KEY`는 수정하지 않습니다. 같은 Google 키를 사용하고 싶다면 동일한 값을 새 사주용 이름에 등록할 수 있습니다.
4. 사주 앱을 새로고침하고 상세 풀이를 생성합니다. 새 비밀키 등록에는 함수 재배포가 필요하지 않습니다. 실제 키를 채팅이나 GitHub에 올리지 않습니다.

기본 모델은 성령말씀 기본값과 같은 `gemini-3.5-flash-lite`입니다. 필요하면 별도 Secret `SAJU_GEMINI_MODEL`에 사용 가능한 모델 ID를 등록합니다. 사주 서버는 기존 성령말씀 키를 자동으로 가져오거나 보조키로 전환하지 않습니다. 같은 Google 프로젝트의 키는 그 프로젝트의 할당량과 결제에 영향을 줄 수 있습니다.

## 고전 관상 풀이 요청

같은 `saju-ai` 함수와 같은 `SAJU_GEMINI_API_KEY`·한도 테이블을 씁니다. 본문이 `{ "face": { "image": { "mime": "image/jpeg", "data": "<base64>" } } }`이면 사진 풀이로 처리하며 본문 상한은 약 1.5MB(일반 사주 요청은 16KB 유지)입니다. 지침은 `server/face.mjs`에만 있고 방문자가 바꿀 수 없습니다. 사진은 저장·로그하지 않습니다. **함수 코드가 바뀌었으므로 `supabase/functions/saju-ai/index.ts`를 다시 배포해야 사진 풀이가 동작합니다.** 키 재등록은 필요 없습니다.

## 운영 구조

- 기존 Supabase 프로젝트에 사주 전용 `saju-ai`만 추가했습니다. 기존 함수·비밀키·사용량·회원 권한은 변경하지 않았습니다.
- 프런트에는 공개 anon JWT만 있습니다. Gemini 키와 service-role 키는 서버에서만 읽습니다. Edge gateway의 JWT 검증을 유지하기 위해 legacy anon JWT를 사용합니다. 이는 공개 프로젝트 식별용이며 회원 인증이 아닙니다.
- 전체 하루 1000회, 같은 브라우저 하루 50회, 10초 간격입니다. 기존 DB는 `supabase/saju-quota-raise.sql`을 SQL 편집기에서 한 번 실행해야 바뀝니다. 브라우저 구분은 무작위 UUID이므로 데이터 삭제나 다른 브라우저 이용으로 바뀔 수 있습니다. 전체 일일 상한은 서버 DB 행 잠금으로 강제합니다.
- KST 자정이 지나 첫 예약에서 전날 식별값·횟수를 교체합니다. 호출 실패와 중단도 차감하며 자동 재시도하지 않습니다. 사주 내용과 결과는 서버 DB에 저장하지 않습니다.
- `saju_generation_budget` 테이블은 RLS를 켜고 anon/authenticated 접근을 제거했습니다. `saju_reserve_generation`은 SECURITY INVOKER이며 서버 service_role만 실행할 수 있습니다.
- 앱의 호출 횟수 제한은 금액 한도가 아닙니다. Google/Supabase 정책과 계정별 요금이 적용됩니다.
- 키가 없으면 503으로 중단합니다. 기존 성령말씀용 `GEMINI_API_KEY`를 대신 쓰지 않습니다.
- 긴급 중지는 `SAJU_GEMINI_API_KEY` 삭제로 가능합니다.

## 개발·검증

원본: `server/supabase.mjs`, `server/worker.mjs`, `server/report.mjs`. 배포 파일: `supabase/functions/saju-ai/index.ts`. esbuild로 `server/supabase-entry.mjs`를 ESM 번들로 생성합니다. 설정은 `supabase/config.toml`, DB 설치 원본은 `supabase/saju-quota.sql`입니다.

브라우저·공통 서버·Supabase 어댑터 모의 테스트를 통과했습니다. 실제 DB의 한도·간격·날짜 변경 검사를 트랜잭션 후 rollback했고, 공개 역할의 접근 거부를 확인했습니다. 새 한도 테이블의 RLS 정책 없음은 서버 전용이므로 의도된 기본 거부입니다. 기존 프로젝트의 다른 보안 진단 항목은 이번 사주 변경 범위 밖입니다. 관련 [RLS 진단 설명](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). 실제 Gemini 생성은 운영자 키 등록 후 확인해야 합니다.
