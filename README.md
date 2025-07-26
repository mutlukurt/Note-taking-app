# 📝 Not Alma Uygulaması - Kullanıcı Sistemi

Modern, kullanıcı dostu ve güzel tasarımlı bir not alma uygulaması. Kullanıcı kayıt/giriş sistemi, email ile kalıcı not erişimi, oval köşeli tasarım, gradient renkler ve karanlık mod desteği ile birlikte gelir.

## ✨ Özellikler

- 🔐 **Kullanıcı Sistemi**: Email ve şifre ile kayıt/giriş
- 💾 **Kalıcı Depolama**: MongoDB ile notlarınız güvenli şekilde saklanır
- 🎨 **Modern Tasarım**: Oval köşeli, gradient renkli modern UI
- 🌙 **Karanlık Mod**: Sağ üst köşedeki gece/gündüz ikonu ile tema değiştirme
- 📱 **Responsive**: Tüm cihazlarda mükemmel görünüm
- 🔍 **Arama**: Notlarınızda hızlı arama yapabilme
- ✏️ **Düzenleme**: Mevcut notları düzenleyebilme
- 🗑️ **Silme**: Notları güvenli şekilde silme
- 🔔 **Bildirimler**: İşlem sonuçları için güzel bildirimler
- ⌨️ **Klavye Kısayolları**: Enter ile not ekleme, Ctrl+Enter ile içerik ekleme
- 🔒 **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama

## 🚀 Kullanım

### 1. Kayıt Olma
- "Kayıt Ol" linkine tıklayın
- Ad soyad, email ve şifre girin (en az 6 karakter)
- "Kayıt Ol" butonuna tıklayın

### 2. Giriş Yapma
- Email ve şifrenizi girin
- "Giriş Yap" butonuna tıklayın

### 3. Not Yönetimi
- Başlık ve içerik alanlarını doldurun
- "Not Ekle" butonuna tıklayın
- Notlarınızı düzenleyin veya silin
- Arama kutusu ile notlarınızda arama yapın

### 4. Tema Değiştirme
- Sağ üst köşedeki güneş/ay ikonu ile tema değiştirin

## 🎯 Teknolojiler

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: Veritabanı
- **Mongoose**: MongoDB ODM
- **JWT**: Kimlik doğrulama
- **bcryptjs**: Şifre hashleme
- **CORS**: Cross-origin resource sharing

### Frontend
- **HTML5**: Semantik yapı
- **CSS3**: Modern stiller, CSS Grid, Flexbox, CSS Variables
- **JavaScript (ES6+)**: Modern JavaScript sınıfları ve metodları
- **Font Awesome**: Güzel ikonlar

## 📁 Dosya Yapısı

```
not-alma-uygulamasi/
├── server.js              # Express server
├── package.json           # Node.js dependencies
├── .env                   # Environment variables
├── public/                # Frontend files
│   ├── index.html         # Ana HTML dosyası
│   ├── style.css          # CSS stilleri
│   └── script.js          # JavaScript fonksiyonları
└── README.md              # Bu dosya
```

## 🔧 Kurulum

### 1. Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB (yerel veya cloud)

### 2. Proje Kurulumu
```bash
# Bağımlılıkları yükleyin
npm install

# Environment dosyasını düzenleyin
cp .env.example .env
# .env dosyasında MongoDB URI'nizi ayarlayın

# Uygulamayı başlatın
npm start

# Geliştirme modu için
npm run dev
```

### 3. MongoDB Kurulumu

#### Yerel Kurulum
```bash
# MongoDB Community Server'ı indirin ve kurun
# https://www.mongodb.com/try/download/community

# MongoDB'yi başlatın
mongod
```

#### Cloud Kurulum (MongoDB Atlas)
1. [MongoDB Atlas](https://www.mongodb.com/atlas) hesabı oluşturun
2. Yeni cluster oluşturun
3. Database Access'te kullanıcı oluşturun
4. Network Access'te IP adresinizi ekleyin
5. Connection string'i .env dosyasına ekleyin

### 4. Environment Variables
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-super-secret-jwt-key
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

## 🔒 Güvenlik

- **JWT Tokens**: Güvenli kimlik doğrulama
- **Password Hashing**: bcryptjs ile şifre hashleme
- **Input Validation**: Sunucu tarafında veri doğrulama
- **CORS Protection**: Cross-origin istekleri koruması
- **Environment Variables**: Hassas bilgilerin güvenli saklanması

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

## 🚀 API Endpoints

### Authentication
- `POST /api/register` - Kullanıcı kaydı
- `POST /api/login` - Kullanıcı girişi
- `GET /api/profile` - Kullanıcı profili

### Notes
- `GET /api/notes` - Tüm notları getir
- `POST /api/notes` - Yeni not oluştur
- `PUT /api/notes/:id` - Not güncelle
- `DELETE /api/notes/:id` - Not sil

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. Backend'de yeni route ekleyin (`server.js`)
2. Frontend'de yeni fonksiyon ekleyin (`script.js`)
3. Gerekirse yeni stil ekleyin (`style.css`)

### Veritabanı Şeması Değişikliği
1. Mongoose şemasını güncelleyin
2. Migration script'i yazın (gerekirse)
3. Frontend'i yeni yapıya uyarlayın

## 🚀 Deployment

### Heroku
```bash
# Heroku CLI kurulumu
npm install -g heroku

# Heroku'ya deploy
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

### Vercel
```bash
# Vercel CLI kurulumu
npm install -g vercel

# Deploy
vercel
```

### Railway
1. Railway hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Environment variables'ları ayarlayın
4. Otomatik deploy

## 🚀 Gelecek Özellikler

- [ ] Email doğrulama
- [ ] Şifre sıfırlama
- [ ] Not kategorileri
- [ ] Not paylaşımı
- [ ] Bulut senkronizasyonu
- [ ] Markdown desteği
- [ ] Not etiketleri
- [ ] Gelişmiş arama filtreleri
- [ ] Not arşivleme
- [ ] Çoklu kullanıcı desteği

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not**: Bu uygulama tamamen fonksiyonel bir not alma uygulamasıdır. Kullanıcı kayıt/giriş sistemi ile birlikte MongoDB'de kalıcı olarak notlarınızı saklar.