function calculateReward(isCorrect, evidenceCount) {
  if (!isCorrect) {
    state.correctStreak = 0;

    if (evidenceCount === 1) {
      return {
        moneyChange: -300,
        reputationChange: -10,
        streakBonus: 0
      };
    }

    if (evidenceCount === 2) {
      return {
        moneyChange: -230,
        reputationChange: -8,
        streakBonus: 0
      };
    }

    return {
      moneyChange: -180,
      reputationChange: -5,
      streakBonus: 0
    };
  }

  state.correctStreak++;
  state.bestStreak = Math.max(state.bestStreak, state.correctStreak);

  let baseMoney = 150;
  let baseReputation = 1;

  if (evidenceCount === 2) {
    baseMoney = 275;
    baseReputation = 4;
  }

  if (evidenceCount >= 3) {
    baseMoney = 450;
    baseReputation = 7;
  }

  const streakBonus = state.correctStreak >= 2
    ? state.correctStreak * 50
    : 0;

  return {
    moneyChange: baseMoney + streakBonus,
    reputationChange: baseReputation,
    streakBonus
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