import {Config} from "../models/config.model";
import winston from "winston";
import fs from "fs";

export function getConfig(configPath: string, logger: winston.Logger): Config {
    logger.debug(`Get configuration ${configPath}`);

    const configContent = fs.readFileSync(configPath, 'utf-8');

    let config: Config;

    try {
        config = JSON.parse(configContent) as Config;
    } catch (error) {
        logger.error(`Error parsing config: ${error}`);
        throw error;
    }

    return config;
}
