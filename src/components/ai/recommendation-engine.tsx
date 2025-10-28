'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/app-context';
import { getBudgetRecommendation, BudgetRecommendationOutput } from '@/ai/flows/budget-recommendation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { incomeCategories } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  financialGoals: z.string().min(10, {
    message: 'Please describe your financial goals in at least 10 characters.',
  }),
});

export function RecommendationEngine() {
  const { state, totalIncome } = useApp();
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<BudgetRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financialGoals: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setError(null);
      setRecommendations(null);

      const expensesByCategory = state.transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = 0;
          }
          acc[t.category] += t.amount;
          return acc;
        }, {} as Record<string, number>);

      try {
        const result = await getBudgetRecommendation({
          income: totalIncome,
          expenses: expensesByCategory,
          financialGoals: values.financialGoals,
        });
        setRecommendations(result);
      } catch (e) {
        console.error(e);
        setError('Failed to get recommendations. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="financialGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">What are your financial goals?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Save for a down payment, pay off student loans, build an emergency fund..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Recommendations
              </>
            )}
          </Button>
        </form>
      </Form>
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {recommendations && (
        <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold tracking-tight">Your AI-Powered Recommendations</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.recommendations.map((rec, index) => {
              const allCategories = [...state.expenseCategories, ...incomeCategories];
              const category = allCategories.find((c) => c.value === rec.category);
              const Icon = category?.icon;
              return (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      {category?.label || rec.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <p className="font-semibold text-primary">Recommendation:</p>
                    <p className="text-sm">{rec.recommendation}</p>
                    <p className="font-semibold text-accent pt-2">Expected Impact:</p>
                    <p className="text-sm">{rec.impact}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
