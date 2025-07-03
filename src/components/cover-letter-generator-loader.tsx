
'use client';

import { useState, useEffect } from 'react';
import { CoverLetterGenerator } from '@/components/cover-letter-generator';
import { mockStudentProfile } from '@/lib/mock-data';
import type { StudentProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface CoverLetterGeneratorLoaderProps {
    jobDescription: string;
}

export function CoverLetterGeneratorLoader({ jobDescription }: CoverLetterGeneratorLoaderProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const storedProfileData = localStorage.getItem('studentProfile');
    if (storedProfileData) {
      setProfile(JSON.parse(storedProfileData));
    } else {
      // Fallback to mock data if no profile is found, 
      // so the feature is still usable for users who haven't created a profile.
      setProfile(mockStudentProfile);
    }
  }, []);

  if (!profile) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  return (
    <CoverLetterGenerator 
      jobDescription={jobDescription} 
      studentProfile={profile}
    />
  );
}
