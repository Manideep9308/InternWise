'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { analyzeResume } from '@/ai/flows/analyze-resume';
import { Loader2, UploadCloud } from 'lucide-react';

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a resume file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const resumeDataUri = await fileToDataUri(file);
      const result = await analyzeResume({ resumeDataUri });
      
      // Store result in localStorage to pass to profile page
      localStorage.setItem('parsedProfile', JSON.stringify(result));

      toast({
        title: 'Analysis Complete!',
        description: 'Your profile has been pre-filled with your resume details.',
      });

      router.push('/profile');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze the resume. Please try again or upload a different file.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center flex-grow">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-headline">Get Started</h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume and we'll auto-fill your profile for you.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>
                Upload your resume (PDF, DOC, DOCX) to get started. Our AI will do the heavy lifting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume File</Label>
                <div className="relative">
                  <Input
                    id="resume"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    disabled={isAnalyzing}
                    className="pl-12"
                  />
                   <UploadCloud className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isAnalyzing || !file} className="w-full">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze and Create Profile'
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
