// 사주 결과 바로가기 칩이 결과가 생길 때만 나타나고 각 구역으로 이동하는지 검사한다.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'..');
const d=new JSDOM(fs.readFileSync(path.join(base,'index.html'),'utf8'),{url:'https://example.test/#saju',runScripts:'outside-only'}),w=d.window;
w.scrollTo=()=>{};w.confirm=()=>true;const scrolled=[];w.HTMLElement.prototype.scrollIntoView=function(opts){scrolled.push(this.id||this.className);};
const run=s=>vm.runInContext(s,d.getInternalVMContext()),q=s=>w.document.querySelector(s);
for(const el of w.document.querySelectorAll('script[src]'))run(fs.readFileSync(path.join(base,el.getAttribute('src').split('?')[0]),'utf8'));
assert.equal(q('.saju-nav'),null,'no chips before a result exists');
q('#birth').value='2000-01-07';q('#birthTime').value='12:00';q('#sajuForm').dispatchEvent(new w.Event('submit',{cancelable:true}));
const nav=q('.saju-nav');assert.ok(nav,'chips appear with the result');
const labels=[...nav.querySelectorAll('button')].map(b=>b.textContent);assert.ok(labels.length>=4&&labels.includes('나의 모습')&&labels.includes('AI 풀이'),labels.join());
scrolled.length=0;nav.querySelectorAll('button')[1].click();assert.equal(scrolled.length,1,'chip scrolls to its section');
assert.equal(w.document.querySelectorAll('.saju-nav').length,1,'chips are rebuilt, never duplicated');
q('#sajuForm').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(w.document.querySelectorAll('.saju-nav').length,1);
d.window.close();console.log('PASS: saju quick-nav chips appear only with a result, scroll to sections, and never duplicate.');
