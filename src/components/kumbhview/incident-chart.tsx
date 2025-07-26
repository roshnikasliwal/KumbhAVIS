'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartData = [
  { name: 'Medical', incidents: 18, fill: 'hsl(var(--chart-1))' },
  { name: 'Overcrowding', incidents: 12, fill: 'hsl(var(--chart-2))' },
  { name: 'Lost & Found', incidents: 7, fill: 'hsl(var(--chart-3))' },
  { name: 'Obstruction', incidents: 4, fill: 'hsl(var(--chart-4))' },
  { name: 'Unrest', incidents: 2, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  incidents: {
    label: 'Incidents',
  },
  Medical: {
    label: 'Medical',
    color: 'hsl(var(--chart-1))',
  },
  Overcrowding: {
    label: 'Overcrowding',
    color: 'hsl(var(--chart-2))',
  },
  'Lost & Found': {
    label: 'Lost & Found',
    color: 'hsl(var(--chart-3))',
  },
  Obstruction: {
    label: 'Obstruction',
    color: 'hsl(var(--chart-4))',
  },
  Unrest: {
    label: 'Unrest',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;


export function IncidentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Reports by Category</CardTitle>
        <CardDescription>Breakdown of all reported incidents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
                <Bar dataKey="incidents" radius={[4, 4, 0, 0]} nameKey="name" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
