// 관상 화면의 고전 관상 풀이 패널. 동의한 사진 한 장을 줄여 운영 서버로 보내고 결과를 카드로 그린다.
'use strict';
const CLASSIC_FACE_ZONES={upper:['상정(上停)','이마 · 초년의 주제'],middle:['중정(中停)','눈썹~코끝 · 중년의 주제'],lower:['하정(下停)','인중~턱 · 말년의 주제']};
const CLASSIC_FACE_FEATURES={brow:['눈썹','보수관 保壽官'],eye:['눈','감찰관 監察官'],ear:['귀','채청관 採聽官'],nose:['코','심변관 審辨官'],mouth:['입','출납관 出納官']};
const CLASSIC_FACE_PALACES={ming:['명궁 命宮','마음의 중심'],wealth:['재백궁 財帛宮','돈을 대하는 태도'],career:['관록궁 官祿宮','일과 책임'],virtue:['복덕궁 福德宮','마음의 여유'],home:['전택궁 田宅宮','터전과 안정'],sibling:['형제궁 兄弟宮','동료·형제와의 결'],children:['남녀궁 男女宮','돌봄과 창작'],spouse:['처첩궁 妻妾宮','가까운 동반 관계'],travel:['천이궁 遷移宮','이동과 환경 변화'],servants:['노복궁 奴僕宮','주변의 조력']};
const CLASSIC_FACE_STAGES={early:['초년','상정에 대응하는 주제'],middle:['중년','중정에 대응하는 주제'],late:['말년','하정에 대응하는 주제']};
const CLASSIC_FACE_THEMES={wealth:'재물을 대하는 결',business:'일과 사업을 밀고 가는 결',relationships:'사람을 대하는 결',temperament:'기질과 표현'};
const CLASSIC_FACE_REFUSALS={no_face:'얼굴을 찾지 못했어요. 얼굴이 정면에서 잘 보이는 사진을 골라 주세요.',multiple_faces:'사진에 얼굴이 둘 이상 있어요. 한 사람만 나온 사진을 골라 주세요.',minor:'어린이·청소년으로 보이는 사진은 풀이하지 않아요.',low_quality:'사진이 어둡거나 흐려서 부위를 구분하기 어려워요. 밝은 곳에서 다시 찍어 주세요.'};
let classicFaceRequest=null;
function classicFaceError(status){if(status===400)return '서버가 사진 풀이 요청을 받아들이지 못했어요. 운영 서버가 아직 업데이트되지 않았을 수 있어요.';if(status===413)return '사진 용량이 너무 커요. 더 작은 사진을 골라 주세요.';return geminiSajuError(status);}
function cancelClassicFace(){if(classicFaceRequest){classicFaceRequest.abort();classicFaceRequest=null;}}
function classicFaceTextOk(v,max){return typeof v==='string'&&v.trim().length>0&&v.length<=max;}
function parseClassicFaceReport(data){
 const bad=()=>Error('풀이 형식이 올바르지 않아요. 다시 생성해 주세요.');
 if(!data||typeof data!=='object'||typeof data.status!=='string')throw bad();
 if(data.status!=='ok'){if(!CLASSIC_FACE_REFUSALS[data.status])throw bad();return {status:data.status};}
 const list=(items,labels,fields)=>{if(!Array.isArray(items)||items.length!==Object.keys(labels).length)throw bad();return Object.keys(labels).map(id=>{const found=items.filter(x=>x&&x.id===id);if(found.length!==1)throw bad();const out={id};for(const f of fields){const value=found[0][f];if(f==='shapeName'?typeof value!=='string'||value.length>20:!classicFaceTextOk(value,600))throw bad();out[f]=value;}return out;});};
 if(!data.impression||!classicFaceTextOk(data.impression.headline,120)||!classicFaceTextOk(data.impression.text,800)||!data.faceShape||!classicFaceTextOk(data.faceShape.name,60)||!classicFaceTextOk(data.faceShape.text,800)||!classicFaceTextOk(data.advice,900))throw bad();
 return {status:'ok',impression:{type:String(data.impression.type||''),headline:data.impression.headline,text:data.impression.text},faceShape:{name:data.faceShape.name,text:data.faceShape.text},samjeong:list(data.samjeong,CLASSIC_FACE_ZONES,['observation','reading']),ogwan:list(data.ogwan,CLASSIC_FACE_FEATURES,['shapeName','observation','reading']),palaces:list(data.palaces,CLASSIC_FACE_PALACES,['reading']),stages:list(data.stages,CLASSIC_FACE_STAGES,['reading']),themes:list(data.themes,CLASSIC_FACE_THEMES,['reading']),advice:data.advice};
}
// 가로세로 1024px 이하 JPEG로 다시 그려 위치·촬영정보 같은 메타데이터를 없애고 용량을 줄인다.
async function prepareClassicFaceImage(file){
 const viaImage=()=>new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('사진을 열 수 없어요. 다른 JPG 또는 PNG 사진을 골라 주세요.'));};img.src=url;});
 let bitmap;try{if(typeof createImageBitmap!=='function')throw Error('unsupported');bitmap=await createImageBitmap(file);}catch{bitmap=await viaImage();}
 const width=bitmap.width||bitmap.naturalWidth,height=bitmap.height||bitmap.naturalHeight,scale=Math.min(1,1024/Math.max(width,height)),canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
 const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);if(bitmap.close)bitmap.close();
 for(const quality of [0.85,0.7,0.55]){
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
  if(blob&&blob.size<=1000000)return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(Error('사진을 준비하지 못했어요.'));reader.readAsDataURL(blob);});
 }
 throw Error('사진 용량이 너무 커요. 더 작은 사진을 골라 주세요.');
}
function classicFaceText(report){
 const lines=[report.impression.headline,report.impression.text,'','얼굴형 · '+report.faceShape.name,report.faceShape.text,'','삼정'];
 for(const z of report.samjeong)lines.push(CLASSIC_FACE_ZONES[z.id][0]+' · '+z.observation+' '+z.reading);
 lines.push('','오관');for(const f of report.ogwan)lines.push(CLASSIC_FACE_FEATURES[f.id][0]+(f.shapeName?'('+f.shapeName+')':'')+' · '+f.observation+' '+f.reading);
 lines.push('','십이궁');for(const p of report.palaces)lines.push(CLASSIC_FACE_PALACES[p.id][0]+' · '+p.reading);
 lines.push('','시기별 주제');for(const s of report.stages)lines.push(CLASSIC_FACE_STAGES[s.id][0]+' · '+s.reading);
 lines.push('','살펴볼 결');for(const t of report.themes)lines.push(CLASSIC_FACE_THEMES[t.id]+' · '+t.reading);
 lines.push('','오늘의 한 걸음',report.advice);return lines.join('\n');
}
function renderClassicFace(report,model){
 const root=document.createElement('div');root.className='classic-face-result';
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const head=el('div',undefined,'classic-face-head');head.append(el('span','고전 관상 풀이 · AI','eyebrow'),el('h3',report.impression.headline),el('p',report.impression.text));root.append(head);
 const shape=el('article',undefined,'classic-face-card');shape.append(el('h4','얼굴형 · '+report.faceShape.name),el('p',report.faceShape.text));root.append(shape);
 const group=(title,sub,rows,open)=>{const d=el('details',undefined,'classic-face-group');d.open=!!open;d.append(el('summary',title),el('small',sub));for(const [name,note,body] of rows){const row=el('div',undefined,'classic-face-row');row.append(el('h4',name));if(note)row.append(el('small',note));for(const b of body)row.append(el('p',b));d.append(row);}root.append(d);};
 group('삼정(三停) · 얼굴을 세 구간으로 보기','삼재(天人地)에 대응하는 三才圖會의 틀',report.samjeong.map(z=>[CLASSIC_FACE_ZONES[z.id][0],CLASSIC_FACE_ZONES[z.id][1],[z.observation,z.reading]]),true);
 group('오관(五官) · 다섯 부위의 모양','三才圖會 五官之圖의 이름을 따랐어요',report.ogwan.map(f=>[CLASSIC_FACE_FEATURES[f.id][0]+(f.shapeName?' · '+f.shapeName:''),CLASSIC_FACE_FEATURES[f.id][1],[f.observation,f.reading]]));
 group('십이궁(十二宮) · 열 개의 자리','건강을 뜻하는 질액궁은 풀지 않았어요',report.palaces.map(p=>[CLASSIC_FACE_PALACES[p.id][0],CLASSIC_FACE_PALACES[p.id][1],[p.reading]]));
 group('초년·중년·말년 · 시기별 주제','삼정에 대응하는 전통적 주제이며 실제 사건의 예측이 아니에요',report.stages.map(s=>[CLASSIC_FACE_STAGES[s.id][0],CLASSIC_FACE_STAGES[s.id][1],[s.reading]]));
 group('재물·일·관계·기질 · 살펴볼 결','수익이나 결과를 알려 주는 것이 아니에요',report.themes.map(t=>[CLASSIC_FACE_THEMES[t.id],'',[t.reading]]));
 const advice=el('aside',undefined,'blessing');advice.append(el('small','TODAY · 오늘의 한 걸음'),el('p',report.advice));root.append(advice);
 root.append(el('p','전통 상징을 AI가 풀어쓴 성찰용 풀이입니다. 사진 한 장으로 사람의 성격·재산·건강·미래를 알 수 없으며, 오류가 있을 수 있어요. 출처 틀 · 三才圖會 人相類(1609)와 冰鑑의 공개 원문. 개별 서적의 조문을 인용한 것은 아니에요.','hint'));
 root.append(el('p','생성: '+new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})+' (한국시간) · '+model,'hint classic-face-meta'));
 return root;
}
function mountClassicFace(){
 const section=document.querySelector('#face');if(!section||document.querySelector('#classicFace'))return;
 const host=document.createElement('section');host.className='panel classic-face';host.id='classicFace';
 host.innerHTML=`<span class="eyebrow">CLASSIC · 고전 관상 풀이 (AI)</span><h2>고전의 틀로 읽는 내 얼굴</h2><p>삼정(三停)·오관(五官)·십이궁(十二宮)이라는 전통 관상학의 틀로 위에서 고른 사진을 AI가 풀어 줍니다. 오락과 자기 성찰을 위한 상징 풀이이며, 위의 ‘표정 거울’과는 별개입니다.</p><div class="classic-face-preview"><div><small>三停</small><span>상·중·하정과 초·중·말년의 주제</span></div><div><small>五官</small><span>눈썹·눈·귀·코·입의 모양</span></div><div><small>十二宮</small><span>명궁·재백궁·관록궁 등 열 자리</span></div></div><p class="hint">전통 원문에는 가난·요절·불화 같은 단정적 표현도 있지만 이 앱은 그런 결론을 사람에게 적용하지 않고, 살펴볼 점으로 바꿔서 전해요. 사진 속 안색(기색)과 건강은 읽지 않아요.</p><details class="gemini-settings"><summary>사진 전송 범위 확인</summary><p>선택한 사진을 가로세로 최대 1024px의 JPEG로 줄이고 위치·촬영 정보 같은 메타데이터를 없앤 뒤 온도 운영 서버를 거쳐 Google Gemini API로 보냅니다. 이름·기록·생년월일은 포함하지 않습니다. 운영 서버는 사진과 풀이를 저장하지 않으며, 이용 횟수 계산을 위해 무작위 브라우저 번호를 일별 식별값으로 바꿔 씁니다. Google의 API 이용 조건과 데이터 처리 정책이 적용됩니다. 얼굴 사진은 민감한 개인정보이므로 본인 사진이나 동의받은 사진만 사용해 주세요. 어린이 사진은 사용하지 마세요.</p></details><p class="hint">사주 AI 풀이와 같은 한도를 함께 씁니다. 같은 브라우저 하루 50회, 전체 하루 1000회, 요청 간격 10초이며 한국시간 자정에 갱신돼요. 실패하거나 중단해도 횟수는 차감됩니다.</p><label class="check"><input id="classicFaceConsent" type="checkbox"> 위 사진을 운영 서버와 Google에 보내 고전 관상 풀이를 생성합니다.</label><div class="actions"><button id="generateClassicFace" class="primary" type="button">고전 관상 풀이 생성 ✦</button><button id="cancelClassicFace" class="secondary" type="button" hidden>생성 중단</button></div><p id="classicFaceStatus" role="status"></p><p id="classicFaceError" role="alert"></p><div id="classicFaceOutput"></div>`;
 section.append(host);
 const q=s=>host.querySelector(s),sync=()=>{const ready=Boolean(facePhotoFile);if(!classicFaceRequest){q('#generateClassicFace').disabled=false;}q('#classicFaceStatus').textContent=ready?'':'위에서 사진을 먼저 촬영하거나 선택해 주세요.';if(!ready&&classicFaceRequest)cancelClassicFace();};
 sync();document.addEventListener('ondo-face-photo',sync);
 q('#cancelClassicFace').onclick=cancelClassicFace;
 let record=null;
 q('#generateClassicFace').onclick=async()=>{
  if(classicFaceRequest)return;q('#classicFaceError').textContent='';
  const endpoint=geminiSajuEndpoint();
  if(!endpoint){q('#classicFaceError').textContent=geminiSajuError(503);return;}
  if(!facePhotoFile){q('#classicFaceError').textContent='위에서 사진을 먼저 촬영하거나 선택해 주세요.';return;}
  if(!q('#classicFaceConsent').checked){q('#classicFaceError').textContent='전송 범위를 확인하고 전송 항목을 체크해 주세요.';return;}
  const controller=new AbortController();classicFaceRequest=controller;let timedOut=false;const timeout=setTimeout(()=>{timedOut=true;controller.abort();},90000);
  q('#generateClassicFace').disabled=true;q('#cancelClassicFace').hidden=false;q('#classicFaceOutput').setAttribute('aria-busy','true');q('#classicFaceStatus').textContent='사진을 준비하고 있어요.';
  try{
   const data=await prepareClassicFaceImage(facePhotoFile);
   if(controller.signal.aborted)return;
   q('#classicFaceStatus').textContent='Gemini가 고전의 틀로 읽고 있어요. 잠시 기다려 주세요.';
   const response=await fetch(endpoint,{method:'POST',headers:geminiSajuHeaders(),credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal,body:JSON.stringify({face:{image:{mime:'image/jpeg',data}}})});
   if(!response.ok)throw Error(classicFaceError(response.status));
   const result=await response.json();if(controller.signal.aborted||!host.isConnected)return;
   const report=parseClassicFaceReport(result.face),model=typeof result.model==='string'?result.model:'Gemini',out=q('#classicFaceOutput');
   if(report.status!=='ok'){out.textContent='';q('#classicFaceStatus').textContent='';q('#classicFaceError').textContent=CLASSIC_FACE_REFUSALS[report.status];return;}
   out.textContent='';out.append(renderClassicFace(report,model));
   const actions=document.createElement('div');actions.className='actions';
   const save=document.createElement('button');save.className='secondary';save.type='button';save.textContent='풀이 기록하기 ♡';
   const exportBtn=document.createElement('button');exportBtn.className='secondary';exportBtn.type='button';exportBtn.textContent='풀이 다운로드';
   actions.append(save,exportBtn);out.append(actions);
   record={type:'관상 · 고전 풀이 AI',title:report.impression.headline,question:'고전 관상 풀이 · 삼정·오관·십이궁 (사진은 저장되지 않음)',text:'AI 생성 해설 · '+model+'\n\n'+classicFaceText(report),blessing:''};
   save.onclick=()=>saveRecord(record);exportBtn.onclick=()=>downloadText('ondo-face-classic.txt',record.question+'\n\n'+record.text);
   q('#classicFaceStatus').textContent='풀이를 완성했어요. 사진은 저장하지 않았습니다.';
  }catch(err){if(host.isConnected){q('#classicFaceStatus').textContent='';q('#classicFaceError').textContent=controller.signal.aborted?(timedOut?'응답 대기 시간이 길어 중단했어요. 자동 재시도하지 않습니다.':'생성을 중단했어요. 이미 전송된 요청의 처리는 Google에서 계속될 수 있습니다.'):(err instanceof TypeError?'연결하지 못했어요. 인터넷 연결을 확인하거나 잠시 후 다시 시도해 주세요.':err.message||'풀이를 생성하지 못했어요.');}}
  finally{clearTimeout(timeout);if(classicFaceRequest===controller)classicFaceRequest=null;if(host.isConnected){q('#generateClassicFace').disabled=false;q('#cancelClassicFace').hidden=true;q('#classicFaceOutput').removeAttribute('aria-busy');}}
 };
}
window.addEventListener('pagehide',cancelClassicFace);
mountClassicFace();
