// 사주 화면 위쪽에 결과 구역 바로가기 칩을 만든다. 긴 결과에서 원하는 구역으로 바로 이동하게 한다.
'use strict';
const SAJU_NAV_TARGETS=[['오늘','#dailySaju'],['나의 모습','#sajuResult .saju-easy-hero'],['일상 풀이','#sajuResult .easy-life'],['다섯 상징','#sajuResult .easy-elements'],['AI 풀이','#geminiSaju']];
function mountSajuNav(){
 const old=document.querySelector('.saju-nav');if(old)old.remove();
 const result=document.querySelector('#sajuResult');if(!result||result.hidden||!result.children.length)return;
 const found=SAJU_NAV_TARGETS.map(([label,sel])=>[label,document.querySelector(sel)]).filter(([,el])=>el&&!el.hidden);
 if(found.length<3)return;
 const nav=document.createElement('nav');nav.className='saju-nav';nav.setAttribute('aria-label','사주 결과 바로가기');
 for(const [label,el] of found){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>el.scrollIntoView({behavior:'smooth',block:'start'});nav.append(b);}
 const anchor=document.querySelector('#sajuProfile');(anchor&&!anchor.hidden?anchor:document.querySelector('#saju .page-title')).insertAdjacentElement('afterend',nav);
}
if(typeof renderSajuV2==='function'){const original=renderSajuV2;renderSajuV2=function(...args){const out=original.apply(this,args);mountSajuNav();return out;};}
if(typeof mountGeminiSaju==='function'){const original=mountGeminiSaju;mountGeminiSaju=function(...args){const out=original.apply(this,args);mountSajuNav();return out;};}
