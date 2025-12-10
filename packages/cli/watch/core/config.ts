import * as path from 'path';

export interface CorsairConfig {
	projectRoot: string;
	watchPaths: string[];
	ignorePaths: string[];
	outputDir: string;
	schemaPath?: string;
}

export function getDefaultConfig(): CorsairConfig {
	const projectRoot = process.cwd();

	return {
		projectRoot,
		watchPaths: [
			'src/**/*.{ts,tsx}',
			'app/**/*.{ts,tsx}',
			'components/**/*.{ts,tsx}',
			'lib/**/*.{ts,tsx}',
		],
		ignorePaths: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.next/**',
			'**/corsair/queries/**',
		],
		outputDir: path.join(projectRoot, 'lib', 'corsair', 'queries'),
	};
}

export function loadConfig(): CorsairConfig {
	return getDefaultConfig();
}
