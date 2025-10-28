import { NextResponse } from 'next/server';
import { NewCategory } from '@/lib/types';
import mongoService from '@/lib/mongodb';

export async function GET() {
  try {
    const categories = await mongoService.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Error fetching categories', error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newCategoryData: NewCategory = await request.json();

    // Basic validation
    if (!newCategoryData.value || !newCategoryData.label) {
      return NextResponse.json({ message: 'Invalid category data' }, { status: 400 });
    }

    // Use the icon from the request, fallback to 'Package' if not provided
    const categoryWithIcon = {
      ...newCategoryData,
      icon: newCategoryData.icon || 'Package'
    };

    const newCategory = await mongoService.createCategory(categoryWithIcon);
    
    // Also create a default budget for this category
    const newBudget = {
      category: newCategory.value,
      amount: 0,
    };
    
    await mongoService.upsertBudget(newBudget);

    return NextResponse.json({ newCategory, newBudget }, { status: 201 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ message: 'Error adding category', error }, { status: 500 });
  }
}
