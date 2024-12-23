import { Command } from 'commander';
import {buildCommand} from '../services/build.service';
import winston from 'winston';

export function createBuildCommand(logger: winston.Logger): Command {
    const command = new Command('build');

    command
        .description('Build the functions and create a Terraform variable file')
        .option('-c, --config <path>', 'Easy Lamb TS config file', 'easy-lamb.json')
        .option('-d, --dir <directory>', 'Project directory', '.')
        .option('-n, --with-parsing', 'Generate the Terraform file during build', true)
        .action(async (options) => {
            logger.info(`Building with config: ${options.config} in directory: ${options.dir}`);
            try {
                process.chdir(options.dir);
                await buildCommand(options.config, options.dir, options.withParsing, logger);
                logger.info('Build completed successfully!');
            } catch (error) {
                logger.error(`Error during build: ${error}`);
                process.exit(1);
            }
        });

    return command;
}
