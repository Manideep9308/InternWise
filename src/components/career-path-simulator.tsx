
'use client';

import { useState } from 'react';
import { careerPathSimulator, type CareerPathSimulatorOutput } from '@/ai/flows/career-path-simulator';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, TrendingUp, Check, Lightbulb } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';
import { Label } from './ui/label';

interface CareerPathSimulatorProps {
  studentProfile: StudentProfile;
}

export function CareerPathSimulator({ studentProfile }: CareerPathSimulatorProps) {
  const [careerGoal, setCareerGoal] = useState('');
  const [result, setResult] = useState<CareerPathSimulatorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const studentProfileString = `Name: ${studentProfile.name}\nEducation: ${studentProfile.education}\nSkills: ${studentProfile.skills}\nAbout: ${studentProfile.about}`;

  const handleSubmit = async () => {
    if (!careerGoal.trim()) {
        toast({
            title: 'Career Goal is empty',
            description: 'Please enter your career goal to start the simulation.',
            variant: 'destructive',
        });
        return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const simResult = await careerPathSimulator({
        careerGoal,
        studentProfile: studentProfileString,
      });
      setResult(simResult);
    } catch (error) {
      console.error('Error in career path simulation:', error);
      toast({
        title: 'Error',
        description: 'Failed to run the simulation. Please check your API key and try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Define Your Goal</CardTitle>
                <CardDescription>What is your dream job? Be as specific as you like.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full space-y-2">
                    <Label htmlFor="careerGoal">Career Goal</Label>
                    <Input 
                        id="careerGoal"
                        placeholder="e.g., Senior AI Engineer at Google"
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto flex-shrink-0">
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                    ) : (
                    <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Build My Roadmap
                    </>
                    )}
                </Button>
            </CardContent>
        </Card>

      {result && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Your Personalized Career Roadmap</CardTitle>
                <CardDescription>Follow these steps to work towards your goal of becoming a {careerGoal}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {result.roadmap.map((step, index) => (
                    <div key={index} className="relative pl-8">
                        <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <span className="font-bold">{index + 1}</span>
                        </div>
                        <div className="absolute left-4 top-8 h-full border-l-2 border-primary border-dashed"></div>
                        
                        <div className="ml-4">
                            <h3 className="font-headline text-xl font-semibold">{step.title}</h3>
                            <p className="mt-1 text-muted-foreground">{step.description}</p>
                            
                            <div className="mt-4 space-y-3">
                                {step.actionItems.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-md">
                                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="relative pl-8">
                     <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-primary-foreground">
                        <Lightbulb />
                    </div>
                     <div className="ml-4">
                        <h3 className="font-headline text-xl font-semibold">You've got a plan!</h3>
                        <p className="mt-1 text-muted-foreground">Use the tools on this platform, like the personalized feed and AI coach, to help you complete each step.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
