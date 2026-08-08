import type { processCorsair } from '../../tunnel/index';
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
