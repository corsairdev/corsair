import { processCorsair } from '../../tunnel/index';
import { getHubConfig } from '../config';
import type { HubConfig } from '../types';

type TunnelAck = Awaited<ReturnType<typeof processCorsair>>;

export type ConnectDeps = {
	fetch: typeof fetch;
	process: typeof processCorsair;
};

export function deriveAck(ack: TunnelAck): { status: number; body: unknown } {
	const wr = (ack as { webhookResponse?: { status: number; body: unknown } })
		.webhookResponse;
	if (ack.status === 'ok') {
		return { status: wr?.status ?? 200, body: wr?.body ?? { status: 'ok' } };
	}
	return {
		status: wr?.status ?? 502,
		body: wr?.body ?? {
			status: 'error',
			error: (ack as { error?: string }).error ?? 'delivery failed',
		},
	};
}

export async function pollOnce(
	corsair: unknown,
	hub: HubConfig,
	deps: ConnectDeps,
): Promise<'idle' | 'handled' | 'error'> {
	const auth = { authorization: `Bearer ${hub.projectApiKey}` };
	const pull = await deps.fetch(`${hub.apiUrl}/api/dev/pull`, {
		headers: auth,
	});
	if (pull.status === 204) return 'idle';
	if (!pull.ok) return 'error';

	const { deliveryId, body, headers } = (await pull.json()) as {
		deliveryId: string;
		body: string;
		headers: Record<string, string>;
	};
	const ack = await deps.process(
		corsair,
		{ headers, body },
		{
			signingSecret: hub.signingSecret,
			allowWorkflowExecution: hub.allowWorkflowExecution ?? true,
		},
	);
	const { status, body: ackBody } = deriveAck(ack);
	await deps.fetch(`${hub.apiUrl}/api/dev/ack`, {
		method: 'POST',
		headers: { ...auth, 'content-type': 'application/json' },
		body: JSON.stringify({ deliveryId, status, body: ackBody }),
	});
	return 'handled';
}

const BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 5_000;

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function startConnectLoop(corsair: unknown): { stop: () => void } {
	let hub: HubConfig;
	try {
		hub = getHubConfig(corsair);
	} catch {
		return { stop: () => {} };
	}
	if (!hub.allowWorkflowExecution || !hub.projectApiKey.startsWith('ck_dev_')) {
		return { stop: () => {} };
	}

	let stopped = false;
	let backoff = BACKOFF_MS;
	const deps: ConnectDeps = { fetch, process: processCorsair };

	const run = async (): Promise<void> => {
		while (!stopped) {
			try {
				const outcome = await pollOnce(corsair, hub, deps);
				if (outcome === 'error') {
					if (!stopped) await sleep(backoff);
					backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
				} else {
					backoff = BACKOFF_MS;
				}
			} catch {
				if (stopped) break;
				await sleep(backoff);
				backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
			}
		}
	};
	void run();

	return {
		stop: () => {
			stopped = true;
		},
	};
}
