'use server';

import { generateRecommendations, type GenerateRecommendationsInput } from '@/ai/flows/generate-recommendations';

export async function getAiRecommendations(
  input: GenerateRecommendationsInput
) {
  // The AI flow is called securely on the server.
  return await generateRecommendations(input);
}
