# 온도 v2 — 공개 프로젝트 비교·통합 기록

검토일: 2026-10-12. GitHub 전체를 빠짐없이 수집했다는 의미는 아닙니다. 검색으로 찾은 관련 공개 프로젝트 중 아래 저장소의 설명·라이선스 또는 소스를 검토하고, 정적 한국어 웹앱에 적합한 기능을 골랐습니다. 출생 정보와 사진을 외부 AI 서비스에 보내지 않습니다.

## 사주 비교

| 프로젝트 | 확인한 장점 | 이번 적용 |
|---|---|---|
| [yhj1024/manseryeok](https://github.com/yhj1024/manseryeok) | 한국 음력 표, 절기 순간, 자시 3가지 기준, 진태양시, 십신·대운·공망, 테스트 | **주 계산 엔진으로 통합**. MIT 원본 소스를 `vendor-src/manseryeok`에 보관하고 브라우저 번들 생성 |
| [golbin/ssaju](https://github.com/golbin/ssaju) | 가벼운 구조, 지장간·십이운성·상세표·읽기 쉬운 출력 | **MIT 지장간 표 사용**, 봉법 십이운성 규칙을 참고해 함수 구현. 원국·해석·저장 텍스트를 나누는 설계 반영 |
| [6tail/lunar-javascript](https://github.com/6tail/lunar-javascript) | 천문 절기·간지 계산 | 이전 버전의 직접 실행 엔진. 새 엔진의 절기 보정표 생성 원천으로 간접 사용되므로 MIT 고지 유지 |
| [usingsky/korean_lunar_calendar_js](https://github.com/usingsky/korean_lunar_calendar_js) | 독립적인 한국 음력·윤달 변환 | 런타임에는 추가하지 않음. **1,428개 날짜의 음력 결과를 교차검증**하는 기준으로 사용 |
| [bunhine0452/k-saju](https://github.com/bunhine0452/k-saju) | 절기 시각·자시·시간대 기준을 명시하고 계산과 해석을 분리 | **계산 옵션·절기 경계 안내·계산 기준 공개**에 반영. 다른 엔진의 결과를 섞지 않음 |
| [urstory/manseryeok-js](https://github.com/urstory/manseryeok-js) | 한국 음력, JavaScript/TypeScript, 데이터 내장 | 검토만 함. 중복 달력 엔진을 번들에 추가하지 않음. 절기 표에 관한 k-saju의 이슈 설명도 확인 |
| [glee1228/korean_saju](https://github.com/glee1228/korean_saju) | 풍부한 명리 항목, 한국 데이터·경계 기준 설명 | Python 엔진이므로 현재 정적 앱에 포함하지 않음. 용신·격국·신살 전체를 검증 없이 도입하지 않음 |

### 사주 계산 계약

- 한국 출생, **양력 환산 1908~2049년** 범위. 출생일은 오늘 이전이어야 함.
- 양력 또는 한국 음력·윤달 입력. 윤달이 없는 날짜나 존재하지 않는 날짜는 오류로 처리.
- 기본값: 입력 시각을 UTC+9 표준시로 사용. 과거 서머타임은 기본값에서 보정하지 않음.
- 선택: 도시 대표 경도 + 균시차 + 한국 과거 표준시/서머타임을 적용하는 진태양시. 도시 중심 경도이므로 실제 출생지와 미세한 차이 가능. 시간제 전환일의 중복·누락 시각은 전문 확인 필요.
- 연·월주는 절입의 절대 순간을 기준으로 판정. 일·시주는 선택한 시간 보정을 반영.
- 자정 / 23시 익일 / 야자시 분리 중 선택. 서로 다른 학파의 결과를 합치지 않음.
- 시간 미상: 정오 기준으로 연·월·일주 표시, 시주·대운 제외, 절입 당일 불확실성 안내.
- 오행은 천간·지지 **대표 오행 개수**, 음양도 글자 개수. 지장간 가중 강약이나 용신 판정 아님.
- 지장간은 ssaju의 여기·중기·정기 표. 십이운성은 장생 시작 지지와 음양 순·역행을 이용한 봉법.
- 합·충은 천간합·지지육합·지지충만 표시. 삼합·형파해·합화 판정은 제외.
- 대운은 연간 음양×선택한 성별 기준, 절입까지 3일=1년 환산. 대운수는 반올림이며 시작 시점 세부 환산과 차이가 있을 수 있음.
- 6tail 기반 절기 보정표를 사용하는 엔진으로, **KASI 공식 서비스 인증을 받았다는 의미는 아님**.
- 전통 규칙·상징을 표시하는 기능이며 성격 진단, 건강·재물·사건의 예측 도구가 아님.

## 타로 비교

| 프로젝트 | 확인한 장점 | 이번 적용 |
|---|---|---|
| [Tarotoo-com/tarotoo-tarot-dataset](https://github.com/Tarotoo-com/tarotoo-tarot-dataset) | 78장, 정·역방향, 체계적인 카드 메타데이터, MIT | **78장 ID·영문명·메이저/마이너·슈트 메타데이터 사용**. 한국어 문구는 앱에 맞게 새로 작성·각색. 원문과 라이선스 보관 |
| [julianduque/tarot-arcana](https://github.com/julianduque/tarot-arcana) | 하루 고정 카드, 1·3·10장 배열, 개인 기록, 자리별 질문 | 하루 카드·개인 기록·배열 개념 참고. 켈틱 크로스 위치 순서를 참고해 한국어 성찰 질문으로 각색. **LLM·서버·인물 외모 분류는 도입하지 않음** |
| [RoxyAPI/tarot-starter-app](https://github.com/RoxyAPI/tarot-starter-app) | 78장 도감·슈트 필터·여러 배열·모바일 화면 | 공개 기능 설명을 참고해 **카드 도감·검색·필터**를 자체 구현. 유료 API·SDK·아트워크는 사용하지 않음 |
| [Misko4b/love-oracle-tarot-dataset](https://github.com/Misko4b/love-oracle-tarot-dataset) | 관계 중심 키워드와 다국어 정·역방향 구분 | 공개 설명 비교만 함. 관계 해석에 치우쳐 일반 카드 데이터로 채택하지 않음. 데이터·이미지 복사 없음 |
| [Kkrykunov/tarot-card-reader](https://github.com/Kkrykunov/tarot-card-reader) | 78장, 저장·불러오기, 여러 인터페이스 | 공개 기능 설명 비교. 기존 로컬 기록과 텍스트 다운로드를 개선하는 데 참고. Python 소스 복사 없음 |

### 타로 구현 계약

- 메이저 22장 + 완드·컵·소드·펜타클 각 14장 = 78장.
- Web Crypto 기반 균등 정수와 Fisher–Yates 셔플. 한 배열에서 카드 중복 없음.
- 일반 읽기에서 정방향 전용 / 역방향 포함 선택. 역방향 포함 시 카드별 50% 무작위.
- 1장·3장·선택 A/B 5장·켈틱 크로스 10장. 켈틱 배열은 휴대폰 가독성을 위해 교차 카드를 별도 칸으로 표시.
- 하루 카드는 한국 날짜(Asia/Seoul) 기준으로 브라우저 저장소에 유지. 기기별 카드는 다를 수 있음. 저장 차단/삭제 시 재추첨될 수 있음.
- 카드별 한국어 정·역방향 문구와 배열 위치별 질문, 선택한 주제의 성찰 문구를 조합. 자유 질문을 의미 분석하는 LLM 기능은 아님.
- 카드 도감의 모든 78장 검색/분류/정역 의미 확인. Rider–Waite–Smith 78장 그림을 로컬 파일로 제공하며 정·역방향과 확대 보기를 지원.
- 미래의 사실·상대의 속마음·수익·질병을 단정하지 않음. 감사·소망·평안 문구는 별도의 격려 문장.

## 검증

- jsdom으로 실제 HTML의 폼/클릭/결과/기록 DOM을 확인. 시각적 브라우저 렌더링 검증은 수행하지 않음.
- 자정·23시 익일·야자시 분리, 입춘·경칩 직전/직후, 서울 진태양시 날짜 이동, 잘못된 윤달 검증.
- 독립 한국 음력 라이브러리와 1908~2026년 매월 15일 **1,428건** 비교: 일치. 전 날짜·전 규칙의 정확성을 보증하는 검사는 아님.
- 테스트에 288건 양력→음력→양력 왕복, 78장 정역 데이터, 1·3·5·10장 중복 방지, 하루 카드 유지, 도감 필터, 입력 HTML 이스케이프, 기존 v1 기록 보존 포함.

## 라이선스 파일

사용·각색한 MIT 코드/데이터의 고지는 `vendor/LICENSE-*.txt`에 유지합니다. 출처만 참고하고 복사하지 않은 프로젝트는 해당 코드가 번들에 들어있지 않습니다.

### 검토한 소스 커밋

- `yhj1024/manseryeok`: `fba3253d7305b8b61189bd78318a7a27ed8c9b09`
- `golbin/ssaju`: `07b608a778be6dac8669e04b9ab794c441959208`
- `usingsky/korean_lunar_calendar_js`: `6f988e3f50a424d165b9834f9e28cd3ea962da63`
- `Tarotoo-com/tarotoo-tarot-dataset`: `83202267973950eb5bf034f144b9405db9cb1e7e`
- `julianduque/tarot-arcana`: `ec430dfe57ababeb749e2bb9adc742c361317f23`


## 카드 일러스트 (78장)
- 원화: Pamela Colman Smith, Rider–Waite–Smith (1909), A. E. Waite 기획.
- 파일 출처: https://github.com/julianduque/tarot-arcana/tree/ec430dfe57ababeb749e2bb9adc742c361317f23/public/cards
- 위 리비전의 JPG 78개를 수정 없이 `assets/tarot/`에 포함했습니다. 외부 이미지 서버에 요청하지 않습니다.
- 상류 `src/data/cards.json`의 `sources.art`는 “Pamela Colman Smith, 1909, public domain”으로 표시합니다. 해당 출처 메타데이터를 `assets/tarot/ATTRIBUTION.md`에 기록했습니다.
- 프로젝트 MIT 고지는 `vendor/LICENSE-tarot-arcana.txt`에 보존했습니다. 원화의 출처 표기와 프로젝트 코드의 MIT 라이선스는 구별합니다.
- 온도의 금색 프레임, 뒷면 장식, 모바일 배치는 자체 CSS입니다.


## 별자리·점성술 통합 (2026-10-12)

| 프로젝트 | 확인한 장점 | 이번 앱 반영 | 라이선스 |
|---|---|---|---|
| [cosinekitty/astronomy](https://github.com/cosinekitty/astronomy) | 브라우저에서 태양·달·행성 위치, 황도 좌표, 달 위상 계산 | Astronomy Engine 2.1.19 실제 포함. GeoVector + Ecliptic, MoonPhase로 위치 계산 | MIT, 원문 고지 보존 |
| [0xStarcat/CircularNatalHoroscopeJS](https://github.com/0xStarcat/CircularNatalHoroscopeJS) | 열대/항성 황도 선택, 주요 각도와 허용 오차를 분리하는 구조 | 열대황도 및 주요 5각도·오차 표시 설계 참고. 계산 코드는 자체 구현 | Unlicense, 코드 미포함 |
| [Kibo/AstroChart](https://github.com/Kibo/AstroChart) | 의존성 없는 SVG 원형 차트와 천체 위치 시각화 | 반응형 SVG 차트 방식 참고. 번호와 위치표로 연결한 차트 직접 작성 | MIT, 코드·이미지 미포함 |

### 채택 범위와 재현
- Astronomy Engine upstream revision: `865d3da7d8112bbc7911238052c6af4aaf877181`. `source/js/astronomy.browser.min.js`를 수정 없이 `vendor/astronomy.js`로 포함. 고지: `vendor/LICENSE-astronomy.txt`.
- 비교한 CircularNatalHoroscopeJS: `76e150f64a3525797afe5b7ce118c2c63a1d59bd`.
- 비교한 Kibo/AstroChart: `2e20997e87376d9cac7631bbce514d53254dc9d7`. README에 AstroDraw/AstroChart로 이전 안내가 있어 구형 구현을 직접 의존하지 않음.
- 열대황도 12구간, 지구 중심 날짜의 참황도, 태양·달·8개 행성 위치를 계산. 과거 한국 출생기록 시각은 브라우저 Intl/Asia-Seoul 시간대로 UTC 변환. 중복·누락 시각은 확정 계산하지 않음.
- 사주 음력/윤달 생일은 기존 만세력으로 양력 변환하여 가져옴. 사주용 진태양시·자시 변경 규칙은 천체 계산에 적용하지 않음.
- 출생시간 미상: 정오 추정, 매시간+23:59 별자리 후보 표기, 출생 각도 생략. 후보 샘플 사이의 경계까지 완전히 보장하는 정밀 경계 탐색은 아님.
- 주요 각도 0/60/90/120/180도, 기본 오차 6도. 오늘의 달-출생 태양 관계는 4도. 앱의 선택 기준이며 특정 학파의 유일한 표준으로 주장하지 않음.
- 상승궁·하우스·항성황도·궁합·정밀 사건 예측은 구현 범위 밖. 한국어 상징·성찰 질문은 직접 작성. 천체 위치 계산과 점성술 해석은 구분함.
- 저장된 별자리 생일로 앱 방문/복귀 시 한국 날짜 정오 기준 오늘의 풀이 갱신. 외부 API·키·서버 전송 없음.


## Gemini 상세 보고서 · 9개 항목
- 사용자 제공 참고 화면의 9개 주제 구성을 반영. 타 서비스의 유료 풀이 본문을 복제하지 않으며, 자체 계산 데이터를 Gemini로 전달해 새 해설을 생성합니다.
- 기본 요청 모델은 Google 공식 generateContent 예시 기준 `gemini-3.8-flash`; 모델 ID와 키는 운영자 서버에서 관리합니다. 데이터 전송 안내 후 명시적으로 생성하며 자동 호출하지 않습니다.
- 공식 문서: https://ai.google.dev/api/generate-content , https://ai.google.dev/gemini-api/docs/api-key
- 길성과 신살: golbin/ssaju 리비전 `07b608a778be6dac8669e04b9ab794c441959208`의 `src/analyze.ts` 천을귀인·도화살·화개살 표 3종만 채택. MIT 고지 `vendor/LICENSE-ssaju.txt` 보존. 일간 기준 천을귀인과 일지 기준 도화·화개를 원국 지지에 대조하고 일치 위치를 함께 전달합니다. 연지 기준·기타 신살은 계산하지 않음. 시간 미상은 시주 제외.
- 상류의 역마 표는 다른 삼합 기준과 차이가 있어 이번 채택 범위에서 제외했습니다.
- AI 출력은 9개 ID와 문단 배열을 검증해 표시하며 HTML로 실행하지 않습니다. 실제 API 호출 검증은 운영자 서버 배포와 비밀키 등록 후 가능합니다.

## 운영자 공용 Gemini 서버
- Cloudflare Workers Secret에 운영자 키를 보관하고 Durable Objects 트랜잭션으로 일일 호출 상한을 적용합니다. 서버 코드: `server/worker.mjs`.
- 공식 문서: https://developers.cloudflare.com/workers/configuration/secrets/ , https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/
- 프런트 `ai-config.js`에는 공개 API 주소만 넣습니다. 실제 키는 저장소에 포함하지 않습니다. 서버·키가 미연결이면 준비 중으로 표시합니다.

## Supabase 서버 전환 (2026-10-12)
- 사용자 요청에 따라 성령말씀과 같은 Supabase Secrets 방식으로 연결. 별도 키 이름 `SAJU_GEMINI_API_KEY`, 별도 함수 `saju-ai`, 별도 한도 테이블을 사용합니다.
- 현재 기본 모델은 성령말씀과 같은 `gemini-3.5-flash-lite`. 기존 Cloudflare/3.8 설명은 이전 구현 기록입니다.
- 브라우저 무작위 번호 기반 개인 한도와 전체 일일 한도를 적용합니다. 공개 anon JWT는 Gemini 키가 아니며 실제 키는 서버에만 있습니다.
- 공식 문서: https://supabase.com/docs/guides/functions/secrets
