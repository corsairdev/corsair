import * as fs from 'fs';
import * as path from 'path';

export interface WriteFileOptions {
  createDirectories?: boolean;
  overwrite?: boolean;
}

export function writeFile(
  filePath: string,
  content: string,
  options: WriteFileOptions = {}
): void {
  const { createDirectories = true, overwrite = true } = options;

  // Check if file exists
  if (!overwrite && fs.existsSync(filePath)) {
    throw new Error(`File already exists: ${filePath}`);
  }

  // Create directories if needed
  if (createDirectories) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Write file
  fs.writeFileSync(filePath, content, 'utf-8');
}

export function getQueryOutputPath(queryId: string, projectRoot?: string): string {
  // Default to queries directory in the project root
  const root = projectRoot || process.cwd();
  const queriesDir = path.join(root, 'lib', 'corsair', 'queries');

  return path.join(queriesDir, `${queryId}.ts`);
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
