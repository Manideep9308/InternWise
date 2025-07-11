
'use client';

import type { Internship, StudentProfile, InterviewResult, Message, StudentApplication } from './types';
import { mockStudentProfile, mockInternships } from './mock-data';

const INTERNSHIPS_STORAGE_KEY = 'internships';
const APPLICATIONS_STORAGE_KEY = 'applications';
const INTERVIEW_RESULTS_STORAGE_KEY = 'interview_results';

// Helper to safely get data from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const storedData = localStorage.getItem(key);
        // If there's no data, we return the default value.
        return storedData ? JSON.parse(storedData) : defaultValue;
    } catch (error) {
        console.error(`Could not access localStorage or parse data for key "${key}".`, error);
        return defaultValue;
    }
};

// Helper to safely set data to localStorage
const setInStorage = <T>(key: string, value: T) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Could not set data in localStorage for key "${key}".`, error);
        }
    }
};

// --- Internship Management ---

export const getInternships = (): Internship[] => {
  const internships = getFromStorage<Internship[]>(INTERNSHIPS_STORAGE_KEY, []);
  if (internships.length === 0 && typeof window !== 'undefined') {
      // Pre-seed with mock data if local storage is empty
      setInStorage(INTERNSHIPS_STORAGE_KEY, mockInternships);
      return mockInternships;
  }
  
  const allApplications = getFromStorage<Record<string, StudentProfile[]>>(APPLICATIONS_STORAGE_KEY, {});

  // Dynamically update applicant counts to ensure data is always fresh
  return internships.map(internship => ({
      ...internship,
      applicants: (allApplications[internship.id] || []).length
  }));
};

export const getInternshipById = (id: string): Internship | undefined => {
  const internships = getInternships();
  return internships.find(i => i.id === id);
};

export const getInternshipsByCompany = (companyName: string): Internship[] => {
    const internships = getInternships();
    return internships.filter(i => i.company.toLowerCase() === companyName.toLowerCase());
};

export const addInternship = (internshipData: Omit<Internship, 'id' | 'logo' | 'postedDate' | 'applicants' | 'responsibilities' | 'perks'> & {responsibilities?: string[], perks?:string[], isInterviewRequired?: boolean}): Internship => {
    const internships = getInternships();
    const newInternship: Internship = {
        ...internshipData,
        id: new Date().getTime().toString(),
        logo: 'https://placehold.co/100x100.png',
        postedDate: 'Just Now',
        applicants: 0,
        responsibilities: internshipData.responsibilities || [
            'Develop new user-facing features.',
            'Collaborate with cross-functional teams to define, design, and ship new features.',
            'Ensure the performance, quality, and responsiveness of applications.'
        ],
        perks: internshipData.perks || ['Flexible work hours', 'Mentorship program'],
        customQuestions: internshipData.customQuestions || '',
        isInterviewRequired: internshipData.isInterviewRequired || false,
    };
    const updatedInternships = [newInternship, ...internships];
    setInStorage(INTERNSHIPS_STORAGE_KEY, updatedInternships);
    return newInternship;
};

// --- Application Management ---

export const getApplicantsForInternship = (internshipId: string): StudentProfile[] => {
    const allApplications = getFromStorage<Record<string, StudentProfile[]>>(APPLICATIONS_STORAGE_KEY, {});
    return allApplications[internshipId] || [];
};

export const hasApplied = (internshipId: string, studentEmail: string): boolean => {
    if (!studentEmail) return false;
    const applicants = getApplicantsForInternship(internshipId);
    return applicants.some(applicant => applicant.email === studentEmail);
};

export const applyForInternship = (internshipId: string, studentProfile: StudentProfile): boolean => {
    if (!studentProfile || !studentProfile.email) {
        console.error("Cannot apply without a valid student profile and email.");
        return false;
    }
    const allApplications = getFromStorage<Record<string, StudentProfile[]>>(APPLICATIONS_STORAGE_KEY, {});
    const applicants = allApplications[internshipId] || [];

    // Check if already applied
    if (applicants.some(applicant => applicant.email === studentProfile.email)) {
        return false; // Already applied
    }

    const updatedApplicants = [...applicants, studentProfile];
    const updatedApplications = { ...allApplications, [internshipId]: updatedApplicants };
    
    setInStorage(APPLICATIONS_STORAGE_KEY, updatedApplications);
    return true;
};

export const getApplicationsByStudent = (studentEmail: string): StudentApplication[] => {
    if (!studentEmail) return [];
    
    const allInternships = getInternships();
    const allApplications = getFromStorage<Record<string, StudentProfile[]>>(APPLICATIONS_STORAGE_KEY, {});
    const allInterviewResults = getFromStorage<InterviewResult[]>(INTERVIEW_RESULTS_STORAGE_KEY, []);

    const studentApplications: StudentApplication[] = [];

    for (const internshipId in allApplications) {
        const applicants = allApplications[internshipId];
        const hasStudentApplied = applicants.some(app => app.email === studentEmail);

        if (hasStudentApplied) {
            const internship = allInternships.find(i => i.id === internshipId);
            if (internship) {
                const hasCompletedInterview = allInterviewResults.some(
                    result => result.internshipId === internshipId && result.studentEmail === studentEmail
                );
                
                studentApplications.push({
                    internship,
                    status: hasCompletedInterview ? 'Interview Complete' : 'Applied',
                });
            }
        }
    }
    
    // Sort by most recent application (assuming internship ID is time-based)
    return studentApplications.sort((a, b) => parseInt(b.internship.id, 10) - parseInt(a.internship.id, 10));
};


// --- Interview Result Management ---

export const saveInterviewResult = (
    internshipId: string, 
    studentEmail: string, 
    conversationHistory: Message[], 
    summary: string
) => {
    const results = getFromStorage<InterviewResult[]>(INTERVIEW_RESULTS_STORAGE_KEY, []);
    const newResult: InterviewResult = { internshipId, studentEmail, conversationHistory, summary };
    
    // Remove any previous result for the same student and internship to avoid duplicates
    const updatedResults = results.filter(
        r => !(r.internshipId === internshipId && r.studentEmail === studentEmail)
    );
    updatedResults.push(newResult);
    
    setInStorage(INTERVIEW_RESULTS_STORAGE_KEY, updatedResults);
};

export const getInterviewResult = (internshipId: string, studentEmail: string): InterviewResult | undefined => {
    const results = getFromStorage<InterviewResult[]>(INTERVIEW_RESULTS_STORAGE_KEY, []);
    return results.find(r => r.internshipId === internshipId && r.studentEmail === studentEmail);
};

// --- Student Profile Management (for simulation) ---
export const getAllStudentProfiles = (): StudentProfile[] => {
    // This is a simulation. In a real app, this would fetch from a database.
    // For now, we'll generate a few mock profiles plus the currently logged-in user's profile.
    const loggedInUserProfile = getFromStorage<StudentProfile | null>('studentProfile', null);

    const mockProfiles: StudentProfile[] = [
        {
            name: 'Priya Sharma',
            email: 'priya.sharma@example.com',
            education: 'M.S. in Data Science, New York University (2024)',
            skills: 'Python, Pandas, Scikit-learn, SQL, Tableau, Machine Learning',
            about: 'Data science enthusiast with a passion for finding stories in data. Experience in building predictive models and creating data visualizations.',
            projects: 'Built a sentiment analysis tool for movie reviews; created a sales forecasting model for a retail dataset.',
        },
        {
            name: 'Ben Carter',
            email: 'ben.carter@example.com',
            education: 'B.A. in Design, Rhode Island School of Design (2025)',
            skills: 'Figma, Sketch, Adobe Creative Suite, Prototyping, User Research, UI/UX Design',
            about: 'A creative and user-centric designer focused on crafting intuitive and beautiful digital experiences. Loves solving complex problems with simple design.',
            projects: 'Redesigned a mobile banking app to improve user flow; created a complete design system for a startup website.',
        },
        {
            name: 'Carlos Gomez',
            email: 'carlos.gomez@example.com',
            education: 'B.Eng in Software Engineering, University of Waterloo (2024)',
            skills: 'Node.js, Express, AWS, Docker, Kubernetes, PostgreSQL, Microservices',
            about: 'Backend developer with a strong foundation in building scalable and reliable systems. Fascinated by distributed systems and cloud architecture.',
            projects: 'Developed a real-time chat application using WebSockets; built a microservices-based e-commerce backend.',
        },
         {
            name: 'Samantha Lee',
            email: 'samantha.lee@example.com',
            education: 'B.Sc. in Computer Science, Georgia Institute of Technology (2025)',
            skills: 'React, Next.js, GraphQL, TypeScript, Cypress, Storybook',
            about: 'Detail-oriented frontend developer who enjoys building pixel-perfect user interfaces and interactive web applications.',
            projects: 'Contributed to an open-source component library; built a data dashboard with complex visualizations using D3.js and React.',
        }
    ];

    if (loggedInUserProfile && loggedInUserProfile.email) {
        // Ensure the logged-in user is in the list and there are no duplicates
        const allProfiles = [loggedInUserProfile, ...mockProfiles.filter(p => p.email !== loggedInUserProfile.email)];
        return allProfiles;
    }

    return [...mockProfiles, mockStudentProfile]; // Fallback if no one is logged in
};
