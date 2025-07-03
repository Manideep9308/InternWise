'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function PostInternshipPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submitting to a backend
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Internship Posted!',
        description: 'Your internship is now live for students to apply.',
      });
      // Here you would typically clear the form
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
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
                  <Input id="companyName" name="companyName" placeholder="e.g., Innovate Inc."/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Internship Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Frontend Developer Intern" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="e.g., Remote or New York, NY"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain / Field</Label>
                  <Input id="domain" name="domain" placeholder="e.g., Web Development" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stipend">Stipend</Label>
                  <Input id="stipend" name="stipend" placeholder="e.g., $2000/month"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" placeholder="e.g., 3 Months" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea id="description" name="description" rows={5} placeholder="Provide a detailed description of the role..."/>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <Input id="skills" name="skills" placeholder="e.g., React, Python, Figma" />
                <p className="text-xs text-muted-foreground">Separate skills with a comma.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <Input id="companyLogo" type="file" />
                <p className="text-xs text-muted-foreground">This is a UI-only feature.</p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? 'Posting...' : 'Post Internship'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
