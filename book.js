// 온도책 화면. 표지를 열고 책장을 몇 장 넘긴 뒤, 1000개 문장 중 하나를 오른쪽 면에 한 글자씩 써 보인다.
'use strict';
// bookDelay를 0으로 두면 넘김과 글씨 효과 없이 바로 보여 준다(테스트·동작 줄이기 설정).
let bookDelay=900,bookBusy=false,currentBook=null;
// 위기 신호가 담긴 고민에는 무작위 문장 대신 도움받을 곳을 먼저 안내한다.
const BOOK_CRISIS=/자살|죽고\s*싶|죽을까|살기\s*싫|사라지고\s*싶|자해|극단적\s*선택/;
function bookEl(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function bookWait(ms){return ms>0?new Promise(r=>setTimeout(r,ms)):Promise.resolve();}
function bookFast(){return bookDelay===0||(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);}
// 오른쪽 면 위로 책장 한 장을 올려 왼쪽으로 넘긴다.
async function bookTurnLeaf(){
 const leaf=bookEl('div','book-leaf');$('#ondoBook').append(leaf);
 leaf.getBoundingClientRect();leaf.classList.add('turn');
 setTimeout(()=>leaf.remove(),700);
 await bookWait(150);
}
// 문장을 글자 단위로 나눠 차례로 번지듯 나타나게 한다.
async function bookInk(sentence,fast){
 const box=document.querySelector('.book-sentence');box.textContent='';
 if(fast){box.textContent=sentence;return;}
 const chars=[...sentence];
 chars.forEach((ch,i)=>{const s=bookEl('span','ink',ch);s.style.animationDelay=(i*55)+'ms';box.append(s);});
 await bookWait(chars.length*55+420);
}
function renderBookActions(sentence,page,worry){
 const out=$('#bookResult');out.textContent='';
 out.append(bookEl('p','sr-only',`${page}쪽 · ${sentence}`));
 if(worry)out.append(bookEl('p','book-worry','고민 · '+worry));
 const actions=bookEl('div','actions');
 const again=bookEl('button','secondary','다시 펼치기');again.type='button';again.onclick=()=>openBook();
 const save=bookEl('button','secondary','기록하기 ♡');save.type='button';save.onclick=()=>saveRecord(currentBook);
 actions.append(again,save);out.append(actions);
 out.append(bookEl('p','hint','무작위로 고른 문장이에요. 마음에 남는 부분만 가져가고, 결정은 당신의 몫이에요.'));
}
function renderBookSupport(){
 const out=$('#bookResult');out.textContent='';currentBook=null;
 const card=bookEl('article','book-answer book-support');
 card.append(bookEl('p','book-sentence','지금 많이 힘드신 것 같아요. 이 마음은 책보다 사람과 나누는 게 좋아요.'),bookEl('p',undefined,'자살예방상담전화 109(24시간)에 전화하거나, 믿을 수 있는 사람에게 지금 연락해 보세요. 위급하면 119에 연락하세요.'));
 out.append(card);
}
async function openBook(){
 if(bookBusy)return;
 const worry=$('#bookWorry').value.trim().slice(0,80);
 if(BOOK_CRISIS.test(worry)){renderBookSupport();return;}
 bookBusy=true;const fast=bookFast(),book=$('#ondoBook'),btn=$('#openBook');
 btn.disabled=true;$('#bookResult').textContent='';$('#bookStatus').textContent='책장을 넘기고 있어요…';
 document.querySelector('.book-sentence').textContent='';document.querySelector('.book-page').textContent='';
 try{
  if(!book.classList.contains('open')){book.classList.add('open');await bookWait(fast?0:800);}
  if(!fast){const leaves=4+rand(4);for(let i=0;i<leaves;i++)await bookTurnLeaf();await bookWait(420);}
  const index=rand(ONDO_BOOK_ANSWERS.length),sentence=ONDO_BOOK_ANSWERS[index],page=index+1;
  currentBook={type:'온도책',title:`p.${page} · ${sentence}`,question:worry||'마음속 고민',text:sentence,blessing:''};
  document.querySelector('.book-page').textContent=`p. ${page}`;
  $('#bookStatus').textContent='';
  await bookInk(sentence,fast);
  renderBookActions(sentence,page,worry);
 }finally{bookBusy=false;btn.disabled=false;btn.textContent='고민을 떠올리고 다시 펼치기 ✦';}
}
$('#openBook').onclick=()=>openBook();
$('#bookWorry').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();openBook();}});
