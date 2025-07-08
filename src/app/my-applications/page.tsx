'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getApplicationsByStudent, type StudentApplication } from '@/lib/internship-data-manager';
import type { StudentProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList, Briefcase, CheckCircle, Clock, Eye, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedProfileData = localStorage.getItem('studentProfile');
        if (storedProfileData) {
            const parsedProfile = JSON.parse(storedProfileData);
            setProfile(parsedProfile);
            const studentApps = getApplicationsByStudent(parsedProfile.email);
            setApplications(studentApps);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="flex flex-col items-center text-center mb-10">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-10 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="max-w-4xl mx-auto space-y-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="container mx-auto py-12 px-4 max-w-4xl">
                <Alert>
                    <User className="h-4 w-4" />
                    <AlertTitle>Create Your Profile to View Applications</AlertTitle>
                    <AlertDescription>
                        You need to create a profile first to see your application history.
                        <Button onClick={() => router.push('/upload-resume')} className="mt-4">
                            Create Profile
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex flex-col items-center text-center mb-10">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                    <ClipboardList className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold font-headline">My Applications</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Here's a history of all the internships you've applied for.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                {applications.length > 0 ? (
                    <div className="space-y-4">
                        {applications.map(({ internship, status }) => (
                            <Card key={internship.id} className="transition-all hover:shadow-md">
                                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{internship.title}</h3>
                                        <p className="text-sm text-muted-foreground">{internship.company} &bull; {internship.location}</p>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <Badge variant={status === 'Interview Complete' ? 'default' : 'secondary'} className="py-1 px-3">
                                            {status === 'Interview Complete' ? <CheckCircle className="mr-2 h-4 w-4" /> : <Clock className="mr-2 h-4 w-4" />}
                                            {status}
                                        </Badge>
                                        <Link href={`/internships/${internship.id}`} passHref>
                                            <Button variant="outline" size="sm">
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-10 text-center text-muted-foreground">
                            <p className="text-lg font-medium">You haven't applied to any internships yet.</p>
                            <Button className="mt-4" onClick={() => router.push('/internships')}>
                                <Briefcase className="mr-2" />
                                Find Internships
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
