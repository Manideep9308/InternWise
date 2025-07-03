'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Internship, StudentProfile } from '@/lib/types';
import { getInternships } from '@/lib/internship-data-manager';
import { rankInternships } from '@/ai/flows/rank-internships';
import { InternshipCard } from './internship-card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { User } from 'lucide-react';

type RankedInternship = Internship & { justification: string };

export function PersonalizedFeed() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [allInternships, setAllInternships] = useState<Internship[]>([]);
  const [recommendations, setRecommendations] = useState<RankedInternship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedProfileData = localStorage.getItem('studentProfile');
    const internshipsData = getInternships();
    setAllInternships(internshipsData);

    if (storedProfileData) {
      const parsedProfile = JSON.parse(storedProfileData);
      setProfile(parsedProfile);
    } else {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile && allInternships.length > 0) {
      const runRanking = async () => {
        setIsLoading(true);
        try {
          const studentProfileString = `Name: ${profile.name}, Education: ${profile.education}, Skills: ${profile.skills}, About: ${profile.about}`;
          
          const result = await rankInternships({
            studentProfile: studentProfileString,
            internships: allInternships,
          });

          const rankedWithDetails = result.recommendations
            .map(rec => {
              const fullInternship = allInternships.find(i => i.id === rec.id);
              if (!fullInternship) return null;
              return { ...fullInternship, justification: rec.justification };
            })
            .filter(Boolean) as RankedInternship[];
          
          setRecommendations(rankedWithDetails);

        } catch (error) {
          console.error('Error ranking internships:', error);
          toast({
            title: 'Could not fetch recommendations',
            description: 'There was an error getting your personalized feed. Please try again later.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      runRanking();
    }
  }, [profile, allInternships, toast]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
        <Alert>
            <User className="h-4 w-4" />
            <AlertTitle>Create Your Profile to Get Recommendations</AlertTitle>
            <AlertDescription>
                You need to create a profile first so our AI can find the best internships for you.
                <Button onClick={() => router.push('/upload-resume')} className="mt-4">
                    Create Profile
                </Button>
            </AlertDescription>
        </Alert>
    )
  }

  if (recommendations.length === 0) {
      return (
        <div className="text-center py-10 bg-secondary rounded-lg">
            <p className="text-lg font-semibold">No recommendations found right now</p>
            <p className="text-muted-foreground mt-2">Check back later or browse all internships.</p>
             <Button onClick={() => router.push('/internships')} variant="outline" className="mt-4">
                Browse All Internships
            </Button>
        </div>
      )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recommendations.map((internship) => (
        <InternshipCard
          key={internship.id}
          internship={internship}
          justification={internship.justification}
        />
      ))}
    </div>
  );
}
