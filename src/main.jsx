import React,{useMemo,useState,useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import QRCode from 'qrcode';
import {Check,ChevronRight,ImagePlus,MessageCircle,Smartphone,Upload,Wifi,Heart,Star,MapPin} from 'lucide-react';
import './styles.css';

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

   <section id="personalizar" className="builder section"><div className="sectionHead"><div><span className="eyebrow">Personalização</span><h2>Veja sua placa antes de comprar.</h2></div><p>A prévia usa a mesma composição da placa final.</p></div><div className="builderGrid"><div className="previewBox"><div className="previewLabel">PRÉVIA EM TEMPO REAL</div><div className="counterScene"><div className="counterSceneOverlay"/><PerspectivePlateCanvas name={name} logo={logo} color={color} background={background} qr={qr} message={message} size={model.id}/></div><div className="previewNote"><Smartphone size={17}/> Aproxime o celular ou escaneie o QR Code</div></div><div className="controls"><div className="progress"><span className={step>=1?'active':''}>1 Dados</span><i/><span className={step>=2?'active':''}>2 Personalização</span><i/><span className={step>=3?'active':''}>3 Pedido</span></div><label>Nome da empresa<input value={name} onChange={e=>setName(e.target.value)} maxLength={30}/></label><label>Link de avaliação do Google<input value={link} onChange={e=>setLink(e.target.value)} placeholder="Cole aqui o link de avaliação"/></label><label>Logo da empresa<div className="upload"><input type="file" accept="image/*" onChange={upload}/><Upload size={18}/><span>{logo?'Logo carregada — clique para trocar':'Enviar sua logo (PNG/JPG)'}</span></div></label><label>Cor dos detalhes<div className="colors"><button aria-label="Dourado" className={color==='#ffc51b'?'on':''} style={{background:'#ffc51b'}} onClick={()=>setColor('#ffc51b')}/><button aria-label="Vermelho" className={color==='#ef3340'?'on':''} style={{background:'#ef3340'}} onClick={()=>setColor('#ef3340')}/><button aria-label="Azul" className={color==='#38bdf8'?'on':''} style={{background:'#38bdf8'}} onClick={()=>setColor('#38bdf8')}/><button aria-label="Verde" className={color==='#34d399'?'on':''} style={{background:'#34d399'}} onClick={()=>setColor('#34d399')}/><button aria-label="Roxo" className={color==='#a78bfa'?'on':''} style={{background:'#a78bfa'}} onClick={()=>setColor('#a78bfa')}/><button aria-label="Laranja" className={color==='#fb923c'?'on':''} style={{background:'#fb923c'}} onClick={()=>setColor('#fb923c')}/></div></label><label>Fundo da placa<div className="backgrounds"><button className={background==='dark'?'on':''} onClick={()=>setBackground('dark')}><span className="bgSwatch bgDark"/>Preto</button><button className={background==='red'?'on':''} onClick={()=>setBackground('red')}><span className="bgSwatch bgRed"/>Vermelho</button><button className={background==='blue'?'on':''} onClick={()=>setBackground('blue')}><span className="bgSwatch bgBlue"/>Azul</button><button className={background==='green'?'on':''} onClick={()=>setBackground('green')}><span className="bgSwatch bgGreen"/>Verde</button><button className={background==='light'?'on':''} onClick={()=>setBackground('light')}><span className="bgSwatch bgLight"/>Claro</button></div></label><label>Mensagem da arte<input value={message} onChange={e=>setMessage(e.target.value)} maxLength={40} placeholder="Ex.: Sabor em cada fatia!"/></label><div className="priceRow"><div><small>Total</small><strong>R$ {model.price.toFixed(2).replace('.',',')}</strong></div><button type="button" className="primary" onClick={continueOrder}>Continuar pedido <ChevronRight size={18}/></button></div>{orderReady&&<div id="pedido-resumo" className="orderSummary"><span className="eyebrow">✓ Pedido preparado</span><h3>Confira sua personalização</h3><p><b>{model.name} · {model.size}</b> · {name}</p><p>Link do Google: <span className="summaryLink">{link}</span></p><p>Logo: {logo?"Enviada ✓":"Não enviada"}</p><p>Valor: <b>R$ {model.price.toFixed(2).replace(".",",")}</b></p><button className="secondary" onClick={()=>{setStep(2);setOrderReady(false)}}>Editar personalização</button><button className="primary" onClick={()=>alert("Próxima etapa: vamos conectar o pagamento.")}>Ir para pagamento <ChevronRight size={18}/></button></div>}</div></div></section>

   <section id="como" className="how section"><div className="sectionHead"><div><span className="eyebrow">Simples para você</span><h2>Do pedido à sua porta.</h2></div></div><div className="steps"><Step n="01" icon={<ImagePlus/>} title="Personalize" text="Escolha o modelo, envie sua logo e informe o link do Google."/><Step n="02" icon={<Wifi/>} title="Nós configuramos" text="Gravamos o NFC e geramos o QR Code com os dados do seu negócio."/><Step n="03" icon={<MessageCircle/>} title="Receba e use" text="A placa chega pronta para colocar no balcão, parede ou caixa." /></div></section>
  </main>
  <footer><div className="brand"><span className="brandMark">NFC</span><span>PlacaFácil</span></div><span>Placas personalizadas para negócios locais.</span></footer>
 </div>
}

