'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={route:'home',filter:'best',licenseTheme:'cyan',project:null};
const projects=[{id:'solitaire',name:'Solitaire Prime',category:'web',categoryLabel:'Web Design',year:'2026',association:'Onexcell'},{id:'sextillion',name:'Sextillion',category:'web',categoryLabel:'Web Design',year:'2026',association:'Freelance'},{id:'stride',name:'Stride Media',category:'web',categoryLabel:'AI Web Design',year:'2026',association:'Freelance'},{id:'piplix',name:'Piplix',category:'web',categoryLabel:'Web Design',year:'2026',association:'Onexcell'}];
const routes={about:'about',gallery:'gallery',keyboard:'keyboard',cv:'cv',mixtape:'mixtape',movies:'movies'};
const entities=['freelance','onexcell','onji','you'];
const views=new Map($$('[data-view]').map(el=>[el.dataset.view,el]));const frames=new Map();
let buttonAudioContext;
function playButtonClick(){
 const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
 try{buttonAudioContext=buttonAudioContext||new Ctx();if(buttonAudioContext.state==='suspended')buttonAudioContext.resume();const t=buttonAudioContext.currentTime,duration=.045,len=Math.floor(buttonAudioContext.sampleRate*duration),buffer=buttonAudioContext.createBuffer(1,len,buttonAudioContext.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<len;i++)samples[i]=(Math.random()*2-1)*Math.exp(-i/(buttonAudioContext.sampleRate*.006));const noise=buttonAudioContext.createBufferSource();noise.buffer=buffer;const filter=buttonAudioContext.createBiquadFilter();filter.type='bandpass';filter.frequency.value=1500;filter.Q.value=.62;const sharp=buttonAudioContext.createGain();sharp.gain.setValueAtTime(.11,t);sharp.gain.exponentialRampToValueAtTime(.001,t+.034);noise.connect(filter).connect(sharp).connect(buttonAudioContext.destination);noise.start(t);noise.stop(t+duration);const tone=buttonAudioContext.createOscillator();tone.type='sine';tone.frequency.setValueAtTime(185,t);tone.frequency.exponentialRampToValueAtTime(86,t+.058);const low=buttonAudioContext.createGain();low.gain.setValueAtTime(.001,t);low.gain.linearRampToValueAtTime(.09,t+.003);low.gain.exponentialRampToValueAtTime(.001,t+.073);tone.connect(low).connect(buttonAudioContext.destination);tone.start(t);tone.stop(t+.077);}catch{}
}
const soundDocuments=new WeakSet();
function installButtonSounds(doc){if(!doc||soundDocuments.has(doc))return;soundDocuments.add(doc);doc.addEventListener('pointerdown',e=>{if(e.button===0&&e.target.closest?.('button:not(:disabled)'))playButtonClick()});doc.addEventListener('keydown',e=>{if(!e.repeat&&(e.key===' '||e.key==='Enter')&&e.target.closest?.('button:not(:disabled)'))playButtonClick()});}
installButtonSounds(document);
addEventListener('message',e=>{const frame=frames.get('about')?.querySelector('iframe');if(frame&&e.source===frame.contentWindow&&e.data?.type==='mka:about-ready'){frame.dataset.hostReady='true';frame.dispatchEvent(new Event('mka:host-ready'));}});
// Grid center handles centering at natural dimensions; explicit margins are unnecessary.
function fit(){
  const width=innerWidth, height=innerHeight;
  // Desktop geometry: 1920 logical px across, actual visible height determines stage height.
  // At very short viewports keep enough room for the original controls; the console scrolls vertically only when necessary.
  const scale=width/1920;
  const logicalHeight=height/scale;
  const stageHeight=Math.max(1,logicalHeight-264);
  const root=document.documentElement;
  root.style.setProperty('--fit',scale);
  root.style.setProperty('--console-height',logicalHeight+'px');
  root.style.setProperty('--height-delta',(logicalHeight-974)+'px');
  root.style.setProperty('--stage-height',stageHeight+'px');
  root.style.setProperty('--stage-scale',Math.min(1,stageHeight/710));
  $('#fit').style.overflowY='hidden';
}
addEventListener('resize',fit,{passive:true});fit();
for(let i=0;i<9;i++)$('#case-dots').append(document.createElement('i'));
function getRuntime(route){if(frames.has(route))return frames.get(route);const wrap=document.createElement('div');wrap.className='runtime-view';wrap.hidden=true;const iframe=document.createElement('iframe');iframe.title=route==='about'?'Original MK Orbit V11 Interactive':`Original ${route} component`;iframe.sandbox='allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox';iframe.src=`modules/${routes[route]}/index.html?v=28`;iframe.setAttribute('scrolling','no');iframe.addEventListener('load',()=>{iframe.dataset.mkaReady='true';configureModule(iframe,route);sendRuntime(route,'resize');sendRuntime(route,'active',state.route===route);if(route==='mixtape'&&state.route===route&&!stageMotion.running)startMixtapeEntrance();if(route==='cv'&&state.route===route&&!stageMotion.running)startCVEntrance();});iframe.allow='autoplay';wrap.append(iframe);if(route==='cv'){const b=document.createElement('a');b.className='cv-download';b.textContent='DOWNLOAD CV';b.title='Download CV (PDF)';b.href='documents/Mohammed_Khaif_Aman_Resume_2026.pdf';b.download='Mohammed_Khaif_Aman_Resume_2026.pdf';b.setAttribute('aria-label','Download CV PDF');wrap.append(b);}$('#runtime-stage').append(wrap);frames.set(route,wrap);return wrap;}

// Same-origin module integration boundary: preserve runtime and make the outer surface fit.
function configureModule(f,route){
 try{
 const doc=f.contentDocument;if(!doc||!doc.body)return;installButtonSounds(doc);if(doc.querySelector('#mka-stage-integration'))return;if(route==='about'&&!doc.querySelector('#canvas'))return;
 const style=doc.createElement('style');style.id='mka-stage-integration';
 const common=`html,body{margin:0!important;padding:0!important;scrollbar-width:none!important;overscroll-behavior:none}*{scrollbar-width:none!important}*::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}`;
 const extras={
  gallery:`html,body,#infinite-gallery{width:100%!important;height:100%!important;overflow:hidden!important;border:0!important;border-radius:0!important;margin:0!important;padding:0!important}#infinite-gallery{inset:0!important}`,
  keyboard:`html,body{overflow:hidden!important}`,
  movies:`html,body,.viewport{width:100%!important;height:100%!important;overflow:hidden!important}.artboard{inset:0!important;width:100%!important;height:100%!important;transform:none!important;border-radius:0!important}.list-view{height:100%!important;left:calc(50% - 120px)!important}.left-block{top:50%!important;translate:0 -50%}.right-block{top:50%!important;translate:0 -50%;right:20px!important}.left-block{left:20px!important}.description{margin:0!important}.rating{margin-bottom:8px!important}.watch-row{margin-top:14px!important}.poster-layer img:not(.landscape){width:1068px!important;height:1602px!important;min-width:100vh!important;min-height:100vw!important}`,
  about:`html,body{overflow:hidden!important}`,
  mixtape:`#viewport{border-radius:0!important;clip-path:none!important}html,body{color-scheme:dark;background:#000!important}.music-control{touch-action:none!important}`,
  cv:`html,body,#frame{width:100%!important;height:100%!important;overflow:hidden!important;border-radius:0!important}`,
  growth:`html,body,main.experience{width:100%!important;height:100%!important;overflow:hidden!important;background:transparent!important}.scroll-space{display:none!important}#layout-edit-trigger,.layout-grab,.designer-panel{display:none!important}`,
 };
 style.textContent=common+(extras[route]||'');doc.head.append(style);
 if(route==='about'){
   if(!doc.querySelector('script[data-mka-about-bridge]')){const script=doc.createElement('script');script.dataset.mkaAboutBridge='true';script.src=new URL('modules/about/host-bridge.js?v=27',document.baseURI).href;doc.head.append(script);}
   try{f.contentWindow.dispatchEvent(new f.contentWindow.Event('resize'));}catch{}
 }
 }catch(e){console.warn('Module layout bridge',route,e.message)}
}

