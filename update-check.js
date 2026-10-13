// 사이트가 새로 배포되면 알려 준다. 지금 실행 중인 파일 버전(?v=)과 서버의 최신 index.html을 비교한다.
'use strict';
function ondoAssetVersions(html){return [...String(html).matchAll(/\b([\w-]+\.(?:js|css))\?v=([\w-]+)/g)].map(m=>m[1]+'='+m[2]).sort().join('|');}
const ondoRunningVersions=ondoAssetVersions([...document.querySelectorAll('script[src],link[rel="stylesheet"][href]')].map(el=>el.getAttribute('src')||el.getAttribute('href')).join(' '));
// 로드 시점의 fetch만 쓴다. 다른 기능이 fetch를 감싸거나 바꿔도 영향을 주고받지 않는다.
const ondoFetch=typeof window.fetch==='function'?window.fetch.bind(window):null;
let ondoUpdateShown=false,ondoUpdateChecking=false;
function ondoShowUpdate(){
 if(ondoUpdateShown)return;ondoUpdateShown=true;
 const bar=document.createElement('div');bar.className='update-bar';bar.setAttribute('role','status');
 const text=document.createElement('span');text.textContent='새 버전이 나왔어요.';
 const btn=document.createElement('button');btn.type='button';btn.textContent='새로고침';btn.onclick=()=>location.reload();
 bar.append(text,btn);document.body.append(bar);
}
async function ondoCheckUpdate(){
 if(ondoUpdateShown||ondoUpdateChecking||!ondoRunningVersions||!ondoFetch)return;
 ondoUpdateChecking=true;
 try{const res=await ondoFetch(location.pathname.replace(/[^/]*$/,'')+'index.html?check='+Date.now(),{cache:'no-store',credentials:'omit'});if(!res.ok)return;const latest=ondoAssetVersions(await res.text());if(latest&&latest!==ondoRunningVersions)ondoShowUpdate();}
 catch{}finally{ondoUpdateChecking=false;}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)ondoCheckUpdate();});
window.addEventListener('pageshow',()=>ondoCheckUpdate());
setInterval(()=>{if(!document.hidden)ondoCheckUpdate();},30*60*1000);
ondoCheckUpdate();
