export interface Config {
    lambdaDir: string;
    terraformDir: string;
    terraformFilename: string;
    buildOutput: string;
    defaultParams: { [key: string]: string };
    dotenvLocation: string;
    buildParams : { [key: string]: string };
}
