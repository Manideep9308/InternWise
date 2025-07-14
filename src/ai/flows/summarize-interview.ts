'use server';

/**
 * @fileOverview An AI agent to summarize an interview performance.
 *
 * - summarizeInterview - A function that handles the interview summarization process.
 * - SummarizeInterviewInput - The input type for the summarizeInterview function.
 * - SummarizeInterviewOutput - The return type for the summarizeInterview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MessageSchema } from '@/lib/types';

const SummarizeInterviewInputSchema = z.object({
  studentProfile: z.string().describe('The student profile information including skills and experience.'),
  selectedInternship: z.string().describe('The description of the selected internship including required skills.'),
  conversationHistory: z.array(MessageSchema).describe('The full conversation history between the user and the AI coach.'),
});
export type SummarizeInterviewInput = z.infer<typeof SummarizeInterviewInputSchema>;

const SummarizeInterviewOutputSchema = z.object({
  summary: z.string().describe('A detailed summary of the student\'s interview performance, including strengths, weaknesses, and suggestions for improvement. Format this as markdown, using headings, bold text, and bullet points.'),
});
export type SummarizeInterviewOutput = z.infer<typeof SummarizeInterviewOutputSchema>;

export async function summarizeInterview(input: SummarizeInterviewInput): Promise<SummarizeInterviewOutput> {
  return summarizeInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInterviewPrompt',
  input: { schema: SummarizeInterviewInputSchema },
  output: { schema: SummarizeInterviewOutputSchema },
  prompt: `You are an expert career advisor. Your task is to provide a detailed performance review for a student based on their mock interview transcript.

  Evaluate the student's answers based on the requirements of the internship and their profile. Provide constructive feedback, highlighting both strengths and areas for improvement. Structure your feedback clearly. Use markdown for formatting. Start with an overall summary. Then provide sections for "Strengths", "Areas for Improvement", and "Actionable Advice".

  Student Profile: {{{studentProfile}}}
  Selected Internship: {{{selectedInternship}}}

  Interview Transcript:
  {{#each conversationHistory}}
  {{this.role}}: {{{this.content}}}
  {{/each}}
  `,
});

const summarizeInterviewFlow = ai.defineFlow(
  {
    name: 'summarizeInterviewFlow',
    inputSchema: SummarizeInterviewInputSchema,
    outputSchema: SummarizeInterviewOutputSchema,
  },
  async (input) => {
    try {
        if (input.conversationHistory.length === 0) {
            return { summary: 'No conversation was recorded, so no summary could be generated.'};
        }
        const { output } = await prompt(input);
        return output!;
    } catch (e) {
        console.error("Error in summarizeInterviewFlow: ", e);
        throw new Error("The AI service failed to summarize the interview. Please check your API key and try again.");
    }
  }
);
