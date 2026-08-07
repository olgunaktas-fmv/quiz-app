# Real-Time Bilgi Yarışması (Quiz Arena)

Admin kontrollü, çoklu yarışma destekli, gerçek zamanlı bilgi yarışması uygulaması.
**React 18 + Vite + Firebase (Auth + Realtime Database) + Vercel.**

> Bu doküman projenin "hafıza dosyasıdır". Canlı bilgiler, mimari, kurulum ve sorun
> giderme burada tutulur. (Son güncelleme: Ağustos 2026)

---

## 1. Canlı Adresler

| Ekran | URL |
|---|---|
| Oyuncu | https://quiz-app-beta-peach-19.vercel.app/ |
| Admin | https://quiz-app-beta-peach-19.vercel.app/#/admin |

- Hash routing kullanılır: oyuncu `#/` (veya boş), admin `#/admin`.
- Admin girişi: kullanıcı adı `admin` + Firebase Auth şifresi.

---

## 2. Teknik Yığın

- **React 18** + **Vite 5** (JavaScript, JSX)
- **Firebase Web SDK 10**: Authentication (Email/Password) + Realtime Database
- **Vercel** (GitHub entegreli, her push'ta otomatik deploy)
- **GitHub**: `olgunaktas-fmv/quiz-app`, dal `main`

---

## 3. Kurulum (Yerel Çalıştırma)

1. Repoyu klonlayın.
2. `.env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun (bkz. §4).
3. `npm install`
4. `npm run dev`

```bash
npm install
npm run dev
```

- Oyuncu: `http://localhost:5173/`
- Admin: `http://localhost:5173/#/admin`

---

## 4. Firebase Yapılandırması

### 4.1 Gerekli `.env` değişkenleri (7 adet)

Firebase Console → Proje Ayarları → Uygulamalar'dan alınır.

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 4.2 Bu projenin değerleri (referans)

```bash
VITE_FIREBASE_API_KEY=AIzaSyAdnDvntWD9tSkwDNEqeJgVgPHeEcNvMHk
VITE_FIREBASE_AUTH_DOMAIN=quiz-app-5238c.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://quiz-app-5238c-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=quiz-app-5238c
VITE_FIREBASE_STORAGE_BUCKET=quiz-app-5238c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1067898048579
VITE_FIREBASE_APP_ID=1:1067898048579:web:c93a8e850f3ab31949c4f6
```

> Bu değerler tarayıcıda zaten yayında olduğu için "gizli" değildir; ancak `.env`
> dosyası git'e gönderilmemelidir (`.gitignore` içinde).

### 4.3 Firebase Console adımları

1. **Authentication** → **Sign-in method** → **Email/Password** → **Enable**.
2. **Realtime Database** oluşturun → kuralları geçici olarak test modunda açın
   (canlıda sıkılaştırın, bkz. §9).
3. Admin hesabı: Authentication → Users → **Add user** →
   e-posta `admin@quiz-app.local` + güçlü bir şifre.
4. RTDB'ye admin bayrağını elle yazın:
   ```
   admins/admin = true
   ```
   (Konsol kullanıcı adı `admin` olanın yetkisini kontrol eder.)

---

## 5. Deploy (Vercel)

- Proje: **quiz-app** (scope `olgunaktas-1512s-projects`)
- GitHub'a bağlı; `main` dalına her push → otomatik production deploy.
- Vercel'de 7 adet `VITE_FIREBASE_*` ortam değişkeni tanımlıdır.
- `vercel.json` tüm yolları `index.html`'e yönlendirir (SPA + hash routing).

Yerelden deploy gerekirse: `npm run build` → `vercel --prod` (Windows'ta `vercel.cmd`).

---

## 6. Veritabanı Şeması (v2 — Çoklu Yarışma)

```
db/
├─ admins/{username}/          → true  (admin yetkisi; "admin" → true)
├─ users/{uid}/                → { username, createdAt }  (kayıtta otomatik yazılır)
├─ questions/{questionId}/     → Soru havuzu (admin ekler)
│  ├─ text, imageUrl?,                  (metin + görsel birlikte)
│  ├─ grade: "Genel" | "1".."12",       (sınıf; "Genel" ayrı kategoridir)
│  ├─ branch?,                         (branş, örn. Matematik)
│  ├─ difficulty: kolay|orta|zor,      (zorluk)
│  ├─ points?,                         (puan, opsiyonel)
│  ├─ options: [{ text, imageUrl? } | "metin"],   (şıklar; her şıkta görsel olabilir)
│  ├─ correctIndex, timeLimit, createdAt
│
├─ contests/{contestId}/       → Yarışma kaydı (admin oluşturur)
│  ├─ name, password, status: open|live|finished,
│  ├─ phase: waiting|question|reveal|finished,
│  ├─ startedAt, questionStartedAt, currentQuestionId, roundNumber,
│  ├─ createdBy, createdAt, finishedAt
│
├─ contestPlayers/{contestId}/{uid}   → { username, joinedAt }
│
├─ answers/{contestId}/{questionId}/{uid}  → { selectedIndex, answeredAt }
│
├─ results/{contestId}/{uid}      → { answeredCount, correctCount, wrongCount, total }
│
└─ presence/{uid}/sessions/{sessionId} → { since }  (canlı/çevrimiçi durumu)
```

**Yarışma akışı (admin):**
1. `status: open` ile yarışma oluştur; oyuncular şifreyle katılır.
2. "Soruyu Gönder" → `phase: question` + `currentQuestionId` + `questionStartedAt` (geri sayım senkronu).
3. Süre dolunca "Cevapları Aç" → `phase: reveal` → `computeAndStoreResults` ile `results/{contestId}` yazılır.
4. "Sıradaki Soru" → `phase: waiting`; "Yarışmayı Bitir" → `finished` + `finishedAt`.

**Devam mantığı:** Yarışmacı gecikmeli giriş yaparsa `questionStartedAt` üzerinden kalan saniyeden devam eder.
Katılım kuralı: devam eden yarışmaya yalnızca daha önce katılanlar girer.

---

## 7. Oturum ve Çoklu Cihaz Mimarisi

Sorun: okulda paylaşımlı tarayıcı/profil veya aynı hesabın birden çok sekmede açılması
"ilk giren oyuncu herkese görünür" hatasına yol açıyordu. Çözüm üç katman:

| Katman | Dosya | Ne yapar |
|---|---|---|
| A. Oturum temizliği | `src/firebase.js` | Auth kalıcılığı `sessionStorage`: sekme kapanınca oturum silinir, açılış temiz "giriş sayfası" olur. |
| A. Yeni Oyuncu | `ContestList.jsx` | Ana ekranda belirgin **"Yeni Oyuncu"** butonu (çıkış + yeniden giriş). |
| B. Çoklu sekme koruması | `src/hooks/useSessionGuard.js` | `BroadcastChannel` ile aynı cihazda aynı hesap başka sekmede açıksa **yeni sekme otomatik çıkış yapar**; ilk sekme kalır. |
| C. Çapraz cihaz çevrimiçi | `src/hooks/usePresence.js` | RTDB `presence/{uid}/sessions`; `onDisconnect` ile sekme kapanınca otomatik "çevrimdışı". Aynı hesap iki cihazda açıksa **"Bu oyuncu zaten başka bir cihazda/sekmede giriş yapmış"** uyarısı. |

Kullanıcı adı e-postaya `{username}@quiz-app.local` olarak map edilir (`src/db/auth.js`).
`useAuth` kullanıcı adını önce `users/{uid}`'den, yoksa e-postanın `@` öncesinden türetir
(konsolda elle oluşturulan hesaplar için fallback).

---

## 8. Önemli Dosyalar

| Dosya | Görevi |
|---|---|
| `src/firebase.js` | Firebase config, `auth`/`db` export, sessionStorage persistence |
| `src/App.jsx` | Hash'e göre Admin/Player ekranı seçimi |
| `src/db/schema.js` | Tüm RTDB yol referansları |
| `src/db/auth.js` | register / login / logout (email map) |
| `src/db/api.js` | Yarışma API'leri + `computeAndStoreResults` |
| `src/lib/questionMeta.js` | Sınıf/branş/zorluk sabitleri + şık normalizasyonu |
| `src/hooks/useAuth.js` | Oturum + kullanıcı adı + admin kontrolü |
| `src/hooks/useSessionGuard.js` | Çoklu sekme koruması |
| `src/hooks/usePresence.js` | Çevrimiçi durumu (RTDB) |
| `src/components/admin/*` | Admin: giriş, yarışma kontrolü, soru havuzu, sonuçlar |
| `src/components/player/*` | Oyuncu: giriş, yarışma listesi/katılım, soru, açıklama, bitiş |
| `database.rules.json` | RTDB kuralları (şu an test modunda açık) |
| `vercel.json` | SPA rewrites |

---

## 9. Güvenlik Notu (Yapılacak)

`database.rules.json` şu an **herkese açık okuma/yazma** izni verir (test modu).
Canlıya daha sıkı alınmak istenirse:

- Kural sıkılaştırması: `auth.uid` kontrolü ile oyuncuların yalnızca kendi
  `answers/.../{uid}` ve `contestPlayers/.../{uid}` kayıtlarını yazabilmesi.
- `questions.correctIndex`'in oyuncular tarafından okunmaması (ayrı node'a taşıma).
- Admin yazma işlemlerinin yalnızca `admins/` listesindeki UID'lere açılması.

---

## 10. Sorun Giderme / Bilinen Durumlar

- **"Giriş başarısız" / "Bu kullanıcı adı alınmış olabilir":** Büyük olasılıkla kullanıcı
  adı daha önce alınmış (hesap var ama şifre hatırlanmıyor). Yeni kullanıcı adıyla
  kayıt olun veya Console → Authentication → Users üzerinden şifre sıfırlayın/silin.
- **Admin girişi kullanıcı adı boş geliyor:** Konsolda elle açılan hesap için
  `users/{uid}` yoktur → `useAuth` e-posta fallback'i kullanır (düzeltildi).
- **Çevrimiçi uyarısı yenileme sonrası kısa süre yanıp söner:** Eski oturumun
  `onDisconnect` ile temizlenmesi 1–5 saniye sürebilir; normaldir.
- **Windows + Vercel CLI:** `Start-Process`/komut için `vercel.cmd` gerekir;
  `vercel env add` prompt'ta asılı kalır → `--value` ile ekleyin.

---

## 11. Güncel Hesap/Veri Durumu (Ağustos 2026)

- Firebase Auth'ta **yalnızca `admin`** hesabı var (`admin@quiz-app.local`).
- RTDB'de yalnızca `admins/admin = true` ve `questions` (soru havuzu) var; tüm
  kullanıcı/yarışma/cevap verileri temizlendi (baştan test için).
- Oyuncu kaydı/girişi uçtan uca doğrulandı (çalışıyor).

## 12. Hızlı Komutlar

```bash
npm run dev       # yerel geliştirme
npm run build     # production build (dist/)
npm run preview   # build çıktısını yerelde önizleme
```
