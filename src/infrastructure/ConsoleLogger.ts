import chalk from 'chalk';
import { Logger } from '../types';

export class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  warn(message: string): void {
    console.log(chalk.yellow('⚠'), chalk.yellow(message));
  }

  error(message: string): void {
    console.log(chalk.red('✗'), chalk.red(message));
  }

  success(message: string): void {
    console.log(chalk.green('✓'), chalk.green(message));
  }
}
