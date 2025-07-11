'use server';

/**
 * @fileOverview An AI agent to rank internships for a student.
 *
 * - rankInternships - A function that ranks internships based on a student's profile.
 * - RankInternshipsInput - The input type for the rankInternships function.
 * - RankInternshipsOutput - The return type for the rankInternships function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InternshipSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  domain: z.string(),
  stipend: z.string(),
  duration: z.string(),
  postedDate: z.string(),
  applicants: z.number(),
  description: z.string(),
  responsibilities: z.array(z.string()),
  skills: z.array(z.string()),
  perks: z.array(z.string()),
});

const RankInternshipsInputSchema = z.object({
  studentProfile: z
    .string()
    .describe(
      "The student's profile information, including skills, experience, projects, and about section."
    ),
  internships: z
    .array(InternshipSchema)
    .describe('A list of all available internships.'),
});
export type RankInternshipsInput = z.infer<typeof RankInternshipsInputSchema>;

const RankedInternshipSchema = z.object({
  id: z.string().describe('The ID of the recommended internship.'),
  justification: z
    .string()
    .describe(
      'A 1-2 sentence explanation of why this internship is a great fit for the student.'
    ),
});

const RankInternshipsOutputSchema = z.object({
  recommendations: z
    .array(RankedInternshipSchema)
    .describe(
      'A ranked list of the top 5 recommended internships for the student.'
    ),
});
export type RankInternshipsOutput = z.infer<typeof RankInternshipsOutputSchema>;

export async function rankInternships(
  input: RankInternshipsInput
): Promise<RankInternshipsOutput> {
  return rankInternshipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankInternshipsPrompt',
  input: { schema: RankInternshipsInputSchema },
  output: { schema: RankInternshipsOutputSchema },
  prompt: `You are an expert AI career advisor. Your goal is to help a student find the most relevant internships based on their profile.
  
  Analyze the provided student profile and the list of available internships.
  
  Your task is to identify the top 5 internships that are the best match for the student. Consider their skills, education, projects, professional summary, and any implied interests. Match them against the internship's requirements and description.
  
  For each of your top 5 recommendations, provide a concise, one-sentence justification explaining *why* it is a strong match for this specific student.
  
  Student Profile:
  {{{studentProfile}}}
  
  Available Internships (JSON format):
  {{{json internships}}}
  `,
});

const rankInternshipsFlow = ai.defineFlow(
  {
    name: 'rankInternshipsFlow',
    inputSchema: RankInternshipsInputSchema,
    outputSchema: RankInternshipsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (e) {
      console.error("Error in rankInternshipsFlow:", e);
      // Re-throw the error to be caught by the calling component in the UI
      throw new Error("The AI service is currently unavailable. Please try again later.");
    }
  }
);
