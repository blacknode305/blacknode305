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
  let messageWs = document.getElementById('messageWS');
  const temp = document.getElementById('connectWSURL').value;
  ws = new WebSocket(temp);
  ws.onopen = () => {
    messageWs.innerHTML += '<span>🟢 Local server connected</span><br>';
    console.log('🟢 Local server connected');
  };
  ws.onmessage = (event) => {
    messageWs.innerHTML += `<span>📨 ${event.data}</span><br>`;
    // messageWs.innerHTML += '<span>📨 </span><br>';
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

/*

'wss://stream.binance.com:9443/ws/ethusdt@ticker' 
{
  "e":"24hrTicker",         // Тип события — 24-часовой тикер
  "E":1786174981016,        // Время события, Unix timestamp в мс
  "s":"ETHUSDT",            // Торговая пара
  "p":"11.43000000",        // Изменение цены за 24ч: +11.43 USDT
  "P":"0.601",              // Изменение за 24ч: +0.601%
  "w":"1918.45128854",      // Средневзвешенная цена за 24ч
  "x":"1903.07000000",      // Цена в начале 24-часового периода
  "c":"1914.51000000",      // Текущая последняя цена
  "Q":"0.01460000",         // Объём последней сделки в ETH
  "b":"1914.51000000",      // Лучшая цена покупки (best bid)
  "B":"19.74600000",        // Объём на лучшем bid в ETH
  "a":"1914.52000000",      // Лучшая цена продажи (best ask)
  "A":"65.77490000",        // Объём на лучшем ask в ETH
  "o":"1903.08000000",      // Цена первой сделки за 24ч
  "h":"1943.02000000",      // Максимальная цена за 24ч
  "l":"1901.91000000",      // Минимальная цена за 24ч
  "v":"187328.63800000",    // Объём торгов за 24ч в ETH
  "q":"359380866.95123300", // Объём торгов за 24ч в USDT
  "O":1786088581006,        // Начало 24-часового периода
  "C":1786174981006,        // Конец 24-часового периода
  "F":4259091320,           // ID первой сделки
  "L":4260364753,           // ID последней сделки
  "n":1273434               // Количество сделок за 24ч
}

wss://stream.binance.com:9443/ws/ethusdt@kline_1m
@kline_1m @kline_5m @kline_15m @kline_1h @kline_4h
{
  "e":"kline",
  "E":1786175420018,
  "s":"ETHUSDT",
  "k": {
    "t":1786175400000,
    "T":1786175459999,
    "s":"ETHUSDT",
    "i":"1m",
    "f":4260365350,
    "L":4260365412,
    "o":"1914.53000000",
    "c":"1914.52000000",
    "h":"1914.53000000",
    "l":"1914.52000000",
    "v":"17.90700000",
    "n":63,
    "x":false,
    "q":"34283.48789500",
    "V":"17.82550000",
    "Q":"34127.45451500",
    "B":"0"
  }
}
*/

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

// ====================
// RADIO STREAM
// ====================
const stations = {
    soma: 'https://ice5.somafm.com/live-128-mp3',
    chillits: 'https://ice5.somafm.com/chillits-128-mp3',
    digitalis: 'https://ice5.somafm.com/digitalis-128-mp3',
    sf1033: 'https://ice5.somafm.com/sf1033-128-mp3',
    doomed: 'https://ice5.somafm.com/doomed-128-mp3',
    paradise: 'http://stream-tx1.radioparadise.com/mp3-128',
    // http://stream-tx1.radioparadise.com/mp3-128,
    'Русское Радио': 'https://broadcast.osetiafm.ru/rr.mp3',
    'Авторадио': 'https://broadcast.osetiafm.ru/avto.mp3',
    'Ретро FM': 'https://broadcast.osetiafm.ru/retro.mp3',
    'Европа Плюс': 'https://broadcast.osetiafm.ru/europa.mp3',
    'Монте-Карло': 'https://broadcast.osetiafm.ru/mc.mp3'
};

const audio = document.getElementById('audio');

audio.src = stations["Европа Плюс"];