'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutClient } from '../layout-client';
import { LiveAlerts } from '@/components/kumbhview/live-alerts';
import type { Role } from '@/lib/types';

export default function ResponderDispatchPage() {
    const [role, setRole] = React.useState<Role>('Administrator');
  return (
    <LayoutClient>
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Intelligent Responder Dispatch</CardTitle>
                <CardDescription>
                    This system uses AI to dispatch the nearest available responders to incidents.
                    You can trigger this from the "Live Alerts" card on the dashboard or here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LiveAlerts role={role} />
            </CardContent>
        </Card>
      </main>
    </LayoutClient>
  );
}
