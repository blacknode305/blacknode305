const buyMarginInput = document.getElementById("buyMarginInput");
const buyPriceInput = document.getElementById("buyPriceInput");
const buyPairInput = document.getElementById("buyPairInput");

const addBuyBtn = document.getElementById("addBuyBtn");

const buyTableBody = document.getElementById("buyTableBody");

let buys = JSON.parse(localStorage.getItem("buys")) || [];

addBuyBtn.addEventListener("click", () => {

    const margin = Number(buyMarginInput.value);
    const buyPrice = Number(buyPriceInput.value);
    const pair = buyPairInput.value.trim().toUpperCase();

    if (!margin || !buyPrice || !pair) {
        alert("Заполните все поля");
        return;
    }

    buys.push({

        id: Date.now(),

        pair,

        margin,

        buyPrice,

        quantity: margin / buyPrice,

        currentPrice: buyPrice,

        profitUsd: 0,

        profitPercent: 0,

        updatedAt: ""

    });

    saveBuys();

    renderTable();

    updatePrices();

    buyMarginInput.value = "";
    buyPriceInput.value = "";
    buyPairInput.value = "";

});

function saveBuys() {

    localStorage.setItem(
        "buys",
        JSON.stringify(buys)
    );

}

function updatePortfolioSummary() {

    let totalMargin = 0;
    let totalValue = 0;
    let totalCoins = 0;

    buys.forEach((buy) => {

        totalMargin += buy.margin;
        totalValue += buy.quantity * buy.currentPrice;
        totalCoins += buy.quantity;

    });

    const totalProfit = totalValue - totalMargin;

    const totalPercent =
        totalMargin > 0
            ? (totalProfit / totalMargin) * 100
            : 0;

    document.getElementById("totalMargin").textContent =
        "$" + totalMargin.toFixed(2);

    document.getElementById("totalValue").textContent =
        "$" + totalValue.toFixed(2);

    document.getElementById("totalProfit").textContent =
        "$" + totalProfit.toFixed(2);

    document.getElementById("totalPercent").textContent =
        totalPercent.toFixed(2) + "%";

    document.getElementById("totalCoins").textContent =
        totalCoins.toFixed(6);

}

function renderTable() {

    buyTableBody.innerHTML = "";

    buys.forEach((buy) => {

        buyTableBody.innerHTML += `

            <tr>

                <td>${buy.pair}</td>

                <td>${buy.margin.toFixed(2)}</td>

                <td>${buy.buyPrice.toFixed(2)}</td>

                <td>${buy.quantity.toFixed(6)}</td>

                <td>${buy.currentPrice.toFixed(2)}</td>

                <td>${(buy.currentPrice - buy.buyPrice).toFixed(2)}</td>

                <td>${buy.profitUsd.toFixed(2)}</td>

                <td>${buy.profitPercent.toFixed(2)}%</td>

                <td>${buy.updatedAt}</td>

                <td>
                    <button onclick="removeBuy(${buy.id})">
                        ✖
                    </button>
                </td>

            </tr>

        `;

    });
    
    updatePortfolioSummary();
}

function removeBuy(id) {

    buys = buys.filter((buy) => buy.id !== id);

    saveBuys();

    renderTable();

}

async function getCurrentPrice(symbol) {

    try {

        const response = await fetch(
            `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        );

        if (!response.ok) {
            throw new Error("Ошибка Binance API");
        }

        const data = await response.json();

        return Number(data.price);

    } catch (error) {

        console.error(symbol, error);

        return null;

    }

}

async function updatePrices() {

    for (const buy of buys) {

        const currentPrice = await getCurrentPrice(buy.pair);

        if (currentPrice === null) continue;

        buy.currentPrice = currentPrice;

        const positionValue = buy.quantity * currentPrice;

        buy.profitUsd = positionValue - buy.margin;

        buy.profitPercent =
            ((currentPrice - buy.buyPrice) / buy.buyPrice) * 100;

        buy.updatedAt = new Date().toLocaleTimeString();

    }

    saveBuys();

    renderTable();

}

renderTable();

updatePrices();

setInterval(() => {

    updatePrices();

}, 3000);

const ws = new WebSocket(
"wss://stream.binance.com:9443/ws/ethusdt@ticker"
);

ws.onmessage = (event) => {

    const data = JSON.parse(event.data);

    const price = parseFloat(data.c);

    // document.getElementById("price").innerHTML = "ETHUSDT: " + price;

    // Простейший пример
    if(price > 1900){
        document.getElementById("signal").innerHTML = "↑ LONG";
    }else{
        document.getElementById("signal").innerHTML = "↓ SHORT";
    }

};