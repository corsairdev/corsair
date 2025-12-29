import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function resolveConfigPath(file?: string | undefined) {
	return path.resolve(process.cwd(), file ?? 'corsair.config.ts');
}

export function toFileUrl(p: string) {
	return pathToFileURL(p).href;
}
