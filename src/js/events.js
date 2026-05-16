const randomEvents = [
  {
    title: "Sosyal Medyada Mini Patlama",
    text: "Bir müşterinin yorumu kısa süreli viral oldu. +120 TL ve +3 itibar kazandın.",
    moneyChange: 120,
    reputationChange: 3
  },
  {
    title: "Elektrik Kesintisi",
    text: "Ofiste kısa süreli elektrik kesintisi oldu. Bazı işler aksadı. -90 TL.",
    moneyChange: -90,
    reputationChange: 0
  },
  {
    title: "Tavsiye Müşterisi",
    text: "Eski bir müşteri seni arkadaşına önermiş. +4 itibar kazandın.",
    moneyChange: 0,
    reputationChange: 4
  },
  {
    title: "Kötü Yorum Riski",
    text: "Bir müşteri sonuçtan memnun kalmadığını söyledi. İşi dikkatli yürütmen lazım. -2 itibar.",
    moneyChange: 0,
    reputationChange: -2
  },
  {
    title: "Küçük Tamir İşi",
    text: "Ofise gelen biri basit bir danışmanlık aldı. +80 TL.",
    moneyChange: 80,
    reputationChange: 0
  }
];

function maybeTriggerRandomEvent() {
  const chance = state.day === 1 ? 0.2 : 0.45;

  if (Math.random() > chance) {
    state.currentEvent = null;
    showEventBanner(null);
    return;
  }

  const eventIndex = Math.floor(Math.random() * randomEvents.length);
  const event = randomEvents[eventIndex];

  state.money += event.moneyChange;
  state.reputation += event.reputationChange;
  state.reputation = clamp(state.reputation, 0, 100);

  state.currentEvent = event;

  showEventBanner(event);
  updateStats();
}

function buildReview(isCorrect, evidenceCount) {
  if (isCorrect && evidenceCount === 1) {
    return {
      stars: 5,
      text: "Müşteri: Çok hızlı karar verdi, önce korktum ama haklı çıktı. Adam işi biliyor."
    };
  }

  if (isCorrect && evidenceCount === 2) {
    return {
      stars: 4,
      text: "Müşteri: Gereksiz uzatmadan mantıklı bir analiz yaptı. Memnun kaldım."
    };
  }

  if (isCorrect && evidenceCount >= 3) {
    return {
      stars: 4,
      text: "Müşteri: Detaylı inceledi, içim rahatladı. Biraz pahalı ama güven verdi."
    };
  }

  if (!isCorrect && evidenceCount === 1) {
    return {
      stars: 1,
      text: "Müşteri: Çok hızlı karar verdi ve yanıldı. Büyük hayal kırıklığı."
    };
  }

  if (!isCorrect && evidenceCount === 2) {
    return {
      stars: 2,
      text: "Müşteri: Biraz baktı ama doğru sonuca ulaşamadı. Güvenim azaldı."
    };
  }

  return {
    stars: 2,
    text: "Müşteri: Çok inceledi ama yine de yanıldı. En azından uğraştı diyebilirim."
  };
}