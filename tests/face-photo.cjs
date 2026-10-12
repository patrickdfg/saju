// 관상 사진 불러오기의 형식·크기 검사가 휴대폰 카메라 원본을 막지 않는지 검사한다.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'..');
const d=new JSDOM(fs.readFileSync(path.join(base,'index.html'),'utf8'),{url:'https://example.test/#face',runScripts:'outside-only'}),w=d.window;
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.URL.createObjectURL=()=>'blob:test';w.URL.revokeObjectURL=()=>{};
const run=s=>vm.runInContext(s,d.getInternalVMContext()),q=s=>w.document.querySelector(s);
for(const el of w.document.querySelectorAll('script[src]'))run(fs.readFileSync(path.join(base,el.getAttribute('src').split('?')[0]),'utf8'));
const load=(type,size,name)=>{q('#photoError').textContent='';w.__f={type,size,name};run('loadFacePhoto(window.__f)');return q('#photoError').textContent;};
assert.equal(load('image/jpeg',12*1024*1024,'cam.jpg'),'','12MB camera JPEG is accepted');
assert.equal(load('',5*1024*1024,'20261013_101010.jpg'),'','camera file with an empty type is accepted');
assert.equal(load('image/heic',4*1024*1024,'cam.heic'),'','HEIC is tried, not rejected up front');
assert.equal(load('image/jpeg',39*1024*1024,'big.jpg'),'','39MB is accepted');
assert.ok(load('image/jpeg',41*1024*1024,'huge.jpg').includes('40MB'),'over 40MB is rejected');
assert.ok(load('application/pdf',1000,'a.pdf').includes('사진 파일'),'non-image is rejected');
assert.ok(load('',1000,'notes.txt').includes('사진 파일'),'unknown non-image name is rejected');
assert.ok(q('#face').textContent.includes('최대 40MB'));
d.window.close();console.log('PASS: face photo loader accepts large, typeless and HEIC camera files, and rejects non-images and over 40MB.');
