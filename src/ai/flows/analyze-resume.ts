'use server';
/**
 * @fileOverview An AI agent to analyze a resume.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  name: z.string().describe('The full name of the person from the resume.'),
  email: z.string().describe('The email address from the resume.'),
  education: z.string().describe('The education section from the resume, summarized as a single string.'),
  skills: z.string().describe('A comma-separated list of skills extracted from the resume.'),
  about: z.string().describe('A professional summary, objective, or "about me" section from the resume.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;


export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert resume analyzer. Your task is to extract key information from the provided resume.
  
  Extract the following details:
  - Full Name
  - Email Address
  - Education: Summarize the entire education history into a single, concise string.
  - Skills: Extract all relevant skills and present them as a single comma-separated string.
  - About: Extract the professional summary, objective, or "about me" section.
  
  Resume File: {{media url=resumeDataUri}}`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
