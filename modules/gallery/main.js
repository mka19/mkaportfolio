// Infinite gallery, with 25 artworks in six independently looping masonry columns.
const SOURCE_IMAGES = [
  ["01.png",822,1027], ["02.png",822,1027], ["03.png",822,1027],
  ["04.png",822,1027], ["05.png",822,1027], ["06.png",822,1027],
  ["07.png",822,1027], ["08.png",822,1027], ["09.png",822,859],
  ["10.png",822,1027], ["11.png",823,468], ["12.png",822,1027],
  ["13.png",823,823], ["14.png",823,1224], ["15.png",823,823],
  ["16.png",824,902], ["17.png",822,1030], ["18.png",822,1027],
  ["19.png",822,734], ["20.png",823,823], ["21.png",823,823],
  ["22.png",823,823], ["23.png",822,1027], ["24.png",822,1027],
  ["25.png",822,1027],
];
const CFG = Object.freeze({
  width:250, gapX:58, gapY:54, columns:6, overscan:48,
  followMs:38, momentumDamping:.93,
});
const viewport=document.getElementById("infinite-gallery");
const world=document.getElementById("gallery-world");
const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)");
const stride=CFG.width+CFG.gapX;
const periodX=CFG.columns*stride;
const order=[2,5,0,3,1,4];
const offsets=[28,144,74,190,50,116];
const columns=Array.from({length:CFG.columns},(_,index)=>({
  index,offset:offsets[index],items:[],cycleHeight:0,
}));

SOURCE_IMAGES.forEach(([filename,width,height],id)=>{
  const column=columns[order[id%order.length]];
  const h=CFG.width*height/width;
  column.items.push({
    id,src:new URL(`./thumbs/${filename}`,document.baseURI).href,
    width:CFG.width,height:h,y:column.cycleHeight,
    jitter:Math.sin((id+1)*1.73)*9,
  });
  column.cycleHeight+=h+CFG.gapY;
});

const mounted=new Map();
const camera={x:-165,y:-112};
const target={x:-165,y:-112};
const velocity={x:0,y:0};
const drag={pointerId:null,x:0,y:0,time:0,moved:false};
let size={width:1602,height:710};
let lastFrame=performance.now();
let dragging=false;
let lastCardX=Infinity,lastCardY=Infinity,cardsDirty=true;
const mod=(n,m)=>((n%m)+m)%m;

function createCard(card,x,y){
  const el=document.createElement("div");
  el.className="gallery-card";
  el.style.left=`${x}px`;
  el.style.top=`${y}px`;
  el.style.width=`${card.width}px`;
  el.style.height=`${card.height}px`;
  const image=document.createElement("img");
  image.src=card.src;
  image.alt=`Portfolio artwork ${card.id+1}`;
  image.loading="lazy";
  image.decoding="async";
  image.draggable=false;
  el.appendChild(image);
  return el;
}

function updateCards(){
  const left=-camera.x-CFG.overscan;
  const right=size.width-camera.x+CFG.overscan;
  const top=-camera.y-CFG.overscan;
  const bottom=size.height-camera.y+CFG.overscan;
  const firstCol=Math.floor(left/stride)-1;
  const lastCol=Math.ceil(right/stride)+1;
  const needed=new Set();

  for(let colNum=firstCol;colNum<=lastCol;colNum++){
    const col=columns[mod(colNum,CFG.columns)];
    const baseX=colNum*stride;
    for(const card of col.items){
      const baseY=col.offset+card.y;
      const firstCycle=Math.floor((top-baseY-card.height)/col.cycleHeight);
      const lastCycle=Math.ceil((bottom-baseY)/col.cycleHeight);
      for(let cycle=firstCycle;cycle<=lastCycle;cycle++){
        const x=baseX+card.jitter;
        const y=baseY+cycle*col.cycleHeight;
        if(x+card.width<left||x>right||y+card.height<top||y>bottom)continue;
        const key=`${colNum}:${card.id}:${cycle}`;
        needed.add(key);
        if(!mounted.has(key)){
          const node=createCard(card,x,y);
          world.appendChild(node);
          mounted.set(key,node);
        }
      }
    }
  }
  for(const [key,node] of mounted){
    if(!needed.has(key)){
      node.remove();
      mounted.delete(key);
    }
  }
  lastCardX=camera.x;
  lastCardY=camera.y;
  cardsDirty=false;
}

