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

const ACK_MAX_ATTEMPTS = 3;
const ACK_RETRY_MS = 250;

function isAbort(err: unknown): boolean {
	return (err as { name?: string })?.name === 'AbortError';
}

async function ackConfirmed(resp: Response): Promise<boolean> {
	try {
		const body = (await resp.json()) as { ok?: boolean };
		return body?.ok !== false;
	} catch {
		return true;
	}
}

// The run already executed locally by the time we ack, so a lost ack means the
// hub never records the result and eventually retries the run. Retry transport
// failures a bounded number of times; a 2xx that the hub couldn't match (its
// delivery already timed out) is terminal, not retryable.
async function postAck(
	hub: HubConfig,
	deps: ConnectDeps,
	auth: Record<string, string>,
	payload: { deliveryId: string; status: number; body: unknown },
	signal?: AbortSignal,
): Promise<boolean> {
	for (let attempt = 1; attempt <= ACK_MAX_ATTEMPTS; attempt++) {
		try {
			const resp = await deps.fetch(`${hub.apiUrl}/api/dev/ack`, {
				method: 'POST',
				headers: { ...auth, 'content-type': 'application/json' },
				body: JSON.stringify(payload),
				signal,
			});
			if (resp.ok) {
				if (!(await ackConfirmed(resp))) {
					console.warn(
						`[corsair] hub did not record delivery ${payload.deliveryId} (already timed out); the run may be retried`,
					);
				}
				return true;
			}
		} catch (err) {
			if (isAbort(err)) throw err;
		}
		if (attempt < ACK_MAX_ATTEMPTS) await sleep(ACK_RETRY_MS);
	}
	console.warn(
		`[corsair] failed to acknowledge delivery ${payload.deliveryId} after ${ACK_MAX_ATTEMPTS} attempts; the run may be retried`,
	);
	return false;
}

export async function pollOnce(
	corsair: unknown,
	hub: HubConfig,
	deps: ConnectDeps,
	signal?: AbortSignal,
): Promise<'idle' | 'handled' | 'error'> {
	const auth = { authorization: `Bearer ${hub.projectApiKey}` };
	const pull = await deps.fetch(`${hub.apiUrl}/api/dev/pull`, {
		headers: auth,
		signal,
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
			allowWorkflowExecution: hub.allowWorkflowExecution,
		},
	);
	const { status, body: ackBody } = deriveAck(ack);
	const confirmed = await postAck(
		hub,
		deps,
		auth,
		{ deliveryId, status, body: ackBody },
		signal,
	);
	return confirmed ? 'handled' : 'error';
}

const BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 5_000;
// Client-side ceiling above the hub's 25s long-poll hold, so a wedged
// connection (silent proxy drop) is aborted and retried rather than hanging.
const PULL_ABORT_MS = 30_000;

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// One loop per project key, tracked on globalThis so it survives module
// re-evaluation under watch/HMR — otherwise every createCorsair() (or reload)
// would spawn another perpetual poll loop against the same environment. The
// value is an owner token: only the loop that currently owns a key may release
// it, so a stop()+restart of the same key never leaves two loops polling.
const activeLoops: Map<string, symbol> = ((
	globalThis as typeof globalThis & {
		__corsairConnectLoops?: Map<string, symbol>;
	}
).__corsairConnectLoops ??= new Map<string, symbol>());

export function startConnectLoop(
	corsair: unknown,
	deps: ConnectDeps = { fetch, process: processCorsair },
): { stop: () => void } {
	let hub: HubConfig;
	try {
		hub = getHubConfig(corsair);
	} catch {
		return { stop: () => {} };
	}
	// A prod key means connect is out of scope — stay silent. But a dev key with
	// execution gated off is almost always a mistake (it used to fail silently:
	// the app just never polls). Say why, and where the flag actually goes.
	if (!hub.projectApiKey.startsWith('ck_dev_')) {
		return { stop: () => {} };
	}
	if (!hub.allowWorkflowExecution) {
		console.warn(
			'[corsair] workflow executions not enabled. ' +
				'Please set hub: { ..., allowWorkflowExecution: true }',
		);
		return { stop: () => {} };
	}
	const key = hub.projectApiKey;
	if (activeLoops.has(key)) {
		return { stop: () => {} };
	}
	const token = Symbol('corsair-connect-loop');
	activeLoops.set(key, token);
	const releaseKey = (): void => {
		if (activeLoops.get(key) === token) activeLoops.delete(key);
	};

	let stopped = false;
	let controller: AbortController | null = null;

	const run = async (): Promise<void> => {
		let backoff = BACKOFF_MS;
		let erroring = false;
		const backOff = async (detail: unknown): Promise<void> => {
			if (!erroring) {
				console.warn('[corsair] connect loop error; retrying', detail);
				erroring = true;
			}
			if (!stopped) await sleep(backoff);
			backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
		};
		try {
			while (!stopped) {
				controller = new AbortController();
				const timer = setTimeout(() => controller?.abort(), PULL_ABORT_MS);
				try {
					const outcome = await pollOnce(corsair, hub, deps, controller.signal);
					if (outcome === 'error') {
						await backOff('pull or ack failed');
					} else {
						erroring = false;
						backoff = BACKOFF_MS;
					}
				} catch (err) {
					if (stopped) break;
					await backOff(err instanceof Error ? err.message : err);
				} finally {
					clearTimeout(timer);
				}
			}
		} finally {
			releaseKey();
		}
	};
	void run();

	return {
		stop: () => {
			stopped = true;
			controller?.abort();
			releaseKey();
		},
	};
}
