// MongoDB initialization script for BudgetWise application
print('Initializing BudgetWise database...');

// Switch to the budgetwise database
db = db.getSiblingDB('budgetwise');

// Create collections for the budget application
db.createCollection('users');
db.createCollection('budgets');
db.createCollection('transactions');
db.createCollection('categories');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.budgets.createIndex({ "category": 1 });
db.transactions.createIndex({ "category": 1 });
db.transactions.createIndex({ "date": -1 });
db.categories.createIndex({ "value": 1 }, { unique: true });

print('BudgetWise database initialization completed successfully!');
print('Collections created: users, budgets, transactions, categories');
print('Default data will be inserted by the Node.js application on first run.');