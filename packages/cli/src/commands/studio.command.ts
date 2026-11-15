import path from 'node:path';
import type { CommandActionData, CommandOption } from '../index.types';
import BaseCommand from './base.command';

type StartStudio = (opts: {
	cwd: string;
	port?: number;
	open?: boolean;
}) => Promise<unknown>;

/**
 * Parse and validate a port string for the studio command.
 * Returns undefined when no port is provided (so the caller's fallback applies).
 * Exits with code 1 when the port is invalid.
 */
export function parseStudioPort(raw: string | undefined): number | undefined {
	if (raw === undefined) {
		return undefined;
	}

	const port = Number(raw);
	if (!/^\d+$/.test(raw) || port < 1 || port > 65535) {
		console.error(
			'[corsair]: Invalid port. Usage: corsair ui --port <number> (1-65535).',
		);
		process.exit(1);
	}

	return port;
}

export default class StudioCommand extends BaseCommand {
	getName(): string {
		return 'ui';
	}

	getAliases(): string[] {
		return ['studio'];
	}

	getDescription(): string {
		return 'Start Corsair Studio';
	}

	getOptions(): CommandOption[] {
		return [
			{
				short: '-p',
				long: '--port <number>',
				description: 'Port to start Studio on',
			},
			{ short: '-o', long: '--open', description: 'Open browser on launch' },
			{
				short: '-O',
				long: '--no-open',
				description: 'Do not open browser on launch',
			},
		];
	}

	async action({ options }: CommandActionData) {
		const cwd = process.cwd();
		const port = parseStudioPort(options.port);

		let startStudio: StartStudio;
		try {
			const { createRequire } = await import('node:module');
			const { pathToFileURL } = await import('node:url');
			const req = createRequire(path.join(cwd, 'package.json'));
			const resolvedPath = req.resolve('@corsair-dev/studio/server');
			const mod = (await import(pathToFileURL(resolvedPath).href)) as {
				start?: StartStudio;
				startStudio?: StartStudio;
			};
			const candidate = mod.start ?? mod.startStudio;
			if (!candidate) {
				throw new Error('@corsair-dev/studio/server did not export `start`.');
			}
			startStudio = candidate;
		} catch (error) {
			const msg = error instanceof Error ? error.message : String(error);
			if (
				msg.includes('Cannot find package') ||
				msg.includes('Cannot find module') ||
				msg.includes('ERR_MODULE_NOT_FOUND') ||
				msg.includes('MODULE_NOT_FOUND')
			) {
				console.error('[#corsair]: Corsair Studio is not installed.');
				console.error(
					'[#corsair]: Install it with: pnpm add -D @corsair-dev/studio',
				);
				process.exit(1);
			}
			throw error;
		}

		await startStudio({ cwd, port, open: options.open });
		await new Promise<void>((resolve) => {
			const shutdown = () => resolve();
			process.once('SIGINT', shutdown);
			process.once('SIGTERM', shutdown);
		});
	}
}
