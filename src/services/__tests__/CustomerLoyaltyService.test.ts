import { CustomerLoyaltyService } from '../CustomerLoyaltyService';
import { InMemoryCustomerRepository } from '../../infrastructure/InMemoryCustomerRepository';
import { Logger } from '../../types';

class MockLogger implements Logger {
  public logs: { level: string; message: string }[] = [];

  info(message: string): void {
    this.logs.push({ level: 'info', message });
  }

  warn(message: string): void {
    this.logs.push({ level: 'warn', message });
  }

  error(message: string): void {
    this.logs.push({ level: 'error', message });
  }

  clear(): void {
    this.logs = [];
  }
}

describe('CustomerLoyaltyService', () => {
  let service: CustomerLoyaltyService;
  let repository: InMemoryCustomerRepository;
  let logger: MockLogger;

  beforeEach(() => {
    repository = new InMemoryCustomerRepository();
    logger = new MockLogger();
    service = new CustomerLoyaltyService(repository, logger);
  });

  describe('earnPoints', () => {
    it('should successfully add points to a new customer', () => {
      const result = service.earnPoints('user123', 100);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.balance).toBe(100);
      expect(result.error).toBeUndefined();
    });

    it('should successfully add points to an existing customer', () => {
      service.earnPoints('user123', 50);
      
      const result = service.earnPoints('user123', 30);

      expect(result.success).toBe(true);
      expect(result.data?.balance).toBe(80);
    });

    it('should reject empty customer ID', () => {
      const result = service.earnPoints('', 100);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Customer ID cannot be empty');
    });

    it('should reject whitespace-only customer ID', () => {
      const result = service.earnPoints('   ', 100);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Customer ID cannot be empty');
    });

    it('should reject zero points', () => {
      const result = service.earnPoints('user123', 0);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Points must be a positive integer');
    });

    it('should reject negative points', () => {
      const result = service.earnPoints('user123', -10);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Points must be a positive integer');
    });

    it('should reject non-integer points', () => {
      const result = service.earnPoints('user123', 10.5);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Points must be a positive integer');
    });

    it('should log successful operations', () => {
      service.earnPoints('user123', 100);

      expect(logger.logs).toHaveLength(1);
      expect(logger.logs[0]!.level).toBe('info');
      expect(logger.logs[0]!.message).toContain('Customer user123 earned 100 points');
    });
  });

  describe('redeemPoints', () => {
    beforeEach(() => {
      service.earnPoints('user123', 100);
      logger.clear();
    });

    it('should successfully redeem points from customer balance', () => {
      const result = service.redeemPoints('user123', 50);

      expect(result.success).toBe(true);
      expect(result.data?.balance).toBe(50);
      expect(result.warnings).toBeUndefined();
    });

    it('should trigger low balance warning when balance drops below 10', () => {
      const result = service.redeemPoints('user123', 95);

      expect(result.success).toBe(true);
      expect(result.data?.balance).toBe(5);
      expect(result.warnings).toBeDefined();
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings?.[0]).toContain('Warning: Customer user123 has a low balance: 5 points');
    });

    it('should not trigger warning when balance is exactly 10', () => {
      const result = service.redeemPoints('user123', 90);

      expect(result.success).toBe(true);
      expect(result.data?.balance).toBe(10);
      expect(result.warnings).toBeUndefined();
    });

    it('should reject redemption when customer has insufficient balance', () => {
      const result = service.redeemPoints('user123', 150);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient balance');
      expect(result.error).toContain('has 100 points but tried to redeem 150 points');
    });

    it('should not modify balance when redemption fails', () => {
      service.redeemPoints('user123', 150);
      
      const customer = repository.findById('user123');
      expect(customer?.balance).toBe(100);
    });

    it('should reject redemption for non-existent customer', () => {
      const result = service.redeemPoints('nonexistent', 50);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Customer nonexistent not found');
    });

    it('should reject empty customer ID', () => {
      const result = service.redeemPoints('', 50);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Customer ID cannot be empty');
    });

    it('should reject zero points', () => {
      const result = service.redeemPoints('user123', 0);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Points must be a positive integer');
    });

    it('should log successful operations', () => {
      service.redeemPoints('user123', 30);

      const infoLogs = logger.logs.filter(log => log.level === 'info');
      expect(infoLogs).toHaveLength(1);
      expect(infoLogs[0]!.message).toContain('Customer user123 redeemed 30 points');
    });

    it('should log warnings for low balance', () => {
      service.redeemPoints('user123', 95);

      const warnLogs = logger.logs.filter(log => log.level === 'warn');
      expect(warnLogs).toHaveLength(1);
      expect(warnLogs[0]!.message).toContain('Warning: Customer user123 has a low balance: 5 points');
    });
  });

  describe('getCustomerBalance', () => {
    it('should return balance for existing customer', () => {
      service.earnPoints('user123', 75);
      
      const result = service.getCustomerBalance('user123');

      expect(result.success).toBe(true);
      expect(result.data).toBe(75);
    });

    it('should return error for non-existent customer', () => {
      const result = service.getCustomerBalance('nonexistent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Customer nonexistent not found');
    });

    it('should reject empty customer ID', () => {
      const result = service.getCustomerBalance('');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Customer ID cannot be empty');
    });
  });

  describe('edge cases', () => {
    it('should handle very large point values within safe integer range', () => {
      const largePoints = Number.MAX_SAFE_INTEGER - 1;
      const result = service.earnPoints('user123', largePoints);

      expect(result.success).toBe(true);
      expect(result.data?.balance).toBe(largePoints);
    });

    it('should reject points larger than MAX_SAFE_INTEGER', () => {
      const tooLargePoints = Number.MAX_SAFE_INTEGER + 1;
      const result = service.earnPoints('user123', tooLargePoints);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Points value is too large');
    });

    it('should handle customer IDs with special characters', () => {
      const specialId = 'user@123.com';
      const result = service.earnPoints(specialId, 50);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(specialId);
    });

    it('should handle customer IDs with spaces', () => {
      const idWithSpaces = 'user 123';
      const result = service.earnPoints(idWithSpaces, 50);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(idWithSpaces);
    });
  });
});
