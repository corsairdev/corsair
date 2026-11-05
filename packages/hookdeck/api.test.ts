import { makeHookdeckRequest } from './client';
import { HookdeckEndpointOutputSchemas } from './endpoints/types';

// Live tests only — they call the real Hookdeck API and are skipped in CI
// unless HOOKDECK_API_KEY is set. Never mock here: this file is the working
// proof that the documented method + path actually respond.
const LIVE_KEY = process.env.HOOKDECK_API_KEY;
const describeLive = LIVE_KEY === undefined ? describe.skip : describe;

function liveKey(): string {
	if (LIVE_KEY === undefined) {
		throw new Error('HOOKDECK_API_KEY is not set');
	}
	return LIVE_KEY;
}

describeLive('Hookdeck live API', () => {
	it('lists connections', async () => {
		const raw = await makeHookdeckRequest('connections', liveKey(), {
			method: 'GET',
			query: { limit: 1 },
		});
		const parsed = HookdeckEndpointOutputSchemas.connectionsList.parse(raw);
		expect(parsed).toBeDefined();
		expect(typeof parsed.count).toBe('number');
	});

	it('lists connections with pagination params', async () => {
		const raw = await makeHookdeckRequest('connections', liveKey(), {
			method: 'GET',
			query: { limit: 1, order_by: 'created_at', dir: 'desc' },
		});
		const parsed = HookdeckEndpointOutputSchemas.connectionsList.parse(raw);
		expect(parsed.models).toBeDefined();
		expect(Array.isArray(parsed.models)).toBe(true);
	});
});
