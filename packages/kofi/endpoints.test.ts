import { logEventFromContext } from 'corsair/core';
import { Webhooks } from './endpoints';
import { KOFI_WEBHOOK_EVENTS } from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

beforeEach(() => {
	mockLog.mockClear();
});

describe('webhooks.listEvents', () => {
	it('returns the documented payment types without an API call', async () => {
		const ctx = { key: 'token' } as never;

		const result = await Webhooks.listEvents(ctx, {});

		expect(result.events).toHaveLength(4);
		expect(result.events.map(({ type }) => type)).toEqual([
			'Donation',
			'Subscription',
			'Shop Order',
			'Commission',
		]);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kofi.webhooks.listEvents',
			{ count: 4 },
			'completed',
		);
	});

	it('accepts a call with no input', async () => {
		const ctx = { key: 'token' } as never;

		await expect(Webhooks.listEvents(ctx, undefined as never)).resolves.toEqual(
			{
				events: KOFI_WEBHOOK_EVENTS,
			},
		);
	});

	it('gives every event a description and a docs link', () => {
		for (const { type, description, docs_url } of KOFI_WEBHOOK_EVENTS) {
			expect(type.length).toBeGreaterThan(3);
			expect(description.length).toBeGreaterThan(20);
			expect(docs_url).toMatch(/^https:\/\/help\.ko-fi\.com\//);
		}
	});
});
