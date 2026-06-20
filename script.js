const username = document.getElementById('username');
username.innerHTML = 'Alexandr Astashov';

const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);
themeToggle.addEventListener('click',() => {
const current = html.getAttribute('data-theme');
const next = current === 'dark' ? 'light' : 'dark';
setTheme(next);
});
function setTheme(theme) {
html.setAttribute('data-theme',theme);
localStorage.setItem('theme',theme);
themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}
/* PARTICLES */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
window.addEventListener('resize',resize);
resize();
for( let i = 0; i < 60; i++) {
particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2+1,
    dx:(Math.random()-.5)*0.4,
    dy:(Math.random()-.5)*0.4
});
}
function animate() {
ctx.clearRect(0,0,canvas.width,canvas.height);
particles.forEach(p=>{
    p.x += p.dx;
    p.y += p.dy;
    if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(139,92,246,.5)';
    ctx.fill();
});
requestAnimationFrame(animate);
}
animate();