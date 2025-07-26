'use client';

import * as React from 'react';
import { CrowdInsightsCard } from '@/components/kumbhview/crowd-insights-card';
import { SocialSentimentCard } from '@/components/kumbhview/social-sentiment-card';
import type { Role } from '@/lib/types';
import { LayoutClient } from '../layout-client';

export default function CrowdAnalyticsPage() {
  const [role, setRole] = React.useState<Role>('Administrator');

  return (
    <LayoutClient>
      <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-2">
        <CrowdInsightsCard role={role} />
        <SocialSentimentCard role={role} />
      </div>
    </LayoutClient>
  );
}
