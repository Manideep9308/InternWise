
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInternshipsByCompany, getApplicantsForInternship } from '@/lib/internship-data-manager';
import type { Internship } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Building, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboardPage() {
    const [companyName, setCompanyName] = useState<string | null>(null);
    const [postedInternships, setPostedInternships] = useState<Internship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // For prototype purposes, we get the company name from localStorage
        const storedCompanyName = localStorage.getItem('employerCompany');
        if (storedCompanyName) {
            setCompanyName(storedCompanyName);
            const internships = getInternshipsByCompany(storedCompanyName);
            // We enrich the internship data with the real applicant count
            const internshipsWithApplicantCounts = internships.map(internship => ({
                ...internship,
                applicants: getApplicantsForInternship(internship.id).length,
            }));
            setPostedInternships(internshipsWithApplicantCounts);
        } else {
            // If no company is "logged in", redirect to login
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
