'use client';

import { useApp } from '@/context/app-context';
import { useMemo } from 'react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

export function MonthlySpendingChart() {
  const { state } = useApp();
  const { transactions } = state;

  const chartData = useMemo(() => {
    if (!transactions) return [];

    const expenseData = transactions.filter((t) => t.type === 'expense');

    const spendingByMonth = expenseData.reduce((acc, t) => {
      const month = format(new Date(t.date), 'yyyy-MM');
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += t.amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(spendingByMonth).map(month => ({
      name: format(new Date(month), 'MMM yy'),
      spent: spendingByMonth[month],
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [transactions]);

  if (!transactions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>Your spending trend over the past months.</CardDescription>
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
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Your spending trend over the past months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
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
            <Line type="monotone" dataKey="spent" stroke="hsl(var(--primary))" name="Spent" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
