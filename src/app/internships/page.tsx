'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InternshipCard } from '@/components/internship-card';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getInternships } from '@/lib/internship-data-manager';
import type { Internship } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function InternshipsPage() {
  const [allInternships, setAllInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('all');
  const [domain, setDomain] = useState('all');

  useEffect(() => {
    setAllInternships(getInternships());
    setIsLoading(false);
  }, []);

  const domains = useMemo(() => ['all', ...Array.from(new Set(allInternships.map(i => i.domain)))], [allInternships]);
  const locations = useMemo(() => ['all', ...Array.from(new Set(allInternships.map(i => i.location)))], [allInternships]);

  const filteredInternships = useMemo(() => {
    return allInternships.filter(internship => {
      const searchTermMatch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            internship.company.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = location === 'all' || internship.location === location;
      const domainMatch = domain === 'all' || internship.domain === domain;
      return searchTermMatch && locationMatch && domainMatch;
    });
  }, [searchTerm, location, domain, allInternships]);

  if (isLoading) {
      return (
          <div className="container mx-auto py-12 px-4">
               <div className="text-center mb-12">
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                </div>
                <Card className="mb-8">
                    <CardContent className="p-4 md:p-6">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                         </div>
                    </CardContent>
                </Card>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                 </div>
          </div>
      )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Find Your Next Internship</h1>
        <p className="mt-3 text-lg text-foreground/70 max-w-2xl mx-auto">
          Explore thousands of opportunities and take the next step in your career.
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="w-full pl-10">
                    <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                    {domains.map((d) => (
                    <SelectItem key={d} value={d}>{d === 'all' ? 'All Domains' : d}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full pl-10">
                    <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                    {locations.map((l) => (
                    <SelectItem key={l} value={l}>{l === 'all' ? 'All Locations' : l}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground mb-6">{filteredInternships.length} opportunities found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map(internship => (
          <InternshipCard key={internship.id} internship={internship} />
        ))}
      </div>

      {filteredInternships.length === 0 && (
        <div className="text-center py-20 bg-secondary rounded-lg">
          <p className="text-xl font-semibold">No internships found</p>
          <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
