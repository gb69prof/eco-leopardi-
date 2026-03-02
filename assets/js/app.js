document.addEventListener("DOMContentLoaded", () => {

  // ---------- Helpers ----------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function stageHasMedia(stage) {
    return !!(qs("iframe, img, video", stage));
  }

  function clearStage(stage) {
    stage.innerHTML = "";
  }

  function renderImage(stage, src, title = "") {
    if (!src) return false;
    clearStage(stage);

    const img = document.createElement("img");
    img.src = src;
    img.alt = title || "immagine";
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.borderRadius = "10px";

    stage.appendChild(img);
    return true;
  }

  function renderVideoFromSrc(stage, src, title = "") {
    if (!src) return false;
    clearStage(stage);

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = title || "video";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;

    // Permessi “safe” per YouTube/HeyGen
    iframe.setAttribute("allow", "encrypted-media; fullscreen; autoplay; clipboard-write; picture-in-picture");

    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.minHeight = "360px";
    iframe.style.border = "0";
    iframe.style.borderRadius = "10px";
    iframe.style.display = "block";

    stage.appendChild(iframe);
    return true;
  }

  function renderVideoFromEmbedHtml(stage, html) {
    if (!html) return false;
    clearStage(stage);
    stage.insertAdjacentHTML("afterbegin", html);
    return true;
  }

  function initStage(stage) {
    // Se già contiene iframe/img/video NON TOCCARE
    if (stageHasMedia(stage) || stage.innerHTML.trim() !== "") return;

    const mode = stage.dataset.defaultMode;

    if (mode === "image") {
      renderImage(stage, stage.dataset.imgSrc, stage.dataset.imgTitle);
      return;
    }

    if (mode === "video") {
      // Preferisci data-video-src (più stabile del mettere HTML nell’attributo)
      const okSrc = renderVideoFromSrc(stage, stage.dataset.videoSrc, stage.dataset.videoTitle);
      if (okSrc) return;

      // fallback: embed completo
      const okEmbed = renderVideoFromEmbedHtml(stage, stage.dataset.videoEmbed);
      if (okEmbed) return;

      // Se non abbiamo nulla, NON svuotare / NON forzare bianco
      return;
    }
  }

  function getFirstStage() {
    return qs(".js-stage");
  }

  // ---------- 1) Init stages ----------
  qsa(".js-stage").forEach(initStage);

  // ---------- 2) Click sugli schemi nel testo: apri immagine nel frame sinistro ----------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-open-schema");
    if (!btn) return;

    const img = btn.dataset.img;
    const title = btn.dataset.title || "Schema";
    const stage = getFirstStage();
    if (!stage) return;

    // Forza rendering immagine
    renderImage(stage, img, title);
  });

  // ---------- 3) Footer: apri blocchi (saperi/vocab/test) nel frame sinistro ----------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-open-left");
    if (!btn) return;

    const targetId = btn.dataset.target;
    const title = btn.dataset.title || "";
    const stage = getFirstStage();
    const block = targetId ? qs("#" + targetId) : null;

    if (!stage || !block) return;

    clearStage(stage);

    const wrap = document.createElement("div");
    wrap.className = "left-doc";
    wrap.style.padding = "12px";

    if (title) {
      const h = document.createElement("h3");
      h.textContent = title;
      h.style.margin = "0 0 10px 0";
      wrap.appendChild(h);
    }

    const content = document.createElement("div");
    content.innerHTML = block.innerHTML;
    wrap.appendChild(content);

    stage.appendChild(wrap);
  });

  // ---------- 4) Dropdown indice ----------
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".js-drop-toggle");
    if (toggle) {
      const dd = toggle.closest(".dropdown");
      if (!dd) return;
      dd.classList.toggle("open");
      return;
    }

    // click fuori: chiudi
    qsa(".dropdown.open").forEach(dd => {
      if (!dd.contains(e.target)) dd.classList.remove("open");
    });
  });

});
