'use client';

import { useApp } from '@/context/app-context';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Category } from '@/lib/types';

export function RecentTransactions() {
  const { state } = useApp();

  const recentTransactions = useMemo(() => {
    if (!state.transactions) return [];
    return [...state.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [state.transactions]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const allCategories: Category[] = useMemo(() => {
    const expenseCategories = state.expenseCategories || [];
    const staticIncomeCategories = state.incomeCategories || [];
    return [...expenseCategories, ...staticIncomeCategories];
  }, [state.expenseCategories]);

  if (!state.transactions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your 5 most recent transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Loading transactions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your 5 most recent transactions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransactions.map((transaction) => {
          const category = allCategories.find(c => c.value === transaction.category);
          const Icon = category?.icon;
          return (
            <div key={transaction.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={transaction.type === 'income' ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}>
                  {Icon ? <Icon className="h-4 w-4" /> : transaction.type === 'income' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">{category?.label}</p>
              </div>
              <div className={`ml-auto font-medium ${transaction.type === 'income' ? 'text-accent' : 'text-destructive'}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
