import React from 'react';
import { RecommendationEngine } from '@/components/ai/recommendation-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Get personalized recommendations to improve your budget.
        </p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
                <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                Our AI financial advisor analyzes your income, expenses, and financial goals to provide actionable advice. Just tell us what you're saving for, and we'll help you find the best path to get there.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <RecommendationEngine />
        </CardContent>
      </Card>
    </div>
  );
}
