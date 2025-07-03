'use client';

import { useState, useEffect } from 'react';
import { InternshipCard } from '@/components/internship-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getInternships } from '@/lib/internship-data-manager';
import type { Internship } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

export function FeaturedInternships() {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const allInternships = getInternships();
        setInternships(allInternships.slice(0, 3));
        setIsLoading(false);
    }, []);
    
    return (
        <section className="w-full py-20 md:py-28 bg-secondary">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">Featured Internships</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </>
                    ) : (
                        internships.map((internship) => (
                            <InternshipCard key={internship.id} internship={internship} />
                        ))
                    )}
                </div>
                <div className="text-center mt-12">
                    <Link href="/internships" passHref>
                        <Button variant="outline">View All Internships</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
