const T = (id, category, name, cost, text, fakeImpact) => ({
  id,
  category,
  name,
  cost,
  text,
  fakeImpact
});

const C = (
  avatar,
  customerName,
  story,
  productName,
  claim,
  value,
  correctAnswer,
  resultExplanation,
  tools
) => ({
  avatar,
  customerName,
  story,
  productName,
  claim,
  value,
  correctAnswer,
  resultExplanation,
  tools
});

const cases = [
  C(
    "🎧",
    "Emre",
    "Abi bunu AirPods Pro diye aldım. Kutusu var, jelatini de duruyor ama ses kalitesi biraz garip.",
    "AirPods Pro",
    "Satıcı ürünün sıfır ve orijinal olduğunu söylüyor.",
    4200,
    "sahte",
    "Ürün sahteydi. Kutu, ses ve seri bilgileri birlikte değerlendirildiğinde tablo netleşti.",
    [
      T("airpods_serial", "serial", "Seri No Sorgusu", 60, "Seri numarası bir cihaza ait görünüyor ama ürün modeliyle tarih bilgisi tam örtüşmüyor.", 25),
      T("airpods_sound", "magnifier", "Ses Testi", 80, "Bas seviyesi zayıf, aktif gürültü engelleme beklenenden düşük çalışıyor.", 30),
      T("airpods_box", "magnifier", "Kutu Baskı İncelemesi", 40, "Kutudaki yazıların kalınlığı orijinal örneklerden biraz farklı.", 20),
      T("airpods_invoice", "invoice", "Satıcı Belge Kontrolü", 70, "Faturada mağaza adı var ama vergi bilgisi eksik bırakılmış.", 20),
      T("airpods_weight", "magnifier", "Ağırlık Ölçümü", 50, "Kutu ve cihaz toplam ağırlığı referans değerden düşük.", 25)
    ]
  ),

  C(
    "📱",
    "Zeynep",
    "Bu iPhone'u ikinci el aldım. Satıcı tertemiz dedi ama ekran bana biraz değişik geldi.",
    "iPhone 13",
    "Satıcı ürünün tamamen orijinal parçalardan oluştuğunu söylüyor.",
    18500,
    "supheli",
    "Telefon gerçekti ama ekran değişmişti. Cihaz komple sahte değildi fakat satıcının 'tamamen orijinal' iddiası doğru değildi.",
    [
      T("iphone_serial", "serial", "IMEI / Seri No Kontrolü", 70, "Cihaz kaydı modelle uyumlu görünüyor.", -25),
      T("iphone_screen", "magnifier", "Ekran Kenarı İncelemesi", 60, "Ekran kenarında daha önce açılmış olabileceğini düşündüren çok küçük izler var.", 25),
      T("iphone_parts", "serial", "Parça Geçmişi Kontrolü", 90, "Cihaz sisteminde parça geçmişiyle ilgili uyarı çıkıyor.", 25),
      T("iphone_invoice", "invoice", "Fatura Kontrolü", 60, "Fatura gerçek görünüyor ama satış tarihi ile aktivasyon tarihi arasında fark var.", 10),
      T("iphone_camera", "magnifier", "Kamera Testi", 40, "Kamera ve kasa kalitesi normal seviyede.", -10)
    ]
  ),

  C(
    "⌚",
    "Murat",
    "Dayım bunu yurt dışından getirdi. Rolex dedi ama fiyatı baya uygundu.",
    "Rolex Saat",
    "Ürünün orijinal lüks saat olduğu iddia ediliyor.",
    95000,
    "sahte",
    "Saat sahteydi. Mekanizma sesi, ağırlık ve belge eksikliği birlikte karar verdirdi.",
    [
      T("watch_weight", "magnifier", "Ağırlık Ölçümü", 60, "Saat beklenen ağırlığın altında kalıyor.", 30),
      T("watch_movement", "magnifier", "Mekanizma Dinleme", 100, "Saniye akışı pürüzsüz değil, mekanizma sesi ucuz modelleri andırıyor.", 35),
      T("watch_serial", "serial", "Kasa Seri Kontrolü", 90, "Kasa içindeki seri biçimi referans örneklerle uyuşmuyor.", 30),
      T("watch_document", "invoice", "Garanti Kartı Kontrolü", 60, "Garanti kartında bayi kaşesi yok.", 20),
      T("watch_glass", "magnifier", "Cam Yansıma Testi", 50, "Cam kalitesi kötü değil ama tek başına orijinallik kanıtı sayılmaz.", 5)
    ]
  ),

  C(
    "👟",
    "Ayşe",
    "Bu ayakkabıyı uygun fiyata aldım. Orijinal Nike dediler ama emin olamadım.",
    "Nike Air Jordan",
    "Ürün orijinal ama az kullanılmış olarak satılmış.",
    6200,
    "gercek",
    "Ayakkabı orijinaldi. Uygun fiyat ve küçük deformasyonlar şüphe uyandırdı ama ürün kodu, dikiş ve fatura birbirini destekledi.",
    [
      T("shoe_box_code", "serial", "Kutu Ürün Kodu", 50, "Kutu üzerindeki kod model ve renk bilgisiyle uyumlu.", -25),
      T("shoe_stitch", "magnifier", "Dikiş İncelemesi", 40, "Dikiş aralıkları düzenli, logo konumu referans görsellerle uyumlu.", -25),
      T("shoe_invoice", "invoice", "Fatura Kontrolü", 60, "Fatura ve ürün kodu birbiriyle eşleşiyor.", -30),
      T("shoe_material", "magnifier", "Malzeme Kontrolü", 40, "Malzeme kokusu ve taban sertliği orijinal ürünlere yakın.", -15),
      T("shoe_price", "invoice", "Piyasa Fiyatı Kıyaslama", 30, "Fiyat düşük ama imkânsız derecede düşük değil.", 5)
    ]
  ),

  C(
    "👜",
    "Can",
    "Instagram'dan bu çantayı aldım. Satıcı orijinal ithal ürün dedi.",
    "Lüks Marka Çanta",
    "Satıcı ürünün orijinal ithal ürün olduğunu söylüyor.",
    14500,
    "sahte",
    "Çanta sahteydi. Satıcı profili, dikiş detayları ve belge bilgileri birlikte değerlendirildiğinde orijinallik iddiası çöktü.",
    [
      T("bag_stitch", "magnifier", "Dikiş ve Deri İncelemesi", 50, "Dikiş aralıklarında ufak düzensizlikler var, deri dokusu da biraz sert.", 25),
      T("bag_serial", "serial", "İç Etiket Kodu Kontrolü", 80, "İç etiketteki kod formatı markanın yeni dönem kod yapısıyla uyuşmuyor.", 35),
      T("bag_invoice", "invoice", "Fatura / Vergi Kontrolü", 70, "Faturadaki vergi numarası sorguda bulunamıyor.", 30),
      T("bag_seller", "invoice", "Satıcı Profil Analizi", 40, "Satıcı hesabı yeni açılmış ve yorumların çoğu aynı gün girilmiş.", 20),
      T("bag_package", "magnifier", "Paketleme Kontrolü", 30, "Paketleme fena değil ama lüks ürün standardı için biraz özensiz.", 10)
    ]
  ),

  C(
    "💻",
    "Berk",
    "Bu laptopu oyun bilgisayarı diye sattılar. Ama performansı çok düşük geldi.",
    "Oyuncu Laptopu",
    "Satıcı cihazın yüksek performanslı ve temiz olduğunu söylüyor.",
    32000,
    "supheli",
    "Laptop orijinaldi ama cihaz ağır tamir görmüştü. Sahte değildi fakat satıcının 'temiz' iddiası sorunluydu.",
    [
      T("laptop_serial", "serial", "Seri No / Model Kontrolü", 70, "Seri numarası modelle uyumlu.", -25),
      T("laptop_gpu", "serial", "Donanım Raporu", 100, "Ekran kartı sistemde görünüyor ama yük altında beklenen performansı vermiyor.", 25),
      T("laptop_screw", "magnifier", "Vida ve Kasa Kontrolü", 50, "Vida başlarında açılma izi var.", 20),
      T("laptop_invoice", "invoice", "Garanti / Fatura Kontrolü", 60, "Fatura gerçek ama garanti süresi bitmiş.", 5),
      T("laptop_heat", "magnifier", "Isı Testi", 90, "Cihaz kısa sürede yüksek sıcaklığa çıkıyor.", 20)
    ]
  ),

  C(
    "🎮",
    "Deniz",
    "Bu konsolu kapalı kutu diye aldım. Ama kutu sanki daha önce açılmış gibi.",
    "PlayStation Konsolu",
    "Ürünün sıfır ve kapalı kutu olduğu söyleniyor.",
    21000,
    "supheli",
    "Konsol gerçekti ama kutu daha önce açılmıştı. Ürün sahte değildi, fakat 'sıfır kapalı kutu' bilgisi güvenilir değildi.",
    [
      T("console_serial", "serial", "Konsol Seri Kontrolü", 70, "Seri numarası geçerli ve modelle uyumlu.", -25),
      T("console_box", "magnifier", "Kutu Bandı İncelemesi", 50, "Kutu bandında ikinci yapıştırma izine benzer bir iz var.", 25),
      T("console_invoice", "invoice", "Fatura Kontrolü", 60, "Fatura gerçek ama ürün açıklamasında teşhir ibaresi bulunuyor.", 20),
      T("console_controller", "magnifier", "Kol Kullanım İzi", 40, "Kolda çok hafif kullanım izi var.", 15),
      T("console_system", "serial", "İlk Kurulum Kontrolü", 80, "Cihazda daha önce kurulum yapılmış görünüyor.", 25)
    ]
  ),

  C(
    "💍",
    "Elif",
    "Bu yüzüğü altın diye aldım. Çok hafif geldi, içime sinmedi.",
    "Altın Yüzük",
    "Satıcı ürünün 22 ayar altın olduğunu söylüyor.",
    12500,
    "sahte",
    "Yüzük altın değildi. Dış görünüş ilk bakışta kandırıcıydı ama ayar, ağırlık ve yüzey izleri sahte olduğunu gösterdi.",
    [
      T("ring_stamp", "magnifier", "Ayar Damgası İncelemesi", 40, "Damga çok silik ve konumu alışılmış örneklerden farklı.", 25),
      T("ring_weight", "magnifier", "Hassas Ağırlık Ölçümü", 50, "Ağırlık, iddia edilen ayar ve ölçüye göre düşük.", 30),
      T("ring_surface", "magnifier", "Yüzey Aşınma Kontrolü", 50, "İç kısımda kaplama soyulmasına benzeyen izler var.", 30),
      T("ring_invoice", "invoice", "Kuyumcu Faturası Kontrolü", 60, "Faturadaki gram bilgisi ürünle uyuşmuyor.", 25),
      T("ring_seller", "invoice", "Satıcı Geçmişi", 30, "Satıcının benzer ürünlerde birkaç olumsuz yorumu var.", 10)
    ]
  ),

  C(
    "👕",
    "Kerem",
    "İmzalı forma aldım. Satıcı futbolcunun kendi imzası dedi ama emin değilim.",
    "İmzalı Forma",
    "Formanın orijinal ve gerçek imzalı olduğu iddia ediliyor.",
    8000,
    "sahte",
    "Forma ve imza güvenilir değildi. İmza baskı gibi duruyordu, ürün kodu da sezon modeliyle uyuşmuyordu.",
    [
      T("shirt_code", "serial", "Forma Ürün Kodu", 50, "Ürün kodu resmi sezon modeliyle eşleşmiyor.", 30),
      T("shirt_signature", "magnifier", "İmza Mürekkep İncelemesi", 70, "İmza yüzeyde mürekkep gibi değil, baskı katmanı gibi duruyor.", 35),
      T("shirt_fabric", "magnifier", "Kumaş Kalitesi", 40, "Kumaş kalitesi lisanslı forma kadar iyi değil.", 20),
      T("shirt_certificate", "invoice", "Sertifika Kontrolü", 70, "Sertifika üzerinde doğrulama kodu yok.", 25),
      T("shirt_seller", "invoice", "Satıcı Mesajları", 30, "Satıcı imzanın nerede alındığına dair net bilgi veremiyor.", 15)
    ]
  ),

  C(
    "📷",
    "Seda",
    "Bu kamerayı ikinci el aldım. Satıcı çok az kullanıldı dedi.",
    "Profesyonel Kamera",
    "Ürünün orijinal, az kullanılmış ve sorunsuz olduğu söyleniyor.",
    27000,
    "gercek",
    "Kamera orijinaldi. Bazı kullanım izleri vardı ama seri, lens ve fatura bilgileri ürünü destekledi.",
    [
      T("camera_serial", "serial", "Seri No Kontrolü", 70, "Seri numarası model ve üretim yılıyla uyumlu.", -25),
      T("camera_lens", "magnifier", "Lens İncelemesi", 60, "Lenste ciddi çizik veya mantar izi yok.", -20),
      T("camera_shutter", "serial", "Perde Sayısı Kontrolü", 90, "Perde sayısı ikinci el için makul seviyede.", -20),
      T("camera_invoice", "invoice", "Fatura Kontrolü", 60, "Fatura ve seri bilgileri birbiriyle eşleşiyor.", -25),
      T("camera_body", "magnifier", "Gövde Kontrolü", 40, "Gövde köşelerinde normal kullanım izleri var.", 5)
    ]
  )
];