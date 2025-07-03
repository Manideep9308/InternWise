'use client';

import { mockInternships } from './mock-data';
import type { Internship } from './types';

const INTERNSHIPS_STORAGE_KEY = 'internships';

// This function runs only on the client
const getStoredInternships = (): Internship[] => {
  if (typeof window === 'undefined') {
    return mockInternships; // Return mock data during server-side rendering
  }
  try {
    const storedData = localStorage.getItem(INTERNSHIPS_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    // If no data, initialize with mock data
    localStorage.setItem(INTERNSHIPS_STORAGE_KEY, JSON.stringify(mockInternships));
    return mockInternships;
  } catch (error) {
    console.error("Could not access localStorage or parse internships data.", error);
    // Fallback to mock data if localStorage is unavailable or corrupt
    return mockInternships;
  }
};

export const getInternships = (): Internship[] => {
  return getStoredInternships();
};

export const getInternshipById = (id: string): Internship | undefined => {
  const internships = getStoredInternships();
  return internships.find(i => i.id === id);
};

export const addInternship = (internshipData: Omit<Internship, 'id' | 'logo' | 'postedDate' | 'applicants' | 'responsibilities' | 'perks'> & {responsibilities?: string[], perks?:string[]}): Internship => {
    const internships = getStoredInternships();
    const newInternship: Internship = {
        ...internshipData,
        id: new Date().getTime().toString(),
        logo: 'https://placehold.co/100x100.png',
        postedDate: 'Just Now',
        applicants: 0,
        responsibilities: internshipData.responsibilities || [],
        perks: internshipData.perks || [],
    };
    const updatedInternships = [newInternship, ...internships];
    if (typeof window !== 'undefined') {
      localStorage.setItem(INTERNSHIPS_STORAGE_KEY, JSON.stringify(updatedInternships));
    }
    return newInternship;
};