function PerspectivePlateCanvas({name,logo,color,background,qr,message,size}){
 const canvasRef=useRef(null);
 const sceneRef=useRef(null);
 const logoRef=useRef(null);
 const qrRef=useRef(null);
 const [ready,setReady]=useState(false);

 useEffect(()=>{setReady(false);if(logo){const img=new Image();img.onload=()=>{logoRef.current=img;setReady(true)};img.src=logo}else{logoRef.current=null;setReady(true)}},[logo]);
 useEffect(()=>{if(qr){const img=new Image();img.onload=()=>{qrRef.current=img;setReady(true)};img.src=qr}else{qrRef.current=null;setReady(true)}},[qr]);

 useEffect(()=>{
  const canvas=canvasRef.current,scene=sceneRef.current;if(!canvas||!scene||!ready)return;
  const draw=()=>{
   const rect=scene.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
   canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';
   const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);
   const W=330,H=445,off=document.createElement('canvas');off.width=W;off.height=H;const o=off.getContext('2d');
   const bg={dark:'#080b12',red:'#5b1118',blue:'#0b2740',green:'#0b3a2d',light:'#f7f7f5'}[background]||'#080b12';
   const accent=color||'#ffc51b';o.fillStyle=bg;o.fillRect(0,0,W,H);
   if(background==='light'){o.fillStyle='#101827';}else{o.fillStyle='#fff';}
   o.font='900 13px Arial';o.textAlign='center';o.fillText(name||'SUA EMPRESA',W/2,58);
   o.font='900 24px Arial';o.fillText('SUA AVALIAÇÃO',W/2,103);
   o.fillStyle=accent;o.fillText('É MUITO IMPORTANTE!',W/2,128);
   o.fillStyle='#ef3340';o.fillRect(85,145,160,4);o.fillStyle=background==='light'?'#334155':'#fff';
   o.font='700 11px Arial';o.fillText('Aponte seu celular',W/2,173);o.fillText('ou escaneie o QR Code',W/2,188);
   if(logoRef.current){o.drawImage(logoRef.current,22,20,70,42)}else{o.strokeStyle='#ffffff55';o.strokeRect(22,20,70,42);o.fillStyle='#ffd21f';o.font='700 8px Arial';o.fillText('SUA LOGO',57,45)}
   o.fillStyle=background==='light'?'#101827':'#fff';o.textAlign='left';o.font='700 11px Arial';o.fillText('G  Avalie nossa',25,236);o.font='700 11px Arial';o.fillText('     empresa no Google',25,251);
   if(qrRef.current)o.drawImage(qrRef.current,220,210,82,82);else{o.strokeStyle='#111';o.strokeRect(220,210,82,82)}
   o.textAlign='center';o.fillStyle=accent;o.font='900 24px Arial';o.fillText('★★★★★',W/2,330);
   o.fillStyle=background==='light'?'#334155':'#fff';o.font='italic 12px Arial';o.fillText(message||'Sua opinião faz toda a diferença!',W/2,358);
   o.font='700 9px Arial';o.fillText('♥  Sua opinião faz toda a diferença!',W/2,385);
   o.strokeStyle=background==='light'?'#cbd5e1':'#ffffff45';o.strokeRect(8,8,W-16,H-16);
   const img=document.createElement('img');img.src=new URL('./gen_ai_image_838d6515-7fe8-4ed1-a5c3-96a32f1b73a5.jpeg',import.meta.url).href;
   const paint=()=>{const iw=img.naturalWidth||864,ih=img.naturalHeight||1536,s=Math.max(rect.width/iw,rect.height/ih),rw=iw*s,rh=ih*s,ox=(rect.width-rw)/2,oy=rect.height-rh;
     const pts=[[270,540],[529,523],[601,907],[344,972]].map(([x,y])=>[x*s+ox,y*s+oy]);
     const inv=(a,b,c,d,e,f,g,h,i,j,k,l,m,n)=>{const det=a*(d*h-e*g)-b*(c*h-e*f)+c*(d*g-e*f);return det?[(i*(d*h-e*g)-j*(c*h-e*f)+k*(d*g-e*f))/det,(a*(j*h-k*g)-b*(i*h-k*f)+c*(i*g-j*f))/det]:[1,0]};
     const affine=(p0,p1,p2,q0,q1,q2)=>{const [x0,y0]=p0,[x1,y1]=p1,[x2,y2]=p2,[u0,v0]=q0,[u1,v1]=q1,[u2,v2]=q2;const D=x0*(y1-y2)+x1*(y2-y0)+x2*(y0-y1);return [(u0*(y1-y2)+u1*(y2-y0)+u2*(y0-y1))/D,(v0*(y1-y2)+v1*(y2-y0)+v2*(y0-y1))/D,(u0*(x2-x1)+u1*(x0-x2)+u2*(x1-x0))/D,(v0*(x2-x1)+v1*(x0-x2)+v2*(x1-x0))/D,(u0*(x1*y2-x2*y1)+u1*(x2*y0-x0*y2)+u2*(x0*y1-x1*y0))/D,(v0*(x1*y2-x2*y1)+v1*(x2*y0-x0*y2)+v2*(x0*y1-x1*y0))/D]};
     const src=[[0,0],[W,0],[W,H],[0,H]],rows=18,cols=18;
     for(let r=0;r<rows;r++)for(let col=0;col<cols;col++){const x0=col*W/cols,y0=r*H/rows,x1=(col+1)*W/cols,y1=(r+1)*H/rows;const sx0=x0/W,sy0=y0/H,sx1=x1/W,sy1=y1/H;const bil=(sx,sy)=>{const a=pts[0],b=pts[1],c=pts[2],d=pts[3];return[(1-sx)*(1-sy)*a[0]+sx*(1-sy)*b[0]+sx*sy*c[0]+(1-sx)*sy*d[0],(1-sx)*(1-sy)*a[1]+sx*(1-sy)*b[1]+sx*sy*c[1]+(1-sx)*sy*d[1]]};const q0=bil(sx0,sy0),q1=bil(sx1,sy0),q2=bil(sx1,sy1),q3=bil(sx0,sy1);
       const A=affine([x0,y0],[x1,y0],[x1,y1],q0,q1,q2);ctx.save();ctx.beginPath();ctx.moveTo(q0[0],q0[1]);ctx.lineTo(q1[0],q1[1]);ctx.lineTo(q2[0],q2[1]);ctx.lineTo(q3[0],q3[1]);ctx.closePath();ctx.clip();ctx.transform(A[0],A[3],A[1],A[4],A[2],A[5]);ctx.drawImage(off,x0,y0,x1-x0,y1-y0,x0,y0,x1-x0,y1-y0);ctx.restore();
     }
   };if(img.complete)paint();else img.onload=paint;
  };draw();const ro=new ResizeObserver(draw);ro.observe(scene);return()=>ro.disconnect();
 },[name,logo,color,background,qr,message,size,ready]);
 return <div ref={sceneRef} className="perspectiveCanvasWrap"><canvas ref={canvasRef}/></div>
}

