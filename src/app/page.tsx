import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Bot, FileText, Briefcase } from 'lucide-react';
import { InternshipCard } from '@/components/internship-card';
import { mockInternships } from '@/lib/mock-data';

export default function Home() {
  const featuredInternships = mockInternships.slice(0, 3);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-primary/10 py-20 md:py-32">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tight">
            Your Internship Journey Starts Here
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
            InternWise is an AI-powered platform to help you find the perfect internship, craft compelling cover letters, and ace your interviews.
          </p>
          <Link href="/internships" passHref>
            <Button size="lg" className="mt-8">
              Explore Internships
              <Briefcase className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">Why Choose InternWise?</h2>
          <p className="text-center max-w-2xl mx-auto mt-4 text-foreground/70">
            We provide you with the tools and opportunities to kickstart your career.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">AI Cover Letter Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Generate personalized cover letters tailored to each internship opportunity in seconds. Make a lasting impression on recruiters.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">AI Interview Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Practice common interview questions and receive instant feedback. Build your confidence and be prepared for any interview scenario.</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Curated Internships</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access a wide range of internship listings from top companies. Search and filter to find the perfect match for your skills and interests.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Featured Internships */}
      <section className="w-full py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">Featured Internships</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/internships" passHref>
              <Button variant="outline">View All Internships</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
