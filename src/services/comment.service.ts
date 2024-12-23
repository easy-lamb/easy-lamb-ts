import fs from "fs";
import ts from "typescript";
import {Config} from "../models/config.model";

export type CommentResult = { [key: string]: string };

const commentRegex = /@(\w+)\s+(.+)/g;

export function parseComment(file: string, config: Config): CommentResult[] {
    const content = fs.readFileSync(file, "utf-8");

    const result: CommentResult[] = [];

    const sourceFile = ts.createSourceFile(
        file,
        content,
        ts.ScriptTarget.Latest,
        true
    );

    visitNode(sourceFile, content, result, file, config);

    return result;
}


function visitNode(
    node: ts.Node,
    content: string,
    result: CommentResult[],
    file: string, config: Config
) {
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
        parseComments(node, content, result, file, config);
        return;
    } else if (ts.isVariableStatement(node)) {
        parseComments(node, content, result, file, config);
        return;
    }

    ts.forEachChild(node, child => visitNode(child, content, result, file, config));
}

function parseComments(
    node: ts.Node,
    content: string,
    result: CommentResult[],
    file: string, config: Config
) {
    const commentRanges = ts.getLeadingCommentRanges(content, node.pos) || [];

    let functionName: string = '';
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
        functionName = node.getText().split("(")[0].split(" ").pop()!;
    } else if (ts.isVariableStatement(node)) {
        functionName = node.getText().split("export const")[1].split("=")[0].trim();
    }

    const results: CommentResult = {};

    commentRanges.forEach(range => {
        const matches = content.substring(range.pos, range.end).matchAll(commentRegex);

        for (const match of matches) {
            results[match[1]] = match[2];
        }
    });

    if (Object.keys(results).length > 0) {
        if (!Object.keys(results).includes('name')) {
            let name = '';

            functionName.split('').forEach(char => {
                if (char === char.toUpperCase()) {
                    name += '-';
                }
                name += char.toLowerCase();
            });

            results['name'] = name;
        }

        results['handler'] = `main.${functionName}`;

        result.push(results);
    }

    return [];
}
