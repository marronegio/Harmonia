/* Diatonic spelling preserves one distinct letter for each scale degree. */
(function(scope){
const letters=['C','D','E','F','G','A','B'], natural=[0,2,4,5,7,9,11];
const keys=['C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B'];
const names={C:'Dó',D:'Ré',E:'Mi',F:'Fá',G:'Sol',A:'Lá',B:'Si'};
const mod=n=>(n%12+12)%12;
const pc=n=>mod(natural[letters.indexOf(n[0])]+[...n.slice(1)].reduce((s,a)=>s+(a==='#'?1:a==='b'?-1:0),0));
const pretty=n=>n.replaceAll('#','♯').replaceAll('b','♭');
const full=n=>names[n[0]]+(n.slice(1)?' '+pretty(n.slice(1)):'');
function spell(letter,target){let delta=mod(target-natural[letters.indexOf(letter)]);if(delta>6)delta-=12;return letter+(delta>0?'#'.repeat(delta):'b'.repeat(-delta));}
function field(key,mode){const steps=mode==='major'?[2,2,1,2,2,2,1]:[2,1,2,2,1,2,2];let cursor=pc(key);const start=letters.indexOf(key[0]);const notes=steps.map((step,i)=>{const n=spell(letters[(start+i)%7],cursor);cursor+=step;return n;});const roman=mode==='major'?['I','ii','iii','IV','V','vi','vii°']:['i','ii°','III','iv','v','VI','VII'];const chords=notes.map((root,i)=>{const ns=[0,2,4].map(x=>notes[(i+x)%7]);const third=mod(pc(ns[1])-pc(root)),fifth=mod(pc(ns[2])-pc(root)),seventh=mod(pc(notes[(i+6)%7])-pc(root));const quality=fifth===6?'diminished':third===3?'minor':'major';return {root,notes:ns,quality,roman:roman[i],symbol:root+(quality==='minor'?'m':quality==='diminished'?'°':''),seventh};});return{key,mode,steps,notes,chords};}
function variations(field,i){const c=field.chords[i],root=c.root,minor=c.quality==='minor',dim=c.quality==='diminished',tri=minor?[0,3,7]:dim?[0,3,6]:[0,4,7],base=root+(minor?'m':dim?'dim':'');const definitions=[{symbol:c.symbol,label:'Tríade',ints:tri,degrees:[0,2,4]},{symbol:dim?root+'m7(♭5)':base+(c.seventh===11?'maj7':'7'),label:'Com sétima',ints:[...tri,c.seventh],degrees:[0,2,4,6]}];if(!dim)definitions.push({symbol:base+'add9',label:'Nona adicionada',ints:[...tri,14],degrees:[0,2,4,1]},{symbol:base+'6',label:'Com sexta',ints:[...tri,9],degrees:[0,2,4,5]},{symbol:root+'sus2',label:'Segunda suspensa',ints:[0,2,7],degrees:[0,1,4]},{symbol:root+'sus4',label:'Quarta suspensa',ints:[0,5,7],degrees:[0,3,4]});return definitions.map(v=>{v.notes=v.ints.map((n,j)=>spell(letters[(letters.indexOf(root[0])+v.degrees[j])%7],pc(root)+n));v.inside=v.notes.every(n=>field.notes.some(s=>pc(s)===pc(n)));return v;});}
scope.Music={keys,pc,pretty,full,field,variations};if(typeof module!=='undefined')module.exports=scope.Music;
})(typeof window!=='undefined'?window:globalThis);
