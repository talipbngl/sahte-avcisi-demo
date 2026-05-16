let money = 1000;
let reputation = 50;
let currentCaseIndex = 0;
let collectedEvidence = [];
let correctDecisions = 0;

const cases = [
  {
    avatar: "🎧",
    customerName: "Emre",
    story: "Abi bunu AirPods Pro diye aldım. Kutusu falan var ama sesi biraz garip geliyor.",
    productName: "AirPods Pro",
    claim: "Satıcı ürünün orijinal ve sıfır olduğunu söylüyor.",
    value: 4200,
    correctAnswer: "sahte",
    resultExplanation: "Bu AirPods sahteydi. Seri numarası geçersizdi ve kutudaki yazı fontu orijinalle uyuşmuyordu.",
    evidence: {
      serial: "Seri numarası sistemde bulunamadı.",
      magnifier: "Kulaklık üzerindeki logo baskısı yamuk görünüyor.",
      invoice: "Faturadaki mağaza adı gerçek bir mağazaya ait değil."
    }
  },
  {
    avatar: "📱",
    customerName: "Zeynep",
    story: "Bu iPhone'u ikinci el aldım. Satıcı tertemiz dedi ama ekran bana biraz değişik geldi.",
    productName: "iPhone 13",
    claim: "Satıcı ürünün tamamen orijinal parçalardan oluştuğunu söylüyor.",
    value: 18500,
    correctAnswer: "supheli",
    resultExplanation: "Telefon gerçekti ama ekran değişmişti. Bu yüzden tamamen orijinal demek doğru olmaz.",
    evidence: {
      serial: "Seri numarası Apple cihazıyla eşleşiyor.",
      magnifier: "Ekran kenarında daha önce açılma izi var.",
      invoice: "Fatura gerçek ama ekran değişim bilgisi faturada yazmıyor."
    }
  },
  {
    avatar: "⌚",
    customerName: "Murat",
    story: "Dayım bunu yurt dışından getirdi. Rolex dedi ama fiyatı biraz ucuz geldi bana.",
    productName: "Rolex Saat",
    claim: "Ürünün lüks ve orijinal Rolex olduğu iddia ediliyor.",
    value: 95000,
    correctAnswer: "sahte",
    resultExplanation: "Saat sahteydi. Ağırlığı düşüktü, seri numarası tutarsızdı ve logo işçiliği kalitesizdi.",
    evidence: {
      serial: "Seri numarası Rolex modeliyle uyuşmuyor.",
      magnifier: "Logoda keskinlik yok, işçilik düşük kalite.",
      invoice: "Fatura yok. Sadece WhatsApp ekran görüntüsü gösterildi."
    }
  },
  {
    avatar: "👟",
    customerName: "Ayşe",
    story: "Bu ayakkabıyı uygun fiyata aldım. Orijinal Nike dediler ama emin olamadım.",
    productName: "Nike Air Jordan",
    claim: "Ürün orijinal ama az kullanılmış olarak satılmış.",
    value: 6200,
    correctAnswer: "gercek",
    resultExplanation: "Ayakkabı orijinaldi. Sadece kullanıma bağlı küçük deformasyonlar vardı.",
    evidence: {
      serial: "Kutudaki ürün kodu Nike modeliyle eşleşiyor.",
      magnifier: "Dikiş kalitesi ve logo konumu orijinalle uyumlu.",
      invoice: "Fatura gerçek ve ürün koduyla eşleşiyor."
    }
  },
  {
    avatar: "👜",
    customerName: "Can",
    story: "Instagram'dan bu çantayı aldım. Satıcı orijinal dedi ama fiyatı çok uygundu.",
    productName: "Lüks Marka Çanta",
    claim: "Satıcı ürünün orijinal ithal ürün olduğunu söylüyor.",
    value: 14500,
    correctAnswer: "sahte",
    resultExplanation: "Çanta sahteydi. Dikiş hataları, sahte fatura ve yanlış logo oranları tespit edildi.",
    evidence: {
      serial: "Ürün içindeki seri kodu marka sisteminde görünmüyor.",
      magnifier: "Dikiş aralıkları düzensiz ve logo oranı hatalı.",
      invoice: "Faturadaki vergi numarası geçersiz."
    }
  },
  {
    avatar: "💻",
    customerName: "Berk",
    story: "Bu laptopu oyun bilgisayarı diye sattılar. Ama performansı çok düşük geldi.",
    productName: "Oyuncu Laptopu",
    claim: "Satıcı cihazın yüksek performanslı ve temiz olduğunu söylüyor.",
    value: 32000,
    correctAnswer: "supheli",
    resultExplanation: "Laptop orijinaldi ama ekran kartı arızalıydı ve cihaz ağır tamir görmüştü.",
    evidence: {
      serial: "Seri numarası cihaz modeliyle eşleşiyor.",
      magnifier: "Vida başlarında açılma izi ve kasa içinde tamir izi var.",
      invoice: "Fatura gerçek ama garanti süresi bitmiş."
    }
  },
  {
    avatar: "🎮",
    customerName: "Deniz",
    story: "Bu konsolu kapalı kutu diye aldım. Ama kutu sanki daha önce açılmış gibi.",
    productName: "PlayStation Konsolu",
    claim: "Ürünün sıfır ve kapalı kutu olduğu söyleniyor.",
    value: 21000,
    correctAnswer: "supheli",
    resultExplanation: "Konsol gerçekti ama kutu daha önce açılmıştı. Sıfır ürün olarak satılması doğru değildi.",
    evidence: {
      serial: "Konsol seri numarası geçerli.",
      magnifier: "Kutu bandında ikinci yapıştırma izi var.",
      invoice: "Fatura gerçek ama ürün teşhir ürünü olabilir."
    }
  },
  {
    avatar: "💍",
    customerName: "Elif",
    story: "Bu yüzüğü altın diye aldım. Çok hafif geldi, içime sinmedi.",
    productName: "Altın Yüzük",
    claim: "Satıcı ürünün 22 ayar altın olduğunu söylüyor.",
    value: 12500,
    correctAnswer: "sahte",
    resultExplanation: "Yüzük altın değildi. Kaplama çıktı ve faturadaki bilgiler de tutarsızdı.",
    evidence: {
      serial: "Üründe geçerli bir ayar damgası bulunamadı.",
      magnifier: "Kaplama yüzeyinde soyulma izleri var.",
      invoice: "Faturadaki gram bilgisi ürünle uyuşmuyor."
    }
  },
  {
    avatar: "👕",
    customerName: "Kerem",
    story: "İmzalı forma aldım. Satıcı futbolcunun kendi imzası dedi ama emin değilim.",
    productName: "İmzalı Forma",
    claim: "Formanın orijinal ve gerçek imzalı olduğu iddia ediliyor.",
    value: 8000,
    correctAnswer: "sahte",
    resultExplanation: "Forma orijinal değildi ve imza baskı çıktı. Koleksiyon değeri yoktu.",
    evidence: {
      serial: "Forma ürün kodu resmi sezon modeliyle eşleşmiyor.",
      magnifier: "İmza kalemle atılmamış, baskı gibi duruyor.",
      invoice: "Satıcı sadece sosyal medya mesajı göstermiş, fatura yok."
    }
  },
  {
    avatar: "📷",
    customerName: "Seda",
    story: "Bu kamerayı ikinci el aldım. Satıcı çok az kullanıldı dedi.",
    productName: "Profesyonel Kamera",
    claim: "Ürünün orijinal, az kullanılmış ve sorunsuz olduğu söyleniyor.",
    value: 27000,
    correctAnswer: "gercek",
    resultExplanation: "Kamera orijinaldi ve ciddi bir sorun tespit edilmedi. Ufak kullanım izleri normaldi.",
    evidence: {
      serial: "Seri numarası modelle uyumlu.",
      magnifier: "Lens ve gövdede normal kullanım izleri dışında sorun yok.",
      invoice: "Fatura gerçek ve ürün bilgileriyle eşleşiyor."
    }
  }
];

