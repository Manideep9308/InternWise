
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InterviewCoachChat } from '@/components/interview-coach-chat';
import type { StudentProfile, Internship } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getInternships } from '@/lib/internship-data-manager';
import { Button } from './ui/button';
import { Bot, Briefcase } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { User } from 'lucide-react';

export function AiCoachLoader() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const preselectedInternshipId = searchParams.get('internshipId');
  const shouldApplyAfter = searchParams.get('apply') === 'true';

  useEffect(() => {
    const storedProfileData = localStorage.getItem('studentProfile');
    if (storedProfileData) {
      setProfile(JSON.parse(storedProfileData));
    }
    setInternships(getInternships());
    setIsLoading(false);
  }, []);

  if (isLoading) {
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

  if (!profile) {
    return (
        <Alert>
            <User className="h-4 w-4" />
            <AlertTitle>Create a Profile to Use the AI Coach</AlertTitle>
            <AlertDescription>
                You need to create a profile first to start practicing for interviews.
                <Button onClick={() => router.push('/upload-resume')} className="mt-4">
                    Create Profile
                </Button>
            </AlertDescription>
        </Alert>
    )
  }

  if (internships.length === 0) {
    return (
        <Card className="h-[70vh] flex flex-col items-center justify-center">
            <CardContent className="text-center">
                 <Bot className="h-12 w-12 mb-4 mx-auto text-muted-foreground"/>
                <h3 className="text-xl font-semibold">No Internships Available for Practice</h3>
                <p className="text-muted-foreground mt-2 mb-4 max-w-sm">
                    The AI Coach needs at least one internship to practice for. You can post one from the employer view to get started.
                </p>
                <Button onClick={() => router.push('/post-internship')}>
                    <Briefcase className="mr-2" />
                    Post an Internship
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <InterviewCoachChat 
      studentProfile={profile}
      internships={internships}
      preselectedInternshipId={preselectedInternshipId}
      shouldApplyAfter={shouldApplyAfter}
    />
  );
}
