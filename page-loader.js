(() => {
  const loader = document.getElementById("matrix-page-loader");
  if (!loader) return;

  const frame = document.getElementById("home-keychain");
  const started = performance.now();
  const columns = 16;
  const ratio = innerHeight / Math.max(innerWidth, 1);
  const rows = Math.max(6, Math.ceil(columns * ratio));

  loader.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  loader.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  const tiles = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const tile = document.createElement("i");
      tile.className = "matrix-tile";
      tile.style.transitionDelay = `${Math.round((row + column) * 18 + Math.random() * 55)}ms`;
      loader.append(tile);
      tiles.push(tile);
    }
  }

  let revealed = false;
  let readinessObserver;

  const frameIsReady = () => {
    if (!frame) return true;
    if (frame.dataset.ready === "true") return true;
    try {
      return frame.contentWindow?.__mkaKeychainFrame === true;
    } catch {
      return false;
    }
  };

  const reveal = () => {
    if (revealed) return;
    const wait = Math.max(0, 260 - (performance.now() - started));
    if (wait) {
      setTimeout(reveal, wait);
      return;
    }

    revealed = true;
    readinessObserver?.disconnect();
    loader.classList.add("matrix-clearing");
    const lastDelay = Math.max(...tiles.map((tile) => Number.parseFloat(tile.style.transitionDelay) || 0));
    setTimeout(() => loader.remove(), lastDelay + 420);
  };

  const revealWhenReady = () => {
    if (frameIsReady()) reveal();
  };

  addEventListener("message", (event) => {
    if (event.source !== frame?.contentWindow) return;
    if (event.data?.type === "mka:keychain-status" && event.data.ready === true) reveal();
  });

  if (frame) {
    readinessObserver = new MutationObserver(revealWhenReady);
    readinessObserver.observe(frame, { attributes: true, attributeFilter: ["data-ready"] });
    frame.addEventListener("load", revealWhenReady);
  }

  revealWhenReady();
  setTimeout(reveal, 6000);
})();
