import { ResumeOptimizerLoader } from '@/components/resume-optimizer-loader';
import { PencilRuler } from 'lucide-react';

export default function ResumeOptimizerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
            <PencilRuler className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">AI Resume Optimizer</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Get actionable suggestions to tailor your resume for a specific job description and get past the first screen.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ResumeOptimizerLoader />
      </div>
    </div>
  );
}
