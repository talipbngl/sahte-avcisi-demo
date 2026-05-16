let money = 1000;
let reputation = 50;
let currentCaseIndex = 0;
let collectedEvidence = [];
let correctDecisions = 0;
let fakeChance = 50;

let day = 1;
let rentAmount = 300;
let rentInterval = 3;
let totalRentPaid = 0;

const maxEvidencePerCase = 3;

let upgrades = {
  serial: false,
  magnifier: false,
  invoice: false
};

const upgradePrices = {
  serial: 650,
  magnifier: 500,
  invoice: 600
};

function startGame() {
  money = 1000;
  reputation = 50;
  currentCaseIndex = 0;
  collectedEvidence = [];
  correctDecisions = 0;
  fakeChance = 50;

  day = 1;
  rentAmount = 300;
  rentInterval = 3;
  totalRentPaid = 0;

  upgrades = {
    serial: false,
    magnifier: false,
    invoice: false
  };

  updateStats();
  updateOfficePanel();
  updateUpgradePanel();
  loadCase();
  showScreen("caseScreen");
}

function restartGame() {
  startGame();
}

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

function updateStats() {
  const moneyElement = document.getElementById("money");

  moneyElement.textContent = money + " TL";

  if (money < 0) {
    moneyElement.classList.add("debt-warning");
  } else {
    moneyElement.classList.remove("debt-warning");
  }

  document.getElementById("reputation").textContent = reputation;
  document.getElementById("dayNumber").textContent = day;

  if (currentCaseIndex >= cases.length) {
    document.getElementById("caseNumber").textContent = cases.length + " / " + cases.length;
  } else {
    document.getElementById("caseNumber").textContent = (currentCaseIndex + 1) + " / " + cases.length;
  }
}

function updateOfficePanel() {
  const officeDayElement = document.getElementById("officeDay");

  if (!officeDayElement) {
    return;
  }

  document.getElementById("officeDay").textContent = day + ". Gün";
  document.getElementById("nextRentDay").textContent = getNextRentDay() + ". gün sonunda";
  document.getElementById("rentAmount").textContent = rentAmount + " TL";
  document.getElementById("totalRentPaid").textContent = totalRentPaid + " TL";
}

function getNextRentDay() {
  const cyclePosition = (day - 1) % rentInterval;
  const daysUntilRentDay = rentInterval - cyclePosition - 1;

  return day + daysUntilRentDay;
}

function loadCase() {
  collectedEvidence = [];
  fakeChance = 50;

  const currentCase = cases[currentCaseIndex];

  document.getElementById("customerAvatar").textContent = currentCase.avatar;
  document.getElementById("customerName").textContent = currentCase.customerName;
  document.getElementById("customerStory").textContent = currentCase.story;
  document.getElementById("productName").textContent = currentCase.productName;
  document.getElementById("productClaim").textContent = currentCase.claim;
  document.getElementById("productValue").textContent = "İddia edilen değer: " + currentCase.value + " TL";

  document.getElementById("warningText").textContent = "";

  const evidenceList = document.getElementById("evidenceList");
  evidenceList.innerHTML = "<li>Henüz inceleme yapılmadı.</li>";

  renderToolButtons();
  updateAnalysisPanel();
  updateOfficePanel();
  updateUpgradePanel();
  updateStats();
}

function renderToolButtons() {
  const toolButtons = document.getElementById("toolButtons");
  const currentCase = cases[currentCaseIndex];

  toolButtons.innerHTML = "";

  currentCase.tools.forEach(tool => {
    const button = document.createElement("button");
    button.className = "tool-button";

    const alreadyUsed = collectedEvidence.some(evidence => evidence.id === tool.id);
    const evidenceLimitReached = collectedEvidence.length >= maxEvidencePerCase;

    button.disabled = alreadyUsed || evidenceLimitReached;

    button.innerHTML = `
      <span>${tool.name}</span>
      <small>${tool.cost} TL</small>
    `;

    button.onclick = function () {
      inspect(tool.id);
    };

    toolButtons.appendChild(button);
  });
}

function buyUpgrade(type) {
  if (upgrades[type]) {
    showWarning("Bu geliştirmeyi zaten aldın kral.");
    return;
  }

  const price = upgradePrices[type];

  if (money < price) {
    showWarning("Bu geliştirme için yeterli paran yok. Borca girerek geliştirme alamazsın.");
    return;
  }

  money -= price;
  upgrades[type] = true;

  showWarning(getUpgradeName(type) + " satın alındı. Bu araç kategorisi artık daha güçlü analiz yapacak.");

  updateStats();
  updateOfficePanel();
  updateUpgradePanel();
}

