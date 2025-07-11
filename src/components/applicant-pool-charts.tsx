'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { AnalyzeApplicantPoolOutput } from '@/ai/flows/analyze-applicant-pool';

interface ApplicantPoolChartsProps {
  data: AnalyzeApplicantPoolOutput;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ApplicantPoolCharts({ data }: ApplicantPoolChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top 5 Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topSkills.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.topSkills} layout="vertical" margin={{ left: 25 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Bar dataKey="count" name="Applicants" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-16">Not enough data for skills chart.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top 5 Universities</CardTitle>
        </CardHeader>
        <CardContent>
           {data.universityDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data.universityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.universityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
           ) : (
            <p className="text-muted-foreground text-center py-16">Not enough data for university chart.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
