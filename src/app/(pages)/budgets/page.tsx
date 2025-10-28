'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EditBudgetDialog } from '@/components/budgets/edit-budget-dialog';
import { AddCategoryDialog } from '@/components/budgets/add-category-dialog';
import { RemoveCategoryDialog } from '@/components/budgets/remove-category-dialog';
import { Category } from '@/lib/types';

export default function BudgetsPage() {
  const { state } = useApp();
  const { transactions, budgets, expenseCategories } = state;

  const spendingByCategory = useMemo(() => {
    if (!transactions) return {};
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {} as { [key: string]: number });
  }, [transactions]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  if (!budgets || !expenseCategories) {
    return <div>Loading budgets...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Set and manage your monthly spending limits and categories.
          </p>
        </div>
        <AddCategoryDialog />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const category = expenseCategories.find(c => c.value === budget.category);
          if (!category) return null;

          const spent = spendingByCategory[budget.category] || 0;
          const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
          const remaining = budget.amount - spent;
          const IconComponent = category.icon;

          return (
            <Card key={budget.category}>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-muted-foreground" />
                  <CardTitle className="text-lg">{category.label}</CardTitle>
                </div>
                <div className="flex items-center">
                  <EditBudgetDialog budget={budget} />
                  <RemoveCategoryDialog category={category} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatCurrency(spent)} spent</span>
                  <span>{formatCurrency(budget.amount)} budgeted</span>
                </div>
                <Progress value={progress} />
              </CardContent>
              <CardFooter>
                <p className={`text-sm ${remaining >= 0 ? 'text-muted-foreground' : 'text-destructive'}`}>
                  {remaining >= 0
                    ? `${formatCurrency(remaining)} remaining`
                    : `${formatCurrency(Math.abs(remaining))} over budget`}
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
