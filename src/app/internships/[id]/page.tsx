
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Calendar, Users, CheckCircle, FileText, Check, Eye, ArrowLeft } from 'lucide-react';
import { CoverLetterGeneratorLoader } from '@/components/cover-letter-generator-loader';
import { getInternshipById, applyForInternship, hasApplied, getApplicantsForInternship } from '@/lib/internship-data-manager';
import type { Internship, StudentProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function InternshipDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [internship, setInternship] = useState<Internship | null | undefined>(undefined);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [hasUserApplied, setHasUserApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isEmployerViewing, setIsEmployerViewing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (!id) return;
    const foundInternship = getInternshipById(id);
    setInternship(foundInternship);
    
    const storedProfileData = localStorage.getItem('studentProfile');
    if (storedProfileData) {
      try {
        const parsedProfile = JSON.parse(storedProfileData);
        setProfile(parsedProfile);
        if (foundInternship && parsedProfile.email) {
          setHasUserApplied(hasApplied(foundInternship.id, parsedProfile.email));
        }
      } catch (e) {
        console.error("Failed to parse student profile", e);
      }
    }
    
    if (localStorage.getItem('employerCompany')) {
        setIsEmployerViewing(true);
    }

  }, [id]);

  const handleApply = () => {
    if (!profile || !profile.email) {
      toast({
        title: "Please create a profile first",
        description: "You need to have a profile with a valid email to apply for internships.",
        variant: "destructive"
      });
      router.push('/upload-resume');
      return;
    }
    
    if (internship?.isInterviewRequired && !hasUserApplied) {
        toast({
            title: "Interview Required",
            description: "This internship requires a mock interview. You will be redirected to the AI Coach.",
        });
        router.push(`/ai-coach?internshipId=${id}&apply=true`);
        return;
    }

    setIsApplying(true);
    const success = applyForInternship(id, profile);
    
    if (success) {
      toast({
        title: "Application Sent!",
        description: `Your application for ${internship?.title} has been submitted.`,
      });
      setHasUserApplied(true);
    } else {
      toast({
        title: "Already Applied",
        description: "You have already applied for this internship.",
      });
    }
    setIsApplying(false);
  };

  if (internship === undefined || !isClient) {
      return (
        <div className="bg-secondary">
          <div className="container mx-auto py-12 px-4">
            <Card className="mb-8 overflow-hidden">
                <div className="bg-primary/10 p-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Skeleton className="h-[100px] w-[100px] rounded-xl" />
                        <div className="flex-grow space-y-4">
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>
                        <div className="w-full md:w-auto flex-shrink-0">
                            <Skeleton className="h-12 w-32" />
                        </div>
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-72 w-full" />
                </div>
            </div>
        </div>
      </div>
      );
  }

  if (internship === null) {
    notFound();
  }
  
  return (
    <div className="bg-secondary">
      <div className="container mx-auto py-12 px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
        {/* Header section */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-primary/10 p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Image
                src={internship.logo}
                alt={`${internship.company} logo`}
                width={100}
                height={100}
                className="rounded-xl border-4 border-background bg-background shadow-md"
                data-ai-hint="company logo"
              />
              <div className="flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{internship.title}</h1>
                <p className="text-xl text-foreground/80 mt-1">{internship.company}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-foreground/70">
                    <div className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />{internship.domain}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{internship.location}</div>
                    <div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" />{internship.stipend}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />{internship.duration}</div>
                    <div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />{getApplicantsForInternship(internship.id).length} applicants</div>
                </div>
              </div>
              <div className="w-full md:w-auto flex-shrink-0 space-y-2">
                  {isEmployerViewing ? (
                    <Link href={`/internships/${internship.id}/applicants`} passHref>
                        <Button variant="outline" className="w-full"><Eye className="mr-2"/> View Applicants</Button>
                    </Link>
                  ) : (
                    <Button size="lg" className="w-full" onClick={handleApply} disabled={hasUserApplied || isApplying}>
                        {hasUserApplied ? <><Check className="mr-2"/> Applied</> : (internship.isInterviewRequired ? 'Apply via Interview' : 'Apply Now')}
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground text-center">Posted {internship.postedDate}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>Job Description</CardTitle></CardHeader>
              <CardContent><p>{internship.description}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Responsibilities</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  {internship.responsibilities.map((resp, index) => <li key={index}>{resp}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Required Skills</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => <Badge key={index}>{skill}</Badge>)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Perks</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {internship.perks.map((perk, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="text-primary" />
                    AI Cover Letter Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CoverLetterGeneratorLoader
                    jobDescription={internship.description} 
                  />
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
