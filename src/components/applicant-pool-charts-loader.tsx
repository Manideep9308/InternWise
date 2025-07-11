'use client';

import { useState, useEffect } from 'react';
import { ApplicantPoolCharts } from '@/components/applicant-pool-charts';
import type { StudentProfile } from '@/lib/types';
import { analyzeApplicantPool, type AnalyzeApplicantPoolOutput } from '@/ai/flows/analyze-applicant-pool';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ApplicantPoolChartsLoaderProps {
    applicants: StudentProfile[];
}

export function ApplicantPoolChartsLoader({ applicants }: ApplicantPoolChartsLoaderProps) {
    const [analyticsData, setAnalyticsData] = useState<AnalyzeApplicantPoolOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (applicants.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setHasError(false);
            try {
                const result = await analyzeApplicantPool({ studentProfiles: applicants });
                if (result.topSkills.length === 0 && result.universityDistribution.length === 0 && applicants.length > 0) {
                    setHasError(true);
                     toast({
                        title: "Analytics Failed",
                        description: "Could not load AI-powered applicant analytics at this time. The service may be temporarily unavailable.",
                        variant: "destructive"
                    });
                }
                setAnalyticsData(result);
            } catch (error) {
                console.error("Failed to fetch applicant analytics:", error);
                 setHasError(true);
                toast({
                    title: "Analytics Failed",
                    description: "Could not load AI-powered applicant analytics at this time.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [applicants, toast]);
    
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }
    
    if (applicants.length === 0) {
        return (
            <div className="text-center py-10 px-6 border-2 border-dashed rounded-lg">
                <p className="text-md font-medium text-muted-foreground">No applicant data available.</p>
                <p className="text-sm text-muted-foreground">Analytics will appear here once you receive applications.</p>
            </div>
        )
    }

    if (hasError || !analyticsData) {
        return (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>AI Analytics Unavailable</AlertTitle>
                <AlertDescription>
                    We couldn't generate insights for your applicant pool right now. The AI service may be temporarily overloaded. Please try again later.
                </AlertDescription>
            </Alert>
        );
    }

    return <ApplicantPoolCharts data={analyticsData} />;
}
