import React,{useEffect,useRef,useState} from 'react';
import QRCode from 'qrcode';
import {ART_BACKGROUNDS} from '../data/plateModels';
import scenePhoto from '../gen_ai_image_838d6515-7fe8-4ed1-a5c3-96a32f1b73a5.jpeg';

const PHOTO=scenePhoto;

// Pontos normalizados na FOTO ORIGINAL.
// Ordem: topo-esquerdo, topo-direito, baixo-direito, baixo-esquerdo.
const SOURCE_W=1536,SOURCE_H=2752;
const PHOTO_POINTS_SOURCE=[[487/SOURCE_W,966/SOURCE_H],[946/SOURCE_W,952/SOURCE_H],[1110/SOURCE_W,1622/SOURCE_H],[699/SOURCE_W,1732/SOURCE_H]];

// Quando configurada, a API PHP passa a ser o renderizador principal.
// Ex.: VITE_PHP_RENDERER_URL=https://seu-dominio.com/api/generate-plate.php
const PHP_RENDERER_URL=(import.meta.env.VITE_PHP_RENDERER_URL||'').trim();
function getSavedPoints(){try{const v=JSON.parse(localStorage.getItem('placas-nfc-photo-points')||'null');return Array.isArray(v)&&v.length===4?v:PHOTO_POINTS_SOURCE}catch{return PHOTO_POINTS_SOURCE}}

function homographyForQuad(p){
 const [p0,p1,p2,p3]=p;
 const [x0,y0]=p0,[x1,y1]=p1,[x2,y2]=p2,[x3,y3]=p3;
 const dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3;
 const dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3;
 const den=dx1*dy2-dx2*dy1;
 if(Math.abs(den)<1e-8)return (u,v)=>[(1-u)*(1-v)*x0+u*(1-v)*x1+u*v*x2+(1-u)*v*x3,(1-u)*(1-v)*y0+u*(1-v)*y1+u*v*y2+(1-u)*v*y3];
 const g=(dx3*dy2-dx2*dy3)/den,h=(dx1*dy3-dx3*dy1)/den;
 const a=x1-x0+g*x1,b=x3-x0+h*x3,c=x0,d=y1-y0+g*y1,e=y3-y0+h*y3,f=y0;
 return (u,v)=>{const z=g*u+h*v+1;return[(a*u+b*v+c)/z,(d*u+e*v+f)/z]};
}
function affine(s0,s1,s2,d0,d1,d2){
 const [x0,y0]=s0,[x1,y1]=s1,[x2,y2]=s2,[u0,v0]=d0,[u1,v1]=d1,[u2,v2]=d2;
 const det=x0*(y1-y2)+x1*(y2-y0)+x2*(y0-y1);
 if(Math.abs(det)<1e-8)return null;
 return[(u0*(y1-y2)+u1*(y2-y0)+u2*(y0-y1))/det,(u0*(x2-x1)+u1*(x0-x2)+u2*(x1-x0))/det,(u0*(x1*y2-x2*y1)+u1*(x2*y0-x0*y2)+u2*(x0*y1-x1*y0))/det,(v0*(y1-y2)+v1*(y2-y0)+v2*(y0-y1))/det,(v0*(x2-x1)+v1*(x0-x2)+v2*(x1-x0))/det,(v0*(x1*y2-x2*y1)+v1*(x2*y0-x0*y2)+v2*(x0*y1-x1*y0))/det];
}
function bilinear(u,v){return [u,v];}
function drawTriangle(ctx,art,s0,s1,s2,d0,d1,d2){
 const A=affine(s0,s1,s2,d0,d1,d2);if(!A)return;
 ctx.save();ctx.beginPath();ctx.moveTo(...d0);ctx.lineTo(...d1);ctx.lineTo(...d2);ctx.closePath();ctx.clip();
 ctx.transform(A[0],A[3],A[1],A[4],A[2],A[5]);ctx.drawImage(art,0,0);ctx.restore();
}

