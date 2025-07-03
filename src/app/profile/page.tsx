'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { StudentProfile } from '@/lib/types';
import { mockStudentProfile } from '@/lib/mock-data';

const initialProfile: StudentProfile = {
  name: '',
  email: '',
  education: '',
  skills: '',
  about: '',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for parsed profile data from the upload page
    const parsedProfileData = localStorage.getItem('parsedProfile');
    if (parsedProfileData) {
      setProfile(JSON.parse(parsedProfileData));
      // Clean up local storage
      localStorage.removeItem('parsedProfile');
    } else {
      // Fallback to mock data if no parsed data is found
      // In a real app, this would fetch user data from a DB
      setProfile(mockStudentProfile);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate saving to a backend
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Profile Saved!',
        description: 'Your information has been updated successfully.',
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-headline">Your Profile</h1>
            <p className="text-muted-foreground mt-2">Keep your information up-to-date to impress employers.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This information will be used to auto-fill applications and find matching internships.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input id="education" name="education" value={profile.education} onChange={handleInputChange} placeholder="e.g., B.Tech in Computer Science, IIT Bombay (2025)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input id="skills" name="skills" value={profile.skills} onChange={handleInputChange} placeholder="e.g., React, Python, Machine Learning" />
                <p className="text-xs text-muted-foreground">Separate skills with a comma.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">About Me</Label>
                <Textarea id="about" name="about" value={profile.about} onChange={handleInputChange} rows={5} placeholder="Tell us a little about yourself..."/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <Input id="resume" type="file" />
                <p className="text-xs text-muted-foreground">Upload a new resume to update your profile (UI-only).</p>
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
