// 온도책 화면. 고민을 떠올리고 펼치면 1000개 문장 중 하나를 무작위로 보여 준다.
'use strict';
let bookDelay=900,bookTimer=null,currentBook=null;
// 위기 신호가 담긴 고민에는 무작위 문장 대신 도움받을 곳을 먼저 안내한다.
const BOOK_CRISIS=/자살|죽고\s*싶|죽을까|살기\s*싫|사라지고\s*싶|자해|극단적\s*선택/;
function bookEl(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function renderBookAnswer(index,worry){
 const out=$('#bookResult'),answer=ONDO_BOOK_ANSWERS[index],page=index+1;
 currentBook={type:'온도책',title:`p.${page} · ${answer}`,question:worry||'마음속 고민',text:answer,blessing:''};
 out.textContent='';
 const card=bookEl('article','book-answer');
 card.append(bookEl('span','book-page',`p. ${page}`),bookEl('p','book-sentence',answer));
 if(worry){const q=bookEl('p','book-worry');q.textContent='고민 · '+worry;card.append(q);}
 out.append(card);
 const actions=bookEl('div','actions');
 const again=bookEl('button','secondary','다시 펼치기');again.type='button';again.onclick=()=>openBook();
 const save=bookEl('button','secondary','기록하기 ♡');save.type='button';save.onclick=()=>saveRecord(currentBook);
 actions.append(again,save);out.append(actions);
 out.append(bookEl('p','hint','무작위로 고른 문장이에요. 마음에 남는 부분만 가져가고, 결정은 당신의 몫이에요.'));
}
function renderBookSupport(){
 const out=$('#bookResult');out.textContent='';currentBook=null;
 const card=bookEl('article','book-answer book-support');
 card.append(bookEl('span','book-page','잠깐, 이 고민은 함께 나눠요'),bookEl('p','book-sentence','지금 많이 힘드신 것 같아요. 이 마음은 책보다 사람과 나누는 게 좋아요.'),bookEl('p',undefined,'자살예방상담전화 109(24시간)에 전화하거나, 믿을 수 있는 사람에게 지금 연락해 보세요. 위급하면 119에 연락하세요.'));
 out.append(card);
}
function openBook(){
 if(bookTimer)return;
 const worry=$('#bookWorry').value.trim().slice(0,80),book=$('#ondoBook'),btn=$('#openBook');
 if(BOOK_CRISIS.test(worry)){renderBookSupport();return;}
 btn.disabled=true;book.classList.remove('opened');book.classList.add('opening');$('#bookResult').textContent='';
 $('#bookStatus').textContent='책장을 넘기고 있어요…';
 bookTimer=setTimeout(()=>{bookTimer=null;btn.disabled=false;book.classList.remove('opening');book.classList.add('opened');$('#bookStatus').textContent='';renderBookAnswer(rand(ONDO_BOOK_ANSWERS.length),worry);},bookDelay);
}
$('#openBook').onclick=openBook;
$('#bookWorry').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();openBook();}});
