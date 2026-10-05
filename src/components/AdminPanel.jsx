import React,{useEffect,useMemo,useRef,useState} from 'react';
import PlatePreviewCanvas from './PlatePreviewCanvas';
import {ART_BACKGROUNDS} from '../data/plateModels';

const DEFAULT_POINTS=[[.390,.305],[.675,.292],[.705,.575],[.425,.610]];
const KEY='placas-nfc-photo-points';
const LABELS=['Topo esquerdo','Topo direito','Baixo direito','Baixo esquerdo'];

function clamp(v,min=0,max=1){return Math.max(min,Math.min(max,v))}

export default function AdminPanel(){
 const [points,setPoints]=useState(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(v)&&v.length===4?v:DEFAULT_POINTS}catch{return DEFAULT_POINTS}});
 const [draft,setDraft]=useState(points);
 const [active,setActive]=useState(null);
 const [saved,setSaved]=useState(false);
 const [zoom,setZoom]=useState(1);
 const frameRef=useRef(null);
 const imgRef=useRef(null);
 const [imageSize,setImageSize]=useState({w:0,h:0});

 useEffect(()=>{setDraft(points)},[points]);

 const metrics=useMemo(()=>{
  const el=frameRef.current,img=imgRef.current;
  if(!el||!imageSize.w||!imageSize.h)return null;
  const W=el.clientWidth,H=el.clientHeight,scale=Math.max(W/imageSize.w,H/imageSize.h)*zoom;
  const dw=imageSize.w*scale,dh=imageSize.h*scale,dx=(W-dw)/2,dy=(H-dh)/2;
  return {W,H,scale,dw,dh,dx,dy};
 },[imageSize,zoom]);

 const toScreen=([x,y])=>{const m=metrics||{dx:0,dy:0,dw:frameRef.current?.clientWidth||1,dh:frameRef.current?.clientHeight||1};return [m.dx+x*m.dw,m.dy+y*m.dh]};
 const toSource=(sx,sy)=>{const m=metrics||{dx:0,dy:0,dw:1,dh:1};return [clamp((sx-m.dx)/m.dw),clamp((sy-m.dy)/m.dh)]};

 useEffect(()=>{
  const move=e=>{
   if(active===null)return;
   const r=frameRef.current?.getBoundingClientRect();if(!r)return;
   const p=toSource(e.clientX-r.left,e.clientY-r.top);
   setDraft(d=>d.map((v,i)=>i===active?p:v));
   setSaved(false);
  };
  const up=()=>setActive(null);
  window.addEventListener('pointermove',move);
  window.addEventListener('pointerup',up);
  return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}
 },[active,metrics]);

 useEffect(()=>{
  const onResize=()=>setImageSize(s=>({...s}));
  window.addEventListener('resize',onResize);
  return()=>window.removeEventListener('resize',onResize);
 },[]);

 const save=()=>{
  localStorage.setItem(KEY,JSON.stringify(draft));
  setPoints(draft);
  setSaved(true);
 };
 const reset=()=>{setDraft(DEFAULT_POINTS);setPoints(DEFAULT_POINTS);localStorage.setItem(KEY,JSON.stringify(DEFAULT_POINTS));setSaved(true)};
 const startDrag=(e,i)=>{e.preventDefault();e.currentTarget.setPointerCapture?.(e.pointerId);setActive(i)};

 return <div className="adminPage">
  <div className="adminHeader">
   <div><span className="eyebrow">ADMINISTRADOR</span><h1>Ajustar os 4 pontos da placa</h1><p>Arraste cada ponto exatamente para os quatro cantos da placa física na foto.</p></div>
   <a className="adminBack" href="/">← Voltar para o site</a>
  </div>
  <div className="adminGrid">
   <section className="adminCard">
    <div className="adminCardHead"><div><h2>Foto de referência</h2><p>Os pontos vermelhos definem onde a arte será encaixada.</p></div><label className="zoomControl">Zoom <input type="range" min="1" max="2.5" step=".05" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/><b>{zoom.toFixed(2)}×</b></label></div>
    <div ref={frameRef} className="adminPhotoFrame">
     <img ref={imgRef} src={import.meta.env.BASE_URL+'src/gen_ai_image_838d6515-7fe8-4ed1-a5c3-96a32f1b73a5.jpeg'} alt="Foto de referência do balcão" onLoad={e=>setImageSize({w:e.currentTarget.naturalWidth,h:e.currentTarget.naturalHeight})}/>
     {draft.map((p,i)=>{const [x,y]=toScreen(p);return <button key={i} type="button" className={'pointHandle p'+i+(active===i?' active':'')} style={{left:x,top:y}} onPointerDown={e=>startDrag(e,i)} aria-label={LABELS[i]}><span>{i+1}</span></button>})}
     <div className="pointLine l0"/><div className="pointLine l1"/><div className="pointLine l2"/><div className="pointLine l3"/>
    </div>
    <div className="pointLegend">{LABELS.map((x,i)=><span key={x}><i className={'legendDot p'+i}/>{i+1}. {x}</span>)}</div>
    <div className="adminActions"><button type="button" className="adminSave" onClick={save}>Salvar pontos</button><button type="button" className="adminReset" onClick={reset}>Restaurar padrão</button></div>
    {saved&&<div className="adminSaved">✓ Configuração salva neste navegador. A prévia do site usará estes pontos.</div>}
   </section>
   <section className="adminCard adminPreviewCard">
    <div className="adminCardHead"><div><h2>Prévia sincronizada</h2><p>A placa acompanha os quatro pontos enquanto você ajusta.</p></div></div>
    <div className="adminLivePreview"><PlatePreviewCanvas name="PIZZARIA DO JOÃO" backgroundId="black" reviewUrl="https://g.page/r/exemplo" modelId="traditional" points={draft}/></div>
    <div className="adminValues"><strong>Coordenadas salvas</strong>{draft.map((p,i)=><span key={i}>{i+1}: {p[0].toFixed(4)}, {p[1].toFixed(4)}</span>)}</div>
   </section>
  </div>
  <div className="adminTip"><strong>Dica:</strong> use o zoom para posicionar os pontos no limite interno da placa, evitando deixar a arte passar para fora da moldura.</div>
 </div>
}
