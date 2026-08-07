# Real-Time Bilgi Yarışması (React + Firebase)

Admin kontrollü, tüm cihazlara aynı anda soru ileten çok oyunculu bilgi yarışması uygulaması.

## Kurulum

1. Firebase Console'da bir proje oluşturun.
2. **Realtime Database**'i etkinleştirin (test modunda başlatabilirsiniz).
3. Proje ayarlarından web uygulaması ekleyin ve `.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurun.
4. `database.rules.json` içeriğini Realtime Database > Kurallar bölümüne yapıştırın.

```bash
npm install
npm run dev
```

- Yarışmacı ekranı: `http://localhost:5173/`
- Admin ekranı: `http://localhost:5173/#/admin`

## Veritabanı Şeması

```
quiz-app/
├─ game/                          ← Canlı yayın durumu (tüm cihazlar dinler)
│  ├─ status: "waiting" | "live" | "reveal" | "finished"
│  ├─ currentQuestionId: "<soru id>"
│  ├─ roundNumber: 1
│  └─ startedAt: <sunucu zaman damgası>   ← geri sayımı senkronize eder
│
├─ questions/{questionId}/        ← Soru havuzu (admin yazar)
│  ├─ text: "Türkiye'nin başkenti?"
│  ├─ imageUrl: "https://..."     (opsiyonel)
│  ├─ options: ["Ankara","İstanbul","İzmir","Bursa","Eskişehir"]
│  ├─ correctIndex: 0
│  ├─ timeLimit: 20               ← saniye
│  └─ createdAt: <zaman damgası>
│
├─ players/{playerId}/            ← Yarışmacılar
│  ├─ name: "Ayşe"
│  └─ joinedAt: <zaman damgası>
│
├─ answers/{questionId}/{playerId}/   ← Canlı cevap akışı (admin feed'i)
│  ├─ selectedIndex: 2
│  ├─ timeTakenMs: 5230           ← hız puanı için
│  └─ answeredAt: <zaman damgası>
│
└─ scores/{playerId}/             ← Skor tablosu
   ├─ total: 340
   └─ correctCount: 3
```

## Akış Mantığı

1. Admin **"Soruyu Gönder"** dediğinde `game.status = "live"`, `currentQuestionId` ve `startedAt` güncellenir.
2. Tüm bağlı cihazlarda `useGameState()` hook'u bu değişikliği anında alır ve soruyu render eder.
3. Yarışmacı cevabı `answers/{questionId}/{playerId}` altına yazılır; admin paneli aynı anda cevap sayısını görür.
4. Süre bitince cevaplama kilitlenir. Admin **"Cevapları Aç"** dediğinde `status = "reveal"` olur ve puanlar `computeAndStoreScores` ile `scores/` altına yazılır.
5. `status = "waiting"` ile sıradaki soruya geçilir; **"Yarışmayı Bitir"** `status = "finished"` yapar.

## Puanlama

Doğru cevap = hız bonuslu 50–100 puan: `100 * (0.5 + 0.5 * kalanSüreOranı)`. Yanlış veya boş = 0.

## Real-time Listener Yapısı

Temel fikir `onValue()`'dur — adminin yazdığı her değişiklik otomatik olarak tüm cihazlara push edilir:

```js
import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { gameRef } from "../db/schema";

export function useGameState() {
  const [game, setGame] = useState(undefined);

  useEffect(() => {
    const off = onValue(gameRef, (snap) => setGame(snap.val()));
    return off; // cleanup: dinleyiciyi kaldır
  }, []);

  return game;
}
```

Tüm hook'lar `src/hooks/` altında: `useGameState`, `useQuestion`, `useQuestions`, `useQuestionAnswers`, `usePlayerAnswer`, `usePlayers`, `useScores`, `usePlayerScore`, `useCountdown`.

## Önemli Not (Güvenlik)

Bu prototip kimlik doğrulama içermez; `database.rules.json` herkese açık okuma/yazma izni verir ve `correctIndex` (doğru cevap) yarışmacı tarafından da okunabilir. Canlıya almadan önce:

- Admin için Firebase Authentication (UID tabanlı kural) ekleyin.
- `questions/correctIndex` alanını yarışmacıların okuyamayacağı şekilde kısıtlayın.
- Her oyuncunun yalnızca kendi cevabını yazabildiğinden emin olun.
