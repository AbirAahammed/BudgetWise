import { NextResponse } from 'next/server';
import { Budget } from '@/lib/types';
import mongoService from '@/lib/mongodb';

export async function GET() {
  try {
    const budgets = await mongoService.getBudgets();
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ message: 'Error fetching budgets', error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const budgetData: Budget = await request.json();
    const budget = await mongoService.upsertBudget(budgetData);
    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ message: 'Error updating budget', error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }
    
    const deleted = await mongoService.deleteBudget(category);
    
    if (!deleted) {
      return NextResponse.json({ message: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Budget deleted' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ message: 'Error deleting budget', error }, { status: 500 });
  }
}
