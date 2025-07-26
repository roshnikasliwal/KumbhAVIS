import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const logs = [
    { id: 1, msg: "System initialized", time: "08:00:01 AM" },
    { id: 2, msg: "Video feed started: Ghat 1", time: "08:00:15 AM" },
    { id: 3, msg: "User 'Admin' logged in", time: "08:01:23 AM" },
    { id: 4, msg: "Alert generated: Unusual Crowd Surge", time: "08:15:45 AM" },
    { id: 5, msg: "Map improvement suggestion requested", time: "08:16:10 AM" },
    { id: 6, msg: "Density status updated: Main Street to Critical", time: "08:21:05 AM" },
];

export function LogsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className="space-y-2 font-mono text-xs">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary/70">[{log.time}]</span>
                <p className="flex-1 truncate">{log.msg}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
