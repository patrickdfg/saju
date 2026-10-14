// 페이지 안 카메라: 지원 시 촬영 화면을 열고 취소하면 카메라를 끄며, 미지원·권한 거부면 기존 촬영 방식으로 돌아가는지 검사한다.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'..');
const setup=media=>{const d=new JSDOM(fs.readFileSync(path.join(base,'index.html'),'utf8'),{url:'https://example.test/#face',runScripts:'outside-only'}),w=d.window;
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLMediaElement.prototype.play=()=>Promise.resolve();
 if(media)Object.defineProperty(w.navigator,'mediaDevices',{value:media,configurable:true});
 const run=s=>vm.runInContext(s,d.getInternalVMContext());
 for(const el of w.document.querySelectorAll('script[src]'))run(fs.readFileSync(path.join(base,el.getAttribute('src').split('?')[0]),'utf8'));
 let nativeClicks=0;w.document.querySelector('#faceCamera').click=()=>{nativeClicks++;};
 return {d,w,q:s=>w.document.querySelector(s),clicks:()=>nativeClicks};};
(async()=>{
 // 미지원 브라우저: 기존 촬영 입력을 연다.
 let t=setup(null);t.q('#takeFacePhoto').click();assert.equal(t.clicks(),1);assert.equal(t.q('.cam-overlay'),null);t.d.window.close();
 // 지원: 촬영 화면을 열고, 취소하면 카메라 트랙을 끈다.
 let stopped=0;const stream={getTracks:()=>[{stop:()=>{stopped++;}}]};
 t=setup({getUserMedia:async c=>{assert.equal(c.audio,false);assert.equal(c.video.facingMode,'user');return stream;}});
 t.q('#takeFacePhoto').click();await new Promise(r=>setTimeout(r,10));
 assert.ok(t.q('.cam-overlay'),'overlay opens');assert.equal(t.q('.cam-shutter').disabled,false,'shutter enabled once the stream starts');assert.equal(t.clicks(),0);
 t.q('.cam-cancel').click();assert.equal(t.q('.cam-overlay'),null);assert.equal(stopped,1,'camera stopped on cancel');t.d.window.close();
 // 권한 거부: 안내 후 기존 촬영 입력으로 대체한다.
 t=setup({getUserMedia:async()=>{const e=new Error('denied');e.name='NotAllowedError';throw e;}});
 t.q('#takeFacePhoto').click();await new Promise(r=>setTimeout(r,10));
 assert.equal(t.q('.cam-overlay'),null);assert.equal(t.clicks(),1,'falls back to the native camera input');t.d.window.close();
 console.log('PASS: in-page camera opens and stops cleanly, and falls back to the native capture input when unsupported or denied.');
})().catch(e=>{console.error(e);process.exit(1);});
