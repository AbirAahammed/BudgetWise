'use client';

import React from 'react';
import { useApp } from '@/context/app-context';
import { TransactionsDataTable } from '@/components/transactions/data-table';
import { columns } from '@/components/transactions/columns';
import { AddTransactionDialog } from '@/components/transactions/add-transaction-dialog';

export default function TransactionsPage() {
  const { state } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your income and expenses.
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      <TransactionsDataTable columns={columns} data={state.transactions || []} />
    </div>
  );
}
