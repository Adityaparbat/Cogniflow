const fs = require('fs');
const path = require('path');

// Simple script to create placeholder PWA icons
// In production, you would use a proper image processing library like sharp

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple SVG icon as placeholder
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad1)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" 
        font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="white">
    📚
  </text>
</svg>`;

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for each size
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated icon-${size}x${size}.svg`);
});

// Copy existing logo as fallback for PNG icons
const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
if (fs.existsSync(logoPath)) {
  iconSizes.forEach(size => {
    const targetPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    fs.copyFileSync(logoPath, targetPath);
    console.log(`Copied logo as icon-${size}x${size}.png`);
  });
}

console.log('PWA icons generated successfully!');
console.log('Note: For production, consider using proper PNG icons generated from your logo.');
