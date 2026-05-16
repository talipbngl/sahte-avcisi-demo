const cases = [
  {
    avatar: "🎧",
    customerName: "Emre",
    story: "Abi bunu AirPods Pro diye aldım. Kutusu var, jelatini de duruyor ama ses kalitesi biraz garip.",
    productName: "AirPods Pro",
    claim: "Satıcı ürünün sıfır ve orijinal olduğunu söylüyor.",
    value: 4200,
    correctAnswer: "sahte",
    resultExplanation: "Ürün sahteydi. Tek tek bakınca bazı detaylar normal görünüyordu ama kutu, ses ve seri bilgileri birlikte değerlendirildiğinde tablo netleşti.",
    tools: [
      {
        id: "airpods_serial",
        category: "serial",
        name: "Seri No Sorgusu",
        cost: 60,
        text: "Seri numarası bir cihaza ait görünüyor ama ürün modeliyle tarih bilgisi tam örtüşmüyor.",
        fakeImpact: 25
      },
      {
        id: "airpods_sound",
        category: "magnifier",
        name: "Ses Testi",
        cost: 80,
        text: "Bas seviyesi zayıf, aktif gürültü engelleme beklenenden düşük çalışıyor.",
        fakeImpact: 30
      },
      {
        id: "airpods_box",
        category: "magnifier",
        name: "Kutu Baskı İncelemesi",
        cost: 40,
        text: "Kutudaki yazıların kalınlığı orijinal örneklerden biraz farklı.",
        fakeImpact: 20
      },
      {
        id: "airpods_invoice",
        category: "invoice",
        name: "Satıcı Belge Kontrolü",
        cost: 70,
        text: "Faturada mağaza adı var ama vergi bilgisi eksik bırakılmış.",
        fakeImpact: 20
      },
      {
        id: "airpods_weight",
        category: "magnifier",
        name: "Ağırlık Ölçümü",
        cost: 50,
        text: "Kutu ve cihaz toplam ağırlığı referans değerden düşük.",
        fakeImpact: 25
      }
    ]
  },
  {
    avatar: "📱",
    customerName: "Zeynep",
    story: "Bu iPhone'u ikinci el aldım. Satıcı tertemiz dedi ama ekran bana biraz değişik geldi.",
    productName: "iPhone 13",
    claim: "Satıcı ürünün tamamen orijinal parçalardan oluştuğunu söylüyor.",
    value: 18500,
    correctAnswer: "supheli",
    resultExplanation: "Telefon gerçekti ama ekran değişmişti. Cihaz komple sahte değildi fakat satıcının 'tamamen orijinal' iddiası doğru değildi.",
    tools: [
      {
        id: "iphone_serial",
        category: "serial",
        name: "IMEI / Seri No Kontrolü",
        cost: 70,
        text: "Cihaz kaydı modelle uyumlu görünüyor.",
        fakeImpact: -25
      },
      {
        id: "iphone_screen",
        category: "magnifier",
        name: "Ekran Kenarı İncelemesi",
        cost: 60,
        text: "Ekran kenarında daha önce açılmış olabileceğini düşündüren çok küçük izler var.",
        fakeImpact: 25
      },
      {
        id: "iphone_battery",
        category: "serial",
        name: "Parça Geçmişi Kontrolü",
        cost: 90,
        text: "Cihaz sisteminde parça geçmişiyle ilgili uyarı çıkıyor.",
        fakeImpact: 25
      },
      {
        id: "iphone_invoice",
        category: "invoice",
        name: "Fatura Kontrolü",
        cost: 60,
        text: "Fatura gerçek görünüyor ama satış tarihi ile cihaz aktivasyon tarihi arasında fark var.",
        fakeImpact: 10
      },
      {
        id: "iphone_camera",
        category: "magnifier",
        name: "Kamera Testi",
        cost: 40,
        text: "Kamera ve kasa kalitesi normal seviyede.",
        fakeImpact: -10
      }
    ]
  },
  {
    avatar: "⌚",
    customerName: "Murat",
    story: "Dayım bunu yurt dışından getirdi. Rolex dedi ama fiyatı baya uygundu.",
    productName: "Rolex Saat",
    claim: "Ürünün orijinal lüks saat olduğu iddia ediliyor.",
    value: 95000,
    correctAnswer: "sahte",
    resultExplanation: "Saat sahteydi. Tek başına logo değil; mekanizma sesi, ağırlık ve belge eksikliği birlikte karar verdirdi.",
    tools: [
      {
        id: "watch_weight",
        category: "magnifier",
        name: "Ağırlık Ölçümü",
        cost: 60,
        text: "Saat beklenen ağırlığın altında kalıyor.",
        fakeImpact: 30
      },
      {
        id: "watch_movement",
        category: "magnifier",
        name: "Mekanizma Dinleme",
        cost: 100,
        text: "Saniye akışı pürüzsüz değil, mekanizma sesi ucuz modelleri andırıyor.",
        fakeImpact: 35
      },
      {
        id: "watch_serial",
        category: "serial",
        name: "Kasa Seri Kontrolü",
        cost: 90,
        text: "Kasa içindeki seri biçimi referans örneklerle uyuşmuyor.",
        fakeImpact: 30
      },
      {
        id: "watch_document",
        category: "invoice",
        name: "Garanti Kartı Kontrolü",
        cost: 60,
        text: "Garanti kartında bayi kaşesi yok.",
        fakeImpact: 20
      },
      {
        id: "watch_glass",
        category: "magnifier",
        name: "Cam Yansıma Testi",
        cost: 50,
        text: "Cam kalitesi kötü değil ama tek başına orijinallik kanıtı sayılmaz.",
        fakeImpact: 5
      }
    ]
  },
  {
    avatar: "👟",
    customerName: "Ayşe",
    story: "Bu ayakkabıyı uygun fiyata aldım. Orijinal Nike dediler ama emin olamadım.",
    productName: "Nike Air Jordan",
    claim: "Ürün orijinal ama az kullanılmış olarak satılmış.",
    value: 6200,
    correctAnswer: "gercek",
    resultExplanation: "Ayakkabı orijinaldi. Uygun fiyat ve küçük deformasyonlar şüphe uyandırdı ama ürün kodu, dikiş ve fatura birbirini destekledi.",
    tools: [
      {
        id: "shoe_box_code",
        category: "serial",
        name: "Kutu Ürün Kodu",
        cost: 50,
        text: "Kutu üzerindeki kod model ve renk bilgisiyle uyumlu.",
        fakeImpact: -25
      },
      {
        id: "shoe_stitch",
        category: "magnifier",
        name: "Dikiş İncelemesi",
        cost: 40,
        text: "Dikiş aralıkları düzenli, logo konumu referans görsellerle uyumlu.",
        fakeImpact: -25
      },
      {
        id: "shoe_invoice",
        category: "invoice",
        name: "Fatura Kontrolü",
        cost: 60,
        text: "Fatura ve ürün kodu birbiriyle eşleşiyor.",
        fakeImpact: -30
      },
      {
        id: "shoe_smell",
        category: "magnifier",
        name: "Malzeme Kontrolü",
        cost: 40,
        text: "Malzeme kokusu ve taban sertliği orijinal ürünlere yakın.",
        fakeImpact: -15
      },
      {
        id: "shoe_price",
        category: "invoice",
        name: "Piyasa Fiyatı Kıyaslama",
        cost: 30,
        text: "Fiyat düşük ama imkânsız derecede düşük değil.",
        fakeImpact: 5
      }
    ]
  },
  {
    avatar: "👜",
    customerName: "Can",
    story: "Instagram'dan bu çantayı aldım. Satıcı orijinal ithal ürün dedi.",
    productName: "Lüks Marka Çanta",
    claim: "Satıcı ürünün orijinal ithal ürün olduğunu söylüyor.",
    value: 14500,
    correctAnswer: "sahte",
    resultExplanation: "Çanta sahteydi. Satıcı profili, dikiş detayları ve belge bilgileri birlikte değerlendirildiğinde orijinallik iddiası çöktü.",
    tools: [
      {
        id: "bag_stitch",
        category: "magnifier",
        name: "Dikiş ve Deri İncelemesi",
        cost: 50,
        text: "Dikiş aralıklarında ufak düzensizlikler var, deri dokusu da biraz sert.",
        fakeImpact: 25
      },
      {
        id: "bag_serial",
        category: "serial",
        name: "İç Etiket Kodu Kontrolü",
        cost: 80,
        text: "İç etiketteki kod formatı markanın yeni dönem kod yapısıyla uyuşmuyor.",
        fakeImpact: 35
      },
      {
        id: "bag_invoice",
        category: "invoice",
        name: "Fatura / Vergi Kontrolü",
        cost: 70,
        text: "Faturadaki vergi numarası sorguda bulunamıyor.",
        fakeImpact: 30
      },
      {
        id: "bag_seller",
        category: "invoice",
        name: "Satıcı Profil Analizi",
        cost: 40,
        text: "Satıcı hesabı yeni açılmış ve yorumların çoğu aynı gün girilmiş.",
        fakeImpact: 20
      },
      {
        id: "bag_package",
        category: "magnifier",
        name: "Paketleme Kontrolü",
        cost: 30,
        text: "Paketleme fena değil ama lüks ürün standardı için biraz özensiz.",
        fakeImpact: 10
      }
    ]
  },
  {
    avatar: "💻",
    customerName: "Berk",
    story: "Bu laptopu oyun bilgisayarı diye sattılar. Ama performansı çok düşük geldi.",
    productName: "Oyuncu Laptopu",
    claim: "Satıcı cihazın yüksek performanslı ve temiz olduğunu söylüyor.",
    value: 32000,
    correctAnswer: "supheli",
    resultExplanation: "Laptop orijinaldi ama cihaz ağır tamir görmüştü. Sahte değildi fakat satıcının 'temiz' iddiası sorunluydu.",
    tools: [
      {
        id: "laptop_serial",
        category: "serial",
        name: "Seri No / Model Kontrolü",
        cost: 70,
        text: "Seri numarası modelle uyumlu.",
        fakeImpact: -25
      },
      {
        id: "laptop_gpu",
        category: "serial",
        name: "Donanım Raporu",
        cost: 100,
        text: "Ekran kartı sistemde görünüyor ama yük altında beklenen performansı vermiyor.",
        fakeImpact: 25
      },
      {
        id: "laptop_screw",
        category: "magnifier",
        name: "Vida ve Kasa Kontrolü",
        cost: 50,
        text: "Vida başlarında açılma izi var.",
        fakeImpact: 20
      },
      {
        id: "laptop_invoice",
        category: "invoice",
        name: "Garanti / Fatura Kontrolü",
        cost: 60,
        text: "Fatura gerçek ama garanti süresi bitmiş.",
        fakeImpact: 5
      },
      {
        id: "laptop_heat",
        category: "magnifier",
        name: "Isı Testi",
        cost: 90,
        text: "Cihaz kısa sürede yüksek sıcaklığa çıkıyor.",
        fakeImpact: 20
      }
    ]
  },
  {
    avatar: "🎮",
    customerName: "Deniz",
    story: "Bu konsolu kapalı kutu diye aldım. Ama kutu sanki daha önce açılmış gibi.",
    productName: "PlayStation Konsolu",
    claim: "Ürünün sıfır ve kapalı kutu olduğu söyleniyor.",
    value: 21000,
    correctAnswer: "supheli",
    resultExplanation: "Konsol gerçekti ama kutu daha önce açılmıştı. Ürün sahte değildi, fakat 'sıfır kapalı kutu' bilgisi güvenilir değildi.",
    tools: [
      {
        id: "console_serial",
        category: "serial",
        name: "Konsol Seri Kontrolü",
        cost: 70,
        text: "Seri numarası geçerli ve modelle uyumlu.",
        fakeImpact: -25
      },
      {
        id: "console_box",
        category: "magnifier",
        name: "Kutu Bandı İncelemesi",
        cost: 50,
        text: "Kutu bandında ikinci yapıştırma izine benzer bir iz var.",
        fakeImpact: 25
      },
      {
        id: "console_invoice",
        category: "invoice",
        name: "Fatura Kontrolü",
        cost: 60,
        text: "Fatura gerçek ama ürün açıklamasında teşhir ibaresi bulunuyor.",
        fakeImpact: 20
      },
      {
        id: "console_controller",
        category: "magnifier",
        name: "Kol Kullanım İzi",
        cost: 40,
        text: "Kolda çok hafif kullanım izi var.",
        fakeImpact: 15
      },
      {
        id: "console_system",
        category: "serial",
        name: "İlk Kurulum Kontrolü",
        cost: 80,
        text: "Cihazda daha önce kurulum yapılmış görünüyor.",
        fakeImpact: 25
      }
    ]
  },
  {
    avatar: "💍",
    customerName: "Elif",
    story: "Bu yüzüğü altın diye aldım. Çok hafif geldi, içime sinmedi.",
    productName: "Altın Yüzük",
    claim: "Satıcı ürünün 22 ayar altın olduğunu söylüyor.",
    value: 12500,
    correctAnswer: "sahte",
    resultExplanation: "Yüzük altın değildi. Dış görünüş ilk bakışta kandırıcıydı ama ayar, ağırlık ve yüzey izleri sahte olduğunu gösterdi.",
    tools: [
      {
        id: "ring_stamp",
        category: "magnifier",
        name: "Ayar Damgası İncelemesi",
        cost: 40,
        text: "Damga çok silik ve konumu alışılmış örneklerden farklı.",
        fakeImpact: 25
      },
      {
        id: "ring_weight",
        category: "magnifier",
        name: "Hassas Ağırlık Ölçümü",
        cost: 50,
        text: "Ağırlık, iddia edilen ayar ve ölçüye göre düşük.",
        fakeImpact: 30
      },
      {
        id: "ring_surface",
        category: "magnifier",
        name: "Yüzey Aşınma Kontrolü",
        cost: 50,
        text: "İç kısımda kaplama soyulmasına benzeyen izler var.",
        fakeImpact: 30
      },
      {
        id: "ring_invoice",
        category: "invoice",
        name: "Kuyumcu Faturası Kontrolü",
        cost: 60,
        text: "Faturadaki gram bilgisi ürünle uyuşmuyor.",
        fakeImpact: 25
      },
      {
        id: "ring_seller",
        category: "invoice",
        name: "Satıcı Geçmişi",
        cost: 30,
        text: "Satıcının benzer ürünlerde birkaç olumsuz yorumu var.",
        fakeImpact: 10
      }
    ]
  },
  {
    avatar: "👕",
    customerName: "Kerem",
    story: "İmzalı forma aldım. Satıcı futbolcunun kendi imzası dedi ama emin değilim.",
    productName: "İmzalı Forma",
    claim: "Formanın orijinal ve gerçek imzalı olduğu iddia ediliyor.",
    value: 8000,
    correctAnswer: "sahte",
    resultExplanation: "Forma ve imza güvenilir değildi. İmza baskı gibi duruyordu, ürün kodu da sezon modeliyle uyuşmuyordu.",
    tools: [
      {
        id: "shirt_code",
        category: "serial",
        name: "Forma Ürün Kodu",
        cost: 50,
        text: "Ürün kodu resmi sezon modeliyle eşleşmiyor.",
        fakeImpact: 30
      },
      {
        id: "shirt_signature",
        category: "magnifier",
        name: "İmza Mürekkep İncelemesi",
        cost: 70,
        text: "İmza yüzeyde mürekkep gibi değil, baskı katmanı gibi duruyor.",
        fakeImpact: 35
      },
      {
        id: "shirt_fabric",
        category: "magnifier",
        name: "Kumaş Kalitesi",
        cost: 40,
        text: "Kumaş kalitesi lisanslı forma kadar iyi değil.",
        fakeImpact: 20
      },
      {
        id: "shirt_certificate",
        category: "invoice",
        name: "Sertifika Kontrolü",
        cost: 70,
        text: "Sertifika üzerinde doğrulama kodu yok.",
        fakeImpact: 25
      },
      {
        id: "shirt_seller",
        category: "invoice",
        name: "Satıcı Mesajları",
        cost: 30,
        text: "Satıcı imzanın nerede alındığına dair net bilgi veremiyor.",
        fakeImpact: 15
      }
    ]
  },
  {
    avatar: "📷",
    customerName: "Seda",
    story: "Bu kamerayı ikinci el aldım. Satıcı çok az kullanıldı dedi.",
    productName: "Profesyonel Kamera",
    claim: "Ürünün orijinal, az kullanılmış ve sorunsuz olduğu söyleniyor.",
    value: 27000,
    correctAnswer: "gercek",
    resultExplanation: "Kamera orijinaldi. Bazı kullanım izleri vardı ama seri, lens ve fatura bilgileri ürünü destekledi.",
    tools: [
      {
        id: "camera_serial",
        category: "serial",
        name: "Seri No Kontrolü",
        cost: 70,
        text: "Seri numarası model ve üretim yılıyla uyumlu.",
        fakeImpact: -25
      },
      {
        id: "camera_lens",
        category: "magnifier",
        name: "Lens İncelemesi",
        cost: 60,
        text: "Lenste ciddi çizik veya mantar izi yok.",
        fakeImpact: -20
      },
      {
        id: "camera_shutter",
        category: "serial",
        name: "Perde Sayısı Kontrolü",
        cost: 90,
        text: "Perde sayısı ikinci el için makul seviyede.",
        fakeImpact: -20
      },
      {
        id: "camera_invoice",
        category: "invoice",
        name: "Fatura Kontrolü",
        cost: 60,
        text: "Fatura ve seri bilgileri birbiriyle eşleşiyor.",
        fakeImpact: -25
      },
      {
        id: "camera_body",
        category: "magnifier",
        name: "Gövde Kontrolü",
        cost: 40,
        text: "Gövde köşelerinde normal kullanım izleri var.",
        fakeImpact: 5
      }
    ]
  }
];