// 배포된 index.html의 파일 버전이 바뀌었을 때만 새로고침 안내가 뜨는지 검사한다.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
(async()=>{
for(const [served,expect] of [[html,false],[html.replace(/style\.css\?v=[\w-]+/,'style.css?v=next'),true],['<html>offline</html>',false]]){
 const d=new JSDOM(html,{url:'https://example.test/saju/',runScripts:'outside-only'}),w=d.window;
 w.fetch=async url=>{assert.ok(String(url).startsWith('/saju/index.html?check='));return {ok:true,text:async()=>served};};
 vm.runInContext(fs.readFileSync(path.join(base,'update-check.js'),'utf8'),d.getInternalVMContext());
 await new Promise(r=>setTimeout(r,20));
 assert.equal(Boolean(w.document.querySelector('.update-bar')),expect,'banner '+expect);
 if(expect){assert.ok(w.document.querySelector('.update-bar').textContent.includes('새로고침'));}
 d.window.close();
}
console.log('PASS: update banner appears only when the deployed asset versions differ from the running page.');
})().catch(e=>{console.error(e);process.exit(1);});
