(function () {
  "use strict";

  var A = window.AYARLAR || {};
  var SABIT_MARKALAR = window.MARKALAR || [];
  var MARKA_KAYIT = "sobaMarkalar_v1";
  var ekMarkalar = [];
  try { ekMarkalar = JSON.parse(localStorage.getItem(MARKA_KAYIT) || "[]") || []; } catch (e) { ekMarkalar = []; }
  var MARKALAR = [];
  function markalariBirlestir() {
    MARKALAR = SABIT_MARKALAR.concat(ekMarkalar.map(function (m) {
      return { id: m.id, ad: m.ad, logo: m.logo || "", renk: m.renk || "#1e40af", carpan: +m.carpan || 1, ozel: {}, gizle: [], ek: true };
    }));
  }
  function ekMarkaKaydet() {
    try { localStorage.setItem(MARKA_KAYIT, JSON.stringify(ekMarkalar)); return true; }
    catch (e) { alert("Kaydedilemedi: telefon hafızası dolu olabilir. Daha küçük bir logo deneyin."); return false; }
  }
  markalariBirlestir();
  var PARCALAR = window.PARCALAR || [];
  var ISCILIK = window.ISCILIK || [];
  var PB = A.paraBirimi || "₺";
  var KAYIT = "sobaTeklif_v1";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var tl = function (n) {
    return (Math.round(n * 100) / 100).toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " " + PB;
  };

  /* ---------- DURUM ---------- */
  var durum = { marka: "", kalemler: [], indirim: 0, kdv: !!A.kdvVarsayilan, sekme: "parca", arama: "" };
  try {
    var k = JSON.parse(localStorage.getItem(KAYIT) || "null");
    if (k && Array.isArray(k.kalemler)) {
      durum.marka = k.marka || ""; durum.kalemler = k.kalemler;
      durum.indirim = +k.indirim || 0; durum.kdv = !!k.kdv;
    }
  } catch (e) {}
  function kaydet() {
    try {
      localStorage.setItem(KAYIT, JSON.stringify({
        marka: durum.marka, kalemler: durum.kalemler, indirim: durum.indirim, kdv: durum.kdv
      }));
    } catch (e) {}
  }

  var markaBul = function (id) { return MARKALAR.find(function (m) { return m.id === id; }); };
  if (durum.marka && !markaBul(durum.marka)) durum.marka = "";

  function parcaFiyat(p, m) {
    if (m.ozel && m.ozel[p.id] != null) return +m.ozel[p.id];
    return Math.round((p.fiyat * (m.carpan || 1)) / 10) * 10;
  }
  function markaParcalari(m) {
    return PARCALAR.filter(function (p) { return !(m.gizle || []).includes(p.id); })
      .map(function (p) { return { id: p.id, kategori: p.kategori, ad: p.ad, fiyat: parcaFiyat(p, m) }; });
  }

  /* ---------- LOGO ---------- */
  function logoHTML(m, buyuk) {
    if (!m.logo) return '<span class="logo yedek' + (buyuk ? " buyuk" : "") + '"><span style="color:' + esc(m.renk || "#1e40af") + '">' + esc(m.ad) + "</span></span>";
    return '<span class="logo' + (buyuk ? " buyuk" : "") + '" data-ad="' + esc(m.ad) + '" data-renk="' + esc(m.renk || "#1e40af") + '">' +
      '<img src="' + esc(m.logo) + '" alt="' + esc(m.ad) + ' logo" loading="lazy"></span>';
  }
  // logo dosyası yoksa markanın adını renkli rozet olarak göster
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (img.tagName !== "IMG" || !img.parentNode || !img.parentNode.classList.contains("logo")) return;
    var kap = img.parentNode;
    kap.classList.add("yedek");
    kap.innerHTML = '<span style="color:' + kap.dataset.renk + '">' + esc(kap.dataset.ad) + "</span>";
  }, true);

  /* ---------- MARKA SEÇİCİ ---------- */
  var mBtn = $("markaBtn"), mList = $("markaList"), mSel = $("markaSelect");
  function markaListeCiz() {
    mSel.innerHTML = '<option value="">Marka seçin…</option>' +
      MARKALAR.map(function (m) { return '<option value="' + esc(m.id) + '">' + esc(m.ad) + "</option>"; }).join("");
    mList.innerHTML = MARKALAR.map(function (m) {
      return '<li role="option" data-id="' + esc(m.id) + '" aria-selected="false">' + logoHTML(m) + '<span class="mad">' + esc(m.ad) + "</span>" +
        (m.ek ? '<button type="button" class="marka-sil" data-sil="' + esc(m.id) + '" aria-label="' + esc(m.ad) + ' markasını sil">✕</button>' : "") + "</li>";
    }).join("") + '<li class="yeni-marka" data-yeni="1">＋ Listede olmayan marka ekle</li>';
  }
  markaListeCiz();

  var aktifIdx = -1;
  function listeAc(ac) {
    mList.hidden = !ac; mBtn.setAttribute("aria-expanded", ac ? "true" : "false");
    if (ac) {
      aktifIdx = Math.max(0, MARKALAR.findIndex(function (m) { return m.id === durum.marka; }));
      vurgula();
    }
  }
  function vurgula() {
    Array.prototype.forEach.call(mList.children, function (li, i) {
      li.classList.toggle("aktif", i === aktifIdx);
      if (i === aktifIdx) li.scrollIntoView({ block: "nearest" });
    });
  }
  mBtn.addEventListener("click", function () { listeAc(mList.hidden); });
  mBtn.addEventListener("keydown", function (e) {
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      if (mList.hidden) return listeAc(true);
      var n = MARKALAR.length + 1;
      aktifIdx = (aktifIdx + (e.key === "ArrowDown" ? 1 : -1) + n) % n; vurgula();
    } else if (e.key === "Enter" && !mList.hidden) {
      e.preventDefault(); listeAc(false);
      if (aktifIdx >= MARKALAR.length) modalAc(); else markaSec(MARKALAR[aktifIdx].id);
    } else if (e.key === "Escape") listeAc(false);
  });
  mList.addEventListener("click", function (e) {
    var silBtn = e.target.closest("[data-sil]");
    if (silBtn) { e.stopPropagation(); markaSil(silBtn.dataset.sil); return; }
    var li = e.target.closest("li"); if (!li) return;
    listeAc(false);
    if (li.dataset.yeni) return modalAc();
    markaSec(li.dataset.id); mBtn.focus();
  });

  /* ---------- YENİ MARKA EKLE ---------- */
  var modal = $("markaModal"), yeniLogo = "";
  function modalAc() {
    $("markaForm").reset(); yeniLogo = ""; $("ymOnizleme").innerHTML = "Logo yok";
    modal.hidden = false; document.body.classList.add("modal-acik");
    setTimeout(function () { $("ymAd").focus(); }, 50);
  }
  function modalKapat() { modal.hidden = true; document.body.classList.remove("modal-acik"); }
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest("[data-kapat]")) modalKapat(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) modalKapat(); });

  // seçilen logoyu küçültüp telefona kaydedilebilir hale getir
  $("ymLogo").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var olcek = Math.min(1, 360 / img.width, 140 / img.height);
        var c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * olcek)); c.height = Math.max(1, Math.round(img.height * olcek));
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        yeniLogo = c.toDataURL("image/png");
        $("ymOnizleme").innerHTML = '<img src="' + yeniLogo + '" alt="Logo önizleme">';
      };
      img.onerror = function () { alert("Bu resim açılamadı."); };
      img.src = r.result;
    };
    r.readAsDataURL(f);
  });

  $("markaForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ad = $("ymAd").value.trim(); if (!ad) return;
    if (MARKALAR.some(function (m) { return m.ad.toLocaleLowerCase("tr") === ad.toLocaleLowerCase("tr"); }))
      return alert("Bu marka zaten listede.");
    var yeni = { id: "ek_" + Date.now(), ad: ad, logo: yeniLogo, renk: $("ymRenk").value, carpan: Math.max(0.1, +$("ymCarpan").value || 1) };
    ekMarkalar.push(yeni);
    if (!ekMarkaKaydet()) { ekMarkalar.pop(); return; }
    markalariBirlestir(); markaListeCiz(); modalKapat();
    markaSec(yeni.id);
  });

  function markaSil(id) {
    var m = markaBul(id); if (!m || !m.ek) return;
    if (!confirm(m.ad + " markası silinsin mi?")) return;
    ekMarkalar = ekMarkalar.filter(function (x) { return x.id !== id; });
    ekMarkaKaydet(); markalariBirlestir(); markaListeCiz();
    if (durum.marka === id) {
      durum.marka = ""; durum.kalemler = durum.kalemler.filter(function (x) { return x.tur !== "parca"; }); kaydet();
    }
    ciz();
  }
  document.addEventListener("click", function (e) { if (!$("mselect").contains(e.target)) listeAc(false); });

  function markaSec(id) {
    if (id === durum.marka) return;
    var parcaVar = durum.kalemler.some(function (x) { return x.tur === "parca"; });
    if (durum.marka && parcaVar && !confirm("Marka değişecek. Teklifteki parçalar silinsin mi?\n(İşçilik kalemleri kalır)")) return;
    durum.kalemler = durum.kalemler.filter(function (x) { return x.tur !== "parca"; });
    durum.marka = id;
    kaydet(); ciz();
  }

  /* ---------- SEKME / ARAMA ---------- */
  document.querySelectorAll(".tab").forEach(function (b) {
    b.addEventListener("click", function () { durum.sekme = b.dataset.tab; ciz(); });
  });
  $("arama").addEventListener("input", function (e) { durum.arama = e.target.value; listeCiz(); });

  /* ---------- SEPET İŞLEMLERİ ---------- */
  function kalemBul(key) { return durum.kalemler.find(function (x) { return x.key === key; }); }
  function ekle(key, tur, ad, fiyat) {
    var x = kalemBul(key);
    if (x) x.adet++; else durum.kalemler.push({ key: key, tur: tur, ad: ad, fiyat: fiyat, adet: 1 });
    kaydet(); ciz();
  }
  function adetDegis(key, d) {
    var x = kalemBul(key); if (!x) return;
    x.adet += d;
    if (x.adet <= 0) durum.kalemler = durum.kalemler.filter(function (y) { return y.key !== key; });
    kaydet(); ciz();
  }
  function sil(key) { durum.kalemler = durum.kalemler.filter(function (y) { return y.key !== key; }); kaydet(); ciz(); }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var key = b.dataset.key, act = b.dataset.act;
    if (act === "ekle") ekle(key, b.dataset.tur, b.dataset.ad, +b.dataset.fiyat);
    else if (act === "arti") adetDegis(key, 1);
    else if (act === "eksi") adetDegis(key, -1);
    else if (act === "sil") sil(key);
  });

  $("temizle").addEventListener("click", function () {
    if (!durum.kalemler.length || confirm("Teklif temizlensin mi?")) {
      durum.kalemler = []; durum.indirim = 0; $("indirim").value = ""; kaydet(); ciz();
    }
  });
  $("indirim").addEventListener("input", function (e) { durum.indirim = Math.max(0, +e.target.value || 0); kaydet(); toplamCiz(); });
  $("kdv").addEventListener("change", function (e) { durum.kdv = e.target.checked; kaydet(); toplamCiz(); });

  $("ozelForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ad = $("ozelAd").value.trim(), f = +$("ozelFiyat").value, tur = $("ozelTur").value;
    if (!ad || !(f >= 0)) return;
    ekle("ozel_" + Date.now(), tur, ad, f);
    $("ozelAd").value = ""; $("ozelFiyat").value = "";
  });

  /* ---------- ÇİZİM ---------- */
  function kontrolHTML(key, tur, ad, fiyat) {
    var x = kalemBul(key);
    if (!x) return '<button type="button" class="ekle-btn" data-act="ekle" data-key="' + esc(key) + '" data-tur="' + tur +
      '" data-ad="' + esc(ad) + '" data-fiyat="' + fiyat + '">+ Ekle</button>';
    return '<div class="adet"><button type="button" data-act="eksi" data-key="' + esc(key) + '" aria-label="Azalt">−</button><span>' +
      x.adet + '</span><button type="button" data-act="arti" data-key="' + esc(key) + '" aria-label="Arttır">+</button></div>';
  }
  function kalemHTML(key, tur, ad, gosterAd, fiyat) {
    return '<div class="kalem' + (kalemBul(key) ? " sepette" : "") + '"><div class="kalem-bilgi"><div class="kalem-ad">' + gosterAd +
      '</div><div class="kalem-fiyat">' + tl(fiyat) + "</div></div>" + kontrolHTML(key, tur, ad, fiyat) + "</div>";
  }
  var eslesir = function (ad) {
    var q = durum.arama.trim().toLocaleLowerCase("tr");
    return !q || ad.toLocaleLowerCase("tr").includes(q);
  };

  function listeCiz() {
    var m = markaBul(durum.marka); if (!m) return;
    // parçalar
    var gruplar = {};
    markaParcalari(m).filter(function (p) { return eslesir(p.ad); }).forEach(function (p) {
      (gruplar[p.kategori] = gruplar[p.kategori] || []).push(p);
    });
    var ph = Object.keys(gruplar).map(function (kat) {
      return '<div class="kat"><h3>' + esc(kat) + "</h3>" + gruplar[kat].map(function (p) {
        var tamAd = m.ad + " " + p.ad;
        return kalemHTML(m.id + ":" + p.id, "parca", tamAd, '<span class="mk">' + esc(m.ad) + "</span> " + esc(p.ad), p.fiyat);
      }).join("") + "</div>";
    }).join("");
    $("parcaListe").innerHTML = ph || '<div class="bulunamadi">Sonuç bulunamadı.</div>';
    // işçilik
    var ih = ISCILIK.filter(function (i) { return eslesir(i.ad); }).map(function (i) {
      return kalemHTML("isc:" + i.id, "iscilik", i.ad, esc(i.ad), i.fiyat);
    }).join("");
    $("iscilikListe").innerHTML = ih || '<div class="bulunamadi">Sonuç bulunamadı.</div>';
  }

  function hesapla() {
    var parca = 0, isc = 0, adet = 0;
    durum.kalemler.forEach(function (x) {
      var t = x.fiyat * x.adet; adet += x.adet;
      if (x.tur === "parca") parca += t; else isc += t;
    });
    var ara = Math.max(0, parca + isc - durum.indirim);
    var kdv = durum.kdv ? ara * (A.kdvOrani || 0) / 100 : 0;
    return { parca: parca, isc: isc, ara: ara, kdv: kdv, genel: ara + kdv, adet: adet };
  }

  function toplamCiz() {
    var t = hesapla();
    $("tParca").textContent = tl(t.parca);
    $("tIscilik").textContent = tl(t.isc);
    $("tKdv").textContent = tl(t.kdv);
    $("tGenel").textContent = tl(t.genel);
    $("abToplam").textContent = tl(t.genel);
    $("abAdet").textContent = t.adet;
  }

  function sepetCiz() {
    var m = markaBul(durum.marka);
    $("sepetMarka").innerHTML = m ? logoHTML(m) : "";
    $("sepetBos").hidden = durum.kalemler.length > 0;
    var grup = function (tur, baslik) {
      var l = durum.kalemler.filter(function (x) { return x.tur === tur; });
      if (!l.length) return "";
      return '<div class="sg"><h4>' + baslik + "</h4>" + l.map(function (x) {
        return '<div class="sk"><div class="sk-ad">' + esc(x.ad) + '</div><div class="sk-tutar">' + tl(x.fiyat * x.adet) + "</div>" +
          '<div class="sk-alt"><div class="adet"><button type="button" data-act="eksi" data-key="' + esc(x.key) + '">−</button><span>' + x.adet +
          '</span><button type="button" data-act="arti" data-key="' + esc(x.key) + '">+</button></div> × ' + tl(x.fiyat) + "</div>" +
          '<button type="button" class="sil" data-act="sil" data-key="' + esc(x.key) + '">Sil</button></div>';
      }).join("") + "</div>";
    };
    $("sepetIcerik").innerHTML = grup("parca", "Yedek Parçalar") + grup("iscilik", "İşçilik");
    toplamCiz();
  }

  function ciz() {
    var m = markaBul(durum.marka);
    mSel.value = durum.marka;
    Array.prototype.forEach.call(mList.children, function (li) {
      li.setAttribute("aria-selected", li.dataset.id === durum.marka ? "true" : "false");
    });
    $("markaVal").innerHTML = m ? logoHTML(m) + '<span class="mad">' + esc(m.ad) + "</span>" : '<span class="ph">Marka seçin…</span>';
    $("bosDurum").hidden = !!m;
    $("listeAlan").hidden = !m;
    if (m) {
      $("seciliMarka").innerHTML = logoHTML(m, true) + "<div><small>Seçili marka</small><b>" + esc(m.ad) + " Yedek Parçaları</b></div>";
    }
    document.querySelectorAll(".tab").forEach(function (b) { b.classList.toggle("active", b.dataset.tab === durum.sekme); });
    $("tab-parca").hidden = durum.sekme !== "parca";
    $("tab-iscilik").hidden = durum.sekme !== "iscilik";
    listeCiz();
    sepetCiz();
  }

  /* ---------- WHATSAPP / YAZDIR ---------- */
  function teklifMetni() {
    var m = markaBul(durum.marka), t = hesapla(), s = [];
    s.push("*" + (A.firmaAdi || "Teklif") + "*");
    if (m) s.push("Marka: " + m.ad);
    s.push("Tarih: " + new Date().toLocaleDateString("tr-TR"), "");
    [["parca", "YEDEK PARÇALAR"], ["iscilik", "İŞÇİLİK"]].forEach(function (g) {
      var l = durum.kalemler.filter(function (x) { return x.tur === g[0]; });
      if (!l.length) return;
      s.push("*" + g[1] + "*");
      l.forEach(function (x) { s.push("• " + x.ad + (x.adet > 1 ? " x" + x.adet : "") + " — " + tl(x.fiyat * x.adet)); });
      s.push("");
    });
    s.push("Parça: " + tl(t.parca), "İşçilik: " + tl(t.isc));
    if (durum.indirim) s.push("İndirim: -" + tl(durum.indirim));
    if (durum.kdv) s.push("KDV (%" + A.kdvOrani + "): " + tl(t.kdv));
    s.push("*TOPLAM: " + tl(t.genel) + "*", "", "📞 " + (A.telefon || ""));
    return s.join("\n");
  }
  $("waGonder").addEventListener("click", function () {
    if (!durum.kalemler.length) return alert("Önce teklife kalem ekleyin.");
    window.open("https://wa.me/?text=" + encodeURIComponent(teklifMetni()), "_blank");
  });

  $("yazdir").addEventListener("click", function () {
    if (!durum.kalemler.length) return alert("Önce teklife kalem ekleyin.");
    var m = markaBul(durum.marka), t = hesapla(), sira = 0;
    var satirlar = durum.kalemler.map(function (x) {
      return "<tr><td>" + (++sira) + "</td><td>" + esc(x.ad) + "</td><td>" + (x.tur === "parca" ? "Parça" : "İşçilik") +
        '</td><td class="r">' + x.adet + '</td><td class="r">' + tl(x.fiyat) + '</td><td class="r">' + tl(x.fiyat * x.adet) + "</td></tr>";
    }).join("");
    var alt = '<tr><td colspan="5" class="r">Parça Toplamı</td><td class="r">' + tl(t.parca) + "</td></tr>" +
      '<tr><td colspan="5" class="r">İşçilik Toplamı</td><td class="r">' + tl(t.isc) + "</td></tr>" +
      (durum.indirim ? '<tr><td colspan="5" class="r">İndirim</td><td class="r">-' + tl(durum.indirim) + "</td></tr>" : "") +
      (durum.kdv ? '<tr><td colspan="5" class="r">KDV (%' + A.kdvOrani + ')</td><td class="r">' + tl(t.kdv) + "</td></tr>" : "") +
      '<tr><td colspan="5" class="r">GENEL TOPLAM</td><td class="r">' + tl(t.genel) + "</td></tr>";
    $("yazdirAlan").innerHTML =
      '<div class="ust"><div><h2 style="margin:0">' + esc(A.firmaAdi || "") + "</h2><div>Yedek Parça & İşçilik Teklifi</div><div>Tel: " +
      esc(A.telefon || "") + " · " + new Date().toLocaleDateString("tr-TR") + "</div></div>" +
      (m ? '<div style="text-align:right">' + (m.logo ? '<img src="' + esc(m.logo) + '" alt="" onerror="this.remove()">' : "") + '<div><b>' + esc(m.ad) + "</b></div></div>" : "") +
      "</div><table><thead><tr><th>#</th><th>Kalem</th><th>Tür</th><th class='r'>Adet</th><th class='r'>Birim</th><th class='r'>Tutar</th></tr></thead><tbody>" +
      satirlar + "</tbody><tfoot>" + alt + "</tfoot></table>" +
      '<p style="font-size:12px;margin-top:14px">Fiyatlar bilgi amaçlıdır; arıza tespitinden sonra kesinleşir.</p>';
    setTimeout(function () { window.print(); }, 150);
  });

  $("abGor").addEventListener("click", function () { $("sepetPanel").scrollIntoView({ behavior: "smooth", block: "start" }); });

  /* ---------- BAŞLAT ---------- */
  $("telTxt").textContent = A.telefon || "";
  $("telBtn").href = "tel:" + String(A.telefon || "").replace(/\s/g, "");
  $("kdvOranTxt").textContent = A.kdvOrani || 0;
  $("kdv").checked = durum.kdv;
  if (durum.indirim) $("indirim").value = durum.indirim;
  ciz();
})();
