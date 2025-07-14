'use server';

/**
 * @fileOverview An AI agent to screen and rank internship applicants.
 *
 * - rankApplicants - A function that ranks applicants based on their profile against a job description.
 * - RankApplicantsInput - The input type for the rankApplicants function.
 * - RankApplicantsOutput - The return type for the rankApplicants function.
 */

import { ai } from '@/ai/genkit';
import { StudentProfileSchema } from '@/lib/types';
import { z } from 'genkit';

const RankApplicantsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The full job description for the internship.'),
  studentProfiles: z
    .array(StudentProfileSchema)
    .describe("A list of student profiles who have applied for the job."),
});
export type RankApplicantsInput = z.infer<typeof RankApplicantsInputSchema>;

const RankedApplicantSchema = z.object({
  email: z.string().describe("The student's email, to be used as a unique identifier."),
  name: z.string().describe("The student's full name."),
  score: z.number().describe('A match score from 0 to 100, representing how well the student fits the job description.'),
  justification: z
    .string()
    .describe(
      'A concise, 1-2 sentence explanation for the score, highlighting key strengths or weaknesses.'
    ),
});

const RankApplicantsOutputSchema = z.object({
  rankedApplicants: z
    .array(RankedApplicantSchema)
    .describe(
      'A list of all applicants, ranked from highest score to lowest.'
    ),
});
export type RankApplicantsOutput = z.infer<typeof RankApplicantsOutputSchema>;

export async function rankApplicants(
  input: RankApplicantsInput
): Promise<RankApplicantsOutput> {
  return rankApplicantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankApplicantsPrompt',
  input: { schema: RankApplicantsInputSchema },
  output: { schema: RankApplicantsOutputSchema },
  prompt: `You are an expert hiring manager tasked with screening candidates for an internship.
  
  Your goal is to analyze each student profile against the provided job description and rank them based on their suitability for the role.
  
  For each applicant, you must:
  1.  Carefully compare their skills, education, and professional summary with the job requirements.
  2.  Assign a "match score" from 0 (not a fit) to 100 (a perfect match).
  3.  Write a brief justification for the score, mentioning the most important factors.
  
  Return a ranked list of all provided applicants, from the highest score to the lowest.
  
  **Job Description:**
  {{{jobDescription}}}
  
  **Student Profiles (JSON format):**
  {{{json studentProfiles}}}
  `,
});

const rankApplicantsFlow = ai.defineFlow(
  {
    name: 'rankApplicantsFlow',
    inputSchema: RankApplicantsInputSchema,
    outputSchema: RankApplicantsOutputSchema,
  },
  async (input) => {
    try {
      if (input.studentProfiles.length === 0) {
        return { rankedApplicants: [] };
      }
      const { output } = await prompt(input);
      return output!;
    } catch (e) {
        console.error("Error in rankApplicantsFlow: ", e);
        throw new Error("The AI service failed to rank applicants. Please check your API key and try again.");
    }
  }
);
