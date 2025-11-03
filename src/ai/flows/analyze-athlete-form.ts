'use server';

/**
 * @fileOverview An AI agent that analyzes athlete form in a video and provides feedback.
 *
 * - analyzeAthleteForm - A function that handles the athlete form analysis process.
 * - AnalyzeAthleteFormInput - The input type for the analyzeAthleteForm function.
 * - AnalyzeAthleteFormOutput - The return type for the analyzeAthleteForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAthleteFormInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of an athlete performing an exercise, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  exerciseType: z.string().describe('The type of exercise being performed.'),
});
export type AnalyzeAthleteFormInput = z.infer<typeof AnalyzeAthleteFormInputSchema>;

const AnalyzeAthleteFormOutputSchema = z.object({
  analysis: z.string().describe('A detailed, user-friendly analysis of the athlete\'s form in Markdown format. This should include specific, actionable feedback on posture, technique, and consistency.'),
});
export type AnalyzeAthleteFormOutput = z.infer<typeof AnalyzeAthleteFormOutputSchema>;

export async function analyzeAthleteForm(input: AnalyzeAthleteFormInput): Promise<AnalyzeAthleteFormOutput> {
  return analyzeAthleteFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAthleteFormPrompt',
  input: {schema: AnalyzeAthleteFormInputSchema},
  output: {schema: AnalyzeAthleteFormOutputSchema},
  prompt: `You are an expert sports coach analyzing an athlete's form. Your goal is to provide specific, actionable feedback in a user-friendly Markdown format.

Analyze the provided video of the athlete performing the specified exercise. Your analysis should be structured and easy to read.

- Start with a brief, encouraging summary.
- Use bullet points to highlight 2-3 key strengths of their performance.
- Use a separate section with bullet points for 2-3 "Areas for Improvement." For each point, clearly describe the issue and provide a concrete suggestion for correction.
- Focus on posture, range of motion, speed, and consistency relevant to the specific exercise.
- Ensure your feedback is directly related to the exercise shown in the video.

Exercise Type: {{{exerciseType}}}
Video: {{media url=videoDataUri}}

Generate the analysis in Markdown format.`,
});

const analyzeAthleteFormFlow = ai.defineFlow(
  {
    name: 'analyzeAthleteFormFlow',
    inputSchema: AnalyzeAthleteFormInputSchema,
    outputSchema: AnalyzeAthleteFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
