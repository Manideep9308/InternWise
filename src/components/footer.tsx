
import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-foreground/70">
              AI-powered platform to find internships, generate cover letters, and practice for interviews.
            </p>
            <div className="flex space-x-2 mt-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#"><Twitter /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#"><Github /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#"><Linkedin /></Link>
                </Button>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold font-headline">For Students</h4>
              <ul className="space-y-2 mt-4 text-sm">
                <li><Link href="/internships" className="text-foreground/70 hover:text-primary">Find Internships</Link></li>
                <li><Link href="/ai-coach" className="text-foreground/70 hover:text-primary">AI Interview Coach</Link></li>
                <li><Link href="/hiring-manager-simulator" className="text-foreground/70 hover:text-primary">Resume Review</Link></li>
                <li><Link href="/career-path-simulator" className="text-foreground/70 hover:text-primary">Career Path</Link></li>
                <li><Link href="/profile" className="text-foreground/70 hover:text-primary">My Profile</Link></li>
                <li><Link href="/my-applications" className="text-foreground/70 hover:text-primary">My Applications</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold font-headline">For Employers</h4>
              <ul className="space-y-2 mt-4 text-sm">
                <li><Link href="/post-internship" className="text-foreground/70 hover:text-primary">Post an Internship</Link></li>
                <li><Link href="/employer/dashboard" className="text-foreground/70 hover:text-primary">View Applicants</Link></li>
                <li><Link href="/login" className="text-foreground/70 hover:text-primary">Employer Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold font-headline">Company</h4>
              <ul className="space-y-2 mt-4 text-sm">
                <li><Link href="#" className="text-foreground/70 hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="text-foreground/70 hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="text-foreground/70 hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="text-foreground/70 hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} InternWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
