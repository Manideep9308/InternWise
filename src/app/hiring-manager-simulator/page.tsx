import { HiringManagerSimulatorLoader } from '@/components/hiring-manager-simulator-loader';
import { UserCheck } from 'lucide-react';

export default function HiringManagerSimulatorPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
            <UserCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">Hiring Manager Simulator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Get an AI-powered first impression of your resume for a specific job. See your profile through the eyes of a recruiter.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <HiringManagerSimulatorLoader />
      </div>
    </div>
  );
}
