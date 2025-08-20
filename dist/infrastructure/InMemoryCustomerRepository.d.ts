import { Customer, CustomerRepository } from '../types';
export declare class InMemoryCustomerRepository implements CustomerRepository {
    private customers;
    findById(customerId: string): Customer | undefined;
    save(customer: Customer): void;
    exists(customerId: string): boolean;
    getOrCreate(customerId: string): Customer;
    getAllCustomers(): Customer[];
    clear(): void;
}
