import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Siren, Users, ShieldAlert, TrendingUp } from "lucide-react";

export function DashboardCards() {
  const safetyIndicators = [
    {
      title: "Active Alerts",
      value: "12",
      change: "+2",
      icon: <Siren className="h-6 w-6 text-destructive" />,
      description: "Immediate attention required",
    },
    {
      title: "High-Density Zones",
      value: "7",
      change: "-1",
      icon: <Users className="h-6 w-6 text-amber-500" />,
      description: "Areas with high crowd concentration",
    },
    {
      title: "Incidents Reported",
      value: "43",
      change: "+5 today",
      icon: <ShieldAlert className="h-6 w-6 text-blue-500" />,
      description: "Total incidents since start",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {safetyIndicators.map((indicator) => (
        <Card key={indicator.title} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{indicator.title}</CardTitle>
            {indicator.icon}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">{indicator.value}</div>
            <p className="text-xs text-muted-foreground">{indicator.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
