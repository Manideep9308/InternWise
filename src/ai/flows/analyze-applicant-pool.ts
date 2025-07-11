'use server';

/**
 * @fileOverview An AI agent to analyze a pool of applicants.
 *
 * - analyzeApplicantPool - A function that analyzes a list of applicants and returns aggregated data.
 * - AnalyzeApplicantPoolInput - The input type for the analyzeApplicantPool function.
 * - AnalyzeApplicantPoolOutput - The return type for the analyzeApplicantPool function.
 */

import { ai } from '@/ai/genkit';
import {
  AnalyzeApplicantPoolInputSchema,
  AnalyzeApplicantPoolOutputSchema,
  type AnalyzeApplicantPoolInput,
  type AnalyzeApplicantPoolOutput,
} from '@/lib/types';

export async function analyzeApplicantPool(
  input: AnalyzeApplicantPoolInput
): Promise<AnalyzeApplicantPoolOutput> {
  // If there are no applicants, return empty arrays to avoid calling the AI.
  if (input.studentProfiles.length === 0) {
    return {
      topSkills: [],
      universityDistribution: [],
    };
  }
  return analyzeApplicantPoolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeApplicantPoolPrompt',
  input: { schema: AnalyzeApplicantPoolInputSchema },
  output: { schema: AnalyzeApplicantPoolOutputSchema },
  prompt: `You are an expert data analyst working for a Human Resources department.
  
Your task is to analyze a list of internship applicants and provide aggregated insights.

From the provided list of student profiles, perform the following analysis:
1.  **Top Skills:** Identify the 5 most frequently mentioned skills. Consolidate similar skills (e.g., "JS" and "JavaScript" should be one). Return a list of skill names and their counts.
2.  **University Distribution:** Identify the 5 most common universities from the applicants' education history. Extract only the university name, omitting degrees and graduation years. Return a list of university names and their counts.

Analyze the following applicant data:
{{{json studentProfiles}}}
`,
});

const analyzeApplicantPoolFlow = ai.defineFlow(
  {
    name: 'analyzeApplicantPoolFlow',
    inputSchema: AnalyzeApplicantPoolInputSchema,
    outputSchema: AnalyzeApplicantPoolOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error in analyzeApplicantPoolFlow:', error);
      // Return an empty structure on failure to avoid breaking the UI
      return {
        topSkills: [],
        universityDistribution: [],
      };
    }
  }
);
