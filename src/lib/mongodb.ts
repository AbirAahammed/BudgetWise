import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { Transaction, Budget, Category } from '@/lib/types';

interface DatabaseTransaction {
  _id?: ObjectId;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DatabaseBudget {
  _id?: ObjectId;
  category: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DatabaseCategory {
  _id?: ObjectId;
  value: string;
  label: string;
  icon: string;
  type: 'expense' | 'income';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://budgetwise:budgetwise_password@localhost:27017/budgetwise?authSource=admin';
      
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db('budgetwise');
      this.isConnected = true;
      
      console.log('✅ Connected to MongoDB');
      
      // Initialize database if empty
      await this.initializeDatabase();
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      this.isConnected = false;
    }
  }

  private async ensureConnection() {
    if (!this.isConnected || !this.db) {
      await this.connect();
    }
  }

  private async initializeDatabase() {
    if (!this.db) return;

    try {
      // Ensure indexes exist
      await this.db.collection('categories').createIndex({ value: 1 }, { unique: true });
      await this.db.collection('budgets').createIndex({ category: 1 }, { unique: true });
      
      // Check if categories collection exists and has data
      const categoriesCount = await this.db.collection('categories').countDocuments();
      
      if (categoriesCount === 0) {
        console.log('🔄 Initializing default categories...');
        
        // Insert default categories
        const defaultCategories: DatabaseCategory[] = [
          {
            value: 'housing',
            label: 'Housing',
            icon: 'Home',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'transportation',
            label: 'Transportation',
            icon: 'Car',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'food',
            label: 'Food',
            icon: 'Utensils',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'groceries',
            label: 'Groceries',
            icon: 'ShoppingCart',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'health',
            label: 'Health',
            icon: 'HeartPulse',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'entertainment',
            label: 'Entertainment',
            icon: 'Ticket',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'education',
            label: 'Education',
            icon: 'GraduationCap',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'personal',
            label: 'Personal Care',
            icon: 'Gift',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'other',
            label: 'Other',
            icon: 'MoreHorizontal',
            type: 'expense',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'salary',
            label: 'Salary',
            icon: 'Briefcase',
            type: 'income',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            value: 'other-income',
            label: 'Other Income',
            icon: 'MoreHorizontal',
            type: 'income',
            isDefault: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        await this.db.collection('categories').insertMany(defaultCategories);
        console.log('✅ Default categories inserted');

        // Insert default budgets
        console.log('🔄 Initializing default budgets...');
        const defaultBudgets: DatabaseBudget[] = [
          { category: 'housing', amount: 1600, createdAt: new Date(), updatedAt: new Date() },
          { category: 'transportation', amount: 200, createdAt: new Date(), updatedAt: new Date() },
          { category: 'food', amount: 400, createdAt: new Date(), updatedAt: new Date() },
          { category: 'groceries', amount: 500, createdAt: new Date(), updatedAt: new Date() },
          { category: 'health', amount: 150, createdAt: new Date(), updatedAt: new Date() },
          { category: 'entertainment', amount: 200, createdAt: new Date(), updatedAt: new Date() },
          { category: 'education', amount: 250, createdAt: new Date(), updatedAt: new Date() },
          { category: 'personal', amount: 150, createdAt: new Date(), updatedAt: new Date() },
          { category: 'other', amount: 100, createdAt: new Date(), updatedAt: new Date() }
        ];

        await this.db.collection('budgets').insertMany(defaultBudgets);
        console.log('✅ Default budgets inserted');

      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
    }
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    await this.ensureConnection();
    const transactions = await this.db!.collection('transactions').find({}).toArray();
    return transactions.map(doc => ({
      id: doc._id.toString(),
      type: doc.type,
      category: doc.category,
      amount: doc.amount,
      date: doc.date,
      name: doc.name,
      description: doc.description
    }));
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    await this.ensureConnection();
    const doc: DatabaseTransaction = {
      ...transaction,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await this.db!.collection('transactions').insertOne(doc);
    return {
      id: result.insertedId.toString(),
      ...transaction
    };
  }

  async deleteTransaction(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await this.db!.collection('transactions').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    await this.ensureConnection();
    const budgets = await this.db!.collection('budgets').find({}).toArray();
    return budgets.map(doc => ({
      category: doc.category,
      amount: doc.amount
    }));
  }

  async upsertBudget(budget: Budget): Promise<Budget> {
    await this.ensureConnection();
    const doc = {
      ...budget,
      updatedAt: new Date()
    };
    await this.db!.collection('budgets').updateOne(
      { category: budget.category },
      { $set: doc, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    return budget;
  }

  async deleteBudget(category: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await this.db!.collection('budgets').deleteOne({ category });
    return result.deletedCount > 0;
  }

  // Categories
  async getCategories(): Promise<(Omit<Category, 'icon'> & { icon: string; type: 'income' | 'expense' })[]> {
    await this.ensureConnection();
    const categories = await this.db!.collection('categories').find({}).toArray();
    return categories.map(doc => ({
      value: doc.value,
      label: doc.label,
      icon: doc.icon,
      type: doc.type
    }));
  }

  async createCategory(category: Omit<Category, 'icon'> & { icon: string }): Promise<Omit<Category, 'icon'> & { icon: string }> {
    await this.ensureConnection();
    
    // Check if category already exists
    const existingCategory = await this.db!.collection('categories').findOne({ value: category.value });
    if (existingCategory) {
      throw new Error(`Category with value '${category.value}' already exists`);
    }
    
    const doc: DatabaseCategory = {
      ...category,
      type: 'expense',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      await this.db!.collection('categories').insertOne(doc);
      return category;
    } catch (error: any) {
      if (error.code === 11000) { // Duplicate key error
        throw new Error(`Category with value '${category.value}' already exists`);
      }
      throw error;
    }
  }

  async deleteCategory(value: string): Promise<boolean> {
    await this.ensureConnection();
    // Don't allow deletion of default categories
    const category = await this.db!.collection('categories').findOne({ value });
    if (category && category.isDefault) {
      throw new Error('Cannot delete default category');
    }
    
    const result = await this.db!.collection('categories').deleteOne({ value });
    return result.deletedCount > 0;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 MongoDB connection closed');
    }
  }
}

// Create a singleton instance
const mongoService = new MongoDBService();

export default mongoService;