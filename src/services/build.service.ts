import winston from 'winston';
import {parseFiles} from "./parse.service";
import {writeTerraformFile} from "./terraform.service";
import {CommentResult} from "./comment.service";
import {Config} from "../models/config.model";
import {build} from 'esbuild';
import path from 'path';
import fs from 'fs';

export async function buildCommand(configPath: string, directory: string, withParsing: boolean, logger: winston.Logger): Promise<void> {
    logger.info(`Starting build with config: ${configPath} in directory: ${directory}`);

    const result = parseFiles(configPath, logger);

    if (withParsing) {
        logger.info('Writing Terraform file ...');
        writeTerraformFile(result.config, result.results);
    }

    await Promise.all(result.results.map((commentResult: CommentResult) => buildFunction(result.config, commentResult, logger)));
}

export async function buildFunction(config: Config, commentResult: CommentResult, logger: winston.Logger): Promise<void> {
    logger.info(`Building function: ${commentResult.name}`);

    const fileTarget = commentResult['source'].replace(config.buildOutput, config.lambdaDir);
    const filename = path.basename(fileTarget, path.extname(fileTarget));

    logger.info(`Building function: ${commentResult.name} in file: ${fileTarget}`);

    // Build the function
    await build({
        ...{
            entryPoints: [fileTarget],
            sourcemap: false,
            bundle: true,
            minify: true,
            minifyIdentifiers: true,
            minifySyntax: true,
            minifyWhitespace: true,
            format: "cjs",
            platform: "node",
            target: "node20",
            tsconfig: "tsconfig.json",
            outfile: commentResult['source'] + '/main.js',
            external: ["@aws-sdk/*"],
            keepNames: false,
            treeShaking: true,
            color: true,
            legalComments: "none",
            charset: "utf8",
            loader: {
                ".ts": "ts",
            },
        }, ...config.buildParams
    }).catch(err => {
        logger.error(`Failed to build ${filename}.js`);
        logger.error(err);
        process.exit(1);
    });

    fs.copyFileSync(config.dotenvLocation, commentResult['source'] + '/.env');

    logger.info(`Function ${commentResult.name} built successfully!`);
}
