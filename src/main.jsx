import React,{useMemo,useState,useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import QRCode from 'qrcode';
import {Check,ChevronRight,ImagePlus,MessageCircle,Smartphone,Upload,Wifi,Heart,Star,MapPin} from 'lucide-react';
import './styles.css';\n\nconst SCENE_PHOTO='/src/gen_ai_image_838d6515-7fe8-4ed1-a5c3-96a32f1b73a5.jpeg';

const MODELS=[
 {id:'small',name:'Pequena',size:'20 × 30 cm',desc:'Ideal para balcões e mesas',price:59.90},
 {id:'medium',name:'Média',size:'25 × 35 cm',desc:'Mais destaque no atendimento',price:79.90},
 {id:'large',name:'Grande',size:'30 × 40 cm',desc:'Ideal para recepção e parede',price:99.90}
];

function App(){
 const [model,setModel]=useState(MODELS[0]);
 const [name,setName]=useState('Pizzaria do João');
 const [link,setLink]=useState('https://g.page/r/exemplo');
 const [color,setColor]=useState('#111827');
 const [background,setBackground]=useState('dark');
 const [message,setMessage]=useState('Sabor em cada fatia!');
 const [logo,setLogo]=useState('');
 const [qr,setQr]=useState('');
 const [step,setStep]=useState(1);
 const [orderReady,setOrderReady]=useState(false);

 const generateQR=async(url)=>{try{setQr(await QRCode.toDataURL(url||'https://google.com',{width:220,margin:1}));}catch{}};
 useMemo(()=>{generateQR(link)},[link]);

 const continueOrder=()=>{
  if(!name.trim()){alert('Digite o nome da empresa.');return;}
  if(!link.trim()){alert('Cole o link de avaliação do Google.');return;}
  setStep(3);setOrderReady(true);
  setTimeout(()=>document.getElementById('pedido-resumo')?.scrollIntoView({behavior:'smooth',block:'center'}),100);
 };

 const upload=(e)=>{const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=()=>setLogo(String(reader.result));reader.readAsDataURL(f)};

 return <div className="app">
  <header className="nav"><div className="brand"><span className="brandMark">NFC</span><span>PlacaFácil</span></div><nav><a href="#como">Como funciona</a><a href="#modelos">Modelos</a><a href="#personalizar">Personalizar</a></nav><button className="navCta" onClick={()=>document.getElementById('personalizar')?.scrollIntoView({behavior:'smooth'})}>Personalizar</button></header>

  <main>
   <section className="hero"><div className="heroCopy"><div className="eyebrow"><Wifi size={15}/> NFC + QR Code</div><h1>Sua empresa merece <span>mais avaliações.</span></h1><p>Placas NFC personalizadas que levam seu cliente direto para a avaliação no Google. Você escolhe o modelo, envia sua logo e recebe pronta para usar.</p><button className="primary" onClick={()=>document.getElementById('personalizar')?.scrollIntoView({behavior:'smooth'})}>Criar minha placa <ChevronRight size={18}/></button><div className="trust"><span><Check size={16}/> Personalizada</span><span><Check size={16}/> NFC configurado</span><span><Check size={16}/> QR Code</span></div></div><div className="heroVisual"><div className="glow"/><div className="productStage"><div className="productCounter"/><div className="plateMockup"><Plate name={name} logo={logo} color={color} background={background} qr={qr} message={message} size={model.id}/></div></div></div></section>

   <section id="modelos" className="section"><div className="sectionHead"><div><span className="eyebrow">Escolha o tamanho</span><h2>Uma placa. Três tamanhos.</h2></div><p>A mesma arte fixa acompanha o tamanho escolhido. Você personaliza logo, nome, fundo e mensagem.</p></div><div className="modelGrid">{MODELS.map(m=><button key={m.id} className={'modelCard '+(model.id===m.id?'selected':'')} onClick={()=>setModel(m)}><div className="miniPlate"><span>★</span><b>AVALIE</b><small>NO GOOGLE</small></div><div className="modelInfo"><strong>{m.name} · {m.size}</strong><span>{m.desc}</span><b>R$ {m.price.toFixed(2).replace('.',',')}</b></div>{model.id===m.id&&<Check className="selectedIcon" size={20}/>}</button>)}</div></section>

   <section id="personalizar" className="builder section"><div className="sectionHead"><div><span className="eyebrow">Personalização</span><h2>Veja sua placa antes de comprar.</h2></div><p>A prévia usa a mesma composição da placa final.</p></div><div className="builderGrid"><div className="previewBox"><div className="previewLabel">PRÉVIA EM TEMPO REAL</div><PerspectivePlateCanvas name={name} logo={logo} color={color} background={background} qr={qr} message={message} size={model.id}/><div className="previewNote"><Smartphone size={17}/> Aproxime o celular ou escaneie o QR Code</div></div><div className="controls"><div className="progress"><span className={step>=1?'active':''}>1 Dados</span><i/><span className={step>=2?'active':''}>2 Personalização</span><i/><span className={step>=3?'active':''}>3 Pedido</span></div><label>Nome da empresa<input value={name} onChange={e=>setName(e.target.value)} maxLength={30}/></label><label>Link de avaliação do Google<input value={link} onChange={e=>setLink(e.target.value)} placeholder="Cole aqui o link de avaliação"/></label><label>Logo da empresa<div className="upload"><input type="file" accept="image/*" onChange={upload}/><Upload size={18}/><span>{logo?'Logo carregada — clique para trocar':'Enviar sua logo (PNG/JPG)'}</span></div></label><label>Cor dos detalhes<div className="colors"><button aria-label="Dourado" className={color==='#ffc51b'?'on':''} style={{background:'#ffc51b'}} onClick={()=>setColor('#ffc51b')}/><button aria-label="Vermelho" className={color==='#ef3340'?'on':''} style={{background:'#ef3340'}} onClick={()=>setColor('#ef3340')}/><button aria-label="Azul" className={color==='#38bdf8'?'on':''} style={{background:'#38bdf8'}} onClick={()=>setColor('#38bdf8')}/><button aria-label="Verde" className={color==='#34d399'?'on':''} style={{background:'#34d399'}} onClick={()=>setColor('#34d399')}/><button aria-label="Roxo" className={color==='#a78bfa'?'on':''} style={{background:'#a78bfa'}} onClick={()=>setColor('#a78bfa')}/><button aria-label="Laranja" className={color==='#fb923c'?'on':''} style={{background:'#fb923c'}} onClick={()=>setColor('#fb923c')}/></div></label><label>Fundo da placa<div className="backgrounds"><button className={background==='dark'?'on':''} onClick={()=>setBackground('dark')}><span className="bgSwatch bgDark"/>Preto</button><button className={background==='red'?'on':''} onClick={()=>setBackground('red')}><span className="bgSwatch bgRed"/>Vermelho</button><button className={background==='blue'?'on':''} onClick={()=>setBackground('blue')}><span className="bgSwatch bgBlue"/>Azul</button><button className={background==='green'?'on':''} onClick={()=>setBackground('green')}><span className="bgSwatch bgGreen"/>Verde</button><button className={background==='light'?'on':''} onClick={()=>setBackground('light')}><span className="bgSwatch bgLight"/>Claro</button></div></label><label>Mensagem da arte<input value={message} onChange={e=>setMessage(e.target.value)} maxLength={40} placeholder="Ex.: Sabor em cada fatia!"/></label><div className="priceRow"><div><small>Total</small><strong>R$ {model.price.toFixed(2).replace('.',',')}</strong></div><button type="button" className="primary" onClick={continueOrder}>Continuar pedido <ChevronRight size={18}/></button></div>{orderReady&&<div id="pedido-resumo" className="orderSummary"><span className="eyebrow">✓ Pedido preparado</span><h3>Confira sua personalização</h3><p><b>{model.name} · {model.size}</b> · {name}</p><p>Link do Google: <span className="summaryLink">{link}</span></p><p>Logo: {logo?"Enviada ✓":"Não enviada"}</p><p>Valor: <b>R$ {model.price.toFixed(2).replace(".",",")}</b></p><button className="secondary" onClick={()=>{setStep(2);setOrderReady(false)}}>Editar personalização</button><button className="primary" onClick={()=>alert("Próxima etapa: vamos conectar o pagamento.")}>Ir para pagamento <ChevronRight size={18}/></button></div>}</div></div></section>

   <section id="como" className="how section"><div className="sectionHead"><div><span className="eyebrow">Simples para você</span><h2>Do pedido à sua porta.</h2></div></div><div className="steps"><Step n="01" icon={<ImagePlus/>} title="Personalize" text="Escolha o modelo, envie sua logo e informe o link do Google."/><Step n="02" icon={<Wifi/>} title="Nós configuramos" text="Gravamos o NFC e geramos o QR Code com os dados do seu negócio."/><Step n="03" icon={<MessageCircle/>} title="Receba e use" text="A placa chega pronta para colocar no balcão, parede ou caixa." /></div></section>
  </main>
  <footer><div className="brand"><span className="brandMark">NFC</span><span>PlacaFácil</span></div><span>Placas personalizadas para negócios locais.</span></footer>
 </div>
}

function PerspectivePlateCanvas({name,logo,color,background,qr,message,size}){
 const canvasRef=useRef(null),wrapRef=useRef(null);
 const sceneRef=useRef(null),logoRef=useRef(null),qrRef=useRef(null);
 const [ready,setReady]=useState(false);

 useEffect(()=>{
  let alive=true;
  const load=(src,ref)=>new Promise(resolve=>{
   if(!src){ref.current=null;resolve();return}
   const img=new Image();
   img.onload=()=>{ref.current=img;resolve()};
   img.onerror=()=>resolve();
   img.src=src;
  });
  Promise.all([load(SCENE_PHOTO,sceneRef),load(logo,logoRef),load(qr,qrRef)]).then(()=>alive&&setReady(true));
  return()=>{alive=false};
 },[logo,qr]);

 useEffect(()=>{
  if(!ready)return;
  const wrap=wrapRef.current,canvas=canvasRef.current;
  if(!wrap||!canvas||!sceneRef.current)return;
  const draw=()=>{
   const rect=wrap.getBoundingClientRect();
   const W=Math.max(1,Math.round(rect.width)),H=Math.max(1,Math.round(rect.height));
   const dpr=Math.min(window.devicePixelRatio||1,2);
   canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
   canvas.style.width=W+'px';canvas.style.height=H+'px';
   const ctx=canvas.getContext('2d');
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);

   // Fundo: mesma foto, desenhada diretamente no Canvas (sem background/transform CSS).
   const img=sceneRef.current;
   const scale=Math.max(W/img.naturalWidth,H/img.naturalHeight);
   const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;
   const dx=(W-dw)/2,dy=H-dh;
   ctx.drawImage(img,dx,dy,dw,dh);

   // Arte dinâmica em uma tela plana. O Canvas projeta essa tela nos 4 cantos da face branca.
   const PW=1000,PH=1375;
   const art=document.createElement('canvas');art.width=PW;art.height=PH;
   const a=art.getContext('2d');
   const bg={dark:'#111827',red:'#7f1d1d',blue:'#123a75',green:'#14532d',light:'#f4f1e8'}[background]||'#111827';
   const fg=background==='light'?'#111827':'#ffffff';
   const accent=color||'#ffc51b';
   a.fillStyle=bg;a.fillRect(0,0,PW,PH);
   a.fillStyle='rgba(255,255,255,.08)';a.fillRect(28,28,PW-56,PH-56);
   a.textAlign='center';
   if(logoRef.current){
    const li=logoRef.current,ratio=Math.min(170/li.naturalWidth,105/li.naturalHeight);
    const lw=li.naturalWidth*ratio,lh=li.naturalHeight*ratio;
    a.drawImage(li,50+(170-lw)/2,55+(105-lh)/2,lw,lh);
   }else{
    a.strokeStyle='rgba(255,255,255,.45)';a.lineWidth=3;a.strokeRect(50,55,170,105);
    a.fillStyle=accent;a.font='800 24px Arial';a.fillText('SUA LOGO',135,118);
   }
   a.fillStyle=fg;a.font='900 36px Arial';a.fillText((name||'SUA EMPRESA').toUpperCase().slice(0,28),PW/2,205);
   a.font='900 72px Arial';a.fillText('SUA AVALIAÇÃO',PW/2,350);
   a.fillStyle=accent;a.fillText('É MUITO IMPORTANTE!',PW/2,435);
   a.fillStyle='#ef3340';a.fillRect(255,478,490,12);
   a.fillStyle=fg;a.font='700 32px Arial';a.fillText('Aponte seu celular',PW/2,555);a.fillText('ou escaneie o QR Code',PW/2,595);
   a.textAlign='left';a.fillStyle=fg;a.font='700 30px Arial';a.fillText('G  Avalie nossa',80,760);a.fillText('     empresa no Google',80,805);
   if(qrRef.current)a.drawImage(qrRef.current,650,675,255,255);
   a.textAlign='center';a.fillStyle=accent;a.font='900 70px Arial';a.fillText('★★★★★',PW/2,1015);
   a.fillStyle=fg;a.font='italic 34px Arial';a.fillText((message||'Sua opinião faz toda a diferença!').slice(0,38),PW/2,1080);
   a.font='700 25px Arial';a.fillText('♥  Sua opinião faz toda a diferença!',PW/2,1250);

   // Quatro pontos da face branca, em coordenadas relativas ao Canvas.
   // O restante da placa (acrílico e suporte) continua sendo a foto original.
   const p=[
    [W*.325,H*.275],
    [W*.735,H*.255],
    [W*.815,H*.610],
    [W*.420,H*.655]
   ];
   const bilinear=(u,v)=>{
    const [tl,tr,br,bl]=p;
    return [
     tl[0]*(1-u)*(1-v)+tr[0]*u*(1-v)+br[0]*u*v+bl[0]*(1-u)*v,
     tl[1]*(1-u)*(1-v)+tr[1]*u*(1-v)+br[1]*u*v+bl[1]*(1-u)*v
    ];
   };
   const affine=(s0,s1,s2,d0,d1,d2)=>{
    const [x0,y0]=s0,[x1,y1]=s1,[x2,y2]=s2,[u0,v0]=d0,[u1,v1]=d1,[u2,v2]=d2;
    const den=x0*(y1-y2)+x1*(y2-y0)+x2*(y0-y1);
    return [
     (u0*(y1-y2)+u1*(y2-y0)+u2*(y0-y1))/den,
     (u0*(x2-x1)+u1*(x0-x2)+u2*(x1-x0))/den,
     (u0*(x1*y2-x2*y1)+u1*(x2*y0-x0*y2)+u2*(x0*y1-x1*y0))/den,
     (v0*(y1-y2)+v1*(y2-y0)+v2*(y0-y1))/den,
     (v0*(x2-x1)+v1*(x0-x2)+v2*(x1-x0))/den,
     (v0*(x1*y2-x2*y1)+v1*(x2*y0-x0*y2)+v2*(x0*y1-x1*y0))/den
    ];
   };
   const cols=48,rows=64;
   for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const x0=c*PW/cols,y0=r*PH/rows,x1=(c+1)*PW/cols,y1=(r+1)*PH/rows;
    const q0=bilinear(x0/PW,y0/PH),q1=bilinear(x1/PW,y0/PH),q2=bilinear(x1/PW,y1/PH),q3=bilinear(x0/PW,y1/PH);
    const m=affine([x0,y0],[x1,y0],[x1,y1],q0,q1,q2);
    a.save?.();
    ctx.save();ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.lineTo(q2[0],q2[1]);ctx.lineTo(q3[0],q3[1]);ctx.closePath();ctx.clip();
    ctx.transform(m[0],m[3],m[1],m[4],m[2],m[5]);
    ctx.drawImage(art,x0,y0,x1-x0,y1-y0,x0,y0,x1-x0,y1-y0);
    ctx.restore();
   }
  };
  draw();
  const ro=new ResizeObserver(draw);ro.observe(wrap);
  window.addEventListener('resize',draw);
  return()=>{ro.disconnect();window.removeEventListener('resize',draw)};
 },[ready,name,logo,color,background,qr,message,size]);

 return <div ref={wrapRef} style={{width:'100%',height:'560px',position:'relative',overflow:'hidden',background:'#fff'}}><canvas ref={canvasRef} style={{display:'block',width:'100%',height:'100%'}}/></div>;
}

