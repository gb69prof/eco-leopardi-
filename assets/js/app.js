(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Dropdowns
  $$('.js-drop-toggle').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const menu = btn.closest('.dropdown').querySelector('.dropdown-menu');
      menu.classList.toggle('open');
    });
  });
  document.addEventListener('click', (e)=>{
    $$('.dropdown-menu.open').forEach(menu=>{
      const drop = menu.closest('.dropdown');
      if(!drop.contains(e.target)) menu.classList.remove('open');
    });
  });

  // Stage system (left panel)
  const stage = $('.js-stage');
  if(stage){
    const state = {
      mode: stage.dataset.defaultMode || 'video', // video | image | html
      videoSrc: stage.dataset.videoSrc || '',
      videoTitle: stage.dataset.videoTitle || '',
      lastVideoSrc: stage.dataset.videoSrc || '',
    };

    function renderVideo(src, title){
      stage.innerHTML = `
        <div class="stage-frame">
          <iframe src="${src}" title="${title || 'Video'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div class="stage-caption">Video</div>
      `;
      state.mode = 'video';
      state.lastVideoSrc = src;
    }

    function renderImage(src, title){
      stage.innerHTML = `
        <img class="stage-image" src="${src}" alt="${title || 'Schema'}" />
        <div class="stage-caption">${title || 'Schema'}</div>
        ${state.videoSrc ? `<button class="icon-btn" style="margin-top:8px; align-self:flex-start" type="button" data-action="backToVideo">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6 4 12l6 6v-4h10v-4H10V6z"/></svg>
            Torna al video
          </button>` : ``}
      `;
      const back = stage.querySelector('[data-action="backToVideo"]');
      if(back){
        back.addEventListener('click', ()=> renderVideo(state.lastVideoSrc, state.videoTitle));
      }
      state.mode = 'image';
    }

    function renderHtml(title, html){
      stage.innerHTML = `
        <div class="panel" style="border:none; box-shadow:none; background:transparent">
          <div class="panel-body" style="border-radius:14px; border:1px solid rgba(0,0,0,.12);">
            <h3 style="margin:0 0 8px; font-family: ui-serif, Georgia, 'Times New Roman', serif;">${title}</h3>
            <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.55; font-size:15px;">
              ${html}
            </div>
          </div>
        </div>
        ${state.videoSrc ? `<button class="icon-btn" style="margin-top:10px; align-self:flex-start" type="button" data-action="backToVideo">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6 4 12l6 6v-4h10v-4H10V6z"/></svg>
            Torna al video
          </button>` : ``}
      `;
      const back = stage.querySelector('[data-action="backToVideo"]');
      if(back){
        back.addEventListener('click', ()=> renderVideo(state.lastVideoSrc, state.videoTitle));
      }
      state.mode = 'html';
    }

    // Expose
    window.EcoStage = { renderVideo, renderImage, renderHtml };

    // Init
    if(state.videoSrc){
      renderVideo(state.videoSrc, state.videoTitle);
    }
  }

  // Schema click -> left stage
  $$('.js-open-schema').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const img = btn.dataset.img;
      const title = btn.dataset.title || 'Schema';
      if(window.EcoStage) window.EcoStage.renderImage(img, title);
    });
  });

  // Footer buttons -> left stage html
  $$('.js-open-left').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const title = btn.dataset.title || btn.textContent.trim();
      const target = btn.dataset.target;
      const contentEl = target ? document.getElementById(target) : null;
      const html = contentEl ? contentEl.innerHTML : '<p>Contenuto non disponibile.</p>';
      if(window.EcoStage) window.EcoStage.renderHtml(title, html);
    });
  });
})();