const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const vm=require('node:vm');const {JSDOM}=require('jsdom');const base=path.resolve(__dirname,'..');
const dom=new JSDOM(fs.readFileSync(path.join(base,'index.html'),'utf8'),{url:'https://example.test/saju/',runScripts:'outside-only'});const w=dom.window;
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;
for(const script of ['vendor/manse.js','app.js','tarot-data.js','tarot.js','saju.js','face.js'])vm.runInContext(fs.readFileSync(path.join(base,script),'utf8'),dom.getInternalVMContext());
const run=s=>vm.runInContext(s,dom.getInternalVMContext()),q=s=>w.document.querySelector(s);const M=run('ManseLib');
const chart=(extra={})=>run(`calcSajuV2(${JSON.stringify({year:2000,month:1,day:7,hour:12,minute:0,unknown:false,boundary:'midnight',correction:'standard',...extra})})`);
assert.equal(chart().raw.dayHanja,'甲子');assert.equal(chart().raw.hourHanja,'庚午');
assert.equal(chart({hour:23,minute:30}).raw.dayHanja,'甲子');
assert.equal(chart({hour:23,minute:30,boundary:'jasi'}).raw.dayHanja,'乙丑');
assert.equal(chart({hour:23,minute:30,boundary:'splitJasi'}).raw.hourHanja,'丙子');
assert.equal(chart({year:2024,month:2,day:4,hour:16}).raw.yearHanja,'癸卯');
assert.equal(chart({year:2024,month:2,day:4,hour:18}).raw.yearHanja,'甲辰');
assert.equal(chart({year:2024,month:3,day:5,hour:12}).raw.monthHanja,'丁卯');
assert.equal(chart({unknown:true,gender:'male'}).columns.length,3);assert.equal(chart({unknown:true,gender:'male'}).raw.luckPillars,undefined);assert.equal(chart({unknown:true}).total,6);
assert.equal(chart().total,8);assert.equal(chart({gender:'male'}).raw.luckPillars.pillars.length,10);
assert.throws(()=>chart({year:2023,month:2,day:30}));assert.throws(()=>chart({year:2024,month:3,day:1,isLunar:true,isLeapMonth:true}));
assert.equal(chart({year:2023,month:2,day:1,isLunar:true,isLeapMonth:true}).dayString,'2023-03-22');
assert.equal(chart({year:2024,month:1,day:1,isLunar:true}).dayString,'2024-02-10');
assert.equal(chart({hour:0,minute:10,correction:'solar',longitude:126.9784}).raw.dayHanja,'癸亥');
assert.equal(run("stageFor('甲','亥')"),'장생');assert.equal(run("stageFor('乙','午')"),'장생');
for(let year=1910;year<=2025;year+=5)for(let month=1;month<=12;month++){const l=M.solarToLunar(year,month,15),s=M.lunarToSolar(l.year,l.month,l.day,l.isLeapMonth);assert.equal(s.year,year);assert.equal(s.month,month);assert.equal(s.day,15);}
q('#birth').value='2000-01-07';q('#sajuGender').value='male';q('#sajuForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert.equal(q('#sajuError').textContent,'');assert.ok(q('#sajuResult').textContent.includes('갑자'));assert.equal(q('#flows tbody').children.length,12);q('#saveSaju').click();assert.equal(run('getRecords().length'),1);
assert.equal(run('TAROT_CARDS.length'),78);assert.equal(run('new Set(TAROT_CARDS.map(x=>x.id)).size'),78);assert.equal(run('TAROT_CARDS.filter(x=>x.arcana==="major").length'),22);assert.ok(run('TAROT_CARDS.every(x=>x.upright.length>20&&x.reversed.length>20&&x.upright!==x.reversed)'));
for(const suit of ['wands','cups','swords','pentacles'])assert.equal(run(`TAROT_CARDS.filter(x=>x.suit==='${suit}').length`),14);
for(const [spread,n] of [['one',1],['three',3],['five',5],['cross',10]]){q('#spreadType').value=spread;q('#shuffle').click();assert.equal(run('new Set(drawState.deck.map(x=>x.id)).size'),78);for(let i=0;i<n;i++)q('#deck button:not(:disabled)').click();assert.equal(q('#tarotSettings').disabled,false);assert.equal(w.document.querySelectorAll('.tarot-reading').length,n);assert.equal(run('new Set(drawState.selected.map(x=>x.id)).size'),n);q('#saveTarot').click();q('#resetTarot').click();}
q('#dailyTarot').click();const daily=q('#tarotResult').textContent;q('#dailyTarot').click();assert.equal(q('#tarotResult').textContent,daily);
q('#cardFilter').value='Wands';q('#cardFilter').dispatchEvent(new w.Event('change'));assert.equal(w.document.querySelectorAll('.catalog-card').length,14);
q('#cardFilter').value='all';q('#cardSearch').value='태양';q('#cardSearch').dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('.catalog-card').length,1);
q('#question').value='<img src=x onerror=alert(1)>';q('#spreadType').value='one';q('#shuffle').click();q('#deck button').click();assert.ok(q('#tarotResult').textContent.includes('<img'));assert.equal(q('#tarotResult img[onerror]'),null);assert.equal(q('#tarotResult img').getAttribute('src').startsWith('assets/tarot/'),true);
q('#expressionGoal').value='warm';q('#drawFace').click();q('#saveFace').click();assert.ok(q('#faceResult').textContent.includes('얼굴 분석 결과가 아닙니다'));assert.ok(!run('JSON.stringify(currentFace)').includes('blob:'));run("go('journal')");assert.ok(q('#records').textContent.includes('갑자'));assert.equal(q('#journal').hidden,false);
// Existing v1 history survives the redesign.
w.localStorage.setItem('ondo-journal-v1',JSON.stringify([{id:'old',type:'타로',title:'기존 기록',text:'예전 풀이',created:'2026-01-01T00:00:00Z',note:'내 메모'}]));run('renderRecords()');assert.ok(q('#records').textContent.includes('기존 기록'));assert.equal(q('#records textarea').value,'내 메모');
for(const src of run('TAROT_CARDS.map(cardImage)'))assert.ok(fs.existsSync(path.join(base,src)),src);
assert.equal(run('new Set(TAROT_CARDS.map(cardImage)).size'),78);
assert.ok(run('cardArt(TAROT_CARDS[8],true)').includes('card-picture reversed'));
w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};q('[data-zoom-card]').click();assert.equal(q('.card-dialog').open,true);assert.ok(q('.dialog-art img').src.includes('/assets/tarot/'));
const ids=[...w.document.querySelectorAll('[id]')].map(x=>x.id);assert.equal(ids.length,new Set(ids).size);
console.log('PASS: lunar/leap validation, midnight/jasi/split-jasi, solar-term boundaries, solar correction, 288 calendar round trips, 12 monthly flows, 78-card coverage, 1/3/5/10-card interaction, daily persistence, catalog filters, escaped input, photo-free records, v1 journal compatibility.');w.close();
