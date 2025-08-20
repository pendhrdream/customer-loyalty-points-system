import { Customer, CustomerRepository, Logger, OperationResult } from '../types';
export declare class CustomerLoyaltyService {
    private readonly customerRepository;
    private readonly logger;
    private static readonly LOW_BALANCE_THRESHOLD;
    constructor(customerRepository: CustomerRepository, logger: Logger);
    earnPoints(customerId: string, points: number): OperationResult<Customer>;
    redeemPoints(customerId: string, points: number): OperationResult<Customer>;
    getCustomerBalance(customerId: string): OperationResult<number>;
    private validatePointsOperation;
    private getOrCreateCustomer;
}
