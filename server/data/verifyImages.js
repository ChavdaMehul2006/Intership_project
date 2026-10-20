const { productImages } = require('./productImages');

async function testAll() {
  const entries = Object.entries(productImages);
  console.log(`Checking ${entries.length} products (${entries.length * 2} images)...`);
  const failed = [];
  
  for (const [prod, urls] of entries) {
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.status !== 200) {
          failed.push({ prod, url, status: res.status });
        }
      } catch (err) {
        failed.push({ prod, url, error: err.message });
      }
    }
  }

  if (failed.length === 0) {
    console.log('SUCCESS: All images returned HTTP 200 OK!');
  } else {
    console.error(`FAILED: ${failed.length} images failed:`, failed);
  }
}

testAll();
