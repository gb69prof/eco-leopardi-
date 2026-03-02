document.addEventListener("DOMContentLoaded", function () {

  const stages = document.querySelectorAll(".js-stage");

  stages.forEach(stage => {

    // Se contiene già qualcosa (es. iframe scritto a mano) non toccarlo
    if (stage.innerHTML.trim() !== "") return;

    const mode = stage.dataset.defaultMode;

    // -------- MODALITÀ IMMAGINE --------
    if (mode === "image") {

      const imgSrc = stage.dataset.imgSrc;
      const imgTitle = stage.dataset.imgTitle || "";

      if (imgSrc) {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = imgTitle;
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.borderRadius = "8px";
        stage.appendChild(img);
      }
    }

    // -------- MODALITÀ VIDEO --------
    if (mode === "video") {

      const videoHtml = stage.dataset.videoEmbed;

      if (videoHtml) {
        stage.innerHTML = videoHtml;
      }
    }

  });

});