function getUpgradeName(type) {
  if (type === "serial") {
    return "Seri No Veri Tabanı";
  }

  if (type === "magnifier") {
    return "Pro Büyüteç";
  }

  if (type === "invoice") {
    return "Fatura Doğrulama Yazılımı";
  }

  return "Geliştirme";
}

function updateUpgradePanel() {
  updateSingleUpgrade("serial", "upgradeSerialStatus", "upgradeSerialBtn");
  updateSingleUpgrade("magnifier", "upgradeMagnifierStatus", "upgradeMagnifierBtn");
  updateSingleUpgrade("invoice", "upgradeInvoiceStatus", "upgradeInvoiceBtn");
}

function updateSingleUpgrade(type, statusId, buttonId) {
  const statusElement = document.getElementById(statusId);
  const buttonElement = document.getElementById(buttonId);

  if (!statusElement || !buttonElement) {
    return;
  }

  if (upgrades[type]) {
    statusElement.textContent = "Aktif";
    buttonElement.textContent = "Alındı";
    buttonElement.disabled = true;
  } else {
    statusElement.textContent = "Alınmadı";
    buttonElement.textContent = upgradePrices[type] + " TL'ye Al";
    buttonElement.disabled = false;
  }
}

function inspect(toolId) {
  const currentCase = cases[currentCaseIndex];
  const selectedTool = currentCase.tools.find(tool => tool.id === toolId);

  if (!selectedTool) {
    showWarning("Bu inceleme aracı bulunamadı.");
    return;
  }

  const alreadyCollected = collectedEvidence.some(item => item.id === toolId);

  if (alreadyCollected) {
    showWarning("Bu incelemeyi zaten yaptın kral. Başka bir araç dene.");
    return;
  }

  if (collectedEvidence.length >= maxEvidencePerCase) {
    showWarning("Bu vaka için en fazla 3 inceleme yapabilirsin. Artık karar vermen gerekiyor.");
    return;
  }

  money -= selectedTool.cost;

  const effectiveImpact = calculateEffectiveImpact(selectedTool.category, selectedTool.fakeImpact);

  collectedEvidence.push({
    id: selectedTool.id,
    category: selectedTool.category,
    name: selectedTool.name,
    text: selectedTool.text,
    cost: selectedTool.cost,
    baseImpact: selectedTool.fakeImpact,
    fakeImpact: effectiveImpact,
    upgraded: upgrades[selectedTool.category]
  });

  fakeChance += effectiveImpact;
  fakeChance = clamp(fakeChance, 0, 100);

  showWarning("");

  renderEvidence();
  renderToolButtons();
  updateAnalysisPanel();
  updateStats();
}

function calculateEffectiveImpact(category, baseImpact) {
  if (!upgrades[category]) {
    return baseImpact;
  }

  const upgradeBonus = 8;

  if (baseImpact > 0) {
    return baseImpact + upgradeBonus;
  }

  if (baseImpact < 0) {
    return baseImpact - upgradeBonus;
  }

  return baseImpact;
}

function renderEvidence() {
  const evidenceList = document.getElementById("evidenceList");
  evidenceList.innerHTML = "";

  collectedEvidence.forEach(evidence => {
    const li = document.createElement("li");

    const upgradeText = evidence.upgraded
      ? " Geliştirilmiş ekipmanla analiz edildi."
      : "";

    li.textContent = evidence.name + ": " + evidence.text + upgradeText;

    evidenceList.appendChild(li);
  });
}

function updateAnalysisPanel() {
  document.getElementById("fakeChance").textContent = getSuspicionText();
  document.getElementById("riskLevel").textContent = getRiskLevel(fakeChance);
  document.getElementById("evidenceCounter").textContent = collectedEvidence.length + " / " + maxEvidencePerCase;
  document.getElementById("confidenceLevel").textContent = getConfidenceLevel(collectedEvidence.length);
}

function getSuspicionText() {
  if (collectedEvidence.length === 0) {
    return "Belirsiz";
  }

  if (collectedEvidence.length === 1) {
    return "Yetersiz Veri";
  }

  if (fakeChance >= 75) {
    return "Çok Şüpheli";
  }

  if (fakeChance >= 60) {
    return "Şüpheli";
  }

  if (fakeChance >= 40) {
    return "Kararsız";
  }

  if (fakeChance >= 25) {
    return "Güvenli Gibi";
  }

  return "Güvenli";
}

