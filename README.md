# Yogarama Anatomy Glossary

English–Turkish anatomy glossary for **Yogarama / Asana Lab**. A calm, responsive, Turkish-first reference for learning the language of anatomy.

> Initial version / İlk sürüm. Browser rendering has not been verified; see the validation report.

## Türkçe

### Ne içerir?

- Kemik, kas, eklem, yön/düzlem, hareket ve doku terimleri
- Türkçe ↔ İngilizce arama; Türkçe karakter olmadan da arama
- Kategori filtreleri, alfabetik sıralama ve iki dilli terim ayrıntıları
- Terim bazında kaynak bağlantıları ve paylaşılabilir sayfa adresleri
- Tekrar kullanılabilir JSON veri seti ve bağımsız JavaScript arama modülü
- Klavye desteği, görünür odak, ekran okuyucu durum mesajları ve mobil tasarım
- Ücretli API, hesap, çerez, izleme veya çalışma zamanı bağımlılığı yok

### Hızlı önizleme

`yogarama-glossary-standalone.html` dosyası tüm arayüzü ve veriyi içerir; internet bağlantısı olmadan tarayıcıda açılabilir. Bu sürümde paylaşılabilir URL durumu kapalıdır. Normal modüler sürüm ve URL desteği için aşağıdaki yerel sunucuyu kullanın.

### Çalıştırma

Node.js 22 veya üzeri gerekir. Paket kurulumu gerekmez.

```sh
npm run dev
```

Terminalde yazan `http://127.0.0.1:4173` adresini açın. `index.html` dosyasını doğrudan çift tıklamak yerine yerel sunucuyu kullanın.

```sh
npm test       # veri ve arama testleri
npm run check  # sözdizimi + testler
npm run build  # statik çıktı: dist/
```

Aramaya odaklanmak için `/` veya `Ctrl/Cmd + K`; ayrıntıyı kapatmak için `Esc`. Arama dili arayüz dilinden bağımsızdır: her zaman iki dilde arar.

### İçerik ve sınırlar

Açıklamalar bu proje için özgün olarak yazılmıştır. Terimler güvenilir, herkese açık anatomi ve üniversite kaynaklarıyla kontrol edilmiştir. Her kayıt kendi kaynaklarına bağlanır. Türkçe karşılıklar eğitim geleneği ve bağlama göre farklılaşabilir. İlk sürüm bağımsız uzman incelemesinden geçmemiştir.

Bu araç genel eğitim içindir; tanı, tedavi veya kişisel egzersiz tavsiyesi değildir. Anatomi bilgisi tek başına bir yoga duruşunun kişi için güvenli olup olmadığını belirlemez.

## English

### Offline edition

Open `yogarama-glossary-standalone.html` for the self-contained edition. It bundles the same CSS, JavaScript, and data without remote requests. URL synchronization is disabled in that edition. Regenerate it with `npm run build:single`. Browser rendering remains unverified in this environment.

### Quick start

Requires Node.js 22+. No installation step or dependencies.

```sh
npm run dev
npm run check
npm run build
```

Open the localhost URL printed by the server. Build output is a static site in `dist/`, ready for an approved static host. It works in a subdirectory and makes no calls to paid APIs or analytics services. Fonts are system fonts; no external font or image requests are made. Reference links open only when clicked.

### Reuse

- `data/terms.json`: bilingual, source-linked structured content
- `data/sources.json`: source metadata
- `src/search.js`: framework-free normalization, search, and validation
- `src/glossary.js`: embeddable interface
- [Integration guide](docs/INTEGRATION.md): schema, module examples, UI embedding, and deep links
- [Contributing](CONTRIBUTING.md): content and development review checklist
- [Validation report](docs/VALIDATION.md): checks actually performed and known limits

### Educational boundaries

Definitions were written originally for this project and checked against public educational references. Source text and illustrations are not reproduced. Terminology can vary; this initial release has not undergone independent expert review. It is for general education and does not provide diagnosis, treatment, or individualized exercise advice.

## License / Lisans

This project is licensed under the [MIT License](LICENSE). Copyright (c) 2026 Yogarama Ltd.

Bu proje [MIT Lisansı](LICENSE) ile sunulur. `private: true` in `package.json` prevents accidental npm publication; it does not determine GitHub repository visibility. Website deployment is not part of this release preparation.

## Project structure

```text
assets/       Original SVG favicon
src/          UI, scoped styles, and reusable search
data/        Original terms and public references
scripts/      Local server and static build
tests/       Node.js unit/data checks
 docs/        Integration and validation
```
