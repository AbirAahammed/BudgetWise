import { NextResponse } from 'next/server';
import { NewTransaction } from '@/lib/types';
import mongoService from '@/lib/mongodb';

export async function GET() {
  try {
    const transactions = await mongoService.getTransactions();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Error fetching transactions', error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newTransactionData: NewTransaction = await request.json();
    const newTransaction = await mongoService.createTransaction(newTransactionData);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json({ message: 'Error adding transaction', error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: 'Transaction ID is required' }, { status: 400 });
    }
    
    const deleted = await mongoService.deleteTransaction(id);
    
    if (!deleted) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ message: 'Error deleting transaction', error }, { status: 500 });
  }
}
