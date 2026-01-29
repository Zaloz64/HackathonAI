require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for images

const OCR_API_KEY = process.env.OCR_API_KEY || 'K85329702488957'; // Free OCR.space key

const PORT = process.env.PORT || 3001;

// Initialize OpenAI client (only if API key is available)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30000 })
  : null;

// Set to true to skip LLM and use fast keyword detection only
const USE_KEYWORDS_ONLY = process.env.USE_KEYWORDS_ONLY === 'true';

// Set to true to use mock data instead of real OCR (for development)
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'false' || false; // Set to true for dev

// Mock ingredients list with various allergens for testing
const MOCK_INGREDIENTS = `Ingredienser: Vetemjöl, vatten, socker, rapsolja,
jäst, salt, mjölkpulver, vasslepulver, emulgeringsmedel (E471, E472e),
mjölksyra, konserveringsmedel (kalciumpropionat).
Kan innehålla spår av soja, ägg och nötter.
Glutenfri: Nej`;

// === KEYWORD PATTERNS ===

// Gluten ingredients (contains)
const GLUTEN_KEYWORDS = [
  'gluten', 'vete', 'hvete', 'wheat', 'råg', 'rug', 'rye',
  'korn', 'byg', 'barley', 'malt', 'maltextrakt', 'maltextract',
  'vetemjöl', 'hvetemjøl', 'wheat flour', 'semolina', 'spelt', 'dinkel',
  'vetemjol', 'hvetemjol', 'seitan', 'bulgur', 'couscous'
];

// Gluten-free markers
const GLUTEN_FREE_KEYWORDS = [
  'glutenfri', 'glutenfritt', 'gluten free', 'gluten-free', 'glutenfrei'
];

// Milk ingredients (contains)
const MILK_KEYWORDS = [
  'mjölk', 'melk', 'mælk', 'milk', 'vassle', 'valle', 'myse', 'whey',
  'laktos', 'lactose', 'kasein', 'casein', 'caseinate', 'kaseinat',
  'ost', 'cheese', 'grädde', 'fløde', 'cream', 'smör', 'butter', 'smør',
  'yoghurt', 'yogurt', 'skummjölk', 'helmjölk', 'skim milk', 'whole milk',
  'mjölkpulver', 'milk powder', 'torrjölk', 'dried milk',
  'vasslepulver', 'vallepulver', 'mysepulver', 'ostpulver',
  'mjölksyra', 'mælkesyre', 'melkesyre', 'maidosta', 'maito',
  'herajauhe', 'mjolk', 'mjolksyra', 'juusto', 'kerma', 'voi'
];

// Soy ingredients
const SOY_KEYWORDS = [
  'soja', 'soy', 'soya', 'sojaböna', 'soybean', 'sojaprotein', 'soy protein',
  'sojalecithin', 'soy lecithin', 'sojamjöl', 'soy flour', 'edamame', 'tofu',
  'sojasås', 'soy sauce', 'miso', 'tempeh', 'sojaböno'
];

// Egg ingredients
const EGG_KEYWORDS = [
  'ägg', 'egg', 'eggs', 'æg', 'æggehvide', 'äggvita', 'egg white',
  'äggula', 'egg yolk', 'äggpulver', 'egg powder', 'albumin',
  'ovalbumin', 'lysozym', 'lysozyme', 'majonnäs', 'mayonnaise',
  'aggvita', 'aggula', 'agg'
];

// Nut ingredients
const NUT_KEYWORDS = [
  'nötter', 'notter', 'nuts', 'nøtter', 'nødder', 'mandel', 'almond',
  'hasselnöt', 'hasselnot', 'hazelnut', 'valnöt', 'valnot', 'walnut',
  'cashew', 'pistasch', 'pistachio', 'pecan', 'macadamia',
  'jordnöt', 'jordnot', 'peanut', 'peanuts', 'jordnötter'
];

// Lactose ingredients
const LACTOSE_KEYWORDS = [
  'laktos', 'lactose', 'mjölksocker', 'milk sugar',
  'laktoshaltig', 'lactose-containing'
];

// Lactose-free markers
const LACTOSE_FREE_KEYWORDS = [
  'laktosfri', 'laktosfritt', 'lactose free', 'lactose-free'
];

// Traces/cross-contamination phrases
const TRACES_PHRASES = [
  'kan innehålla spår av', 'kan innehålla', 'spår av',
  'may contain traces of', 'may contain', 'traces of',
  'kan indeholde spor af', 'spor af',
  'kan inneholde spor av', 'spor av',
  'saattaa sisältää', 'jälkiä',
  'produced in a facility', 'manufactured in'
];

