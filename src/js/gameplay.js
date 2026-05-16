function startGame() {
  resetState();
  loadCase();
  showScreen("caseIntroScreen");
}

function restartGame() {
  startGame();
}

function loadCase() {
  state.collectedEvidence = [];
  state.fakeChance = 50;
  state.selectedVerdict = null;
  state.selectedProblem = null;

  const currentCase = cases[state.currentCaseIndex];

  loadCaseUI(currentCase);
  showEventBanner(null);
}
function beginInspection() {
  maybeTriggerRandomEvent();
  showScreen("caseScreen");
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

function selectVerdict(verdict) {
  state.selectedVerdict = verdict;
  updateVerdictSelection();
  showWarning("");
}

function selectProblem(problem) {
  state.selectedProblem = problem;
  updateProblemSelection();
  showWarning("");
}

function submitReport() {
  if (state.collectedEvidence.length === 0) {
    showWarning("Önce en az 1 özel ipucu açmalısın kral. Hiç inceleme yapmadan rapor gönderemezsin.");
    return;
  }

  if (!state.selectedVerdict) {
    showWarning("Önce kararını seçmelisin: Gerçek, Sahte veya Şüpheli.");
    return;
  }

  if (!state.selectedProblem) {
    showWarning("Ana problemi de seçmelisin. Artık sadece karar yetmiyor.");
    return;
  }

  const currentCase = cases[state.currentCaseIndex];

  const isVerdictCorrect = state.selectedVerdict === currentCase.correctAnswer;
  const isProblemCorrect = state.selectedProblem === currentCase.correctProblem;

  if (isVerdictCorrect) {
    state.correctDecisions++;
  }

  const rewardData = calculateReward(
    isVerdictCorrect,
    isProblemCorrect,
    state.collectedEvidence.length
  );

  state.money += rewardData.moneyChange;
  state.reputation += rewardData.reputationChange;
  state.reputation = clamp(state.reputation, 0, 100);

  const review = buildReview(isVerdictCorrect && isProblemCorrect, state.collectedEvidence.length);
  state.lastReview = review;

  if (isVerdictCorrect && isProblemCorrect) {
    qs("resultTitle").textContent = "Tam İsabet!";
    qs("resultTitle").className = "correct";
  } else if (isVerdictCorrect) {
    qs("resultTitle").textContent = "Karar Doğru, Sebep Hatalı!";
    qs("resultTitle").className = "neutral";
  } else {
    qs("resultTitle").textContent = "Yanlış Rapor!";
    qs("resultTitle").className = "wrong";
  }

  renderResultDetails(
    state.selectedVerdict,
    currentCase.correctAnswer,
    state.selectedProblem,
    currentCase.correctProblem,
    rewardData
  );

  renderReview(review);
  handleNetworkProgress(currentCase, isVerdictCorrect, isProblemCorrect);

  qs("resultText").textContent = currentCase.resultExplanation;

  updateStats();
  updateOfficePanel();
  showScreen("resultScreen");
}
function getSuspicionText() {
  const evidenceCount = state.collectedEvidence.length;

  if (evidenceCount === 0) return "Dosya Açık";
  if (evidenceCount === 1) return "Az Veri";
  if (evidenceCount === 2) return "Kısmi Analiz";

  return "Tam Dosya";
}

function getRiskLevel() {
  const evidenceCount = state.collectedEvidence.length;

  if (evidenceCount === 0) return "Çok Yüksek";
  if (evidenceCount === 1) return "Çok Yüksek";
  if (evidenceCount === 2) return "Orta";

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
    showScreen("caseIntroScreen");
  }
}

function continueAfterExpense() {
  state.day++;

  if (state.currentCaseIndex >= cases.length) {
    finishGame();
  } else {
    loadCase();
    showScreen("caseIntroScreen");
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
function handleNetworkProgress(currentCase, isVerdictCorrect, isProblemCorrect) {
  hideNetworkBox();

  if (!currentCase.networkTag) {
    return;
  }

  if (!isVerdictCorrect || !isProblemCorrect) {
    showNetworkBox(
      "Bağlantı Kaçtı",
      "Bu vaka bir ağa bağlı olabilir ama raporda yeterince doğru sonuca ulaşamadığın için bağlantı kurulamadı."
    );
    return;
  }

  const tag = currentCase.networkTag;

  if (!state.networkProgress[tag]) {
    state.networkProgress[tag] = 0;
  }

  state.networkProgress[tag]++;

  if (state.networkProgress[tag] >= 2 && !state.solvedNetworks[tag]) {
    state.solvedNetworks[tag] = true;

    state.money += 1000;
    state.reputation += 10;
    state.reputation = clamp(state.reputation, 0, 100);

    showNetworkBox(
      "Dolandırıcı Ağı Yakalandı!",
      "Birden fazla vakada ortak iz buldun. Aynı ödeme/satış ağına bağlı dosyaları çözdüğün için +1000 TL ve +10 itibar kazandın."
    );

    updateStats();
    return;
  }

  showNetworkBox(
    "Bağlantı İzi Bulundu",
    "Bu dosyada daha büyük bir satış ağına ait iz yakaladın. Benzer bir vaka daha çözersen operasyon bonusu açılabilir."
  );
}