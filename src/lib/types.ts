import { z } from 'zod';

export type Internship = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  domain: string;
  stipend: string;
  duration: string;
  postedDate: string;
  applicants: number;
  description: string;
  responsibilities: string[];
  skills: string[];
  perks: string[];
  customQuestions?: string;
  isInterviewRequired?: boolean;
};

export const StudentProfileSchema = z.object({
  name: z.string().describe("The full name of the student."),
  email: z.string().describe("The student's email address."),
  education: z.string().describe("The student's educational background."),
  skills: z.string().describe("A comma-separated list of the student's skills."),
  about: z.string().describe("A professional summary or 'about me' section for the student."),
  projects: z.string().optional().describe("A description of the student's projects."),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;

export const MessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

export type InterviewResult = {
    studentEmail: string;
    internshipId: string;
    conversationHistory: Message[];
    summary: string;
};

export type StudentApplication = {
  internship: Internship;
  status: 'Applied' | 'Interview Complete';
};

// --- Schemas for AI Flows ---

export const AnalyzeApplicantPoolInputSchema = z.object({
  studentProfiles: z
    .array(StudentProfileSchema)
    .describe('A list of all student profiles to be analyzed.'),
});
export type AnalyzeApplicantPoolInput = z.infer<
  typeof AnalyzeApplicantPoolInputSchema
>;

const ChartDataPointSchema = z.object({
  name: z.string().describe('The name of the data point (e.g., a skill name or university name).'),
  count: z.number().describe('The number of times this data point appeared in the applicant pool.'),
});

export const AnalyzeApplicantPoolOutputSchema = z.object({
  topSkills: z
    .array(ChartDataPointSchema)
    .describe('A list of the top 5 most common skills among applicants.'),
  universityDistribution: z
    .array(ChartDataPointSchema)
    .describe('A list of the top 5 universities applicants are from.'),
});
export type AnalyzeApplicantPoolOutput = z.infer<
  typeof AnalyzeApplicantPoolOutputSchema
>;

export const OptimizeResumeInputSchema = z.object({
  studentProfile: z.string().describe("The student's full profile content, including about section, skills, and projects."),
  jobDescription: z.string().describe("The full text of the target job description."),
});
export type OptimizeResumeInput = z.infer<typeof OptimizeResumeInputSchema>;

const SuggestionSchema = z.object({
  originalText: z.string().describe("The original text from the student's profile that could be improved."),
  suggestedText: z.string().describe("The improved, rewritten version of the text."),
  reasoning: z.string().describe("A brief explanation of why the suggestion improves the resume for the target job (e.g., 'Adds quantification', 'Uses stronger action verb', 'Aligns with job description keyword')."),
});

export const OptimizeResumeOutputSchema = z.object({
  overallFeedback: z.string().describe("A brief, high-level summary of how the resume can be better tailored to the job description."),
  suggestedImprovements: z.array(SuggestionSchema).describe("A list of specific, actionable suggestions to improve the resume wording."),
  missingKeywords: z.array(z.string()).describe("A list of important keywords from the job description that are missing from the resume and should be added if the student has relevant experience."),
});
export type OptimizeResumeOutput = z.infer<typeof OptimizeResumeOutputSchema>;
