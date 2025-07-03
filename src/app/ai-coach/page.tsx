import { AiCoachLoader } from '@/components/ai-coach-loader';
import { Bot } from 'lucide-react';

export default function AiCoachPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
            <Bot className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">AI Interview Coach</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Practice for your upcoming interviews. Select an internship and start a conversation with your personal AI coach.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <AiCoachLoader />
      </div>
    </div>
  );
}
