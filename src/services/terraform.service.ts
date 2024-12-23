import {Config} from "../models/config.model";
import {CommentResult} from "./comment.service";
import fs from "fs";

const ARRAY_TYPE_KEYS = ['sqs_listeners'];

export function writeTerraformFile(config: Config, sources: CommentResult[]): void {
    let fileContent = "functions = [";

    sources.forEach(source => {
        fileContent += '{';
        Object.keys(source).forEach(key => {

            if (ARRAY_TYPE_KEYS.includes(key)) {
                fileContent += `"${key}" = ${source[key]},`;
            } else if (source[key] === "null") {
                fileContent += `"${key}" = null,`;
            } else {
                fileContent += `"${key}" = "${source[key]}",`;
            }

        });
        fileContent += '},';
    });

    fileContent += ']';

    fs.writeFileSync(`${config.terraformDir}/${config.terraformFilename}`, fileContent);
}
