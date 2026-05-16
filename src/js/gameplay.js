function startGame() {
  resetState();
  loadCase();
  showScreen("caseScreen");
}

function restartGame() {
  startGame();
}

function loadCase() {
  state.collectedEvidence = [];
  state.fakeChance = 50;

  const currentCase = cases[state.currentCaseIndex];

  loadCaseUI(currentCase);
  maybeTriggerRandomEvent();
}

function inspect(toolId) {
  const currentCase = cases[state.currentCaseIndex];
  const selectedTool = currentCase.tools.find(tool => tool.id === toolId);

  if (!selectedTool) {
    showWarning("Bu inceleme aracı bulunamadı.");
    return;
  }

  const alreadyCollected = state.collectedEvidence.some(item => item.id === toolId);

  if (alreadyCollected) {
    showWarning("Bu incelemeyi zaten yaptın kral. Başka bir araç dene.");
    return;
  }

  if (state.collectedEvidence.length >= settings.maxEvidencePerCase) {
    showWarning("Bu vaka için en fazla 3 inceleme yapabilirsin. Artık karar vermen gerekiyor.");
    return;
  }

  state.money -= selectedTool.cost;

  const effectiveImpact = calculateEffectiveImpact(
    selectedTool.category,
    selectedTool.fakeImpact
  );

  state.collectedEvidence.push({
    id: selectedTool.id,
    category: selectedTool.category,
    name: selectedTool.name,
    text: selectedTool.text,
    cost: selectedTool.cost,
    baseImpact: selectedTool.fakeImpact,
    fakeImpact: effectiveImpact,
    upgraded: state.upgrades[selectedTool.category]
  });

  state.fakeChance += effectiveImpact;
  state.fakeChance = clamp(state.fakeChance, 0, 100);

  showWarning("");

  renderEvidence();
  renderToolButtons();
  updateAnalysisPanel();
  updateStats();
}

function makeDecision(playerAnswer) {
  if (state.collectedEvidence.length === 0) {
    showWarning("Önce en az 1 kanıt toplamalısın kral. Direkt karar vermek riskli.");
    return;
  }

  const currentCase = cases[state.currentCaseIndex];
  const isCorrect = playerAnswer === currentCase.correctAnswer;

  if (isCorrect) {
    state.correctDecisions++;
  }

  const rewardData = calculateReward(isCorrect, state.collectedEvidence.length);

  state.money += rewardData.moneyChange;
  state.reputation += rewardData.reputationChange;
  state.reputation = clamp(state.reputation, 0, 100);

  const review = buildReview(isCorrect, state.collectedEvidence.length);
  state.lastReview = review;

  if (isCorrect) {
    qs("resultTitle").textContent = "Doğru Karar!";
    qs("resultTitle").className = "correct";
  } else {
    qs("resultTitle").textContent = "Yanlış Karar!";
    qs("resultTitle").className = "wrong";
  }

  renderResultDetails(playerAnswer, currentCase.correctAnswer, rewardData);
  renderReview(review);

  qs("resultText").textContent = currentCase.resultExplanation;

  updateStats();
  updateOfficePanel();
  showScreen("resultScreen");
}

function getSuspicionText() {
  if (state.collectedEvidence.length === 0) return "Belirsiz";
  if (state.collectedEvidence.length === 1) return "Yetersiz Veri";

  if (state.fakeChance >= 75) return "Çok Şüpheli";
  if (state.fakeChance >= 60) return "Şüpheli";
  if (state.fakeChance >= 40) return "Kararsız";
  if (state.fakeChance >= 25) return "Güvenli Gibi";

  return "Güvenli";
}

function getRiskLevel(chance) {
  if (state.collectedEvidence.length < 2) return "Belirsiz";

  if (chance >= 70) return "Yüksek";
  if (chance >= 35) return "Orta";

  return "Düşük";
}

function getConfidenceLevel(evidenceCount) {
  if (evidenceCount >= 3) return "Yüksek";
  if (evidenceCount === 2) return "Orta";

  return "Düşük";
}

function nextCase() {
  const completedDay = state.day;

  state.currentCaseIndex++;

  if (completedDay % settings.rentInterval === 0) {
    applyRent();
    showScreen("expenseScreen");
    return;
  }

  state.day++;

  if (state.currentCaseIndex >= cases.length) {
    finishGame();
  } else {
    loadCase();
    showScreen("caseScreen");
  }
}

function continueAfterExpense() {
  state.day++;

  if (state.currentCaseIndex >= cases.length) {
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

  if (state.money < 0 && state.reputation < 40) {
    title = "Borçlu Ekspertizci";
    message = "Vakaları çözmeye çalıştın ama ofis ekonomisini iyi yönetemedin.";
  } else if (state.correctDecisions >= 9 && state.bestStreak >= 5 && state.money >= 1500) {
    title = "Efsane Sahte Avcısı";
    message = "Hem kararların güçlüydü hem de seri yakaladın. Bu ofis artık marka olur.";
  } else if (state.correctDecisions >= 9 && activeUpgrades >= 2) {
    title = "Profesyonel Sahte Avcısı";
    message = "Çok güçlü oynadın. Kararların iyiydi, ofis yatırımların da etkiliydi.";
  } else if (state.correctDecisions >= 7) {
    title = "Güvenilir Uzman";
    message = "Çok iyi iş çıkardın. Ofisin güven kazanmaya başladı.";
  } else if (state.correctDecisions >= 5) {
    title = "Yeni Ekspertizci";
    message = "Fena değilsin ama bazı vakalarda daha fazla kanıt toplaman gerekiyor.";
  } else {
    title = "Acemi Dedektif";
    message = "Bu işte biraz daha pratik lazım. Kanıtları dikkatli yorumlamalısın.";
  }

  qs("finalResult").innerHTML =
    "Doğru karar sayısı: <strong>" + state.correctDecisions + " / " + cases.length + "</strong><br><br>" +
    "En iyi doğru seri: <strong>" + state.bestStreak + "</strong><br>" +
    "Final Para: <strong>" + state.money + " TL</strong><br>" +
    "Final İtibar: <strong>" + state.reputation + "</strong><br>" +
    "Toplam Ödenen Kira: <strong>" + state.totalRentPaid + " TL</strong><br>" +
    "Aktif Geliştirme: <strong>" + activeUpgrades + " / 3</strong><br><br>" +
    "Unvanın: <strong>" + title + "</strong><br><br>" +
    message;

  showScreen("endScreen");
}