function animate(now){
  const dt=Math.min(42,Math.max(1,now-lastFrame));
  lastFrame=now;
  if(!dragging&&!reducedMotion.matches){
    target.x+=velocity.x*dt;
    target.y+=velocity.y*dt;
    const friction=Math.pow(CFG.momentumDamping,dt/16.67);
    velocity.x*=friction;
    velocity.y*=friction;
    if(Math.hypot(velocity.x,velocity.y)<.009){
      velocity.x=0;
      velocity.y=0;
    }
  }
  const ease=reducedMotion.matches?1:1-Math.exp(-dt/CFG.followMs);
  camera.x+=(target.x-camera.x)*ease;
  camera.y+=(target.y-camera.y)*ease;
  if(Math.abs(camera.x)>periodX*1000){
    const shift=Math.trunc(camera.x/periodX)*periodX;
    camera.x-=shift;
    target.x-=shift;
  }
  world.style.transform=`translate3d(${camera.x}px,${camera.y}px,0)`;
  if(cardsDirty||Math.abs(camera.x-lastCardX)>36||Math.abs(camera.y-lastCardY)>36)updateCards();
  requestAnimationFrame(animate);
}

function stopMomentum(){velocity.x=0;velocity.y=0;}
viewport.addEventListener("pointerdown",event=>{
  if(event.pointerType==="mouse"&&event.button!==0)return;
  if(drag.pointerId!==null)return;
  stopMomentum();
  dragging=true;
  drag.pointerId=event.pointerId;
  drag.x=event.clientX;
  drag.y=event.clientY;
  drag.time=performance.now();
  drag.moved=false;
  viewport.classList.add("is-dragging");
  viewport.setPointerCapture(event.pointerId);
});
viewport.addEventListener("pointermove",event=>{
  if(event.pointerId!==drag.pointerId)return;
  const now=performance.now();
  const dx=event.clientX-drag.x;
  const dy=event.clientY-drag.y;
  const dt=Math.max(8,now-drag.time);
  target.x+=dx;
  target.y+=dy;
  velocity.x=velocity.x*.58+Math.max(-3,Math.min(3,dx/dt))*.42;
  velocity.y=velocity.y*.58+Math.max(-3,Math.min(3,dy/dt))*.42;
  drag.x=event.clientX;
  drag.y=event.clientY;
  drag.time=now;
  drag.moved=drag.moved||Math.abs(dx)+Math.abs(dy)>0;
  event.preventDefault();
});
function release(event){
  if(event.pointerId!==drag.pointerId)return;
  const coast=event.type==="pointerup"&&drag.moved;
  if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);
  drag.pointerId=null;
  dragging=false;
  viewport.classList.remove("is-dragging");
  if(!coast||performance.now()-drag.time>110)stopMomentum();
}
viewport.addEventListener("pointerup",release);
viewport.addEventListener("pointercancel",release);
viewport.addEventListener("lostpointercapture",release);

viewport.addEventListener("wheel",event=>{
  event.preventDefault();
  stopMomentum();
  const unit=event.deltaMode===1?16:event.deltaMode===2?size.height:1;
  target.x-=(event.shiftKey&&!event.deltaX?event.deltaY:event.deltaX)*unit;
  target.y-=(event.shiftKey&&!event.deltaX?0:event.deltaY)*unit;
},{passive:false});

viewport.addEventListener("keydown",event=>{
  const moves={ArrowLeft:[150,0],ArrowRight:[-150,0],ArrowUp:[0,150],ArrowDown:[0,-150]};
  if(moves[event.key]){
    event.preventDefault();
    stopMomentum();
    target.x+=moves[event.key][0];
    target.y+=moves[event.key][1];
  }else if(event.key==="Home"){
    event.preventDefault();
    stopMomentum();
    target.x=-165;
    target.y=-112;
  }
});
const observer=new ResizeObserver(()=>{
  const rect=viewport.getBoundingClientRect();
  size={width:Math.max(1,rect.width),height:Math.max(1,rect.height)};
  cardsDirty=true;
});
observer.observe(viewport);
size={width:viewport.clientWidth||1602,height:viewport.clientHeight||710};
requestAnimationFrame(animate);
