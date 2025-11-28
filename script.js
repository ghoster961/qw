const resultEl = document.getElementById("result");
const summaryEl = document.getElementById("summary");
const yearEl = document.getElementById("year");
const assistantToggle = document.getElementById("assistant-toggle");
const assistantPanel = document.getElementById("assistant-panel");
const assistantClose = document.getElementById("assistant-close");
const assistantForm = document.getElementById("assistant-form");
const assistantInput = document.getElementById("assistant-message");
const chatLog = document.getElementById("chat-log");

const calculateBtn = document.getElementById("calculate-btn");
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function computeFutureValue(principal, monthly, ratePercent, years) {
  const r = clamp(ratePercent, 0, 25) / 100 / 12;
  const n = clamp(years, 1, 60) * 12;
  let future = principal * Math.pow(1 + r, n);
  if (r === 0) {
    future += monthly * n;
  } else {
    future += monthly * ((Math.pow(1 + r, n) - 1) / r);
  }
  return future;
}

function handleProjection() {
  const initial = Number(document.getElementById("initial").value) || 0;
  const monthly = Number(document.getElementById("monthly").value) || 0;
  const rate = Number(document.getElementById("rate").value) || 0;
  const years = Number(document.getElementById("years").value) || 1;

  const futureValue = computeFutureValue(initial, monthly, rate, years);
  resultEl.textContent = formatter.format(futureValue);

  const contributions = initial + monthly * years * 12;
  const growth = futureValue - contributions;
  summaryEl.textContent = `Total contributions ${formatter.format(
    contributions
  )} • Projected growth ${formatter.format(growth)}`;
}

function toggleAssistant(forceOpen) {
  if (!assistantPanel) return;
  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : !assistantPanel.classList.contains("open");
  assistantPanel.classList.toggle("open", shouldOpen);
  if (shouldOpen) {
    assistantInput?.focus();
  }
}

function appendMessage(role, text) {
  if (!chatLog) return;
  const bubble = document.createElement("p");
  bubble.className = role;
  bubble.textContent = text;
  chatLog.appendChild(bubble);
  chatLog.scrollTo({
    top: chatLog.scrollHeight,
    behavior: "smooth",
  });
}

function buildAssistantReply(message) {
  const normalized = message.toLowerCase();
  if (normalized.includes("risk")) {
    return "Current risk signals favor a neutral stance—vol remains contained while credit spreads hold near cycle tights.";
  }
  if (normalized.includes("inflation")) {
    return "Inflation breakevens keep drifting lower; we model CPI easing toward 2.4% over the next 12 months.";
  }
  if (normalized.includes("crypto")) {
    return "Digital assets trade in lockstep with liquidity gauges. Consider sizing crypto exposure below 5% of total risk.";
  }
  if (normalized.includes("stock") || normalized.includes("equity")) {
    return "Equities lean constructive: breadth is improving and earnings revisions turned positive for the first time since 2022.";
  }
  return "I can brief you on growth, rates, or positioning. Ask about risk budgets, asset classes, or macro drivers.";
}

function handleAssistantSubmit(event) {
  event.preventDefault();
  const text = assistantInput?.value.trim();
  if (!text) return;
  appendMessage("user", text);
  assistantInput.value = "";

  setTimeout(() => {
    appendMessage("bot", buildAssistantReply(text));
  }, 400);
}

calculateBtn?.addEventListener("click", handleProjection);
handleProjection();

assistantToggle?.addEventListener("click", () => toggleAssistant());
assistantClose?.addEventListener("click", () => toggleAssistant(false));
assistantForm?.addEventListener("submit", handleAssistantSubmit);

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

