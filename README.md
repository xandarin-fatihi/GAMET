# Tahmisçi Game

Mobil öncelikli bağımsız HTML/CSS/JS oyun alanıdır. Oyun seçme ana ekranını, İsim–Şehir–Hayvan akışını ve yüklenebilir PWA kabuğunu içerir.

## Çalıştırma

Dosyaya çift tıklamak temel arayüzü açar; PWA, servis çalışanı ve sekmeler arası oda paylaşımı için klasörü bir web sunucusundan çalıştırın:

```powershell
npx serve .
```

Ardından terminalde verilen `http://localhost:...` adresini açın. Chrome/Edge adres çubuğundaki yükle düğmesi veya uygulamadaki **Uygulamayı yükle** düğmesi kullanılabilir. Gerçek ortamda HTTPS gereklidir.

## Bu prototipte çalışanlar

- Oda oluşturma ve oda koduyla katılma
- Aynı origin üzerindeki farklı sekmeler arasında `BroadcastChannel + localStorage` senkronizasyonu
- 2–8 oyuncu, demo oyuncusu ekleme
- Sırayla harf seçme, seçilmiş harfi engelleme, hazır onayı
- 90 saniyelik geri sayım ve herkes tamamladığında erken bitiş
- Türkçe büyük harf normalizasyonu
- Benzersiz 10, aynı 5, boş/yanlış harf 0 puan
- Tur sonuçları, toplam skor ve cevap inceleme
- PWA manifesti, çevrimdışı kabuk ve yükleme düğmesi
- Tahmisçi tasarım dilinde oyun seçme ana ekranı
- Telefonlarda 2×3, masaüstünde 3×2 ve ekrana sığan cevap düzeni
- Yazarken ekranı yeniden oluşturmayan, odağı ve imleci koruyan cevap kaydı
- Enter/ileri tuşuyla sonraki kategoriye geçiş
- Kare Tahmisçi GAME favicon, uygulama ikonları ve yerel Poppins fontları
- Dokunmatik etkileşim ve güvenli mobil ekran alanı desteği

> Daha önce kurulmuş bir sürüm varsa yeni PWA önbelleğinin alınması için uygulamayı bir kez kapatıp yeniden açın veya sayfayı yenileyin.

## Sunucu entegrasyon notu

`scripts/game-state.js` bilinçli olarak ayrı bir taşıma/durum katmanıdır. Gelecekte `localStorage` yerine WebSocket/Socket.IO kullanılırken `gamebox.js` arayüzünün değiştirilmesi gerekmez. Sunucuda oda durumu, oyuncu kimliği, tur bitiş zamanı ve skor hesabı yetkili olmalıdır; istemciden gelen skor kabul edilmemelidir.
