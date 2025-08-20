import { Customer, CustomerRepository } from '../types';

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Map<string, Customer> = new Map();

  findById(customerId: string): Customer | undefined {
    return this.customers.get(customerId);
  }

  save(customer: Customer): void {
    this.customers.set(customer.id, { ...customer });
  }

  exists(customerId: string): boolean {
    return this.customers.has(customerId);
  }

  getOrCreate(customerId: string): Customer {
    const existingCustomer = this.findById(customerId);
    if (existingCustomer) {
      return existingCustomer;
    }

    const newCustomer: Customer = {
      id: customerId,
      balance: 0
    };
    
    this.save(newCustomer);
    return newCustomer;
  }

  getAllCustomers(): Customer[] {
    return Array.from(this.customers.values());
  }

  clear(): void {
    this.customers.clear();
  }
}
