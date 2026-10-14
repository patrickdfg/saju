// 관상 사진 촬영을 페이지 안 카메라로 처리한다. 카메라 앱을 오가다 사진이 사라지는 문제를 피하고, 안 되면 기존 촬영 방식으로 돌아간다.
'use strict';
let faceCamStream=null,faceCamFacing='user';
function faceCamStop(){if(faceCamStream){for(const t of faceCamStream.getTracks())t.stop();faceCamStream=null;}const o=document.querySelector('.cam-overlay');if(o)o.remove();document.body.classList.remove('cam-open');}
function faceCamFallback(message){faceCamStop();if(message&&typeof toast==='function')toast(message);$('#faceCamera').click();}
function faceCamSupported(){return Boolean(window.isSecureContext!==false&&navigator.mediaDevices&&typeof navigator.mediaDevices.getUserMedia==='function');}
async function faceCamStart(){
 const video=document.querySelector('.cam-overlay video');if(!video)return;
 if(faceCamStream){for(const t of faceCamStream.getTracks())t.stop();faceCamStream=null;}
 try{
  faceCamStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:faceCamFacing,width:{ideal:1280},height:{ideal:1280}},audio:false});
  if(!document.querySelector('.cam-overlay')){faceCamStop();return;}
  video.srcObject=faceCamStream;video.classList.toggle('mirror',faceCamFacing==='user');
  await video.play().catch(()=>{});
  document.querySelector('.cam-shutter').disabled=false;
 }catch(err){
  const denied=err&&(err.name==='NotAllowedError'||err.name==='SecurityError');
  faceCamFallback(denied?'카메라 권한이 꺼져 있어요. 휴대폰 카메라로 찍는 방식으로 열게요.':'');
 }
}
function faceCamOpen(){
 if(!faceCamSupported()){$('#faceCamera').click();return;}
 faceCamStop();
 const o=document.createElement('div');o.className='cam-overlay';o.setAttribute('role','dialog');o.setAttribute('aria-label','사진 촬영');
 o.innerHTML='<video playsinline autoplay muted></video><p class="cam-guide">얼굴이 화면 가운데에 오도록 맞춰 주세요</p><div class="cam-actions"><button type="button" class="cam-cancel">취소</button><button type="button" class="cam-shutter" aria-label="촬영" disabled></button><button type="button" class="cam-flip">전환</button></div>';
 document.body.append(o);document.body.classList.add('cam-open');
 o.querySelector('.cam-cancel').onclick=()=>faceCamStop();
 o.querySelector('.cam-flip').onclick=()=>{faceCamFacing=faceCamFacing==='user'?'environment':'user';faceCamStart();};
 o.querySelector('.cam-shutter').onclick=faceCamCapture;
 faceCamStart();
}
function faceCamCapture(){
 const video=document.querySelector('.cam-overlay video');
 const w=video&&video.videoWidth,h=video&&video.videoHeight;
 if(!w||!h){faceCamFallback('카메라 화면을 가져오지 못했어요. 휴대폰 카메라로 찍는 방식으로 열게요.');return;}
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d');if(!ctx){faceCamFallback('');return;}
 ctx.drawImage(video,0,0,w,h);
 canvas.toBlob(blob=>{
  faceCamStop();
  if(!blob){if(typeof toast==='function')toast('사진을 만들지 못했어요. 다시 찍어 주세요.');return;}
  const file=new File([blob],'ondo-camera.jpg',{type:'image/jpeg',lastModified:Date.now()});
  loadFacePhoto(file);
 },'image/jpeg',0.92);
}
$('#takeFacePhoto').onclick=faceCamOpen;
document.addEventListener('visibilitychange',()=>{if(document.hidden)faceCamStop();});
window.addEventListener('pagehide',faceCamStop);