function Plate({name,logo,color,background,qr,message,size}){return <div className={'plate premiumPlate size-'+size+' bg-'+background} style={{'--plate-color':color}}><div className="plateTop"><div className="logo premiumLogo">{logo?<img src={logo}/>:<div className="logoPlaceholder"><span>SUA LOGO</span></div>}</div><span className="nfcPill"><Wifi size={12}/> NFC</span></div><div className="brandName" title={name}>{name||'SUA EMPRESA'}</div><div className="reviewTitle">SUA AVALIAÇÃO<br/><strong>É MUITO IMPORTANTE!</strong></div><div className="accentLine"/><div className="instruction">Aponte seu celular<br/>ou escaneie o QR Code</div><div className="qrRow"><div className="googleBlock"><span className="googleG">G</span><div>Avalie nossa<br/><b>empresa no Google</b></div></div><div className="qr">{qr?<img src={qr}/>:<div className="qrFake">QR</div>}</div></div><div className="stars"><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/></div><div className="plateMessage">{message||'Sua opinião faz toda a diferença!'}</div><div className="plateBottom"><Heart size={14} fill="currentColor"/> Sua opinião faz toda a diferença!</div></div>};

function Step({n,icon,title,text}){return <div className="step"><span>{n}</span><div className="stepIcon">{icon}</div><h3>{title}</h3><p>{text}</p></div>}

createRoot(document.getElementById('root')).render(<App/>);
