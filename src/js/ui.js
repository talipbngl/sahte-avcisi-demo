function qs(id) {
  return document.getElementById(id);
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  qs(screenId).classList.add("active");
}

function updateStats() {
  qs("money").textContent = state.money + " TL";
  qs("reputation").textContent = state.reputation;
  qs("dayNumber").textContent = state.day;
  qs("streakNumber").textContent = state.correctStreak;

  if (state.money < 0) {
    qs("money").classList.add("debt-warning");
  } else {
    qs("money").classList.remove("debt-warning");
  }

  const totalCases = cases.length;
  const visibleCase = Math.min(state.currentCaseIndex + 1, totalCases);

  qs("caseNumber").textContent = visibleCase + " / " + totalCases;
}

function updateOfficePanel() {
  if (!qs("officeDay")) return;

  qs("officeDay").textContent = state.day + ". Gün";
  qs("nextRentDay").textContent = getNextRentDay() + ". gün sonunda";
  qs("rentAmount").textContent = settings.rentAmount + " TL";
  qs("totalRentPaid").textContent = state.totalRentPaid + " TL";
}

function updateUpgradePanel() {
  updateSingleUpgrade("serial", "upgradeSerialStatus", "upgradeSerialBtn");
  updateSingleUpgrade("magnifier", "upgradeMagnifierStatus", "upgradeMagnifierBtn");
  updateSingleUpgrade("invoice", "upgradeInvoiceStatus", "upgradeInvoiceBtn");
}

function updateSingleUpgrade(type, statusId, buttonId) {
  const statusElement = qs(statusId);
  const buttonElement = qs(buttonId);

  if (!statusElement || !buttonElement) return;

  if (state.upgrades[type]) {
    statusElement.textContent = "Aktif";
    buttonElement.textContent = "Alındı";
    buttonElement.disabled = true;
  } else {
    statusElement.textContent = "Alınmadı";
    buttonElement.textContent = upgradePrices[type] + " TL'ye Al";
    buttonElement.disabled = false;
  }
}

function loadCaseUI(currentCase) {
  qs("customerAvatar").textContent = currentCase.avatar;
  qs("customerName").textContent = currentCase.customerName;
  qs("customerStory").textContent = currentCase.story;
  qs("productName").textContent = currentCase.productName;
  qs("productClaim").textContent = currentCase.claim;
  qs("productValue").textContent = "İddia edilen değer: " + currentCase.value + " TL";
  qs("warningText").textContent = "";

  qs("evidenceList").innerHTML = "<li>Henüz inceleme yapılmadı.</li>";

  renderToolButtons();
  updateAnalysisPanel();
  updateOfficePanel();
  updateUpgradePanel();
  updateStats();
}

function renderToolButtons() {
  const toolButtons = qs("toolButtons");
  const currentCase = cases[state.currentCaseIndex];

  toolButtons.innerHTML = "";

  currentCase.tools.forEach(tool => {
    const button = document.createElement("button");

    const alreadyUsed = state.collectedEvidence.some(evidence => evidence.id === tool.id);
    const limitReached = state.collectedEvidence.length >= settings.maxEvidencePerCase;

    button.className = "tool-button";
    button.disabled = alreadyUsed || limitReached;

    button.innerHTML = `
      <span>${tool.name}</span>
      <small>${tool.cost} TL</small>
    `;

    button.onclick = () => inspect(tool.id);

    toolButtons.appendChild(button);
  });
}

function renderEvidence() {
  const evidenceList = qs("evidenceList");

  evidenceList.innerHTML = "";

  state.collectedEvidence.forEach(evidence => {
    const li = document.createElement("li");

    const upgradeText = evidence.upgraded
      ? " Geliştirilmiş ekipmanla daha detaylı incelendi."
      : "";

    li.textContent = getPlayerFacingEvidenceText(evidence) + upgradeText;

    evidenceList.appendChild(li);
  });
}

