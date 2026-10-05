import "./styles.css";

const state = {
  logo: null,
  name: "SUA LOGO AQUI",
  message: "Sua opinião é muito importante para nós!",
  accent: "#d7a62a",
  google: true
};

const app = document.querySelector("#app");

app.innerHTML = `
  <header class="topbar">
    <div class="brand"><span class="brand-mark">N</span><span>Placas NFC</span></div>
    <span class="status">Personalizador</span>
  </header>

  <main class="page">
    <section class="intro">
      <div>
        <p class="eyebrow">PERSONALIZE SUA PLACA</p>
        <h1>Veja sua placa em um ambiente real.</h1>
        <p class="sub">A foto e a estrutura da placa permanecem fixas. Somente o conteúdo da área preta é personalizado.</p>
      </div>
    </section>

    <section class="workspace">
      <aside class="panel">
        <div class="panel-head">
          <div>
            <span class="step">01</span>
            <h2>Personalização</h2>
          </div>
          <span class="live">AO VIVO</span>
        </div>

        <label class="field">
          <span>Nome do estabelecimento</span>
          <input id="name" value="${state.name}" maxlength="28" />
        </label>

        <label class="field">
          <span>Mensagem</span>
          <textarea id="message" rows="3" maxlength="70">${state.message}</textarea>
        </label>

        <label class="field">
          <span>Logo</span>
          <input id="logo" type="file" accept="image/png,image/jpeg,image/webp" />
          <small>PNG ou JPG • será encaixada dentro da placa.</small>
        </label>

        <label class="field">
          <span>Cor de destaque</span>
          <div class="color-row">
            <input id="accent" type="color" value="${state.accent}" />
            <span id="colorValue">${state.accent}</span>
          </div>
        </label>

        <div class="checks">
          <label><input id="google" type="checkbox" checked /> Mostrar avaliação no Google</label>
        </div>

        <div class="notice">
          <strong>Pré-visualização protegida</strong>
          <span>O conteúdo é recortado pela superfície da placa e acompanha a perspectiva.</span>
        </div>
      </aside>

      <section class="preview-wrap">
        <div class="preview-head">
          <div><span class="step">02</span><strong>Pré-visualização</strong></div>
          <span>Foto real</span>
        </div>
        <div class="scene" id="scene">
          <div class="plate-art" id="plateArt">
            <div class="art-inner">
              <div class="art-logo" id="artLogo"></div>
              <div class="art-name" id="artName">SUA LOGO AQUI</div>
              <div class="art-message" id="artMessage">Sua opinião é muito importante para nós!</div>
              <div class="stars" id="stars">★ ★ ★ ★ ★</div>
              <div class="google-copy" id="googleCopy">Deixe sua avaliação no <b>Google</b></div>
              <div class="bottom-art">
                <div class="qr"><span></span><span></span><span></span><span></span></div>
                <div class="phone">◉</div>
                <div class="scan">Aponte a câmera<br/>do seu celular</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
`;

const $ = (id) => document.getElementById(id);

function update() {
  $("artName").textContent = state.name || "SUA LOGO AQUI";
  $("artMessage").textContent = state.message || "";
  $("plateArt").style.setProperty("--accent", state.accent);
  $("googleCopy").style.display = state.google ? "block" : "none";
  $("colorValue").textContent = state.accent.toUpperCase();
  $("artName").style.fontSize = state.name.length > 20 ? "clamp(15px, 2.1vw, 27px)" : "clamp(19px, 2.7vw, 34px)";
}

$("name").addEventListener("input", e => { state.name = e.target.value; update(); });
$("message").addEventListener("input", e => { state.message = e.target.value; update(); });
$("accent").addEventListener("input", e => { state.accent = e.target.value; update(); });
$("google").addEventListener("change", e => { state.google = e.target.checked; update(); });

$("logo").addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.logo = reader.result;
    $("artLogo").innerHTML = `<img src="${state.logo}" alt="Logo enviada" />`;
    $("artLogo").classList.add("has-logo");
  };
  reader.readAsDataURL(file);
});

update();
