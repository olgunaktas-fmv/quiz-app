# Quiz Uygulaması — Devir Notu

## Proje
Çok oyunculu gerçek zamanlı bilgi yarışması. Öğretmen (admin) yarışma açar, soru havuzundan soru gönderir; öğrenciler (oyuncular) tablottan yarışmaya katılıp cevap verir.

- Stack: React 18 + Vite + Firebase (Auth + RTDB) + Vercel
- Route: hash routing — `#/admin` admin, gerisi oyuncu
- Canlı: `https://quiz-app-beta-peach-19.vercel.app/` (admin: `#/admin`)
- Repo: `olgunaktas-fmv/quiz-app`, dal `main` — Vercel GitHub'a bağlı, her push otomatik deploy

## Komutlar
- `npm run dev` — yerel geliştirme
- `npm run build` — build doğrulaması (deploydan önce mutlaka çalıştır)
- `npm run preview` — build'i yerelde önizle
- Deploy: `git push origin main` (Vercel otomatik)
- Windows notu: Vercel CLI varsa `vercel.cmd` gerekir; `vercel env add` prompt'ta asılı kalır.

## Firebase
- Proje: `quiz-app-5238c`; RTDB `https://quiz-app-5238c-default-rtdb.europe-west1.firebasedatabase.app` (test modu, kurallar açık)
- Env: `.env` içinde `VITE_FIREBASE_*` (7 değişken) — Vercel'de aynıları tanımlı
- Auth: tek admin hesabı var; kullanıcılar `{username}@quiz-app.local` e-postasına map edilir
- RTDB ile hızlı kontrol örneği:
  `Invoke-RestMethod "https://quiz-app-5238c-default-rtdb.europe-west1.firebasedatabase.app/questions.json" | ConvertTo-Json -Depth 10`

## RTDB Şeması (v2)
- `contests/{id}` → `{ name, password, createdBy, status: open|live|finished, questionIds?, createdAt }`
- `contestPlayers/{contestId}/{uid}` → `{ username, joinedAt }`
- `answers/{contestId}/{questionId}/{uid}` → `{ option, correct, time, points? }`
- `results/{contestId}/{uid}` → `{ username, score, correct, total, ... }`
- `presence/{uid}` → çevrimiçi işareti
- `questions/{id}` → `{ text, imageUrl?, grade (Genel|1..12), branch?, difficulty (kolay|orta|zor), options (string[] veya {text,imageUrl?}[]), correctIndex, timeLimit, createdAt }`
- `admins/{username}` → admin yetkisi (yalnızca `admin` hesabı var)

## Önemli Dosyalar
- `src/App.jsx` — hash'ten admin/player ayrımı
- `src/main.jsx` — kök render; **ErrorBoundary** ile sarılı
- `src/components/ErrorBoundary.jsx` — hata olursa siyah ekran yerine "Bir şeyler ters gitti" + yenile gösterir
- `src/components/admin/AdminScreen.jsx` — sekmeler: `contests` (varsayılan), `pool`, `reports`
- `src/components/admin/QuestionPool.jsx` — soru havuzu + ekleme formu (şık görselleri, sınıf/branş/zorluk, süre)
- `src/components/admin/ImageUrlInput.jsx` — görsel URL kutusu (yapıştır/sürükle + önizleme)
- `src/components/admin/ContestDetail.jsx` — yarışma içi: soru seç/sıra, canlı yayın
- `src/components/admin/Results.jsx` + `ResultsTable.jsx` — raporlar
- `src/components/player/*` — oyuncu ekranları (QuestionScreen/RevealScreen `normalizeOptions` + `useFitScale` kullanır)
- `src/lib/questionMeta.js` — sınıf/branş/zorluk seçenekleri, `normalizeOptions`, `optionText`, `gradeOf`, `difficultyLabel`
- `src/hooks/useQuestions.js`, `useContests.js`, `useContest.js`, `useSessionGuard.js`, `usePresence.js`, `useFitScale.js`, `useCountdown.js`
- `src/db/api.js` — `addQuestion` yeni şemayla yazar (boş alanlar silinir), `createContest`, `removeQuestion` vb.
- `src/db/schema.js`, `src/db/auth.js`, `src/firebase.js`

## Son Durum (5f15e22 + f2d2935)
- Sorun: Admin, soru ekledikten sonra "Soru Havuzu" sekmesine dönünce siyah/boş ekran görüyordu.
- Kök neden: `QuestionPool.jsx` kart render'ında `difficultyLabel(q)` kullanılıyordu ama fonksiyon import edilmemişti → `ReferenceError` → ErrorBoundary olmadığı için React tüm ağacı boşaltıyordu.
- Çözüm 1: `QuestionPool.jsx` import'una `difficultyLabel` eklendi.
- Çözüm 2: Kök `ErrorBoundary` eklendi — gelecekteki hatalar siyah ekran yerine okunabilir mesajla görünür.
- RTDB'de test soruları var: `-OzQwCreTgPYCH3Wz7j3` = "3+2" (Genel/Matematik/orta, 20s).

## Sıradaki Adımlar (öncelik sırası)
1. Canlıda tekrar test: `#/admin` → Soru Havuzu sekmesi kartları görünmeli.
2. Devam edilecek işler (şimdiye dek):
   - Raporlar (Results) görünümünün oyuncu verileriyle tam doğrulanması
   - Puanlama `results` şemasının canlı testi
   - Opsiyonel: sekme bazlı ErrorBoundary (admin sekmelerinden biri çökerse üst menü açık kalsın)
   - Opsiyonel: büyük bundle (523 kB) için code-splitting
