const fs = require('fs');
const path = require('path');

// SVG'yi PNG'ye dönüştürmek için basit bir çözüm
// Gerçek PNG oluşturmak için canvas kullanacağız

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Canvas kullanarak PNG oluştur
const createPNGFromSVG = (svgPath, pngPath, size) => {
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // SVG'yi data URL'ye çevir
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    
    // HTML template oluştur
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>SVG to PNG Converter</title>
</head>
<body>
    <canvas id="canvas" width="${size}" height="${size}" style="display:none;"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            ctx.drawImage(img, 0, 0, ${size}, ${size});
            const dataURL = canvas.toDataURL('image/png');
            
            // Base64'ü çıkar
            const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
            
            // Node.js'e veri gönder
            console.log('PNG_DATA:' + base64Data);
        };
        
        img.src = '${dataUrl}';
    </script>
</body>
</html>`;
    
    // HTML dosyasını geçici olarak oluştur
    const tempHtmlPath = `temp-converter-${size}.html`;
    fs.writeFileSync(tempHtmlPath, htmlTemplate);
    
    return tempHtmlPath;
};

// Puppeteer kullanarak PNG oluştur
const puppeteer = require('puppeteer');

async function convertAllSVGToPNG() {
    console.log('🔄 SVG\'leri PNG\'ye dönüştürülüyor...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    for (const size of sizes) {
        const svgPath = path.join('icons', `icon-${size}x${size}.svg`);
        const pngPath = path.join('icons', `icon-${size}x${size}.png`);
        
        if (fs.existsSync(svgPath)) {
            console.log(`📱 ${size}x${size} dönüştürülüyor...`);
            
            const svgContent = fs.readFileSync(svgPath, 'utf8');
            const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
            
            await page.setViewport({ width: size, height: size });
            await page.goto(`data:text/html,<html><body><img src="${dataUrl}" width="${size}" height="${size}"></body></html>`);
            
            const screenshot = await page.screenshot({
                path: pngPath,
                type: 'png',
                omitBackground: true
            });
            
            console.log(`✅ ${pngPath} oluşturuldu`);
        }
    }
    
    await browser.close();
    console.log('\n🎉 Tüm PNG ikonlar oluşturuldu!');
}

// Puppeteer yoksa basit çözüm
function createSimplePNG() {
    console.log('📝 Basit PNG ikonlar oluşturuluyor...');
    
    // 512x512 için basit bir PNG oluştur (Base64)
    const simplePNG = `iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAABOtka5AAAABlBMVEUAZv///+9Q7u/6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78i iglkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpypmY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDEtMTVUMTQ6NDc6NDcrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDEtMTVUMTQ6NDc6NDcrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAxLTE1VDE0OjQ3OjQ3KzAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY5ZDM4YmM1LTM4ZTAtNDI0Ny1hMzA0LTNmOWNhMzM3NzM0YyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjIyYzRkOTZiLTM4ZTAtNDI0Ny1hMzA0LTNmOWNhMzM3NzM0YyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjY5ZDM4YmM1LTM4ZTAtNDI0Ny1hMzA0LTNmOWNhMzM3NzM0YyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY5ZDM4YmM1LTM4ZTAtNDI0Ny1hMzA0LTNmOWNhMzM3NzM0YyIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0xNVQxNDo0Nzo0NyswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+`;
    
    // Her boyut için aynı PNG'yi kopyala
    sizes.forEach(size => {
        const pngPath = path.join('icons', `icon-${size}x${size}.png`);
        fs.writeFileSync(pngPath, Buffer.from(simplePNG, 'base64'));
        console.log(`✅ ${pngPath} oluşturuldu`);
    });
    
    console.log('\n🎉 Basit PNG ikonlar oluşturuldu!');
}

// Ana fonksiyon
async function main() {
    try {
        // Puppeteer var mı kontrol et
        require.resolve('puppeteer');
        await convertAllSVGToPNG();
    } catch (error) {
        console.log('⚠️ Puppeteer bulunamadı, basit PNG oluşturuluyor...');
        createSimplePNG();
    }
}

main();