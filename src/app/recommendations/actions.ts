'use server';

import {
  generateRecommendations,
  type GenerateRecommendationsInput,
} from '@/ai/flows/generate-recommendations';

export async function getAiRecommendations(
  input: GenerateRecommendationsInput
) {
  return await generateRecommendations(input);
}
