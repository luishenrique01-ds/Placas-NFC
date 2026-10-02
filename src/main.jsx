import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import QRCode from 'qrcode';
import {Check,ChevronRight,ImagePlus,MessageCircle,ShieldCheck,Smartphone,Star,Upload,Wifi} from 'lucide-react';
import './styles.css';

const MODELS=[
 {id:'balcao',name:'Balcão clássico',desc:'Compacta e elegante para balcões',price:69.90},
 {id:'premium',name:'Premium acrílica',desc:'Visual sofisticado para destacar no atendimento',price:89.90},
 {id:'parede',name:'Parede',desc:'Ideal para entrada, caixa ou recepção',price:79.90}
];

function App(){
 const [model,setModel]=useState(MODELS[0]);
 const [name,setName]=useState('Pizzaria do João');
 const [link,setLink]=useState('https://g.page/r/exemplo');
 const [color,setColor]=useState('#111827');
 const [logo,setLogo]=useState('');
 const [qr,setQr]=useState('');
 const [step,setStep]=useState(1);

 const generateQR=async(url)=>{try{setQr(await QRCode.toDataURL(url||'https://google.com',{width:220,margin:1}));}catch{}};
 useMemo(()=>{generateQR(link)},[link]);

 const upload=(e)=>{const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=()=>setLogo(String(reader.result));reader.readAsDataURL(f)};

 return <div className="app">
  <header className="nav"><div className="brand"><span className="brandMark">NFC</span><span>PlacaFácil</span></div><nav><a href="#como">Como funciona</a><a href="#modelos">Modelos</a><a href="#personalizar">Personalizar</a></nav><button className="navCta" onClick={()=>document.getElementById('personalizar')?.scrollIntoView({behavior:'smooth'})}>Personalizar</button></header>

  <main>
   <section className="hero"><div className="heroCopy"><div className="eyebrow"><Wifi size={15}/> NFC + QR Code</div><h1>Sua empresa merece <span>mais avaliações.</span></h1><p>Placas NFC personalizadas que levam seu cliente direto para a avaliação no Google. Você escolhe o modelo, envia sua logo e recebe pronta para usar.</p><button className="primary" onClick={()=>document.getElementById('personalizar')?.scrollIntoView({behavior:'smooth'})}>Criar minha placa <ChevronRight size={18}/></button><div className="trust"><span><Check size={16}/> Personalizada</span><span><Check size={16}/> NFC configurado</span><span><Check size={16}/> QR Code</span></div></div><div className="heroVisual"><div className="glow"/><Plate name={name} logo={logo} color={color} qr={qr}/></div></section>

   <section id="modelos" className="section"><div className="sectionHead"><div><span className="eyebrow">Escolha seu modelo</span><h2>Uma base. Várias personalizações.</h2></div><p>A estrutura da placa permanece fixa. Você altera somente logo, nome e link.</p></div><div className="modelGrid">{MODELS.map(m=><button key={m.id} className={'modelCard '+(model.id===m.id?'selected':'')} onClick={()=>setModel(m)}><div className="miniPlate"><span>★</span><b>AVALIE</b><small>NO GOOGLE</small></div><div className="modelInfo"><strong>{m.name}</strong><span>{m.desc}</span><b>R$ {m.price.toFixed(2).replace('.',',')}</b></div>{model.id===m.id&&<Check className="selectedIcon" size={20}/>}</button>)}</div></section>

   <section id="personalizar" className="builder section"><div className="sectionHead"><div><span className="eyebrow">Personalização</span><h2>Veja sua placa antes de comprar.</h2></div><p>A prévia usa a mesma composição da placa final.</p></div><div className="builderGrid"><div className="previewBox"><div className="previewLabel">PRÉVIA EM TEMPO REAL</div><Plate name={name} logo={logo} color={color} qr={qr}/><div className="previewNote"><Smartphone size={17}/> Aproxime o celular ou escaneie o QR Code</div></div><div className="controls"><div className="progress"><span className={step>=1?'active':''}>1 Dados</span><i/><span className={step>=2?'active':''}>2 Personalização</span><i/><span className={step>=3?'active':''}>3 Pedido</span></div><label>Nome da empresa<input value={name} onChange={e=>setName(e.target.value)} maxLength={30}/></label><label>Link de avaliação do Google<input value={link} onChange={e=>setLink(e.target.value)} placeholder="Cole aqui o link de avaliação"/></label><label>Logo da empresa<div className="upload"><input type="file" accept="image/*" onChange={upload}/><Upload size={18}/><span>{logo?'Logo carregada — clique para trocar':'Enviar logo (PNG/JPG)'}</span></div></label><label>Cor da placa<div className="colors"><button className={color==='#111827'?'on':''} style={{background:'#111827'}} onClick={()=>setColor('#111827')}/><button className={color==='#ffffff'?'on':''} style={{background:'#fff'}} onClick={()=>setColor('#fff')}/><button className={color==='#7f1d1d'?'on':''} style={{background:'#7f1d1d'}} onClick={()=>setColor('#7f1d1d')}/><button className={color==='#14532d'?'on':''} style={{background:'#14532d'}} onClick={()=>setColor('#14532d')}/></div></label><div className="priceRow"><div><small>Total</small><strong>R$ {model.price.toFixed(2).replace('.',',')}</strong></div><button className="primary" onClick={()=>setStep(3)}>Continuar pedido <ChevronRight size={18}/></button></div></div></div></section>

   <section id="como" className="how section"><div className="sectionHead"><div><span className="eyebrow">Simples para você</span><h2>Do pedido à sua porta.</h2></div></div><div className="steps"><Step n="01" icon={<ImagePlus/>} title="Personalize" text="Escolha o modelo, envie sua logo e informe o link do Google."/><Step n="02" icon={<Wifi/>} title="Nós configuramos" text="Gravamos o NFC e geramos o QR Code com os dados do seu negócio."/><Step n="03" icon={<MessageCircle/>} title="Receba e use" text="A placa chega pronta para colocar no balcão, parede ou caixa." /></div></section>
  </main>
  <footer><div className="brand"><span className="brandMark">NFC</span><span>PlacaFácil</span></div><span>Placas personalizadas para negócios locais.</span></footer>
 </div>
}

function Plate({name,logo,color,qr}){return <div className="plate" style={{background:color,color:color==='#ffffff'?'#111827':'#fff'}}><div className="plateTop"><div className="logo">{logo?<img src={logo}/>:<span>LOGO</span>}</div><span className="nfcPill"><Wifi size={12}/> NFC</span></div><div className="plateTitle">AVALIE<br/><strong>NO GOOGLE</strong></div><div className="stars">★★★★★</div><div className="plateName">{name||'Sua empresa'}</div><div className="qr">{qr?<img src={qr}/>:<div className="qrFake">QR</div>}</div><div className="plateBottom">Aproxime seu celular ou escaneie</div></div>}

function Step({n,icon,title,text}){return <div className="step"><span>{n}</span><div className="stepIcon">{icon}</div><h3>{title}</h3><p>{text}</p></div>}

createRoot(document.getElementById('root')).render(<App/>);