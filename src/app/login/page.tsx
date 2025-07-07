
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleStudentLogin = () => {
    // In a real app, you'd authenticate here.
    // For this prototype, we'll check if a populated profile exists to guide the user.
    const storedProfileData = localStorage.getItem('studentProfile');
    if (storedProfileData) {
      try {
        const profile = JSON.parse(storedProfileData);
        // Robustly check if the profile has actual data, not just an empty object.
        if (profile && profile.name && profile.email) {
          router.push('/dashboard');
          return;
        }
      } catch (e) {
        // If JSON is malformed, treat as no profile
        console.error("Failed to parse student profile", e);
      }
    }
    
    // If no profile exists, or it's empty/invalid, guide user to create one.
    router.push('/upload-resume');
  };

  const handleEmployerLogin = () => {
    // In a real app, you would authenticate here.
    // For this prototype, we'll set a mock employer and redirect.
    localStorage.setItem('employerCompany', 'Innovate Inc.'); // Mocking login for a sample company
    router.push('/employer/dashboard');
  };

  return (
    <div className="container relative flex-grow flex-col items-center justify-center py-12 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://placehold.co/1200x800.png')"}}
          data-ai-hint="students collaborating"
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform helped me land my dream internship. The AI tools are a game changer!&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Log in to continue your journey with InternWise.
            </p>
          </div>
          
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="employer">Employer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-4 pt-6">
                  <div className="grid gap-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input id="student-email" type="email" placeholder="student@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="student-password">Password</Label>
                      <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                      </Link>
                    </div>
                    <Input id="student-password" type="password" required />
                  </div>
                  <Button onClick={handleStudentLogin} className="w-full">
                    Login as Student
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employer">
              <Card className="border-0 shadow-none">
                  <CardContent className="space-y-4 pt-6">
                      <div className="grid gap-2">
                          <Label htmlFor="employer-email">Company Email</Label>
                          <Input id="employer-email" type="email" placeholder="hr@company.com" required />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="employer-password">Password</Label>
                            <Link href="#" className="ml-auto inline-block text-sm underline">
                            Forgot your password?
                            </Link>
                        </div>
                        <Input id="employer-password" type="password" required />
                      </div>
                      <Button onClick={handleEmployerLogin} className="w-full">
                          Login as Employer
                      </Button>
                  </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
