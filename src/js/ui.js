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
  renderPublicClues(currentCase.publicClues);
  clearSelections();
  hideNetworkBox();
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

    if (evidence.upgraded) {
      li.textContent = getUpgradedEvidenceText(evidence);
    } else {
      li.textContent = getBasicEvidenceText(evidence);
    }

    evidenceList.appendChild(li);
  });
}

function getBasicEvidenceText(evidence) {
  const impact = Math.abs(evidence.fakeImpact);

  if (impact >= 30 && evidence.fakeImpact > 0) {
    return evidence.name + ": Güçlü bir tutarsızlık yakalandı ama bunun nedeni sahtecilik, tamir, değişim veya normal üretim farkı olabilir.";
  }

  if (impact >= 30 && evidence.fakeImpact < 0) {
    return evidence.name + ": Ürünün iddiasını destekleyen güçlü işaretler var ama tek başına kesin karar verdirmez.";
  }

  if (impact >= 15 && evidence.fakeImpact > 0) {
    return evidence.name + ": Bazı detaylar soru işareti oluşturuyor.";
  }

  if (impact >= 15 && evidence.fakeImpact < 0) {
    return evidence.name + ": Bazı bilgiler olumlu görünüyor. Yine de başka testlerle desteklenmesi gerekir.";
  }

  return evidence.name + ": Net olmayan, yoruma açık bir sonuç verdi.";
}

function getUpgradedEvidenceText(evidence) {
  const impact = Math.abs(evidence.fakeImpact);

  if (impact >= 35 && evidence.fakeImpact > 0) {
    return evidence.name + ": Gelişmiş analiz sonucu ciddi tutarsızlık tespit edildi. Yüksek ihtimalle ürünün orijinallik iddiası sorunlu. Detay: " + evidence.text;
  }

  if (impact >= 35 && evidence.fakeImpact < 0) {
    return evidence.name + ": Gelişmiş analiz sonucu ürünün iddiasını güçlü şekilde destekleyen bulgular bulundu. Yüksek ihtimalle ürün güvenilir görünüyor. Detay: " + evidence.text;
  }

  if (impact >= 20 && evidence.fakeImpact > 0) {
    return evidence.name + ": Gelişmiş analiz sonucu orta-yüksek seviyede şüphe oluştu. Ürün sahte, değişmiş veya eksik beyan edilmiş olabilir. Detay: " + evidence.text;
  }

  if (impact >= 20 && evidence.fakeImpact < 0) {
    return evidence.name + ": Gelişmiş analiz sonucu olumlu işaretler ağır basıyor. Yine de tek başına kesin karar sayılmaz. Detay: " + evidence.text;
  }

  if (evidence.fakeImpact > 0) {
    return evidence.name + ": Gelişmiş analiz hafif bir şüphe gösteriyor. Karar için başka bulgu gerekebilir. Detay: " + evidence.text;
  }

  if (evidence.fakeImpact < 0) {
    return evidence.name + ": Gelişmiş analiz hafif olumlu sonuç verdi. Karar için başka bulgu gerekebilir. Detay: " + evidence.text;
  }

  return evidence.name + ": Gelişmiş analiz net bir tarafa işaret etmedi. Detay: " + evidence.text;
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

function renderResultDetails(playerAnswer, correctAnswer, playerProblem, correctProblem, rewardData) {
  const moneyText = rewardData.moneyChange > 0
    ? "+" + rewardData.moneyChange + " TL"
    : rewardData.moneyChange + " TL";

  const reputationText = rewardData.reputationChange > 0
    ? "+" + rewardData.reputationChange
    : rewardData.reputationChange;

  qs("resultDetails").innerHTML = `
    <p><strong>Senin kararın:</strong> ${answerToText(playerAnswer)}</p>
    <p><strong>Doğru karar:</strong> ${answerToText(correctAnswer)}</p>
    <p><strong>Seçtiğin ana problem:</strong> ${problemToText(playerProblem)}</p>
    <p><strong>Doğru ana problem:</strong> ${problemToText(correctProblem)}</p>
    <p><strong>Rapor kalitesi:</strong> ${rewardData.reportLabel}</p>
    <p><strong>Toplanan ipucu:</strong> ${state.collectedEvidence.length} / ${settings.maxEvidencePerCase}</p>
    <p><strong>İnceleme masrafı:</strong> ${getTotalInspectionCost()} TL</p>
    <p><strong>Gizli şüphe skoru:</strong> %${state.fakeChance}</p>
    <p><strong>Risk bonusu:</strong> ${rewardData.riskBonus} TL</p>
    <p><strong>Sebep bonusu:</strong> ${rewardData.problemBonus} TL</p>
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
function renderPublicClues(publicClues) {
  const list = qs("publicClueList");

  list.innerHTML = "";

  publicClues.forEach(clue => {
    const li = document.createElement("li");
    li.textContent = clue;
    list.appendChild(li);
  });
}

function clearSelections() {
  document.querySelectorAll(".decision-buttons button").forEach(button => {
    button.classList.remove("selected");
  });

  document.querySelectorAll(".problem-buttons button").forEach(button => {
    button.classList.remove("selected");
  });
}

function updateVerdictSelection() {
  document.querySelectorAll(".decision-buttons button").forEach(button => {
    button.classList.remove("selected");
  });

  if (state.selectedVerdict) {
    qs("verdict-" + state.selectedVerdict).classList.add("selected");
  }
}

function updateProblemSelection() {
  document.querySelectorAll(".problem-buttons button").forEach(button => {
    button.classList.remove("selected");
  });

  if (state.selectedProblem) {
    qs("problem-" + state.selectedProblem).classList.add("selected");
  }
}

function hideNetworkBox() {
  const box = qs("networkBox");

  if (!box) return;

  box.classList.add("hidden");
  box.innerHTML = "";
}

function showNetworkBox(title, text) {
  const box = qs("networkBox");

  box.innerHTML = `
    <h3>${title}</h3>
    <p>${text}</p>
  `;

  box.classList.remove("hidden");
}