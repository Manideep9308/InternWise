
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  const router = useRouter();

  const handleStudentSignup = () => {
    // Clear any potentially stale profile data before starting the creation flow.
    localStorage.removeItem('studentProfile');
    router.push('/upload-resume');
  };

  const handleEmployerSignup = () => {
    // In a real app, you would create the account here.
    // For this prototype, we'll set a mock employer and redirect to the dashboard.
    // We'll use a different name to distinguish from the login flow's company.
    localStorage.setItem('employerCompany', 'NextGen Apps'); 
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
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account.
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
                    <Label htmlFor="student-name">Full Name</Label>
                    <Input id="student-name" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input id="student-email" type="email" placeholder="student@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input id="student-password" type="password" required />
                  </div>
                  <Button onClick={handleStudentSignup} className="w-full">
                    Create Student Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employer">
              <Card className="border-0 shadow-none">
                  <CardContent className="space-y-4 pt-6">
                      <div className="grid gap-2">
                        <Label htmlFor="employer-name">Company Name</Label>
                        <Input id="employer-name" name="employer-name" type="text" placeholder="Innovate Inc." required />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="employer-email">Company Email</Label>
                          <Input id="employer-email" type="email" placeholder="hr@company.com" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="employer-password">Password</Label>
                        <Input id="employer-password" type="password" required />
                      </div>
                      <Button onClick={handleEmployerSignup} className="w-full">
                          Create Employer Account
                      </Button>
                  </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
