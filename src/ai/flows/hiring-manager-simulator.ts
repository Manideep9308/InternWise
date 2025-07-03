'use server';

/**
 * @fileOverview An AI agent that simulates a hiring manager reviewing a resume.
 * 
 * - hiringManagerSimulator - Simulates a hiring manager's review process.
 * - HiringManagerSimulatorInput - The input type for the hiringManagerSimulator function.
 * - HiringManagerSimulatorOutput - The return type for the hiringManagerSimulator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HiringManagerSimulatorInputSchema = z.object({
  studentProfile: z.string().describe("The student's profile information, including skills, experience, and about section."),
  jobDescription: z.string().describe("The full text of the job description for the internship."),
});
export type HiringManagerSimulatorInput = z.infer<typeof HiringManagerSimulatorInputSchema>;

const HiringManagerSimulatorOutputSchema = z.object({
  firstImpression: z.string().describe("A brief, 30-second-scan style summary of the resume from a hiring manager's perspective. Be critical and direct."),
  keywordAnalysis: z.object({
    matchedKeywords: z.array(z.string()).describe("A list of key skills and technologies from the job description that are present in the student's profile."),
    missingKeywords: z.array(z.string()).describe("A list of important skills and technologies from the job description that are missing from the student's profile."),
    analysisSummary: z.string().describe("A summary of how well the student's profile keywords match the job description."),
  }),
  predictedQuestions: z.array(z.string()).describe("A list of 2-3 specific, pointed interview questions a hiring manager might ask based on the student's profile and the job description. These should not be generic questions."),
});
export type HiringManagerSimulatorOutput = z.infer<typeof HiringManagerSimulatorOutputSchema>;

export async function hiringManagerSimulator(input: HiringManagerSimulatorInput): Promise<HiringManagerSimulatorOutput> {
  return hiringManagerSimulatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hiringManagerSimulatorPrompt',
  input: {schema: HiringManagerSimulatorInputSchema},
  output: {schema: HiringManagerSimulatorOutputSchema},
  prompt: `You are a busy and experienced hiring manager for a top tech company. You have 30 seconds to scan a candidate's profile for a specific job. Your goal is to be critical, direct, and efficient.

Based on the provided student profile and job description, perform the following tasks:

1.  **First Impression:** Give your immediate, gut-reaction summary of the candidate. Is this person a potential fit? What are the immediate strengths and red flags? Keep it brief and to the point, like a real first scan.

2.  **Keyword Analysis:**
    - Identify the key skills and technologies required by the job description.
    - Compare this to the student's profile.
    - List the skills that are a clear match.
    - List the important skills that are clearly missing.
    - Provide a brief summary of the keyword match.

3.  **Predicted Questions:**
    - Based on their specific projects or experiences, and the job requirements, formulate 2-3 specific interview questions. Avoid generic questions. Ask questions that probe for depth or challenge a claim on their profile. For example, if they list "React," and the job requires "React Hooks," a good question would be "Your profile lists React, can you describe a project where you specifically used React Hooks for state management?"

Here is the information:

**Job Description:**
{{{jobDescription}}}

**Student Profile:**
{{{studentProfile}}}
`,
});

const hiringManagerSimulatorFlow = ai.defineFlow(
  {
    name: 'hiringManagerSimulatorFlow',
    inputSchema: HiringManagerSimulatorInputSchema,
    outputSchema: HiringManagerSimulatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