function startGame() {
  money = 1000;
  reputation = 50;
  currentCaseIndex = 0;
  collectedEvidence = [];
  correctDecisions = 0;

  updateStats();
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

  updateStats();
}

function inspect(type) {
  const currentCase = cases[currentCaseIndex];
  const evidenceText = currentCase.evidence[type];

  if (!collectedEvidence.includes(evidenceText)) {
    collectedEvidence.push(evidenceText);
  }

  document.getElementById("warningText").textContent = "";
  renderEvidence();
}

function renderEvidence() {
  const evidenceList = document.getElementById("evidenceList");
  evidenceList.innerHTML = "";

  collectedEvidence.forEach(evidence => {
    const li = document.createElement("li");
    li.textContent = evidence;
    evidenceList.appendChild(li);
  });
}

function makeDecision(playerAnswer) {
  if (collectedEvidence.length === 0) {
    document.getElementById("warningText").textContent =
      "Önce en az 1 kanıt toplamalısın kral. Direkt karar vermek riskli.";
    return;
  }

  const currentCase = cases[currentCaseIndex];
  const isCorrect = playerAnswer === currentCase.correctAnswer;

  let moneyChange = 0;
  let reputationChange = 0;

  if (isCorrect) {
    moneyChange = 300;
    reputationChange = 5;
    correctDecisions++;

    money += moneyChange;
    reputation += reputationChange;

    document.getElementById("resultTitle").textContent = "Doğru Karar!";
    document.getElementById("resultTitle").className = "correct";
  } else {
    moneyChange = -200;
    reputationChange = -8;

    money += moneyChange;
    reputation += reputationChange;

    document.getElementById("resultTitle").textContent = "Yanlış Karar!";
    document.getElementById("resultTitle").className = "wrong";
  }

  if (money < 0) {
    money = 0;
  }

  if (reputation < 0) {
    reputation = 0;
  }

  renderResultDetails(playerAnswer, currentCase.correctAnswer, moneyChange, reputationChange);
  document.getElementById("resultText").textContent = currentCase.resultExplanation;

  updateStats();
  showScreen("resultScreen");
}

function renderResultDetails(playerAnswer, correctAnswer, moneyChange, reputationChange) {
  const resultDetails = document.getElementById("resultDetails");

  const moneyText = moneyChange > 0 ? "+" + moneyChange + " TL" : moneyChange + " TL";
  const reputationText = reputationChange > 0 ? "+" + reputationChange : reputationChange;

  resultDetails.innerHTML = `
    <p><strong>Senin kararın:</strong> ${answerToText(playerAnswer)}</p>
    <p><strong>Doğru karar:</strong> ${answerToText(correctAnswer)}</p>
    <p><strong>Para değişimi:</strong> ${moneyText}</p>
    <p><strong>İtibar değişimi:</strong> ${reputationText}</p>
  `;
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

  if (correctDecisions >= 9) {
    title = "Sahte Avcısı";
    message = "Mükemmel oynadın kral. Neredeyse hiçbir dolandırıcı senden kaçamadı.";
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
    "Final İtibar: <strong>" + reputation + "</strong><br><br>" +
    "Unvanın: <strong>" + title + "</strong><br><br>" +
    message;

  showScreen("endScreen");
}