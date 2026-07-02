
const html = document.documentElement;

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';

setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

function setTheme(theme){
  html.setAttribute('data-theme', theme);

  localStorage.setItem('theme', theme);

  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const API_URL = 'https://api.binance.com/api/v3/ticker/price';

let latestPrices = {};

const loadBtn = document.getElementById('loadBtn');

const ratesGrid = document.getElementById('ratesGrid');

const info = document.getElementById('info');

const fromCurrency = document.getElementById('fromCurrency');

const toCurrency = document.getElementById('toCurrency');

const pairFrom = document.getElementById('pairFrom');

const pairTo = document.getElementById('pairTo');

const savePairBtn = document.getElementById('savePairBtn');

const savedPairs = document.getElementById('savedPairs');

const amountInput = document.getElementById('amountInput');

const convertBtn = document.getElementById('convertBtn');

const convertResult = document.getElementById('convertResult');

let selectedPairs =
  JSON.parse(
    localStorage.getItem(
      'savedPairs'
    )
  ) || [
    {
      from:'BTC',
      to:'USDT'
    },
    {
      from:'ETH',
      to:'USDT'
    },
    {
      from:'SOL',
      to:'USDT'
    }
  ];

async function loadRates(){

  try{

    const response =
      await fetch(API_URL);

    const data =
      await response.json();

    latestPrices = {};

    data.forEach(item=>{

      if(
        item.symbol.endsWith('USDT')
      ){

        const coin =
          item.symbol.replace(
            'USDT',
            ''
          );

        latestPrices[coin] =
          Number(item.price);

      }

    });

    latestPrices['USDT'] = 1;

    fillCurrencyLists();

    renderRates();

    renderSavedPairs();

    updateConverter();

    info.innerHTML =
      `
        Монет:
        <strong>
          ${Object.keys(latestPrices).length}
        </strong>
      `;

  }catch(error){

    console.error(error);

    ratesGrid.innerHTML =
      `
        <div class="loading">
          Ошибка Binance API
        </div>
      `;

  }

}

function fillCurrencyLists(){

  const currencies =
    Object.keys(latestPrices)
      .sort();

  const options =
    currencies.map(currency => `
      <option value="${currency}">
        ${currency}
      </option>
    `).join('');

  [
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

  fromCurrency.value =
    'ETH';

  toCurrency.value =
    'USDT';

}

function renderRates(){

  ratesGrid.innerHTML =
    '';

  Object.entries(latestPrices)
    .sort((a,b)=>
      b[1] - a[1]
    )
    .forEach(([coin,price])=>{

      const card =
        document.createElement('div');

      card.className =
        'rate-card';

      card.innerHTML = `
        <div class="currency">
          ${coin}/USDT
        </div>

        <div class="value">
          ${formatPrice(price)}
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
    !latestPrices[from] ||
    !latestPrices[to]
  ) return;

  const usdtValue =
    amount * latestPrices[from];

  const result =
    usdtValue / latestPrices[to];

  convertResult.innerHTML =
    `
      <strong>
        ${amount}
        ${from}
      </strong>
      =
      <strong>
        ${result.toFixed(6)}
        ${to}
      </strong>
    `;

}

function renderSavedPairs(){

  savedPairs.innerHTML =
    '';

  selectedPairs.forEach(
    (pair,index)=>{

    const fromPrice =
      latestPrices[pair.from];

    const toPrice =
      latestPrices[pair.to];

    if(
      !fromPrice ||
      !toPrice
    ) return;

    const result =
      fromPrice / toPrice;

    const card =
      document.createElement('div');

    card.className =
      'rate-card';

    card.innerHTML = `
      <div class="currency">
        ${pair.from}
        /
        ${pair.to}
      </div>

      <div class="value">
        ${result.toFixed(6)}
      </div>

      <div
        style="
          margin-top:6px;
          font-size:11px;
          color:var(--muted);
        "
      >
        ${formatPrice(fromPrice)} USDT
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

function formatPrice(price){

  if(price >= 1000)
    return price.toFixed(2);

  if(price >= 1)
    return price.toFixed(4);

  return price.toFixed(8);

}

loadBtn.addEventListener(
  'click',
  loadRates
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

async function updateSavedPairsOnly(){

  try{

    const response =
      await fetch(API_URL);

    const data =
      await response.json();

    data.forEach(item=>{

      if(
        item.symbol.endsWith('USDT')
      ){

        const coin =
          item.symbol.replace(
            'USDT',
            ''
          );

        latestPrices[coin] =
          Number(item.price);

      }

    });

    latestPrices['USDT'] = 1;

    renderSavedPairs();

    updateConverter();

  }catch(error){

    console.error(error);

  }

}

loadRates();

/* закрепленные пары —
   каждые 5 секунд */

setInterval(
  updateSavedPairsOnly,
  5000
);

/* полный список —
   каждые 5 минут */

setInterval(
  loadRates,
  300000
);
