// 온도책: 1000개 문장, 펼치기 동작, 고민 글자의 안전한 표시, 기록 저장, 위기 문구 안내를 검사한다.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'..');
(async()=>{
const d=new JSDOM(fs.readFileSync(path.join(base,'index.html'),'utf8'),{url:'https://example.test/#book',runScripts:'outside-only'}),w=d.window;
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;
const run=s=>vm.runInContext(s,d.getInternalVMContext()),q=s=>w.document.querySelector(s);
for(const el of w.document.querySelectorAll('script[src]'))run(fs.readFileSync(path.join(base,el.getAttribute('src').split('?')[0]),'utf8'));
const answers=run('ONDO_BOOK_ANSWERS');assert.equal(answers.length,1000);assert.equal(new Set(answers).size,1000,'no duplicates');
assert.ok(answers.every(a=>typeof a==='string'&&a.length>=5&&a.length<=60));
run("go('book')");assert.equal(q('#book').hidden,false,'book page reachable');
assert.ok([...w.document.querySelectorAll('nav button')].some(b=>b.dataset.page==='book'&&b.textContent==='온도책'));
run('bookDelay=0');
q('#bookWorry').value='<img src=x onerror=alert(1)> 연락해 볼까';q('#openBook').click();
await new Promise(r=>setTimeout(r,10));
const sentence=q('.book-sentence').textContent;assert.ok(answers.includes(sentence),'answer comes from the list');
assert.match(q('.book-page').textContent,/^p\. \d+$/);assert.equal(answers[Number(q('.book-page').textContent.slice(3))-1],sentence,'page number matches the sentence');
assert.equal(q('#bookResult img'),null,'worry text is never HTML');assert.ok(q('.book-worry').textContent.includes('<img'));
const saveBtn=[...w.document.querySelectorAll('#bookResult button')].find(b=>b.textContent.includes('기록'));saveBtn.click();
const journal=w.localStorage.getItem('ondo-journal-v1');assert.ok(journal.includes('온도책')&&journal.includes(sentence.slice(0,8)));
const seen=new Set();for(let i=0;i<40;i++){[...w.document.querySelectorAll('#bookResult button')].find(b=>b.textContent.includes('다시')).click();await new Promise(r=>setTimeout(r,2));seen.add(q('.book-sentence').textContent);}
assert.ok(seen.size>20,'answers vary between openings');
q('#bookWorry').value='요즘 죽고 싶다는 생각이 들어요';q('#openBook').click();
assert.ok(q('.book-support'),'crisis wording shows support instead of a random answer');assert.ok(q('#bookResult').textContent.includes('109'));
d.window.close();console.log('PASS: ondo book has 1000 unique answers, opens to a page-numbered sentence, escapes worry text, saves to journal, varies, and routes crisis wording to support.');
})().catch(e=>{console.error(e);process.exit(1);});
