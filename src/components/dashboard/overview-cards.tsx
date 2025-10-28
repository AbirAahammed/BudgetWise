'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/app-context';
import { ArrowDown, ArrowUp, DollarSign, Scale } from 'lucide-react';
import { useMemo } from 'react';

export function OverviewCards() {
  const { totalIncome, totalExpenses, netBalance } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const cards = useMemo(() => [
    {
      title: 'Total Income',
      amount: formatCurrency(totalIncome),
      icon: ArrowUp,
      color: 'text-accent',
    },
    {
      title: 'Total Expenses',
      amount: formatCurrency(totalExpenses),
      icon: ArrowDown,
      color: 'text-destructive',
    },
    {
      title: 'Net Balance',
      amount: formatCurrency(netBalance),
      icon: Scale,
      color: netBalance >= 0 ? 'text-accent' : 'text-destructive',
    },
  ], [totalIncome, totalExpenses, netBalance]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.amount}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
