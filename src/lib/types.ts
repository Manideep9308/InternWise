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
  email: z.string().email().describe("The student's email address."),
  education: z.string().describe("The student's educational background."),
  skills: z.string().describe("A comma-separated list of the student's skills."),
  about: z.string().describe("A professional summary or 'about me' section for the student."),
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
