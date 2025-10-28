'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { useApp } from '@/context/app-context';
import { Budget } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  amount: z.coerce.number().min(0, { message: 'Budget must be non-negative.' }),
});

interface EditBudgetDialogProps {
  budget: Budget;
}

export function EditBudgetDialog({ budget }: EditBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const { state, updateBudget } = useApp();
  const { toast } = useToast();
  const category = state.expenseCategories?.find(c => c.value === budget.category);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: budget.amount,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateBudget({
        category: budget.category,
        amount: Number(values.amount),
      });
      toast({
        title: 'Budget Updated',
        description: `The budget for "${category?.label}" has been updated.`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update budget. Please try again.',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit Budget</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget: {category?.label}</DialogTitle>
          <DialogDescription>
            Update the monthly budget for this category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
