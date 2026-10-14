// 첫 화면의 "오늘의 흐름" 카드와 사주 이름 표시. 저장한 생일로 그제~모레의 일진 관계 지수를 곡선과 숫자로 보여 준다.
'use strict';
const homeFlowNameKey='ondo-saju-name-v1';
// 온도가 정한 환산표다. 고전 원문의 점수가 아니라, 일간과 일진의 십신 관계를 0~100 참고 지수로 바꾸는 앱 자체 기준이다.
const HOME_FLOW_SCORE={식신:88,정인:86,정재:82,정관:78,비견:72,편재:70,편인:64,상관:62,겁재:58,편관:52};
const HOME_FLOW_LABELS=['그제','어제','오늘','내일','모레'];
const HOME_FLOW_WEEK=['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
let homeFlowSelected=2,homeFlowDays=null,homeFlowRenderedDay='';
function homeFlowName(){try{return (localStorage.getItem(homeFlowNameKey)||'').slice(0,12);}catch{return '';}}
function homeFlowSetName(name){try{if(name)localStorage.setItem(homeFlowNameKey,name);else localStorage.removeItem(homeFlowNameKey);}catch{}}
function homeFlowShift(day,offset){const [y,m,d]=day.split('-').map(Number);return new Date(Date.UTC(y,m-1,d+offset)).toISOString().slice(0,10);}
function homeFlowIndex(d){return Math.round(HOME_FLOW_SCORE[d.god]*0.7+HOME_FLOW_SCORE[d.branchGod]*0.3);}
function homeFlowDateText(day){const [y,m,d]=day.split('-').map(Number);return `${m}월 ${d}일 ${HOME_FLOW_WEEK[new Date(Date.UTC(y,m-1,d)).getUTCDay()]}`;}
function homeFlowData(){
 if(!savedSajuProfile)return null;
 const chart=calcSajuV2(savedSajuProfile),today=localDay();
 return [-2,-1,0,1,2].map(offset=>{const day=homeFlowShift(today,offset),d=dailySajuData(chart,day);return {day,d,index:homeFlowIndex(d),headline:easyDailySaju(d).headline};});
}
// 다섯 점을 지나는 부드러운 곡선(Catmull-Rom을 3차 베지어로 바꾼 것)과 아래 채움 영역의 경로를 만든다.
function homeFlowPaths(points){
 let line=`M${points[0][0]},${points[0][1]}`;
 for(let i=0;i<points.length-1;i++){const p0=points[i-1]||points[i],p1=points[i],p2=points[i+1],p3=points[i+2]||p2;line+=` C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2[0]},${p2[1]}`;}
 return {line,area:`${line} L${points.at(-1)[0]},120 L${points[0][0]},120 Z`};
}
function renderHomeFlow(){
 const host=document.querySelector('#homeFlow');if(!host)return;
 let days=null;try{days=homeFlowData();}catch{days=null;}
 homeFlowDays=days;homeFlowRenderedDay=localDay();
 const name=homeFlowName();
 host.textContent='';
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const head=el('div','home-flow-head');const title=el('h2','home-flow-title','오늘의 흐름');
 const who=el('div','home-flow-who');
 if(days){who.append(el('span','home-flow-who-label','사주정보'),el('b','home-flow-who-name',name||'나'));const change=el('button','home-flow-change','변경');change.type='button';change.onclick=()=>{go('saju');const edit=document.querySelector('#editSajuProfile');if(edit)edit.click();};who.append(change);}
 head.append(title,who);host.append(head);
 if(!days){
  const empty=el('div','home-flow-empty');const art=el('img','flow-illustration');art.src='assets/design/saju.svg';art.alt='';art.width=100;art.height=100;empty.append(art);empty.append(el('p',undefined,'내 생일에 맞춘 오늘의 한마디를 매일 만나보세요.'));
  const go1=el('button','primary','내 생일 등록하기');go1.type='button';go1.onclick=()=>go('saju');empty.append(go1);host.append(empty);return;
 }
 const date=el('p','home-flow-date',homeFlowDateText(days[homeFlowSelected].day));host.append(date);
 const min=Math.min(...days.map(x=>x.index))-6,max=Math.max(...days.map(x=>x.index))+6,span=Math.max(1,max-min);
 const pts=days.map((x,i)=>[10+i*70,104-((x.index-min)/span)*84]);
 const {line,area}=homeFlowPaths(pts);
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 300 120');svg.setAttribute('class','home-flow-graph');svg.setAttribute('aria-hidden','true');svg.setAttribute('preserveAspectRatio','none');
 svg.innerHTML=`<defs><linearGradient id="homeFlowFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a64a8" stop-opacity=".28"/><stop offset="1" stop-color="#7a64a8" stop-opacity="0"/></linearGradient></defs><path d="${area}" fill="url(#homeFlowFill)"/><path d="${line}" fill="none" stroke="#7a64a8" stroke-width="2.5" vector-effect="non-scaling-stroke"/>`;
 const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',pts[homeFlowSelected][0]);dot.setAttribute('cy',pts[homeFlowSelected][1]);dot.setAttribute('r','6');dot.setAttribute('class','home-flow-dot');svg.append(dot);
 host.append(svg);
 const tabs=el('div','home-flow-tabs');tabs.setAttribute('role','tablist');
 days.forEach((x,i)=>{const b=el('button','home-flow-tab',HOME_FLOW_LABELS[i]);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(i===homeFlowSelected));b.onclick=()=>{homeFlowSelected=i;renderHomeFlow();};tabs.append(b);});
 host.append(tabs);
 const pick=days[homeFlowSelected];
 host.append(el('p','home-flow-score',String(pick.index)),el('p','home-flow-headline',pick.headline));
 const explanation=el('details','flow-explanation');explanation.append(el('summary',undefined,'이 지수는 무엇인가요?'));explanation.append(el('p','home-flow-note',`흐름 지수는 내 일간과 그날 일진의 관계(${pick.d.god})를 온도가 정한 표로 바꾼 참고 숫자예요. 좋고 나쁨의 판정이나 예측이 아니라, 그날 어울리는 속도를 가늠하는 용도예요.`));host.append(explanation);
 const more=el('button','secondary home-flow-more','오늘의 사주 자세히 보기');more.type='button';more.onclick=()=>go('saju');host.append(more);
}
function homeFlowNameField(){
 const form=document.querySelector('#sajuForm');if(!form||document.querySelector('#sajuName'))return;
 const box=document.createElement('div');box.className='saju-name-field';
 box.innerHTML='<label for="sajuName">이름 또는 별칭 <small>선택 · 첫 화면에 표시, 이 브라우저에만 저장</small></label><input id="sajuName" type="text" maxlength="12" autocomplete="nickname" placeholder="예: 김점신">';
 form.prepend(box);
 const input=box.querySelector('input');input.value=homeFlowName();
}
function homeFlowPatchProfileTitle(){const h=document.querySelector('#sajuProfile h3'),name=homeFlowName();if(h&&name)h.textContent=name+'님의 생일';}
homeFlowNameField();
if(typeof saveSajuProfile==='function'){const original=saveSajuProfile;saveSajuProfile=function(...args){const input=document.querySelector('#sajuName');homeFlowSetName(input?input.value.trim().slice(0,12):'');const out=original.apply(this,args);homeFlowPatchProfileTitle();homeFlowSelected=2;renderHomeFlow();return out;};}
if(typeof clearSajuProfile==='function'){const original=clearSajuProfile;clearSajuProfile=function(...args){const out=original.apply(this,args);if(!savedSajuProfile){homeFlowSetName('');const input=document.querySelector('#sajuName');if(input)input.value='';}renderHomeFlow();return out;};}
if(typeof showSajuProfile==='function'){const original=showSajuProfile;showSajuProfile=function(...args){const out=original.apply(this,args);homeFlowPatchProfileTitle();return out;};}
if(typeof fillSajuProfile==='function'){const original=fillSajuProfile;fillSajuProfile=function(...args){const out=original.apply(this,args);const input=document.querySelector('#sajuName');if(input)input.value=homeFlowName();return out;};}
homeFlowPatchProfileTitle();
document.addEventListener('ondo:page',e=>{if(e.detail==='home'&&homeFlowRenderedDay!==localDay())renderHomeFlow();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&homeFlowRenderedDay!==localDay()){homeFlowSelected=2;renderHomeFlow();}});
renderHomeFlow();
