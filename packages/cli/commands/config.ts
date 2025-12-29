import type { CorsairConfig, SchemaOutput } from '@corsair-ai/core/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import { schemaLoaderCLI } from '../utils/schema-loader-cli.js';

// i can't figure out if this is the smartest or dumbest code i've ever written

export type Config = Omit<CorsairConfig<any>, 'db'> & {
	db: SchemaOutput;
};

const execAsync = promisify(exec);

const body = schemaLoaderCLI
	.toString()
	.slice(
		schemaLoaderCLI.toString().indexOf('{') + 1,
		schemaLoaderCLI.toString().lastIndexOf('}'),
	)
	.trim();

export const loadConfig = async () => {
	try {
		const code = `
import { config } from './corsair.config.js'

${body}

const formattedConfig = {
  ...config,
  db: dbSchema,
}

console.log('<output>')
console.log(JSON.stringify(formattedConfig, null, 2))
console.log('</output>')
`;

		const result = await execAsync(
			`tsx --conditions=react-server -e "${code.replace(/"/g, '\\"')}"`,
			{
				cwd: process.cwd(),
			},
		);

		const response =
			result.stdout.match(/<output>(.*?)<\/output>/s)?.[1]?.trim() || '';

		const object = JSON.parse(response) as Config;

		return object;
	} catch (error: any) {
		console.error('Error extracting config:', error);
		return undefined;
	}
};
