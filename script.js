// ====================
// DATABASE
// ====================
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

let db = {};
if (localStorage.getItem("db")) {
    db = JSON.parse(localStorage.getItem("db"));
}
else {
    db.theme ??= "dark";
    db.finance ??= [];
    db.income ??= [];
    db.expense ??= [];
}
function saveDB() { localStorage.setItem("db", JSON.stringify(db)) };
saveDB();

// ====================
// THEME
// ====================

function setTheme(theme) {
    db.theme = theme;
    html.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    saveDB();
};

// Загружаем сохранённую тему
setTheme(db.theme);

// Переключатель темы
themeToggle.addEventListener("click", () => {
    const next = db.theme === "dark" ? "light" : "dark";
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