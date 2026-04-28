# SEO Audit Raporu — Uçuş Yakala

**Site Tipi:** Static SPA (uçuş fiyat karşılaştırma demo, GitHub Pages)
**Audit Tarihi:** 2026-04-28
**Kapsam:** `index.html` + statik varlıklar (kod-bazlı audit)
**Canonical Domain:** https://mustafa-turkekul.github.io/ucus-yakala/

---

## Yönetici Özeti

Site bir static demo SPA olarak yapılandırılmış ve SEO için temel altyapı eksiklikleri var. Tüm dinamik içerik (Adana kartı, popüler rotalar, sonuçlar) client-side JavaScript ile render ediliyor — Googlebot için indekslenebilir olsa da, statik HTML'de görünür içerik son derece sınırlı.

**En kritik 5 sorun:**
1. `robots.txt` ve `sitemap.xml` yok
2. Open Graph / Twitter Card meta etiketleri yok (sosyal paylaşım = sıfır görsel)
3. Canonical URL tanımlı değil
4. Schema.org structured data yok (Organization, WebSite, SearchAction)
5. Tek sayfa, derinlik yok — popüler rota başına ayrı landing page yok (büyük SEO kaybı)

---

## 1. Crawlability & Indexation

| Bulgu | Etki | Kanıt | Düzeltme | Öncelik |
|---|---|---|---|---|
| `robots.txt` yok | Yüksek | Proje kökünde dosya yok | Kök dizine `robots.txt` ekle, `Sitemap:` satırı içersin | 1 |
| `sitemap.xml` yok | Yüksek | Proje kökünde dosya yok | En azından `/` URL'ini içeren basit bir sitemap üret | 1 |
| Canonical tag yok | Orta | `index.html:3-14` `<head>` içinde `<link rel="canonical">` yok | `<link rel="canonical" href="https://<domain>/" />` ekle | 2 |
| GitHub Pages alt-dizin riski | Orta | README'de `https://yourusername.github.io/reponame/` deploy hedefi | Custom domain kullanılacaksa canonical buna göre ayarlanmalı | 3 |

---

## 2. Technical Foundations

| Bulgu | Etki | Kanıt | Düzeltme | Öncelik |
|---|---|---|---|---|
| HTTPS | OK | GitHub Pages otomatik HTTPS sağlar | — | — |
| Mobile viewport | OK | `index.html:5` doğru tanımlanmış | — | — |
| `lang="tr"` | OK | `index.html:2` doğru | — | — |
| Render-blocking Google Fonts | Düşük-Orta | `index.html:11` Inter fontu 6 ağırlıkta yükleniyor (400-900) — LCP'yi etkiler | Sadece kullanılan ağırlıkları (400, 600, 800) ekle | 3 |
| JS dosyaları senkron | Düşük | `index.html:213-216` 4 ayrı script, `defer` yok | `defer` ekle | 4 |

---

## 3. On-Page SEO

| Bulgu | Etki | Kanıt | Düzeltme | Öncelik |
|---|---|---|---|---|
| Title 38 karakter — kısa ama OK | Düşük | `index.html:7` "Uçuş Yakala — En Ucuz Uçuş Biletleri" | Daha güçlüsü: "Uçuş Yakala — Ucuz Uçak Bileti Karşılaştır & Yakala" | 4 |
| Meta description kısa | Düşük | `index.html:6` 113 karakter (150-160 ideal) | Genişlet: fiyat aralığı, havayolu sayısı, "ücretsiz" gibi tetikleyiciler | 3 |
| H1 doğru | OK | `index.html:31-34` tek H1, "En ucuz uçuşu hemen yakala" | — | — |
| H2 hiyerarşisi mantıklı | OK | `index.html:166, 188` "Uçuş Sonuçları", "İstanbul'dan Popüler Rotalar" | — | — |
| Open Graph / Twitter Card YOK | Yüksek | `<head>` içinde `og:*` veya `twitter:*` yok | Ekle | 2 |
| Favicon yok | Düşük | `<link rel="icon">` yok | SVG favicon ekle | 4 |
| Görsel alt text — n/a | — | HTML'de `<img>` yok, hepsi emoji/CSS | İlerde görsel eklenirse alt zorunlu | — |

