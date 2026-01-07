const fs = require('fs');

const TLE_URL = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle';
const OUTPUT_PATH = 'public/starlink.tle';

async function updateTle() {
  console.log(`Downloading real TLE data from: ${TLE_URL}`);
  
  try {
    const response = await fetch(TLE_URL);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('403 Forbidden: API is still blocking this IP. Try again later.');
      }
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    
    // Basic validation to ensure we didn't download an HTML error page
    if (data.trim().startsWith('<!DOCTYPE html>') || data.trim().startsWith('<html')) {
       throw new Error('Received HTML instead of TLE data. Likely an error page.');
    }

    fs.writeFileSync(OUTPUT_PATH, data);
    console.log(`
✅ Success! Real Starlink data cached to: ${OUTPUT_PATH}`);
    console.log(`   File size: ${(data.length / 1024).toFixed(2)} KB`);
    console.log(`   Satellite count: ${data.split('\n').filter(l => l.trim().length > 0).length / 3}`);

  } catch (error) {
    console.error('
❌ Update Failed:', error.message);
    process.exit(1);
  }
}

updateTle();
