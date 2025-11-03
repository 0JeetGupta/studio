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
