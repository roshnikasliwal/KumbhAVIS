import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, UserCheck, Zap } from "lucide-react";

const alerts = [
  { id: 1, type: 'Surge', location: 'Ghat 3', time: '2 min ago', icon: <AlertTriangle className="h-4 w-4 text-destructive" />, details: "Unusual crowd surge detected." },
  { id: 2, type: 'Object', location: 'Entry Point B', time: '5 min ago', icon: <Zap className="h-4 w-4 text-yellow-500" />, details: "Abandoned package identified." },
  { id: 3, type: 'Resolved', location: 'Ghat 3', time: '8 min ago', icon: <UserCheck className="h-4 w-4 text-green-500" />, details: "Personnel responded to surge." },
  { id: 4, type: 'Density', location: 'Main Street', time: '12 min ago', icon: <AlertTriangle className="h-4 w-4 text-destructive" />, details: "Critical density reached." },
];

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50">
                <div className="mt-1">{alert.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold">{alert.details}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{alert.location}</span>
                    <span className="text-xs">&bull;</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
