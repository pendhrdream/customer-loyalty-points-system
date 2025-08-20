import { CustomerLoyaltyService } from './services/CustomerLoyaltyService';
import { InMemoryCustomerRepository } from './infrastructure/InMemoryCustomerRepository';
import { ConsoleLogger } from './infrastructure/ConsoleLogger';
import { CommandLineInterface } from './cli/CommandLineInterface';

async function main(): Promise<void> {
  try {
    const logger = new ConsoleLogger();
    const customerRepository = new InMemoryCustomerRepository();
    const loyaltyService = new CustomerLoyaltyService(customerRepository, logger);
    const cli = new CommandLineInterface(loyaltyService, logger);
    const args = process.argv.slice(2);

    const exitCode = await cli.processCommand(args);
    
    process.exit(exitCode);
  } catch (error) {
    console.error('Fatal error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

if (require.main === module) {
  main();
}

export { main };
