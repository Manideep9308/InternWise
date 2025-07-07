
'use client';

import { mockInternships, mockStudentProfile } from './mock-data';
import type { Internship, StudentProfile } from './types';

const INTERNSHIPS_STORAGE_KEY = 'internships';
const APPLICATIONS_STORAGE_KEY = 'applications';

// Helper to safely get data from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const storedData = localStorage.getItem(key);
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

// Initialize internships with mock data if not present
const initializeInternships = () => {
    const storedInternships = getFromStorage<Internship[] | null>(INTERNSHIPS_STORAGE_KEY, null);
    if (!storedInternships) {
        setInStorage(INTERNSHIPS_STORAGE_KEY, mockInternships);
        return mockInternships;
    }
    return storedInternships;
};

// Initialize applications with some mock data for demonstration
const initializeApplications = () => {
    const storedApplications = getFromStorage<Record<string, StudentProfile[]> | null>(APPLICATIONS_STORAGE_KEY, null);
    if (!storedApplications) {
        const mockApplications: Record<string, StudentProfile[]> = {
            '1': [mockStudentProfile], // Alex Doe has applied to the first internship
        };
        // Add a few more mock applicants for a better demo
        const anotherStudent = {...mockStudentProfile, name: 'Jane Smith', email: 'jane.smith@example.com', skills: 'Python, SQL, Tableau, Data Analysis'};
        const thirdStudent = {...mockStudentProfile, name: 'Peter Jones', email: 'peter.jones@example.com', skills: 'JavaScript, HTML, CSS, Figma'};
        mockApplications['1'].push(anotherStudent);
        mockApplications['3'] = [thirdStudent];

        setInStorage(APPLICATIONS_STORAGE_KEY, mockApplications);
        return mockApplications;
    }
    return storedApplications;
}


export const getInternships = (): Internship[] => {
  initializeInternships();
  const allApplications = initializeApplications();
  const internships = getFromStorage<Internship[]>(INTERNSHIPS_STORAGE_KEY, []);

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

export const addInternship = (internshipData: Omit<Internship, 'id' | 'logo' | 'postedDate' | 'applicants' | 'responsibilities' | 'perks'> & {responsibilities?: string[], perks?:string[]}): Internship => {
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
    };
    const updatedInternships = [newInternship, ...internships];
    setInStorage(INTERNSHIPS_STORAGE_KEY, updatedInternships);
    return newInternship;
};

// --- Application Management Functions ---

export const getApplicantsForInternship = (internshipId: string): StudentProfile[] => {
    const allApplications = initializeApplications();
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
