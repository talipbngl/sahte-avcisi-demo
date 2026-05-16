let money = 1000;
let reputation = 50;
let currentCaseIndex = 0;
let collectedEvidence = [];
let correctDecisions = 0;
let fakeChance = 50;

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

  upgrades = {
    serial: false,
    magnifier: false,
    invoice: false
  };

  updateStats();
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
  document.getElementById("money").textContent = money + " TL";
  document.getElementById("reputation").textContent = reputation;

  if (currentCaseIndex >= cases.length) {
    document.getElementById("caseNumber").textContent = cases.length + " / " + cases.length;
  } else {
    document.getElementById("caseNumber").textContent = (currentCaseIndex + 1) + " / " + cases.length;
  }
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

  updateAnalysisPanel();
  updateUpgradePanel();
  updateStats();
}

function buyUpgrade(type) {
  if (upgrades[type]) {
    showWarning("Bu geliştirmeyi zaten aldın kral.");
    return;
  }

  const price = upgradePrices[type];

  if (money < price) {
    showWarning("Bu geliştirme için yeterli paran yok. Birkaç vaka daha çözmen lazım.");
    return;
  }

  money -= price;
  upgrades[type] = true;

  showWarning(getUpgradeName(type) + " satın alındı. Bu araç artık daha güçlü analiz yapacak.");

  updateStats();
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

function inspect(type) {
  const currentCase = cases[currentCaseIndex];
  const evidenceData = currentCase.evidence[type];

  const alreadyCollected = collectedEvidence.some(item => item.type === type);

  if (alreadyCollected) {
    showWarning("Bu incelemeyi zaten yaptın kral. Başka bir araç dene.");
    return;
  }

  const effectiveImpact = calculateEffectiveImpact(type, evidenceData.fakeImpact);

  collectedEvidence.push({
    type: type,
    text: evidenceData.text,
    baseImpact: evidenceData.fakeImpact,
    fakeImpact: effectiveImpact,
    upgraded: upgrades[type]
  });

  fakeChance += effectiveImpact;
  fakeChance = clamp(fakeChance, 0, 100);

  showWarning("");

  renderEvidence();
  updateAnalysisPanel();
}

function calculateEffectiveImpact(type, baseImpact) {
  if (!upgrades[type]) {
    return baseImpact;
  }

  const upgradeBonus = 10;

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

    const impactText = evidence.fakeImpact > 0
      ? "Sahte ihtimalini artırdı"
      : "Sahte ihtimalini düşürdü";

    const upgradeText = evidence.upgraded
      ? " | Geliştirilmiş araç bonusu aktif"
      : "";

    li.textContent = evidence.text + " (" + impactText + upgradeText + ")";

    evidenceList.appendChild(li);
  });
}

function updateAnalysisPanel() {
  document.getElementById("fakeChance").textContent = "%" + fakeChance;
  document.getElementById("riskLevel").textContent = getRiskLevel(fakeChance);
  document.getElementById("evidenceCounter").textContent = collectedEvidence.length + " / 3";
  document.getElementById("confidenceLevel").textContent = getConfidenceLevel(collectedEvidence.length);
}

function getRiskLevel(chance) {
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

  if (money < 0) {
    money = 0;
  }

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
  showScreen("resultScreen");
}

function calculateReward(isCorrect, evidenceCount) {
  if (isCorrect) {
    if (evidenceCount === 1) {
      return {
        moneyChange: 150,
        reputationChange: 2
      };
    }

    if (evidenceCount === 2) {
      return {
        moneyChange: 250,
        reputationChange: 4
      };
    }

    return {
      moneyChange: 400,
      reputationChange: 7
    };
  }

  if (evidenceCount === 1) {
    return {
      moneyChange: -250,
      reputationChange: -10
    };
  }

  if (evidenceCount === 2) {
    return {
      moneyChange: -200,
      reputationChange: -8
    };
  }

  return {
    moneyChange: -150,
    reputationChange: -5
  };
}

function renderResultDetails(playerAnswer, correctAnswer, moneyChange, reputationChange, evidenceCount) {
  const resultDetails = document.getElementById("resultDetails");

  const moneyText = moneyChange > 0 ? "+" + moneyChange + " TL" : moneyChange + " TL";
  const reputationText = reputationChange > 0 ? "+" + reputationChange : reputationChange;

  const activeUpgrades = getActiveUpgradeCount();

  resultDetails.innerHTML = `
    <p><strong>Senin kararın:</strong> ${answerToText(playerAnswer)}</p>
    <p><strong>Doğru karar:</strong> ${answerToText(correctAnswer)}</p>
    <p><strong>Toplanan kanıt:</strong> ${evidenceCount} / 3</p>
    <p><strong>Son sahte olma ihtimali:</strong> %${fakeChance}</p>
    <p><strong>Karar güveni:</strong> ${getConfidenceLevel(evidenceCount)}</p>
    <p><strong>Aktif ofis geliştirmesi:</strong> ${activeUpgrades} / 3</p>
    <p><strong>Para değişimi:</strong> ${moneyText}</p>
    <p><strong>İtibar değişimi:</strong> ${reputationText}</p>
  `;
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

function nextCase() {
  currentCaseIndex++;

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

  if (correctDecisions >= 9 && activeUpgrades >= 2) {
    title = "Profesyonel Sahte Avcısı";
    message = "Mükemmel oynadın kral. Hem doğru kararlar verdin hem de ofisini akıllıca geliştirdin.";
  } else if (correctDecisions >= 9) {
    title = "Sahte Avcısı";
    message = "Neredeyse hiçbir dolandırıcı senden kaçamadı. Ofis yatırımlarını artırırsan daha da büyürsün.";
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
    "Aktif Geliştirme: <strong>" + activeUpgrades + " / 3</strong><br><br>" +
    "Unvanın: <strong>" + title + "</strong><br><br>" +
    message;

  showScreen("endScreen");
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