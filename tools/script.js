// Theme toggle
const toggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

toggle.addEventListener('click', () => {
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Copy email
document.querySelector('.copy-email').addEventListener('click', (e) => {
  const email = e.target.dataset.email;
  navigator.clipboard.writeText(email).then(() => {
    e.target.textContent = 'Скопировано!';
    setTimeout(() => e.target.textContent = 'Скопировать email', 2000);
  });
});

// Carousel
const track = document.querySelector('.carousel-track');
const slides = track.children;
let index = 0;

document.querySelector('.arrow-right').addEventListener('click', () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});
document.querySelector('.arrow-left').addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

// Auto slide every 5s
setInterval(() => {
  index = (index + 1) % slides.length;
  updateCarousel();
}, 5000);

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// Canvas particles background
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = Array.from({length: 50}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5,
  size: Math.random() * 2 + 1
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
  
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});