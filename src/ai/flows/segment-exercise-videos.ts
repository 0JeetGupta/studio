'use server';

/**
 * @fileOverview Automatically detects and segments exercise videos into individual repetitions or actions.
 *
 * - segmentExerciseVideo - A function that handles the exercise video segmentation process.
 * - SegmentExerciseVideoInput - The input type for the segmentExerciseVideo function.
 * - SegmentExerciseVideoOutput - The return type for the segmentExerciseVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SegmentExerciseVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of an athlete performing an exercise, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  exerciseType: z.string().describe('The type of exercise being performed.'),
});
export type SegmentExerciseVideoInput = z.infer<typeof SegmentExerciseVideoInputSchema>;

const SegmentExerciseVideoOutputSchema = z.object({
  segments: z.array(
    z.object({
      startTime: z.number().describe('The start time of the segment in seconds.'),
      endTime: z.number().describe('The end time of the segment in seconds.'),
      action: z.string().describe('A concise name for the action performed (e.g., "Push-up", "Squat", "Jump").'),
    })
  ).describe('An array of segments, each representing a single repetition or action.'),
  analysis: z.string().describe('A brief, encouraging summary of the performance, including the total number of repetitions detected. Example: "Great effort! You completed 15 repetitions."'),
});
export type SegmentExerciseVideoOutput = z.infer<typeof SegmentExerciseVideoOutputSchema>;

export async function segmentExerciseVideo(input: SegmentExerciseVideoInput): Promise<SegmentExerciseVideoOutput> {
  return segmentExerciseVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'segmentExerciseVideoPrompt',
  input: {schema: SegmentExerciseVideoInputSchema},
  output: {schema: SegmentExerciseVideoOutputSchema},
  prompt: `You are an AI assistant that analyzes exercise videos to count repetitions and segment the video into individual actions.

You will receive a video of an athlete performing an exercise and the type of exercise being performed. You must analyze the video and identify the start and end times of each complete repetition.

- The 'action' for each segment should be the name of the exercise (e.g., "Push-up", "Squat").
- The 'analysis' should be a simple, positive summary statement confirming the total repetition count.
- If no valid repetitions are detected, return an empty array for 'segments' and an appropriate analysis message.

Exercise Type: {{{exerciseType}}}
Video: {{media url=videoDataUri}}

Output the segments as an array of JSON objects and provide the summary analysis.
`,
});

const segmentExerciseVideoFlow = ai.defineFlow(
  {
    name: 'segmentExerciseVideoFlow',
    inputSchema: SegmentExerciseVideoInputSchema,
    outputSchema: SegmentExerciseVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
