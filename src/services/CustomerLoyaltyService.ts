import { Customer, CustomerRepository, Logger, OperationResult, TransactionType } from '../types';

export class CustomerLoyaltyService {
  private static readonly LOW_BALANCE_THRESHOLD = 10;

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  earnPoints(customerId: string, points: number): OperationResult<Customer> {
    try {
      const validationResult = this.validatePointsOperation(customerId, points, TransactionType.EARN);
      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error
        };
      }

      const customer = this.customerRepository.getOrCreate?.(customerId) ?? 
        this.getOrCreateCustomer(customerId);

      const updatedCustomer: Customer = {
        ...customer,
        balance: customer.balance + points
      };

      this.customerRepository.save(updatedCustomer);

      this.logger.info(`Customer ${customerId} earned ${points} points. New balance: ${updatedCustomer.balance}`);

      return {
        success: true,
        data: updatedCustomer
      };
    } catch (error) {
      const errorMessage = `Failed to earn points for customer ${customerId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  redeemPoints(customerId: string, points: number): OperationResult<Customer> {
    try {
      const validationResult = this.validatePointsOperation(customerId, points, TransactionType.REDEEM);
      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error
        };
      }

      const customer = this.customerRepository.findById(customerId);
      if (!customer) {
        const errorMessage = `Customer ${customerId} not found`;
        this.logger.error(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }

      if (customer.balance < points) {
        const errorMessage = `Insufficient balance. Customer ${customerId} has ${customer.balance} points but tried to redeem ${points} points`;
        this.logger.error(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }

      const newBalance = customer.balance - points;
      const updatedCustomer: Customer = {
        ...customer,
        balance: newBalance
      };

      this.customerRepository.save(updatedCustomer);

      const warnings: string[] = [];
      if (newBalance < CustomerLoyaltyService.LOW_BALANCE_THRESHOLD) {
        const warningMessage = `Warning: Customer ${customerId} has a low balance: ${newBalance} points`;
        this.logger.warn(warningMessage);
        warnings.push(warningMessage);
      }

      this.logger.info(`Customer ${customerId} redeemed ${points} points. New balance: ${newBalance}`);

      return {
        success: true,
        data: updatedCustomer,
        warnings: warnings.length > 0 ? warnings : undefined
      };
    } catch (error) {
      const errorMessage = `Failed to redeem points for customer ${customerId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  getCustomerBalance(customerId: string): OperationResult<number> {
    try {
      if (!customerId || customerId.trim() === '') {
        return {
          success: false,
          error: 'Customer ID cannot be empty'
        };
      }

      const customer = this.customerRepository.findById(customerId);
      if (!customer) {
        return {
          success: false,
          error: `Customer ${customerId} not found`
        };
      }

      return {
        success: true,
        data: customer.balance
      };
    } catch (error) {
      const errorMessage = `Failed to get balance for customer ${customerId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private validatePointsOperation(customerId: string, points: number, _operation: TransactionType): OperationResult {
    if (!customerId || customerId.trim() === '') {
      return {
        success: false,
        error: 'Customer ID cannot be empty'
      };
    }

    if (!Number.isInteger(points) || points <= 0) {
      return {
        success: false,
        error: 'Points must be a positive integer'
      };
    }

    if (points > Number.MAX_SAFE_INTEGER) {
      return {
        success: false,
        error: 'Points value is too large'
      };
    }

    return { success: true };
  }

  private getOrCreateCustomer(customerId: string): Customer {
    const existingCustomer = this.customerRepository.findById(customerId);
    if (existingCustomer) {
      return existingCustomer;
    }

    const newCustomer: Customer = {
      id: customerId,
      balance: 0
    };
    
    this.customerRepository.save(newCustomer);
    return newCustomer;
  }
}