function getRiskLevel(chance) {
  if (collectedEvidence.length < 2) {
    return "Belirsiz";
  }

  if (chance >= 70) {
    return "Yüksek";
  }

  if (chance >= 35) {
    return "Orta";
  }

  return "Düşük";
}

function getConfidenceLevel(evidenceCount) {
  if (evidenceCount >= 3) {
    return "Yüksek";
  }

  if (evidenceCount === 2) {
    return "Orta";
  }

  return "Düşük";
}

function makeDecision(playerAnswer) {
  if (collectedEvidence.length === 0) {
    showWarning("Önce en az 1 kanıt toplamalısın kral. Direkt karar vermek riskli.");
    return;
  }

  const currentCase = cases[currentCaseIndex];
  const isCorrect = playerAnswer === currentCase.correctAnswer;

  const rewardData = calculateReward(isCorrect, collectedEvidence.length);

  money += rewardData.moneyChange;
  reputation += rewardData.reputationChange;

  if (reputation < 0) {
    reputation = 0;
  }

  if (isCorrect) {
    correctDecisions++;

    document.getElementById("resultTitle").textContent = "Doğru Karar!";
    document.getElementById("resultTitle").className = "correct";
  } else {
    document.getElementById("resultTitle").textContent = "Yanlış Karar!";
    document.getElementById("resultTitle").className = "wrong";
  }

  renderResultDetails(
    playerAnswer,
    currentCase.correctAnswer,
    rewardData.moneyChange,
    rewardData.reputationChange,
    collectedEvidence.length
  );

  document.getElementById("resultText").textContent = currentCase.resultExplanation;

  updateStats();
  updateOfficePanel();
  showScreen("resultScreen");
}

function calculateReward(isCorrect, evidenceCount) {
  if (isCorrect) {
    if (evidenceCount === 1) {
      return {
        moneyChange: 150,
        reputationChange: 1
      };
    }

    if (evidenceCount === 2) {
      return {
        moneyChange: 275,
        reputationChange: 4
      };
    }

    return {
      moneyChange: 450,
      reputationChange: 7
    };
  }

  if (evidenceCount === 1) {
    return {
      moneyChange: -300,
      reputationChange: -10
    };
  }

  if (evidenceCount === 2) {
    return {
      moneyChange: -230,
      reputationChange: -8
    };
  }

  return {
    moneyChange: -180,
    reputationChange: -5
  };
}

function renderResultDetails(playerAnswer, correctAnswer, moneyChange, reputationChange, evidenceCount) {
  const resultDetails = document.getElementById("resultDetails");

  const moneyText = moneyChange > 0 ? "+" + moneyChange + " TL" : moneyChange + " TL";
  const reputationText = reputationChange > 0 ? "+" + reputationChange : reputationChange;

  const activeUpgrades = getActiveUpgradeCount();
  const inspectionCost = getTotalInspectionCost();

  resultDetails.innerHTML = `
    <p><strong>Senin kararın:</strong> ${answerToText(playerAnswer)}</p>
    <p><strong>Doğru karar:</strong> ${answerToText(correctAnswer)}</p>
    <p><strong>Toplanan kanıt:</strong> ${evidenceCount} / ${maxEvidencePerCase}</p>
    <p><strong>İnceleme masrafı:</strong> ${inspectionCost} TL</p>
    <p><strong>Gizli şüphe skoru:</strong> %${fakeChance}</p>
    <p><strong>Karar güveni:</strong> ${getConfidenceLevel(evidenceCount)}</p>
    <p><strong>Aktif ofis geliştirmesi:</strong> ${activeUpgrades} / 3</p>
    <p><strong>Karar para etkisi:</strong> ${moneyText}</p>
    <p><strong>İtibar değişimi:</strong> ${reputationText}</p>
  `;
}

function getTotalInspectionCost() {
  let total = 0;

  collectedEvidence.forEach(evidence => {
    total += evidence.cost;
  });

  return total;
}

function nextCase() {
  const completedDay = day;

  currentCaseIndex++;

  if (completedDay % rentInterval === 0) {
    applyRent();

    showScreen("expenseScreen");
    return;
  }

  day++;

  if (currentCaseIndex >= cases.length) {
    finishGame();
  } else {
    loadCase();
    showScreen("caseScreen");
  }
}

