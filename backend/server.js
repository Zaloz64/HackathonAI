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
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 8000 })
  : null;

// Set to true to skip LLM and use fast keyword detection only
const USE_KEYWORDS_ONLY = process.env.USE_KEYWORDS_ONLY === 'true';

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

  // Calculate confidence
  const glutenConfidence = glutenContains || glutenTraces
    ? Math.min(0.9, 0.6 + (glutenMatches.length + glutenTracesMatches.length) * 0.1)
    : 0.7;
  const milkConfidence = milkContains || milkTraces
    ? Math.min(0.9, 0.6 + (milkMatches.length + milkTracesMatches.length) * 0.1)
    : 0.7;

  // Build notes
  const notes = [];
  if (isGlutenFree) notes.push('Marked gluten-free');
  if (glutenContains) notes.push(`Found ${glutenMatches.length} gluten ingredient(s)`);
  if (milkContains) notes.push(`Found ${milkMatches.length} milk ingredient(s)`);
  if (glutenTraces) notes.push('Gluten traces warning found');
  if (milkTraces) notes.push('Milk traces warning found');

  return {
    gluten: {
      contains: glutenContains,
      traces: glutenTraces,
      confidence: glutenConfidence,
      evidence: [...glutenMatches, ...glutenTracesMatches, ...glutenFreeMatches].slice(0, 4)
    },
    milk: {
      contains: milkContains,
      traces: milkTraces,
      confidence: milkConfidence,
      evidence: [...milkMatches, ...milkTracesMatches].slice(0, 4)
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

    // Prepare OCR request
    const base64Image = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;
    const formData = new URLSearchParams();
    formData.append('base64Image', base64Image);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('OCREngine', '1');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'false');

    console.log(`[STEP 3] ${Date.now() - startTime}ms - Sending to OCR.space...`);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log('[TIMEOUT] OCR.space timeout after 30s - aborting');
      controller.abort();
    }, 30000);

    try {
      const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': OCR_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        signal: controller.signal,
      });
      clearTimeout(timeout);

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
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        console.log(`[ERROR] ${Date.now() - startTime}ms - OCR.space TIMEOUT`);
        return res.status(504).json({ error: 'OCR timeout', message: 'OCR.space took too long (>30s)' });
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Allergen classifier backend running on http://0.0.0.0:${PORT}`);
  console.log(`Access from phone: http://10.30.2.142:${PORT}`);
  console.log(`LLM available: ${!!openai}, Keywords only: ${USE_KEYWORDS_ONLY}`);
});
