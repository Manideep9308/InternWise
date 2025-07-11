'use client';

import { useState, useEffect, useMemo } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInternshipById, getApplicantsForInternship, getInterviewResult } from '@/lib/internship-data-manager';
import { rankApplicants } from '@/ai/flows/rank-applicants';
import type { Internship, StudentProfile, InterviewResult, Message } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Award, Bot, FileText, Loader2, Mail, School, Sparkles, User, Users, ArrowLeft, MessageSquareQuote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type RankedApplicantProfile = StudentProfile & {
    score?: number;
    justification?: string;
    interviewResult?: InterviewResult;
};

export default function ApplicantsPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [internship, setInternship] = useState<Internship | null | undefined>(null);
    const [applicants, setApplicants] = useState<RankedApplicantProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRanking, setIsRanking] = useState(false);
    const [selectedReport, setSelectedReport] = useState<InterviewResult | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!id) return;
        const foundInternship = getInternshipById(id);
        setInternship(foundInternship);
        if (foundInternship) {
            const initialApplicants = getApplicantsForInternship(id);
             const applicantsWithResults = initialApplicants.map(applicant => {
                const interviewResult = getInterviewResult(id, applicant.email);
                return { ...applicant, interviewResult };
            });
            setApplicants(applicantsWithResults);
        }
        setIsLoading(false);
    }, [id]);

    const handleRankApplicants = async () => {
        if (!internship || applicants.length === 0) return;
        
        setIsRanking(true);
        try {
            const result = await rankApplicants({
                jobDescription: internship.description,
                studentProfiles: applicants,
            });

            const rankedDataMap = new Map(
                result.rankedApplicants.map(ranked => [
                    ranked.email,
                    { score: ranked.score, justification: ranked.justification },
                ])
            );

            const updatedApplicants = applicants
                .map(applicant => {
                    const rankedData = rankedDataMap.get(applicant.email);
                    return { ...applicant, ...rankedData };
                })
                .sort((a, b) => (b.score || 0) - (a.score || 0));

            setApplicants(updatedApplicants);
            toast({ title: "Ranking Complete!", description: "Applicants have been sorted by their match score." });

        } catch (error) {
            console.error("Error ranking applicants:", error);
            toast({
                title: "Ranking Failed",
                description: "Could not rank applicants at this time. Please try again later.",
                variant: "destructive",
            });
        }
        setIsRanking(false);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-12 px-4">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-10" />
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
            </div>
        )
    }

    if (!internship) {
        notFound();
    }
    
    const hasBeenRanked = applicants.length > 0 && applicants[0].score !== undefined;

    return (
        <div className="bg-secondary min-h-screen">
            <div className="container mx-auto py-12 px-4">
                 <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <div className="mb-10">
                    <h1 className="text-4xl font-bold font-headline">Applicants</h1>
                    <p className="text-xl text-primary font-semibold">{internship.title} at {internship.company}</p>
                    <p className="text-muted-foreground mt-1">
                        Review and rank candidates for your internship posting.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="flex items-center text-lg font-medium">
                        <Users className="mr-2 h-5 w-5"/>
                        {applicants.length} Applicant(s)
                    </div>
                    <Button onClick={handleRankApplicants} disabled={isRanking || applicants.length === 0} size="lg">
                        {isRanking ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> {hasBeenRanked ? 'Re-Rank with AI' : 'Rank with AI'}</>
                        )}
                    </Button>
                </div>

                {applicants.length > 0 ? (
                    <div className="space-y-4">
                        {applicants.map((applicant) => (
                            <ApplicantCard key={applicant.email} applicant={applicant} onShowReport={setSelectedReport} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-10 text-center text-muted-foreground">
                            <p className="text-lg font-medium">No applicants yet.</p>
                            <p>Check back later to see who has applied.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
             <AlertDialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                <AlertDialogContent className="max-w-3xl h-[90vh] flex flex-col">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Interview Report for {selectedReport?.studentEmail}</AlertDialogTitle>
                        <AlertDialogDescription>
                            This is the transcript and AI-generated feedback from the mock interview.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex-grow overflow-y-auto pr-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-4">
                               <h3 className="font-semibold">AI Summary & Feedback</h3>
                               <Card>
                                 <CardContent className="p-4">
                                   <ScrollArea className="h-full max-h-[60vh]">
                                      <div className="text-sm text-foreground whitespace-pre-wrap pr-4" dangerouslySetInnerHTML={{ __html: selectedReport?.summary.replace(/\\n/g, '<br />').replace(/\* \*\*(.*?)\*\*:/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/  \*/g, '<br />&bull;') || '' }} />
                                   </ScrollArea>
                                  </CardContent>
                               </Card>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold">Interview Transcript</h3>
                                <Card>
                                  <CardContent className="p-4">
                                    <ScrollArea className="h-full max-h-[60vh]">
                                      <div className="space-y-4 pr-4">
                                          {selectedReport?.conversationHistory.map((message, index) => (
                                              <div key={index} className={cn('flex items-start gap-2 text-sm', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                              {message.role === 'assistant' && (
                                                  <Avatar className="w-6 h-6">
                                                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={16}/></AvatarFallback>
                                                  </Avatar>
                                              )}
                                              <div className={cn(
                                                  'max-w-xs rounded-lg px-3 py-2',
                                                  message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                                              )}>
                                                  <p className="whitespace-pre-wrap">{message.content}</p>
                                              </div>
                                              {message.role === 'user' && (
                                                  <Avatar className="w-6 h-6">
                                                      <AvatarFallback><User size={16}/></AvatarFallback>
                                                  </Avatar>
                                              )}
                                              </div>
                                          ))}
                                      </div>
                                    </ScrollArea>
                                  </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <AlertDialogFooter className="border-t pt-6">
                        <AlertDialogAction onClick={() => setSelectedReport(null)}>
                            Close
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function ApplicantCard({ applicant, onShowReport }: { applicant: RankedApplicantProfile; onShowReport: (result: InterviewResult) => void; }) {
    const skills = useMemo(() => applicant.skills.split(',').map(s => s.trim()).filter(Boolean), [applicant.skills]);
    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-grow">
                    <div className="flex items-center gap-4">
                        <div className="bg-muted p-3 rounded-full">
                            <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{applicant.name}</CardTitle>
                            <a href={`mailto:${applicant.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                                <Mail className="h-3 w-3"/> {applicant.email}
                            </a>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                           <School className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" /> <span>{applicant.education}</span>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                           <FileText className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" /> <span>{applicant.about}</span>
                        </p>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}
                        </div>
                    </div>
                    {applicant.interviewResult && (
                         <div className="mt-4">
                            <Button variant="outline" size="sm" onClick={() => onShowReport(applicant.interviewResult!)}>
                                <MessageSquareQuote className="mr-2 h-4 w-4" />
                                View Interview Report
                            </Button>
                        </div>
                    )}
                </div>
                {applicant.score !== undefined && (
                    <div className="bg-primary/5 p-6 md:w-1/3 md:border-l">
                         <h3 className="font-semibold text-primary mb-2 flex items-center gap-2"><Award className="h-5 w-5"/>AI Analysis</h3>
                         <div className="space-y-3">
                             <div>
                                 <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm font-medium text-muted-foreground">Match Score</span>
                                    <span className="text-xl font-bold text-primary">{applicant.score}</span>
                                 </div>
                                 <Progress value={applicant.score} className="h-2"/>
                             </div>
                             <p className="text-sm text-muted-foreground italic flex items-start gap-2">
                                <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0"/>
                                <span>{applicant.justification}</span>
                             </p>
                         </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
