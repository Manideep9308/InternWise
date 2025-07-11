'use client';

import { useState } from 'react';
import { generateCoverLetter, type GenerateCoverLetterInput } from '@/ai/flows/generate-cover-letter';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';

interface CoverLetterGeneratorProps {
  jobDescription: string;
  studentProfile: StudentProfile;
}

export function CoverLetterGenerator({ jobDescription, studentProfile }: CoverLetterGeneratorProps) {
  const [tone, setTone] = useState('formal');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const profileInformation = `
    Name: ${studentProfile.name}
    Education: ${studentProfile.education}
    Skills: ${studentProfile.skills}
    Projects: ${studentProfile.projects || 'N/A'}
    About: ${studentProfile.about}
  `;

  const handleSubmit = async () => {
    setIsLoading(true);
    setGeneratedLetter('');
    try {
      const input: GenerateCoverLetterInput = {
        jobDescription,
        profileInformation,
        tone,
      };
      const result = await generateCoverLetter(input);
      setGeneratedLetter(result.coverLetter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate cover letter. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
        title: 'Copied!',
        description: 'Cover letter copied to clipboard.',
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select a tone and let our AI create a professional cover letter for you.
      </p>
      
      <div>
        <label className="text-sm font-medium">Tone</label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger>
            <SelectValue placeholder="Select a tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Cover Letter
          </>
        )}
      </Button>

      {generatedLetter && (
        <Card className="mt-4 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              value={generatedLetter}
              className="h-64 bg-background"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleCopy} variant="outline" className="w-full">Copy Text</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
