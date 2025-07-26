'use client';

import * as React from 'react';
import type { Role } from '@/lib/types';
import { LayoutClient } from '../layout-client';
import { LostAndFoundCard } from '@/components/kumbhview/lost-and-found-card';

export default function LostAndFoundPage() {
  const [role, setRole] = React.useState<Role>('Administrator');
  return (
    <LayoutClient>
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <LostAndFoundCard role={role} />
      </main>
    </LayoutClient>
  );
}
