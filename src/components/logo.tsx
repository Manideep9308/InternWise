import { Briefcase } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Briefcase className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tight">InternWise</span>
    </div>
  );
}
