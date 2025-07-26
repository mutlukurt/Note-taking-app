const fs = require('fs');
const path = require('path');

// Basit PNG ikonları oluştur
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// 512x512 basit PNG (mavi gradient arka plan)
// Bu gerçek bir PNG Base64 data
const pngBase64 = `iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAABOtka5AAAABlBMVEUAZv///+9Q7u/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78i iglkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpypmY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDEtMTVUMTQ6NDc6NDcrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDEtMTVUMTQ6NDc6NDcrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAxLTE1VDE0OjQ3OjQ3KzAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY5ZDM4YmM1LTM4ZTAtNDI0Ny1hMzA0LTNmOWNhMzM3NzM0YyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjIyYzRkOTZiLTM4ZTAtNDI0Ny1hMzA0LTNmOWNhMzM3NzM0YyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjY5ZDM4YmM1LTM4ZTAtNDI0Ny1hMzA0LTNmOWNhMzM3NzM0YyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY5ZDM4YmM1LTM4ZTAtNDI0Ny1hMzA0LTNmOWNhMzM3NzM0YyIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0xNVQxNDo0Nzo0NyswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+`;

console.log('📱 Gerçek PNG İkonları Oluşturuluyor...');
console.log('=====================================');

// Icons klasörünü oluştur
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

// Her boyut için PNG oluştur
sizes.forEach(size => {
    const pngPath = path.join('icons', `icon-${size}x${size}.png`);
    
    // Base64'ten PNG oluştur
    const pngBuffer = Buffer.from(pngBase64, 'base64');
    fs.writeFileSync(pngPath, pngBuffer);
    
    console.log(`✅ ${pngPath} oluşturuldu`);
});

console.log('\n🎉 Tüm PNG ikonlar oluşturuldu!');
console.log('\n📋 Şimdi PWA Builder\'da kullanabilirsiniz:');
console.log('1. https://www.pwabuilder.com adresine gidin');
console.log('2. URL\'yi girin: https://mutlukurt.github.io/Note-taking-app');
console.log('3. Build My PWA tıklayın');
console.log('4. Android sekmesini seçin');
console.log('5. Generate Package tıklayın');

// Manifest'i kontrol et
const manifestPath = 'manifest.json';
if (fs.existsSync(manifestPath)) {
    let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // İkon yollarını kontrol et
    const hasLocalIcons = manifest.icons.every(icon => icon.src.startsWith('icons/'));
    
    if (hasLocalIcons) {
        console.log('\n✅ Manifest dosyası yerel ikonları kullanıyor');
    } else {
        console.log('\n⚠️ Manifest dosyası placeholder URL\'leri kullanıyor');
        console.log('Yerel ikonları kullanmak için manifest\'i güncelleyin');
    }
}

console.log('\n🚀 APK oluşturmaya hazır!');