function sendRuntime(route,action,value){const f=frames.get(route)?.querySelector('iframe');if(!f)return;try{f.contentWindow?.postMessage({type:'mka:runtime',action,value},'*')}catch{}}
function resetMixtapeEntrance(){const f=frames.get('mixtape')?.querySelector('iframe');try{f?.contentWindow?.MKAMixtape?.resetEntrance();}catch{}sendRuntime('mixtape','reset');}
function startMixtapeEntrance(){const f=frames.get('mixtape')?.querySelector('iframe');if(!f||state.route!=='mixtape'||stageMotion.running)return;try{f.contentWindow?.MKAMixtape?.open();}catch{}sendRuntime('mixtape','open');}
function commitRoute(route,chapter,history=true){if(!views.has(route)&&!routes[route]&&!entities.includes(route))route='home';const prior=state.route;$('#stage').querySelector('.entity-side-pairs')?.classList.remove('pairs-reveal');if(routes[prior]&&prior!==route)sendRuntime(prior,'active',false);if(prior==='cv'&&route!=='cv'){try{frames.get('cv')?.querySelector('iframe')?.contentWindow?.dispatchEvent(new Event('mka:cv-close'))}catch{}sendRuntime('cv','close');}if(route!=='projects')setProjectFocus(false);if(route==='mixtape'&&prior!==route)resetMixtapeEntrance();state.route=route;$('#stage').dataset.stageRoute=entities.includes(route)?'entity':route;views.forEach(v=>v.hidden=true);frames.forEach(v=>v.hidden=true);if(routes[route]){const w=getRuntime(route);w.hidden=false;sendRuntime(route,'active',true);const live=$('iframe',w);try{if(live.contentDocument?.readyState==='complete'){configureModule(live,route);requestAnimationFrame(()=>{if(!w.hidden){try{const win=live.contentWindow;win.dispatchEvent(new win.Event('resize'));if(route==='cv'&&!stageMotion.running)startCVEntrance();}catch{}}});}}catch{}if(route==='about'&&chapter!==undefined){const f=$('iframe',w);const go=()=>{try{const api=f.contentWindow?.__MK_TEST__;if(api){api.set(Number(chapter));return true;}}catch{}return false;};if(!go())f.addEventListener('load',()=>{go();sendRuntime('about','chapter',Number(chapter));},{once:true});sendRuntime('about','chapter',Number(chapter));}}else if(entities.includes(route)){views.get('entity').hidden=false;const image=$('#entity-card');image.src=`art/entity-${route}.png`;image.alt=route.toUpperCase()+' original card';image.dataset.theme=state.licenseTheme;for(const side of ['left','right']){const el=$('#entity-'+side);el.hidden=route==='you';if(route!=='you')el.src=`art/entity-${route}-${side}.png`;else el.removeAttribute('src');}}else{views.get(route).hidden=false;}
if(route==='projects'&&typeof chapter==='string'&&projects.some(p=>p.id===chapter)){openProject(chapter);}else if(route==='projects'&&prior==='projects'){state.project=null;$('#project-detail').hidden=true;}
$$('[data-route]').forEach(b=>{if(b.dataset.route===route)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(history&&location.hash.slice(1)!==route)window.history.pushState(null,'','#'+route);if(route==='mixtape'&&!stageMotion.running)startMixtapeEntrance();if(route==='cv'&&!stageMotion.running)startCVEntrance();if(route==='about')sendRuntime('about','resize');}
// Codrops-inspired pixel grid, stage-only.
const stageMotion={started:false,running:false,pending:null,inFlight:null};
const motionOverlay=document.createElement('div');motionOverlay.id='stage-transition';
motionOverlay.hidden=true;motionOverlay.setAttribute('aria-hidden','true');
$('#stage').append(motionOverlay);
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const afterPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
function normalizedRoute(route){return views.has(route)||routes[route]||entities.includes(route)?route:'home';}
async function ensureDestinationReady(route){
 const f=frames.has(route)?$('iframe',frames.get(route)):null;
 const ready=()=>route==='about'?f?.dataset.hostReady==='true':f?.dataset.mkaReady==='true';
 if(f&&!ready()){
  // Bound first-load wait: never leave the console covered indefinitely.
  const eventName=route==='about'?'mka:host-ready':'load';
  let onReady;const loaded=new Promise(resolve=>{onReady=resolve;f.addEventListener(eventName,onReady,{once:true});});
  const timeout=route==='about'?4500:800;
  try{await Promise.race([loaded,wait(timeout)]);}finally{f.removeEventListener(eventName,onReady);}
 }
 await afterPaint();
}
function routeTo(route,chapter,history=true){
 route=normalizedRoute(route);
 // Initial mount, and same-section chapter controls, preserve the original behavior.
 if(!stageMotion.started){stageMotion.started=true;commitRoute(route,chapter,history);return;}
 if(!stageMotion.running&&route===state.route){commitRoute(route,chapter,history);return;}
 stageMotion.pending={route,chapter,history};
 if(!stageMotion.running)void drainStageMotion();
}
const licenseRoutes=new Set(['license',...entities]);
function cardSource(route){return route==='license'?$('#license-card'):$('#entity-card');}
// Creative License has its own navigation family; only genuine cross-section changes use the pixel transition.
function motionFor(from,to){
 if(from===to)return 'none';
 if(licenseRoutes.has(from)&&licenseRoutes.has(to))return 'flip';
 return 'page';
}
async function flipLicense(next){
 const stage=$('#stage'),pairs=stage.querySelector('.entity-side-pairs'),from=state.route,source=cardSource(from),sr=source.getBoundingClientRect(),st=stage.getBoundingClientRect(),scale=st.width/stage.clientWidth;
 const ghost=document.createElement('div');ghost.className='license-flip-overlay';ghost.setAttribute('aria-hidden','true');
 Object.assign(ghost.style,{left:(sr.left-st.left)/scale+'px',top:(sr.top-st.top)/scale+'px',width:sr.width/scale+'px',height:sr.height/scale+'px'});
 const body=document.createElement('div');body.className='license-flip-body';
 const front=new Image(),back=new Image();front.className='license-flip-face';back.className='license-flip-face license-flip-back';front.src=source.src;front.style.filter=getComputedStyle(source).filter;
 // Prepare the actual destination face before turning; no blank image at the midpoint.
 const destination=cardSource(next.route);back.src=next.route==='license'?`art/license-${state.licenseTheme}.png`:`art/entity-${next.route}.png`;
 if(next.route!=='license')back.style.filter='drop-shadow(0 0 4px #80c5ff2b)';
 else back.style.filter=state.licenseTheme==='white'?'drop-shadow(0 0 4px #ffffff38)':state.licenseTheme==='red'?'drop-shadow(0 0 4px #d53b332b)':'drop-shadow(0 0 4px #80c5ff2b)';
 body.append(front,back);ghost.append(body);stage.append(ghost);stage.setAttribute('aria-busy','true');source.style.visibility='hidden';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let active,mid,revealed=false;
 // Keep project artwork hidden during the entire flip, including the midpoint route commit.
 const enteringEntity=entities.includes(next.route)&&next.route!=='you'&&from==='license';
 pairs.classList.remove('pairs-reveal');pairs.classList.toggle('pairs-hold',!enteringEntity);
 const reveal=()=>{if(revealed)return;revealed=true;commitRoute(next.route,next.chapter,next.history);cardSource(next.route).style.visibility='hidden';};
 if(enteringEntity){reveal();pairs.classList.add('pairs-reveal');}
 try{
  try{await Promise.race([Promise.all([front.decode(),back.decode()]),wait(180)]);}catch{}
  if(reduced){reveal();active=ghost.animate([{opacity:1},{opacity:0}],{duration:180,fill:'both'});await active.finished;}
  else{
   const direction=next.route==='license'?1:-1;
   active=body.animate([{transform:'translate3d(0,0,0) rotateY(0deg) rotateX(0deg)',offset:0},{transform:`translate3d(0,-14px,42px) rotateY(${direction*34}deg) rotateX(3deg)`,offset:.24},{transform:`translate3d(0,-24px,70px) rotateY(${direction*90}deg) rotateX(5deg)`,offset:.5},{transform:`translate3d(0,-14px,42px) rotateY(${direction*146}deg) rotateX(3deg)`,offset:.76},{transform:`translate3d(0,0,0) rotateY(${direction*180}deg) rotateX(0deg)`,offset:1}],{duration:860,easing:'cubic-bezier(.42,0,.58,1)',fill:'both'});
   ghost.animate([{filter:'drop-shadow(0 3px 6px #0002)'},{filter:'drop-shadow(0 24px 24px #0007)'},{filter:'drop-shadow(0 3px 6px #0002)'}],{duration:860,fill:'both'});
   mid=setTimeout(reveal,430);await active.finished;clearTimeout(mid);if(state.route!==next.route)reveal();
  }
 }finally{clearTimeout(mid);active?.cancel();$('#license-card').style.visibility='';$('#entity-card').style.visibility='';ghost.remove();stage.removeAttribute('aria-busy');
  if(!reduced&&entities.includes(state.route)&&state.route!=='you'&&state.route===next.route&&!stageMotion.pending){pairs.classList.add('pairs-reveal');}
  pairs.classList.remove('pairs-hold');
 }
}
async function drainStageMotion(){
 stageMotion.running=true;
 const stage=$('#stage');
 try{
  while(stageMotion.pending){
   let next=stageMotion.pending;stageMotion.pending=null;stageMotion.inFlight=next;
   const kind=motionFor(state.route,next.route);
   if(kind==='none'){commitRoute(next.route,next.chapter,next.history);continue;}
   if(kind==='flip'){await flipLicense(next);continue;}
   if(routes[next.route])getRuntime(next.route);
   stage.setAttribute('aria-busy','true');motionOverlay.hidden=false;
   const effect=window.MKAPixelTransition.create(motionOverlay);
   await effect.animate(true);
   // Coalesce requests only if their transition type remains the same. Otherwise finish
   // this transition and classify the new request from the resulting route.
   if(stageMotion.pending&&motionFor(state.route,stageMotion.pending.route)==='page'){next=stageMotion.pending;stageMotion.pending=null;stageMotion.inFlight=next;}
   commitRoute(next.route,next.chapter,next.history);
   await ensureDestinationReady(next.route);
   if(effect.hold)await wait(effect.hold);
   await effect.animate(false);
   motionOverlay.hidden=true;stage.removeAttribute('aria-busy');
   if(state.route==='mixtape')startMixtapeEntrance();
  }
 }catch(err){console.warn('Stage transition fallback',err);const next=stageMotion.pending||stageMotion.inFlight;stageMotion.pending=null;if(next)commitRoute(next.route,next.chapter,next.history);}
 finally{motionOverlay.hidden=true;stage.removeAttribute('aria-busy');stageMotion.running=false;stageMotion.inFlight=null;if(state.route==='mixtape')startMixtapeEntrance();if(state.route==='cv'){startCVEntrance();sendRuntime('cv','open');}if(stageMotion.pending)void drainStageMotion();}
}

function setTheme(t){if(!['cyan','white','red'].includes(t))return;state.licenseTheme=t;$('#license-card').src=`art/license-${t}.png`;$('#entity-card').dataset.theme=t;$$('[data-license]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.license===t)));}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.license)setTheme(b.dataset.license);if(b.dataset.route)routeTo(b.dataset.route,b.dataset.chapter??(b.dataset.route==='about'&&state.route!=='about'?0:undefined));if(b.dataset.filter)setFilter(b.dataset.filter);if(b.dataset.mode&&!homeModeDragging)setHomeMode(b.dataset.mode);});
addEventListener('hashchange',()=>{const r=location.hash.slice(1)||'home';if(r!==state.route||stageMotion.running)routeTo(r,undefined,false);});
function openProject(id){const p=projects.find(x=>x.id===id);if(!p)return;state.project=p.id;$('#detail-title').textContent=p.name;$('#detail-image').src=`art/${p.id}.svg`;$('#project-detail').hidden=false;}
function syncFilterPill(){const bar=$('.filters'),active=$('.filters [aria-pressed="true"]');if(!bar||!active)return;bar.style.setProperty('--filter-pill-x',active.offsetLeft+'px');bar.style.setProperty('--filter-pill-width',active.offsetWidth+'px');}
const filterBar=$('.filters');
if(filterBar)new ResizeObserver(()=>{if(state.route==='projects')syncFilterPill()}).observe(filterBar);
function setFilter(f){state.filter=f;const list=$('#projects');list.className='projects '+(f==='best'?'best':'');list.replaceChildren();$('#project-detail').hidden=true;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===f)));syncFilterPill();const items=projects.filter(p=>f==='best'||f==='all'||p.category===f);if(!items.length){const n=document.createElement('p');n.className='notice';n.textContent='No verified project records for this filter in the foundation build.';list.append(n);return;}for(const p of items){const card=document.createElement('button');card.className='project';card.setAttribute('aria-label',`Open ${p.name} design preview`);const tag=document.createElement('small');tag.textContent=p.categoryLabel+' · '+p.year+' · '+p.association;const name=document.createElement('h2');name.textContent=p.name;const desc=document.createElement('p');desc.textContent="my second home, and i'm currently looking for my next one.";const art=document.createElement('img');art.src=`art/${p.id}.svg`;art.alt=p.name+' original design';art.loading='eager';art.decoding='async';const label=document.createElement('img');label.className='project-label-art';label.src=`art/project-label-${p.id}.svg`;label.alt='';tag.classList.add('sr-only');const meta=document.createElement('div');meta.className='project-meta';for(const value of [p.categoryLabel,p.year,p.association]){const pill=document.createElement('span');pill.textContent=value;meta.append(pill);}const labelWrap=document.createElement('div');labelWrap.className='project-label-wrap';labelWrap.append(label,meta,name);card.append(tag,labelWrap,desc,art);card.addEventListener('click',()=>openProject(p.id));list.append(card);}}
const projectList=$('#projects');projectList.tabIndex=0;projectList.setAttribute('aria-label','Project collection. Scroll to rotate projects.');
let projectRotation=false,wheelIntent=0,wheelIntentReset=0;
async function rotateProjects(direction){if(projectRotation||state.filter!=='best'||!$('#project-detail').hidden)return;const cards=[...projectList.querySelectorAll(':scope>.project')];if(cards.length<2)return;projectRotation=true;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,duration=reduced?1:980,last=cards.length-1,wrapped=direction>0?cards[0]:cards[last],old=new Map(cards.map(card=>[card,{x:card.offsetLeft,y:card.offsetTop}])),stepX=Math.abs(cards[1].offsetLeft-cards[0].offsetLeft),stepY=Math.abs(cards[1].offsetTop-cards[0].offsetTop);const ghost=wrapped.cloneNode(true);ghost.classList.add('project-motion-ghost');Object.assign(ghost.style,{left:old.get(wrapped).x+'px',top:old.get(wrapped).y+'px',width:wrapped.offsetWidth+'px',height:wrapped.offsetHeight+'px'});if(direction>0)projectList.append(wrapped);else projectList.prepend(wrapped);projectList.append(ghost);const animations=[];for(const card of cards){const now={x:card.offsetLeft,y:card.offsetTop};const start=card===wrapped?{x:(direction>0?stepX:-stepX),y:(direction>0?stepY:-stepY)}:{x:old.get(card).x-now.x,y:old.get(card).y-now.y};animations.push(card.animate([{transform:`translate3d(${start.x}px,${start.y}px,0)`},{transform:'translate3d(0,0,0)'}],{duration,easing:'cubic-bezier(.37,0,.18,1)',fill:'both'}).finished.catch(()=>{}));}animations.push(ghost.animate([{transform:'translate3d(0,0,0)',opacity:1},{transform:`translate3d(${direction>0?-stepX:stepX}px,${direction>0?-stepY:stepY}px,0)`,opacity:.08}],{duration,easing:'cubic-bezier(.37,0,.18,1)',fill:'both'}).finished.catch(()=>{}));await Promise.all(animations);for(const card of cards)card.getAnimations().forEach(a=>a.cancel());ghost.remove();projectRotation=false;}
projectList.addEventListener('wheel',e=>{if(state.filter!=='best'||e.ctrlKey)return;e.preventDefault();wheelIntent+=(Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX)*(e.deltaMode===1?16:e.deltaMode===2?projectList.clientWidth:1);clearTimeout(wheelIntentReset);wheelIntentReset=setTimeout(()=>wheelIntent=0,220);if(Math.abs(wheelIntent)<30||projectRotation)return;const direction=Math.sign(wheelIntent);wheelIntent=0;void rotateProjects(direction);},{passive:false});
projectList.addEventListener('keydown',e=>{if(e.target!==projectList||state.filter!=='best')return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();void rotateProjects(e.key==='ArrowRight'?1:-1);}});
$('#back-project').addEventListener('click',()=>{$('#project-detail').hidden=true;state.project=null;});
const setFilterBase=setFilter;
setFilter=function(f){$('.project-view').classList.toggle('all-reference',f==='all');return setFilterBase(f);};
const timeFmt=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}),dateFmt=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}),dayFmt=new Intl.DateTimeFormat('en-US',{weekday:'long'});
function tick(){const d=new Date(),m=d.getMinutes()+d.getSeconds()/60,h=d.getHours()%12+m/60;$('.clock-hand-hour').style.transform=`translateX(-50%) rotate(${h*30}deg)`;$('.clock-hand-minute').style.transform=`translateX(-50%) rotate(${m*6}deg)`;$('.clock-hand-second').style.transform=`translateX(-50%) rotate(${d.getSeconds()*6}deg)`;$('#clock-time').textContent=timeFmt.format(d);$('#clock-date').textContent=dateFmt.format(d);$('#clock-day').textContent=dayFmt.format(d);$('#clock-time').dateTime=d.toISOString();}
tick();setInterval(tick,1000);setFilter('best');routeTo(location.hash.slice(1)||'home',undefined,false);
// Warm heavy existing sections after Home has settled so their first reveal is immediate.
if((location.hash.slice(1)||'home')!=='about')setTimeout(()=>getRuntime('about'),2200);
const techControl=$('[data-route="keyboard"]');
const warmTech=()=>getRuntime('keyboard');
techControl?.addEventListener('pointerenter',warmTech,{once:true,passive:true});
techControl?.addEventListener('focus',warmTech,{once:true,passive:true});
if((location.hash.slice(1)||'home')!=='keyboard')setTimeout(warmTech,500);


