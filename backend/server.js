require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize OpenAI client (only if API key is available)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Keyword patterns for fallback detection
const GLUTEN_KEYWORDS = [
  'gluten', 'vete', 'hvete', 'wheat', 'råg', 'rug', 'rye',
  'korn', 'byg', 'barley', 'malt', 'maltextrakt', 'maltextract',
  'vetemjöl', 'hvetemjøl', 'wheat flour', 'semolina', 'spelt', 'dinkel'
];

const GLUTEN_FREE_KEYWORDS = [
  'glutenfri', 'glutenfritt', 'gluten free', 'gluten-free', 'glutenfrei'
];

const MILK_KEYWORDS = [
  'mjölk', 'melk', 'mælk', 'milk', 'vassle', 'valle', 'myse', 'whey',
  'laktos', 'lactose', 'kasein', 'casein', 'caseinate', 'kaseinat',
  'ost', 'cheese', 'grädde', 'fløde', 'cream', 'smör', 'butter', 'smør',
  'yoghurt', 'yogurt', 'skummjölk', 'helmjölk', 'skim milk', 'whole milk',
  'mjölkpulver', 'milk powder', 'torrjölk', 'dried milk'
];

// Fallback: Local keyword detection
function localKeywordDetection(text) {
  const lowerText = text.toLowerCase();
  const evidence = [];

  // Check for gluten-free markers first
  let glutenFreeFound = false;
  for (const keyword of GLUTEN_FREE_KEYWORDS) {
    const idx = lowerText.indexOf(keyword);
    if (idx !== -1) {
      glutenFreeFound = true;
      const snippet = text.substring(Math.max(0, idx - 5), Math.min(text.length, idx + keyword.length + 5)).trim();
      evidence.push(snippet);
    }
  }

  // Check for gluten indicators
  let hasGluten = false;
  const glutenEvidence = [];
  for (const keyword of GLUTEN_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const match = regex.exec(text);
    if (match) {
      hasGluten = true;
      const idx = match.index;
      const snippet = text.substring(Math.max(0, idx - 10), Math.min(text.length, idx + keyword.length + 10)).trim();
      glutenEvidence.push(snippet);
    }
  }

  // If gluten-free is found and no contradictory gluten ingredients, mark as no gluten
  if (glutenFreeFound && !hasGluten) {
    hasGluten = false;
  }

  // Check for milk indicators
  let hasMilk = false;
  const milkEvidence = [];
  for (const keyword of MILK_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const match = regex.exec(text);
    if (match) {
      hasMilk = true;
      const idx = match.index;
      const snippet = text.substring(Math.max(0, idx - 10), Math.min(text.length, idx + keyword.length + 10)).trim();
      milkEvidence.push(snippet);
    }
  }

  return {
    has_gluten: hasGluten,
    has_milk: hasMilk,
    confidence: 0.4,
    evidence: [...new Set([...glutenEvidence, ...milkEvidence, ...evidence])].slice(0, 5),
    method: 'keyword_fallback'
  };
}

// LLM-based classification
async function classifyWithLLM(text) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `You are an allergen detection system. Analyze ingredient lists and identify allergens.

Classification rules:
- Gluten indicators: gluten, vete/hvete/wheat, råg/rug/rye, korn/byg/barley, malt/maltextrakt, vetemjöl, semolina, spelt
- Milk indicators: mjölk/melk/mælk/milk, vassle/valle/myse/whey, laktos/lactose, kasein/casein/caseinate, ost/cheese, grädde/fløde/cream, smör/butter, yoghurt
- If "glutenfri" or "gluten free" appears, treat as NO gluten unless contradictory gluten ingredients are explicitly present.
- Evidence must be exact short snippets copied from the input text (no invention).

Respond ONLY with valid JSON in this exact format:
{
  "has_gluten": boolean,
  "has_milk": boolean,
  "confidence": number between 0 and 1,
  "evidence": ["exact snippet 1", "exact snippet 2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this ingredient text for gluten and milk allergens:\n\n${text}` }
    ],
    temperature: 0.1,
    max_tokens: 500,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  const result = JSON.parse(content);

  // Validate response structure
  if (typeof result.has_gluten !== 'boolean' ||
      typeof result.has_milk !== 'boolean' ||
      typeof result.confidence !== 'number' ||
      !Array.isArray(result.evidence)) {
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

    // Try LLM classification first
    if (openai) {
      try {
        result = await classifyWithLLM(text);
        console.log('LLM classification successful');
      } catch (llmError) {
        console.error('LLM classification failed, falling back to keywords:', llmError.message);
        result = localKeywordDetection(text);
      }
    } else {
      console.log('No OpenAI API key, using keyword detection');
      result = localKeywordDetection(text);
    }

    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Classification failed', message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    llm_available: !!openai,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Allergen classifier backend running on port ${PORT}`);
  console.log(`LLM available: ${!!openai}`);
  if (!openai) {
    console.log('Set OPENAI_API_KEY in .env to enable LLM classification');
  }
});
