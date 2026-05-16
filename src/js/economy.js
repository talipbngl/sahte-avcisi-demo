function calculateReward(isVerdictCorrect, isProblemCorrect, evidenceCount) {
  if (!isVerdictCorrect) {
    state.correctStreak = 0;

    let penalty = -220;
    let reputationPenalty = -5;

    if (evidenceCount === 1) {
      penalty = -900;
      reputationPenalty = -16;
    }

    if (evidenceCount === 2) {
      penalty = -500;
      reputationPenalty = -10;
    }

    return {
      moneyChange: penalty,
      reputationChange: reputationPenalty,
      streakBonus: 0,
      riskBonus: 0,
      problemBonus: 0,
      reportLabel: "Yanlış Rapor"
    };
  }

  state.correctStreak++;
  state.bestStreak = Math.max(state.bestStreak, state.correctStreak);

  let baseMoney = 250;
  let baseReputation = 3;
  let riskBonus = 0;

  if (evidenceCount === 1) {
    baseMoney = 350;
    baseReputation = 5;
    riskBonus = 450;
  }

  if (evidenceCount === 2) {
    baseMoney = 350;
    baseReputation = 4;
    riskBonus = 180;
  }

  if (evidenceCount >= 3) {
    baseMoney = 250;
    baseReputation = 3;
    riskBonus = 0;
  }

  const problemBonus = isProblemCorrect ? 300 : -120;

  const streakBonus = state.correctStreak >= 2
    ? state.correctStreak * 70
    : 0;

  const reportLabel = isProblemCorrect
    ? "Tam İsabet Rapor"
    : "Karar Doğru, Sebep Hatalı";

  const reputationChange = isProblemCorrect
    ? baseReputation + 2
    : baseReputation - 2;

  return {
    moneyChange: baseMoney + riskBonus + problemBonus + streakBonus,
    reputationChange,
    streakBonus,
    riskBonus,
    problemBonus,
    reportLabel
  };
}

function applyRent() {
  const paidAmount = Math.min(Math.max(state.money, 0), settings.rentAmount);
  const debtAmount = settings.rentAmount - paidAmount;

  state.money -= settings.rentAmount;

  if (paidAmount > 0) {
    state.totalRentPaid += paidAmount;
  }

  let rentMessage = "";

  if (debtAmount === 0) {
    rentMessage = "Ofis kirası başarıyla ödendi. İşler devam ediyor.";
  } else {
    state.reputation -= 6;
    state.reputation = clamp(state.reputation, 0, 100);

    rentMessage =
      "Kiranın tamamını ödeyemedin. " +
      debtAmount +
      " TL borca yazıldı. İtibarın 6 puan düştü.";
  }

  renderExpenseScreen(paidAmount, debtAmount, rentMessage);
  updateStats();
  updateOfficePanel();
}

function getNextRentDay() {
  const cyclePosition = (state.day - 1) % settings.rentInterval;
  const daysUntilRentDay = settings.rentInterval - cyclePosition - 1;

  return state.day + daysUntilRentDay;
}

function getTotalInspectionCost() {
  let total = 0;

  state.collectedEvidence.forEach(evidence => {
    total += evidence.cost;
  });

  return total;
}