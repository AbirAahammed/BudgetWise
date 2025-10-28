'use client';

import React from 'react';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { CategorySpendingChart } from '@/components/dashboard/category-spending-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your financial health.
        </p>
      </div>

      <OverviewCards />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CategorySpendingChart />
        <RecentTransactions />
      </div>
    </div>
  );
}
