import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { AlertTriangle } from 'lucide-react';

interface VideoFeedProps {
  feedName: string;
  anomalyDetected?: boolean;
  crowdDensity: 'Low' | 'Medium' | 'High' | 'Critical';
}

const densityValues: Record<VideoFeedProps['crowdDensity'], number> = {
  Low: 20,
  Medium: 50,
  High: 75,
  Critical: 95,
};

export function VideoFeed({ feedName, anomalyDetected = false, crowdDensity }: VideoFeedProps) {
  const isHighDensity = crowdDensity === 'High' || crowdDensity === 'Critical';

  return (
    <Card className="flex flex-col transform overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{feedName}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-green-400">LIVE</span>
          </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video overflow-hidden">
          <Image
            src="https://placehold.co/1280x720"
            alt={`Live feed from ${feedName}`}
            width={1280}
            height={720}
            data-ai-hint="cctv crowd"
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 bg-muted/30 p-4">
        {anomalyDetected && (
          <Badge variant="destructive" className="w-full animate-pulse justify-center py-1.5 text-base">
            <AlertTriangle className="mr-2 h-5 w-5" />
            ANOMALY DETECTED
          </Badge>
        )}
        <div className="w-full">
            <div className="mb-1 flex items-baseline justify-between">
                <p className="text-sm font-medium">Crowd Density</p>
                <p className={`text-sm font-bold ${isHighDensity ? 'text-destructive' : 'text-foreground'}`}>{crowdDensity}</p>
            </div>
            <Progress 
                value={densityValues[crowdDensity]} 
                className={isHighDensity ? '[&>div]:bg-destructive' : ''} 
            />
        </div>
      </CardFooter>
    </Card>
  );
}
