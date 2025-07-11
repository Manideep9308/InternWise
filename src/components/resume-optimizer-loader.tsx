'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeOptimizer } from '@/components/resume-optimizer';
import { mockStudentProfile } from '@/lib/mock-data';
import type { StudentProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { User } from 'lucide-react';
import { Button } from './ui/button';

export function ResumeOptimizerLoader() {
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }
  
  if (!profile) {
    return (
        <Alert>
            <User className="h-4 w-4" />
            <AlertTitle>Create a Profile to Use the Resume Optimizer</AlertTitle>
            <AlertDescription>
                You need a profile with your resume details before our AI can help you improve it.
                <Button onClick={() => router.push('/upload-resume')} className="mt-4">
                    Create Profile
                </Button>
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <ResumeOptimizer studentProfile={profile} />
  );
}
