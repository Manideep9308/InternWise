import Image from 'next/image';
import { notFound } from 'next/navigation';
import { mockInternships, mockStudentProfile } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Calendar, Users, CheckCircle, FileText } from 'lucide-react';
import { CoverLetterGenerator } from '@/components/cover-letter-generator';
import { Separator } from '@/components/ui/separator';

export default function InternshipDetailPage({ params }: { params: { id: string } }) {
  const internship = mockInternships.find(i => i.id === params.id);

  if (!internship) {
    notFound();
  }

  return (
    <div className="bg-secondary">
      <div className="container mx-auto py-12 px-4">
        {/* Header section */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-primary/10 p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Image
                src={internship.logo}
                alt={`${internship.company} logo`}
                width={100}
                height={100}
                className="rounded-xl border-4 border-background bg-background shadow-md"
                data-ai-hint="company logo"
              />
              <div className="flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{internship.title}</h1>
                <p className="text-xl text-foreground/80 mt-1">{internship.company}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-foreground/70">
                    <div className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />{internship.domain}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{internship.location}</div>
                    <div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" />{internship.stipend}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />{internship.duration}</div>
                    <div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />{internship.applicants} applicants</div>
                </div>
              </div>
              <div className="w-full md:w-auto flex-shrink-0">
                  <Button size="lg" className="w-full">Apply Now</Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">Posted {internship.postedDate}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>Job Description</CardTitle></CardHeader>
              <CardContent><p>{internship.description}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Responsibilities</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  {internship.responsibilities.map((resp, index) => <li key={index}>{resp}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Required Skills</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => <Badge key={index}>{skill}</Badge>)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Perks</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {internship.perks.map((perk, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="text-primary" />
                    AI Cover Letter Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CoverLetterGenerator 
                    jobDescription={internship.description} 
                    studentProfile={mockStudentProfile}
                  />
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
