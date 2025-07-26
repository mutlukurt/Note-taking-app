# 📱 APK Oluşturma Talimatları

Bu dosya, web uygulamanızı Android APK'sına dönüştürme adımlarını içerir.

## 🚀 Yöntem 1: Bubblewrap (Önerilen)

### Gereksinimler:
- Node.js (v14 veya üzeri)
- Java JDK 11
- Android Studio
- Android SDK

### Adımlar:

1. **Bubblewrap'i yükleyin:**
```bash
npm install -g @bubblewrap/cli
```

2. **Projeyi hazırlayın:**
```bash
# Proje dizinine gidin
cd /path/to/your/project

# Bubblewrap'i başlatın
bubblewrap init --manifest https://mutlukurt.github.io/Note-taking-app/manifest.json
```

3. **APK oluşturun:**
```bash
# Debug APK
bubblewrap build

# Release APK
bubblewrap build --release
```

## 🚀 Yöntem 2: PWA Builder (Online)

1. **https://www.pwabuilder.com** adresine gidin
2. **https://mutlukurt.github.io/Note-taking-app** URL'sini girin
3. **Build My PWA** butonuna tıklayın
4. **Android** sekmesini seçin
5. **Generate Package** butonuna tıklayın
6. APK'yı indirin

## 🚀 Yöntem 3: Cordova (Alternatif)

### Gereksinimler:
- Node.js
- Cordova CLI
- Android Studio

### Adımlar:

1. **Cordova'yı yükleyin:**
```bash
npm install -g cordova
```

2. **Proje oluşturun:**
```bash
cordova create NotAlma com.mutlukurt.notalma "Not Alma"
cd NotAlma
```

3. **Android platformunu ekleyin:**
```bash
cordova platform add android
```

4. **Web dosyalarını kopyalayın:**
```bash
# www/ klasörüne dosyaları kopyalayın
cp ../index.html www/
cp ../style.css www/
cp ../script.js www/
cp ../manifest.json www/
cp ../sw.js www/
```

5. **APK oluşturun:**
```bash
cordova build android
```

## 📱 APK Özellikleri

### ✅ **Desteklenen Özellikler:**
- Offline çalışma
- Ana ekrana ekleme
- Push bildirimleri
- Kamera erişimi (fotoğraf ekleme)
- Dosya erişimi
- Tam ekran modu

### 🎨 **Uygulama Bilgileri:**
- **Paket Adı**: com.mutlukurt.notalma
- **Uygulama Adı**: Not Alma Uygulaması
- **Versiyon**: 1.0.0
- **Minimum SDK**: API 21 (Android 5.0)
- **Hedef SDK**: API 33 (Android 13)

## 🔧 Özelleştirme

### İkon Değiştirme:
1. `icons/` klasöründeki dosyaları değiştirin
2. Tüm boyutlarda aynı ikonu kullanın
3. PNG formatında olmalı

### Renk Değiştirme:
1. `manifest.json` dosyasındaki `theme_color` değerini değiştirin
2. `twa-manifest.json` dosyasındaki renkleri güncelleyin

### Paket Adı Değiştirme:
1. `twa-manifest.json` dosyasındaki `packageId` değerini değiştirin
2. Benzersiz bir paket adı kullanın

## 📦 Dağıtım

### Google Play Store:
1. Google Play Console'a kayıt olun
2. Yeni uygulama oluşturun
3. APK'yı yükleyin
4. Uygulama bilgilerini doldurun
5. Yayınlayın

### Manuel Dağıtım:
1. APK dosyasını paylaşın
2. Kullanıcılar "Bilinmeyen kaynaklar"ı etkinleştirmeli
3. APK'yı yükleyebilirler

## 🐛 Sorun Giderme

### Yaygın Sorunlar:

1. **"Bilinmeyen kaynaklar" hatası:**
   - Ayarlar > Güvenlik > Bilinmeyen kaynaklar

2. **İnternet bağlantısı gerekli:**
   - İlk açılışta internet gerekli
   - Sonrasında offline çalışır

3. **Fotoğraf ekleme çalışmıyor:**
   - Kamera izni verin
   - Depolama izni verin

## 📞 Destek

Sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Tarayıcıda test edin
3. GitHub Issues'da bildirin

---

**Not**: APK oluşturma işlemi biraz zaman alabilir. Sabırlı olun! 🚀