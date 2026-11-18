import { logEventFromContext } from 'corsair/core';
import type { OrbitContext } from '../index';
import {
	completeOrbitDelivery,
	handleOrbitDelivery,
	releaseOrbitDelivery,
	resetOrbitDeliveries,
} from './events';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

function ctx(): OrbitContext {
	// The handler only needs the webhook secret. The rest of the plugin context is unused.
	return { key: 'whsec_test', options: {} } as OrbitContext;
}

function request(id = 'evt_1', header = id) {
	return {
		payload: { id, type: 'profile.updated' },
		headers: { 'x-orbit-webhook-event-id': header },
		rawBody: '{}',
		hubVerified: true,
	};
}

describe('orbit webhook deliveries', () => {
	beforeEach(() => {
		resetOrbitDeliveries();
		jest.mocked(logEventFromContext).mockReset();
		jest.mocked(logEventFromContext).mockResolvedValue(null);
	});

	it('rejects an event id header that disagrees with the signed payload', async () => {
		const result = await handleOrbitDelivery(
			ctx(),
			request('evt_1', 'evt_other'),
		);
		expect(result.success).toBe(false);
		expect(result.error).toMatch(/signed payload/);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('runs a redelivery when the after-hook did not finish', async () => {
		const first = await handleOrbitDelivery(ctx(), request());
		expect(first.success).toBe(true);
		releaseOrbitDelivery('whsec_test', 'evt_1');
		const second = await handleOrbitDelivery(ctx(), request());
		expect(second.success).toBe(true);
		expect(logEventFromContext).toHaveBeenCalledTimes(2);
	});

	it('blocks a second copy after the after-hook succeeds', async () => {
		await handleOrbitDelivery(ctx(), request());
		completeOrbitDelivery('whsec_test', 'evt_1');
		const duplicate = await handleOrbitDelivery(ctx(), request());
		expect(duplicate).toMatchObject({
			success: false,
			error: 'duplicate delivery',
		});
		expect(logEventFromContext).toHaveBeenCalledTimes(1);
	});

	it('forgets a finished delivery after one day', async () => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
		await handleOrbitDelivery(ctx(), request('evt_old'));
		completeOrbitDelivery('whsec_test', 'evt_old');
		jest.setSystemTime(new Date('2026-01-03T00:00:00.000Z'));
		const again = await handleOrbitDelivery(ctx(), request('evt_old'));
		expect(again.success).toBe(true);
		jest.useRealTimers();
	});
});