function getPlayerFacingEvidenceText(evidence) {
  const impact = Math.abs(evidence.fakeImpact);

  if (impact >= 30 && evidence.fakeImpact > 0) {
    return evidence.name + ": Güçlü bir tutarsızlık yakalandı ama bunun nedeni sahtecilik, tamir, değişim veya normal üretim farkı olabilir.";
  }

  if (impact >= 30 && evidence.fakeImpact < 0) {
    return evidence.name + ": Ürünün iddiasını destekleyen güçlü işaretler var ama tek başına kesin karar verdirmez.";
  }

  if (impact >= 15 && evidence.fakeImpact > 0) {
    return evidence.name + ": Bazı detaylar soru işareti oluşturuyor. Bu bulgu tek başına yeterli değil.";
  }

  if (impact >= 15 && evidence.fakeImpact < 0) {
    return evidence.name + ": Bazı bilgiler olumlu görünüyor. Yine de başka testlerle desteklenmesi gerekir.";
  }

  return evidence.name + ": Net olmayan, yoruma açık bir sonuç verdi.";
}

function updateAnalysisPanel() {
  qs("fakeChance").textContent = getSuspicionText();
  qs("riskLevel").textContent = getRiskLevel();
  qs("evidenceCounter").textContent =
    state.collectedEvidence.length + " / " + settings.maxEvidencePerCase;
  qs("confidenceLevel").textContent = getConfidenceLevel(state.collectedEvidence.length);
}

function showWarning(message) {
  qs("warningText").textContent = message;
}

function showEventBanner(event) {
  const eventBox = qs("eventBox");

  if (!event) {
    eventBox.classList.add("hidden");
    return;
  }

  qs("eventTitle").textContent = event.title;
  qs("eventText").textContent = event.text;

  eventBox.classList.remove("hidden");
}

function renderResultDetails(playerAnswer, correctAnswer, rewardData) {
  const moneyText = rewardData.moneyChange > 0
    ? "+" + rewardData.moneyChange + " TL"
    : rewardData.moneyChange + " TL";

  const reputationText = rewardData.reputationChange > 0
    ? "+" + rewardData.reputationChange
    : rewardData.reputationChange;

  qs("resultDetails").innerHTML = `
    <p><strong>Senin kararın:</strong> ${answerToText(playerAnswer)}</p>
    <p><strong>Doğru karar:</strong> ${answerToText(correctAnswer)}</p>
    <p><strong>Karar tarzı:</strong> ${rewardData.riskLabel}</p>
    <p><strong>Toplanan kanıt:</strong> ${state.collectedEvidence.length} / ${settings.maxEvidencePerCase}</p>
    <p><strong>İnceleme masrafı:</strong> ${getTotalInspectionCost()} TL</p>
    <p><strong>Gizli şüphe skoru:</strong> %${state.fakeChance}</p>
    <p><strong>Risk bonusu:</strong> ${rewardData.riskBonus} TL</p>
    <p><strong>Seri bonusu:</strong> ${rewardData.streakBonus} TL</p>
    <p><strong>Doğru karar serisi:</strong> ${state.correctStreak}</p>
    <p><strong>Aktif ofis geliştirmesi:</strong> ${getActiveUpgradeCount()} / 3</p>
    <p><strong>Karar para etkisi:</strong> ${moneyText}</p>
    <p><strong>İtibar değişimi:</strong> ${reputationText}</p>
  `;
}

function renderReview(review) {
  if (!review) {
    qs("reviewBox").innerHTML = "";
    return;
  }

  qs("reviewBox").innerHTML = `
    <h3>Müşteri Yorumu</h3>
    <p class="review-stars">${"★".repeat(review.stars)}${"☆".repeat(5 - review.stars)}</p>
    <p>${review.text}</p>
  `;
}

function renderExpenseScreen(paidAmount, debtAmount, rentMessage) {
  qs("expenseTitle").textContent = "Ofis Kirası Günü";

  qs("expenseDetails").innerHTML = `
    <p><strong>Gün:</strong> ${state.day}. gün sonu</p>
    <p><strong>Kira tutarı:</strong> ${settings.rentAmount} TL</p>
    <p><strong>Ödenen tutar:</strong> ${paidAmount} TL</p>
    <p><strong>Borca yazılan:</strong> ${debtAmount} TL</p>
    <p><strong>Güncel para:</strong> ${state.money} TL</p>
    <p><strong>Güncel itibar:</strong> ${state.reputation}</p>
  `;

  qs("expenseText").textContent = rentMessage;
}