'use client';

import { useState } from 'react';
import { hiringManagerSimulator, type HiringManagerSimulatorOutput } from '@/ai/flows/hiring-manager-simulator';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, UserCheck, Search, FileQuestion, Lightbulb } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';
import { Badge } from './ui/badge';

interface HiringManagerSimulatorProps {
  studentProfile: StudentProfile;
}

export function HiringManagerSimulator({ studentProfile }: HiringManagerSimulatorProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<HiringManagerSimulatorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const studentProfileString = `Name: ${studentProfile.name}\nEducation: ${studentProfile.education}\nSkills: ${studentProfile.skills}\nAbout: ${studentProfile.about}`;

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
        toast({
            title: 'Job Description is empty',
            description: 'Please paste a job description to start the simulation.',
            variant: 'destructive',
        });
        return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const simResult = await hiringManagerSimulator({
        jobDescription,
        studentProfile: studentProfileString,
      });
      setResult(simResult);
    } catch (error) {
      console.error('Error in hiring manager simulation:', error);
      toast({
        title: 'Error',
        description: 'Failed to run the simulation. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>This is the profile that will be shown to the "hiring manager".</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        readOnly
                        value={studentProfileString}
                        className="h-64 bg-secondary/50 font-mono text-sm"
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Target Internship</CardTitle>
                    <CardDescription>Paste the job description for the internship you're targeting.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="h-64"
                    />
                </CardContent>
            </Card>
        </div>
      
      <Button onClick={handleSubmit} disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Simulating...
          </>
        ) : (
          <>
            <UserCheck className="mr-2 h-4 w-4" />
            Run Hiring Manager Simulation
          </>
        )}
      </Button>

      {result && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Simulation Report</CardTitle>
                <CardDescription>Here's how a hiring manager might see your profile for this role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-primary"/>First Impression (30s Scan)</h3>
                    <p className="text-muted-foreground p-4 bg-secondary/50 rounded-lg">{result.firstImpression}</p>
                </div>
                
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Search className="text-primary"/>Keyword Analysis</h3>
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                        <div>
                            <h4 className="font-medium">Matched Keywords</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {result.keywordAnalysis.matchedKeywords.length > 0 ? (
                                    result.keywordAnalysis.matchedKeywords.map((skill, i) => <Badge key={i} variant="default">{skill}</Badge>)
                                ) : (
                                    <p className="text-sm text-muted-foreground">No direct keyword matches found.</p>
                                )}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-medium text-destructive">Missing Keywords</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {result.keywordAnalysis.missingKeywords.length > 0 ? (
                                    result.keywordAnalysis.missingKeywords.map((skill, i) => <Badge key={i} variant="destructive">{skill}</Badge>)
                                ) : (
                                    <p className="text-sm text-muted-foreground">Looks like you have all the key skills covered!</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium">Summary</h4>
                            <p className="text-muted-foreground text-sm mt-1">{result.keywordAnalysis.analysisSummary}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><FileQuestion className="text-primary"/>Predicted Interview Questions</h3>
                    <ul className="space-y-2 list-decimal pl-5 text-muted-foreground">
                        {result.predictedQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                </div>

            </CardContent>
        </Card>
      )}
    </div>
  );
}
