'use client';

import { useState } from 'react';
import { optimizeResume, type OptimizeResumeOutput } from '@/ai/flows/optimize-resume';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Wand2, Lightbulb, Search, ArrowRight } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';
import { Badge } from './ui/badge';

interface ResumeOptimizerProps {
  studentProfile: StudentProfile;
}

export function ResumeOptimizer({ studentProfile }: ResumeOptimizerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<OptimizeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const studentProfileString = `Name: ${studentProfile.name}\nEducation: ${studentProfile.education}\nSkills: ${studentProfile.skills}\nAbout: ${studentProfile.about}\nProjects: ${studentProfile.projects || 'N/A'}`;

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
        toast({
            title: 'Job Description is empty',
            description: 'Please paste a job description to start the optimization.',
            variant: 'destructive',
        });
        return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const simResult = await optimizeResume({
        jobDescription,
        studentProfile: studentProfileString,
      });
      setResult(simResult);
    } catch (error) {
      console.error('Error in resume optimization:', error);
      toast({
        title: 'Error',
        description: 'Failed to run the optimizer. Please try again.',
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
                    <CardTitle>Your Current Profile</CardTitle>
                    <CardDescription>This is the content the AI will analyze and improve.</CardDescription>
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
                    <CardTitle>Target Job Description</CardTitle>
                    <CardDescription>Paste the job description you want to tailor your resume for.</CardDescription>
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
            Optimizing...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Optimize My Resume
          </>
        )}
      </Button>

      {result && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Optimization Report</CardTitle>
                <CardDescription>Here are AI-powered suggestions to improve your resume for this role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg"><Lightbulb className="text-primary"/>Overall Feedback</h3>
                    <p className="text-muted-foreground p-4 bg-secondary/50 rounded-lg border">{result.overallFeedback}</p>
                </div>
                
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg"><Wand2 className="text-primary"/>Suggested Improvements</h3>
                    <div className="space-y-4">
                    {result.suggestedImprovements.map((item, index) => (
                        <Card key={index} className="bg-secondary/30">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground">Original:</p>
                                        <p className="text-sm p-2 bg-background/50 rounded-md border border-dashed border-red-500/50 line-through text-red-900 dark:text-red-300">"{item.originalText}"</p>
                                    </div>
                                     <div>
                                        <p className="text-sm font-semibold text-muted-foreground">Suggestion:</p>
                                        <p className="text-sm p-2 bg-green-500/10 rounded-md border border-dashed border-green-500/50 text-green-900 dark:text-green-300">"{item.suggestedText}"</p>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs p-2 bg-primary/10 rounded-md">
                                    <span className="font-bold text-primary">Reasoning:</span> {item.reasoning}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg"><Search className="text-primary"/>Missing Keywords to Consider</h3>
                     <div className="flex flex-wrap gap-2">
                        {result.missingKeywords.length > 0 ? (
                            result.missingKeywords.map((skill, i) => <Badge key={i} variant="destructive">{skill}</Badge>)
                        ) : (
                            <p className="text-sm text-muted-foreground">No critical keywords seem to be missing. Great job!</p>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">If you have experience with these, consider adding them to your profile or skills section.</p>
                </div>

            </CardContent>
        </Card>
      )}
    </div>
  );
}
