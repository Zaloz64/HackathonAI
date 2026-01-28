import { API_URL } from '../config/constants';

// Test backend connection
export const testConnection = async () => {
  console.log(`[TEST] Testing connection to ${API_URL}/api/ping`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const response = await fetch(`${API_URL}/api/ping`, {
    method: 'GET',
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (response.ok) {
    const data = await response.json();
    console.log('[TEST] Connection successful:', data);
    return { success: true, data };
  } else {
    console.log('[TEST] Bad response:', response.status);
    throw new Error(`Error: ${response.status}`);
  }
};

// Fetch product from Open Food Facts
export const fetchProduct = async (barcode) => {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
    {
      headers: {
        'User-Agent': 'FoodScannerApp/1.0 (expo-app)',
      },
    }
  );
  const result = await response.json();

  if (result.status === 1) {
    return result.product;
  } else {
    throw new Error('Product not found in database');
  }
};

// Scan ingredients image
export const scanIngredientsImage = async (base64Image) => {
  const startTime = Date.now();
  const imgSize = Math.round(base64Image.length / 1024);

  console.log('\n========== APP SCAN START ==========');
  console.log(`[APP STEP 1] Image captured - Size: ${imgSize}KB`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('[APP TIMEOUT] 60s timeout reached - aborting');
    controller.abort();
  }, 60000);

  console.log(`[APP STEP 2] ${Date.now() - startTime}ms - Sending to backend...`);

  const response = await fetch(`${API_URL}/api/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image
    }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);
  console.log(`[APP STEP 3] ${Date.now() - startTime}ms - Backend responded (status: ${response.status})`);

  if (response.ok) {
    const scanResult = await response.json();
    console.log(`[APP STEP 4] ${Date.now() - startTime}ms - Response parsed`);
    console.log(`[APP RESULT] Backend timing: ${scanResult.timing?.total_ms}ms`);
    console.log('========== APP SCAN COMPLETE ==========\n');
    return scanResult;
  } else {
    const errorData = await response.json();
    console.log(`[APP ERROR] ${Date.now() - startTime}ms - ${JSON.stringify(errorData)}`);
    throw new Error(errorData.message || errorData.error);
  }
};

// Classify allergens from text
export const classifyAllergens = async (text) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(`${API_URL}/api/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to analyze allergens');
  }
};
