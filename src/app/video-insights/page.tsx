
'use client';

import * as React from 'react';
import { CrowdInsightsCard } from '@/components/kumbhview/crowd-insights-card';
import type { Role } from '@/lib/types';
import { LayoutClient } from '../layout-client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { collection, query, orderBy, onSnapshot, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldCheck, Flame, Wind, Siren, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalyzeVideoForSafetyHazardsOutput } from '@/ai/flows/analyze-video-for-safety-hazards';

interface Insight {
  id: string;
  videoUrl: string;
  analysis: AnalyzeVideoForSafetyHazardsOutput;
  createdAt: Timestamp;
}

function PastVideoInsights() {
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'video-insights'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedInsights: Insight[] = [];
      querySnapshot.forEach((doc) => {
        fetchedInsights.push({ id: doc.id, ...doc.data() } as Insight);
      });
      setInsights(fetchedInsights);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Video Insights</CardTitle>
        <CardDescription>A log of all previously analyzed videos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}
        {!loading && insights.length === 0 && (
          <p className="text-center text-muted-foreground">No insights have been saved yet.</p>
        )}
        {insights.map((insight) => (
          <div key={insight.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="md:col-span-1">
              <video src={insight.videoUrl} controls className="w-full aspect-video rounded-md bg-muted" />
              <p className="text-xs text-muted-foreground mt-2">
                Analyzed {formatDistanceToNow(insight.createdAt.toDate(), { addSuffix: true })}
              </p>
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="flex flex-wrap gap-2">
                {insight.analysis.safetyAnalysis.hazardDetected ? (
                  <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Hazard Detected</Badge>
                ) : (
                  <Badge variant="default"><ShieldCheck className="mr-1 h-3 w-3" /> No Hazard</Badge>
                )}
                {insight.analysis.safetyAnalysis.smokeDetected && (<Badge variant="destructive"><Wind className="mr-1 h-3 w-3" /> Smoke</Badge>)}
                {insight.analysis.safetyAnalysis.fireDetected && (<Badge variant="destructive"><Flame className="mr-1 h-3 w-3" /> Fire</Badge>)}
                {insight.analysis.safetyAnalysis.panicDetected && (<Badge variant="destructive"><Siren className="mr-1 h-3 w-3" /> Panic</Badge>)}
              </div>
              {insight.analysis.safetyAnalysis.hazardDetected && (
                <>
                  {insight.analysis.safetyAnalysis.timestamp && (
                    <p className="text-sm text-muted-foreground"><Clock className="inline-block mr-1.5 size-4" />Timestamp: <span className="font-bold text-primary">{insight.analysis.safetyAnalysis.timestamp}</span></p>
                  )}
                  <p className="text-sm text-muted-foreground">**Description:** {insight.analysis.safetyAnalysis.hazardDescription}</p>
                </>
              )}
              <p className="text-sm text-muted-foreground">**Crowd:** {insight.analysis.safetyAnalysis.crowdDensity}</p>
              <p className="text-sm text-muted-foreground">**Events:** {insight.analysis.safetyAnalysis.unusualEvents}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


export default function VideoInsightsPage() {
  const [role, setRole] = React.useState<Role>('Administrator');
  return (
    <LayoutClient>
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <CrowdInsightsCard role={role} />
        <PastVideoInsights />
      </main>
    </LayoutClient>
  );
}
