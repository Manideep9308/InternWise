import { CareerPathSimulatorLoader } from '@/components/career-path-simulator-loader';
import { TrendingUp } from 'lucide-react';

export default function CareerPathSimulatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">AI Career Path Simulator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Define your dream job and let our AI build a personalized, step-by-step roadmap to help you get there.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <CareerPathSimulatorLoader />
      </div>
    </div>
  );
}
