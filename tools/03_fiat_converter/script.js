const html =
  document.documentElement;

const themeToggle =
  document.getElementById('themeToggle');

const savedTheme =
  localStorage.getItem('theme') || 'dark';

setTheme(savedTheme);

themeToggle.addEventListener('click',()=>{

  const current =
    html.getAttribute('data-theme');

  const next =
    current === 'dark'
      ? 'light'
      : 'dark';

  setTheme(next);

});

function setTheme(theme){

  html.setAttribute(
    'data-theme',
    theme
  );

  localStorage.setItem(
    'theme',
    theme
  );

  themeToggle.textContent =
    theme === 'dark'
      ? '☀️'
      : '🌙';

}

const API_URL =
  'https://cdn.moneyconvert.net/api/latest.json';

let latestRates = {};

const baseCurrency =
  document.getElementById('baseCurrency');

const loadBtn =
  document.getElementById('loadBtn');

const ratesGrid =
  document.getElementById('ratesGrid');

const info =
  document.getElementById('info');

const fromCurrency =
  document.getElementById('fromCurrency');

const toCurrency =
  document.getElementById('toCurrency');

const pairFrom =
  document.getElementById('pairFrom');

const pairTo =
  document.getElementById('pairTo');

const savePairBtn =
  document.getElementById('savePairBtn');

const savedPairs =
  document.getElementById('savedPairs');

const amountInput =
  document.getElementById('amountInput');

const convertBtn =
  document.getElementById('convertBtn');

const convertResult =
  document.getElementById('convertResult');

let selectedPairs =
  JSON.parse(
    localStorage.getItem(
      'savedPairs'
    )
  ) || [
    {
      from:'USD',
      to:'KZT'
    },
    {
      from:'EUR',
      to:'USD'
    }
  ];

async function loadRates(){

  ratesGrid.innerHTML =
    `<div class="loading">
      Загрузка...
    </div>`;

  try{

    const response =
      await fetch(API_URL);

    const data =
      await response.json();

    latestRates =
      data.rates;

    fillCurrencyLists();

    renderRates();

    renderSavedPairs();

    updateConverter();

    info.innerHTML =
      `
        Валют:
        <strong>
          ${Object.keys(latestRates).length}
        </strong>
      `;

  }catch(error){

    console.error(error);

    ratesGrid.innerHTML =
      `<div class="loading">
        Ошибка загрузки
      </div>`;

  }

}

function fillCurrencyLists(){

  const currencies =
    Object.keys(latestRates)
      .sort();

  const options =
    currencies.map(currency => `
      <option value="${currency}">
        ${currency}
      </option>
    `).join('');

  [
    baseCurrency,
    fromCurrency,
    toCurrency,
    pairFrom,
    pairTo
  ].forEach(select => {

    if(select.dataset.loaded)
      return;

    select.innerHTML =
      options;

    select.dataset.loaded =
      'true';

  });

  baseCurrency.value =
    'USD';

  fromCurrency.value =
    'USD';

  toCurrency.value =
    'KZT';

}

function renderRates(){

  ratesGrid.innerHTML =
    '';

  const base =
    baseCurrency.value;

  const baseRate =
    latestRates[base];

  const converted = {};

  Object.entries(latestRates)
    .forEach(([currency,value])=>{

      converted[currency] =
        value / baseRate;

    });

  Object.entries(converted)
    .sort((a,b)=>
      a[0].localeCompare(b[0])
    )
    .forEach(([currency,value])=>{

      const card =
        document.createElement('div');

      card.className =
        'rate-card';

      card.innerHTML = `
        <div class="currency">
          ${currency}
        </div>

        <div class="value">
          ${value.toFixed(4)}
        </div>
      `;

      ratesGrid.appendChild(card);

    });

}

function updateConverter(){

  const amount =
    Number(
      amountInput.value || 0
    );

  const from =
    fromCurrency.value;

  const to =
    toCurrency.value;

  if(
    !latestRates[from] ||
    !latestRates[to]
  ) return;

  const usdValue =
    amount / latestRates[from];

  const result =
    usdValue * latestRates[to];

  convertResult.innerHTML =
    `
      <strong>
        ${amount}
        ${from}
      </strong>
      =
      <strong>
        ${result.toFixed(2)}
        ${to}
      </strong>
    `;

}

function renderSavedPairs(){

  savedPairs.innerHTML =
    '';

  selectedPairs.forEach(
    (pair,index)=>{

    const fromRate =
      latestRates[pair.from];

    const toRate =
      latestRates[pair.to];

    if(
      !fromRate ||
      !toRate
    ) return;

    const result =
      toRate / fromRate;

    const card =
      document.createElement('div');

    card.className =
      'rate-card';

    card.innerHTML = `
      <div class="currency">
        ${pair.from}
        →
        ${pair.to}
      </div>

      <div class="value">
        ${result.toFixed(4)}
      </div>

      <button
        class="btn"
        style="
          margin-top:8px;
          width:100%;
          padding:8px;
          font-size:12px;
        "
        onclick="removePair(${index})"
      >
        Удалить
      </button>
    `;

    savedPairs.appendChild(card);

  });

}

function removePair(index){

  selectedPairs.splice(
    index,
    1
  );

  localStorage.setItem(
    'savedPairs',
    JSON.stringify(
      selectedPairs
    )
  );

  renderSavedPairs();

}

loadBtn.addEventListener(
  'click',
  renderRates
);

baseCurrency.addEventListener(
  'change',
  renderRates
);

convertBtn.addEventListener(
  'click',
  updateConverter
);

fromCurrency.addEventListener(
  'change',
  updateConverter
);

toCurrency.addEventListener(
  'change',
  updateConverter
);

amountInput.addEventListener(
  'input',
  updateConverter
);

savePairBtn.addEventListener(
  'click',
  ()=>{

    const pair = {
      from:pairFrom.value,
      to:pairTo.value
    };

    const exists =
      selectedPairs.some(
        p =>
          p.from === pair.from &&
          p.to === pair.to
      );

    if(exists)
      return;

    selectedPairs.push(pair);

    localStorage.setItem(
      'savedPairs',
      JSON.stringify(
        selectedPairs
      )
    );

    renderSavedPairs();

  }
);

loadRates();

setInterval(
  loadRates,
  60000
);