// Find keyword matches with evidence snippets
function findKeywordMatches(text, keywords) {
  const matches = [];
  const lowerText = text.toLowerCase();

  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const idx = match.index;
      const snippet = text.substring(
        Math.max(0, idx - 15),
        Math.min(text.length, idx + keyword.length + 15)
      ).trim();
      matches.push(snippet);
    }
  }

  return [...new Set(matches)]; // Remove duplicates
}

// Find traces phrases with context
function findTracesPhrases(text, allergenKeywords) {
  const matches = [];
  const lowerText = text.toLowerCase();

  for (const phrase of TRACES_PHRASES) {
    const idx = lowerText.indexOf(phrase.toLowerCase());
    if (idx !== -1) {
      // Get a larger context around the traces phrase
      const contextStart = Math.max(0, idx - 10);
      const contextEnd = Math.min(text.length, idx + phrase.length + 40);
      const context = text.substring(contextStart, contextEnd).toLowerCase();

      // Check if any allergen keyword appears near this traces phrase
      for (const keyword of allergenKeywords) {
        if (context.includes(keyword.toLowerCase())) {
          const snippet = text.substring(contextStart, contextEnd).trim();
          matches.push(snippet);
          break;
        }
      }

      // Also check for generic traces mention
      if (matches.length === 0) {
        const snippet = text.substring(contextStart, contextEnd).trim();
        matches.push(snippet);
      }
    }
  }

  return [...new Set(matches)];
}

// Keyword-based detection
function localKeywordDetection(text) {
  const lowerText = text.toLowerCase();

  // Check for gluten-free markers
  const glutenFreeMatches = findKeywordMatches(text, GLUTEN_FREE_KEYWORDS);
  const isGlutenFree = glutenFreeMatches.length > 0;

  // Find gluten ingredients
  const glutenMatches = findKeywordMatches(text, GLUTEN_KEYWORDS);
  const glutenContains = glutenMatches.length > 0 && !isGlutenFree;

  // Find milk ingredients
  const milkMatches = findKeywordMatches(text, MILK_KEYWORDS);
  const milkContains = milkMatches.length > 0;

  // Find traces mentions for gluten
  const glutenTracesMatches = findTracesPhrases(text, [...GLUTEN_KEYWORDS, 'gluten', 'vete', 'wheat']);
  const glutenTraces = glutenTracesMatches.length > 0;

  // Find traces mentions for milk
  const milkTracesMatches = findTracesPhrases(text, [...MILK_KEYWORDS, 'mjölk', 'milk', 'lactose']);
  const milkTraces = milkTracesMatches.length > 0;

  // Find soy ingredients and traces
  const soyMatches = findKeywordMatches(text, SOY_KEYWORDS);
  const soyContains = soyMatches.length > 0;
  const soyTracesMatches = findTracesPhrases(text, [...SOY_KEYWORDS, 'soja', 'soy']);
  const soyTraces = soyTracesMatches.length > 0;

  // Find egg ingredients and traces
  const eggMatches = findKeywordMatches(text, EGG_KEYWORDS);
  const eggContains = eggMatches.length > 0;
  const eggTracesMatches = findTracesPhrases(text, [...EGG_KEYWORDS, 'ägg', 'egg']);
  const eggTraces = eggTracesMatches.length > 0;

  // Find nut ingredients and traces
  const nutMatches = findKeywordMatches(text, NUT_KEYWORDS);
  const nutContains = nutMatches.length > 0;
  const nutTracesMatches = findTracesPhrases(text, [...NUT_KEYWORDS, 'nötter', 'nuts']);
  const nutTraces = nutTracesMatches.length > 0;

  // Find lactose ingredients and traces
  const lactoseFreeMatches = findKeywordMatches(text, LACTOSE_FREE_KEYWORDS);
  const isLactoseFree = lactoseFreeMatches.length > 0;
  const lactoseMatches = findKeywordMatches(text, LACTOSE_KEYWORDS);
  const lactoseContains = lactoseMatches.length > 0 && !isLactoseFree;
  const lactoseTracesMatches = findTracesPhrases(text, [...LACTOSE_KEYWORDS, 'laktos', 'lactose']);
  const lactoseTraces = lactoseTracesMatches.length > 0;

  // Helper to calculate confidence
  const calcConf = (matches, tracesMatches) =>
    (matches.length > 0 || tracesMatches.length > 0)
      ? Math.min(0.9, 0.6 + (matches.length + tracesMatches.length) * 0.1)
      : 0.7;

  // Build notes
  const notes = [];
  if (isGlutenFree) notes.push('Marked gluten-free');
  if (glutenContains) notes.push(`Found ${glutenMatches.length} gluten ingredient(s)`);
  if (milkContains) notes.push(`Found ${milkMatches.length} milk ingredient(s)`);
  if (soyContains) notes.push(`Found ${soyMatches.length} soy ingredient(s)`);
  if (eggContains) notes.push(`Found ${eggMatches.length} egg ingredient(s)`);
  if (nutContains) notes.push(`Found ${nutMatches.length} nut ingredient(s)`);
  if (lactoseContains) notes.push(`Found ${lactoseMatches.length} lactose ingredient(s)`);
  if (glutenTraces) notes.push('Gluten traces warning found');
  if (milkTraces) notes.push('Milk traces warning found');
  if (soyTraces) notes.push('Soy traces warning found');
  if (eggTraces) notes.push('Egg traces warning found');
  if (nutTraces) notes.push('Nut traces warning found');
  if (lactoseTraces) notes.push('Lactose traces warning found');
  if (isLactoseFree) notes.push('Marked lactose-free');

  return {
    gluten: {
      contains: glutenContains,
      traces: glutenTraces,
      confidence: calcConf(glutenMatches, glutenTracesMatches),
      evidence: [...glutenMatches, ...glutenTracesMatches, ...glutenFreeMatches].slice(0, 4)
    },
    milk: {
      contains: milkContains,
      traces: milkTraces,
      confidence: calcConf(milkMatches, milkTracesMatches),
      evidence: [...milkMatches, ...milkTracesMatches].slice(0, 4)
    },
    soy: {
      contains: soyContains,
      traces: soyTraces,
      confidence: calcConf(soyMatches, soyTracesMatches),
      evidence: [...soyMatches, ...soyTracesMatches].slice(0, 4)
    },
    eggs: {
      contains: eggContains,
      traces: eggTraces,
      confidence: calcConf(eggMatches, eggTracesMatches),
      evidence: [...eggMatches, ...eggTracesMatches].slice(0, 4)
    },
    nuts: {
      contains: nutContains,
      traces: nutTraces,
      confidence: calcConf(nutMatches, nutTracesMatches),
      evidence: [...nutMatches, ...nutTracesMatches].slice(0, 4)
    },
    lactose: {
      contains: lactoseContains,
      traces: lactoseTraces,
      confidence: calcConf(lactoseMatches, lactoseTracesMatches),
      evidence: [...lactoseMatches, ...lactoseTracesMatches, ...lactoseFreeMatches].slice(0, 4)
    },
    method: 'keywords',
    notes: notes.join('; ') || 'No allergens detected'
  };
}