function Plate({name,logo,color,background,qr,message,size}){return <div className={'plate premiumPlate size-'+size+' bg-'+background} style={{'--plate-color':color}}><div className="plateTop"><div className="logo premiumLogo">{logo?<img src={logo}/>:<div className="logoPlaceholder"><span>SUA LOGO</span></div>}</div><span className="nfcPill"><Wifi size={12}/> NFC</span></div><div className="brandName" title={name}>{name||'SUA EMPRESA'}</div><div className="reviewTitle">SUA AVALIAÇÃO<br/><strong>É MUITO IMPORTANTE!</strong></div><div className="accentLine"/><div className="instruction">Aponte seu celular<br/>ou escaneie o QR Code</div><div className="qrRow"><div className="googleBlock"><span className="googleG">G</span><div>Avalie nossa<br/><b>empresa no Google</b></div></div><div className="qr">{qr?<img src={qr}/>:<div className="qrFake">QR</div>}</div></div><div className="stars"><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/></div><div className="plateMessage">{message||'Sua opinião faz toda a diferença!'}</div><div className="plateBottom"><Heart size={14} fill="currentColor"/> Sua opinião faz toda a diferença!</div></div>};

function Step({n,icon,title,text}){return <div className="step"><span>{n}</span><div className="stepIcon">{icon}</div><h3>{title}</h3><p>{text}</p></div>}

createRoot(document.getElementById('root')).render(<App/>);
