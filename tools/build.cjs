const fs=require('node:fs'),esbuild=require('esbuild');
esbuild.buildSync({entryPoints:['vendor-src/entry.ts'],bundle:true,format:'iife',globalName:'ManseLib',platform:'browser',target:'es2020',minify:true,outfile:'vendor/manse.js'});
const original=JSON.parse(fs.readFileSync('data/tarotoo-original.json','utf8'));
const rows=fs.readFileSync('data/tarot-ko.tsv','utf8').trim().split('\n').map(x=>x.split('|'));
if(original.length!==78||rows.length!==78||rows.some(x=>x.length!==4))throw Error('Expected 78 complete Korean card records');
const cards=original.map((a,i)=>({id:a.id,name:rows[i][0],en:a.name,arcana:a.arcana,suit:a.suit,keywords:rows[i][1],upright:rows[i][2],reversed:rows[i][3]}));
fs.writeFileSync('tarot-data.js','/* Metadata: Tarotoo, MIT. Korean reflection text adapted/authored for OnDo. See SOURCES.md. */\nconst TAROT_CARDS = '+JSON.stringify(cards)+';\n');
console.log('Built local saju engine and 78-card dataset.');
