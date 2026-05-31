/**
 * Centralized runtime configuration + feature detection.
 *
 * The app is designed to run end-to-end with an empty `.env` file: any service
 * whose API key is missing falls back to built-in MOCK data. When a key IS
 * present, the corresponding feature switches to REAL data automatically.
 *
 * See `.env.template` for the full list of variables.
 */

export const config = {
  /**
   * MapTiler key for basemap tiles + hosted GeoJSON datasets.
   * NEXT_PUBLIC_ is intentionally exposed to the browser (the map renders client-side).
   */
  maptilerKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? '',

  /**
   * Google AI (Gemini) key for the Typhoon LLM GIS assistant.
   * Server-side only. Genkit's googleAI() plugin reads any of these names,
   * so we check all three here for parity.
   */
  googleAiKey:
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_API_KEY ??
    process.env.GOOGLE_GENAI_API_KEY ??
    '',
} as const;

/** True when a real Gemini key is configured — the LLM assistant runs live. */
export function isLlmConfigured(): boolean {
  return config.googleAiKey.trim().length > 0;
}

/** True when a MapTiler key is configured (vs. the shared demo-key fallback). */
export function isMapConfigured(): boolean {
  return config.maptilerKey.trim().length > 0;
}
