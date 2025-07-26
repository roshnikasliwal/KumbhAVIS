'use client';

import * as React from 'react';
import type { Role } from '@/lib/types';
import { LayoutClient } from '../layout-client';
import { SituationalSummaryCard } from '@/components/kumbhview/situational-summary-card';

export default function SituationalSummaryPage() {
  const [role, setRole] = React.useState<Role>('Administrator');
  return (
    <LayoutClient>
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <SituationalSummaryCard role={role} />
      </main>
    </LayoutClient>
  );
}
