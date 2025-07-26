
'use client';

import * as React from 'react';
import { getSituationalSummary, GetSituationalSummaryOutput } from '@/ai/flows/get-situational-summary';
import { addSituationalSummary } from '@/services/situational-summary';
import type { Role } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ClipboardPen, Bot } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Label } from '../ui/label';

interface SituationalSummaryCardProps {
  role: Role;
}

export function SituationalSummaryCard({ role }: SituationalSummaryCardProps) {
  const [query, setQuery] = React.useState('Summarize security concerns in the West Zone around Ghat 5.');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<GetSituationalSummaryOutput | null>(null);
  const { toast } = useToast();
  const isAdmin = role === 'Administrator';

  const handleAnalysis = async () => {
    if (!query.trim() || !isAdmin) return;
    setLoading(true);
    setResult(null);
    try {
      const analysisResult = await getSituationalSummary({ query });
      setResult(analysisResult);
      await addSituationalSummary(query, analysisResult);
      toast({
        title: 'Briefing Generated',
        description: 'The situational summary has been saved.',
      });
    } catch (error) {
      console.error('Error getting or saving situational summary:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not generate or save the summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ClipboardPen className="size-5" /> Situational Summary</CardTitle>
        <CardDescription>Ask the AI for a concise, actionable briefing on the current situation.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
            <Label htmlFor="query-input">Your Query</Label>
            <Textarea
              id="query-input"
              placeholder="e.g., Summarize all active incidents and potential risks."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              disabled={!isAdmin || loading}
            />
        </div>
        
        {loading && (
          <div className="space-y-4 pt-2">
             <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-500">
            <div>
              <h4 className="font-semibold text-sm mb-2">Actionable Briefing</h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md border bg-muted/50 p-4">
                {result.summary}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={!isAdmin || loading || !query.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" />
              Get Briefing
            </>
          )}
        </Button>
         {!isAdmin && <p className="ml-4 text-xs text-muted-foreground">Administrator role required.</p>}
      </CardFooter>
    </Card>
  );
}
