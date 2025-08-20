export interface Customer {
    readonly id: string;
    balance: number;
}
export interface PointsTransaction {
    readonly customerId: string;
    readonly points: number;
    readonly type: TransactionType;
    readonly timestamp: Date;
}
export declare enum TransactionType {
    EARN = "EARN",
    REDEEM = "REDEEM"
}
export interface OperationResult<T = void> {
    success: boolean;
    data?: T;
    error?: string | undefined;
    warnings?: string[] | undefined;
}
export interface CustomerRepository {
    findById(customerId: string): Customer | undefined;
    save(customer: Customer): void;
    exists(customerId: string): boolean;
    getOrCreate?(customerId: string): Customer;
}
export interface Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
