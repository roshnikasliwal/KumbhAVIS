'use client';

import * as React from 'react';
import type { Role } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { LiveAlerts } from './live-alerts';

interface DroneDispatchCardProps {
  role: Role;
}

export function DroneDispatchCard({ role }: DroneDispatchCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Send className="size-5" /> Drone Dispatch</CardTitle>
        <CardDescription>
            Autonomously dispatch drones to high-priority incidents for a closer look.
            You can trigger this from the "Live Alerts" card for any high-severity incident.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LiveAlerts role={role} />
      </CardContent>
    </Card>
  );
}
