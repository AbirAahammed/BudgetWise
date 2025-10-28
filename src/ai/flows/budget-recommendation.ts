'use server';

/**
 * @fileOverview AI-powered budget optimization recommendations.
 *
 * This file defines a Genkit flow that analyzes a user's income, spending habits,
 * and financial goals to provide customized recommendations for budget adjustments.
 *
 * @Exported Members:
 *   - `getBudgetRecommendation`: Asynchronous function to trigger the budget recommendation flow.
 *   - `BudgetRecommendationInput`: Zod schema defining the expected input for the flow.
 *   - `BudgetRecommendationOutput`: Zod schema defining the structure of the flow's output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the budget recommendation flow.
const BudgetRecommendationInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  expenses: z.record(z.number()).describe('A record of the user\'s expenses, with category names as keys and expense amounts as values.'),
  financialGoals: z.string().describe('The user\'s financial goals, e.g., saving for retirement, paying off debt.'),
});
export type BudgetRecommendationInput = z.infer<typeof BudgetRecommendationInputSchema>;

// Define the output schema for the budget recommendation flow.
const BudgetRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      category: z.string().describe('The expense category the recommendation applies to.'),
      recommendation: z.string().describe('A specific recommendation for adjusting the budget or expenses in this category.'),
      impact: z.string().describe('The expected impact of the recommendation on the user\'s financial health.'),
    })
  ).describe('A list of budget optimization recommendations.'),
});
export type BudgetRecommendationOutput = z.infer<typeof BudgetRecommendationOutputSchema>;

// Exported function to get budget recommendations.
export async function getBudgetRecommendation(input: BudgetRecommendationInput): Promise<BudgetRecommendationOutput> {
  return budgetRecommendationFlow(input);
}

// Define the prompt for the budget recommendation.
const budgetRecommendationPrompt = ai.definePrompt({
  name: 'budgetRecommendationPrompt',
  input: {schema: BudgetRecommendationInputSchema},
  output: {schema: BudgetRecommendationOutputSchema},
  prompt: `You are a financial advisor providing personalized budget optimization recommendations.

  Based on the user's income, expenses, and financial goals, suggest specific adjustments to their budget.
  Focus on recommendations that will have the greatest impact on achieving a balanced budget and improving financial health.

  Income: {{income}}
  Expenses: {{#each (keys expenses)}}{{@key}}: {{get ../expenses @key}}\n{{/each}}
  Financial Goals: {{financialGoals}}
  
  Format your response as a JSON object with a 'recommendations' array. Each object in the array should include:
  - category: The expense category the recommendation applies to.
  - recommendation: A specific recommendation for adjusting the budget or expenses in this category.
  - impact: The expected impact of the recommendation on the user's financial health.
  `,
});

// Define the Genkit flow for budget recommendation.
const budgetRecommendationFlow = ai.defineFlow(
  {
    name: 'budgetRecommendationFlow',
    inputSchema: BudgetRecommendationInputSchema,
    outputSchema: BudgetRecommendationOutputSchema,
  },
  async input => {
    const {output} = await budgetRecommendationPrompt(input);
    return output!;
  }
);
