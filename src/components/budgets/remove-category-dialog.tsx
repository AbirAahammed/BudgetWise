
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useApp } from '@/context/app-context';
import { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface RemoveCategoryDialogProps {
  category: Category;
}

export function RemoveCategoryDialog({ category }: RemoveCategoryDialogProps) {
  const { removeCategory } = useApp();
  const { toast } = useToast();

  async function handleRemove() {
    try {
      await removeCategory(category.value);
      toast({
        title: 'Category Removed',
        description: `"${category.label}" and all associated data have been removed.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove category. Please try again.',
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove Category</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the "{category.label}" category and all associated transactions and budgets. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
