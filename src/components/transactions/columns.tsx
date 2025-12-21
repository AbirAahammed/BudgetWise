'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Transaction, Category } from '@/lib/types';
import { useApp } from '@/context/app-context';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useMemo } from 'react';
import { EditTransactionDialog } from './edit-transaction-dialog';
import { RemoveTransactionDialog } from './remove-transaction-dialog';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge variant={type === 'income' ? 'default' : 'secondary'} className={type === 'income' ? 'bg-accent text-accent-foreground' : 'bg-destructive/80 text-destructive-foreground'}>
          {type === 'income' ? <ArrowUp className="mr-2 h-4 w-4" /> : <ArrowDown className="mr-2 h-4 w-4" />}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: function Cell({ row }) {
      const { state } = useApp();
      
      const allCategories: Category[] = useMemo(() => {
        const expenseCategories = state.expenseCategories || [];
        const incomeCategories = state.incomeCategories || [];
        return [...expenseCategories, ...incomeCategories];
      }, [state.expenseCategories]);
      
      const categoryValue = row.getValue('category') as string;
      const category = allCategories.find((c) => c.value === categoryValue);
      const Icon = category?.icon;

      return (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <span>{category?.label || categoryValue}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const type = row.getValue('type');
      const formatted = formatCurrency(amount);

      return <div className={`text-right font-medium ${type === 'income' ? 'text-accent' : ''}`}>{formatted}</div>;
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: function Cell({ row }) {
      const transaction = row.original;
      return (
        <div className="flex items-center gap-2">
          <EditTransactionDialog transaction={transaction} />
          <RemoveTransactionDialog transaction={transaction} />
        </div>
      );
    },
  },
];
