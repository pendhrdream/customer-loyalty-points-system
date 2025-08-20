# Customer Loyalty Points System

A robust, command-line-based application for managing customer loyalty points, built with TypeScript following enterprise-level best practices.

## Features

- **Earn Points**: Add points to customer accounts
- **Redeem Points**: Deduct points from customer accounts with validation
- **Low Balance Warnings**: Automatic warnings when balance drops below 10 points
- **Input Validation**: Comprehensive validation for all operations
- **Error Handling**: Robust error handling with detailed logging
- **In-Memory Storage**: Fast, session-based data storage
- **Type Safety**: Full TypeScript implementation with strict type checking

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode

```bash
# Earn points for a customer
npm run dev earn "user123" 100

# Redeem points from a customer
npm run dev redeem "user123" 50
```

### Production Mode

```bash
# Build the application
npm run build

# Run the built application
npm start earn "user123" 100
npm start redeem "user123" 50
```

## Commands

### Earn Points

```bash
npm run dev earn <customerId> <points>
```

- **customerId**: String identifier for the customer
- **points**: Positive integer number of points to add

**Example:**

```bash
npm run dev earn "user123" 100
```

### Redeem Points

```bash
npm run dev redeem <customerId> <points>
```

- **customerId**: String identifier for the customer
- **points**: Positive integer number of points to redeem

**Example:**

```bash
npm run dev redeem "user123" 50
```

## Business Rules

1. **Customer Creation**: Customers are automatically created when they first earn points
2. **Insufficient Balance**: Customers cannot redeem more points than they have
3. **Low Balance Warning**: Warning displayed when balance drops below 10 points
4. **Data Persistence**: Data persists only during application runtime (in-memory storage)

## Architecture

The application follows clean architecture principles with clear separation of concerns:

```
src/
├── types/                 # Domain types and interfaces
├── infrastructure/        # External concerns (storage, logging)
├── services/             # Business logic
├── cli/                  # Command-line interface
└── index.ts              # Application entry point
```

### Key Components

- **CustomerLoyaltyService**: Core business logic for points management
- **InMemoryCustomerRepository**: In-memory data storage implementation
- **ConsoleLogger**: Colored console logging with different log levels
- **CommandLineInterface**: Command parsing and execution

## Development

### Available Scripts

```bash
npm run build      # Compile TypeScript to JavaScript
npm run dev        # Run in development mode with ts-node
npm start          # Run the compiled application
npm test           # Run the test suite
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm run clean      # Remove build artifacts
```

### Testing

The application includes comprehensive unit tests covering:

- Business logic validation
- Error handling scenarios
- Edge cases and boundary conditions
- Logging behavior

Run tests with:

```bash
npm test
```

### Code Quality

The project enforces high code quality standards through:

- **TypeScript**: Strict type checking with advanced compiler options
- **ESLint**: Code linting with TypeScript-specific rules
- **Jest**: Comprehensive test coverage
- **Clean Architecture**: Separation of concerns and dependency inversion

## Examples

### Successful Operations

```bash
# Add 100 points to user123
$ npm run dev earn "user123" 100
✓ Successfully earned 100 points for customer user123. New balance: 100

# Redeem 30 points from user123
$ npm run dev redeem "user123" 30
✓ Successfully redeemed 30 points for customer user123. New balance: 70
```

### Low Balance Warning

```bash
# Redeem points that result in low balance
$ npm run dev redeem "user123" 65
✓ Successfully redeemed 65 points for customer user123. New balance: 5
⚠ Warning: Customer user123 has a low balance: 5 points
```

### Error Scenarios

```bash
# Insufficient balance
$ npm run dev redeem "user123" 200
✗ Insufficient balance. Customer user123 has 5 points but tried to redeem 200 points

# Invalid points value
$ npm run dev earn "user123" -10
✗ Points must be a positive integer

# Missing customer ID
$ npm run dev earn "" 100
✗ Customer ID cannot be empty
```
