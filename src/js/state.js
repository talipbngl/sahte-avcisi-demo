const state = {};

const settings = {
  startingMoney: 1000,
  startingReputation: 50,
  maxEvidencePerCase: 3,
  rentAmount: 300,
  rentInterval: 3
};

const upgradePrices = {
  serial: 650,
  magnifier: 500,
  invoice: 600
};

function resetState() {
  state.money = settings.startingMoney;
  state.reputation = settings.startingReputation;
  state.currentCaseIndex = 0;
  state.collectedEvidence = [];
  state.correctDecisions = 0;
  state.correctStreak = 0;
  state.bestStreak = 0;
  state.fakeChance = 50;

  state.day = 1;
  state.totalRentPaid = 0;

  state.upgrades = {
    serial: false,
    magnifier: false,
    invoice: false
  };

  state.currentEvent = null;
  state.lastReview = null;
  state.selectedVerdict = null;
  state.selectedProblem = null;
  state.networkProgress = {};
  state.solvedNetworks = {};
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function answerToText(answer) {
  if (answer === "gercek") return "Gerçek";
  if (answer === "sahte") return "Sahte";
  if (answer === "supheli") return "Şüpheli";

  return "Bilinmiyor";
}
function problemToText(problem) {
  if (problem === "no_problem") return "Problem Yok";
  if (problem === "fake_product") return "Ürün Sahte";
  if (problem === "seller_scam") return "Satıcı Dolandırıcı";
  if (problem === "misrepresented") return "Ürün Gerçek Ama Eksik Beyan";
  if (problem === "customer_lie") return "Müşteri Yalan Söylüyor";
  if (problem === "document_issue") return "Belge / Fatura Sorunlu";

  return "Bilinmiyor";
}
resetState();