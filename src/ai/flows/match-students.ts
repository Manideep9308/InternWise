'use server';

/**
 * @fileOverview An AI agent to proactively match students to a new internship.
 *
 * - matchStudentsToInternship - A function that finds the best student matches for a given internship.
 * - MatchStudentsInput - The input type for the matchStudentsToInternship function.
 * - MatchStudentsOutput - The return type for the matchStudentsToInternship function.
 */

import { ai } from '@/ai/genkit';
import { StudentProfileSchema } from '@/lib/types';
import { z } from 'genkit';

const MatchStudentsInputSchema = z.object({
  internship: z.object({
    title: z.string(),
    description: z.string(),
    requiredSkills: z.array(z.string()),
    location: z.string(),
  }),
  studentProfiles: z.array(StudentProfileSchema),
});
export type MatchStudentsInput = z.infer<typeof MatchStudentsInputSchema>;

const MatchedStudentSchema = z.object({
  name: z.string().describe("The student's full name."),
  email: z.string().describe("The student's email, to be used as a unique ID."),
  matchScore: z.number().describe('A match score from 0 to 100, representing how well the student fits the internship.'),
  skillsMatched: z.array(z.string()).describe('A list of skills the student possesses that match the internship requirements.'),
  justification: z.string().describe('A short, 1-sentence justification for why this student is a good match.'),
  suggestedInviteMessage: z.string().describe('A friendly, concise, and personalized message to send to the student inviting them to apply.'),
});

const MatchStudentsOutputSchema = z.object({
  matchedStudents: z.array(MatchedStudentSchema).describe('A ranked list of the top 10 student candidates for the internship.'),
});
export type MatchStudentsOutput = z.infer<typeof MatchStudentsOutputSchema>;


export async function matchStudentsToInternship(
  input: MatchStudentsInput
): Promise<MatchStudentsOutput> {
  return matchStudentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchStudentsPrompt',
  input: { schema: MatchStudentsInputSchema },
  output: { schema: MatchStudentsOutputSchema },
  prompt: `You are an expert AI recruiting assistant. Your task is to analyze a new internship posting and find the top 10 best-fit candidates from a pool of student profiles.

For each student, you must calculate a "Match Score" from 0 to 100 based on their suitability for the role. Consider the following criteria:
- **Skill Overlap:** How well do the student's skills match the required skills?
- **Education Match:** Does their educational background align with the role?
- **Location Preference:** Is there a match in location? (Treat "Remote" as a universal match).
- **Project & Profile Relevance:** How relevant are their projects and professional summary to the internship description?

For each of the top 10 students, you must provide:
- Their name and email.
- The calculated match score.
- A list of the key skills that matched.
- A concise, 1-sentence justification for the match.
- A personalized, friendly, and short message to invite them to apply. The message should mention their potential fit for the role.

Return a ranked list of the top 10 candidates, from highest score to lowest.

**Internship Details:**
- Title: {{{internship.title}}}
- Description: {{{internship.description}}}
- Required Skills: {{{json internship.requiredSkills}}}
- Location: {{{internship.location}}}

**Student Profiles (JSON format):**
{{{json studentProfiles}}}
`,
});

const matchStudentsFlow = ai.defineFlow(
  {
    name: 'matchStudentsFlow',
    inputSchema: MatchStudentsInputSchema,
    outputSchema: MatchStudentsOutputSchema,
  },
  async (input) => {
    // In a real scenario, you might have more complex logic to filter students before sending to the LLM.
    const { output } = await prompt(input);
    return output!;
  }
);
