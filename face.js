'use strict';
const expressionTips={
 warm:{name:'따뜻하고 편안하게',title:'편안한 미소를 연습하는 시간',tip:'입꼬리를 억지로 올리기보다 숨을 천천히 내쉬고 턱과 어깨의 힘을 풀어보세요. 미소가 편하지 않다면 자연스러운 표정도 충분합니다.',style:'부드러운 자연광을 옆이나 앞에 두고, 편안하게 느끼는 옷을 골라보세요. 어떤 색이나 옷이 어울리는지는 직접 비교해 결정해도 좋아요.'},
 clear:{name:'단정하고 또렷하게',title:'내가 전하고 싶은 모습을 분명하게',tip:'카메라를 눈높이에 맞추고 자세를 편하게 세워보세요. 인위적으로 표정을 만들기보다 평소 인사하는 순간을 떠올려 보세요.',style:'단순한 배경과 고른 조명을 사용하면 표정이 더 잘 보입니다. 화면을 보며 머리카락이나 옷깃을 원하는 모양으로 정돈해 보세요.'},
 bright:{name:'밝고 생기 있게',title:'좋아하는 순간을 표정에 담아보기',tip:'즐거웠던 일을 떠올리고 여러 표정을 가볍게 시도해 보세요. 크게 웃지 않아도 괜찮아요. 내가 좋아하는 한 장을 골라보세요.',style:'밝은 창가에서 역광을 피하고 찍어보세요. 좋아하는 색의 작은 소품을 더해 나만의 분위기를 표현할 수 있어요.'},
 calm:{name:'차분하고 자연스럽게',title:'꾸미지 않은 내 모습에도 여유를',tip:'깊게 숨을 한 번 쉬고 눈과 입 주변을 편안하게 두어보세요. 카메라를 꼭 응시할 필요는 없어요. 시선과 각도를 바꿔보며 마음에 드는 모습을 찾아보세요.',style:'눈부신 조명 대신 부드러운 빛과 차분한 배경을 선택해 보세요. 과한 필터 없이 서로 다른 사진을 비교해 보는 것도 좋습니다.'}
};
const faceMessages=[
 ['작은 친절','오늘 만나는 사람에게 짧은 인사 한마디를 먼저 건네보세요. 작은 친절은 일상의 분위기를 바꿀 수 있어요.'],
 ['나의 속도','남의 속도와 비교하지 말고 오늘 할 수 있는 한 걸음을 골라보세요. 천천히 가는 시간도 의미가 있습니다.'],
 ['고마운 마음','당연하게 느꼈던 도움 하나를 떠올려 보세요. 고맙다는 말을 전하는 일이 오늘의 작은 실천이 될 수 있어요.'],
 ['새로운 시선','늘 하던 일에 작은 변화를 주어보세요. 다른 길로 산책하거나 새로운 음악을 듣는 것부터 시작해도 좋습니다.'],
 ['마음의 쉼표','모든 순간을 잘해내려 애쓰지 않아도 됩니다. 잠깐 쉬고 다시 시작할 여유를 자신에게 주세요.'],
 ['말의 온도','오늘 나에게 하는 말을 조금 더 다정하게 바꿔보세요. 잘한 것 하나를 구체적으로 칭찬해 보세요.']
];
let faceObjectUrl=null,faceLoadId=0,currentFace=null,facePhotoFile=null;
function removeFacePhoto(){facePhotoFile=null;document.dispatchEvent(new CustomEvent('ondo-face-photo'));faceLoadId++;if(faceObjectUrl){URL.revokeObjectURL(faceObjectUrl);faceObjectUrl=null;}$('#facePhoto').removeAttribute('src');$('#facePhoto').hidden=true;$('#photoPlaceholder').hidden=false;$('#removePhoto').hidden=true;$('#faceFile').value='';$('#faceCamera').value='';$('#photoError').textContent='';}
$('#removePhoto').onclick=removeFacePhoto;
function loadFacePhoto(file){if(!file)return;removeFacePhoto();if(!['image/jpeg','image/png','image/webp'].includes(file.type)){$('#photoError').textContent='JPG, PNG, WebP 사진을 선택해 주세요.';return;}if(file.size>10*1024*1024){$('#photoError').textContent='10MB 이하 사진을 선택해 주세요.';return;}const id=faceLoadId;const url=URL.createObjectURL(file);faceObjectUrl=url;const probe=new Image();probe.onload=()=>{if(id!==faceLoadId)return;facePhotoFile=file;document.dispatchEvent(new CustomEvent('ondo-face-photo'));$('#facePhoto').src=url;$('#facePhoto').hidden=false;$('#photoPlaceholder').hidden=true;$('#removePhoto').hidden=false;};probe.onerror=()=>{if(id!==faceLoadId)return;removeFacePhoto();$('#photoError').textContent='사진을 열 수 없습니다. 다른 JPG 또는 PNG 파일을 선택해 주세요.';};probe.src=url;}
$('#takeFacePhoto').onclick=()=>$('#faceCamera').click();
$('#chooseFacePhoto').onclick=()=>$('#faceFile').click();
for(const input of [$('#faceCamera'),$('#faceFile')])input.addEventListener('change',()=>loadFacePhoto(input.files[0]));
window.addEventListener('pagehide',()=>{removeFacePhoto();});
function renderFace(){const choice=$('#expressionGoal').value;const tip=expressionTips[choice]||expressionTips.warm;const msg=faceMessages[rand(faceMessages.length)],blessing=blessings[rand(blessings.length)];currentFace={type:'관상 · 인상',title:tip.title,question:'직접 선택한 분위기: '+tip.name,text:`표현 연습\n${tip.tip}\n\n스타일·촬영 팁\n${tip.style}\n\n사진과 무관한 무작위 응원 메시지 · ${msg[0]}\n${msg[1]}`,blessing};$('#faceResult').innerHTML=`<span class="eyebrow">YOUR EXPRESSION · YOUR CHOICE</span><h2>${tip.title}</h2><p class="hint">직접 선택한 분위기: ${tip.name} · 얼굴 분석 결과가 아닙니다.</p><div class="insights"><article><h3>☺ 표현 연습</h3><p>${tip.tip}</p></article><article><h3>✧ 스타일·촬영 팁</h3><p>${tip.style}</p></article></div><div class="panel"><span class="eyebrow">RANDOM MESSAGE · 사진과 무관한 무작위 메시지</span><h3>${msg[0]}</h3><p>${msg[1]}</p></div>${blessingHTML(blessing)}<div class="actions"><button class="primary" id="saveFace">메시지 저장하기 ♡</button><button class="secondary" id="againFace">새 메시지 뽑기</button></div><p class="hint">저장되는 내용: 선택한 분위기, 표현 팁, 응원 문장. 사진은 저장되지 않습니다.</p>`;$('#saveFace').onclick=()=>saveRecord(currentFace);$('#againFace').onclick=renderFace;$('#faceResult').scrollIntoView({behavior:'smooth',block:'start'});}
$('#drawFace').onclick=renderFace;
