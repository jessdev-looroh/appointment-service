import chalk from 'chalk';

export class Logger {
    constructor() {}

    private getTimestamp(): string {
        return chalk.gray(new Date().toISOString());
    }

    private formatContext(context: string): string {
        return chalk.cyan(`[${context}]`);
    }

    log(context: string, message: string) {
        console.log(`${this.getTimestamp()} ${this.formatContext(context)} ${chalk.white('🟣 LOG')} ${message}`);
    }

    info(context: string, message: string) {
        console.info(
            `${this.getTimestamp()} ${this.formatContext(context)} ${chalk.blue('🔵 INFO')} ${chalk.blue(message)}`,
        );
    }

    warn(context: string, message: string) {
        console.warn(
            `${this.getTimestamp()} ${this.formatContext(context)} ${chalk.yellow('🟡 WARN')} ${chalk.yellow(message)}`,
        );
    }

    error(context: string, message: string, trace?: any) {
        console.error(
            `${this.getTimestamp()} ${this.formatContext(context)} ${chalk.red('🔴 ERROR')} ${chalk.red(message)}`,
        );
        if (trace) {
            console.error(chalk.red(trace));
        }
    }

    success(context: string, message: string) {
        console.log(
            `${this.getTimestamp()} ${this.formatContext(context)} ${chalk.green('🟢 SUCCESS')} ${chalk.green(message)}`,
        );
    }
}
