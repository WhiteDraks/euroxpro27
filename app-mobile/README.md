# EUROXPRO'27 Delegate App (PWA)

Kongre delegeleri için ana ekrana eklenebilen web uygulaması. Ana site (Next.js, Vercel) ile aynı repoda ama **ayrı çalışır**: kendi küçük Node.js sunucusu var.

- **Canlı ajanda:** "Şimdi / Sıradaki" kartı, gün seçici, kongre öncesi geri sayım. Organizatörler bir oturumu ertelendi / yer değişti / iptal olarak işaretleyip not yazabilir; değişiklik açık olan tüm telefonlara anında gider.
- **Harita:** Antalya'daki havalimanı, otogar ve gezi noktaları; yol tarifi Apple Haritalar veya Google Maps'te açılır. Kongre mekânı açıklanınca `public/places.js` dosyasına eklenir.
- **Mesajlaşma:** Herkesin olduğu genel sohbet ve birebir mesajlar. Her mesaj okuyanın diline otomatik çevrilir; "Orijinalini göster" ile asıl metin görülür.
- **Diller:** Türkçe, English, Polski (Lehçedeki çoğul biçimleri dahil). İlk açılışta telefonun dili seçilir.
- **Giriş:** Sadece e-posta + şifre. Google ile giriş yok.
- **Tasarım:** Apple HIG: sistem fontu, büyük başlıklar, gruplu listeler, alt sekme çubuğu, açık/koyu görünüm. Siyah, bordo, beyaz.
- **Çevrimdışı:** Uygulama kabuğu, son görülen ajanda ve harita karoları internet yokken de açılır.

## Bağımlılık yok

`npm install` gerekmez. Sadece Node.js 18.17 veya üstü. Harita için Leaflet `public/vendor/leaflet` içinde hazır duruyor.

```bash
cd app-mobile
node server.js          # http://localhost:3000
```

## Ayarlar (ortam değişkenleri)

Hosting panelindeki "Environment variables" bölümüne ya da `app-mobile/.env` dosyasına yazılır (örnek: `.env.example`).

| Değişken | Ne işe yarar |
| --- | --- |
| `PORT` | Sunucunun dinlediği port (hosting genelde kendisi verir). |
| `NODE_ENV=production` | Çerezleri yalnızca HTTPS üzerinden gönderir. |
| `ADMIN_EMAILS` | Ajandayı canlı güncelleyebilecek organizatör e-postaları, virgülle. Bu adreslerle kayıt olan hesaplar organizatör olur. |
| `TRUST_PROXY=1` | nginx veya hosting proxy'si arkasında çalışıyorsa (çoğu hosting) giriş denemesi sınırı doğru IP'yi görsün. |
| `DATA_DIR` | Kullanıcılar, mesajlar ve çeviri önbelleğinin tutulduğu klasör. Yeniden başlatmada **silinmeyen** bir yer olmalı. |
| `DEEPL_API_KEY` | Önerilen çeviri servisi. DeepL API Free ayda 500.000 karakter ücretsiz, Lehçe ve Türkçe kalitesi en iyisi. |
| `LIBRETRANSLATE_URL` | Kendi LibreTranslate sunucunuz varsa. |
| `MYMEMORY_EMAIL` | Hiçbir anahtar yoksa ücretsiz MyMemory kullanılır (günlük sınırlı); e-posta yazmak sınırı yükseltir. |

## Yayına alma

Uygulama sürekli açık kalan bir Node süreci ve kalıcı bir disk ister (canlı mesajlar için). Bu yüzden **Vercel'e uygun değil**; ana site Vercel'de kalır, uygulama ayrı bir yerde çalışır. Örneğin `app.euroxpro27.com` gibi bir alt alan adı verilebilir.

**Node.js destekli hosting (ör. Hostinger Business / Cloud, cPanel "Setup Node.js App"):**
1. Uygulama kökü olarak `app-mobile` klasörünü seçin, başlangıç dosyası `server.js`.
2. Ortam değişkenlerini girin (`NODE_ENV=production`, `TRUST_PROXY=1`, `ADMIN_EMAILS`, `DEEPL_API_KEY`).
3. Başlatın. `npm install` adımı boş geçer, sorun değil.

**VPS (Ubuntu):**
```bash
git clone https://github.com/WhiteDraks/euroxpro27 && cd euroxpro27/app-mobile
cp .env.example .env    # düzenleyin
npx pm2 start server.js --name euroxpro-app && npx pm2 save
```
Önüne nginx koyup HTTPS (Let's Encrypt) açın. `/api/stream` için `proxy_buffering off;` ekleyin.

**Docker (Render, Railway, Fly.io, Coolify...):**
```bash
docker build -t euroxpro-app app-mobile
docker run -p 3000:3000 -v euroxpro-data:/data -e ADMIN_EMAILS=... euroxpro-app
```
`/data` için kalıcı disk bağlayın.

PWA'nın ana ekrana eklenebilmesi için site **HTTPS** üzerinden açılmalı.

## Test için zaman makinesi

Kongre tarihleri gelmeden canlı ajandayı görmek için adrese `?now=` ekleyin, örneğin `/agenda?now=2027-04-01T10:05`. Normale dönmek için `?now=off`.

## Dosyalar

```
server.js            HTTP sunucu ve API (kayıt, giriş, ajanda, mesajlar, canlı akış)
lib/store.js         JSON dosyası tabanlı veri deposu
lib/translate.js     Otomatik çeviri (DeepL / LibreTranslate / MyMemory)
lib/agenda-seed.json İlk ajanda (ana sitedeki taslak programdan)
public/              Uygulamanın kendisi (index.html, app.js, app.css, i18n.js, places.js, sw.js)
```
