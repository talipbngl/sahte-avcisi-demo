function buyUpgrade(type) {
  if (state.upgrades[type]) {
    showWarning("Bu geliştirmeyi zaten aldın kral.");
    return;
  }

  const price = upgradePrices[type];

  if (state.money < price) {
    showWarning("Bu geliştirme için yeterli paran yok. Borca girerek geliştirme alamazsın.");
    return;
  }

  state.money -= price;
  state.upgrades[type] = true;

  showWarning(getUpgradeName(type) + " satın alındı. Bu kategori artık daha güçlü analiz yapacak.");

  updateStats();
  updateOfficePanel();
  updateUpgradePanel();
}

function getUpgradeName(type) {
  if (type === "serial") return "Seri No Veri Tabanı";
  if (type === "magnifier") return "Pro Büyüteç";
  if (type === "invoice") return "Fatura Doğrulama Yazılımı";

  return "Geliştirme";
}

function calculateEffectiveImpact(category, baseImpact) {
  if (!state.upgrades[category]) {
    return baseImpact;
  }

  const upgradeBonus = 8;

  if (baseImpact > 0) return baseImpact + upgradeBonus;
  if (baseImpact < 0) return baseImpact - upgradeBonus;

  return baseImpact;
}

function getActiveUpgradeCount() {
  let count = 0;

  if (state.upgrades.serial) count++;
  if (state.upgrades.magnifier) count++;
  if (state.upgrades.invoice) count++;

  return count;
}