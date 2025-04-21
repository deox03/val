const blok1Btns = document.querySelectorAll(".blok1 .val");
const blok2Btns = document.querySelectorAll(".blok2 .val");

const blok1Input = document.querySelector(".blok1 .value");
const blok2Input = document.querySelector(".blok2 .value");

const blok1Info = document.querySelector(".blok1 .deyer");
const blok2Info = document.querySelector(".blok2 .deyer");

let fromCurrency = "RUB";
let toCurrency = "USD";

let fromAmount = parseFloat(blok1Input.value);
let toAmount = parseFloat(blok2Input.value);

let lastEdited = "from"; // hansı tərəfdə yazılıbsa onu əsas götürürük

const apiKey = "12ab51b9e85f151198e6d3ab";

function setActive(buttons, className, clickedBtn) {
  buttons.forEach(btn => btn.classList.remove(className));
  clickedBtn.classList.add(className);
}

async function fetchRate(base, target) {
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`);
  const data = await res.json();
  return data.conversion_rates[target];
}

async function convert() {
  if (fromCurrency === toCurrency) {
    if (lastEdited === "from") {
      toAmount = fromAmount;
      blok2Input.value = toAmount.toFixed(2);
    } else {
      fromAmount = toAmount;
      blok1Input.value = fromAmount.toFixed(2);
    }
    blok1Info.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
    blok2Info.textContent = `1 ${toCurrency} = 1 ${fromCurrency}`;
    return;
  }

  if (lastEdited === "from") {
    const rate = await fetchRate(fromCurrency, toCurrency);
    toAmount = fromAmount * rate;
    blok2Input.value = toAmount.toFixed(2);
    blok1Info.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    blok2Info.textContent = `1 ${toCurrency} = ${(1 / rate).toFixed(4)} ${fromCurrency}`;
  } else {
    const rate = await fetchRate(toCurrency, fromCurrency);
    fromAmount = toAmount * rate;
    blok1Input.value = fromAmount.toFixed(2);
    blok2Info.textContent = `1 ${toCurrency} = ${rate.toFixed(4)} ${fromCurrency}`;
    blok1Info.textContent = `1 ${fromCurrency} = ${(1 / rate).toFixed(4)} ${toCurrency}`;
  }
}

// Valyuta düymələri
blok1Btns.forEach(btn => {
  btn.addEventListener("click", () => {
    fromCurrency = btn.textContent;
    setActive(blok1Btns, "aktiv1", btn);
    fromAmount = parseFloat(blok1Input.value) || 0;
    convert();
  });
});

blok2Btns.forEach(btn => {
  btn.addEventListener("click", () => {
    toCurrency = btn.textContent;
    setActive(blok2Btns, "aktiv2", btn);
    toAmount = parseFloat(blok2Input.value) || 0;
    convert();
  });
});

// Input yazılarkən dəyişiklik
blok1Input.addEventListener("input", () => {
  fromAmount = parseFloat(blok1Input.value) || 0;
  lastEdited = "from";
  convert();
});

blok2Input.addEventListener("input", () => {
  toAmount = parseFloat(blok2Input.value) || 0;
  lastEdited = "to";
  convert();
});

// Sayt yüklənəndə
window.addEventListener("DOMContentLoaded", () => {
  setActive(blok1Btns, "aktiv1", document.querySelector(".blok1 .val.aktiv1"));
  setActive(blok2Btns, "aktiv2", document.querySelector(".blok2 .val.aktiv2"));
  convert();
});
