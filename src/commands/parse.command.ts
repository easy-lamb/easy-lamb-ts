import { Command } from 'commander';
import {parseCommand} from '../services/parse.service';
import winston from 'winston';

export function createParseCommand(logger: winston.Logger): Command {
    const command = new Command('parse');

    command
        .description('Parse the functions and create a Terraform variable file')
        .option('-c, --config <path>', 'Easy Lamb TS config file', 'easy-lamb.json')
        .option('-d, --dir <directory>', 'Project directory', '.')
        .action((options) => {
            logger.info(`Parsing with config: ${options.config} in directory: ${options.dir}`);
            try {
                process.chdir(options.dir);
                parseCommand(options.config, options.dir, logger);
                logger.info('Parsing completed successfully!');
            } catch (error) {
                logger.error(`Error during parsing: ${error}`);
                process.exit(1);
            }
        });

    return command;
}
