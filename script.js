// --- MENÚ DE NAVEGACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.getElementById("btn-menu");
  const menuNav = document.getElementById("menu-nav");

  btnMenu.addEventListener("click", () => {
    menuNav.classList.toggle("activo");
  });

  const enlacesMenu = menuNav.querySelectorAll("a");
  enlacesMenu.forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menuNav.classList.remove("activo");
    });
  });
});

// --- SLIDE DE PRESENTACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".slide-presentacion-contenedor");
  if (!contenedor) return;

  const slides = Array.from(contenedor.children);
  let index = slides.findIndex((slide) => slide.classList.contains("slide-activa"));

  let touchStartX = 0;
  let touchEndX = 0;

  function moverA(siguienteIndex) {
    if (siguienteIndex === index) return;
    slides[index].classList.remove("slide-activa");
    slides[index].classList.add("slide", "salida");
    slides[siguienteIndex].classList.remove("salida", "slide");
    slides[siguienteIndex].classList.add("slide-activa");
    index = Electoral = siguienteIndex;
  }

  function siguienteSlide() {
    let siguiente = (index + 1) % slides.length;
    moverA(siguiente);
  }

  function anteriorSlide() {
    let siguiente = (index - 1 + slides.length) % slides.length;
    slides[index].classList.remove("slide-activa");
    slides[index].classList.add("slide");
    slides[siguiente].classList.remove("salida", "slide");
    slides[siguiente].classList.add("slide-activa");
    index = siguiente;
  }

  const seccionCarrusel = document.getElementById("inicio");
  if (seccionCarrusel) {
    seccionCarrusel.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches.screenX;
    }, { passive: true });

    seccionCarrusel.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches.screenX;
      const distanciaMinima = 50;
      if (touchStartX - touchEndX > distanciaMinima) siguienteSlide();
      if (touchEndX - touchStartX > distanciaMinima) anteriorSlide();
    }, { passive: true });

    let autoPlay = setInterval(siguienteSlide, 7000);
    seccionCarrusel.addEventListener("touchstart", () => clearInterval(autoPlay), { passive: true });
  }
});

// --- CERRAR / PAUSAR / DESLIZAR MINIATURAS Y OVERLAY ---
document.addEventListener("DOMContentLoaded", () => {
  const miniaturasViewport = document.querySelector(".miniaturas-viewport");
  const botonMiniPrev = document.querySelector(".mini-prev");
  const botonMiniSig = document.querySelector(".mini-next");
  const overlayFoto = document.getElementById("overlayFoto");
  const overlayImagen = document.getElementById("overlayImagen");
  const overlayCerrar = document.getElementById("overlayCerrar");
  const miniaturas = document.querySelectorAll(".miniatura img");

  if (!miniaturasViewport) return;

  // Botones de dirección de miniaturas
  if (botonMiniSig) {
    botonMiniSig.addEventListener("click", () => {
      miniaturasViewport.scrollBy({ left: 180, behavior: "smooth" });
    });
  }
  if (botonMiniPrev) {
    botonMiniPrev.addEventListener("click", () => {
      miniaturasViewport.scrollBy({ left: -180, behavior: "smooth" });
    });
  }

  // Reproducción automática de miniaturas
  let autoPlayMiniaturas;

  function iniciarAutoPlayMiniaturas() {
    if (autoPlayMiniaturas) clearInterval(autoPlayMiniaturas);
    autoPlayMiniaturas = setInterval(() => {
      if (miniaturasViewport.scrollLeft + miniaturasViewport.clientWidth >= miniaturasViewport.scrollWidth - 10) {
        miniaturasViewport.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        miniaturasViewport.scrollBy({ left: 180, behavior: "smooth" });
      }
    }, 5000);
  }

  iniciarAutoPlayMiniaturas();

  // Pausa cuando el usuario usa el dedo en las miniaturas
  miniaturasViewport.addEventListener('touchstart', () => {
    clearInterval(autoPlayMiniaturas);
  }, { passive: true });

  miniaturasViewport.addEventListener('touchend', () => {
    iniciarAutoPlayMiniaturas();
  }, { passive: true });

  // Variables para el control táctil del Overlay
  let touchStartOverlayX = 0;
  let touchEndOverlayX = 0;
  let miniaturaActivaIndex = 0;

  function actualizarImagenOverlay() {
    if (miniaturas[miniaturaActivaIndex] && overlayImagen) {
      overlayImagen.src = miniaturas[miniaturaActivaIndex].src;
      overlayImagen.alt = miniaturas[miniaturaActivaIndex].alt;
    }
  }

  // Eventos para abrir fotos y pausar carrusel
  miniaturas.forEach((miniatura, index) => {
    miniatura.addEventListener("click", () => {
      miniaturaActivaIndex = index;
      actualizarImagenOverlay();
      if (overlayFoto) overlayFoto.classList.add("activo");
      clearInterval(autoPlayMiniaturas); // Pausa total activa
    });
  });

  // Cerrar overlay y reanudar autoplay
  if (overlayCerrar) {
    overlayCerrar.addEventListener("click", () => {
      overlayFoto.classList.remove("activo");
      iniciarAutoPlayMiniaturas();
    });
  }

  if (overlayFoto) {
    overlayFoto.addEventListener("click", (event) => {
      if (event.target === overlayFoto) {
        overlayFoto.classList.remove("activo");
        iniciarAutoPlayMiniaturas();
      }
    });

    // Desplazamiento táctil (Swipe) dentro del overlay
    overlayFoto.addEventListener("touchstart", (e) => {
      touchStartOverlayX = e.changedTouches.clientX;
    }, { passive: true });

    overlayFoto.addEventListener("touchend", (e) => {
      touchEndOverlayX = e.changedTouches.clientX;
      const distanciaMinima = 50;
      
      if (touchStartOverlayX - touchEndOverlayX > distanciaMinima) {
        // Siguiente foto
        miniaturaActivaIndex = (miniaturaActivaIndex + 1) % miniaturas.length;
        actualizarImagenOverlay();
      }
      if (touchEndOverlayX - touchStartOverlayX > distanciaMinima) {
        // Anterior foto
        miniaturaActivaIndex = (miniaturaActivaIndex - 1 + miniaturas.length) % miniaturas.length;
        actualizarImagenOverlay();
      }
    }, { passive: true });
  }
});
