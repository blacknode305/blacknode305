// ====================
// LOADING
// ====================
try {
  Android.toast('SPA load with android application');
}
catch (error) {
  console.log(error.message);
}
finally {
  console.log('SPA load with browser');
}
// ====================
// DATABASE
// ====================
let db = {};
if (localStorage.getItem('db')) {
    db = JSON.parse(localStorage.getItem('db'));
}
else {
    db.theme ??= 'dark';
    db.finance ??= [];
    db.income ??= [];
    db.expense ??= [];
}
function saveDB() { 
  localStorage.setItem('db', JSON.stringify(db)) 
};
saveDB();

// ====================
// FULLSCREEN
// ====================
const fullscreenToggle = document.getElementById('fullscreenToggle');
fullscreenToggle.addEventListener('click', async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("Fullscreen error:", error);
        alert(error.name + ": " + error.message);
    }
});
// ====================
// RELOAD
// ====================
const reloadToggle = document.getElementById('reloadToggle');
reloadToggle.addEventListener('click', async () => {
  location.reload();
});
// ====================
// NAVIGATION
// ====================
const navigationToggle = document.getElementById('navigationToggle');
navigationToggle.addEventListener('click', async () => {
  const navigation = document.getElementById('navigation');
  if(navigation.style.display == 'none') {
    navigation.style.display = 'flex';
  }
  else {
    navigation.style.display = 'none';
  }
});
// ====================
// THEME
// ====================
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
    db.theme = theme;
    html.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    saveDB();
};

// Загружаем сохранённую тему
setTheme(db.theme);

// Переключатель темы
themeToggle.addEventListener('click', () => {
    const next = db.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
});

// ====================
// PARTICLES
// ====================
const canvas = document.getElementById("particles");

if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(139,92,246,.5)";
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ====================
// LOCAL WEBSOCKET
// ====================
let ws;
const connectLocalBtn = document.getElementById('connectLocalBtn');
connectLocalBtn.addEventListener('click', (event) => {
  const messageWs = document.getElementById('messageWS');
  const temp = document.getElementById('connectWSURL').value;
  ws = new WebSocket(temp);
  ws.onopen = () => {
    messageWs.innerHTML += '<span>🟢 Local server connected</span><br>';
    console.log('🟢 Local server connected');
  };
  ws.onmessage = (event) => {
    messageWs += `<span>📨 ${event.data}</span><br>`;
    console.log('📨', event.data);
  };
  ws.onerror = () => {
    messageWs.innerHTML += '<span>🔴 Local server unavailable</span><br>';
    console.log('🔴 Local server unavailable');
  };
  ws.onclose = () => {
    messageWs.innerHTML += '<span>⚪ Local server disconnected</span><br>';
    console.log('⚪ Local server disconnected');
  };
  return ws;
});

// ====================
// FETCH CONNECTION
// ====================
const connectFetchBtn = document.getElementById('connectFetchBtn');
connectFetchBtn.addEventListener('click', (event) => {
  const temp = document.getElementById('connectFETCHURL').value;
  async function getCurrentPrice(symbol) {
    try {
      // const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      // const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`);
      if (!response.ok) {
        throw new Error("Ошибка Binance API");
      }
      const data = await response.json();
      console.log(Number(data.price));
    } 
    catch (error) {
      console.error(symbol, error);
      return null;
    }
  }
});