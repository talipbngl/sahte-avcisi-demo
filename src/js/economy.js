function calculateReward(isCorrect, evidenceCount) {
  if (!isCorrect) {
    state.correctStreak = 0;

    if (evidenceCount === 1) {
      return {
        moneyChange: -900,
        reputationChange: -16,
        streakBonus: 0,
        riskBonus: 0,
        riskLabel: "Aşırı Riskli Yanlış Karar"
      };
    }

    if (evidenceCount === 2) {
      return {
        moneyChange: -500,
        reputationChange: -10,
        streakBonus: 0,
        riskBonus: 0,
        riskLabel: "Riskli Yanlış Karar"
      };
    }

    return {
      moneyChange: -220,
      reputationChange: -5,
      streakBonus: 0,
      riskBonus: 0,
      riskLabel: "Güvenli Ama Yanlış Karar"
    };
  }

  state.correctStreak++;
  state.bestStreak = Math.max(state.bestStreak, state.correctStreak);

  let baseMoney = 250;
  let baseReputation = 3;
  let riskBonus = 0;
  let riskLabel = "Güvenli Karar";

  if (evidenceCount === 1) {
    baseMoney = 350;
    baseReputation = 5;
    riskBonus = 450;
    riskLabel = "Cesur Hızlı Karar";
  }

  if (evidenceCount === 2) {
    baseMoney = 350;
    baseReputation = 4;
    riskBonus = 180;
    riskLabel = "Dengeli Karar";
  }

  if (evidenceCount >= 3) {
    baseMoney = 250;
    baseReputation = 3;
    riskBonus = 0;
    riskLabel = "Güvenli Karar";
  }

  const streakBonus = state.correctStreak >= 2
    ? state.correctStreak * 70
    : 0;

  return {
    moneyChange: baseMoney + riskBonus + streakBonus,
    reputationChange: baseReputation,
    streakBonus,
    riskBonus,
    riskLabel
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