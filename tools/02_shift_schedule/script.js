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
let selectedDays = [];

let savedData =
    JSON.parse(
        localStorage.getItem(
            'calendarData'
        )
    ) || {
        shifts: {},
        colors: {}
    };

let shifts =
    savedData.shifts;

let shiftColors =
    savedData.colors;

function saveData() {

    localStorage.setItem(
        'calendarData',
        JSON.stringify({
            shifts,
            colors: shiftColors
        })
    );

}

function isValidHex(color) {

    return /^#([0-9A-F]{3}){1,2}$/i
        .test(color);

}

function generateCalendar() {

    const month =
        parseInt(
            document.getElementById('month').value
        );

    const year =
        parseInt(
            document.getElementById('year').value
        );

    const calendar =
        document.getElementById('calendar');

    calendar.innerHTML =
        '';

    const daysOfWeek = [
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс'
    ];

    daysOfWeek.forEach(day => {

        const header =
            document.createElement('div');

        header.className =
            'day-header';

        header.textContent =
            day;

        calendar.appendChild(header);

    });

    const firstDay =
        new Date(year, month, 1);

    let startDay =
        firstDay.getDay();

    if (startDay === 0)
        startDay = 7;

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    for (let i = 1; i < startDay; i++) {

        const empty =
            document.createElement('div');

        empty.className =
            'day empty';

        calendar.appendChild(empty);

    }

    for (let day = 1; day <= daysInMonth; day++) {

        const dayDiv =
            document.createElement('div');

        dayDiv.className =
            'day';

        dayDiv.textContent =
            day;

        dayDiv.onclick =
            () => toggleDay(day, dayDiv);

        const key =
            `${year}-${month}-${day}`;

        if (shifts[key]) {

            applyShiftColor(
                dayDiv,
                shifts[key]
            );

        }

        calendar.appendChild(dayDiv);

    }

    updateLegend();

}

function toggleDay(day, element) {

    const index =
        selectedDays.indexOf(day);

    if (index > -1) {

        selectedDays.splice(index, 1);

        element.classList.remove(
            'selected'
        );

    } else {

        selectedDays.push(day);

        element.classList.add(
            'selected'
        );

    }

    document.getElementById(
        'selectedDays'
    ).value =
        selectedDays.join(', ');

}

function assignShift() {

    const shiftType =
        document.getElementById(
            'shiftType'
        ).value.trim();

    const shiftColor =
        document.getElementById(
            'shiftColor'
        ).value.trim();

    const month =
        parseInt(
            document.getElementById(
                'month'
            ).value
        );

    const year =
        parseInt(
            document.getElementById(
                'year'
            ).value
        );

    if (
        !shiftType ||
        selectedDays.length === 0
    ) {

        alert(
            'Выберите дни и тип смены'
        );

        return;

    }

    if (!isValidHex(shiftColor)) {

        alert(
            'Введите HEX цвет'
        );

        return;

    }

    shiftColors[shiftType] =
        shiftColor;

    selectedDays.forEach(day => {

        const key =
            `${year}-${month}-${day}`;

        if (!shifts[key]) {

            shifts[key] = [];

        }

        if (
            !shifts[key].includes(
                shiftType
            )
        ) {

            shifts[key].push(
                shiftType
            );

        }

    });

    saveData();

    selectedDays = [];

    document.getElementById('selectedDays').value = '';
    document.getElementById('shiftType').value = '';

    document.getElementById(
        'shiftColor'
    ).value = '';

    generateCalendar();

}

function applyShiftColor(
    element,
    shiftList
) {

    if (shiftList.length === 1) {

        const shift =
            shiftList[0];

        element.style.background =
            shiftColors[shift] || '#666';

        element.style.color =
            'white';

    }

    else if (shiftList.length >= 2) {

        const shift1 =
            shiftList[0];

        const shift2 =
            shiftList[1];

        element.classList.add(
            'split'
        );

        element.style.setProperty(
            '--color1',
            shiftColors[shift1] || '#666'
        );

        element.style.setProperty(
            '--color2',
            shiftColors[shift2] || '#333'
        );

    }

}

function updateLegend() {

    const legend =
        document.getElementById(
            'legend'
        );

    legend.innerHTML =
        '';

    Object.keys(shiftColors)
        .forEach(type => {

            const item =
                document.createElement('div');

            item.className =
                'legend-item';

            const colorBox =
                document.createElement('div');

            colorBox.className =
                'color-box';

            colorBox.style.background =
                shiftColors[type];

            const text =
                document.createElement('div');

            text.innerHTML =
                `
        <strong>
          ${type}
        </strong>
        <br>
        <span style="color:var(--muted);font-size:12px;">
          ${shiftColors[type]}
        </span>
      `;

            item.appendChild(colorBox);

            item.appendChild(text);

            legend.appendChild(item);

        });

}

function exportData() {

    const data =
        JSON.stringify({
            shifts,
            colors: shiftColors
        }, null, 2);

    const blob =
        new Blob([data], {
            type: 'application/json'
        });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement('a');

    a.href =
        url;

    a.download =
        'calendar_shifts.json';

    a.click();

}

function importData(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function (e) {

            const imported =
                JSON.parse(
                    e.target.result
                );

            shifts =
                imported.shifts || {};

            shiftColors =
                imported.colors || {};

            saveData();

            generateCalendar();

        };

    reader.readAsText(file);

}

generateCalendar();