// V19: the original fourth metal button sends its own activation; no dependence on mascot initialization.
window.MKAOpenSextillion=()=>routeTo('projects','sextillion');
window.addEventListener('message',e=>{const f=$('iframe[title="Original metallic controls"]');if(f&&e.source===f.contentWindow&&e.data?.type==='mka:open-sextillion'&&(e.origin===location.origin||e.origin==='null'&&location.origin==='null'))window.MKAOpenSextillion();});
// V20: group-aware mascot with the exact latest reference poses.
(()=>{
 const layer=$('#cat-layer'),sideHead=$('#mka-cat-side-head'),arm=$('#mka-cat-arm-box'),paw=$('#mka-cat-paw'),topHead=$('#mka-cat-top-head'),topPaw=$('#mka-cat-top-paw'),consoleEl=$('#console');
 const left=$$('#left-console .panel'),bottom=$$('#bottom-console .panel');
 const groups=[
  {id:'home',els:[left[0]],side:'right'}, {id:'projects',els:[left[1]],side:'right'}, {id:'about',els:[left[2]],side:'right'},
  {id:'cv',els:[bottom[0]],side:'right'}, {id:'playground',els:[bottom[1]],side:'top'},
  {id:'license',els:[bottom[2],bottom[3]],side:'left'},
  {id:'media',els:[$('#bottom-console [data-route="mixtape"]'),$('#bottom-console [data-route="movies"]')],side:'left'},
  {id:'tech',els:[bottom[4]],side:'top'}
 ];
 let group=null,active=null,activeFrame=null,leaveTimer=0,reachTimer=0,pressTimer=0,headSince=0;const bound=new WeakSet();
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const box=(el,x,y,w,h)=>Object.assign(el.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
 function clearPress(){clearTimeout(pressTimer);layer.dataset.press='false'}
 function hide(){clearTimeout(leaveTimer);clearTimeout(reachTimer);clearPress();group=null;active=null;activeFrame=null;Object.assign(layer.dataset,{cat:'rest',group:'',headVisible:'false',pawVisible:'false'});}
 function schedule(){clearTimeout(leaveTimer);leaveTimer=setTimeout(hide,120)}
 function bounds(g){const rs=g.els.filter(Boolean).map(el=>el.getBoundingClientRect());return {left:Math.min(...rs.map(r=>r.left)),right:Math.max(...rs.map(r=>r.right)),top:Math.min(...rs.map(r=>r.top)),bottom:Math.max(...rs.map(r=>r.bottom))};}
 function groupAt(x,y){if(consoleEl.classList.contains('project-focus-mode'))return null;return groups.find(g=>{const r=bounds(g);return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom})||null;}
 function logical(r){const c=consoleEl.getBoundingClientRect(),scale=c.width/consoleEl.offsetWidth;return {x:(r.left-c.left)/scale,y:(r.top-c.top)/scale,w:r.width/scale,h:r.height/scale};}
 function groupRect(g){const r=bounds(g);return logical({left:r.left,top:r.top,width:r.right-r.left,height:r.bottom-r.top});}
 function targetRect(el,frame){let r=el.getBoundingClientRect();if(frame){const f=frame.getBoundingClientRect(),sx=f.width/frame.clientWidth,sy=f.height/frame.clientHeight;r={left:f.left+r.left*sx,top:f.top+r.top*sy,width:r.width*sx,height:r.height*sy};}return logical(r);}
 function head(kind,dir,x,y){layer.dataset.headKind=kind;layer.dataset.headSide=dir;layer.dataset.headVisible='true';if(kind==='top'){box(topHead,x,y,73,96);}else{box(sideHead,x,y,62,62*258/207);}}
 function setGroupHead(g){const r=groupRect(g),H=consoleEl.offsetHeight;if(g.side==='top'){head('top','right',clamp(r.x+r.w/2-36.5,0,1847),clamp(r.y-61,0,H-96));}else{head('side',g.side,clamp(g.side==='right'?r.x+r.w:r.x-62,0,1858),clamp(r.y+12,0,H-78));}}
 function enterGroup(g){clearTimeout(leaveTimer);if(group===g)return;clearTimeout(reachTimer);clearPress();group=g;active=null;activeFrame=null;headSince=performance.now();Object.assign(layer.dataset,{group:g.id,cat:'peek',pawVisible:'false'});setGroupHead(g);}
 function peekOnly(g){enterGroup(g);if(active){clearTimeout(reachTimer);clearPress();active=null;activeFrame=null;layer.dataset.cat='peek';layer.dataset.pawVisible='false';}setGroupHead(g);}
 function poseFor(g,el){const route=el.dataset.route;if(el.matches('.metal-button')){const ix=[...el.ownerDocument.querySelectorAll('.metal-button')].indexOf(el);return ix%2===0?'left':'right';}if(route==='home'||route==='projects')return 'left';if(el.id==='home-music-toggle'||g.id==='home')return 'right';if(route==='gallery'||route==='keyboard')return 'top';if(route==='cv')return 'cv';if(['freelance','onexcell','onji','you'].includes(route))return 'bottom';return g.side==='top'?'right':g.side;}
 function reach(g,el,frame){enterGroup(g);if(active===el&&activeFrame===frame)return;clearTimeout(reachTimer);clearPress();active=el;activeFrame=frame;const r=targetRect(el,frame),gr=groupRect(g),H=consoleEl.offsetHeight;if(r.w<=0||r.h<=0){peekOnly(g);return;}
  const pose=poseFor(g,el),metal=el.matches('.metal-button'),route=el.dataset.route;
  layer.dataset.pose=pose;layer.dataset.side=pose;layer.dataset.target=metal?'metal-'+([...el.ownerDocument.querySelectorAll('.metal-button')].indexOf(el)+1):route||el.id||el.getAttribute('aria-label')||'button';
  paw.src=pose==='cv'?'art/cat-paw-up.png':'art/cat-paw-crop.png';arm.style.clipPath='none';
  let pawOnly=pose==='left'&&(metal||route==='home'||route==='projects')||pose==='bottom'||pose==='cv';
  if(pose==='top'){
   // The exact overhead artwork from the latest Figma export, with its paw resting on the upper edge.
   const x=clamp(r.x+r.w*.5-36.5,0,1847),y=clamp(r.y-78,0,H-96);head('top','right',x,y);box(topPaw,x,y,73,96);
  }else if(pose==='cv'){
   const w=21,h=21*2.50561797752809;const y=r.y+r.h-12;box(arm,r.x+r.w*.5-w*.5,y,w,h);const clock=targetRect($('.live-clock'),null);arm.style.clipPath=`inset(0 0 ${Math.max(0,y+h-clock.y+2)}px 0)`;
  }else if(pose==='bottom'){
   const w=47,h=w*184/156,x=r.x+r.w*.5-17,y=r.y+r.h-13;box(arm,x,y,w,h);const maxY=groupRect({els:[bottom[3]]}).y;arm.style.clipPath=`inset(0 0 ${Math.max(0,y+h-maxY)}px 0)`;
  }else if(pose==='left'){
   const w=metal?37:46,h=w*184/156,x=r.x-w*.72,y=r.y+r.h*.5-h*.32;box(arm,x,y,w,h);if(pawOnly)arm.style.clipPath=`inset(0 0 0 ${Math.max(0,gr.x-x)}px)`;else head('side','left',clamp(x-53,0,1858),clamp(y-9,0,H-78));
  }else{
   const edge=r.x+r.w,w=metal?Math.max(43,Math.min(62,gr.x+gr.w-edge+29)):Math.max(46,Math.min(62,gr.x+gr.w-edge+25)),h=w*184/156,x=edge-8,y=r.y+r.h*.5-h*.24;box(arm,x,y,w,h);
   // The head peeks at the right boundary, with the same arm anchored beside it.
   head('side','right',clamp(Math.max(edge+4,x+w-12),0,1858),clamp(y-12,0,H-78));
  }
  // First enter the group with the head. On a paw-only reference the head retreats before the reach.
  const reveal=()=>{if(active!==el||activeFrame!==frame||group!==g)return;layer.dataset.headVisible=String(!pawOnly);layer.dataset.pawVisible='true';layer.dataset.cat='button';};
  const delay=reduced.matches?0:Math.max(0,170-(performance.now()-headSince));
  if(delay===0)reveal();else{layer.dataset.cat='peek';reachTimer=setTimeout(reveal,delay);}
 }
 function bind(doc,frame=null){if(bound.has(doc))return;bound.add(doc);
  const selector=frame?'button,[role="button"],a[href],input[type="range"]':'#left-console button,#bottom-console button,#left-console [role="button"],#bottom-console [role="button"],#left-console a[href],#bottom-console a[href]';
  const find=e=>{const el=e.target.closest?.(selector);return el?.matches('.appearance-button,[data-license],#playground-dots .grid,.grid')?null:el;};
  function where(e){if(frame){const r=frame.getBoundingClientRect();return groupAt(r.left+e.clientX*r.width/frame.clientWidth,r.top+e.clientY*r.height/frame.clientHeight);}return groupAt(e.clientX,e.clientY);}
  function move(e){if(e.pointerType==='touch')return;const g=where(e);if(!g){if(group)schedule();return;}if(e.target.closest?.('.appearance-button,.appearance')){hide();return;}const el=find(e);if(el)reach(g,el,frame);else peekOnly(g);}
  doc.addEventListener('pointerover',move);doc.addEventListener('pointermove',move);
  doc.addEventListener('pointerdown',e=>{const g=where(e),el=find(e);if(!g||!el)return;reach(g,el,frame);layer.dataset.press='true';clearTimeout(pressTimer);pressTimer=setTimeout(clearPress,230)});
  doc.addEventListener('pointerup',()=>{clearPress();if(matchMedia('(hover: none)').matches)schedule()});doc.addEventListener('pointercancel',()=>{clearPress();schedule()});
  doc.addEventListener('pointerout',e=>{if(!e.relatedTarget)schedule()});
  doc.addEventListener('focusin',e=>{const el=find(e);if(!el)return;const r=(frame||el).getBoundingClientRect(),g=groupAt(r.left+r.width/2,r.top+r.height/2);if(g)reach(g,el,frame)});doc.addEventListener('focusout',schedule);
 }
 bind(document);
 for(const f of $$('#left-console iframe,#bottom-console iframe')){const init=()=>{try{if(f.contentDocument?.body){configureModule(f,f.classList.contains('about-preview')?'growth':'panel');bind(f.contentDocument,f);}}catch{}};f.addEventListener('load',init);f.addEventListener('pointerleave',schedule);try{if(f.contentDocument?.readyState==='complete')init();}catch{}}
 $('#stage').addEventListener('pointerenter',schedule);addEventListener('blur',hide);addEventListener('resize',hide);
})();

// Native top-level gesture for the dial; visual iframe remains synchronized through MKAMusic.
(()=>{
 const b=$('#home-music-toggle'),feedback=$('#music-feedback'),music=window.MKAMusic;if(!b||!music)return;
 let pointer=null,suppress=false;
 function angle(e){const r=b.getBoundingClientRect();return Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)}
 b.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType!=='touch')return;const r=b.getBoundingClientRect(),radius=Math.hypot(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2);pointer={id:e.pointerId,x:e.clientX,y:e.clientY,angle:angle(e),rim:radius>r.width*.28,moved:false};suppress=false;b.setPointerCapture(e.pointerId)});
 b.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;if(Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>(e.pointerType==='touch'?7:3))pointer.moved=true;if(!pointer.moved||!pointer.rim)return;const a=angle(e);let d=a-pointer.angle;while(d>Math.PI)d-=Math.PI*2;while(d< -Math.PI)d+=Math.PI*2;pointer.angle=a;music.setVolume(music.getState().volume+d/(Math.PI*1.5))});
 b.addEventListener('pointerup',e=>{if(pointer?.id===e.pointerId){suppress=pointer.moved;pointer=null;}});b.addEventListener('pointercancel',()=>{pointer=null;suppress=false});
 b.addEventListener('click',e=>{if(suppress){suppress=false;return;}suppress=false;void music.toggle()});
 b.addEventListener('wheel',e=>{e.preventDefault();music.setVolume(music.getState().volume-Math.sign(e.deltaY)*.045)},{passive:false});
 b.addEventListener('keydown',e=>{if(['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'].includes(e.key)){e.preventDefault();music.setVolume(music.getState().volume+(['ArrowUp','ArrowRight'].includes(e.key)?.05:-.05))}});
 const dial=$('#home-dial');const send=s=>{try{dial?.contentWindow?.postMessage({type:'mka:music-state',state:s},'*')}catch{}};dial?.addEventListener('load',()=>send(music.getState()));
 music.subscribe(s=>{send(s);b.setAttribute('aria-pressed',String(s.playing));b.setAttribute('aria-label',`${s.playing?'Pause':'Play'} ${s.title} by ${s.artist}`);b.title=s.error||`${s.title} — volume ${Math.round(s.volume*100)}%`;feedback.hidden=!s.error;feedback.textContent=s.error||'';if(s.error){const a=document.createElement('a');a.href='modules/dial/assets/foxy-shazam-oh-lord.mp3';a.target='_blank';a.rel='noopener';a.textContent=' Open audio file';a.style.color='inherit';feedback.append(a);}});
})();
// Original outlined identity text: seamless left-to-right ticker, direct drag, intermittent red glow.
(()=>{
 const box=$('#identity-ticker'),track=box?.querySelector('.identity-track');if(!box||!track)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let phase=283.344,last=0,drag=null,glowAt=performance.now()+1800,glowUntil=0;
 const mod=n=>((n%400)+400)%400;const paint=()=>{track.style.transform=`translate3d(${phase-400}px,0,0)`};
 function loop(now){const dt=last?Math.min(.05,(now-last)/1000):0;last=now;if(!drag&&!reduce.matches)phase=mod(phase+31*dt);if(!reduce.matches&&now>=glowAt){glowUntil=now+650+Math.random()*450;glowAt=now+2400+Math.random()*4400;}box.classList.toggle('glowing',!reduce.matches&&now<glowUntil);paint();requestAnimationFrame(loop)}
 box.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,phase,scale:box.getBoundingClientRect().width/258};box.setPointerCapture(e.pointerId);box.classList.add('dragging')});
 box.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId){phase=mod(drag.phase+(e.clientX-drag.x)/drag.scale);paint()}});
 const release=()=>{drag=null;box.classList.remove('dragging')};box.addEventListener('pointerup',release);box.addEventListener('pointercancel',release);box.addEventListener('lostpointercapture',release);
 box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();phase=mod(phase+(e.key==='ArrowRight'?30:-30));paint()}});paint();requestAnimationFrame(loop);
})();

