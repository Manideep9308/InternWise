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
import { MessageSchema } from '@/lib/types';

const InterviewCoachInputSchema = z.object({
  studentProfile: z.string().describe('The student profile information including skills and experience.'),
  selectedInternship: z.string().describe('The description of the selected internship including required skills.'),
  conversationHistory: z.array(MessageSchema).describe('The past conversation history between the user and the AI coach.'),
  userMessage: z.string().describe('The latest user message to the interview coach.'),
  customQuestions: z.string().optional().describe('A comma-separated list of custom questions provided by the employer.'),
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
  prompt: `You are an AI Interview Coach. Your goal is to conduct a mock interview.

  {{#if customQuestions}}
  You MUST ask the user the following questions one by one. Do not generate your own questions. After they answer one, ask the next. Start with the first question. If the user greets you, greet them back and then ask the first question.
  Custom Questions: {{{customQuestions}}}
  {{else}}
  Your goal is to conduct a realistic mock interview. Ask the student a few relevant interview questions one by one based on their profile and the selected internship.
  Keep your responses concise and focused on the interview questions.
  Provide brief feedback on their answers if they are very poor, but save detailed feedback for the end of the interview.
  If the user asks to end the interview, tell them to click the "Get Feedback" button to get their performance summary.
  {{/if}}

  Student Profile: {{{studentProfile}}}
  Selected Internship: {{{selectedInternship}}}

  Conversation History:
  {{#each conversationHistory}}
  {{this.role}}: {{{this.content}}}
  {{/each}}
  user: {{{userMessage}}}`,
});

const interviewCoachFlow = ai.defineFlow(
  {
    name: 'interviewCoachFlow',
    inputSchema: InterviewCoachInputSchema,
    outputSchema: InterviewCoachOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e) {
        console.error("Error in interviewCoachFlow: ", e);
        throw new Error("The AI coach failed to respond. Please check your API key and try again.");
    }
  }
);
