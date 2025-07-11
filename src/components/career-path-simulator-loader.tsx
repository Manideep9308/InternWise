'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CareerPathSimulator } from '@/components/career-path-simulator';
import { mockStudentProfile } from '@/lib/mock-data';
import type { StudentProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { User } from 'lucide-react';
import { Button } from './ui/button';

export function CareerPathSimulatorLoader() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedProfileData = localStorage.getItem('studentProfile');
    if (storedProfileData) {
      setProfile(JSON.parse(storedProfileData));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }
  
  if (!profile) {
    return (
        <Alert>
            <User className="h-4 w-4" />
            <AlertTitle>Create a Profile to Build Your Career Path</AlertTitle>
            <AlertDescription>
                You need to create a profile first so our AI can generate a personalized roadmap for you.
                <Button onClick={() => router.push('/upload-resume')} className="mt-4">
                    Create Profile
                </Button>
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <CareerPathSimulator studentProfile={profile} />
  );
}
