import React,{useEffect,useMemo,useState} from 'react';
import {Check,ChevronRight,Trash2,Upload,Wifi,Link as LinkIcon} from 'lucide-react';
import PlatePreviewCanvas from './PlatePreviewCanvas';
import {ART_BACKGROUNDS,PLATE_MODELS} from '../data/plateModels';

const KEY='placas-nfc-personalizacao';
export default function PlatePersonalizer(){
 const [config,setConfig]=useState({logo:'',name:'Pizzaria do João',modelId:'traditional',backgroundId:'black',reviewUrl:'https://g.page/r/exemplo'});
 const [saved,setSaved]=useState(false);
 const model=useMemo(()=>PLATE_MODELS.find(m=>m.id===config.modelId)||PLATE_MODELS[0],[config.modelId]);
 const update=(k,v)=>setConfig(c=>({...c,[k]:v}));
 useEffect(()=>{localStorage.setItem(KEY,JSON.stringify({...config,updatedAt:new Date().toISOString()}))},[config]);
 const upload=e=>{const f=e.target.files?.[0];if(!f)return;if(!['image/png','image/jpeg'].includes(f.type)){alert('Envie sua logo em PNG ou JPG/JPEG.');return}if(f.size>5*1024*1024){alert('A logo deve ter no máximo 5 MB.');return}const r=new FileReader();r.onload=()=>update('logo',String(r.result));r.readAsDataURL(f)};
 const buy=()=>{if(!config.name.trim())return alert('Digite o nome do estabelecimento.');try{new URL(config.reviewUrl)}catch{return alert('Cole um link válido para avaliação.')}const payload={id:'custom-'+Date.now(),type:'custom-plate',title:'Placa personalizada',price:model.price,personalization:{...config,qrSourceUrl:config.reviewUrl,model},createdAt:new Date().toISOString()};localStorage.setItem('placas-nfc-last-order',JSON.stringify(payload));window.dispatchEvent(new CustomEvent('placa-personalizada-adicionada',{detail:payload}));setSaved(true)};
 return <section id="personalizar" className="personalizer section">
  <div className="personalizerHeader"><div><span className="eyebrow">PERSONALIZAÇÃO</span><h2>PERSONALIZE SUA PLACA</h2><p>Veja como sua placa ficará antes de comprar.</p></div><div className="liveBadge"><span/> PRÉ-VISUALIZAÇÃO EM TEMPO REAL</div></div>
  <div className="personalizerGrid">
   <aside className="personalizerControls">
    <div className="controlStep"><div className="stepNumber">1</div><div className="controlContent"><h3>Sua logo</h3><label className="logoUpload"><input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={upload}/><Upload size={18}/><span>{config.logo?'Trocar logo':'Envie sua logo'}</span></label>{config.logo&&<div className="logoThumb"><img src={config.logo} alt="Logo enviada"/><button type="button" onClick={()=>update('logo','')}><Trash2 size={15}/></button></div>}<small>PNG/JPG • até 5 MB • preserve a proporção</small></div></div>
    <div className="controlStep"><div className="stepNumber">2</div><div className="controlContent"><h3>Nome do estabelecimento</h3><input value={config.name} onChange={e=>update('name',e.target.value)} maxLength={40} placeholder="PIZZARIA DO JOÃO"/></div></div>
    <div className="controlStep"><div className="stepNumber">3</div><div className="controlContent"><h3>Modelo da placa</h3><div className="modelOptions">{PLATE_MODELS.map(m=><button type="button" key={m.id} className={'modelOption '+(m.id===config.modelId?'selected':'')} onClick={()=>update('modelId',m.id)}><span className={'modelSwatch '+m.shape}><i/></span><b>{m.name}</b><small>{m.size}</small>{m.id===config.modelId&&<Check size={15}/>}</button>)}</div></div></div>
    <div className="controlStep"><div className="stepNumber">4</div><div className="controlContent"><h3>Cor do fundo da arte</h3><div className="backgroundOptions">{ART_BACKGROUNDS.map(bg=><button type="button" key={bg.id} className={bg.id===config.backgroundId?'selected':''} onClick={()=>update('backgroundId',bg.id)}><span className={'bgCircle '+bg.id}/><b>{bg.label}</b></button>)}</div><small className="transparentNote">Transparente mantém o ambiente visível através do acrílico.</small></div></div>
    <div className="controlStep"><div className="stepNumber">5</div><div className="controlContent"><h3>Link de avaliação</h3><div className="inputWithIcon"><LinkIcon size={16}/><input value={config.reviewUrl} onChange={e=>update('reviewUrl',e.target.value)} placeholder="Cole aqui o link de avaliação"/></div><p className="helper"><Wifi size={14}/> Este link será usado no QR Code e no NFC da sua placa.</p></div></div>
    <div className="buyBar"><div><small>{model.name} · {model.size}</small><strong>R$ {model.price.toFixed(2).replace('.',',')}</strong></div><button type="button" onClick={buy}>COMPRAR MINHA PLACA PERSONALIZADA <ChevronRight size={18}/></button></div>
    {saved&&<div className="savedMessage"><Check size={17}/> Personalização salva para o pedido. O URL do QR/NFC foi armazenado.</div>}
   </aside>
   <div className="personalizerPreview">
    <div className="previewTop"><span>PRÉ-VISUALIZAÇÃO EM TEMPO REAL</span><span className="previewStatus"><span/> Ao vivo</span></div>
    <div className="photoPreview"><PlatePreviewCanvas {...config}/><div className="nfcHint"><Wifi size={15}/> NFC + QR Code levam ao mesmo link</div></div>
    <div className="examples"><div className="examplesHead"><h3>Outros exemplos com sua personalização</h3><span>Mesmo conteúdo • outras cores</span></div><div className="exampleGrid">{ART_BACKGROUNDS.map(bg=><div className="exampleCard" key={bg.id}><div className="exampleLabel">{bg.label}</div><PlatePreviewCanvas {...config} backgroundId={bg.id} compact/></div>)}</div></div>
   </div>
  </div>
 </section>
}
