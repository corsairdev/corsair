import { CORSAIR_TUNNEL_PATH } from 'corsair/hub';
import { runTunnel } from 'corsair/hub/tunnel/run-tunnel';
import type { CommandActionData, CommandArgument } from '../index.types';
import { corsairBanner } from '../lib/banner';
import { extractInternalConfig } from '../utils/corsair';
import BaseCommand from './base.command';

export default class HttpCommand extends BaseCommand {
	getName(): string {
		return 'http';
	}

	getDescription(): string {
		return 'Open a dev tunnel so the Hub can reach your local app';
	}

	getArguments(): CommandArgument[] {
		return [
			{
				name: '[port]',
				description: 'Local port to expose (defaults to $PORT)',
			},
		];
	}

	async action({ args }: CommandActionData): Promise<void> {
		const raw = args[0] ?? process.env.PORT ?? '';
		const port = Number(raw);
		if (!/^\d+$/.test(raw) || port < 1 || port > 65535) {
			console.error(
				'[corsair]: No valid port. Usage: corsair http [port] (or set PORT).',
			);
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

		console.log(`[corsair]: Opening dev tunnel → localhost:${port} ...`);

		// runTunnel reaps any orphan holding the slug, but frps frees the proxy a
		// beat after the orphan's socket drops — so the first spawn can still race
		// it and get "proxy already exists". The SDK path rides its supervisor's
		// retry; this one-shot has none, so retry the transient here.
		let stop: () => void;
		for (let attempt = 1; ; attempt++) {
			try {
				const result = await runTunnel({
					port,
					apiUrl: hub.apiUrl,
					apiKey: hub.projectApiKey,
					shareHost: process.env.CORSAIR_FRP_HOST,
				});
				stop = result.stop;
				console.log(corsairBanner(`${result.url}${CORSAIR_TUNNEL_PATH}`));
				console.log('  Press Ctrl+C to stop.\n');
				break;
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				if (/already exists|still held/i.test(message) && attempt < 3) {
					await new Promise((r) => setTimeout(r, 1_000));
					continue;
				}
				console.error(`[corsair]: Tunnel failed — ${message}`);
				process.exit(1);
			}
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
