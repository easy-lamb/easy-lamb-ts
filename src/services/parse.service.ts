import winston from 'winston';
import {getConfig} from "./config.service";
import {listFiles} from "./file.service";
import {CommentResult, parseComment} from "./comment.service";
import {Config} from "../models/config.model";
import {writeTerraformFile} from "./terraform.service";

export type ParseFileResult = {
    config: Config,
    results: CommentResult[]
};

export function parseCommand(configPath: string, directory: string, logger: winston.Logger): void {
    logger.info(`Starting parse with config: ${configPath} in directory: ${directory}`);

    const results = parseFiles(configPath, logger);

    logger.info('Parsing completed successfully!');

    logger.info('Writing results ...');

    writeTerraformFile(results.config, results.results);
}


export function parseFiles(configPath: string, logger: winston.Logger): ParseFileResult {
    logger.info(`Loading configuration ...`);

    const config = getConfig(configPath, logger);

    logger.debug(`Configuration loaded: ${JSON.stringify(config)}`);

    logger.info('Listing files ...');

    const files = listFiles(config.lambdaDir);

    logger.debug(`Files listed: ${files}`);

    const results: CommentResult[] = [];

    files.forEach(file => {
        results.push(...parseFile(config, file, logger));
    });

    return {config, results};
}

export function parseFile(config: Config, filePath: string, logger: winston.Logger): CommentResult[] {
    logger.info(`Parsing file: ${filePath} ...`);

    const commentResults = parseComment(filePath, config);

    commentResults.forEach(comment => {
        Object.keys(config.defaultParams).forEach(key => {
            if (!comment[key]) {
                comment[key] = config.defaultParams[key];
            }
        });

        comment['source'] = filePath.replace(config.lambdaDir, config.buildOutput).replace('.ts', '');
    });

    return commentResults;
}
