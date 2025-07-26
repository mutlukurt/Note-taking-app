const fs = require('fs');
const path = require('path');

// İkon boyutları
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Basit PNG ikonları oluştur (Base64 formatında)
const createSimpleIcon = (size) => {
    // Bu basit bir çözüm - gerçek PNG oluşturmak için canvas veya sharp kullanılabilir
    const canvas = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Background circle -->
        <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="url(#grad1)" stroke="#ffffff" stroke-width="${size*0.02}"/>
        
        <!-- Note paper -->
        <rect x="${size*0.2}" y="${size*0.15}" width="${size*0.6}" height="${size*0.7}" rx="${size*0.05}" fill="#ffffff" opacity="0.95"/>
        
        <!-- Note lines -->
        <line x1="${size*0.25}" y1="${size*0.25}" x2="${size*0.75}" y2="${size*0.25}" stroke="#667eea" stroke-width="${size*0.01}" opacity="0.3"/>
        <line x1="${size*0.25}" y1="${size*0.3}" x2="${size*0.75}" y2="${size*0.3}" stroke="#667eea" stroke-width="${size*0.008}" opacity="0.2"/>
        <line x1="${size*0.25}" y1="${size*0.35}" x2="${size*0.75}" y2="${size*0.35}" stroke="#667eea" stroke-width="${size*0.008}" opacity="0.2"/>
        <line x1="${size*0.25}" y1="${size*0.4}" x2="${size*0.6}" y2="${size*0.4}" stroke="#667eea" stroke-width="${size*0.008}" opacity="0.2"/>
        
        <!-- Pin -->
        <circle cx="${size/2}" cy="${size*0.2}" r="${size*0.025}" fill="#dc3545"/>
        <rect x="${size*0.49}" y="${size*0.2}" width="${size*0.02}" height="${size*0.04}" fill="#dc3545"/>
        
        <!-- Pencil -->
        <rect x="${size*0.65}" y="${size*0.6}" width="${size*0.08}" height="${size*0.012}" rx="${size*0.006}" fill="#ffc107" transform="rotate(-45 ${size*0.69} ${size*0.606})"/>
        <rect x="${size*0.73}" y="${size*0.52}" width="${size*0.012}" height="${size*0.08}" rx="${size*0.006}" fill="#ffc107" transform="rotate(-45 ${size*0.736} ${size*0.56})"/>
    </svg>`;
    
    return canvas;
};

// İkonları oluştur
console.log('📱 PNG İkonları oluşturuluyor...');

// Icons klasörünü oluştur
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

// Her boyut için SVG oluştur
sizes.forEach(size => {
    const svgContent = createSimpleIcon(size);
    const fileName = `icon-${size}x${size}.svg`;
    const filePath = path.join('icons', fileName);
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ ${fileName} oluşturuldu`);
});

console.log('\n🎉 Tüm ikonlar oluşturuldu!');
console.log('\n📋 Sonraki adımlar:');
console.log('1. SVG dosyalarını PNG\'ye dönüştürün');
console.log('2. PWA Builder\'da kullanın');
console.log('3. Veya placeholder URL\'leri kullanın (zaten hazır)');

// Manifest'i güncelle
const manifestPath = 'manifest.json';
if (fs.existsSync(manifestPath)) {
    let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // İkon yollarını güncelle
    manifest.icons = sizes.map(size => ({
        src: `icons/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "any"
    }));
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('\n✅ Manifest dosyası güncellendi');
}