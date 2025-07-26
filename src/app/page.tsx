'use client';

import * as React from 'react';
import { DashboardCards } from '@/components/kumbhview/dashboard-cards';
import { IncidentChart } from '@/components/kumbhview/incident-chart';
import { LiveAlerts } from '@/components/kumbhview/live-alerts';
import { CrowdHeatmap } from '@/components/kumbhview/crowd-heatmap';
import { Role } from '@/lib/types';

export default function Dashboard() {
  const [role, setRole] = React.useState<Role>('Administrator');
  return (
    <main className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-6">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 xl:col-span-4">
        <DashboardCards />
        <IncidentChart />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1 xl:col-span-2">
        <CrowdHeatmap />
        <LiveAlerts role={role} />
      </div>
    </main>
  );
}
