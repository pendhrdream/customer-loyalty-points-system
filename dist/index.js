"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const CustomerLoyaltyService_1 = require("./services/CustomerLoyaltyService");
const InMemoryCustomerRepository_1 = require("./infrastructure/InMemoryCustomerRepository");
const ConsoleLogger_1 = require("./infrastructure/ConsoleLogger");
const CommandLineInterface_1 = require("./cli/CommandLineInterface");
async function main() {
  try {
    const logger = new ConsoleLogger_1.ConsoleLogger();
    const customerRepository =
      new InMemoryCustomerRepository_1.InMemoryCustomerRepository();
    const loyaltyService = new CustomerLoyaltyService_1.CustomerLoyaltyService(
      customerRepository,
      logger
    );
    const cli = new CommandLineInterface_1.CommandLineInterface(
      loyaltyService,
      logger
    );
    const args = process.argv.slice(2);
    const exitCode = await cli.processCommand(args);
    process.exit(exitCode);
  } catch (error) {
    console.error(
      "Fatal error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
}
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
if (require.main === module) {
  main();
}
