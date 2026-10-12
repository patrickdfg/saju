# 온도 · Supabase 공용 Gemini 서버

현재 운영 방식은 성령말씀과 같은 **Supabase Edge Functions → Secrets**입니다. 사주 전용 함수 `saju-ai`와 독립 한도 테이블을 배포했습니다.

## 키 등록 · 운영자가 할 일

1. [성령말씀 Supabase 프로젝트의 Secrets 화면](https://supabase.com/dashboard/project/maoylwwnluyyfmwqfkfl/functions/secrets)을 엽니다.
2. 새 Secret의 **Name / Key**에 `SAJU_GEMINI_API_KEY`를 입력합니다.
3. **Value**에 사용할 Gemini API 키를 붙여 넣고 **Save**를 누릅니다. 기존 성령말씀의 `GEMINI_API_KEY`는 수정하지 않습니다. 같은 Google 키를 사용하고 싶다면 동일한 값을 새 사주용 이름에 등록할 수 있습니다.
4. 사주 앱을 새로고침하고 상세 풀이를 생성합니다. 새 비밀키 등록에는 함수 재배포가 필요하지 않습니다. 실제 키를 채팅이나 GitHub에 올리지 않습니다.

기본 모델은 성령말씀 기본값과 같은 `gemini-3.5-flash-lite`입니다. 필요하면 별도 Secret `SAJU_GEMINI_MODEL`에 사용 가능한 모델 ID를 등록합니다. 사주 서버는 기존 성령말씀 키를 자동으로 가져오거나 보조키로 전환하지 않습니다. 같은 Google 프로젝트의 키는 그 프로젝트의 할당량과 결제에 영향을 줄 수 있습니다.

## 운영 구조

- 기존 Supabase 프로젝트에 사주 전용 `saju-ai`만 추가했습니다. 기존 함수·비밀키·사용량·회원 권한은 변경하지 않았습니다.
- 프런트에는 공개 anon JWT만 있습니다. Gemini 키와 service-role 키는 서버에서만 읽습니다. Edge gateway의 JWT 검증을 유지하기 위해 legacy anon JWT를 사용합니다. 이는 공개 프로젝트 식별용이며 회원 인증이 아닙니다.
- 전체 하루 30회, 같은 브라우저 하루 3회, 60초 간격입니다. 브라우저 구분은 무작위 UUID이므로 데이터 삭제나 다른 브라우저 이용으로 바뀔 수 있습니다. 전체 일일 상한은 서버 DB 행 잠금으로 강제합니다.
- KST 자정이 지나 첫 예약에서 전날 식별값·횟수를 교체합니다. 호출 실패와 중단도 차감하며 자동 재시도하지 않습니다. 사주 내용과 결과는 서버 DB에 저장하지 않습니다.
- `saju_generation_budget` 테이블은 RLS를 켜고 anon/authenticated 접근을 제거했습니다. `saju_reserve_generation`은 SECURITY INVOKER이며 서버 service_role만 실행할 수 있습니다.
- 앱의 호출 횟수 제한은 금액 한도가 아닙니다. Google/Supabase 정책과 계정별 요금이 적용됩니다.
- 키가 없으면 503으로 중단합니다. 기존 성령말씀용 `GEMINI_API_KEY`를 대신 쓰지 않습니다.
- 긴급 중지는 `SAJU_GEMINI_API_KEY` 삭제로 가능합니다.

## 개발·검증

원본: `server/supabase.mjs`, `server/worker.mjs`, `server/report.mjs`. 배포 파일: `supabase/functions/saju-ai/index.ts`. esbuild로 `server/supabase-entry.mjs`를 ESM 번들로 생성합니다. 설정은 `supabase/config.toml`, DB 설치 원본은 `supabase/saju-quota.sql`입니다.

브라우저·공통 서버·Supabase 어댑터 모의 테스트를 통과했습니다. 실제 DB의 한도·간격·날짜 변경 검사를 트랜잭션 후 rollback했고, 공개 역할의 접근 거부를 확인했습니다. 새 한도 테이블의 RLS 정책 없음은 서버 전용이므로 의도된 기본 거부입니다. 기존 프로젝트의 다른 보안 진단 항목은 이번 사주 변경 범위 밖입니다. 관련 [RLS 진단 설명](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). 실제 Gemini 생성은 운영자 키 등록 후 확인해야 합니다.

## 이전 Cloudflare 대안

아래 내용은 별도 Cloudflare 서버를 직접 운영할 때의 대안입니다. 현재 Supabase 연결에서는 필요 없습니다.

## 연결 순서

1. [Google AI Studio](https://aistudio.google.com/api-keys)에서 운영자 키를 발급합니다. 이 키를 채팅, GitHub 파일, 커밋 메시지에 붙여 넣지 않습니다.
2. [Cloudflare](https://dash.cloudflare.com/) 계정을 준비합니다. PC에 현재 지원되는 Node.js와 Git을 설치하고 아래를 실행합니다.

```sh
git clone https://github.com/patrickdfg/saju.git
cd saju
npx wrangler@4 login
npx wrangler@4 deploy --config server/wrangler.jsonc
npx wrangler@4 secret put GEMINI_API_KEY --config server/wrangler.jsonc
```

마지막 명령의 숨겨진 입력 프롬프트에만 실제 키를 붙여 넣습니다. 최초 배포는 키가 없어 AI 호출이 잠긴 상태입니다. `secret put`은 새 버전을 배포합니다. 웹에서 등록하려면 Cloudflare의 Workers & Pages → `ondo-saju-api` → Settings → Variables and Secrets → Add에서 **Secret** 유형, 이름 `GEMINI_API_KEY`로 등록하고 배포합니다.

3. 배포 결과에 나오는 실제 `https://ondo-saju-api.…workers.dev` 주소를 기록합니다. `/health`를 열어 `ready: true`인지 확인합니다. 이것은 설정 확인이며 실제 Google 호출 성공을 보장하지는 않습니다.
4. 저장소 루트 `ai-config.js`의 빈 문자열을 **해당 서버 주소 + `/api/saju`**로 변경해 커밋합니다. 이 주소는 공개해도 되는 URL이며 키가 아닙니다. 주소만 전달하면 앱 연결 작업을 이어서 할 수 있습니다.
5. 앱을 새로고침하고 사주 계산 → 전송 동의 → 상세 풀이 생성을 한 번 눌러 실제 응답을 확인합니다. 이 마지막 테스트는 운영자 계정의 API 사용량에 포함됩니다.

## 기본 운영 설정

- 방문자의 API 키 입력 없음. 운영자 키는 Worker Secret에서만 읽고 Google 요청 헤더에만 사용합니다.
- 전체 하루 **30회**, 같은 IP 하루 **3회**, 요청 간격 **60초**. 한국시간 자정 기준입니다. `worker.mjs`의 `LIMITS`와 프런트 안내 문구를 함께 바꿔야 합니다.
- Durable Object 하나의 트랜잭션으로 **호출 전** 횟수를 차감합니다. 동시 요청에도 전체 한도를 초과해 Google을 호출하지 않습니다. 실패·취소도 차감하며 자동 재시도하지 않습니다.
- 데이터베이스/비밀키/접속 IP를 확인하지 못하면 호출하지 않습니다. 클라이언트의 모델·토큰·프롬프트 변경 요청을 받지 않습니다.
- 모델은 `wrangler.jsonc`의 `GEMINI_MODEL`에서 운영자가 지정합니다. 기본 `gemini-3.8-flash`는 작성 시 Google 공식 예시 기준이며, 계정에서 사용할 수 있는 모델인지 확인해야 합니다.
- 요청 최대 16KB, 출력 최대 12,288토큰, 80초 제한. 일일 요청 상한은 금액 상한이 아니며 Google·Cloudflare 이용 요금은 각각 계정 설정에 따릅니다.
- 접속 IP 원문, 사주 내용, 결과, 키는 애플리케이션 로그/DB에 저장하지 않습니다. 일별 HMAC 식별값과 횟수만 저장하고 자정 후 삭제합니다. 호스팅 제공자의 보안 로그·백업 정책은 별도입니다.
- 기본 허용 브라우저 출처는 `https://patrickdfg.github.io`입니다. CORS는 사용자 인증이 아니며 외부 프로그램의 요청을 완전히 차단하지 못합니다. IP 변경·공유 Wi-Fi의 한계가 있으므로 **전체 하루 상한**을 함께 유지합니다. 대규모 공개 운영 전에는 로그인/봇 검증을 추가할 수 있습니다.
- 긴급 중지: Cloudflare에서 `GEMINI_API_KEY`를 삭제하고 배포하거나 Worker를 비활성화합니다.

## 검증 범위

`npm test`는 브라우저 모의 테스트와 서버 모의 테스트를 포함합니다. 키가 없으므로 실제 Gemini 응답과 Cloudflare 운영 배포는 검증하지 않았습니다. `npx wrangler@4 deploy --dry-run --config server/wrangler.jsonc`로 배포 묶음을 확인할 수 있습니다.

공식 참고: [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [Durable Objects](https://developers.cloudflare.com/durable-objects/get-started/), [Gemini API](https://ai.google.dev/api/generate-content).
