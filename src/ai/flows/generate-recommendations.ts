'use server';
/**
 * @fileOverview An AI agent for generating personalized fitness and diet recommendations.
 *
 * - generateRecommendations: A function that handles the recommendation generation process.
 */

import { ai } from '@/ai/genkit';
import { GenerateRecommendationsInputSchema, GenerateRecommendationsOutputSchema, type GenerateRecommendationsInput, type GenerateRecommendationsOutput } from '@/ai/flows/recommendations.d';


export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: { schema: GenerateRecommendationsInputSchema },
  output: { schema: GenerateRecommendationsOutputSchema },
  prompt: `You are an expert fitness coach and registered dietitian. Your task is to create a personalized workout and diet plan based on the user's information. Be encouraging, clear, and professional.

User's Information:
- Age: {{age}}
- Weight: {{weight}} kg
- Height: {{height}} cm
- Primary Goal: {{goal}}
- Activity Level: {{activityLevel}}
{{#if medical}}- Medical Conditions/Allergies: {{{medical}}}{{/if}}
{{#if photoDataUri}}- Photo: {{media url=photoDataUri}}{{/if}}

Based on this information, provide a comprehensive and actionable plan.

Generate a detailed workout plan. It should be easy to follow. Include the number of workout days per week, and a mix of exercises (e.g., Cardio, Strength, Flexibility).

Then, generate a detailed diet and nutrition plan. Provide sample meals. **IMPORTANT**: You MUST strictly adhere to any medical conditions, deficiencies, or allergies mentioned. If the user mentions an allergy (e.g., peanuts), do not include that ingredient in your suggestions. If no medical information is given, create a general healthy plan and explicitly state that they should consult with a healthcare professional before starting any new diet.

Format your entire response as a single JSON object that conforms to the output schema.
`,
});

const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
