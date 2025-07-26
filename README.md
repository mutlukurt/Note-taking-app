# 📝 Not Alma Uygulaması

Modern, kullanıcı dostu ve güzel tasarımlı bir not alma uygulaması. Oval köşeli tasarım, gradient renkler ve karanlık mod desteği ile birlikte gelir.

## 🌐 **Canlı Demo**
**https://mutlukurt.github.io/Note-taking-app**

## ✨ Özellikler

- 🎨 **Modern Tasarım**: Oval köşeli, gradient renkli modern UI
- 🌙 **Karanlık Mod**: Sağ üst köşedeki gece/gündüz ikonu ile tema değiştirme
- 📱 **Responsive**: Tüm cihazlarda mükemmel görünüm
- 🔍 **Arama**: Notlarınızda hızlı arama yapabilme
- ✏️ **Düzenleme**: Mevcut notları düzenleyebilme
- 🗑️ **Silme**: Notları güvenli şekilde silme
- 💾 **Yerel Depolama**: Notlarınız tarayıcıda güvenli şekilde saklanır
- 🔔 **Bildirimler**: İşlem sonuçları için güzel bildirimler
- ⌨️ **Klavye Kısayolları**: Enter ile not ekleme, Ctrl+Enter ile içerik ekleme

## 🚀 Kullanım

1. **Not Ekleme**: Başlık ve içerik alanlarını doldurun, "Not Ekle" butonuna tıklayın
2. **Arama**: Üst kısımdaki arama kutusunu kullanarak notlarınızda arama yapın
3. **Düzenleme**: Not kartındaki düzenleme ikonuna tıklayın
4. **Silme**: Not kartındaki çöp kutusu ikonuna tıklayın
5. **Tema Değiştirme**: Sağ üst köşedeki güneş/ay ikonuna tıklayın

## 🎯 Teknolojiler

- **HTML5**: Semantik yapı
- **CSS3**: Modern stiller, CSS Grid, Flexbox, CSS Variables
- **JavaScript (ES6+)**: Modern JavaScript sınıfları ve metodları
- **Font Awesome**: Güzel ikonlar
- **LocalStorage**: Veri saklama

## 📁 Dosya Yapısı

```
not-alma-uygulamasi/
├── index.html              # Ana HTML dosyası (GitHub Pages)
├── style.css               # CSS stilleri
├── script.js               # JavaScript fonksiyonları
├── index-auth.html         # Authentication versiyonu
├── script-auth.js          # Authentication JavaScript
├── server.js               # Express server (backend)
├── package.json            # Node.js dependencies
├── .env                    # Environment variables
└── README.md               # Bu dosya
```

## 🌈 Renk Paleti

### Açık Mod
- Ana Arka Plan: #ffffff (Beyaz)
- İkincil Arka Plan: #f8f9fa (Açık Gri)
- Ana Metin: #2c3e50 (Koyu Mavi-Gri)
- İkincil Metin: #6c757d (Gri)

### Karanlık Mod
- Ana Arka Plan: #1a1a1a (Koyu Gri)
- İkincil Arka Plan: #2d2d2d (Orta Gri)
- Ana Metin: #ffffff (Beyaz)
- İkincil Metin: #b0b0b0 (Açık Gri)

### Gradientler
- Birincil: #667eea → #764ba2 (Mavi-Mor)
- İkincil: #f093fb → #f5576c (Pembe-Kırmızı)
- Vurgu: #4facfe → #00f2fe (Mavi-Cyan)

## 🔧 Kurulum

### Basit Kullanım (GitHub Pages)
1. **https://mutlukurt.github.io/Note-taking-app** adresine gidin
2. Hemen kullanmaya başlayın!

### Yerel Kurulum
1. Dosyaları bilgisayarınıza indirin
2. `index.html` dosyasını tarayıcınızda açın
3. Hemen kullanmaya başlayın!

### Backend ile Tam Versiyon
Eğer authentication sistemi istiyorsanız:

```bash
# Bağımlılıkları yükleyin
npm install

# MongoDB kurulumu gerekli
# .env dosyasını düzenleyin

# Uygulamayı başlatın
npm start
```

## 📱 Responsive Tasarım

Uygulama tüm cihazlarda mükemmel çalışır:
- **Desktop**: Tam özellikli deneyim
- **Tablet**: Optimize edilmiş düzen
- **Mobil**: Dokunmatik dostu arayüz

## 🎨 Tasarım Özellikleri

- **Oval Köşeler**: Tüm elementlerde yumuşak, modern köşeler
- **Gradient Renkler**: Güzel geçişli renkler
- **Gölgeler**: Derinlik hissi veren gölgeler
- **Animasyonlar**: Yumuşak geçişler ve hover efektleri
- **Tipografi**: Modern ve okunabilir fontlar

## 🔒 Veri Güvenliği

- Notlarınız sadece tarayıcınızda saklanır
- Hiçbir veri sunucuya gönderilmez
- LocalStorage kullanılarak güvenli depolama

## 🚀 Gelecek Özellikler

- [ ] Kullanıcı sistemi (backend ile)
- [ ] Not kategorileri
- [ ] Not paylaşımı
- [ ] Bulut senkronizasyonu
- [ ] Markdown desteği
- [ ] Not etiketleri
- [ ] Gelişmiş arama filtreleri

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not**: Bu uygulama tamamen tarayıcı tabanlıdır ve internet bağlantısı gerektirmez (Font Awesome ikonları hariç). Authentication sistemi için backend kurulumu gerekir.