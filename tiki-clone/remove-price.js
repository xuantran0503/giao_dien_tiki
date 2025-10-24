const fs = require('fs');

const filePath = './src/data/suggestedProductsData.js';
let content = fs.readFileSync(filePath, 'utf8');

// Remove all lines that contain only "price: <number>,"
content = content.replace(/^\s*price:\s*\d+,?\s*$/gm, '');

// Clean up multiple empty lines
content = content.replace(/\n\n\n+/g, '\n\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Đã xóa tất cả trường price!');
