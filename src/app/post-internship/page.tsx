
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addInternship } from '@/lib/internship-data-manager';
import { ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function PostInternshipPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedCompanyName = localStorage.getItem('employerCompany');
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    } else {
      toast({
        title: 'Unauthorized',
        description: 'You must be logged in as an employer to post a job.',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [router, toast]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.companyName || !data.title || !data.description || !data.skills) {
        toast({
            title: 'Missing fields',
            description: 'Please fill out all required fields.',
            variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
    }

    try {
        const newInternship = addInternship({
            company: data.companyName as string,
            title: data.title as string,
            location: data.location as string,
            domain: data.domain as string,
            stipend: data.stipend as string,
            duration: data.duration as string,
            description: data.description as string,
            skills: (data.skills as string).split(',').map(s => s.trim()),
            customQuestions: data.customQuestions as string,
            isInterviewRequired: data.requireInterview === 'on',
        });

        toast({
            title: 'Internship Posted!',
            description: 'Redirecting you to the new applicants page...',
        });
        
        // Redirect to the new internship's applicants page
        router.push(`/internships/${newInternship.id}/applicants?new=true`);

    } catch (error) {
        console.error("Failed to post internship", error);
        toast({
            title: 'Error',
            description: 'There was a problem posting your internship.',
            variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-headline">Post an Internship</h1>
            <p className="text-muted-foreground mt-2">Fill out the details below to find your next top talent.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Internship Details</CardTitle>
              <CardDescription>Provide clear and concise information about the role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={companyName}
                    readOnly 
                    className="bg-secondary/50"
                   />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Internship Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Frontend Developer Intern" required/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="e.g., Remote or New York, NY" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain / Field</Label>
                  <Input id="domain" name="domain" placeholder="e.g., Web Development" required/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stipend">Stipend</Label>
                  <Input id="stipend" name="stipend" placeholder="e.g., $2000/month" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" placeholder="e.g., 3 Months" required/>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea id="description" name="description" rows={5} placeholder="Provide a detailed description of the role..." required/>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                <Input id="skills" name="skills" placeholder="e.g., React, Python, Figma" required/>
                <p className="text-xs text-muted-foreground">Separate skills with a comma.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customQuestions">Custom Interview Questions (optional)</Label>
                <Textarea id="customQuestions" name="customQuestions" rows={3} placeholder="e.g., Describe a challenging project., Why do you want to work here?" />
                <p className="text-xs text-muted-foreground">Add comma-separated questions. If provided, the AI coach will ask these instead of generating its own.</p>
              </div>

              <div className="space-y-2 border-t pt-6">
                <Label>Application Settings</Label>
                 <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="requireInterview" name="requireInterview" />
                    <Label htmlFor="requireInterview" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Require AI Interview before student can apply?
                    </Label>
                </div>
                <p className="text-xs text-muted-foreground">If checked, students must complete a mock interview to submit their application.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <Input id="companyLogo" type="file" />
                <p className="text-xs text-muted-foreground">This is a UI-only feature.</p>
              </div>

              <Button type="submit" disabled={isSubmitting || !companyName} className="w-full md:w-auto">
                {isSubmitting ? 'Posting...' : 'Post Internship'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
