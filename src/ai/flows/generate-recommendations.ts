'use server';
/**
 * @fileOverview An AI agent for generating personalized fitness and diet recommendations.
 *
 * - generateRecommendations: A function that handles the recommendation generation process.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateRecommendationsInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  height: z.number().describe('The height of the user in centimeters.'),
  goal: z
    .enum(['lose_weight', 'bulk_up', 'get_fit'])
    .describe('The primary fitness goal of the user.'),
  activityLevel: z
    .enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active'])
    .describe("The user's current activity level."),
  medical: z
    .string()
    .optional()
    .describe('A list of any medical conditions, deficiencies, or allergies the user has.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A full body photo of the user, as a data URI. This is optional but helps in providing a more accurate assessment. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

export const GenerateRecommendationsOutputSchema = z.object({
  workoutPlan: z.string().describe("A detailed, easy-to-read workout plan in Markdown format. It should specify frequency (days per week), types of exercises (cardio, strength, flexibility), and specific examples of exercises for each category. Explain why this plan is suitable for the user's goal."),
  dietPlan: z.string().describe("A detailed, easy-to-read diet and nutrition plan in Markdown format. It should provide general guidelines, macronutrient balance suggestions, and sample meal ideas for breakfast, lunch, and dinner. CRUCIALLY, it must explicitly mention and accommodate the user's stated medical conditions, allergies, or deficiencies. If none are provided, state that the plan is general and they should consult a doctor."),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;


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

Generate a detailed workout plan. It should be easy to follow. Include the number of workout days per week, and a mix of exercises (e.g., Cardio, Strength, Flexibility). Present this plan in Markdown format.

Then, generate a detailed diet and nutrition plan. Provide sample meals. **IMPORTANT**: You MUST strictly adhere to any medical conditions, deficiencies, or allergies mentioned. If the user mentions an allergy (e.g., peanuts), do not include that ingredient in your suggestions. If no medical information is given, create a general healthy plan and explicitly state that they should consult with a healthcare professional before starting any new diet. Present this plan in Markdown format.

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