// V16: exact word outlines, original toggle surfaces and explicit focus mode.
function startCVEntrance(){const f=frames.get('cv')?.querySelector('iframe');if(state.route==='cv'&&!stageMotion.running&&f?.dataset.mkaReady==='true'){try{f.contentWindow.dispatchEvent(new Event('mka:cv-open'))}catch{}}}
let homeModeDragging=false;
function setHomeMode(mode){if(!['on','off'].includes(mode))return;state.homeMode=mode;const home=views.get('home');home.dataset.mode=mode;const text=mode==='off'?'Creating Problems. Finding Solutions.':'Finding Problems. Creating Solutions.';$('.home-heading .sr-only').textContent=text;$$('.home-modes button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));}
(()=>{const modes=$('.home-modes');let drag=null;const finish=e=>{if(!drag||drag.id!==e.pointerId)return;const moved=Math.abs(e.clientX-drag.x)>4;if(moved){const r=modes.getBoundingClientRect();setHomeMode(e.clientX>=r.left+r.width/2?'off':'on');homeModeDragging=true;setTimeout(()=>homeModeDragging=false,80);}drag=null;};modes.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType!=='touch')return;drag={id:e.pointerId,x:e.clientX};});modes.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId&&Math.abs(e.clientX-drag.x)>4){try{modes.setPointerCapture(e.pointerId)}catch{}}});modes.addEventListener('pointerup',finish);modes.addEventListener('pointercancel',()=>{drag=null;homeModeDragging=false});setHomeMode('on');})();
function setProjectFocus(on){const c=$('#console'),b=$('#project-focus');if(!b)return;on=Boolean(on)&&state.route==='projects';c.classList.toggle('project-focus-mode',on);b.setAttribute('aria-pressed',String(on));const label=on?'Exit case study focus':'Expand case studies';b.setAttribute('aria-label',label);b.title=label;$('.focus-tip',b).textContent=label;requestAnimationFrame(()=>{projectList.scrollLeft=0;projectList.scrollTop=0});}
$('#project-focus').addEventListener('click',()=>setProjectFocus(!$('#console').classList.contains('project-focus-mode')));addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#console').classList.contains('project-focus-mode')){setProjectFocus(false);$('#project-focus').focus()}});
// One synchronized badge timeline. Freeze on company hover/focus; only company labels navigate.
(()=>{const exp=$('.inline-badge.experience'),company=$('.inline-badge.company'),skills=$('.inline-badge.skills');const els=[exp,company,skills];const reduced=matchMedia('(prefers-reduced-motion: reduce)');const skillNames=['UI','AI','UX','PRODUCT'];let index=0,timeout=0,animations=[],paused=false,pendingIndex=0;
const label=(el,i)=>{const span=document.createElement('span');span.className='badge-label';const text=document.createElement('span');text.className='badge-new-text';text.textContent=el===exp?(i%2?'+2':'+2+0='):el===company?(i%2?'ONEXCELL':'ONJI'):skillNames[i%4];span.append(text);return span};
const annotate=()=>{const dest=index%2?'onexcell':'onji';company.dataset.route=dest;company.setAttribute('aria-label',dest==='onji'?'ONJI — open career card':'ONEXCELL — open career card');skills.setAttribute('aria-label',skillNames[index%4]+' design')};
const render=()=>{els.forEach(el=>el.replaceChildren(label(el,index)));annotate()};
function schedule(){clearTimeout(timeout);if(!paused&&!reduced.matches)timeout=setTimeout(advance,1350)}
async function advance(){if(paused||reduced.matches)return;pendingIndex=(index+1)%4;const jobs=[];els.forEach(el=>{const old=el.firstElementChild,next=label(el,pendingIndex);el.append(next);const options={duration:330,easing:'cubic-bezier(.33,.0,.2,1)',fill:'both'};const a=old.animate([{transform:'translateY(0)'},{transform:'translateY(-110%)'}],options),b=next.animate([{transform:'translateY(110%)'},{transform:'translateY(0)'}],options);jobs.push(a,b)});animations=jobs;await Promise.allSettled(jobs.map(a=>a.finished));if(animations!==jobs)return;animations=[];index=pendingIndex;render();schedule()}
function freeze(){if(paused)return;paused=true;clearTimeout(timeout);const old=animations;animations=[];old.forEach(a=>a.cancel());render()}
function unfreeze(){if(company.matches(':hover,:focus-visible'))return;paused=false;schedule()}
company.addEventListener('pointerenter',freeze);company.addEventListener('click',e=>{e.stopPropagation();const dest=company.dataset.route;if(dest==='onji'||dest==='onexcell')routeTo(dest);});company.addEventListener('pointerleave',unfreeze);company.addEventListener('focus',freeze);company.addEventListener('blur',unfreeze);reduced.addEventListener?.('change',()=>{if(reduced.matches)freeze();else{paused=false;schedule()}});render();schedule();})();

