'use client';

import { useApp } from '@/context/app-context';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function CategorySpendingChart() {
  const { state } = useApp();
  const { transactions, budgets } = state;

  const chartData = useMemo(() => {
    if (!transactions || !budgets) return [];

    const expenseData = transactions.filter((t) => t.type === 'expense');

    const spendingByCategory = expenseData.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {} as { [key: string]: number });

    return budgets.map(budget => ({
      name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
      spent: spendingByCategory[budget.category] || 0,
      budget: budget.amount,
    }));
  }, [transactions, budgets]);

  if (!transactions || !budgets) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Spending</CardTitle>
          <CardDescription>Comparison of your spending against your budget for each category.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Spending</CardTitle>
        <CardDescription>Comparison of your spending against your budget for each category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend wrapperStyle={{paddingTop: '20px'}} />
            <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" radius={[4, 4, 0, 0]} />
            <Bar dataKey="budget" fill="hsl(var(--secondary))" name="Budget" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
