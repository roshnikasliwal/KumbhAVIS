
'use client';

import * as React from 'react';
import { summarizeSocialMediaSentiment, SummarizeSocialMediaSentimentOutput } from '@/ai/flows/summarize-social-media-sentiment';
import { addSocialSentimentAnalysis } from '@/services/social-sentiment';
import type { Role } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

interface SocialSentimentCardProps {
  role: Role;
}

const exampleText = `Huge crowds at Ghat no. 3, getting a bit risky. #KumbhMela\nAmazing experience at the Kumbh Mela, but the sanitation could be better near camp 7. #Kumbh2025\nTraffic is completely blocked on the main bridge. Authorities need to do something! @KumbhPolice`;

export function SocialSentimentCard({ role }: SocialSentimentCardProps) {
  const [text, setText] = React.useState(exampleText);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<SummarizeSocialMediaSentimentOutput | null>(null);
  const { toast } = useToast();
  const isAdmin = role === 'Administrator';

  const handleAnalysis = async () => {
    if (!text.trim() || !isAdmin) return;
    setLoading(true);
    setResult(null);
    try {
      const analysisResult = await summarizeSocialMediaSentiment({ socialMediaFeeds: text });
      setResult(analysisResult);
      await addSocialSentimentAnalysis(text, analysisResult);
      toast({
        title: 'Analysis Complete',
        description: 'Social sentiment analysis has been saved.',
      });
    } catch (error) {
      console.error('Error analyzing or saving social media sentiment:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Could not analyze sentiment or save the results. Please check the console.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getSentimentVariant = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageCircle className="size-5" /> Social Sentiment</CardTitle>
        <CardDescription>Analyze social media posts for public sentiment and concerns.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <Textarea
          placeholder="Paste social media feeds here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          disabled={!isAdmin || loading}
        />
        {loading && (
          <div className="space-y-4 pt-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {result && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-500">
            <div>
              <h4 className="font-semibold text-sm mb-1">Overall Sentiment</h4>
              <Badge variant={getSentimentVariant(result.overallSentiment)}>{result.overallSentiment}</Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Key Concerns</h4>
              <p className="text-sm text-muted-foreground">{result.keyConcerns}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Potential Safety Issues</h4>
              <p className="text-sm text-muted-foreground">{result.potentialSafetyIssues}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={!isAdmin || loading || !text.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" />
              Analyze Sentiment
            </>
          )}
        </Button>
         {!isAdmin && <p className="ml-4 text-xs text-muted-foreground">Administrator role required.</p>}
      </CardFooter>
    </Card>
  );
}
