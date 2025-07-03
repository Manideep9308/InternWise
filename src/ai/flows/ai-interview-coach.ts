'use server';

/**
 * @fileOverview An AI Interview Coach agent.
 * 
 * - interviewCoach - A function that handles the interview coaching process.
 * - InterviewCoachInput - The input type for the interviewCoach function.
 * - InterviewCoachOutput - The return type for the interviewCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewCoachInputSchema = z.object({
  studentProfile: z.string().describe('The student profile information including skills and experience.'),
  selectedInternship: z.string().describe('The description of the selected internship including required skills.'),
  userMessage: z.string().describe('The user message to the interview coach.'),
});
export type InterviewCoachInput = z.infer<typeof InterviewCoachInputSchema>;

const InterviewCoachOutputSchema = z.object({
  aiResponse: z.string().describe('The AI Interview Coach response.'),
});
export type InterviewCoachOutput = z.infer<typeof InterviewCoachOutputSchema>;

export async function interviewCoach(input: InterviewCoachInput): Promise<InterviewCoachOutput> {
  return interviewCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewCoachPrompt',
  input: {schema: InterviewCoachInputSchema},
  output: {schema: InterviewCoachOutputSchema},
  prompt: `You are an AI Interview Coach, designed to help students practice for interviews.
  You will ask the student interview questions based on their profile and the selected internship.
  You will also provide feedback on their answers.

  Student Profile: {{{studentProfile}}}
  Selected Internship: {{{selectedInternship}}}

  Current conversation:
  {{userMessage}}`,
});

const interviewCoachFlow = ai.defineFlow(
  {
    name: 'interviewCoachFlow',
    inputSchema: InterviewCoachInputSchema,
    outputSchema: InterviewCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
