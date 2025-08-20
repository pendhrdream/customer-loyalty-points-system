"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCustomerRepository = void 0;
class InMemoryCustomerRepository {
  constructor() {
    this.customers = new Map();
  }
  findById(customerId) {
    return this.customers.get(customerId);
  }
  save(customer) {
    this.customers.set(customer.id, { ...customer });
  }
  exists(customerId) {
    return this.customers.has(customerId);
  }
  getOrCreate(customerId) {
    const existingCustomer = this.findById(customerId);
    if (existingCustomer) {
      return existingCustomer;
    }
    const newCustomer = {
      id: customerId,
      balance: 0,
    };
    this.save(newCustomer);
    return newCustomer;
  }
  getAllCustomers() {
    return Array.from(this.customers.values());
  }
  clear() {
    this.customers.clear();
  }
}
exports.InMemoryCustomerRepository = InMemoryCustomerRepository;
