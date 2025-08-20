import { CustomerLoyaltyService } from '../services/CustomerLoyaltyService';
import { Logger } from '../types';


export class CommandLineInterface {
  constructor(
    private readonly loyaltyService: CustomerLoyaltyService,
    private readonly logger: Logger
  ) {}


  async processCommand(args: string[]): Promise<number> {
    try {
      if (args.length < 2) {
        this.showUsage();
        return 1;
      }

      const command = args[0];
      const customerId = args[1];
      const pointsStr = args[2];

      if (!command || !this.isValidCommand(command)) {
        this.logger.error(`Invalid command: ${command || 'missing'}`);
        this.showUsage();
        return 1;
      }

      if (!customerId || customerId.trim() === '') {
        this.logger.error('Customer ID is required');
        this.showUsage();
        return 1;
      }

      if (!pointsStr) {
        this.logger.error('Points value is required');
        this.showUsage();
        return 1;
      }

      const points = this.parsePoints(pointsStr);
      if (points === null) {
        this.logger.error(`Invalid points value: ${pointsStr}. Points must be a positive integer.`);
        return 1;
      }

      return await this.executeCommand(command, customerId, points);
    } catch (error) {
      this.logger.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return 1;
    }
  }


  private async executeCommand(command: string, customerId: string, points: number): Promise<number> {
    switch (command.toLowerCase()) {
      case 'earn':
        return this.handleEarnCommand(customerId, points);
      case 'redeem':
        return this.handleRedeemCommand(customerId, points);
      default:
        this.logger.error(`Unknown command: ${command}`);
        this.showUsage();
        return 1;
    }
  }


  private handleEarnCommand(customerId: string, points: number): number {
    const result = this.loyaltyService.earnPoints(customerId, points);
    
    if (result.success && result.data) {
      (this.logger as any).success?.(`Successfully earned ${points} points for customer ${customerId}. New balance: ${result.data.balance}`);
      return 0;
    } else {
      this.logger.error(result.error ?? 'Failed to earn points');
      return 1;
    }
  }


  private handleRedeemCommand(customerId: string, points: number): number {
    const result = this.loyaltyService.redeemPoints(customerId, points);
    
    if (result.success && result.data) {
      (this.logger as any).success?.(`Successfully redeemed ${points} points for customer ${customerId}. New balance: ${result.data.balance}`);
      

      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => this.logger.warn(warning));
      }
      
      return 0;
    } else {
      this.logger.error(result.error ?? 'Failed to redeem points');
      return 1;
    }
  }


  private isValidCommand(command: string): boolean {
    const validCommands = ['earn', 'redeem'];
    return validCommands.includes(command.toLowerCase());
  }


  private parsePoints(pointsStr: string): number | null {
    const trimmed = pointsStr.trim();
    
    if (!/^\d+$/.test(trimmed)) {
      return null;
    }

    const points = parseInt(trimmed, 10);
    
    if (isNaN(points) || points <= 0 || points > Number.MAX_SAFE_INTEGER) {
      return null;
    }

    return points;
  }


  private showUsage(): void {
    console.log('\nUsage:');
    console.log('  npm run dev earn <customerId> <points>    - Add points to customer balance');
    console.log('  npm run dev redeem <customerId> <points>  - Redeem points from customer balance');
    console.log('\nExamples:');
    console.log('  npm run dev earn "user123" 100');
    console.log('  npm run dev redeem "user123" 50');
    console.log('\nAlternatively, after building:');
    console.log('  npm start earn "user123" 100');
    console.log('  npm start redeem "user123" 50');
  }
}
