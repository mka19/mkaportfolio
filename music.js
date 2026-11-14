/* V19: a native, persistent media element owns audible playback. The spectrum is derived from the supplied MP3, never inserted into the audio output path. */
(()=>{'use strict';
const asset=new URL('modules/dial/assets/foxy-shazam-oh-lord.mp3',document.baseURI);
const audio=document.createElement('audio');audio.id='mka-native-audio';audio.src=asset.href;audio.preload='metadata';audio.playsInline=true;audio.setAttribute('playsinline','');audio.setAttribute('webkit-playsinline','');audio.volume=.62;audio.muted=false;audio.hidden=true;
if(document.body)document.body.append(audio);else document.addEventListener('DOMContentLoaded',()=>document.body.append(audio),{once:true});
let volume=.62,error='',desired=false,generation=0,spectrum=null;
const listeners=new Set();
const snapshot=()=>({playing:!audio.paused&&!audio.ended,volume,currentTime:audio.currentTime,duration:Number.isFinite(audio.duration)?audio.duration:null,trackIndex:0,title:'Oh Lord',artist:'Foxy Shazam',error});
const emit=()=>{const s=snapshot();for(const fn of [...listeners])try{fn(s)}catch(e){console.warn('Music subscriber',e)}};
fetch(new URL('modules/dial/assets/oh-lord-spectrum.bin',document.baseURI)).then(r=>{if(!r.ok)throw Error('Spectrum unavailable');return r.arrayBuffer()}).then(b=>spectrum=new Uint8Array(b)).catch(()=>{});
async function play(){const id=++generation;desired=true;error='';audio.muted=false;if(volume===0){volume=.62;}audio.volume=volume;try{if(audio.error)audio.load();await audio.play();if(id!==generation)return snapshot().playing;emit();return !audio.paused;}catch(e){if(id===generation){desired=false;error='Music could not start: '+e.message;emit();}return false;}}
function pause(){++generation;desired=false;audio.pause();emit();return false;}
function toggle(){return desired||!audio.paused?Promise.resolve(pause()):play();}
function setVolume(v){if(Number.isFinite(Number(v))){volume=Math.max(0,Math.min(1,Number(v)));audio.volume=volume;}emit();}
function select(i){return Number(i)===0?toggle():Promise.resolve(false);}
['playing','pause','volumechange','loadedmetadata','durationchange','seeked','waiting'].forEach(e=>audio.addEventListener(e,emit));
audio.addEventListener('ended',()=>{desired=false;emit()});audio.addEventListener('error',()=>{desired=false;error='Music file could not load. Check modules/dial/assets/foxy-shazam-oh-lord.mp3.';emit()});
window.MKAMusic={getState:snapshot,play,pause,toggle,select,setVolume,hasTrack:i=>Number(i)===0,subscribe(fn){listeners.add(fn);fn(snapshot());return()=>listeners.delete(fn)},readFrequencyData(target){target.fill(0);if(spectrum&&!audio.paused&&!audio.ended){const frame=Math.min(Math.floor(spectrum.length/512)-1,Math.max(0,Math.floor(audio.currentTime*22050/1102)));target.set(spectrum.subarray(frame*512,frame*512+Math.min(512,target.length)));}return target;}};
})();
