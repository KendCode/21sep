(function () {
  const openBtn = document.getElementById("openBtn");
  const intro = document.getElementById("intro");
  const garden = document.getElementById("garden");
  const flowers = document.getElementById("flowers");
  const flowersBack = document.getElementById("flowersBack");
  const letterBtn = document.getElementById("letterBtn");
  const letterOverlay = document.getElementById("letterOverlay");
  const closeBtn = document.getElementById("closeBtn");
  const toast = document.getElementById("toast");
  const messageCard = document.getElementById("messageCard");
  const cardTitleText = document.getElementById("cardTitleText");
  const cardCursor = document.getElementById("cardCursor");
  const ambientToggle = document.getElementById("ambientToggle");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const flowerPositions = [
    { left: "2%", scale: 0.72, delay: 0.00 },
    { left: "13%", scale: 0.98, delay: 0.22 },
    { left: "26%", scale: 0.64, delay: 0.44 },
    { left: "40%", scale: 1.08, delay: 0.66 },
    { left: "54%", scale: 0.74, delay: 0.88 },
    { left: "67%", scale: 1.02, delay: 1.10 },
    { left: "80%", scale: 0.66, delay: 1.32 },
    { left: "91%", scale: 0.92, delay: 1.54 }
  ];

  const backPositions = [
    { left: "-2%", scale: 0.5 }, { left: "9%", scale: 0.62 }, { left: "20%", scale: 0.46 },
    { left: "33%", scale: 0.58 }, { left: "47%", scale: 0.5 }, { left: "60%", scale: 0.64 },
    { left: "73%", scale: 0.48 }, { left: "86%", scale: 0.6 }, { left: "97%", scale: 0.52 }
  ];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function vibrate(ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { }
  }

  function buildFlowerHead(petalCount) {
    const step = 360 / petalCount;
    let html = "";
    for (let i = 0; i < petalCount; i++) {
      html += `<span class="petal" style="transform:rotate(${i * step}deg) translateY(-27px)"></span>`;
    }
    html += `<span class="center"></span>`;
    return html;
  }

  function createFlower(config, index, { back = false } = {}) {
    const flower = document.createElement("div");
    flower.className = "flower";
    flower.style.left = config.left;
    flower.style.setProperty("--s", config.scale);
    flower.style.zIndex = index;
    flower.style.animationDelay = `${back ? 0 : config.delay}s`;
    if (!back) {
      flower.style.setProperty("--tilt", `${rand(-4, 4)}deg`);
    }

    const hue = back ? rand(-6, 10) : rand(-8, 8);
    const headRot = rand(-6, 6);
    const petalCount = back ? 8 : Math.round(rand(7, 12));

    flower.innerHTML = `
      <div class="shadow-blob" style="--s:${config.scale}"></div>
      <div class="stem-wrap"><div class="stem"></div></div>
      ${back ? "" : `<div class="leaf left"></div><div class="leaf right"></div>`}
      <div class="flower-head" style="--hue:${hue}deg; --head-rot:${headRot}deg;">
        ${buildFlowerHead(petalCount)}
      </div>
    `;

    (back ? flowersBack : flowers).appendChild(flower);

    if (!back && !reduceMotion) {
      setTimeout(() => vibrate(8), config.delay * 1000 + 900);
    }
  }

  function addSparkles() {
    const positions = [
      ["20%", "24%"], ["74%", "27%"], ["34%", "36%"],
      ["83%", "46%"], ["10%", "40%"], ["61%", "20%"]
    ];
    positions.forEach(([left, top], i) => {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = "✦";
      s.style.left = left;
      s.style.top = top;
      s.style.animationDelay = `${1.6 + i * .35}s`;
      garden.appendChild(s);
    });
  }

  function addPollen() {
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("span");
      p.className = "pollen";
      const size = rand(3, 6);
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${rand(2, 96)}%`;
      p.style.setProperty("--drift", `${rand(-30, 30)}px`);
      p.style.animationDuration = `${rand(9, 16)}s`;
      p.style.animationDelay = `${rand(0, 10)}s`;
      garden.appendChild(p);
    }
  }

  function addButterflies() {
  if (reduceMotion) return;

  ["12%", "25%", "38%", "52%", "67%", "80%"].forEach((top, i) => {
    const b = document.createElement("span");

    b.className = "butterfly";
    b.textContent = "🦋";

    b.style.top = top;

    b.style.animationDelay = `${i * 3}s, ${i * 0.6}s`;

    garden.appendChild(b);
  });
}

  function typewrite(el, cursorEl, text, speed) {
    if (reduceMotion) {
      el.textContent = text;
      cursorEl.style.display = "none";
      return;
    }
    let i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed + rand(-12, 20));
      } else {
        setTimeout(() => { cursorEl.style.display = "none"; }, 900);
      }
    })();
  }

  function showToast() {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }

  openBtn.addEventListener("click", () => {
    intro.classList.add("hide");

    setTimeout(() => {
      garden.classList.add("show");
      garden.setAttribute("aria-hidden", "false");

      backPositions.forEach((c, i) => createFlower(c, i, { back: true }));
      flowerPositions.forEach((c, i) => createFlower(c, i));
      addPollen();
      addButterflies();

      const bloomDelay = reduceMotion ? 0 : flowerPositions[flowerPositions.length - 1].delay;
      const sparkleStart = bloomDelay * 1000 + 400;
      setTimeout(addSparkles, sparkleStart);

      const cardDelay = reduceMotion ? 200 : bloomDelay * 1000 + 1300;
      setTimeout(() => {
        messageCard.classList.add("reveal");
        typewrite(cardTitleText, cardCursor, "Que nunca te falten motivos para sonreír", 42);
        showToast();
        ambientToggle.classList.add("show");
      }, cardDelay);

      const btnDelay = cardDelay + (reduceMotion ? 150 : 2200);
      setTimeout(() => {
        letterBtn.classList.add("reveal");
      }, btnDelay);
    }, 500);
  });

  letterBtn.addEventListener("click", () => {
    letterOverlay.classList.add("show");
    letterOverlay.setAttribute("aria-hidden", "false");
    closeBtn.focus();
  });

  function closeLetter() {
    letterOverlay.classList.remove("show");
    letterOverlay.setAttribute("aria-hidden", "true");
    letterBtn.focus();
  }

  closeBtn.addEventListener("click", closeLetter);

  letterOverlay.addEventListener("click", (event) => {
    if (event.target === letterOverlay) closeLetter();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && letterOverlay.classList.contains("show")) closeLetter();
  });

  // ---- Música MP3 ----

  const music = new Audio("flores-amarillas.mp3");

  music.loop = true;
  music.volume = 0.45;

  let playing = false;

  function startAmbient() {

    music.play()
      .then(() => {

        playing = true;

        ambientToggle.textContent = "🎵";

        ambientToggle.setAttribute(
          "aria-label",
          "Pausar música"
        );

        ambientToggle.setAttribute(
          "aria-pressed",
          "true"
        );

      })
      .catch((error) => {

        console.log(
          "No se pudo reproducir el MP3:",
          error
        );

      });

  }


  function stopAmbient() {

    music.pause();

    playing = false;

    ambientToggle.textContent = "🔇";

    ambientToggle.setAttribute(
      "aria-label",
      "Activar música"
    );

    ambientToggle.setAttribute(
      "aria-pressed",
      "false"
    );

  }


  ambientToggle.addEventListener("click", () => {

    if (playing) {

      stopAmbient();

    } else {

      startAmbient();

    }

  });
})();
