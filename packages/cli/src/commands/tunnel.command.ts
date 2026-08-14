import { CORSAIR_TUNNEL_PATH } from 'corsair/hub';
import { runTunnel } from 'corsair/hub/tunnel/run-tunnel';
import type { CommandActionData, CommandArgument } from '../index.types';
import { extractInternalConfig } from '../utils/corsair';
import BaseCommand from './base.command';

export default class TunnelCommand extends BaseCommand {
	getName(): string {
		return 'tunnel';
	}

	getDescription(): string {
		return 'Open a zrok tunnel and register the public URL with Hub';
	}

	getArguments(): CommandArgument[] {
		return [{ name: '<port>', description: 'Local port to expose' }];
	}

	async action({ args }: CommandActionData): Promise<void> {
		const raw = args[0] ?? '';
		const port = Number(raw);
		if (!/^\d+$/.test(raw) || port < 1 || port > 65535) {
			console.error('[corsair]: Invalid port. Usage: corsair tunnel <port>');
			process.exit(1);
		}

		const cwd = process.cwd();
		let internal: Awaited<ReturnType<typeof extractInternalConfig>>;
		try {
			internal = await extractInternalConfig(cwd);
		} catch (err) {
			console.error(
				`[corsair]: ${err instanceof Error ? err.message : String(err)}`,
			);
			process.exit(1);
		}

		const hub = internal.hub;
		if (!hub) {
			console.error(
				'[corsair]: Hub is not configured. Add hub: { projectApiKey, signingSecret } to createCorsair().',
			);
			process.exit(1);
		}

		console.log(`[corsair]: Starting zrok tunnel → localhost:${port} ...`);

		let stop: () => void;
		try {
			const result = await runTunnel({
				port,
				apiUrl: hub.apiUrl,
				apiKey: hub.projectApiKey,
			});
			stop = result.stop;
			console.log(`\n  Public URL: ${result.url}${CORSAIR_TUNNEL_PATH}\n`);
			console.log('[corsair]: Tunnel active. Press Ctrl+C to stop.');
		} catch (err) {
			console.error(
				`[corsair]: Tunnel failed — ${err instanceof Error ? err.message : String(err)}`,
			);
			process.exit(1);
		}

		await new Promise<void>((resolve) => {
			const shutdown = (): void => {
				stop();
				resolve();
			};
			process.once('SIGINT', shutdown);
			process.once('SIGTERM', shutdown);
		});
	}
}
