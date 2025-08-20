import { CustomerLoyaltyService } from '../services/CustomerLoyaltyService';
import { Logger } from '../types';
export declare class CommandLineInterface {
    private readonly loyaltyService;
    private readonly logger;
    constructor(loyaltyService: CustomerLoyaltyService, logger: Logger);
    processCommand(args: string[]): Promise<number>;
    private executeCommand;
    private handleEarnCommand;
    private handleRedeemCommand;
    private isValidCommand;
    private parsePoints;
    private showUsage;
}
