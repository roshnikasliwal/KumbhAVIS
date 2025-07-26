'use client';

import * as React from 'react';
import { SocialSentimentCard } from '@/components/kumbhview/social-sentiment-card';
import type { Role } from '@/lib/types';
import { LayoutClient } from '../layout-client';

export default function SocialSentimentPage() {
  const [role, setRole] = React.useState<Role>('Administrator');
  return (
    <LayoutClient>
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <SocialSentimentCard role={role} />
      </main>
    </LayoutClient>
  );
}
