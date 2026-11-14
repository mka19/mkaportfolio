/* MKA stage transition kit: independently implemented from the public preset descriptions.
   No proprietary Framer source is included. */
(() => {
 const presets=['curtain','stacked','fade','blinds','circle','split'];
 const defaults={style:'blinds',direction:'up',color:'#151515',accent:'#542124',duration:700,hold:45,bars:6,easing:'smooth'};
 const storage='mka-stage-motion-v1';
 const eases={smooth:'cubic-bezier(.65,0,.25,1)',expo:'cubic-bezier(.87,0,.13,1)',out:'cubic-bezier(.22,1,.36,1)',linear:'linear'};
 function config(){let raw={};try{raw=JSON.parse(localStorage.getItem(storage)||'{}')||{}}catch{}; const c={...defaults,...raw};if(!presets.includes(c.style))c.style=defaults.style;if(!['up','down','left','right'].includes(c.direction))c.direction='up';if(!eases[c.easing])c.easing='smooth';c.duration=Math.max(200,Math.min(1600,Number(c.duration)||700));c.hold=Math.max(0,Math.min(400,Number(c.hold)||0));c.bars=Math.max(2,Math.min(16,Math.round(Number(c.bars)||6)));for(const k of ['color','accent'])if(!/^#[0-9a-f]{6}$/i.test(c[k]))c[k]=defaults[k];return c;}
 function save(c){try{localStorage.setItem(storage,JSON.stringify(c));return true}catch{return false}}
 function create(overlay,c=config()){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const style=reduced?'fade':c.style;
  const vertical=['up','down'].includes(c.direction);const sign=['up','left'].includes(c.direction)?1:-1;
  overlay.replaceChildren();overlay.style.opacity='1';overlay.dataset.preset=style;
  const make=(color,extra={})=>{const el=document.createElement('div');Object.assign(el.style,{position:'absolute',inset:'0',background:color,transform:'none',opacity:'1',clipPath:'none',willChange:'transform,clip-path,opacity',...extra});overlay.append(el);return el;};
  const layers=[];
  if(style==='stacked'){layers.push(make(c.accent),make(c.color));}
  else if(style==='blinds'){for(let i=0;i<c.bars;i++){const a=i/c.bars*100,b=(i+1)/c.bars*100;layers.push(make(c.color,{inset:vertical?`0 ${100-b}% 0 ${a}%`:`${a}% 0 ${100-b}% 0`}));}}
  else if(style==='split'){layers.push(make(c.color,{inset:vertical?'0 0 50% 0':'0 50% 0 0'}),make(c.color,{inset:vertical?'50% 0 0 0':'0 0 0 50%'}));}
  else layers.push(make(c.color));
  const trans=n=>vertical?`translate3d(0,${n}%,0)`:`translate3d(${n}%,0,0)`;
  const neutral='translate3d(0,0,0)';
  function endpoints(i,enter){
   if(style==='fade')return [{opacity:enter?0:1},{opacity:enter?1:0}];
   if(style==='circle'){const tiny='circle(0% at 50% 50%)',large='circle(150% at 50% 50%)';return [{clipPath:enter?tiny:large},{clipPath:enter?large:tiny}];}
   if(style==='blinds'){const zero=vertical?'scaleY(0)':'scaleX(0)';layers[i].style.transformOrigin=vertical?(sign===1?'bottom':'top'):(sign===1?'right':'left');return [{transform:enter?zero:'scale(1)'},{transform:enter?'scale(1)':zero}];}
   const amount=style==='split'?(i===0?-105:105)*sign:105*sign*(enter?1:-1);
   return [{transform:enter?trans(amount):neutral},{transform:enter?neutral:trans(amount)}];
  }
  function initial(){layers.forEach((el,i)=>Object.assign(el.style,endpoints(i,true)[0]));}
  async function animate(enter){const duration=reduced?110:Math.round(c.duration/2);const anims=layers.map((el,i)=>{const keys=endpoints(i,enter);Object.assign(el.style,keys[0]);const lag=reduced?0:style==='stacked'?(enter?i:1-i)*65:style==='blinds'?(enter?i:layers.length-1-i)*Math.min(22,90/layers.length):0;return {el,keys,a:el.animate(keys,{duration,delay:lag,easing:reduced?'ease-out':eases[c.easing],fill:'both'})};});try{await Promise.all(anims.map(x=>x.a.finished));}finally{anims.forEach(({el,keys,a})=>{Object.assign(el.style,keys[1]);a.cancel()});}}
  initial();return {animate,hold:reduced?0:c.hold,style};
 }
 window.MKAStageMotion={presets,defaults,config,save,create};
})();
