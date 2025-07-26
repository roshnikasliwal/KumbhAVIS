'use client';

import * as React from 'react';
import type { Role } from '@/lib/types';
import { LayoutClient } from '../layout-client';
import { DroneDispatchCard } from '@/components/kumbhview/drone-dispatch-card';

export default function DroneDispatchPage() {
  const [role, setRole] = React.useState<Role>('Administrator');
  return (
    <LayoutClient>
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <DroneDispatchCard role={role} />
      </main>
    </LayoutClient>
  );
}