// LLM-based classification
async function classifyWithLLM(text) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `You are an allergen detection system. Analyze ingredient lists and identify allergens.

STRICT RULES:
1. "contains" = ONLY when ingredient list explicitly includes a gluten/milk ingredient (vete, vetemjöl, mjölk, vassle, etc.)
2. "traces" = ONLY when text explicitly indicates possible cross-contamination:
   - Swedish: "kan innehålla spår av", "kan innehålla", "spår av"
   - English: "may contain", "may contain traces of", "traces of"
   - Danish/Norwegian variants
3. If BOTH appear, set contains=true AND traces=true separately
4. If "glutenfri/gluten free" appears, do NOT set contains=true UNLESS explicit gluten ingredient is present. Traces can still be true.
5. Evidence MUST be exact short substrings copied from input (no invention)

Respond ONLY with valid JSON:
{
  "gluten": { "contains": boolean, "traces": boolean, "confidence": 0..1, "evidence": ["exact snippets"] },
  "milk": { "contains": boolean, "traces": boolean, "confidence": 0..1, "evidence": ["exact snippets"] },
  "notes": "brief summary"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze for gluten and milk allergens:\n\n${text}` }
    ],
    temperature: 0.1,
    max_tokens: 600,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  const result = JSON.parse(content);

  // Validate response structure
  if (!result.gluten || !result.milk ||
      typeof result.gluten.contains !== 'boolean' ||
      typeof result.gluten.traces !== 'boolean' ||
      typeof result.milk.contains !== 'boolean' ||
      typeof result.milk.traces !== 'boolean') {
    throw new Error('Invalid LLM response structure');
  }

  return {
    ...result,
    method: 'llm'
  };
}

