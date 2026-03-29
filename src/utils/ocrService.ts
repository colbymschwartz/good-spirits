const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

// Placeholder — Colby will provide the real key
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY || '';

export interface OcrResult {
  text: string;
  confidence: number;
}

/**
 * Extract text from an image using Google Cloud Vision API.
 * Accepts base64-encoded image data directly from expo-image-picker.
 * Returns the full detected text or null if OCR fails.
 */
export async function extractTextFromImage(base64Data: string): Promise<OcrResult | null> {
  if (!API_KEY) {
    console.warn('Google Cloud Vision API key not configured');
    return null;
  }

  try {
    const body = {
      requests: [
        {
          image: { content: base64Data },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        },
      ],
    };

    const response = await fetch(`${VISION_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Vision API error:', response.status);
      return null;
    }

    const data = await response.json();
    const annotations = data.responses?.[0]?.textAnnotations;

    if (!annotations || annotations.length === 0) {
      return null;
    }

    // First annotation is the full detected text
    return {
      text: annotations[0].description || '',
      confidence: data.responses[0].fullTextAnnotation?.pages?.[0]?.confidence ?? 0,
    };
  } catch (error) {
    console.error('OCR extraction failed:', error);
    return null;
  }
}
