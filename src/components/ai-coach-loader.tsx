
'use client';

import { useState, useEffect } from 'react';
import { InterviewCoachChat } from '@/components/interview-coach-chat';
import { mockInternships, mockStudentProfile } from '@/lib/mock-data';
import type { StudentProfile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AiCoachLoader() {
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
    // Show a loading state while we check for the profile
    return (
        <Card className="h-[70vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                <Skeleton className="h-10 w-full md:w-[350px]" />
                <Skeleton className="h-10 w-36" />
            </CardHeader>
            <CardContent className="flex-grow p-6">
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Skeleton className="h-12 w-12 rounded-full mb-4"/>
                    <Skeleton className="h-4 w-64" />
                </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
                <div className="flex w-full items-center space-x-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </CardFooter>
      </Card>
    );
  }

  return (
    <InterviewCoachChat 
      studentProfile={profile}
      internships={mockInternships}
    />
  );
}
