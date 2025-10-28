import { NextResponse } from 'next/server';
import mongoService from '@/lib/mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { value: string } }
) {
  try {
    const categoryValue = params.value;

    // Delete the category from MongoDB
    const deleted = await mongoService.deleteCategory(categoryValue);
    
    if (!deleted) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Also delete associated budget and transactions
    await mongoService.deleteBudget(categoryValue);
    
    // Note: For transactions, we might want to keep them but mark them as uncategorized
    // instead of deleting them entirely. For now, we'll keep them as they are.

    return NextResponse.json({ message: `Category "${categoryValue}" deleted successfully` });
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error instanceof Error && error.message === 'Cannot delete default category') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error deleting category', error }, { status: 500 });
  }
}
