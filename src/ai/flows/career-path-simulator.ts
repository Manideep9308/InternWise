'use server';

/**
 * @fileOverview An AI agent that generates a long-term career roadmap for a student.
 * 
 * - careerPathSimulator - Generates a career roadmap based on a student's profile and goal.
 * - CareerPathSimulatorInput - The input type for the careerPathSimulator function.
 * - CareerPathSimulatorOutput - The return type for the careerPathSimulator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerPathSimulatorInputSchema = z.object({
  studentProfile: z.string().describe("The student's current profile, including skills, education, and experience."),
  careerGoal: z.string().describe("The student's ultimate career goal, e.g., 'Senior AI Engineer at Google' or 'UX Design Lead at a startup'."),
});
export type CareerPathSimulatorInput = z.infer<typeof CareerPathSimulatorInputSchema>;

const RoadmapStepSchema = z.object({
  title: z.string().describe("The title for this step or phase, e.g., 'Year 1: Foundational Skills' or 'Phase 2: Project Building'."),
  description: z.string().describe("A summary of the focus for this step."),
  actionItems: z.array(z.string()).describe("A list of concrete, actionable steps for the student to take during this phase."),
});

const CareerPathSimulatorOutputSchema = z.object({
  roadmap: z.array(RoadmapStepSchema).describe("A step-by-step career roadmap, broken down into logical phases (e.g., by year or skill level)."),
});
export type CareerPathSimulatorOutput = z.infer<typeof CareerPathSimulatorOutputSchema>;

export async function careerPathSimulator(input: CareerPathSimulatorInput): Promise<CareerPathSimulatorOutput> {
  return careerPathSimulatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerPathSimulatorPrompt',
  input: {schema: CareerPathSimulatorInputSchema},
  output: {schema: CareerPathSimulatorOutputSchema},
  prompt: `You are an expert AI Career Advisor. Your task is to create a long-term, actionable career roadmap for a student based on their current profile and their ultimate career goal.

The roadmap should be broken down into logical, sequential steps (e.g., Year 1, Year 2, or Phase 1, Phase 2). Each step must include a clear title, a description of the strategic focus for that period, and a list of very specific, concrete action items.

Action items should be things like:
- "Focus on landing an internship in [specific area] to build foundational skills."
- "Build a personal project like a [specific project idea] using [specific technology]."
- "Master the following key skills: [list of skills]."
- "Target junior roles with titles like [example job titles]."

Here is the student's information:

**Student's Current Profile:**
{{{studentProfile}}}

**Student's Career Goal:**
{{{careerGoal}}}

Generate a realistic and encouraging roadmap to help them achieve their goal.
`,
});

const careerPathSimulatorFlow = ai.defineFlow(
  {
    name: 'careerPathSimulatorFlow',
    inputSchema: CareerPathSimulatorInputSchema,
    outputSchema: CareerPathSimulatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
