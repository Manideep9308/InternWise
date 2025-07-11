'use client';

import { useState, useEffect } from 'react';
import { ApplicantPoolCharts } from '@/components/applicant-pool-charts';
import type { StudentProfile } from '@/lib/types';
import { analyzeApplicantPool, type AnalyzeApplicantPoolOutput } from '@/ai/flows/analyze-applicant-pool';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface ApplicantPoolChartsLoaderProps {
    applicants: StudentProfile[];
}

export function ApplicantPoolChartsLoader({ applicants }: ApplicantPoolChartsLoaderProps) {
    const [analyticsData, setAnalyticsData] = useState<AnalyzeApplicantPoolOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (applicants.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const result = await analyzeApplicantPool({ studentProfiles: applicants });
                setAnalyticsData(result);
            } catch (error) {
                console.error("Failed to fetch applicant analytics:", error);
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

    if (!analyticsData) {
        return <p className="text-muted-foreground">Could not load analytics data.</p>;
    }

    return <ApplicantPoolCharts data={analyticsData} />;
}
