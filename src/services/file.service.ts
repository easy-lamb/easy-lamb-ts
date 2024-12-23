import fs from 'fs';

export function listFiles(directory: string): string[] {
    const results: string[] = [];

    return collectFiles(directory, results);
}

export function collectFiles(directory: string, results: string[]): string[] {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const filePath = `${directory}/${file}`;
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            collectFiles(filePath, results);
        } else if (filePath.endsWith('.ts')) {
            results.push(filePath);
        }
    });

    return results;
}
