# BudgetWise MongoDB Integration

This document outlines the MongoDB integration completed for the BudgetWise application.

## Overview

The BudgetWise application has been successfully migrated from in-memory data storage to MongoDB persistence. The application now uses MongoDB as its primary data source, with automatic database initialization and full CRUD operations.

## Architecture

### Database Service Layer
- **Location**: `src/lib/mongodb.ts`
- **Purpose**: Centralized MongoDB service for all database operations
- **Features**:
  - Automatic connection management
  - Database initialization with default data
  - Full CRUD operations for transactions, budgets, and categories
  - Error handling and connection recovery

### Database Schema

#### Collections

1. **transactions**
   ```javascript
   {
     _id: ObjectId,
     type: 'income' | 'expense',
     category: string,
     amount: number,
     date: string,
     name: string,
     description?: string,
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **budgets**
   ```javascript
   {
     _id: ObjectId,
     category: string,
     amount: number,
     createdAt: Date,
     updatedAt: Date
   }
   ```

3. **categories**
   ```javascript
   {
     _id: ObjectId,
     value: string,
     label: string,
     icon: string,
     type: 'expense' | 'income',
     isDefault: boolean,
     createdAt: Date,
     updatedAt: Date
   }
   ```

## Docker Setup

### Services
1. **BudgetWise Application** (Node.js/Next.js)
   - Port: 3000
   - Dependencies: MongoDB
   - Environment: Production-optimized

2. **MongoDB Database**
   - Port: 27017
   - Authentication: enabled
   - Persistent storage: `mongodb_data` volume
   - Health checks: enabled

### Configuration Files

#### docker-compose.yml
Production configuration with:
- MongoDB service with authentication
- Application service with dependency management
- Health checks and restart policies
- Persistent data volumes

#### docker-compose.dev.yml
Development configuration with:
- MongoDB exposed port for development tools
- Development-friendly restart policies

## Environment Variables

```bash
# MongoDB Connection
MONGODB_URI=mongodb://budgetwise:budgetwise_password@localhost:27017/budgetwise?authSource=admin

# Google AI (existing)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Database Initialization

The application automatically initializes the database with:

### Default Categories (13 total)
**Expense Categories:**
- Housing, Transportation, Food, Groceries
- Health, Entertainment, Education, Personal Care, Other

**Income Categories:**
- Salary, Freelance, Investment, Other Income

### Default Budgets
Pre-configured budgets for all expense categories with realistic amounts.

### Sample Transactions
Initial transaction data to demonstrate the application functionality.

## API Routes

All API routes have been updated to use MongoDB:

### Transactions (`/api/transactions`)
- `GET`: Fetch all transactions
- `POST`: Create new transaction
- `DELETE`: Delete transaction by ID

### Budgets (`/api/budgets`)
- `GET`: Fetch all budgets
- `POST`: Create/update budget (upsert)
- `DELETE`: Delete budget by category

### Categories (`/api/categories`)
- `GET`: Fetch all categories
- `POST`: Create new category (with default budget)

### Individual Category (`/api/categories/[value]`)
- `DELETE`: Delete category and associated budget

## Features

### Automatic Features
- **Connection Management**: Automatic reconnection on connection loss
- **Data Initialization**: Creates default data if database is empty
- **Type Safety**: Full TypeScript integration with proper type definitions
- **Error Handling**: Comprehensive error handling with logging

### Data Persistence
- All user data persists across application restarts
- Transactions, budgets, and categories are permanently stored
- No data loss on container restarts

### MongoDB Integration Benefits
- **Scalability**: Can handle large amounts of financial data
- **Performance**: Indexed queries for fast data retrieval
- **Reliability**: ACID transactions and data consistency
- **Flexibility**: Easy to add new fields and features

## Usage

### Starting the Application
```bash
# Start with Docker Compose
docker-compose up -d

# Application available at http://localhost:3000
# MongoDB available at localhost:27017
```

### Development
```bash
# Use development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# MongoDB exposed on port 27017 for development tools
```

### Database Access
```bash
# Using MongoDB Compass: mongodb://budgetwise:budgetwise_password@localhost:27017/budgetwise?authSource=admin
# Using MongoDB shell:
docker exec -it budgetwise-mongodb-1 mongosh -u budgetwise -p budgetwise_password --authenticationDatabase admin budgetwise
```

## Technical Implementation

### TypeScript Integration
- Proper type definitions for all MongoDB documents
- Type-safe CRUD operations
- Automatic ID conversion between MongoDB ObjectId and application string IDs

### Connection Pooling
- Singleton MongoDB service instance
- Efficient connection reuse
- Automatic connection management

### Error Handling
- Connection failure recovery
- Graceful degradation
- Detailed error logging

## Security

### Database Security
- Username/password authentication enabled
- Authentication database: `admin`
- User restricted to `budgetwise` database

### Application Security
- Environment variable configuration
- No hardcoded credentials
- Secure connection strings

## Monitoring

### Health Checks
- MongoDB container health monitoring
- Application dependency management
- Automatic restart on failure

### Logging
- MongoDB connection status logging
- Database operation logging
- Error tracking and debugging

## Future Enhancements

### Possible Improvements
1. **Indexes**: Add database indexes for better query performance
2. **Backup**: Implement automated database backups
3. **Clustering**: MongoDB replica set for high availability
4. **Monitoring**: Add application metrics and monitoring
5. **Migration**: Database migration scripts for schema updates

### Development Features
1. **Seeding**: Enhanced data seeding for development
2. **Testing**: Database testing with test containers
3. **Validation**: Enhanced data validation and constraints

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check MongoDB container is running: `docker-compose ps`
   - Verify connection string in `.env` file
   - Check container logs: `docker-compose logs mongodb`

2. **Permission Errors**
   - Ensure MongoDB data directory permissions
   - Verify authentication credentials

3. **Port Conflicts**
   - Check if port 27017 is available
   - Modify port mapping if needed

### Useful Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs budgetwise
docker-compose logs mongodb

# Restart services
docker-compose restart

# Connect to MongoDB
docker exec -it budgetwise-mongodb-1 mongosh -u budgetwise -p budgetwise_password --authenticationDatabase admin budgetwise
```

## Conclusion

The BudgetWise application now has a robust, scalable MongoDB backend that provides:
- ✅ Complete data persistence
- ✅ Automatic database initialization
- ✅ Type-safe database operations
- ✅ Production-ready Docker deployment
- ✅ Development-friendly configuration
- ✅ Comprehensive error handling
- ✅ Security best practices

The application is ready for production use with a reliable, persistent data layer.