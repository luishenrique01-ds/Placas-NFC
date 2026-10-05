import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Check,ChevronRight,ImagePlus,MessageCircle,Wifi,Heart,Star} from 'lucide-react';
import PlatePersonalizer from './components/PlatePersonalizer';
import AdminPanel from './components/AdminPanel';
import './styles.css';

const MODELS=[
 {id:'small',name:'Pequena',size:'20 × 30 cm',desc:'Ideal para balcões e mesas',price:59.90},
 {id:'medium',name:'Média',size:'25 × 35 cm',desc:'Mais destaque no atendimento',price:79.90},
 {id:'large',name:'Grande',size:'30 × 40 cm',desc:'Ideal para recepção e parede',price:99.90}
];

function App(){
 const [model,setModel]=useState(MODELS[0]);
 const [admin,setAdmin]=useState(()=>window.location.hash==='#admin');
 useEffect(()=>{const onHash=()=>setAdmin(window.location.hash==='#admin');window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
 if(admin)return <AdminPanel/>;
 return <div className="app">
  <header className="nav"><div className="brand"><span className="brandMark">NFC</span><span>PlacaFácil</span></div><nav><a href="#como">Como funciona</a><a href="#modelos">Modelos</a><a href="#personalizar">Personalizar</a></nav><button className="navCta" onClick={()=>document.getElementById('personalizar')?.scrollIntoView({behavior:'smooth'})}>Personalizar</button></header>
  <main>
   <section className="hero"><div className="heroCopy"><div className="eyebrow"><Wifi size={15}/> NFC + QR Code</div><h1>Sua empresa merece <span>mais avaliações.</span></h1><p>Placas NFC personalizadas que levam seu cliente direto para a avaliação no Google. Personalize sua placa e veja o resultado antes de comprar.</p><button className="primary" onClick={()=>document.getElementById('personalizar')?.scrollIntoView({behavior:'smooth'})}>Criar minha placa <ChevronRight size={18}/></button><div className="trust"><span><Check size={16}/> Personalizada</span><span><Check size={16}/> NFC configurado</span><span><Check size={16}/> QR Code real</span></div></div><div className="heroVisual"><div className="glow"/><div className="heroCard"><div className="heroCardTop"><span>PRÉVIA</span><span><Wifi size={12}/> NFC</span></div><div className="heroLogo">SUA LOGO</div><strong>PIZZARIA DO JOÃO</strong><h3>SUA AVALIAÇÃO<br/><em>É MUITO IMPORTANTE!</em></h3><div className="heroStars"><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/></div><div className="heroBottom"><span>G Avalie no Google</span><div className="heroQr">QR</div></div></div></div></section>

   <section id="modelos" className="section"><div className="sectionHead"><div><span className="eyebrow">Escolha o tamanho</span><h2>Uma placa. Três tamanhos.</h2></div><p>A mesma composição acompanha o tamanho escolhido. A personalização é feita em tempo real.</p></div><div className="modelGrid">{MODELS.map(m=><button key={m.id} className={'modelCard '+(model.id===m.id?'selected':'')} onClick={()=>setModel(m)}><div className="miniPlate"><span>★</span><b>AVALIE</b><small>NO GOOGLE</small></div><div className="modelInfo"><strong>{m.name} · {m.size}</strong><span>{m.desc}</span><b>R$ {m.price.toFixed(2).replace('.',',')}</b></div>{model.id===m.id&&<Check className="selectedIcon" size={20}/>}</button>)}</div></section>

   <PlatePersonalizer/>
   <section id="como" className="how section"><div className="sectionHead"><div><span className="eyebrow">Simples para você</span><h2>Do pedido à sua porta.</h2></div></div><div className="steps"><Step n="01" icon={<ImagePlus/>} title="Personalize" text="Envie sua logo, informe o nome e escolha modelo, cor e link do Google."/><Step n="02" icon={<Wifi/>} title="Nós configuramos" text="O mesmo URL usado no QR Code fica registrado para a programação do NFC."/><Step n="03" icon={<MessageCircle/>} title="Receba e use" text="A placa chega pronta para colocar no balcão, parede ou caixa." /></div></section>
  </main>
  <footer><div className="brand"><span className="brandMark">NFC</span><span>PlacaFácil</span></div><span>Placas personalizadas para negócios locais.</span><a href="#admin" className="adminFooterLink">Administrador</a></footer>
 </div>
}
function Step({n,icon,title,text}){return <div className="step"><span>{n}</span><div className="stepIcon">{icon}</div><h3>{title}</h3><p>{text}</p></div>}
createRoot(document.getElementById('root')).render(<App/>);
