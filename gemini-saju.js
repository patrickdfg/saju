'use strict';
// Owner-funded server mode: the browser never receives an API key.
const GEMINI_SAJU_SECTIONS=[
 ['self','내가 아는 내 모습','내 마음과 선택의 기준'],['social','남이 보는 내 모습','관계에서 드러나는 표현과 태도'],['talent','타고난 재능과 적성','키워볼 강점과 배움의 방향'],['wealth','타고난 재물운','돈을 대하는 태도와 생활 관리'],['love','타고난 애정운','애정 표현과 관계의 균형'],['work','타고난 일복','일하는 방식과 부담 조절'],['people','타고난 인복','도움을 주고받는 관계'],['career','타고난 관운','책임·조직생활·성장의 방향'],['stars','길성과 신살','계산된 전통 상징을 쉽게 읽기']
];
// Three selected tables adapted from golbin/ssaju (MIT). See SOURCES.md.
function selectedSajuStars(r){
 const stem=r.raw.dayHanja[0],branch=r.raw.dayHanja[1],noble={甲:'丑未',乙:'子申',丙:'亥酉',丁:'亥酉',戊:'丑未',己:'子申',庚:'丑未',辛:'寅午',壬:'卯巳',癸:'卯巳'}[stem];
 const group=[['寅午戌','卯','戌'],['申子辰','酉','辰'],['巳酉丑','午','丑'],['亥卯未','子','未']].find(x=>x[0].includes(branch));
 return {scope:'천을귀인·도화살·화개살 3종만 계산. 다른 길성·신살은 미계산. 학파별 기준이 다를 수 있음.',timeUnknown:r.unknown,items:[['천을귀인','일간 '+stem,noble,'도움과 협력'],['도화살','일지 '+branch,group[1],'표현과 교류'],['화개살','일지 '+branch,group[2],'몰입과 사색']].map(([name,basis,targets,theme])=>({name,basis,targets,theme,matches:r.columns.filter(c=>targets.includes(c.hanja[1])).map(c=>({position:c.key,branch:c.hanja[1]}))}))};
}
function parseGeminiSajuReport(text){
 let data;try{data=JSON.parse(text);}catch{throw Error('AI 보고서 형식이 완성되지 않았어요. 기본 풀이를 이용하거나 다시 생성해 주세요.');}
 if(!data||!Array.isArray(data.sections)||data.sections.length!==9)throw Error('9개 항목이 모두 생성되지 않았어요. 다시 생성해 주세요.');
 const sections=GEMINI_SAJU_SECTIONS.map(([id,title,subtitle])=>{const found=data.sections.filter(x=>x.id===id);if(found.length!==1||!Array.isArray(found[0].paragraphs)||found[0].paragraphs.length<2||found[0].paragraphs.length>5||found[0].paragraphs.some(p=>typeof p!=='string'||!p.trim()||p.length>3000))throw Error('항목별 풀이 형식이 올바르지 않아요. 다시 생성해 주세요.');return {id,title,subtitle,paragraphs:found[0].paragraphs};});return sections;
}


