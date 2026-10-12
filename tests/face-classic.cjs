// 고전 관상 풀이 패널의 동의 게이트, 요청 형식, 결과 렌더링, 거절·오류 처리를 모의 API로 검사한다.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'..');
(async()=>{
const d=new JSDOM(fs.readFileSync(path.join(base,'index.html'),'utf8'),{url:'https://example.test/#face',runScripts:'outside-only'}),w=d.window;
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;
const run=s=>vm.runInContext(s,d.getInternalVMContext()),q=s=>w.document.querySelector(s);
for(const el of w.document.querySelectorAll('script[src]'))run(fs.readFileSync(path.join(base,el.getAttribute('src').split('?')[0]),'utf8'));
w.ONDO_AI_ENDPOINT='https://project.example/functions/v1/saju-ai';
assert.ok(q('#classicFace'),'classic panel mounted');
assert.ok(q('.face-notice').textContent.includes('별도 패널'));
// Without a photo nothing is sent.
let calls=[];w.fetch=async(url,opts)=>{calls.push({url,opts});return {ok:true,json:async()=>({})};};
await q('#generateClassicFace').onclick();assert.equal(calls.length,0);assert.ok(q('#classicFaceError').textContent.includes('사진'));
// Fake a loaded photo and a prepared (already downscaled) image.
const file=new w.File([new Uint8Array(10)],'a.jpg',{type:'image/jpeg'});run('facePhotoFile=null');w.__file=file;run('facePhotoFile=window.__file');
run("prepareClassicFaceImage=async()=>'/9j/'+'A'.repeat(3000)");
await q('#generateClassicFace').onclick();assert.equal(calls.length,0,'consent required');assert.ok(q('#classicFaceError').textContent.includes('체크'));
const ids=o=>Object.keys(o);
const zones=ids(run('CLASSIC_FACE_ZONES')),features=ids(run('CLASSIC_FACE_FEATURES')),palaces=ids(run('CLASSIC_FACE_PALACES')),stages=ids(run('CLASSIC_FACE_STAGES')),themes=ids(run('CLASSIC_FACE_THEMES'));
const xss='<img src=x onerror=alert(1)> 글자는 실행하지 않습니다.';
const face={status:'ok',impression:{type:'清秀',headline:'맑고 차분한 인상',text:'전통 상징을 AI가 풀어쓴 성찰용 풀이입니다. '+xss},faceShape:{name:'타원형',text:'둥글고 길어요.'},
 samjeong:zones.map(id=>({id,observation:'보이는 모습',reading:'전통에서는 균형으로 봅니다.'})),ogwan:features.map(id=>({id,shapeName:id==='brow'?'新月眉':'',observation:'보이는 모습',reading:'전통 해석'})),
 palaces:palaces.map(id=>({id,reading:'전통 해석'})),stages:stages.map(id=>({id,reading:'전통 해석'})),themes:themes.map(id=>({id,reading:'전통 해석'})),advice:'오늘 천천히 숨을 쉬어 보세요.'};
w.fetch=async(url,opts)=>{calls.push({url,opts});return {ok:true,json:async()=>({face,model:'gemini-test'})};};
q('#classicFaceConsent').checked=true;await q('#generateClassicFace').onclick();
assert.equal(calls.length,1);assert.equal(calls[0].url,'https://project.example/functions/v1/saju-ai');
assert.ok(calls[0].opts.headers.Authorization.startsWith('Bearer '));assert.equal(calls[0].opts.credentials,'omit');assert.equal(calls[0].opts.referrerPolicy,'no-referrer');
const sent=JSON.parse(calls[0].opts.body);assert.deepEqual(Object.keys(sent),['face']);assert.equal(sent.face.image.mime,'image/jpeg');assert.ok(sent.face.image.data.startsWith('/9j/'));assert.deepEqual(Object.keys(sent.face.image).sort(),['data','mime']);
assert.equal(w.document.querySelectorAll('.classic-face-group').length,5);assert.equal(w.document.querySelectorAll('.classic-face-row').length,3+5+10+3+4);
assert.equal(q('#classicFaceOutput img'),null,'model text is never parsed as HTML');assert.ok(q('#classicFaceOutput').textContent.includes('<img src=x'));
assert.ok(q('#classicFaceOutput').textContent.includes('新月眉'));assert.ok(!q('#classicFaceOutput').textContent.includes('疾厄'));
// Saving stores text only, never the photo.
[...w.document.querySelectorAll('#classicFaceOutput .actions button')][0].click();const journal=w.localStorage.getItem('ondo-journal-v1');assert.ok(journal.includes('관상 · 고전 풀이 AI'));assert.ok(!journal.includes('/9j/')&&!journal.includes('blob:'));
// Refusals show a message and render no reading.
for(const [status,hint] of [['no_face','얼굴을 찾지'],['multiple_faces','둘 이상'],['minor','풀이하지 않아요'],['low_quality','어둡거나']]){
 w.fetch=async()=>({ok:true,json:async()=>({face:{status}})});await q('#generateClassicFace').onclick();assert.ok(q('#classicFaceError').textContent.includes(hint),status);assert.equal(q('.classic-face-result'),null);
}
// Malformed model output and server errors are rejected without leaking.
w.fetch=async()=>({ok:true,json:async()=>({face:{...face,palaces:face.palaces.slice(1)}})});await q('#generateClassicFace').onclick();assert.ok(q('#classicFaceError').textContent.includes('형식'));
w.fetch=async()=>({ok:false,status:429});await q('#generateClassicFace').onclick();assert.ok(q('#classicFaceError').textContent.includes('한도'));assert.equal(q('#generateClassicFace').disabled,false);
w.fetch=async()=>({ok:false,status:413});await q('#generateClassicFace').onclick();assert.ok(q('#classicFaceError').textContent.length>0);
// Cancel works, and removing the photo aborts a pending request.
w.fetch=(url,opts)=>new Promise((resolve,reject)=>opts.signal.addEventListener('abort',()=>reject(new w.DOMException('aborted','AbortError'))));
let pending=q('#generateClassicFace').onclick();await new Promise(r=>setTimeout(r,0));q('#cancelClassicFace').click();await pending;assert.ok(q('#classicFaceError').textContent.includes('중단'));
pending=q('#generateClassicFace').onclick();await new Promise(r=>setTimeout(r,0));q('#removePhoto').click();await pending;assert.ok(q('#classicFaceError').textContent.includes('중단'));assert.equal(run('facePhotoFile'),null);
// Unconfigured server keeps the button inert.
w.ONDO_AI_ENDPOINT='';run('facePhotoFile=window.__file');w.fetch=async()=>{throw Error('must not be called');};await q('#generateClassicFace').onclick();assert.ok(q('#classicFaceError').textContent.includes('준비 중'));
d.window.close();console.log('PASS: classic face panel consent gate, photo-only minimal request, 5-group rendering, XSS-safe text, refusals, malformed output, quota errors, cancel/removal abort, and photo-free records (mock API only).');
})().catch(e=>{console.error(e);process.exit(1);});
