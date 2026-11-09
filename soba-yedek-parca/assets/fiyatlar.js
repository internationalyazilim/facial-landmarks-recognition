/* =========================================================
   VARSAYILAN FİYAT LİSTESİ (Fiyatlar TL, KDV hariç)
   NOT: Fiyatları sayfadaki ⚙️ Ayarlar ekranından değiştirmek
   daha kolay; orada kaydedilenler bu dosyanın önüne geçer.
   ---------------------------------------------------------
   MARKALAR : selectbox'ta çıkan markalar
     - logo   : logolar/ klasöründeki orijinal logo dosyası
     - carpan : o markanın parça fiyat çarpanı (1 = baz fiyat)
     - ozel   : o markaya özel fiyat  { parcaId: fiyat }
     - gizle  : o markada olmayan parçalar [ parcaId, ... ]
   PARCALAR : tüm markalarda ortak yedek parça listesi
   ISCILIK  : işçilik / hizmet kalemleri (markadan bağımsız)
   ========================================================= */

window.AYARLAR = {
  firmaAdi: "",           // sayfadaki ⚙️ Ayarlar'dan da girilebilir
  telefon: "",            // boşsa üstteki arama butonu gizlenir
  kdvOrani: 20,          // %
  kdvVarsayilan: false,  // sayfa açılınca KDV eklensin mi
  paraBirimi: "₺"
};

window.MARKALAR = [
  { id: "sunfire",    ad: "Sunfire",        logo: "logolar/sunfire.png",    renk: "#c62828", carpan: 1.00, ozel: {}, gizle: [] },
  { id: "demirdokum", ad: "Demirdöküm",     logo: "logolar/demirdokum.png", renk: "#0d47a1", carpan: 1.10, ozel: {}, gizle: [] },
  { id: "hosseven",   ad: "Hoşseven",       logo: "logolar/hosseven.png",   renk: "#d32f2f", carpan: 1.00, ozel: {}, gizle: [] },
  { id: "fujiyama",   ad: "Fujiyama",       logo: "logolar/fujiyama.png",   renk: "#bf360c", carpan: 0.95, ozel: {}, gizle: [] },
  { id: "susler",     ad: "Süsler",         logo: "logolar/susler.png",     renk: "#e53935", carpan: 0.95, ozel: {}, gizle: [] },
  { id: "eca",        ad: "E.C.A.",         logo: "logolar/eca.png",        renk: "#1e88e5", carpan: 1.05, ozel: {}, gizle: [] },
  { id: "alarko",     ad: "Alarko",         logo: "logolar/alarko.png",     renk: "#424242", carpan: 1.10, ozel: {}, gizle: [] },
  { id: "asroyal",    ad: "AS Royal / Royal", logo: "logolar/asroyal.png",  renk: "#c62828", carpan: 1.00, ozel: {}, gizle: [] },
  { id: "baymak",     ad: "Baymak",         logo: "logolar/baymak.png",     renk: "#2e7d32", carpan: 1.05, ozel: {}, gizle: [] },
  { id: "raks",       ad: "Raks",           logo: "logolar/raks.png",       renk: "#e53935", carpan: 1.00, ozel: {}, gizle: [] },
  { id: "delonghi",   ad: "DeLonghi",       logo: "logolar/delonghi.png",   renk: "#1565c0", carpan: 1.15, ozel: {}, gizle: [] }
];