// V23: only show the exact V8 canvas after the renderer confirms its first completed frame.
(()=>{
 const frame=$('#home-keychain'),fallback=$('#keychain-fallback'),notice=$('#keychain-failure');if(!frame||!fallback||!notice)return;
 function state(ready,reason=''){frame.dataset.ready=String(ready);fallback.hidden=true;frame.setAttribute('aria-hidden',String(!ready));frame.tabIndex=ready?0:-1;notice.hidden=ready||!reason;notice.textContent=ready?'':reason;}
 function check(){try{const win=frame.contentWindow;state(win.__mkaKeychainFrame===true,win.__mkaKeychainFailure||'');}catch{state(false,'Interactive keychain could not load.');}}
 addEventListener('message',e=>{if(e.source!==frame.contentWindow||e.data?.type!=='mka:keychain-status')return;state(e.data.ready===true,e.data.reason||'');});
 frame.addEventListener('load',check);try{if(frame.contentDocument?.readyState==='complete')check();}catch{}
})();

// V26: native anchors own navigation; the original iframe only renders motion.
(()=>{
 const frame=$('#bottom-console iframe[title="Original animated contact controls"]'), overlay=$('#contact-native-links');if(!frame||!overlay)return;
 const entries=[...overlay.querySelectorAll('a[data-contact]')].map(a=>({a,hover:false,focus:false}));
 const origin=location.protocol==='file:'||location.origin==='null'?'*':location.origin;
 function sync(item){try{frame.contentWindow?.postMessage({type:'mka:contact-hover',name:item.a.dataset.contact,active:item.hover||item.focus},origin);}catch{}}
 for(const item of entries){const a=item.a;
  a.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){item.hover=true;sync(item);}});
  a.addEventListener('pointerleave',()=>{item.hover=false;sync(item);});
  a.addEventListener('focus',()=>{item.focus=true;sync(item);});
  a.addEventListener('blur',()=>{item.focus=false;sync(item);});
 }
 frame.addEventListener('load',()=>entries.forEach(sync));
})();

