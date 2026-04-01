// Recipe extraction utilities for OCR and URL scraping

export interface ExtractedRecipe {
  name: string;
  ingredients: string[];
  instructions: string;
}

/**
 * Extract recipe from URL by fetching HTML and parsing text
 */
export async function extractRecipeFromUrl(url: string): Promise<ExtractedRecipe | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Strip HTML tags
    const text = html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return parseRecipeText(text);
  } catch (error) {
    console.error('URL extraction failed:', error);
    return null;
  }
}

/**
 * Extract recipe from image using Google Cloud Vision API
 */
export async function extractRecipeFromImage(base64Data: string): Promise<ExtractedRecipe | null> {
  try {
    const { extractTextFromImage } = await import('./ocrService');
    const ocrResult = await extractTextFromImage(base64Data);
    if (!ocrResult || !ocrResult.text.trim()) {
      return null;
    }
    return parseRecipeText(ocrResult.text);
  } catch (error) {
    console.error('Image recipe extraction failed:', error);
    return null;
  }
}

/**
 * Parse raw text into structured recipe
 */
export function parseRecipeText(text: string): ExtractedRecipe | null {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length === 0) return null;

  // First non-empty line is likely the name — unless it's a section header
  const sectionHeaderPattern = /^(ingredient|direction|instruction|step|method|how to make|what you need)/i;
  const rawName = lines[0].replace(/^recipe:?\s*/i, '').trim();
  const name = sectionHeaderPattern.test(rawName) ? 'Imported Recipe' : rawName;
  
  const ingredients: string[] = [];
  const instructionLines: string[] = [];
  
  let inIngredients = false;
  let inInstructions = false;
  
  const measurementPattern = /\b(oz|ml|cl|dash(es)?|barspoon|tsp|tbsp|cup|splash|rinse|drop|part)\b/i;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    
    // Detect section headers
    if (/^(ingredient|what you need)/i.test(line)) {
      inIngredients = true;
      inInstructions = false;
      continue;
    }
    
    if (/^(instruction|direction|step|method|how to make)/i.test(line)) {
      inIngredients = false;
      inInstructions = true;
      continue;
    }
    
    // Numbered step
    if (/^\d+[\.\)]\s/.test(line)) {
      instructionLines.push(line.replace(/^\d+[\.\)]\s*/, ''));
      inInstructions = true;
      inIngredients = false;
      continue;
    }
    
    // Clean bullet points (including ⚫ black circle emoji)
    const cleaned = line.replace(/^[-\u2022\*⚫]\s*/, '');
    
    // Ingredient detection: has measurement or starts with number
    const startsWithNumber = /^\d/.test(cleaned);
    const hasMeasurement = measurementPattern.test(cleaned);
    
    if (inIngredients || startsWithNumber || hasMeasurement) {
      ingredients.push(cleaned);
      if (!inIngredients) inIngredients = true;
    } else if (inInstructions || line.length > 30) {
      instructionLines.push(cleaned);
      if (!inInstructions) inInstructions = true;
    }
  }
  
  if (ingredients.length === 0 && instructionLines.length === 0) {
    return null;
  }
  
  return {
    name,
    ingredients,
    instructions: instructionLines.join(' '),
  };
}
