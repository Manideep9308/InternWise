import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Briefcase, DollarSign, ArrowRight, Lightbulb } from 'lucide-react';
import type { Internship } from '@/lib/types';
import { Badge } from './ui/badge';

interface InternshipCardProps {
  internship: Internship;
  justification?: string;
}

export function InternshipCard({ internship, justification }: InternshipCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex-row gap-4 items-start">
        <Image
          src={internship.logo}
          alt={`${internship.company} logo`}
          width={50}
          height={50}
          className="rounded-lg border"
          data-ai-hint="company logo"
        />
        <div>
          <CardTitle className="text-lg font-headline">{internship.title}</CardTitle>
          <CardDescription>{internship.company}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{internship.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{internship.domain}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span>{internship.stipend}</span>
        </div>
         <div className="pt-2">
            <Badge variant="secondary">{internship.duration}</Badge>
        </div>
      </CardContent>
      {justification && (
        <div className="px-6 pb-4">
          <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
              <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80">
                      <span className="font-semibold text-primary/90">AI Recommendation:</span> {justification}
                  </p>
              </div>
          </div>
        </div>
      )}
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">{internship.postedDate}</p>
        <Link href={`/internships/${internship.id}`} passHref>
          <Button variant="ghost" size="sm">
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