export default function PlatePreviewCanvas({name,logo,backgroundId,reviewUrl,modelId='traditional',compact=false,points=getSavedPoints()}){
 const canvasRef=useRef(null),wrapRef=useRef(null),sceneRef=useRef(null),logoRef=useRef(null),qrRef=useRef(null);
 const [ready,setReady]=useState(false);
 const [phpImage,setPhpImage]=useState('');
 const [phpLoading,setPhpLoading]=useState(false);
 const [phpError,setPhpError]=useState('');

 useEffect(()=>{
  let alive=true;setReady(false);
  const load=(src,ref)=>new Promise(resolve=>{
   if(!src){ref.current=null;resolve();return}
   const img=new Image();img.onload=()=>{ref.current=img;resolve()};img.onerror=()=>{ref.current=null;resolve()};img.src=src;
  });
  const qrPromise=QRCode.toDataURL(reviewUrl||'https://google.com',{width:320,margin:1,errorCorrectionLevel:'H'})
   .then(src=>load(src,qrRef)).catch(()=>load('',qrRef));
  Promise.all([load(PHOTO,sceneRef),load(logo,logoRef),qrPromise]).then(()=>alive&&setReady(true));
  return()=>{alive=false};
 },[logo,reviewUrl]);

 // Renderização no PHP. O Canvas continua como fallback local enquanto a URL PHP
 // não estiver configurada ou se a API estiver indisponível.
 useEffect(()=>{
  if(!ready||!PHP_RENDERER_URL)return;
  let alive=true;
  const run=async()=>{
   setPhpLoading(true);
   setPhpError('');
   try{
    const qrSource=qrRef.current?qrRef.current.src:'';
    const response=await fetch(PHP_RENDERER_URL,{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({
      name:name||'SUA EMPRESA',
      background:(ART_BACKGROUNDS.find(x=>x.id===backgroundId)||ART_BACKGROUNDS[0]).value,
      logoDataUrl:logo||'',
      qrDataUrl:qrSource,
      reviewUrl:reviewUrl||'',
      modelId,
      points:points
     })
    });
    const data=await response.json();
    if(!response.ok||!data.ok||!data.image)throw new Error(data.error||'O renderizador PHP não retornou uma imagem.');
    if(alive)setPhpImage(data.image);
   }catch(error){
    if(alive){
     setPhpImage('');
     setPhpError(error instanceof Error?error.message:'Falha ao chamar o PHP');
    }
   }finally{
    if(alive)setPhpLoading(false);
   }
  };
  run();
  return()=>{alive=false};
 },[ready,name,logo,backgroundId,reviewUrl,modelId,points]);

 useEffect(()=>{
  if(!ready||PHP_RENDERER_URL&&phpImage)return;
  const wrap=wrapRef.current,canvas=canvasRef.current;
  if(!wrap||!canvas||!sceneRef.current)return;
  const draw=()=>{
   const rect=wrap.getBoundingClientRect(),W=Math.max(1,Math.round(rect.width)),H=Math.max(1,Math.round(rect.height)),dpr=Math.min(devicePixelRatio||1,2);
   canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';
   const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
   const img=sceneRef.current,scale=Math.max(W/img.naturalWidth,H/img.naturalHeight),dw=img.naturalWidth*scale,dh=img.naturalHeight*scale,dx=(W-dw)/2,dy=(H-dh)/2;
   ctx.drawImage(img,dx,dy,dw,dh);
   const PW=1000,PH=1375,art=document.createElement('canvas');art.width=PW;art.height=PH;const a=art.getContext('2d');
   const bg=ART_BACKGROUNDS.find(x=>x.id===backgroundId)||ART_BACKGROUNDS[0],fg=bg.foreground;
   if(backgroundId!=='transparent'){a.fillStyle=bg.value;a.fillRect(0,0,PW,PH);a.fillStyle='rgba(255,255,255,.08)';a.fillRect(28,28,PW-56,PH-56)}
   a.textAlign='center';
   if(logoRef.current){const li=logoRef.current,r=Math.min(170/li.naturalWidth,105/li.naturalHeight),lw=li.naturalWidth*r,lh=li.naturalHeight*r;a.drawImage(li,50+(170-lw)/2,55+(105-lh)/2,lw,lh)}
   else{a.strokeStyle=backgroundId==='transparent'?'rgba(17,24,39,.4)':'rgba(255,255,255,.45)';a.lineWidth=3;a.strokeRect(50,55,170,105);a.fillStyle=backgroundId==='transparent'?'#111827':'#ffd21f';a.font='800 24px Arial';a.fillText('SUA LOGO',135,118)}
   a.fillStyle=fg;a.font='900 36px Arial';a.fillText((name||'SUA EMPRESA').toUpperCase().slice(0,28),PW/2,205);
   a.font='900 72px Arial';a.fillText('SUA AVALIAÇÃO',PW/2,350);a.fillStyle=backgroundId==='transparent'?'#dc2626':'#ffc51b';a.fillText('É MUITO IMPORTANTE!',PW/2,435);
   a.fillStyle='#ef3340';a.fillRect(255,478,490,12);a.fillStyle=fg;a.font='700 32px Arial';a.fillText('Aponte seu celular',PW/2,555);a.fillText('ou escaneie o QR Code',PW/2,595);
   a.textAlign='left';a.font='700 30px Arial';a.fillText('G  Avalie nossa',80,760);a.fillText('     empresa no Google',80,805);
   if(qrRef.current)a.drawImage(qrRef.current,650,675,255,255);
   a.textAlign='center';a.fillStyle=backgroundId==='transparent'?'#dc2626':'#ffc51b';a.font='900 70px Arial';a.fillText('★★★★★',PW/2,1015);a.fillStyle=fg;a.font='italic 34px Arial';a.fillText('Sua opinião faz toda a diferença!',PW/2,1080);a.font='700 25px Arial';a.fillText('♥  Sua opinião faz toda a diferença!',PW/2,1250);
   if(modelId==='wood'||modelId==='blackBase'){a.fillStyle=modelId==='wood'?'#9a6b43':'#080808';a.fillRect(0,1290,PW,85);a.fillStyle='rgba(255,255,255,.18)';a.fillRect(0,1290,PW,3)}

   // Fallback local: os mesmos pontos da foto original são convertidos para
   // a transformação "cover" usada para desenhar a foto no Canvas.
   const p=points.map(([x,y])=>[dx+x*dw,dy+y*dh]);
   const map=homographyForQuad(p);
   const cols=48,rows=64;
   for(let rr=0;rr<rows;rr++)for(let cc=0;cc<cols;cc++){const x0=cc*PW/cols,y0=rr*PH/rows,x1=(cc+1)*PW/cols,y1=(rr+1)*PH/rows,q0=bilinear(x0/PW,y0/PH),q1=bilinear(x1/PW,y0/PH),q2=bilinear(x1/PW,y1/PH),q3=bilinear(x0/PW,y1/PH),m=affine([x0,y0],[x1,y0],[x1,y1],q0,q1,q2);ctx.save();ctx.beginPath();ctx.moveTo(...q0);ctx.lineTo(...q1);ctx.lineTo(...q2);ctx.lineTo(...q3);ctx.closePath();ctx.clip();ctx.transform(m[0],m[3],m[1],m[4],m[2],m[5]);ctx.drawImage(art,x0,y0,x1-x0,y1-y0,x0,y0,x1-x0,y1-y0);ctx.restore()}
   const gloss=ctx.createLinearGradient(0,0,W,H);gloss.addColorStop(0,'rgba(255,255,255,.10)');gloss.addColorStop(.35,'rgba(255,255,255,0)');gloss.addColorStop(.75,'rgba(255,255,255,.04)');gloss.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gloss;ctx.fillRect(0,0,W,H);
  };
  draw();const ro=new ResizeObserver(draw);ro.observe(wrap);window.addEventListener('resize',draw);return()=>{ro.disconnect();window.removeEventListener('resize',draw)}
 },[ready,name,backgroundId,modelId,phpImage,points]);

 return <div ref={wrapRef} className={'plateCanvasWrap '+(compact?'compact':'')}>
   {PHP_RENDERER_URL&&phpImage ? (
     <img src={phpImage} alt="Prévia da placa personalizada" style={{display:'block',width:'100%',height:'100%',objectFit:'contain'}}/>
   ) : (
     <canvas ref={canvasRef}/>
   )}
   {PHP_RENDERER_URL&&phpLoading&&<div className="plateRenderStatus">Gerando prévia...</div>}
   {PHP_RENDERER_URL&&phpError&&<div className="plateRenderStatus">PHP: {phpError}</div>}
 </div>
}
