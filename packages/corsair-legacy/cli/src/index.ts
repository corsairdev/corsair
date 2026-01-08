import { addCommand } from './commands/add';
import { generateSchemaCommand } from './commands/generate-schema';
import { logger } from './logger';

function readFlag(argv: string[], name: string) {
	const i = argv.indexOf(name);
	if (i === -1) return undefined;
	return argv[i + 1];
}

async function main() {
	const argv = process.argv.slice(2);
	const cmd = argv[0];

	if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
		logger.info(
			[
				'corsair cli',
				'',
				'Commands:',
				'  add <plugin> [--config corsair.config.ts]',
				'  generate-schema [--config corsair.config.ts] [--out ./corsair-schema.ts] [--adapter drizzle]',
			].join('\n'),
		);
		return;
	}

	if (cmd === 'add') {
		const plugin = argv[1];
		if (!plugin) {
			logger.error('Usage: add <plugin>');
			process.exit(1);
		}
		await addCommand({
			plugin,
			config: readFlag(argv, '--config'),
		});
		return;
	}

	if (cmd === 'generate-schema') {
		await generateSchemaCommand({
			config: readFlag(argv, '--config'),
			out: readFlag(argv, '--out'),
			adapter: readFlag(argv, '--adapter'),
		});
		return;
	}

	logger.error(`Unknown command: ${cmd}`);
	process.exit(1);
}

// main();
