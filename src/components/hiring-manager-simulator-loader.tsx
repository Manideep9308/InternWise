'use client';

import { useState, useEffect } from 'react';
import { HiringManagerSimulator } from '@/components/hiring-manager-simulator';
import { mockStudentProfile } from '@/lib/mock-data';
import type { StudentProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function HiringManagerSimulatorLoader() {
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  return (
    <HiringManagerSimulator studentProfile={profile} />
  );
}
