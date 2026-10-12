'use strict';
// Tropical zodiac, apparent geocentric true ecliptic of date. No remote API.
const ZODIAC=[
 ['양자리','Aries','♈','불','활동','시작과 용기','새로운 일을 작게 시작하는 상징입니다.','오늘 처음 시도할 한 가지는 무엇인가요?'],
 ['황소자리','Taurus','♉','흙','고정','감각과 지속','몸의 감각과 꾸준한 일상을 돌아보는 상징입니다.','오래 지키고 싶은 편안한 습관은 무엇인가요?'],
 ['쌍둥이자리','Gemini','♊','공기','변동','호기심과 소통','다양한 생각을 연결하고 질문하는 상징입니다.','아직 확인하지 않은 궁금증을 누구에게 물어볼까요?'],
 ['게자리','Cancer','♋','물','활동','돌봄과 안식','익숙한 공간과 정서적인 돌봄을 돌아보는 상징입니다.','나와 가까운 사람에게 필요한 돌봄은 무엇인가요?'],
 ['사자자리','Leo','♌','불','고정','창조와 표현','나만의 표현과 즐거움을 찾아보는 상징입니다.','잘 보이려는 마음을 내려놓고 무엇을 즐길까요?'],
 ['처녀자리','Virgo','♍','흙','변동','관찰과 정돈','작은 차이를 관찰하고 일상을 다듬는 상징입니다.','완벽하지 않아도 오늘 개선할 한 가지는 무엇인가요?'],
 ['천칭자리','Libra','♎','공기','활동','관계와 균형','서로 다른 입장을 듣고 균형을 찾는 상징입니다.','내 필요와 상대의 필요를 어떻게 함께 말할까요?'],
 ['전갈자리','Scorpio','♏','물','고정','깊이와 변화','깊은 감정을 살피고 변화의 의미를 묻는 상징입니다.','붙잡고 있는 것 중 조금 내려놓을 것은 무엇인가요?'],
 ['사수자리','Sagittarius','♐','불','변동','탐색과 의미','새로운 경험을 통해 배움의 범위를 넓히는 상징입니다.','내 생각 밖의 관점을 어디에서 만나볼까요?'],
 ['염소자리','Capricorn','♑','흙','활동','책임과 계획','시간을 들여 목표를 세우고 실천하는 상징입니다.','큰 목표를 오늘 할 수 있는 단계로 나누면 무엇인가요?'],
 ['물병자리','Aquarius','♒','공기','고정','독창성과 연결','익숙한 틀을 새롭게 보고 공동체를 생각하는 상징입니다.','나의 아이디어가 누구에게 도움이 될 수 있을까요?'],
 ['물고기자리','Pisces','♓','물','변동','상상과 공감','상상력과 공감, 마음의 경계를 돌아보는 상징입니다.','공감하면서도 나의 여유를 지키려면 무엇이 필요할까요?']
].map((a,i)=>({id:i,name:a[0],en:a[1],glyph:a[2],element:a[3],mode:a[4],theme:a[5],text:a[6],question:a[7]}));
const ASTRO_BODIES=[['Sun','태양','☉','의식과 방향'],['Moon','달','☽','감정과 쉼'],['Mercury','수성','☿','생각과 소통'],['Venus','금성','♀','취향과 관계'],['Mars','화성','♂','행동과 의지'],['Jupiter','목성','♃','배움과 확장'],['Saturn','토성','♄','책임과 경계'],['Uranus','천왕성','♅','변화와 독창성'],['Neptune','해왕성','♆','상상과 이상'],['Pluto','명왕성','♇','전환과 깊이']];
const ASTRO_ASPECTS=[{angle:0,name:'합',text:'두 주제를 함께 살펴보는 연결'},{angle:60,name:'육분각',text:'작은 기회와 협력을 찾아보는 연결'},{angle:90,name:'사각',text:'서로 다른 필요를 조율해 보는 연결'},{angle:120,name:'삼분각',text:'익숙한 강점을 실천으로 옮기는 연결'},{angle:180,name:'충',text:'양쪽의 관점을 균형 있게 보는 연결'}];
const astroKey='ondo-astro-profile-v1';let astroProfile=null,astroChart=null,astroDay='',currentAstro=null;
const astroNorm=x=>((x%360)+360)%360;
const astroDelta=(a,b)=>((a-b+540)%360)-180;
const astroSign=x=>ZODIAC[Math.floor(astroNorm(x)/30)];
const astroClock=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
function koreanParts(ms){return Object.fromEntries(astroClock.formatToParts(new Date(ms)).filter(x=>x.type!=='literal').map(x=>[x.type,Number(x.value)]));}
function koreanInstants(date,time){
 const [y,m,d]=date.split('-').map(Number),[h,min]=time.split(':').map(Number),target=Date.UTC(y,m-1,d,h,min),offsets=new Set();
 for(const shift of [-36,0,36]){const stamp=target+shift*3600000,p=koreanParts(stamp);offsets.add(Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-stamp);}
 return [...offsets].map(offset=>target-offset).filter(ms=>{const p=koreanParts(ms);return p.year===y&&p.month===m&&p.day===d&&p.hour===h&&p.minute===min;}).sort((a,b)=>a-b);
}
function validateAstro(p){
 if(!p||!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||!/^\d{2}:\d{2}$/.test(p.time))throw Error('생년월일과 시간을 확인해 주세요.');
 const [y,m,d]=p.date.split('-').map(Number),[h,min]=p.time.split(':').map(Number);
 if(y<1908||y>2049||!ManseLib.isValidSolarDate(y,m,d)||p.date>localDay()||h>23||min>59)throw Error('1908년 이후의 유효한 생년월일과 시각을 입력해 주세요.');
 return {date:p.date,time:p.unknown?'12:00':p.time,unknown:p.unknown===true};
}
function astroLongitude(body,ms){return astroNorm(Astronomy.Ecliptic(Astronomy.GeoVector(body,new Date(ms),true)).elon);}
function astroPositions(ms){return ASTRO_BODIES.map(([body,name,glyph,role])=>{const lon=astroLongitude(body,ms),speed=astroDelta(astroLongitude(body,ms+12*3600000),astroLongitude(body,ms-12*3600000));return {body,name,glyph,role,lon,sign:astroSign(lon),retro:speed<-.001};});}
function astroAspect(a,b,orb=6){const distance=Math.abs(astroDelta(a,b));const match=ASTRO_ASPECTS.map(x=>({...x,orb:Math.abs(distance-x.angle)})).sort((x,y)=>x.orb-y.orb)[0];return match.orb<=orb?match:null;}
function calculateAstro(profile){
 const p=validateAstro(profile),instants=koreanInstants(p.date,p.time);
 if(instants.length!==1)throw Error('과거 서머타임 전환으로 겹치거나 존재하지 않는 시각입니다. 출생기록을 확인하거나 시간 미상을 선택해 주세요.');
 const ms=instants[0],planets=astroPositions(ms),aspects=[];
 if(p.unknown){const times=[];for(let h=0;h<24;h++)times.push(...koreanInstants(p.date,String(h).padStart(2,'0')+':00'));times.push(...koreanInstants(p.date,'23:59'));for(const planet of planets){planet.possible=[...new Set(times.map(t=>astroSign(astroLongitude(planet.body,t)).id))].sort((a,b)=>a-b);}}
 else for(let i=0;i<planets.length;i++)for(let j=i+1;j<planets.length;j++){const a=astroAspect(planets[i].lon,planets[j].lon);if(a)aspects.push({...a,a:planets[i],b:planets[j]});}
 return {profile:p,ms,planets,aspects:aspects.sort((a,b)=>a.orb-b.orb)};
}
function zodiacWheel(chart){
 const point=(deg,r)=>{const a=(180-deg)*Math.PI/180;return [220+r*Math.cos(a),220-r*Math.sin(a)];};const line=(a,b,cls)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${cls}"/>`;
 return `<svg viewBox="0 0 440 440" role="img" aria-label="열두 별자리와 열 천체의 황도 위치. 번호는 아래 천체 표와 대응합니다."><circle cx="220" cy="220" r="211" class="astro-rim"/><circle cx="220" cy="220" r="167" class="astro-ring"/><circle cx="220" cy="220" r="111" class="astro-ring"/>${ZODIAC.map(z=>{const p=point(z.id*30+15,189);return line(point(z.id*30,168),point(z.id*30,210),'astro-divider')+`<text x="${p[0]}" y="${p[1]+7}" class="zodiac-glyph">${z.glyph}</text>`;}).join('')}${chart.aspects.slice(0,10).map(a=>line(point(a.a.lon,108),point(a.b.lon,108),'aspect-line '+(a.angle===90||a.angle===180?'tense':'flow'))).join('')}${chart.planets.map((p,i)=>{const q=point(p.lon,112+(i%3)*18),r=point(p.lon,164);return line(r,q,'planet-guide')+`<circle cx="${r[0]}" cy="${r[1]}" r="2" fill="#e6cd91"/><circle cx="${q[0]}" cy="${q[1]}" r="9" class="planet-pin"/><text x="${q[0]}" y="${q[1]+3.5}" class="planet-number">${i+1}</text>`;}).join('')}<circle cx="220" cy="220" r="39" fill="#211c3a"/><text x="220" y="222" class="wheel-center">✦</text><text x="220" y="242" class="wheel-sub">${chart.profile.unknown?'NOON ESTIMATE':'BIRTH SKY'}</text></svg>`;
}
function astroDaily(chart,day=localDay()){
 const ms=koreanInstants(day,'12:00')[0],moonLon=astroLongitude('Moon',ms),sunLon=astroLongitude('Sun',ms),moon=astroSign(moonLon),sun=astroSign(sunLon),phase=Astronomy.MoonPhase(new Date(ms));
 const phaseNames=['신월 무렵','차오르는 초승달','상현달 무렵','차오르는 달','보름달 무렵','기우는 달','하현달 무렵','그믐달 무렵'];const phaseName=phaseNames[Math.floor((phase+22.5)%360/45)];
 const transit=chart.profile.unknown?null:astroAspect(moonLon,chart.planets[0].lon,4);
 const question=moon.question,blessing=blessings[Math.floor(ms/86400000)%blessings.length];
 return {day,moon,sun,phaseName,transit,question,blessing};
}
function renderAstro(chart){
 astroChart=chart;const p=chart.profile,d=astroDaily(chart);astroDay=d.day;
 const label=x=>p.unknown&&x.possible.length>1?x.possible.map(id=>ZODIAC[id].name).join(' / '):x.sign.name;
 const exact=x=>`${Math.floor(x.lon%30)}° ${String(Math.floor((x.lon%1)*60)).padStart(2,'0')}′`;
 const elements=['불','흙','공기','물'].map(e=>({e,n:chart.planets.filter(x=>x.sign.element===e).length}));
 const dailyText=`오늘 정오의 태양은 ${d.sun.name}, 달은 ${d.moon.name}에 있습니다. ${d.moon.text} ${d.question}`;
 currentAstro={type:'별자리·점성술',title:d.day+' · '+label(chart.planets[0]),question:p.date+' '+(p.unknown?'출생시간 미상':p.time+' 한국 출생기록'),text:dailyText+'\n\n'+chart.planets.map(x=>`${x.name}: ${label(x)}${p.unknown?' (정오 추정)':''} · ${x.role}\n${x.sign.text}`).join('\n\n'),blessing:d.blessing};
 $('#astroResult').innerHTML=`<div class="astro-sky"><span class="eyebrow">YOUR CELESTIAL SIGNATURE</span><h2>나의 태양 별자리 · ${label(chart.planets[0])}</h2><p>${p.date} · ${p.unknown?'시간 미상 / 정오 추정':p.time+' / 한국 출생기록'}</p><div class="astro-chart-layout"><div class="astro-wheel">${zodiacWheel(chart)}</div><div class="astro-big-three">${chart.planets.slice(0,3).map(x=>`<article><span>${x.glyph}</span><div><small>${x.name} · ${x.role}</small><h3>${label(x)}</h3><p>${p.unknown&&x.possible.length>1?'이날 별자리 경계가 바뀔 수 있어 출생시간 확인이 필요합니다.':x.sign.theme}</p></div></article>`).join('')}</div></div><p class="hint">서양 열대황도 · 지구 중심 기준 · 원 안의 번호는 아래 천체 표에 대응합니다.</p></div>
 ${p.unknown?'<p class="notice">출생시간 미상: 그림·도수·역행은 정오 추정입니다. 별자리 후보는 당일 매시간 및 23:59를 계산한 범위이며, 경계 근처에서는 정확한 시각을 확인해 주세요. 출생 각도 해석은 생략합니다.</p>':''}
 <div class="daily-saju-card"><span class="eyebrow">TODAY’S SKY · ${d.day} · 한국 정오</span><h2>오늘의 별자리 · ${d.moon.theme}</h2><p>${dailyText}</p><p class="tag">달의 모습: ${d.phaseName} · 오늘의 태양: ${d.sun.name} · 오늘의 달: ${d.moon.name}</p>${d.transit?`<div class="reading-question"><b>오늘의 달 ↔ 나의 태양 · ${d.transit.name}</b><p>${d.transit.text}입니다. 두 관점이 현재의 어떤 경험과 닮았는지 생각해 보세요.</p></div>`:''}${blessingHTML(d.blessing)}</div>
 <div class="insights astro-insights">${chart.planets.slice(0,5).map(x=>`<article><h3>${x.glyph} ${x.name} · ${x.role}</h3><p><b>${label(x)}</b> · ${x.sign.element} / ${x.sign.mode}${p.unknown?' (정오 기준)':''}</p><p>${p.unknown&&x.possible.length>1?'출생시간에 따라 별자리가 달라질 수 있습니다. 도감에서 각 후보의 상징을 함께 살펴보세요.':x.sign.text}</p><p class="hint">${p.unknown&&x.possible.length>1?'정확한 출생시간을 입력하면 하나의 위치로 계산합니다.':x.sign.question}</p></article>`).join('')}</div>
 <details class="detail-panel" open><summary>태양·달과 8개 행성 위치</summary><div class="table-scroll"><table><thead><tr><th>천체</th><th>별자리</th><th>${p.unknown?'정오 추정 도수':'도수'}</th><th>움직임</th></tr></thead><tbody>${chart.planets.map((x,i)=>`<tr><td>${i+1}. ${x.glyph} ${x.name}</td><td>${label(x)}</td><td>${exact(x)}</td><td>${x.retro?'역행':'순행'}</td></tr>`).join('')}</tbody></table></div><p class="hint">역행은 지구에서 본 겉보기 이동 방향입니다. 천체가 실제로 궤도를 거꾸로 도는 것은 아니며 불운을 뜻하지 않습니다.</p></details>
 <details class="detail-panel"><summary>원소 분포와 행성 간 각도</summary><div class="astro-elements">${elements.map(x=>`<span>${x.e}<b>${x.n}</b></span>`).join('')}</div><p class="hint">열 천체의 단순 개수이며 성격 점수가 아닙니다.${p.unknown?' 정오 추정 위치 기준입니다.':''}</p>${p.unknown?'<p>시간 미상으로 출생 각도 해석을 생략했습니다.</p>':chart.aspects.length?chart.aspects.map(a=>`<p><b>${a.a.name} · ${a.b.name} — ${a.name} ${a.angle}°</b><br>${a.text} · 오차 ${a.orb.toFixed(1)}°</p>`).join(''):'<p>설정한 오차 범위 안에 주요 각도가 없습니다.</p>'}</details>
 <details class="detail-panel"><summary>계산 기준과 GitHub 자료</summary><p>천체 위치: Astronomy Engine 2.1.19. 열대황도·지구 중심·날짜의 참황도 좌표를 사용하며 광행차와 광행시간 보정을 적용합니다. 한국 출생기록은 Asia/Seoul 과거 표준시·서머타임을 반영해 UTC로 바꿉니다. 사주용 진태양시나 자시 기준은 적용하지 않습니다.</p><p>출생 주요 각도는 0°·60°·90°·120°·180°, 허용 오차 6°입니다. 오늘의 달과 출생 태양은 4°를 사용합니다. 오늘의 풀이는 한국 날짜 정오를 기준으로 하루 동안 같습니다. 상승궁·하우스는 이번 버전의 계산 대상에 포함하지 않습니다.</p><p>위치 계산과 해석은 구분합니다. 한국어 풀이는 직접 작성한 전통 상징 기반의 성찰 문구이며 과학적 성격 진단이나 미래 예측이 아닙니다.</p><a href="SOURCES.md" target="_blank" rel="noopener">비교한 GitHub 프로젝트와 라이선스</a></details><div class="actions"><button id="saveAstroReading" class="primary">오늘의 별자리 기록하기 ♡</button><button id="exportAstroReading" class="secondary">풀이 다운로드</button></div>`;
 $('#saveAstroReading').onclick=()=>saveRecord(currentAstro);$('#exportAstroReading').onclick=()=>downloadText('ondo-astrology.txt',currentAstro.title+'\n'+currentAstro.question+'\n\n'+currentAstro.text+'\n\n'+currentAstro.blessing);
}
function fillAstro(p){$('#astroBirth').value=p.date;$('#astroTime').value=p.time;$('#astroUnknown').checked=p.unknown;$('#astroTime').disabled=p.unknown;$('#astroTime').required=!p.unknown;}
function readAstro(){return validateAstro({date:$('#astroBirth').value,time:$('#astroTime').value||'12:00',unknown:$('#astroUnknown').checked});}
function astroNotice(){ $('#clearAstroBirth').hidden=!astroProfile;$('#astroProfileNote').textContent=astroProfile?'이 브라우저에 저장된 생일로 오늘의 별자리를 자동 표시합니다. 입력을 바꾸고 다시 펼치면 저장 정보도 수정됩니다.':'생일을 입력하거나 저장한 사주 정보를 불러오세요. 별자리 저장 정보는 사주와 별도로 관리됩니다.';}
$('#astroUnknown').onchange=()=>{$('#astroTime').disabled=$('#astroUnknown').checked;$('#astroTime').required=!$('#astroUnknown').checked;};$('#astroBirth').max=localDay();
$('#astroForm').onsubmit=e=>{e.preventDefault();$('#astroError').textContent='';try{const p=readAstro(),chart=calculateAstro(p);renderAstro(chart);try{if($('#astroRemember').checked){localStorage.setItem(astroKey,JSON.stringify({version:1,profile:p}));astroProfile=p;}else{localStorage.removeItem(astroKey);astroProfile=null;}astroNotice();}catch{$('#astroError').textContent='계산은 완료했지만 저장 정보를 변경하지 못했어요.';}$('#astroResult').scrollIntoView({behavior:'smooth',block:'start'});}catch(err){$('#astroError').textContent=err.message||'계산에 실패했습니다. 입력을 확인해 주세요.';}};
$('#importAstroBirth').onclick=()=>{try{const stored=JSON.parse(localStorage.getItem(sajuProfileKey)||'null');if(!stored)throw Error('사주에서 먼저 생년월일을 저장해 주세요.');const birth=normalizeSajuProfile(stored.input),chart=calcSajuV2(birth);fillAstro({date:chart.dayString,time:String(birth.hour).padStart(2,'0')+':'+String(birth.minute).padStart(2,'0'),unknown:birth.unknown});$('#astroError').textContent='';$('#astroProfileNote').textContent='사주 생일을 불러왔어요. 「나의 별자리 펼치기」를 누르면 계산하고 저장합니다.';}catch(err){$('#astroError').textContent=err.message;}};
$('#clearAstroBirth').onclick=()=>{if(!confirm('별자리에 저장한 생일을 삭제할까요? 사주 생일과 내 기록은 유지됩니다.'))return;try{localStorage.removeItem(astroKey);astroProfile=null;astroChart=null;currentAstro=null;astroDay='';$('#astroForm').reset();$('#astroTime').disabled=false;$('#astroTime').required=true;$('#astroResult').innerHTML='';$('#astroError').textContent='';astroNotice();toast('별자리 생일 정보를 삭제했어요.');}catch{$('#astroError').textContent='삭제하지 못했어요. 브라우저 설정을 확인해 주세요.';}};
$('#zodiacCatalog').innerHTML=ZODIAC.map(z=>`<article class="zodiac-card"><span>${z.glyph}</span><small>${z.en} · ${z.id*30}–${(z.id+1)*30}°</small><h3>${z.name}</h3><p class="tag">${z.element} · ${z.mode} · ${z.theme}</p><p>${z.text}</p><p class="hint">${z.question}</p></article>`).join('');
function refreshAstro(){if(astroChart&&astroDay!==localDay())try{renderAstro(astroChart);}catch{$('#astroError').textContent='오늘의 하늘을 계산하지 못했어요. 다시 시도해 주세요.';}}
try{const s=JSON.parse(localStorage.getItem(astroKey)||'null');if(s){if(s.version!==1)throw Error();astroProfile=validateAstro(s.profile);fillAstro(astroProfile);renderAstro(calculateAstro(astroProfile));}}catch{astroProfile=null;$('#astroError').textContent='저장한 별자리 생일을 불러오지 못했어요. 다시 입력해 주세요.';}astroNotice();
document.addEventListener('ondo:page',e=>{if(e.detail==='astro')refreshAstro();});window.addEventListener('focus',refreshAstro);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshAstro();});setInterval(()=>{if(!document.hidden&&!$('#astro').hidden)refreshAstro();},60000);