function applyRent() {
  const moneyBeforeRent = money;
  const paidAmount = Math.min(Math.max(moneyBeforeRent, 0), rentAmount);
  const debtAmount = rentAmount - paidAmount;

  money -= rentAmount;

  if (paidAmount > 0) {
    totalRentPaid += paidAmount;
  }

  let rentMessage = "";

  if (debtAmount === 0) {
    rentMessage = "Ofis kirası başarıyla ödendi. İşler devam ediyor.";
  } else {
    reputation -= 6;

    if (reputation < 0) {
      reputation = 0;
    }

    rentMessage =
      "Kiranın tamamını ödeyemedin. " +
      debtAmount +
      " TL borca yazıldı. İtibarın 6 puan düştü.";
  }

  renderExpenseScreen(paidAmount, debtAmount, rentMessage);
  updateStats();
  updateOfficePanel();
}

function renderExpenseScreen(paidAmount, debtAmount, rentMessage) {
  document.getElementById("expenseTitle").textContent = "Ofis Kirası Günü";

  document.getElementById("expenseDetails").innerHTML = `
    <p><strong>Gün:</strong> ${day}. gün sonu</p>
    <p><strong>Kira tutarı:</strong> ${rentAmount} TL</p>
    <p><strong>Ödenen tutar:</strong> ${paidAmount} TL</p>
    <p><strong>Borca yazılan:</strong> ${debtAmount} TL</p>
    <p><strong>Güncel para:</strong> ${money} TL</p>
    <p><strong>Güncel itibar:</strong> ${reputation}</p>
  `;

  document.getElementById("expenseText").textContent = rentMessage;
}

function continueAfterExpense() {
  day++;

  if (currentCaseIndex >= cases.length) {
    finishGame();
  } else {
    loadCase();
    showScreen("caseScreen");
  }
}

function finishGame() {
  let title = "";
  let message = "";

  const activeUpgrades = getActiveUpgradeCount();

  if (money < 0 && reputation < 40) {
    title = "Borçlu Ekspertizci";
    message = "Vakaları çözmeye çalıştın ama ofis ekonomisini iyi yönetemedin. Daha az gereksiz inceleme yapmalısın.";
  } else if (correctDecisions >= 9 && activeUpgrades >= 2 && money >= 1500) {
    title = "Profesyonel Sahte Avcısı";
    message = "Mükemmel oynadın kral. Hem doğru kararlar verdin hem de ofisini ayakta tuttun.";
  } else if (correctDecisions >= 9 && activeUpgrades >= 2) {
    title = "Usta Ekspertizci";
    message = "Çok güçlü oynadın. Kararların iyiydi, ofis yatırımların da etkiliydi.";
  } else if (correctDecisions >= 7) {
    title = "Güvenilir Uzman";
    message = "Çok iyi iş çıkardın. Ofisin güven kazanmaya başladı.";
  } else if (correctDecisions >= 5) {
    title = "Yeni Ekspertizci";
    message = "Fena değilsin ama bazı vakalarda daha fazla kanıt toplaman gerekiyor.";
  } else {
    title = "Acemi Dedektif";
    message = "Bu işte biraz daha pratik lazım. Kanıtları dikkatli yorumlamalısın.";
  }

  document.getElementById("finalResult").innerHTML =
    "Doğru karar sayısı: <strong>" + correctDecisions + " / " + cases.length + "</strong><br><br>" +
    "Final Para: <strong>" + money + " TL</strong><br>" +
    "Final İtibar: <strong>" + reputation + "</strong><br>" +
    "Toplam Ödenen Kira: <strong>" + totalRentPaid + " TL</strong><br>" +
    "Aktif Geliştirme: <strong>" + activeUpgrades + " / 3</strong><br><br>" +
    "Unvanın: <strong>" + title + "</strong><br><br>" +
    message;

  showScreen("endScreen");
}

function getActiveUpgradeCount() {
  let count = 0;

  if (upgrades.serial) {
    count++;
  }

  if (upgrades.magnifier) {
    count++;
  }

  if (upgrades.invoice) {
    count++;
  }

  return count;
}

function answerToText(answer) {
  if (answer === "gercek") {
    return "Gerçek";
  }

  if (answer === "sahte") {
    return "Sahte";
  }

  if (answer === "supheli") {
    return "Şüpheli";
  }

  return "Bilinmiyor";
}

function showWarning(message) {
  document.getElementById("warningText").textContent = message;
}

function clamp(value, min, max) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}