'use client';

import React from 'react';
import { useApp } from '@/context/app-context';

export default function DebtPage() {
  const { state } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debt</h1>
          <p className="text-muted-foreground">
            Track and manage your debts and liabilities.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Debt management feature coming soon...
        </p>
      </div>
    </div>
  );
}
