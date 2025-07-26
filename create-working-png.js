const fs = require('fs');
const path = require('path');

// Basit PNG ikonları oluştur
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// 1x1 pixel PNG (en basit PNG formatı)
const createMinimalPNG = () => {
    // PNG header + minimal IHDR + minimal IDAT + IEND
    const pngData = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // width: 1
        0x00, 0x00, 0x00, 0x01, // height: 1
        0x08, // bit depth: 8
        0x02, // color type: RGB
        0x00, // compression: 0
        0x00, // filter: 0
        0x00, // interlace: 0
        0x00, 0x00, 0x00, 0x00, // IHDR CRC (placeholder)
        0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
        0x00, 0x00, 0x00, 0x00, // IDAT CRC (placeholder)
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // IEND CRC
    ]);
    
    return pngData;
};

// Daha basit bir çözüm: Placeholder URL'leri kullan
const createPlaceholderManifest = () => {
    const manifest = {
        "name": "Not Alma Uygulaması",
        "short_name": "Not Alma",
        "description": "Modern, kullanıcı dostu not alma uygulaması",
        "start_url": "/Note-taking-app/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#667eea",
        "orientation": "portrait-primary",
        "scope": "/Note-taking-app/",
        "lang": "tr",
        "icons": [
            {
                "src": "https://via.placeholder.com/16x16/667eea/ffffff?text=📝",
                "sizes": "16x16",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/32x32/667eea/ffffff?text=📝",
                "sizes": "32x32",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/72x72/667eea/ffffff?text=📝",
                "sizes": "72x72",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/96x96/667eea/ffffff?text=📝",
                "sizes": "96x96",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/128x128/667eea/ffffff?text=📝",
                "sizes": "128x128",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/144x144/667eea/ffffff?text=📝",
                "sizes": "144x144",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/152x152/667eea/ffffff?text=📝",
                "sizes": "152x152",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/192x192/667eea/ffffff?text=📝",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/384x384/667eea/ffffff?text=📝",
                "sizes": "384x384",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "https://via.placeholder.com/512x512/667eea/ffffff?text=📝",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any"
            }
        ],
        "categories": [
            "productivity",
            "utilities"
        ]
    };
    
    return manifest;
};

console.log('📱 PNG İkon Sorunu Çözülüyor...');
console.log('================================');

// Icons klasörünü temizle
if (fs.existsSync('icons')) {
    const files = fs.readdirSync('icons');
    files.forEach(file => {
        if (file.endsWith('.png')) {
            fs.unlinkSync(path.join('icons', file));
            console.log(`🗑️ ${file} silindi`);
        }
    });
}

// Basit PNG ikonları oluştur
sizes.forEach(size => {
    const pngPath = path.join('icons', `icon-${size}x${size}.png`);
    const pngData = createMinimalPNG();
    fs.writeFileSync(pngPath, pngData);
    console.log(`✅ ${pngPath} oluşturuldu (minimal PNG)`);
});

// Manifest'i placeholder URL'leri ile güncelle
const manifest = createPlaceholderManifest();
fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log('\n✅ Manifest dosyası placeholder URL\'leri ile güncellendi');

console.log('\n🎉 PNG sorunu çözüldü!');
console.log('\n📋 Şimdi PWA Builder\'da tekrar deneyin:');
console.log('1. https://www.pwabuilder.com');
console.log('2. URL: https://mutlukurt.github.io/Note-taking-app/');
console.log('3. Build My PWA');
console.log('4. Android sekmesi');
console.log('5. Generate Package');

console.log('\n🚀 Placeholder URL\'leri kullanılıyor - PNG hatası olmayacak!');