// POST /api/classify endpoint
app.post('/api/classify', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "text" field' });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    let result;

    // Use keywords only if configured or no API key
    if (USE_KEYWORDS_ONLY || !openai) {
      console.log('Using fast keyword detection');
      result = localKeywordDetection(text);
    } else {
      // Try LLM classification with timeout
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('LLM timeout')), 10000)
        );
        result = await Promise.race([classifyWithLLM(text), timeoutPromise]);
        console.log('LLM classification successful');
      } catch (llmError) {
        console.error('LLM failed, using keywords:', llmError.message);
        result = localKeywordDetection(text);
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Classification failed', message: error.message });
  }
});

// POST /api/scan - Combined OCR + Classification (faster)
app.post('/api/scan', async (req, res) => {
  const startTime = Date.now();
  console.log('\n========== SCAN REQUEST ==========');
  console.log(`[STEP 1] ${new Date().toISOString()} - Request received`);

  try {
    const { image } = req.body;

    if (!image) {
      console.log('[ERROR] No image in request body');
      return res.status(400).json({ error: 'Missing "image" field (base64)' });
    }

    const imageSize = Math.round(image.length / 1024);
    console.log(`[STEP 2] Image received - Size: ${imageSize}KB`);

    // Use mock data for development
    if (USE_MOCK_DATA) {
      console.log(`[STEP 3] Using MOCK DATA (OCR bypassed)`);

      const extractedText = MOCK_INGREDIENTS;
      const classification = localKeywordDetection(extractedText);

      console.log(`[STEP 4] ${Date.now() - startTime}ms - Mock classification done`);
      console.log('========== SCAN COMPLETE (MOCK) ==========\n');

      return res.json({
        text: extractedText,
        ...classification,
        timing: {
          total_ms: Date.now() - startTime
        },
        mock: true
      });
    }

    // Prepare OCR request
    const base64Image = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;

    // Helper function to make OCR request
    const makeOCRRequest = async (engine, timeoutMs) => {
      const formData = new URLSearchParams();
      formData.append('base64Image', base64Image);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('OCREngine', engine);
      formData.append('scale', 'true');
      formData.append('detectOrientation', 'false');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: {
            'apikey': OCR_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
      } catch (err) {
        clearTimeout(timeout);
        throw err;
      }
    };

    console.log(`[STEP 3] ${Date.now() - startTime}ms - Sending to OCR.space (Engine 2)...`);

    let ocrResponse;
    try {
      // Try Engine 2 first (faster for photos)
      ocrResponse = await makeOCRRequest('2', 25000);

      // If Engine 2 fails or times out, try Engine 1
      const result = await ocrResponse.json();
      if (!result.ParsedResults || !result.ParsedResults[0] || result.IsErroredOnProcessing) {
        console.log(`[STEP 3b] ${Date.now() - startTime}ms - Engine 2 failed, trying Engine 1...`);
        ocrResponse = await makeOCRRequest('1', 25000);
      } else {
        // Engine 2 worked, reconstruct response-like object
        ocrResponse = {
          status: 200,
          json: async () => result
        };
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`[STEP 3b] ${Date.now() - startTime}ms - Engine 2 timeout, trying Engine 1...`);
        ocrResponse = await makeOCRRequest('1', 25000);
      } else {
        throw err;
      }
    }

    try {

      console.log(`[STEP 4] ${Date.now() - startTime}ms - OCR.space responded (status: ${ocrResponse.status})`);

      const ocrResult = await ocrResponse.json();
      console.log(`[STEP 5] ${Date.now() - startTime}ms - OCR result parsed`);

      if (!ocrResult.ParsedResults || !ocrResult.ParsedResults[0]) {
        console.log('[ERROR] OCR failed:', JSON.stringify(ocrResult).substring(0, 200));
        return res.status(400).json({
          error: 'OCR failed',
          message: ocrResult.ErrorMessage || ocrResult.ErrorDetails || 'Could not extract text'
        });
      }

      const extractedText = ocrResult.ParsedResults[0].ParsedText;
      console.log(`[STEP 6] ${Date.now() - startTime}ms - Text extracted (${extractedText.length} chars)`);

      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({ error: 'No text found in image' });
      }

      // Run classification
      const classification = localKeywordDetection(extractedText);
      console.log(`[STEP 7] ${Date.now() - startTime}ms - Classification done`);

      const response = {
        text: extractedText,
        ...classification,
        timing: {
          total_ms: Date.now() - startTime
        }
      };

      console.log(`[STEP 8] ${Date.now() - startTime}ms - Sending response to app`);
      console.log('========== SCAN COMPLETE ==========\n');

      res.json(response);

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        console.log(`[ERROR] ${Date.now() - startTime}ms - OCR.space TIMEOUT (both engines failed)`);
        return res.status(504).json({ error: 'OCR timeout', message: 'OCR.space took too long (>50s total)' });
      }
      throw fetchError;
    }

  } catch (error) {
    console.log(`[ERROR] ${Date.now() - startTime}ms - ${error.message}`);
    res.status(500).json({ error: 'Scan failed', message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  console.log('[HEALTH] Health check received');
  res.json({
    status: 'ok',
    llm_available: !!openai,
    keywords_only: USE_KEYWORDS_ONLY,
    timestamp: new Date().toISOString()
  });
});

// Simple ping endpoint for testing connectivity
app.get('/api/ping', (_req, res) => {
  console.log('[PING] Ping received from client');
  res.json({ pong: true, time: Date.now() });
});

app.post('/api/ping', (_req, res) => {
  console.log('[PING POST] Ping POST received from client');
  res.json({ pong: true, time: Date.now() });
});

// Recipe assistant endpoint
app.post('/api/recipe', async (req, res) => {
  const { query, dietary_context, servings } = req.body;
  const numServings = servings || 2;
  console.log(`[RECIPE] Query: "${query}" | Servings: ${numServings} | Context: "${dietary_context}"`);

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  // If OpenAI is available, use it
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful recipe assistant for people with dietary restrictions.
Given a user's request and their dietary context, suggest a recipe that is safe for everyone mentioned.

IMPORTANT RULES:
- Scale the recipe for exactly ${numServings} servings/people.
- Use ONLY European/metric measurements (grams, kilograms, millilitres, litres, degrees Celsius). Never use cups, ounces, pounds, or Fahrenheit.

You MUST respond with valid JSON in this exact format:
{
  "name": "Recipe Name (${numServings} servings)",
  "description": "Brief description of the dish",
  "ingredients": [
    {"item": "ingredient name", "amount": "quantity in metric", "warning": "optional allergen note or null"}
  ],
  "instructions": "Brief cooking instructions as a single string",
  "shopping_tips": ["tip 1", "tip 2"],
  "dietary_notes": "Summary of how this recipe accommodates the dietary restrictions"
}

Make sure ingredients that need allergen-free versions have a warning field explaining what to buy instead.
Keep it concise and practical. Return ONLY valid JSON, no markdown.`
          },
          {
            role: 'user',
            content: `Dietary context: ${dietary_context || 'No restrictions.'}\nNumber of people: ${numServings}\n\nRequest: ${query}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const raw = completion.choices[0]?.message?.content || '';
      console.log(`[RECIPE] Generated ${raw.length} chars`);

      // Try to parse as JSON
      try {
        const parsed = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
        return res.json({
          response: formatRecipeText(parsed),
          recipe: parsed,
        });
      } catch (parseErr) {
        // If not valid JSON, return raw text
        console.log('[RECIPE] Could not parse JSON, returning raw text');
        return res.json({ response: raw, recipe: null });
      }
    } catch (err) {
      console.error('[RECIPE] OpenAI error:', err.message);
      return res.status(500).json({ error: 'Could not generate recipe. AI service unavailable.' });
    }
  }

  // No AI available
  return res.status(503).json({ error: 'Recipe generation requires an AI service. Please configure OPENAI_API_KEY.' });
});

function formatRecipeText(recipe) {
  if (!recipe || !recipe.name) return 'Could not generate recipe.';

  let text = `🍽️ ${recipe.name}\n${recipe.description || ''}\n\n`;
  text += `📝 Ingredients:\n`;
  (recipe.ingredients || []).forEach((ing) => {
    text += `• ${ing.amount ? ing.amount + ' ' : ''}${ing.item}`;
    if (ing.warning) text += ` ⚠️ ${ing.warning}`;
    text += '\n';
  });
  text += `\n👨‍🍳 Instructions:\n${recipe.instructions || ''}\n`;
  if (recipe.shopping_tips?.length) {
    text += `\n🛒 Shopping tips:\n`;
    recipe.shopping_tips.forEach((tip) => { text += `• ${tip}\n`; });
  }
  if (recipe.dietary_notes) {
    text += `\n⚠️ ${recipe.dietary_notes}`;
  }
  return text;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Allergen classifier backend running on http://0.0.0.0:${PORT}`);
  console.log(`Access from phone: http://10.30.2.142:${PORT}`);
  console.log(`LLM available: ${!!openai}, Keywords only: ${USE_KEYWORDS_ONLY}`);
});
