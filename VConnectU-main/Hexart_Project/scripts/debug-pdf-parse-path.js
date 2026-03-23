
try {
    const path = require.resolve('pdf-parse');
    console.log('Resolved path:', path);
    const pdf = require(path);
    console.log('Export from path:', typeof pdf);
    if (typeof pdf === 'object') {
        console.log('Keys:', Object.keys(pdf));
    }
} catch (e) {
    console.error(e);
}
