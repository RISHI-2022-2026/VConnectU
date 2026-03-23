
const pdf = require('pdf-parse');
console.log('Keys:', Object.keys(pdf));
if (pdf.default) {
    console.log('Has default export:', typeof pdf.default);
}
console.log('Structure:', JSON.stringify(pdf, null, 2).slice(0, 500));
