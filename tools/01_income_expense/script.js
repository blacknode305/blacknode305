// ====================
// DATABASE
// ====================

const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

let db = JSON.parse(localStorage.getItem("db"));
function saveDB() { localStorage.setItem("db", JSON.stringify(db)) };
//saveDB();

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

// ====================
// LOGIC
// ====================
function createDate() {
    const now = new Date();
    return {
        text: now.toLocaleString(),
        day: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear()
    };
}

function money(value) {
    return new Intl.NumberFormat('ru-RU', { 
        style: 'currency',
        currency: 'KZT',
        maximumFractionDigits: 0
    }).format(value);
}

function addIncome() {
    const val = +incomeInput.value;
    if (!val) return;
    const d = createDate();
    db.finance.unshift({
        type: 'income',
        amount: val,
        comment: incomeComment.value || '',
        receipt: incomeReceipt.value || '',
        date: d.text,
        month: d.month,
        year: d.year
    });
    incomeInput.value = '';
    incomeComment.value = '';
    incomeReceipt.value = '';
    update();
}
function addExpense() {
    const val = +expenseInput.value;
    if (!val) return;
    const d = createDate();
    db.finance.unshift({
    type: 'expense',
    amount: val,
    comment: expenseComment.value || '',
    receipt: expenseReceipt.value || '',
    date: d.text,
    month: d.month,
    year: d.year
    });
    expenseInput.value = '';
    expenseComment.value = '';
    expenseReceipt.value = '';
    update();
}
function removeItem(index) {
    db.finance.splice(index,1);
    update();
}
function update() {
    saveDB();
    let balance = 0;
    let monthIncome = 0;
    let monthExpense = 0;
    const selectedMonth = +document.getElementById('monthSelect').value;
    const selectedYear = +document.getElementById('yearSelect').value;
    const table = document.getElementById('historyTable');
    table.innerHTML = '';
    db.finance.forEach((item,i) => {
    balance += item.type === 'income' ? item.amount : -item.amount;
    if (item.month === selectedMonth && item.year === selectedYear) {
        if (item.type === 'income') { monthIncome += item.amount; }
        else { monthExpense += item.amount; }
    }
    const icon = item.type === 'income' ? '🟢' : '🔴';
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${icon}</td>
        <td>${money(item.amount)}</td>
        <td>${item.comment || '-'}</td>
        <td>${item.date}</td>
        <td>${item.receipt ? `<a href="${item.receipt}" target="_blank" class="receipt-link">🖼</a>` : '-'}</td>
        <td><button class="delete-btn" onclick="removeItem(${i})">🗑</button></td>
    `;
    table.appendChild(row);
    });
    const bal = document.getElementById('balanceText');
    bal.textContent = money(balance);
    bal.className = 'balance-value ' + (balance >= 0 ? 'balance-positive' : 'balance-negative');
    document.getElementById('monthIncome').textContent = money(monthIncome);
    document.getElementById('monthExpense').textContent = money(monthExpense);
}

document.getElementById('monthSelect').value = new Date().getMonth();

const yearSelect = document.getElementById('yearSelect');
const currentYear = new Date().getFullYear();

for( let y = currentYear - 5; y <= currentYear + 5; y++) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    if (y === currentYear) { option.selected = true; }
    yearSelect.appendChild(option);
}

update();