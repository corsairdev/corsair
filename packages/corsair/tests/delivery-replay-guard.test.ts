import {
	consumeDeliveryReplayKey,
	resetDeliveryReplayGuardForTests,
} from '../hub/internal/delivery-replay-guard';

describe('delivery replay guard', () => {
	beforeEach(() => {
		resetDeliveryReplayGuardForTests();
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2026-07-30T12:00:00.000Z'));
	});

	afterEach(() => {
		jest.useRealTimers();
		resetDeliveryReplayGuardForTests();
	});

	it('rejects blank replay keys', () => {
		expect(consumeDeliveryReplayKey('', 60_000)).toEqual({
			ok: false,
			error: 'Delivery replay key is required',
		});
		expect(consumeDeliveryReplayKey('   ', 60_000)).toEqual({
			ok: false,
			error: 'Delivery replay key is required',
		});
	});

	it('accepts a key once and rejects immediate replay', () => {
		expect(consumeDeliveryReplayKey('browser:jti-1', 60_000)).toEqual({
			ok: true,
		});
		expect(consumeDeliveryReplayKey('browser:jti-1', 60_000)).toEqual({
			ok: false,
			error: 'Delivery request already consumed',
		});
	});

	it('allows distinct keys independently', () => {
		expect(consumeDeliveryReplayKey('browser:jti-a', 60_000)).toEqual({
			ok: true,
		});
		expect(consumeDeliveryReplayKey('browser:jti-b', 60_000)).toEqual({
			ok: true,
		});
	});

	it('reclaims a key after its TTL expires', () => {
		expect(consumeDeliveryReplayKey('browser:jti-ttl', 1_000)).toEqual({
			ok: true,
		});

		jest.setSystemTime(new Date('2026-07-30T12:00:00.500Z'));
		expect(consumeDeliveryReplayKey('browser:jti-ttl', 1_000)).toEqual({
			ok: false,
			error: 'Delivery request already consumed',
		});

		jest.setSystemTime(new Date('2026-07-30T12:00:01.001Z'));
		expect(consumeDeliveryReplayKey('browser:jti-ttl', 1_000)).toEqual({
			ok: true,
		});
	});

	it('rejects non-positive TTLs', () => {
		expect(consumeDeliveryReplayKey('browser:jti-bad-ttl', 0)).toEqual({
			ok: false,
			error: 'Delivery replay TTL must be a positive number',
		});
		expect(consumeDeliveryReplayKey('browser:jti-bad-ttl', -5)).toEqual({
			ok: false,
			error: 'Delivery replay TTL must be a positive number',
		});
	});

	it('trims surrounding whitespace before storing keys', () => {
		expect(consumeDeliveryReplayKey('  browser:jti-trim  ', 60_000)).toEqual({
			ok: true,
		});
		expect(consumeDeliveryReplayKey('browser:jti-trim', 60_000)).toEqual({
			ok: false,
			error: 'Delivery request already consumed',
		});
	});
});
