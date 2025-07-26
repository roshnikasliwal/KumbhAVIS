'use client';

import * as React from 'react';
import { LiveAlerts } from '@/components/kumbhview/live-alerts';
import { IncidentChart } from '@/components/kumbhview/incident-chart';
import { LayoutClient } from '../layout-client';
import type { Role } from '@/lib/types';

export default function SafetyHubPage() {
    const [role, setRole] = React.useState<Role>('Administrator');
  return (
    <LayoutClient>
      <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-6">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 xl:col-span-4">
          <IncidentChart />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1 xl:col-span-2">
          <LiveAlerts role={role} />
        </div>
      </div>
    </LayoutClient>
  );
}
