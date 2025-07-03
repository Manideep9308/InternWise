import { PersonalizedFeed } from '@/components/personalized-feed';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">
          Your Personalized Opportunity Feed
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Our AI has analyzed your profile to find the internships that best
          match your skills and interests.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <PersonalizedFeed />
      </div>
    </div>
  );
}
