import {Command} from 'commander';
import {createBuildCommand} from './commands/build.command';
import {createParseCommand} from './commands/parse.command';
import winston from 'winston';

const program = new Command();
const logLevel = 'debug';

// Configure logging
const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
});

// Root command
program
    .name('easy-lamb-ts')
    .description('Easy Lambda TS is a CLI tool to build and parse AWS Lambda TypeScript functions')
    .version('1.0.0');

// Add subcommands
program.addCommand(createBuildCommand(logger));
program.addCommand(createParseCommand(logger));

// Execute CLI
program.parse(process.argv);