let sajuGeminiRequest=null;
function cancelGeminiSaju(){if(sajuGeminiRequest){sajuGeminiRequest.abort();sajuGeminiRequest=null;}}
function geminiSajuPayload(r){return {
 version:1,dayMaster:{korean:r.raw.day.heavenlyStem,hanja:r.raw.dayHanja[0],element:r.raw.dayElement.stem},
 timeUnknown:r.unknown,pillars:r.columns.map(c=>({position:c.key,korean:c.korean,hanja:c.hanja,elements:c.element,tenGods:c.gods,hiddenStems:c.hidden,lifeStage:c.stage})),
 elementCounts:r.count,yinYang:{yang:r.yang,yin:r.total-r.yang},relations:getRelations(r.columns),voidBranches:r.raw.voidBranches,
 luck:r.raw.luckPillars?{forward:r.raw.luckPillars.forward,startAge:r.raw.luckPillars.startAge,pillars:r.raw.luckPillars.pillars.map(p=>({age:p.age,korean:p.korean}))}:null,
 selectedStars:selectedSajuStars(r),limitations:r.warnings
};}
function geminiSajuError(status){return ({400:'사주 계산 정보를 확인할 수 없어요. 생년월일을 다시 계산해 주세요.',403:'이 앱에서 보낸 요청만 이용할 수 있어요.',413:'전송할 정보가 너무 많아요. 다시 계산해 주세요.',429:'오늘의 이용 한도에 도달했거나 요청 간격이 짧아요. 잠시 후 또는 내일 다시 이용해 주세요.',503:'AI 상세 풀이를 준비 중이에요. 기본 사주 풀이는 계속 이용할 수 있어요.'})[status]||(status>=500?'AI 서비스가 일시적으로 응답하지 않아요. 잠시 후 다시 시도해 주세요.':'요청을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.');}
function geminiSajuEndpoint(){try{const value=window.ONDO_AI_ENDPOINT||'';if(!value)return '';const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&!url.search&&!url.hash&&(url.pathname==='/api/saju'||url.pathname==='/functions/v1/saju-ai')?url.href:'';}catch{return '';}}
let sajuBrowserClient='';
function geminiSajuHeaders(){
 const headers={'Content-Type':'application/json'};
 if(window.ONDO_AI_PUBLIC_TOKEN){headers.apikey=window.ONDO_AI_PUBLIC_TOKEN;headers.Authorization='Bearer '+window.ONDO_AI_PUBLIC_TOKEN;
  if(!sajuBrowserClient){try{sajuBrowserClient=localStorage.getItem('ondo-ai-client-v1')||'';}catch{}
   if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sajuBrowserClient)){sajuBrowserClient=crypto.randomUUID();try{localStorage.setItem('ondo-ai-client-v1',sajuBrowserClient);}catch{}}
  }headers['X-Saju-Client']=sajuBrowserClient;
 }return headers;
}
function mountGeminiSaju(r){
 cancelGeminiSaju();const host=document.createElement('section');host.className='gemini-saju panel';host.id='geminiSaju';
 host.innerHTML=`<span class="eyebrow">GEMINI · AI 상세 해설</span><h2>나를 알아가는 9가지 이야기</h2><p>상세 만세력을 Gemini가 항목별로 길게 풀어드립니다. 아래 9개 이야기를 한 번에 생성해요.</p><div class="gemini-chapter-preview">${GEMINI_SAJU_SECTIONS.map((s,i)=>`<div><small>${String(i+1).padStart(2,'0')}</small><span>${s[1]}</span></div>`).join('')}</div><p class="hint">‘타고난’과 ‘운’은 전통 분류명입니다. 능력이나 미래 결과를 확정하는 뜻은 아닙니다.</p><p class="hint">운영자가 제공하는 AI 풀이입니다. API 키 입력 없이 이용할 수 있어요. 같은 브라우저는 하루 50회, 전체는 하루 1000회까지 제공하며 한국시간 자정에 갱신됩니다. 브라우저별 횟수와 별도로 전체 제공 한도가 적용돼요.</p><details class="gemini-settings"><summary>AI 풀이에 전송할 정보 확인</summary><p>사주 기둥·오행·십신·지장간·합충·대운 등 아래 계산 결과가 온도 운영 서버를 거쳐 Google Gemini API로 전송됩니다. 생년월일 원문·이름·사진·기록은 포함하지 않습니다. 사주 글자도 개인과 관련된 정보이므로 내용을 확인해 주세요.</p><pre id="geminiPayloadPreview"></pre><p class="hint">Google의 API 이용 조건과 데이터 처리 정책이 적용됩니다. 운영 서버는 사주 내용과 풀이를 저장하지 않으며, 이용 제한을 위해 무작위 브라우저 번호를 일별 식별값으로 바꿔 횟수를 계산합니다.</p></details><label class="check"><input id="geminiSajuConsent" type="checkbox"> 위 사주 계산 결과를 운영 서버와 Google에 보내 AI 해설을 생성합니다.</label><div class="actions"><button id="generateGeminiSaju" class="primary" type="button">Gemini로 상세 풀이 생성 ✦</button><button id="cancelGeminiSaju" class="secondary" type="button" hidden>생성 중단</button></div><p id="geminiSajuStatus" role="status"></p><p id="geminiSajuError" role="alert"></p><div id="geminiSajuOutput"></div>`;
 $('#sajuResult .expert-saju').insertAdjacentElement('afterend',host);const q=s=>host.querySelector(s),payload=geminiSajuPayload(r);q('#geminiPayloadPreview').textContent=JSON.stringify(payload,null,2);
 let generatedRecord=null;const baseQuestion=currentSaju.question;
 const endpoint=geminiSajuEndpoint();
 if(!endpoint){q('#generateGeminiSaju').disabled=true;q('#geminiSajuStatus').textContent='AI 상세 풀이 준비 중 · 운영자 서버 연결 후 키 입력 없이 이용할 수 있어요.';}
 q('#cancelGeminiSaju').onclick=cancelGeminiSaju;
 q('#generateGeminiSaju').onclick=async()=>{
  if(sajuGeminiRequest)return;q('#geminiSajuError').textContent='';
  if(!endpoint){q('#geminiSajuError').textContent=geminiSajuError(503);return;}
  if(!q('#geminiSajuConsent').checked){q('#geminiSajuError').textContent='전송할 정보를 확인하고 전송 항목을 체크해 주세요.';return;}
  const controller=new AbortController();sajuGeminiRequest=controller;let timedOut=false;const timeout=setTimeout(()=>{timedOut=true;controller.abort();},90000);
  q('#generateGeminiSaju').disabled=true;q('#cancelGeminiSaju').hidden=false;q('#geminiSajuStatus').textContent='Gemini가 만세력을 쉽게 풀어쓰고 있어요. 잠시 기다려 주세요.';q('#geminiSajuOutput').setAttribute('aria-busy','true');
  try{
   const response=await fetch(endpoint,{method:'POST',headers:geminiSajuHeaders(),credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal,body:JSON.stringify({payload})});
   if(!response.ok)throw Error(geminiSajuError(response.status));const result=await response.json();
   const model=typeof result.model==='string'?result.model:'Gemini';
   if(controller.signal.aborted||!host.isConnected)return;
   const chapters=parseGeminiSajuReport(JSON.stringify({sections:result.sections}));
   q('#geminiSajuOutput').innerHTML='<div class="gemini-result"><span class="eyebrow">AI가 풀어쓴 상세 만세력</span><p class="hint">AI 해설에는 오류가 있을 수 있어요. 위 계산표와 함께 참고해 주세요.</p><div class="gemini-reading"></div><p class="gemini-meta hint"></p><div class="actions"><button class="secondary" id="saveGeminiSaju">AI 풀이 기록하기 ♡</button><button class="secondary" id="exportGeminiSaju">AI 풀이 다운로드</button></div></div>';
   const reading=q('.gemini-reading');reading.classList.add('gemini-chapters');
   for(const [i,chapter] of chapters.entries()){const detail=document.createElement('details');detail.className='gemini-chapter';detail.open=i===0;const summary=document.createElement('summary');summary.textContent=String(i+1).padStart(2,'0')+' · '+chapter.title;detail.append(summary);const sub=document.createElement('small');sub.textContent=chapter.subtitle;detail.append(sub);for(const paragraph of chapter.paragraphs){const p=document.createElement('p');p.textContent=paragraph;detail.append(p);}reading.append(detail);}
   const reportText=chapters.map(x=>x.title+'\n'+x.paragraphs.join('\n\n')).join('\n\n────────\n\n');const stamp=new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});q('.gemini-meta').textContent='생성: '+stamp+' (한국시간) · '+model;
   generatedRecord={type:'사주 · Gemini AI',title:'나를 알아가는 9가지 이야기 · Gemini',question:baseQuestion,text:'AI 생성 해설 · '+model+' · '+stamp+'\n\n'+reportText,blessing:''};
   q('#saveGeminiSaju').onclick=()=>saveRecord(generatedRecord);q('#exportGeminiSaju').onclick=()=>downloadText('ondo-gemini-saju.txt',generatedRecord.question+'\n\n'+generatedRecord.text);
   q('#geminiSajuStatus').textContent='AI 상세 풀이를 완성했어요. 기록하려면 아래 저장 버튼을 눌러 주세요.';
  }catch(err){if(host.isConnected){q('#geminiSajuStatus').textContent='';q('#geminiSajuError').textContent=controller.signal.aborted?(timedOut?'응답 대기 시간이 길어 중단했어요. 자동 재시도하지 않습니다.':'생성을 중단했어요. 이미 전송된 요청의 처리는 Google에서 계속될 수 있습니다.'):(err instanceof TypeError?'연결하지 못했어요. 인터넷 연결을 확인하거나 잠시 후 다시 시도해 주세요.':err.message||'풀이를 생성하지 못했어요.');}}
  finally{clearTimeout(timeout);if(sajuGeminiRequest===controller)sajuGeminiRequest=null;if(host.isConnected){q('#generateGeminiSaju').disabled=false;q('#cancelGeminiSaju').hidden=true;q('#geminiSajuOutput').removeAttribute('aria-busy');}}
 };
}
window.addEventListener('pagehide',cancelGeminiSaju);