---

## 4. Structured Data (Schema.org)

Hiçbir JSON-LD bulunmuyor. Bu site için yüksek değer üretecek şemalar:

- `WebSite` + `SearchAction` (Google sitelinks search box olasılığı)
- `Organization` (logo, sameAs sosyal hesaplar)

| Bulgu | Etki | Düzeltme | Öncelik |
|---|---|---|---|
| Hiç JSON-LD yok | Yüksek | `WebSite` + `SearchAction` + `Organization` ekle | 2 |
| Sitelinks Search Box olasılığı kayıp | Orta | `SearchAction` ile Google sitelinks search box gösterebilir | 2 |

---

## 5. Content Quality & Site Architecture (En Büyük Fırsat)

Site tek sayfadan oluşuyor. SEO için bu büyük bir tavan. Asıl trafik fırsatı:

| Eksik Sayfa Türü | Hedef Keyword Örnekleri |
|---|---|
| Rota landing page (`/istanbul-londra-ucak-bileti/`) | "istanbul londra uçak bileti", "ist-lhr ucuz bilet" |
| Havayolu sayfası (`/havayollari/turkish-airlines/`) | "turkish airlines uçuş ara" |
| Şehir sayfası (`/sehirler/adana/`) | "adana uçak bileti" |
| Blog/rehber (`/rehber/en-ucuz-bilet-nasil-bulunur/`) | informational long-tail |

Mevcut "Adana Featured Card" ve "Popüler Rotalar" sadece anasayfada görünüyor — bunlar ayrı, indekslenebilir URL'lerle programmatic SEO için ideal.

| Bulgu | Etki | Düzeltme | Öncelik |
|---|---|---|---|
| Tek sayfa, derinlik yok | Çok yüksek | Rota başına statik HTML üret | 1 |
| Adana ve popüler rotalar sadece JS ile, ayrı URL yok | Yüksek | Her rota için `/rotalar/<from>-<to>/` üret | 2 |
| Footer'da iç link yok | Orta | Popüler şehirler, havayolları link grubu ekle | 3 |

---

## 6. International SEO

Site şu an sadece Türkçe. İleride İngilizce eklenirse:
- `<html lang="tr">` doğru
- `hreflang` etiketleri gerekecek (`tr-TR`, `en`)
- `x-default` İngilizce'ye gitmeli

---

## Öncelikli Aksiyon Planı

### 🔴 Kritik (bu hafta) — BU AUDİT'TE UYGULANDI
1. ✅ `robots.txt` + `sitemap.xml`
2. ✅ Canonical tag, Open Graph, Twitter Card
3. ✅ JSON-LD: `WebSite` + `SearchAction` + `Organization`
4. ⏳ Rota landing page stratejisi (sonraki sprint)

### 🟡 Yüksek (bu ay)
5. Programmatic SEO ile rota sayfaları (`/rotalar/istanbul-londra/`)
6. Footer'a iç link grupları
7. Meta description 150-160 karaktere genişlet
8. Favicon SVG (✅ uygulandı)

### 🟢 Quick Win
9. Google Fonts ağırlıklarını 6'dan 3'e indir (LCP)
10. Script'lere `defer` ekle

---

## Bu Audit'te Yapılan Değişiklikler

- `robots.txt` oluşturuldu
- `sitemap.xml` oluşturuldu
- `assets/icons/favicon.svg` oluşturuldu
- `index.html` güncellendi:
  - Canonical link
  - Open Graph meta'ları
  - Twitter Card meta'ları
  - Favicon link
  - JSON-LD (`WebSite` + `SearchAction` + `Organization`)
  - Meta description genişletildi
