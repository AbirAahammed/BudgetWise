import type { LucideIcon } from 'lucide-react';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  name: string;
  description?: string;
};

export type NewTransaction = Omit<Transaction, 'id'>;

export type Category = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type NewCategory = {
  value: string;
  label: string;
  icon: string;
};

export type Budget = {
  category: string;
  amount: number;
};