/* kategori: listede gruplama başlığı */
window.PARCALAR = [
  { id: "termokupl",     kategori: "Ateşleme & Emniyet", ad: "Termokupl",                         fiyat: 450 },
  { id: "pilot",         kategori: "Ateşleme & Emniyet", ad: "Pilot Brülör (Komple)",             fiyat: 1250 },
  { id: "piezo",         kategori: "Ateşleme & Emniyet", ad: "Ateşleme Çakmağı (Piezo)",          fiyat: 350 },
  { id: "atesleme_kab",  kategori: "Ateşleme & Emniyet", ad: "Ateşleme Kablosu",                  fiyat: 200 },
  { id: "elektrot",      kategori: "Ateşleme & Emniyet", ad: "Ateşleme Bujisi / Elektrot",        fiyat: 250 },
  { id: "pilot_boru",    kategori: "Ateşleme & Emniyet", ad: "Pilot Gaz Borusu",                  fiyat: 350 },

  { id: "gaz_valf",      kategori: "Gaz & Brülör",       ad: "Gaz Valfi (Termostatik Ventil)",    fiyat: 3500 },
  { id: "valf_dugme",    kategori: "Gaz & Brülör",       ad: "Valf Ayar Düğmesi",                 fiyat: 150 },
  { id: "ana_brulor",    kategori: "Gaz & Brülör",       ad: "Ana Brülör",                        fiyat: 1800 },
  { id: "enjektor",      kategori: "Gaz & Brülör",       ad: "Enjektör / Meme",                   fiyat: 200 },
  { id: "gaz_hortum",    kategori: "Gaz & Brülör",       ad: "Esnek Gaz Bağlantı Hortumu",        fiyat: 450 },

  { id: "fan_motor",     kategori: "Fan & Elektrik",     ad: "Fan Motoru",                        fiyat: 2200 },
  { id: "fan_kanat",     kategori: "Fan & Elektrik",     ad: "Fan Kanadı",                        fiyat: 400 },
  { id: "klikson",       kategori: "Fan & Elektrik",     ad: "Klikson (Fan Termiği)",             fiyat: 300 },

  { id: "cam",           kategori: "Gövde & Cam",        ad: "Yanma Odası Camı",                  fiyat: 900 },
  { id: "cam_conta",     kategori: "Gövde & Cam",        ad: "Cam / Yanma Odası Contası",         fiyat: 250 },
  { id: "ayak",          kategori: "Gövde & Cam",        ad: "Soba Ayağı (Takım)",                fiyat: 300 },

  { id: "baca_set",      kategori: "Baca",               ad: "Hermetik Baca Seti",                fiyat: 2500 },
  { id: "baca_uzatma",   kategori: "Baca",               ad: "Baca Uzatma Borusu",                fiyat: 900 },
  { id: "baca_adaptor",  kategori: "Baca",               ad: "Baca Adaptörü / Redüksiyon",        fiyat: 350 },
  { id: "rozet",         kategori: "Baca",               ad: "Duvar Rozeti",                      fiyat: 150 }
];

window.ISCILIK = [
  { id: "i_ariza",     ad: "Servis / Arıza Tespit Ücreti",         fiyat: 750 },
  { id: "i_yol",       ad: "Yol / Ulaşım Ücreti",                  fiyat: 300 },
  { id: "i_bakim",     ad: "Genel Bakım & Temizlik",               fiyat: 1500 },
  { id: "i_termokupl", ad: "Termokupl Değişim İşçiliği",           fiyat: 500 },
  { id: "i_pilot",     ad: "Pilot Temizlik / Değişim İşçiliği",    fiyat: 600 },
  { id: "i_valf",      ad: "Gaz Valfi Değişim İşçiliği",           fiyat: 1000 },
  { id: "i_fan",       ad: "Fan Motoru Değişim İşçiliği",          fiyat: 750 },
  { id: "i_cam",       ad: "Cam / Conta Değişim İşçiliği",         fiyat: 500 },
  { id: "i_baca",      ad: "Baca Montajı",                         fiyat: 1500 },
  { id: "i_montaj",    ad: "Soba Montajı (Bağlantı)",              fiyat: 2000 },
  { id: "i_sokme",     ad: "Soba Sökme / Taşıma",                  fiyat: 750 },
  { id: "i_kacak",     ad: "Gaz Kaçak Testi",                      fiyat: 400 }
];
