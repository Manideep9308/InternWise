'use server';

/**
 * @fileOverview An AI agent that optimizes a resume for a specific job.
 * 
 * - optimizeResume - Analyzes a resume against a job description and suggests improvements.
 * - OptimizeResumeInput - The input type for the optimizeResume function.
 * - OptimizeResumeOutput - The return type for the optimizeResume function.
 */

import {ai} from '@/ai/genkit';
import {
  OptimizeResumeInputSchema,
  OptimizeResumeOutputSchema,
  type OptimizeResumeInput,
  type OptimizeResumeOutput,
} from '@/lib/types';


export async function optimizeResume(input: OptimizeResumeInput): Promise<OptimizeResumeOutput> {
  return optimizeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumePrompt',
  input: {schema: OptimizeResumeInputSchema},
  output: {schema: OptimizeResumeOutputSchema},
  prompt: `You are an expert AI resume editor and career coach. Your task is to analyze a student's profile and provide specific, actionable advice to tailor it for a target job description. Do not be generic; provide concrete, rewritten examples.

Here is the student's profile:
{{{studentProfile}}}

Here is the target job description:
{{{jobDescription}}}

Perform the following actions:
1.  **Overall Feedback:** Provide a brief, high-level summary of how the resume can be better tailored to the job description.
2.  **Suggested Improvements:** Identify 2-3 specific sentences or bullet points in the student's profile (especially in the 'about' or 'projects' sections) that could be stronger. For each, provide the original text, a rewritten 'suggestedText' that is more impactful or better aligned with the job, and a 'reasoning' for the change. Focus on adding quantification, using stronger action verbs, and incorporating keywords from the job description.
3.  **Missing Keywords:** Identify important skills or technologies from the job description that are missing from the student's profile. List them out so the student knows what to add if they have that experience.

Your goal is to help the student get past automated screening and impress a human recruiter for this specific role.
`,
});

const optimizeResumeFlow = ai.defineFlow(
  {
    name: 'optimizeResumeFlow',
    inputSchema: OptimizeResumeInputSchema,
    outputSchema: OptimizeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
