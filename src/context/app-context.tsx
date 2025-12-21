'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Transaction, Budget, Category, NewTransaction, NewCategory } from '@/lib/types';
import {
  Home, Car, Utensils, ShoppingCart, HeartPulse, Ticket, GraduationCap,
  Briefcase, Gift, MoreHorizontal, DollarSign, PiggyBank, Package,
  Coffee, Gamepad2, Music, Smartphone, Laptop, Shirt, Plane, Fuel,
  Zap, Wifi, Phone, CreditCard, Building
} from 'lucide-react';

// Updated icon mapping function to handle all available icons
function getIconForCategory(iconName: string) {
  const iconMap: Record<string, any> = {
    'Package': Package,
    'Home': Home,
    'Car': Car,
    'Utensils': Utensils,
    'ShoppingCart': ShoppingCart,
    'HeartPulse': HeartPulse,
    'Ticket': Ticket,
    'GraduationCap': GraduationCap,
    'Gift': Gift,
    'Briefcase': Briefcase,
    'DollarSign': DollarSign,
    'PiggyBank': PiggyBank,
    'Coffee': Coffee,
    'Gamepad2': Gamepad2,
    'Music': Music,
    'Smartphone': Smartphone,
    'Laptop': Laptop,
    'Shirt': Shirt,
    'Plane': Plane,
    'Fuel': Fuel,
    'Zap': Zap,
    'Wifi': Wifi,
    'Phone': Phone,
    'CreditCard': CreditCard,
    'Building': Building,
    'MoreHorizontal': MoreHorizontal,
    // Legacy mappings for backward compatibility
    'housing': Home,
    'transportation': Car,
    'food': Utensils,
    'groceries': ShoppingCart,
    'health': HeartPulse,
    'entertainment': Ticket,
    'education': GraduationCap,
    'personal': Gift,
    'other': MoreHorizontal,
    'salary': Briefcase,
    'freelance': DollarSign,
    'investment': PiggyBank,
    'other-income': MoreHorizontal,
  };
  return iconMap[iconName] || Package;
}

type State = {
  transactions: Transaction[] | null;
  budgets: Budget[] | null;
  expenseCategories: Category[] | null;
  incomeCategories: Category[] | null;
  loading: boolean;
  error: Error | null;
};

const initialState: State = {
  transactions: null,
  budgets: null,
  expenseCategories: null,
  incomeCategories: null,
  loading: true,
  error: null,
};

type AppContextType = {
  state: State;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  addTransaction: (transaction: NewTransaction) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<NewTransaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  addCategory: (category: NewCategory) => Promise<void>;
  removeCategory: (categoryValue: string) => Promise<void>;
};

const AppContext = createContext<AppContextType>({
  state: initialState,
  totalIncome: 0,
  totalExpenses: 0,
  netBalance: 0,
  addTransaction: async () => {},
  updateTransaction: async () => {},
  deleteTransaction: async () => {},
  updateBudget: async () => {},
  addCategory: async () => {},
  removeCategory: async () => {},
});

async function fetchData(endpoint: string) {
  const response = await fetch(`/api/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return response.json();
}

async function postData(endpoint: string, data: any) {
    const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Failed to post to ${endpoint}`);
    }
    return response.json();
}

async function deleteData(endpoint: string) {
    const response = await fetch(`/api/${endpoint}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete ${endpoint}`);
    }
    return response.json();
}


export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);

  const fetchDataFromApi = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const [transactions, budgets, fetchedCategories] = await Promise.all([
        fetchData('transactions'),
        fetchData('budgets'),
        fetchData('categories'),
      ]);
      
      // Separate categories by type and add icons
      const expenseCategories = fetchedCategories
        .filter((c: any) => c.type === 'expense')
        .map((c: any) => ({
          value: c.value,
          label: c.label,
          icon: getIconForCategory(c.icon) // Use the saved icon from database
        }));
        
      const incomeCategories = fetchedCategories
        .filter((c: any) => c.type === 'income')
        .map((c: any) => ({
          value: c.value,
          label: c.label,
          icon: getIconForCategory(c.icon) // Use the saved icon from database
        }));
      
      setState({ 
        transactions, 
        budgets, 
        expenseCategories, 
        incomeCategories, 
        loading: false, 
        error: null 
      });
    } catch (error: any) {
      setState({ ...initialState, loading: false, error });
    }
  }, []);

  useEffect(() => {
    fetchDataFromApi();
  }, [fetchDataFromApi]);

  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    if (!state.transactions) return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    };
  }, [state.transactions]);

  const addTransaction = useCallback(async (transaction: NewTransaction) => {
    const newTransaction = await postData('transactions', transaction);
    setState(s => ({ ...s, transactions: [...(s.transactions || []), newTransaction]}));
  }, []);

  const updateTransaction = useCallback(async (id: string, transaction: Partial<NewTransaction>) => {
    const updatedTransaction = await fetch(`/api/transactions?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    }).then(r => {
      if (!r.ok) throw new Error(`Failed to update transaction`);
      return r.json();
    });
    setState(s => ({
      ...s,
      transactions: (s.transactions || []).map(t => t.id === id ? updatedTransaction : t)
    }));
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    await deleteData(`transactions?id=${id}`);
    setState(s => ({
      ...s,
      transactions: (s.transactions || []).filter(t => t.id !== id)
    }));
  }, []);

  const updateBudget = useCallback(async (budget: Budget) => {
    const updatedBudget = await postData('budgets', budget);
    setState(s => ({ 
        ...s, 
        budgets: (s.budgets || []).map(b => b.category === updatedBudget.category ? updatedBudget : b)
    }));
  }, []);

  const addCategory = useCallback(async (category: NewCategory) => {
    const { newCategory, newBudget } = await postData('categories', category);
    const categoryWithIcon = { 
      ...newCategory, 
      icon: getIconForCategory(newCategory.icon) // Use the saved icon from database
    };
    setState(s => ({
      ...s,
      expenseCategories: [...(s.expenseCategories || []), categoryWithIcon],
      budgets: [...(s.budgets || []), newBudget],
    }));
  }, []);
  
  const removeCategory = useCallback(async (categoryValue: string) => {
    await deleteData(`categories/${categoryValue}`);
    setState(s => ({
        ...s,
        expenseCategories: (s.expenseCategories || []).filter(c => c.value !== categoryValue),
        budgets: (s.budgets || []).filter(b => b.category !== categoryValue),
        transactions: (s.transactions || []).filter(t => t.category !== categoryValue),
    }));
  }, []);

  const value = { 
    state, 
    totalIncome, 
    totalExpenses, 
    netBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    addCategory,
    removeCategory
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

