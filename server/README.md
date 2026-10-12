# 온도 · 운영자 공용 Gemini 서버

상태: 서버 코드는 준비되어 있습니다. Cloudflare 배포와 `GEMINI_API_KEY` 비밀키 등록, 프런트의 API 주소 설정을 완료해야 AI 기능이 켜집니다. GitHub Pages만으로는 서버 비밀키를 실행할 수 없습니다.

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
