import fs from 'node:fs/promises';
import path from 'node:path';
import { logger } from '../logger';
import { resolveConfigPath } from '../paths';

type AddArgs = {
	plugin: string;
	config?: string | undefined;
};

function ensureSlackConfig(source: string) {
	let out = source;
	if (!out.includes('slack')) {
		// naive import injection
		out = `import { slack } from "corsair";\n${out}`;
	}

	if (!out.includes('plugins')) {
		// naive config shape injection
		out += `\n\n// Added by corsair CLI\nexport const plugins = [slack({ token: process.env.SLACK_BOT_TOKEN! })];\n`;
		return out;
	}

	// Try to insert into `plugins: [ ... ]`
	const match = out.match(/plugins\s*:\s*\[/m);
	if (!match) return out;

	// If already present, do nothing
	if (out.includes('slack({')) return out;

	const idx = match.index! + match[0].length;
	out = `${out.slice(0, idx)}\n\t\tslack({ token: process.env.SLACK_BOT_TOKEN! }),${out.slice(idx)}`;
	return out;
}

export async function addCommand(args: AddArgs) {
	const configPath = resolveConfigPath(args.config);
	let source: string;
	try {
		source = await fs.readFile(configPath, 'utf8');
	} catch {
		// create a minimal config if missing
		source = `import { drizzleAdapter, slack, type CorsairOptions } from "corsair";\n\nexport default {\n\tdb: drizzleAdapter(undefined),\n\tplugins: [slack({ token: process.env.SLACK_BOT_TOKEN! })],\n} satisfies CorsairOptions;\n`;
		await fs.mkdir(path.dirname(configPath), { recursive: true });
		await fs.writeFile(configPath, source, 'utf8');
		logger.info(`Created: ${configPath}`);
		return;
	}

	if (args.plugin === 'slack') {
		const next = ensureSlackConfig(source);
		if (next !== source) {
			await fs.writeFile(configPath, next, 'utf8');
			logger.info(`Updated: ${configPath}`);
		} else {
			logger.info(`No changes needed: ${configPath}`);
		}
		return;
	}

	logger.error(`Unknown plugin: ${args.plugin}`);
	process.exit(1);
}
