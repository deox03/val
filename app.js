const blok1 = document.querySelectorAll(".blok1 .val");
const blok2 = document.querySelectorAll(".blok2 .val");
const block1value = document.querySelector(".blok1 .value");
const block2value = document.querySelector(".blok2 .value");
const block1deyer = document.querySelector(".blok1 .deyer");
const block2deyer = document.querySelector(".blok2 .deyer");
let fromcurrency = "RUB";
let tocurrency = "USD";
let fromvalue = parseFloat(block1value.value) || 0;
let tovalue = parseFloat(block2value.value) || 0;
let sondeysime = "from";
const apiKey = "12ab51b9e85f151198e6d3ab";
function setActive(buttons, className, clickedBtn) {
  buttons.forEach(btn => btn.classList.remove(className));
  clickedBtn.classList.add(className);
}
async function mezenne(ceviren, cevrilen) {
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${ceviren}`);
  const data = await res.json();
  return data.conversion_rates[cevrilen];
}
function temizleRaqem(deyer) {
  return parseFloat(deyer.toFixed(5)).toString();
}

async function cevirme() {
  if (fromcurrency === tocurrency) {
    if (sondeysime === "from") {
      tovalue = fromvalue;
      block2value.value = temizleRaqem(tovalue);
    } else {
      fromvalue = tovalue;
      block1value.value = temizleRaqem(fromvalue);
    }

    block1deyer.textContent = `1 ${fromcurrency} = 1 ${tocurrency}`;
    block2deyer.textContent = `1 ${tocurrency} = 1 ${fromcurrency}`;
    
    return;
  }

  if (sondeysime === "from") {
    const qiymet = await mezenne(fromcurrency, tocurrency);
    tovalue = fromvalue * qiymet;
    block2value.value = temizleRaqem(tovalue);
    block1deyer.textContent = `1 ${fromcurrency} = ${temizleRaqem(qiymet)} ${tocurrency}`;
    block2deyer.textContent = `1 ${tocurrency} = ${temizleRaqem(1 / qiymet)} ${fromcurrency}`;
  } else {
    const qiymet = await mezenne(tocurrency, fromcurrency);
    fromvalue = tovalue * qiymet;
    block1value.value = temizleRaqem(fromvalue);
    block1deyer.textContent = `1 ${fromcurrency} = ${temizleRaqem(1 / qiymet)} ${tocurrency}`;
    block2deyer.textContent = `1 ${tocurrency} = ${temizleRaqem(qiymet)} ${fromcurrency}`;
  }
}


blok2.forEach(btn => {
  btn.addEventListener("click", () => {
    tocurrency = btn.textContent;
    setActive(blok2, "aktiv2", btn);
    tovalue = parseFloat(block2value.value) || 0;
    cevirme();
  });
});
blok1.forEach(btn => {
  btn.addEventListener("click", () => {
    fromcurrency = btn.textContent;
    setActive(blok1, "aktiv1", btn);
    fromvalue = parseFloat(block1value.value) || 0;
    cevirme();
  });
});
block1value.addEventListener("input", () => {
  fromvalue = parseFloat(block1value.value) || 0;
  sondeysime = "from";
  cevirme();
});

block2value.addEventListener("input", () => {
  tovalue = parseFloat(block2value.value) || 0;
  sondeysime = "to";
  cevirme();
});
window.addEventListener("DOMContentLoaded", () => {
  setActive(blok1, "aktiv1", document.querySelector(".blok1 .val.aktiv1"));
  setActive(blok2, "aktiv2", document.querySelector(".blok2 .val.aktiv2"));
  cevirme();
});

const internetStatus = document.getElementById("internet-status");

function updateInternetStatus() {
  if (navigator.onLine) {
    internetStatus.classList.add("hidden");
  } else {
    internetStatus.classList.remove("hidden");
  }
}
window.addEventListener("online", updateInternetStatus);
window.addEventListener("offline", updateInternetStatus);
updateInternetStatus();
