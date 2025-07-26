const fs = require('fs');
const path = require('path');

// Basit PNG ikonları oluştur
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// 512x512 basit PNG (mavi gradient arka plan, beyaz not kağıdı)
const createSimplePNG = (size) => {
    // Bu çok basit bir PNG - gerçek uygulamada daha iyi olur
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

// HTML converter oluştur
const createHTMLConverter = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>SVG to PNG Converter</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon { margin: 10px; display: inline-block; }
        canvas { border: 1px solid #ddd; }
        button { background: #667eea; color: white; border: none; padding: 10px; margin: 5px; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>📱 SVG to PNG Converter</h1>
    <div id="icons"></div>
    <br>
    <button onclick="downloadAll()">📥 Tüm PNG'leri İndir</button>
    
    <script>
        const sizes = [${sizes.join(',')}];
        
        function createIcon(size) {
            const svg = \`${createSimplePNG(512).replace(/`/g, '\\`')}\`;
            const svgBlob = new Blob([svg], {type: 'image/svg+xml'});
            const url = URL.createObjectURL(svgBlob);
            
            const div = document.createElement('div');
            div.className = 'icon';
            
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            canvas.id = 'canvas-' + size;
            
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                ctx.drawImage(img, 0, 0, size, size);
                URL.revokeObjectURL(url);
            };
            
            img.src = url;
            
            const label = document.createElement('div');
            label.textContent = size + 'x' + size;
            label.style.textAlign = 'center';
            label.style.marginTop = '5px';
            
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'İndir';
            downloadBtn.onclick = () => downloadIcon(size);
            
            div.appendChild(canvas);
            div.appendChild(label);
            div.appendChild(downloadBtn);
            
            document.getElementById('icons').appendChild(div);
        }
        
        function downloadIcon(size) {
            const canvas = document.getElementById('canvas-' + size);
            const link = document.createElement('a');
            link.download = 'icon-' + size + 'x' + size + '.png';
            link.href = canvas.toDataURL();
            link.click();
        }
        
        function downloadAll() {
            sizes.forEach(size => {
                setTimeout(() => downloadIcon(size), 100);
            });
        }
        
        // Create all icons
        sizes.forEach(size => createIcon(size));
    </script>
</body>
</html>`;
    
    return html;
};

// Ana fonksiyon
console.log('📱 PNG İkon Oluşturucu');
console.log('=====================');

// HTML converter oluştur
const htmlContent = createHTMLConverter();
fs.writeFileSync('svg-to-png-converter.html', htmlContent);
console.log('✅ svg-to-png-converter.html oluşturuldu');

// Basit PNG dosyaları oluştur (SVG olarak)
sizes.forEach(size => {
    const svgContent = createSimplePNG(size);
    const svgPath = path.join('icons', `icon-${size}x${size}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ ${svgPath} oluşturuldu`);
});

console.log('\n🎉 İkonlar hazır!');
console.log('\n📋 Kullanım:');
console.log('1. svg-to-png-converter.html dosyasını tarayıcıda açın');
console.log('2. "Tüm PNG\'leri İndir" butonuna tıklayın');
console.log('3. PNG dosyalarını icons/ klasörüne koyun');
console.log('4. PWA Builder\'da kullanın');

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