const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (const currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

const updateExchangeRate = async () => {
  const amountInput = document.querySelector(".amount input");
  const raw = amountInput.value.trim();
  if (raw === "") {
    msg.innerText = "Enter amount";
    return;
  }
  let amtVal = parseFloat(raw);
  if (!Number.isFinite(amtVal) || amtVal <= 0) {
    msg.innerText = "Enter a positive amount";
    return;
  }
  msg.innerText = "Fetching rate...";
  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  const URL = `${BASE_URL}/currencies/${from}.json`;
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    const rate = data[from]?.[to];
    if (!Number.isFinite(rate)) {
      throw new Error("Invalid rate");
    }
    const finalAmount = (amtVal * rate).toFixed(4);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (e) {
    msg.innerText = "Unable to fetch rate. Please try again.";
  }
};

document.querySelector(".amount input").addEventListener("input", () => {
  updateExchangeRate();
});

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
