'use server';

/**
 * @fileOverview A cover letter generation AI agent.
 *
 * - generateCoverLetter - A function that handles the cover letter generation process.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  jobDescription: z.string().describe('The description of the internship job posting.'),
  profileInformation: z.string().describe('The profile information of the student.'),
  tone: z.string().describe('The tone of the cover letter, e.g., formal, informal, enthusiastic.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert career advisor specializing in writing cover letters.

You will use the following information to write a cover letter for the student.

Job Description: {{{jobDescription}}}
Profile Information: {{{profileInformation}}}
Tone: {{{tone}}}

Write a cover letter that is tailored to the job description and profile information, and that has the specified tone.`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
