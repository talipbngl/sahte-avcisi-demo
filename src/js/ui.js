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
  qs("introAvatar").textContent = currentCase.avatar;
  qs("introCustomerName").textContent = currentCase.customerName;
  qs("introStory").textContent = currentCase.story;
  qs("introProductName").textContent = currentCase.productName;
  qs("introClaim").textContent = currentCase.claim;
  qs("introValue").textContent = "İddia edilen değer: " + currentCase.value + " TL";

  qs("activeCaseTitle").textContent = currentCase.productName;
  qs("warningText").textContent = "";

  qs("evidenceList").innerHTML = "<li>Henüz özel ipucu açılmadı.</li>";

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
      li.textContent = getUpgradedClueText(evidence);
    } else {
      li.textContent = getNormalClueText(evidence);
    }

    evidenceList.appendChild(li);
  });
}

function getNormalClueText(evidence) {
  if (evidence.fakeImpact > 0) {
    return (
      evidence.name +
      ": " +
      evidence.text +
      " Bu bulgu, ürün veya satıcı iddiasını zayıflatıyor; fakat tek başına kesin hüküm değildir."
    );
  }

  if (evidence.fakeImpact < 0) {
    return (
      evidence.name +
      ": " +
      evidence.text +
      " Bu bulgu, ürün veya satıcı iddiasını destekliyor; fakat tek başına tüm dosyayı kapatmaz."
    );
  }

  return (
    evidence.name +
    ": " +
    evidence.text +
    " Bu test belirgin bir tarafa ağırlık vermedi."
  );
}

function getUpgradedClueText(evidence) {
  const impact = Math.abs(evidence.fakeImpact);

  if (evidence.fakeImpact > 0 && impact >= 35) {
    return (
      evidence.name +
      ": " +
      evidence.text +
      " Gelişmiş analiz bu bulguyu kritik seviyede görüyor. Bu dosyada olumsuz ihtimal güçlü."
    );
  }

  if (evidence.fakeImpact > 0 && impact >= 20) {
    return (
      evidence.name +
      ": " +
      evidence.text +
      " Gelişmiş analiz bu bulguyu önemli bir uyarı olarak işaretliyor."
    );
  }

  if (evidence.fakeImpact > 0) {
    return (
      evidence.name +
      ": " +
      evidence.text +
      " Gelişmiş analiz hafif olumsuz sinyal verdi."
    );
  }

  if (evidence.fakeImpact < 0 && impact >= 35) {
    return (
      evidence.name +
      ": " +
      evidence.text +
      " Gelişmiş analiz bu bulguyu güçlü olumlu kanıt olarak değerlendiriyor."
    );
  }

  if (evidence.fakeImpact < 0 && impact >= 20) {
    return (
      evidence.name +
      ": " +
      evidence.text +
      " Gelişmiş analiz bu bulgunun dosyayı olumlu desteklediğini gösteriyor."
    );
  }

  if (evidence.fakeImpact < 0) {
    return (
      evidence.name +
      ": " +
      evidence.text +
      " Gelişmiş analiz hafif olumlu sinyal verdi."
    );
  }

  return (
    evidence.name +
    ": " +
    evidence.text +
    " Gelişmiş analiz net bir tarafa ağırlık vermedi."
  );
}

function updateAnalysisPanel() {
  const evidenceCounter = qs("evidenceCounter");
  const inspectionCost = qs("inspectionCost");

  if (evidenceCounter) {
    evidenceCounter.textContent =
      state.collectedEvidence.length + " / " + settings.maxEvidencePerCase;
  }

  if (inspectionCost) {
    inspectionCost.textContent = getTotalInspectionCost() + " TL";
  }
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