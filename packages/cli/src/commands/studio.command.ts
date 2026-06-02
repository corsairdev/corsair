import path from 'node:path'
import BaseCommand from './base.command'
import type { CommandActionData, CommandOption } from '../index.types'

type StartStudio = (opts: {
	cwd: string;
	port?: number;
	open?: boolean;
}) => Promise<unknown>;

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
			{ short: '-p', long: '--port <number>', description: 'Port to start Studio on' },
			{ short: '-o', long: '--open', description: 'Open browser on launch' },
			{ short: '-O', long: '--no-open', description: 'Do not open browser on launch' },
		];
	}

	async action({ options }: CommandActionData) {
		const cwd = process.cwd();
		const port = options.port ? Number.parseInt(options.port, 10) : undefined;

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
				console.error('[#corsair]: Install it with: pnpm add -D @corsair-dev/studio');
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
