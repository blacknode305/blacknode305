/* =========================
   THEME
========================= */

const STORAGE_THEME =
  'blacknode_theme';

function initTheme(){

  const saved =
    localStorage.getItem(
      STORAGE_THEME
    );

  if(saved){

    document.documentElement.dataset.theme =
      saved;

  }

}

function toggleTheme(){

  const current =
    document.documentElement.dataset.theme;

  const next =
    current === 'dark'
      ? 'light'
      : 'dark';

  document.documentElement.dataset.theme =
    next;

  localStorage.setItem(
    STORAGE_THEME,
    next
  );

}

initTheme();

/* =========================
   HELPERS
========================= */

function money(
  value,
  currency='KZT'
){

  return new Intl.NumberFormat(
    'ru-RU',
    {
      style:'currency',
      currency,
      maximumFractionDigits:0
    }
  ).format(value);

}

function saveLocal(key,data){

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );

}

function loadLocal(
  key,
  def=[]
){

  return JSON.parse(
    localStorage.getItem(key)
  ) || def;

}

function uuid(){

  return Math.random()
    .toString(36)
    .substring(2,10);

}

/* =========================
   BACKGROUND
========================= */

const bgCanvas =
  document.getElementById('bg');

if(bgCanvas){

  const ctx =
    bgCanvas.getContext('2d');

  function resizeCanvas(){

    bgCanvas.width =
      window.innerWidth;

    bgCanvas.height =
      window.innerHeight;

  }

  resizeCanvas();

  window.addEventListener(
    'resize',
    resizeCanvas
  );

  const particles = [];

  for(let i = 0; i < 120; i++){

    particles.push({

      x:
        Math.random() *
        window.innerWidth,

      y:
        Math.random() *
        window.innerHeight,

      size:
        Math.random() * 3 + 1,

      speed:
        Math.random() * .7 + .2,

      alpha:
        Math.random()

    });

  }

  function drawBackground(){

    requestAnimationFrame(
      drawBackground
    );

    const styles =
      getComputedStyle(
        document.documentElement
      );

    const overlay =
      styles.getPropertyValue(
        '--bg-overlay'
      );

    const particleRGB =
      styles.getPropertyValue(
        '--bg-particle-rgb'
      );

    ctx.fillStyle =
      overlay;

    ctx.fillRect(
      0,
      0,
      bgCanvas.width,
      bgCanvas.height
    );

    particles.forEach(p=>{

      p.y -= p.speed;

      if(p.y < -10){

        p.y =
          bgCanvas.height + 10;

        p.x =
          Math.random() *
          bgCanvas.width;

      }

      ctx.beginPath();

      ctx.fillStyle =
        `rgba(${particleRGB},
        ${p.alpha * .35})`;

      ctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fill();

    });

  }

  drawBackground();

}