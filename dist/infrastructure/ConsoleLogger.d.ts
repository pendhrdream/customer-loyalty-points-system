import { Logger } from '../types';
export declare class ConsoleLogger implements Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    success(message: string): void;
}
