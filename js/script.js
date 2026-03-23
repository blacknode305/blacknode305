// ===============================
//  Dubstep Glass UI - Audio Visualizer
// ===============================

/**
 * Описание:
 * Этот скрипт создаёт центрированный эквалайзер на canvas, который реагирует на музыку.
 * Также добавлен Web Audio API для получения данных спектра и управление воспроизведением.
 * Все части вынесены в отдельные функции для удобства.
 */

// ===============================
//  Canvas Setup
// ===============================
const canvas = document.getElementById('bg'); // получаем элемент <canvas>
const ctx = canvas.getContext('2d');         // получаем 2D контекст для рисования

/**
 * resizeCanvas - функция для корректного размера canvas
 * Вызывается при загрузке страницы и при изменении окна браузера
 */
function resizeCanvas() {
  canvas.width = window.innerWidth;  // ширина равна ширине окна
  canvas.height = 180;               // фиксированная высота для эквалайзера
}
resizeCanvas();                       // вызов при загрузке
window.addEventListener('resize', resizeCanvas); // вызов при изменении размера окна

// ===============================
//  Web Audio API Setup
// ===============================
const audio = document.getElementById('music'); // получаем аудио элемент

// создаём AudioContext (контекст для работы с Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// создаём AnalyserNode для анализа спектра звука
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256; // размер FFT (256 частотных полос)

// подключаем аудио источник к анализатору и выходу
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

// создаём массив для хранения данных спектра
const bufferLength = analyser.frequencyBinCount; // количество частотных полос
const dataArray = new Uint8Array(bufferLength);  // массив для амплитуд

// ===============================
//  Функции для отрисовки эквалайзера
// ===============================

/**
 * drawBars - рисует центрированный эквалайзер
 */
function drawBars() {
  const barWidth = canvas.width / (bufferLength / 2); // ширина одной полоски
  const centerX = canvas.width / 2; // центр по горизонтали
  const centerY = canvas.height / 2; // центр по вертикали

  for (let i = 0; i < bufferLength; i++) {
    const value = dataArray[i];            // амплитуда для полоски i
    const percent = value / 255;           // нормируем значение 0..1
    const halfHeight = canvas.height * 0.2 * percent; // высота полоски

    // вычисляем смещение от центра
    const offset = i < bufferLength/2 
      ? - (bufferLength/2 - i) * barWidth  // слева
      : (i - bufferLength/2) * barWidth;   // справа

    // цвет и прозрачность полоски с эффектом glow
    ctx.fillStyle = `rgba(120,160,255,${0.1 + percent*0.4})`;

    // рисуем полоску сверху вниз
    ctx.fillRect(centerX + offset, centerY - halfHeight, barWidth - 2, halfHeight);
    // рисуем полоску снизу вверх
    ctx.fillRect(centerX + offset, centerY, barWidth - 2, halfHeight);
  }
}

/**
 * drawWaves - рисует дополнительные мягкие волны поверх эквалайзера
 */
function drawWaves() {
  const time = Date.now() * 0.002; // используем время для анимации
  const centerY = canvas.height / 2;

  for (let l = 0; l < 3; l++) {
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 5) {
      const y = centerY + Math.sin(x*0.02 + time + l) * 20 * (0.5 + l*0.3);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(120,160,255,${0.05 + l*0.05})`; // прозрачность
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

/**
 * draw - главный цикл анимации
 * Получает данные спектра и перерисовывает canvas
 */
function draw() {
  requestAnimationFrame(draw);              // рекурсивный вызов для плавной анимации
  analyser.getByteFrequencyData(dataArray); // обновляем данные спектра

  // очищаем canvas
  ctx.fillStyle = "#07090d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBars();   // рисуем центрированные полоски
  drawWaves();  // рисуем мягкие волны
}
draw(); // запуск анимации

// ===============================
//  Функция для запуска AudioContext и музыки
// ===============================
const playlist = [
  '',
  '',
  '',
];

let currentTrack = 0; // индекс текущей дорожки

// Событие окончания трека
audio.addEventListener('ended', () => {
  currentTrack++; // переходим к следующей дорожке
  if (currentTrack >= playlist.length) currentTrack = 0; // если конец списка → сначала
  playTrack(currentTrack); // воспроизводим следующую дорожку
});

// Запускаем первый трек при загрузке
playTrack(currentTrack);

// Включение AudioContext на мобильных устройствах
document.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  audio.play().catch(e => console.log('Play failed', e));
});
