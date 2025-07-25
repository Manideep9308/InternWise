
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInternshipsByCompany, getApplicantsForInternship } from '@/lib/internship-data-manager';
import type { Internship, StudentProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Building, Users, ArrowRight, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { ApplicantPoolChartsLoader } from '@/components/applicant-pool-charts-loader';
import { Separator } from '@/components/ui/separator';

export default function EmployerDashboardPage() {
    const [companyName, setCompanyName] = useState<string | null>(null);
    const [postedInternships, setPostedInternships] = useState<Internship[]>([]);
    const [allApplicants, setAllApplicants] = useState<StudentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedCompanyName = localStorage.getItem('employerCompany');
        if (storedCompanyName) {
            setCompanyName(storedCompanyName);
            const internships = getInternshipsByCompany(storedCompanyName);

            const applicantsByInternship = internships.map(internship => {
                const applicants = getApplicantsForInternship(internship.id);
                return {
                    ...internship,
                    applicantCount: applicants.length,
                    applicantProfiles: applicants
                };
            });

            const allCompanyApplicants = applicantsByInternship.flatMap(i => i.applicantProfiles);
            setAllApplicants(allCompanyApplicants);
            
            const internshipsWithCounts = applicantsByInternship.map(({ applicantProfiles, ...rest}) => rest);
            // Rename applicantCount to applicants for the final state
            const finalInternships = internshipsWithCounts.map(({ applicantCount, ...rest}) => ({...rest, applicants: applicantCount}));
            setPostedInternships(finalInternships);

        } else {
            router.push('/login');
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading || !companyName) {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="flex justify-between items-center mb-10">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-12 w-48" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-secondary min-h-screen">
            <div className="container mx-auto py-12 px-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold font-headline">Employer Dashboard</h1>
                        <p className="text-xl text-primary font-semibold flex items-center gap-2 mt-1">
                            <Building className="h-5 w-5" />
                            {companyName}
                        </p>
                    </div>
                    <Button size="lg" onClick={() => router.push('/post-internship')}>
                        <PlusCircle className="mr-2" />
                        Post New Internship
                    </Button>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart2 className="text-primary"/>
                            Applicant Pool Analytics
                        </CardTitle>
                        <CardDescription>
                            An AI-powered overview of all candidates who have applied to your internships.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApplicantPoolChartsLoader applicants={allApplicants} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Internship Postings</CardTitle>
                        <CardDescription>
                            Here are the internships you've posted. Click on one to view and rank applicants.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {postedInternships.length > 0 ? (
                            <div className="space-y-4">
                                {postedInternships.map((internship) => (
                                    <Link key={internship.id} href={`/internships/${internship.id}/applicants`} passHref>
                                        <div className="border rounded-lg p-4 flex justify-between items-center hover:bg-background transition-colors cursor-pointer">
                                            <div>
                                                <h3 className="font-semibold">{internship.title}</h3>
                                                <p className="text-sm text-muted-foreground">{internship.location} &bull; {internship.domain}</p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    <span>{internship.applicants} Applicant(s)</span>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 px-6 border-2 border-dashed rounded-lg">
                                <p className="text-lg font-medium text-muted-foreground">You haven't posted any internships yet.</p>
                                <Button className="mt-4" onClick={() => router.push('/post-internship')}>
                                    Post Your First Internship
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
