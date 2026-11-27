import { z } from 'zod';
import { list as sourcesList } from './endpoints/sources';
import { list as templatesList } from './endpoints/templates';

// Live smoke, gated on a production key: two read-only list calls, nothing
// that spends credits. Render creates, generations and uploads are
// deliberately absent from this suite. Sandbox keys answer 403 here, because
// the plugin calls the production paths only.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = z.string().min(1).safeParse(process.env.SHOTSTACK_API_KEY);
const describeLive = KEY.success ? describe : describe.skip;

// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: KEY.data ?? '' } as unknown as Parameters<
	typeof templatesList
>[0];

describeLive('live Shotstack API', () => {
	jest.setTimeout(30_000);

	it('lists saved templates through the output schema', async () => {
		const result = await templatesList(ctx, {});
		expect(result.success).toBe(true);
		expect(Array.isArray(result.response.templates)).toBe(true);
	});

	it('lists ingested sources through the output schema', async () => {
		const result = await sourcesList(ctx, {});
		expect(Array.isArray(result.sources)).toBe(true);
	});
});
