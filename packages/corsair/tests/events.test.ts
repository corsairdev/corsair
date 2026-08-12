import type { HubConfig } from '../hub/types';
import { createSendEventCallback } from '../workflows/events';

function fakeHub(): HubConfig {
	return {
		apiUrl: 'https://hub.test',
		projectApiKey: 'ck_dev_k',
		signingSecret: 's',
	};
}

it('POSTs the event to /events with the run + tenant context', async () => {
	const calls: Array<{ path: string; body: unknown }> = [];
	const fetchSpy = jest
		.spyOn(global, 'fetch')
		.mockImplementation(async (input, init) => {
			const url = typeof input === 'string' ? input : (input as Request).url;
			calls.push({
				path: url,
				body: JSON.parse((init?.body as string) ?? 'null'),
			});
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		});

	try {
		const cb = createSendEventCallback({
			hub: fakeHub(),
			runId: 'r1',
			workflowId: 'w1',
			tenantId: 't1',
		});
		await cb('order.paid', JSON.stringify({ id: 'o1' }));

		expect(calls).toHaveLength(1);
		expect(calls[0]!.path).toContain('tenantId=t1');
		expect(calls[0]!.path).toContain('/events');
		expect(calls[0]!.body).toEqual({
			runId: 'r1',
			workflowId: 'w1',
			name: 'order.paid',
			data: { id: 'o1' },
		});
	} finally {
		fetchSpy.mockRestore();
	}
});