// V27: native video controls use real video playback; hovering never hides original art.
(()=>{for(const b of document.querySelectorAll('.art-button[data-hover-video]')){const v=b.querySelector('video');if(!v)continue;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.loop=true;v.preload='none';let active=false;let token=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)');function begin(){if(reduce.matches||active)return;active=true;const n=++token;try{v.currentTime=0}catch{};v.play().then(()=>{if(active&&n===token)b.classList.add('video-playing')}).catch(()=>{});}function end(){active=false;++token;b.classList.remove('video-playing');v.pause();try{v.currentTime=0}catch{}}b.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')begin()});b.addEventListener('pointerleave',end);b.addEventListener('focus',begin);b.addEventListener('blur',end);v.addEventListener('error',end);}})();
// Keychain card detaches from its real projected position, grows into the original center card.
let charmFlight=null;
addEventListener('message',async e=>{const f=$('#home-keychain');if(e.source!==f?.contentWindow||e.data?.type!=='mka:license-charm'||state.route!=='home'||stageMotion.running||charmFlight)return;
 const st=$('#stage'),r=st.getBoundingClientRect(),fr=f.getBoundingClientRect(),scale=r.width/st.clientWidth,d=e.data.rect;if(!d||!['x','y','w','h'].every(k=>Number.isFinite(d[k])))return;
 const x=(fr.left-r.left+d.x*fr.width)/scale,y=(fr.top-r.top+d.y*fr.height)/scale,w=Math.max(60,d.w*fr.width/scale),h=Math.max(36,d.h*fr.height/scale);
 const ghost=new Image();ghost.src=`art/license-${state.licenseTheme}.png`;ghost.className='charm-detach';ghost.alt='';st.append(ghost);charmFlight=ghost;const control=$('#bottom-console [data-route="license"]');
 const card=$('#license-card');const sw=st.clientWidth,sh=st.clientHeight,sc=Math.min(1,sh/710);const tw=626*sc,th=375*sc,tx=(sw-tw)/2,ty=(sh-th)/2;
 Object.assign(ghost.style,{left:tx+'px',top:ty+'px',width:tw+'px',height:th+'px'});stageMotion.running=true;st.setAttribute('aria-busy','true');
 try{await ghost.decode().catch(()=>{});const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const ox=x-tx,oy=y-ty,sx=w/tw,sy=h/th;const a=ghost.animate([{transform:`translate3d(${ox}px,${oy}px,0) scale(${sx},${sy})`},{transform:`translate3d(${ox*.8}px,${oy*.88-24}px,0) scale(${Math.min(1,sx*1.12)},${Math.min(1,sy*1.12)})`,offset:.22},{transform:'translate3d(0,0,0) scale(1,1)'}],{duration:reduced?1:1000,easing:'cubic-bezier(.22,.75,.22,1)',fill:'both'});await a.finished;commitRoute('license');control?.classList.add('charm-route-highlight');setTimeout(()=>control?.classList.remove('charm-route-highlight'),900);a.cancel();}finally{ghost.remove();charmFlight=null;stageMotion.running=false;st.removeAttribute('aria-busy');try{f.contentWindow?.postMessage({type:'mka:restore-charm'},'*')}catch{}if(stageMotion.pending)void drainStageMotion();}
});

// Keep live Unbounded when loaded; original Figma lettering is the offline fallback.
if(document.fonts){document.fonts.load('500 34px Unbounded').then(faces=>{if(faces.some(f=>f.status==='loaded'))document.documentElement.dataset.unbounded='ready';}).catch(()=>{});}

