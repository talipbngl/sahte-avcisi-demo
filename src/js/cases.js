const cases = [
  {
    avatar: "🎧",
    customerName: "Emre",
    story: "Abi bunu AirPods Pro diye aldım. Kutusu falan var ama sesi biraz garip geliyor.",
    productName: "AirPods Pro",
    claim: "Satıcı ürünün orijinal ve sıfır olduğunu söylüyor.",
    value: 4200,
    correctAnswer: "sahte",
    resultExplanation: "Bu AirPods sahteydi. Seri numarası geçersizdi, kutu baskısı hatalıydı ve fatura güvenilir değildi.",
    evidence: {
      serial: {
        text: "Seri numarası sistemde bulunamadı.",
        fakeImpact: 40
      },
      magnifier: {
        text: "Kulaklık üzerindeki logo baskısı yamuk görünüyor.",
        fakeImpact: 25
      },
      invoice: {
        text: "Faturadaki mağaza adı gerçek bir mağazaya ait değil.",
        fakeImpact: 30
      }
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
      serial: {
        text: "Seri numarası Apple cihazıyla eşleşiyor.",
        fakeImpact: -25
      },
      magnifier: {
        text: "Ekran kenarında daha önce açılma izi var.",
        fakeImpact: 35
      },
      invoice: {
        text: "Fatura gerçek ama ekran değişim bilgisi faturada yazmıyor.",
        fakeImpact: 15
      }
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
      serial: {
        text: "Seri numarası Rolex modeliyle uyuşmuyor.",
        fakeImpact: 35
      },
      magnifier: {
        text: "Logoda keskinlik yok, işçilik düşük kalite.",
        fakeImpact: 35
      },
      invoice: {
        text: "Fatura yok. Sadece WhatsApp ekran görüntüsü gösterildi.",
        fakeImpact: 25
      }
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
      serial: {
        text: "Kutudaki ürün kodu Nike modeliyle eşleşiyor.",
        fakeImpact: -30
      },
      magnifier: {
        text: "Dikiş kalitesi ve logo konumu orijinalle uyumlu.",
        fakeImpact: -25
      },
      invoice: {
        text: "Fatura gerçek ve ürün koduyla eşleşiyor.",
        fakeImpact: -30
      }
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
      serial: {
        text: "Ürün içindeki seri kodu marka sisteminde görünmüyor.",
        fakeImpact: 40
      },
      magnifier: {
        text: "Dikiş aralıkları düzensiz ve logo oranı hatalı.",
        fakeImpact: 30
      },
      invoice: {
        text: "Faturadaki vergi numarası geçersiz.",
        fakeImpact: 35
      }
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
      serial: {
        text: "Seri numarası cihaz modeliyle eşleşiyor.",
        fakeImpact: -20
      },
      magnifier: {
        text: "Vida başlarında açılma izi ve kasa içinde tamir izi var.",
        fakeImpact: 30
      },
      invoice: {
        text: "Fatura gerçek ama garanti süresi bitmiş.",
        fakeImpact: 10
      }
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
      serial: {
        text: "Konsol seri numarası geçerli.",
        fakeImpact: -25
      },
      magnifier: {
        text: "Kutu bandında ikinci yapıştırma izi var.",
        fakeImpact: 30
      },
      invoice: {
        text: "Fatura gerçek ama ürün teşhir ürünü olabilir.",
        fakeImpact: 10
      }
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
      serial: {
        text: "Üründe geçerli bir ayar damgası bulunamadı.",
        fakeImpact: 35
      },
      magnifier: {
        text: "Kaplama yüzeyinde soyulma izleri var.",
        fakeImpact: 35
      },
      invoice: {
        text: "Faturadaki gram bilgisi ürünle uyuşmuyor.",
        fakeImpact: 30
      }
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
      serial: {
        text: "Forma ürün kodu resmi sezon modeliyle eşleşmiyor.",
        fakeImpact: 35
      },
      magnifier: {
        text: "İmza kalemle atılmamış, baskı gibi duruyor.",
        fakeImpact: 40
      },
      invoice: {
        text: "Satıcı sadece sosyal medya mesajı göstermiş, fatura yok.",
        fakeImpact: 25
      }
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
      serial: {
        text: "Seri numarası modelle uyumlu.",
        fakeImpact: -30
      },
      magnifier: {
        text: "Lens ve gövdede normal kullanım izleri dışında sorun yok.",
        fakeImpact: -25
      },
      invoice: {
        text: "Fatura gerçek ve ürün bilgileriyle eşleşiyor.",
        fakeImpact: -30
      }
    }
  }
];