// Mobile uses the approved 390x844 Figma exports instead of shrinking the
// 1920px desktop console. Desktop remains entirely on the original renderer.
(()=>{
 const mq=matchMedia('(max-width:700px)');
 const assets={
  home:{normal:'art/mobile/home-normal.svg',expanded:'art/mobile/home-expanded.svg'},
  projects:{expanded:'art/mobile/projects-expanded.svg'},
  gallery:{expanded:'art/mobile/gallery-expanded.svg',runtime:'modules/gallery/index.html?v=28',overlay:true},
  license:{normal:'art/mobile/license-normal.svg',expanded:'art/mobile/license-expanded.svg'},
  keyboard:{expanded:'art/mobile/keyboard-expanded.svg',runtime:'modules/keyboard/index.html?v=28',overlay:true},
  mixtape:{expanded:'art/mobile/music-expanded-a.svg',runtime:'modules/mixtape/index.html?v=28',overlay:true},
  movies:{expanded:'art/mobile/music-expanded-b.svg',runtime:'modules/movies/index.html?v=28',overlay:true},
  cv:{runtime:'modules/cv/index.html?v=28&mobile=1'},
  about:{runtime:'modules/about/index.html?v=28'}
 };
 const order=['home','projects','gallery','license','mixtape','movies','keyboard','cv','about'];
 const preload=[...new Set(Object.values(assets).flatMap(set=>Object.values(set).filter(value=>typeof value==='string'&&!value.includes('/modules/'))))];
 const shell=document.createElement('section');shell.id='mobile-shell';shell.hidden=true;shell.setAttribute('aria-label','MKA mobile portfolio');
 const frame=document.createElement('div');frame.className='mobile-frame';
 const art=document.createElement('img');art.className='mobile-art';art.alt='';art.decoding='async';
 const mobileRuntime=document.createElement('iframe');mobileRuntime.className='mobile-runtime';mobileRuntime.title='Original mobile portfolio experience';mobileRuntime.scrolling='no';mobileRuntime.sandbox='allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox';mobileRuntime.allow='autoplay';
 mobileRuntime.addEventListener('load',()=>{try{const doc=mobileRuntime.contentDocument;installButtonSounds(doc);const win=mobileRuntime.contentWindow;win.dispatchEvent(new win.Event('resize'));if(route==='cv')win.dispatchEvent(new win.Event('mka:cv-open'));if(route==='about')win.postMessage({type:'mka:active',active:true},location.origin)}catch{}});
 const liveKeychain=document.createElement('iframe');liveKeychain.className='mobile-live-keychain';liveKeychain.title='Interactive mobile WebGL keychain';liveKeychain.src='modules/keychain/index.html?v=28&mobile=1';liveKeychain.scrolling='no';liveKeychain.sandbox='allow-scripts allow-same-origin';liveKeychain.setAttribute('allowtransparency','true');
 const metal=document.createElement('div');metal.className='mobile-metal';metal.setAttribute('aria-label','Original metallic project buttons');
 const metalFiles=[['Frame 1948760021.png','Frame 1948760009.png','Piplix'],['Frame 1948760022.png','Frame 1948760007.svg','Stride Media'],['Frame 1948760023.png','Frame 1948760008.png','Solitaire Markets'],['Frame 1948760017.png','Frame 1948760020.png','Sextillion']];
 metalFiles.forEach(([base,lit,label],index)=>{const button=document.createElement('button');button.type='button';button.className='mobile-metal-button';button.dataset.index=index;button.setAttribute('aria-label','Open '+label+' project');button.innerHTML=`<img class="base" src="modules/metal/${base}" alt=""><img class="lit" src="modules/metal/${lit}" alt="">`;const glow=on=>button.classList.toggle('is-lit',on);button.addEventListener('pointerdown',()=>glow(true));button.addEventListener('pointerup',()=>{setTimeout(()=>glow(false),180)});button.addEventListener('pointercancel',()=>glow(false));button.addEventListener('click',()=>{location.hash='projects'});metal.append(button)});
 const badges=[['experience','+2+0='],['company','ONJI'],['skills','UI']].map(([kind,text])=>{const el=document.createElement('span');el.className='mobile-live-badge '+kind;const label=document.createElement('span');label.className='mobile-badge-text';label.textContent=text;el.append(label);return el});
 const contacts=['LI','GM','WA','IG'].map((label,index)=>{const button=document.createElement('button');button.type='button';button.className='mobile-contact';button.textContent=label;button.dataset.index=index;button.setAttribute('aria-label',['Open LinkedIn profile','Compose email in Gmail','Open WhatsApp conversation','Open Instagram profile'][index]);button.style.setProperty('--contact-index',index);return button});
 const contactNames=['linkedin','email','whatsapp','instagram'];
 const mobileContactVisual=document.createElement('iframe');mobileContactVisual.className='mobile-contact-visual';mobileContactVisual.title='Original animated mobile contact controls';mobileContactVisual.src='modules/contact/index.html?v=28';mobileContactVisual.scrolling='no';mobileContactVisual.tabIndex=-1;mobileContactVisual.setAttribute('aria-hidden','true');mobileContactVisual.sandbox='allow-scripts allow-same-origin';
 const showMobileContact=(index,active)=>{try{mobileContactVisual.contentWindow?.postMessage({type:'mka:contact-hover',name:contactNames[index],active},location.origin)}catch{}};
 const identity=document.createElement('div');identity.className='mobile-identity';identity.setAttribute('aria-label','Mohammed Khaif Aman — Product Designer');const desktopIdentity=document.querySelector('#identity-ticker .identity-track');if(desktopIdentity)identity.append(desktopIdentity.cloneNode(true));
 const mobileTopMusicCover=document.createElement('span');mobileTopMusicCover.className='mobile-top-music-cover';mobileTopMusicCover.setAttribute('aria-hidden','true');
 const mobileExpandedDotsCover=document.createElement('span');mobileExpandedDotsCover.className='mobile-expanded-dots-cover';mobileExpandedDotsCover.setAttribute('aria-hidden','true');
 const mobileMode=document.createElement('div');mobileMode.className='mobile-mode';mobileMode.innerHTML='<span class="mobile-mode-selection"></span><button type="button" data-mobile-mode="on">ON THE CLOCK</button><button type="button" data-mobile-mode="off">OFF THE CLOCK</button>';
 const mobileHeading=document.createElement('div');mobileHeading.className='mobile-heading';mobileHeading.innerHTML='<div class="mobile-heading-state heading-on"><span>Finding Problems.</span><span>Creating Solutions.</span></div><div class="mobile-heading-state heading-off"><span>Creating Problems.</span><span>Finding Solutions.</span></div>';
 const mobileDots=document.createElement('div');mobileDots.className='mobile-dots';for(let i=0;i<9;i++){const dot=document.createElement('i');dot.style.setProperty('--dot-index',i);mobileDots.append(dot)}
 const mobileDial=document.createElement('iframe');mobileDial.className='mobile-dial';mobileDial.title='Original animated music dial';mobileDial.src='modules/dial/index.html?v=27';mobileDial.scrolling='no';mobileDial.sandbox='allow-scripts allow-same-origin';mobileDial.allow='autoplay';
 const mobileMusic=document.createElement('button');mobileMusic.className='mobile-music-hit';mobileMusic.type='button';mobileMusic.setAttribute('aria-label','Play music');
 const mobileMedia=[['mixtape','art/vinyl.svg','art/vinyl-hover.mp4','MKA\'s Mixtape'],['movies','art/ticket.svg','art/ticket-hover.mp4','Movie recommendations']].map(([target,image,video,label],index)=>{const button=document.createElement('button');button.type='button';button.className='mobile-media';button.dataset.target=target;button.dataset.index=index;button.setAttribute('aria-label',label);button.innerHTML=`<img src="${image}" alt=""><video src="${video}" muted playsinline preload="metadata"></video>`;return button});
 const mobileCat=document.createElement('img');mobileCat.className='mobile-cat-paw';mobileCat.src='art/cat-paw-crop.png';mobileCat.alt='';mobileCat.draggable=false;
 const toggle=document.createElement('button');toggle.className='mobile-hit mobile-toggle';toggle.type='button';
 const previous=document.createElement('button');previous.className='mobile-hit mobile-previous';previous.type='button';previous.setAttribute('aria-label','Previous mobile screen');
 const next=document.createElement('button');next.className='mobile-hit mobile-next';next.type='button';next.setAttribute('aria-label','Next mobile screen');
 const navSpecs=[['projects','Open Case Study',16,566,100,48],['home','Open Home',119,672,70,50],['gallery','Open Playground',190,672,136,50],['cv','Open CV',15,723,50,48],['license','Open Creative License',70,723,256,48],['about','Open About',15,771,115,48]];
 const mobileNav=navSpecs.map(([target,label,x,y,w,h])=>{const button=document.createElement('button');button.type='button';button.className='mobile-hit mobile-nav-hit';button.dataset.target=target;button.setAttribute('aria-label',label);Object.assign(button.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});return button});
 const mobileHome=document.createElement('button');mobileHome.type='button';mobileHome.className='mobile-hit mobile-expanded-home';mobileHome.textContent='Home';mobileHome.setAttribute('aria-label','Return to mobile Home');
 frame.append(art,mobileRuntime,liveKeychain,mobileTopMusicCover,mobileExpandedDotsCover,mobileMode,mobileHeading,metal,mobileDots,...badges,mobileContactVisual,...contacts,identity,mobileDial,mobileMusic,...mobileMedia,mobileCat,...mobileNav,mobileHome,toggle,previous,next);shell.append(frame);document.body.append(shell);
 let route='home',expanded=false,touchX=null,changing=false,contactsRevealed=false,badgeIndex=0,mobileModeState='on';
 function source(){const set=assets[route]||assets.home;return expanded?(set.expanded||set.normal||''):(set.normal||set.expanded||'')}
 function render(){const set=assets[route]||assets.home,src=source(),runtime=Boolean(set.runtime);art.hidden=!src||(runtime&&!set.overlay);if(src&&art.getAttribute('src')!==src)art.src=src;mobileRuntime.hidden=!runtime;mobileRuntime.dataset.overlay=String(Boolean(set.overlay));mobileRuntime.dataset.route=route;if(runtime&&mobileRuntime.getAttribute('src')!==set.runtime)mobileRuntime.src=set.runtime;else if(runtime){try{const win=mobileRuntime.contentWindow;win.dispatchEvent(new win.Event('resize'));if(route==='cv')win.dispatchEvent(new win.Event('mka:cv-open'))}catch{}}const home=route==='home';liveKeychain.hidden=!home;mobileTopMusicCover.hidden=!home||expanded;mobileExpandedDotsCover.hidden=!home||!expanded;for(const el of [mobileMode,mobileHeading,...badges,...contacts,identity])el.hidden=!home;mobileContactVisual.hidden=!home||!expanded;for(const el of [metal,mobileDots,mobileDial,mobileMusic,...mobileMedia])el.hidden=!home||expanded;for(const el of mobileNav)el.hidden=!home||expanded;mobileHome.hidden=!expanded;toggle.setAttribute('aria-label',expanded?'Minimize mobile panel':'Expand mobile panel');toggle.title=toggle.getAttribute('aria-label');shell.dataset.route=route;shell.dataset.expanded=String(expanded);shell.dataset.mobileMode=mobileModeState}
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 async function slideTo(nextRoute,direction=1){if(changing||nextRoute===route)return;changing=true;const oldRoute=route,outgoing=!art.hidden?art.cloneNode(true):null,enterX=(direction*46)+'px',exitX=(direction*-46)+'px';if(outgoing){outgoing.removeAttribute('hidden');outgoing.className='mobile-art mobile-route-ghost';outgoing.style.setProperty('--route-exit-x',exitX);frame.append(outgoing)}route=nextRoute;expanded=route!=='home';render();try{if(!art.hidden)await art.decode()}catch{}if(outgoing&&!art.hidden){art.classList.add('mobile-route-enter');art.style.setProperty('--route-enter-x',enterX);requestAnimationFrame(()=>requestAnimationFrame(()=>{outgoing.classList.add('is-leaving');art.classList.add('is-arriving')}));await wait(780);outgoing.remove();art.classList.remove('mobile-route-enter','is-arriving');art.style.removeProperty('--route-enter-x')}else{frame.classList.add('mobile-arriving');await wait(720);frame.classList.remove('mobile-arriving')}changing=false;if(location.hash.slice(1)!==route)history.pushState(null,'','#'+route);if(oldRoute==='home'&&route!=='home')contactsRevealed=false}
 function move(delta){const i=order.indexOf(route),nextRoute=order[(i+delta+order.length)%order.length];void slideTo(nextRoute,delta<0?-1:1)}
 async function setExpanded(next){if(changing||next===expanded)return;changing=true;frame.classList.add('mobile-changing');await wait(320);expanded=next;render();try{await art.decode()}catch{}frame.classList.remove('mobile-changing');frame.classList.add('mobile-arriving');await wait(720);frame.classList.remove('mobile-arriving');changing=false;if(expanded&&!contactsRevealed){contactsRevealed=true;frame.classList.add('mobile-contact-reveal');for(let i=0;i<contacts.length;i++){showMobileContact(i,true);await wait(620);showMobileContact(i,false);await wait(180)}frame.classList.remove('mobile-contact-reveal')}}
 toggle.addEventListener('click',()=>setExpanded(!expanded));previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 mobileNav.forEach(button=>button.addEventListener('click',()=>{void slideTo(button.dataset.target,1)}));
 mobileHome.addEventListener('click',()=>{void slideTo('home',-1)});
 liveKeychain.addEventListener('load',()=>{try{const d=liveKeychain.contentDocument;d.documentElement.style.background='#171717';d.body.style.background='#171717';d.querySelector('canvas').style.background='#171717'}catch{}});
 mobileMode.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{mobileModeState=button.dataset.mobileMode;shell.dataset.mobileMode=mobileModeState;mobileMode.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)))}));mobileMode.querySelector('[data-mobile-mode="on"]').setAttribute('aria-pressed','true');
 const sendMobileMusic=state=>{try{mobileDial.contentWindow?.postMessage({type:'mka:music-state',state},'*')}catch{}};mobileDial.addEventListener('load',()=>sendMobileMusic(window.MKAMusic?.getState?.()));mobileMusic.addEventListener('click',()=>window.MKAMusic?.toggle?.());window.MKAMusic?.subscribe?.(state=>{sendMobileMusic(state);mobileMusic.setAttribute('aria-pressed',String(state.playing));mobileMusic.setAttribute('aria-label',state.playing?'Pause music':'Play music')});
 mobileMedia.forEach(button=>button.addEventListener('click',()=>{const video=button.querySelector('video');button.classList.add('is-playing');try{video.currentTime=0;void video.play()}catch{}setTimeout(()=>{try{video.pause()}catch{}button.classList.remove('is-playing');location.hash=button.dataset.target},620)}));
 let catTimer=0;frame.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;const rect=frame.getBoundingClientRect(),scale=rect.width/390,x=(event.clientX-rect.left)/scale,y=(event.clientY-rect.top)/scale;mobileCat.style.left=Math.max(0,Math.min(342,x-22))+'px';mobileCat.style.top=Math.max(0,Math.min(786,y-48))+'px';mobileCat.classList.toggle('from-left',x>195);mobileCat.classList.remove('is-tapping');void mobileCat.offsetWidth;mobileCat.classList.add('is-tapping');clearTimeout(catTimer);catTimer=setTimeout(()=>mobileCat.classList.remove('is-tapping'),560)},true);
 const badgeWords=[['+2+0=','+2'],['ONJI','ONEXCELL'],['UI','AI','UX','PRODUCT']];let badgeChanging=false;setInterval(async()=>{if(!mq.matches||route!=='home'||badgeChanging)return;badgeChanging=true;badgeIndex++;const labels=badges.map(el=>el.querySelector('.mobile-badge-text'));if(matchMedia('(prefers-reduced-motion: reduce)').matches){labels.forEach((label,i)=>label.textContent=badgeWords[i][badgeIndex%badgeWords[i].length]);badgeChanging=false;return}const outgoing=labels.map(label=>label.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-72%)',opacity:.18}],{duration:320,easing:'cubic-bezier(.22,.8,.24,1)',fill:'forwards'}));await Promise.all(outgoing.map(animation=>animation.finished));labels.forEach((label,i)=>label.textContent=badgeWords[i][badgeIndex%badgeWords[i].length]);const incoming=labels.map(label=>label.animate([{transform:'translateY(72%)',opacity:.18},{transform:'translateY(0)',opacity:1}],{duration:430,easing:'cubic-bezier(.18,.9,.22,1)',fill:'forwards'}));await Promise.all(incoming.map(animation=>animation.finished));badgeChanging=false},4800);
 const desktopContacts=[...document.querySelectorAll('#contact-native-links a')],contactMap=[0,2,3,1];contacts.forEach((button,index)=>{button.addEventListener('pointerdown',()=>showMobileContact(index,true));button.addEventListener('pointerup',()=>setTimeout(()=>showMobileContact(index,false),220));button.addEventListener('pointercancel',()=>showMobileContact(index,false));button.addEventListener('click',()=>{button.classList.remove('is-pressed');void button.offsetWidth;button.classList.add('is-pressed');setTimeout(()=>button.classList.remove('is-pressed'),360);desktopContacts[contactMap[index]]?.click()})});
 frame.addEventListener('touchstart',e=>{touchX=e.changedTouches[0]?.clientX??null},{passive:true});frame.addEventListener('touchend',e=>{if(touchX===null)return;const dx=(e.changedTouches[0]?.clientX??touchX)-touchX;touchX=null;if(Math.abs(dx)>55)move(dx<0?1:-1)},{passive:true});
 function size(){shell.style.setProperty('--mobile-scale',Math.min(innerWidth/390,innerHeight/844))}
 function sync(e=mq){shell.hidden=!e.matches;if(e.matches){size();for(const src of preload){const image=new Image;image.decoding='async';image.src=src}route=(location.hash.slice(1)||'home');if(!assets[route])route='home';expanded=route!=='home';render()}}
 mq.addEventListener('change',sync);addEventListener('resize',()=>{if(mq.matches)size()},{passive:true});addEventListener('hashchange',()=>{if(!mq.matches)return;const nextRoute=location.hash.slice(1)||'home';if(assets[nextRoute]){route=nextRoute;expanded=route!=='home';render()}});sync();
})();
