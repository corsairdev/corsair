import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeVeriphoneRequest } from './client';
import { Coverage, Credits, Verify } from './endpoints';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeVeriphoneRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeVeriphoneRequest);
const mockLog = jest.mocked(logEventFromContext);

function createContext() {
	return { key: 'test-key', db: {} };
}

const VERIFY_RESPONSE = {
	status: 'success',
	phone: '+14169670000',
	phone_valid: true,
	phone_type: 'fixed_line',
	phone_region: 'Toronto, ON',
	country: 'Canada',
	country_code: 'CA',
	country_prefix: '1',
	international_number: '+1 416-967-0000',
	local_number: '(416) 967-0000',
	e164: '+14169670000',
	carrier: 'Bell',
	mode: 'static',
	timezone: ['America/Toronto'],
	geographical: true,
};

describe('Veriphone endpoint operations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('throws AuthMissingError when no key is configured', async () => {
		await expect(
			Verify.verify({ key: '', db: {} } as never, { phone: '+14169670000' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects invalid input without calling the provider', async () => {
		const ctx = createContext();

		await expect(Verify.verify(ctx as never, { phone: '' })).rejects.toThrow();
		await expect(
			Verify.verify(
				ctx as never,
				{
					phone: '+14169670000',
					mode: 'turbo',
				} as never,
			),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('verify sends the phone query and returns the parsed response', async () => {
		mockRequest.mockResolvedValue(VERIFY_RESPONSE);
		const ctx = createContext();

		const result = await Verify.verify(ctx as never, {
			phone: '+14169670000',
		});

		expect(mockRequest).toHaveBeenCalledWith('v3/verify', 'test-key', {
			query: {
				phone: '+14169670000',
				default_country: undefined,
				mode: undefined,
				record: undefined,
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'veriphone.verify',
			{ mode: undefined },
			'completed',
		);
		expect(result.phone_valid).toBe(true);
		expect(result.country_code).toBe('CA');
	});

	it('verify forwards mode, default_country and record', async () => {
		mockRequest.mockResolvedValue({ ...VERIFY_RESPONSE, mode: 'current' });
		const ctx = createContext();

		const result = await Verify.verify(ctx as never, {
			phone: '4169670000',
			default_country: 'CA',
			mode: 'current',
			record: true,
		});

		expect(mockRequest).toHaveBeenCalledWith('v3/verify', 'test-key', {
			query: {
				phone: '4169670000',
				default_country: 'CA',
				mode: 'current',
				record: true,
			},
		});
		expect(result.mode).toBe('current');
	});

	it('verify rejects a malformed provider response', async () => {
		mockRequest.mockResolvedValue({ status: 42, phone_valid: 'yes' });
		const ctx = createContext();

		await expect(
			Verify.verify(ctx as never, { phone: '+14169670000' }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('credits requests v3/credits and logs the event', async () => {
		mockRequest.mockResolvedValue({
			email: 'user@example.com',
			counter: 10,
			active: true,
			payg: 0,
			limit: 100,
			plan: 'FREE',
			renew: 15,
		});
		const ctx = createContext();

		const result = await Credits.get(ctx as never, {});

		expect(mockRequest).toHaveBeenCalledWith('v3/credits', 'test-key');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'veriphone.credits',
			{},
			'completed',
		);
		expect(result.active).toBe(true);
		expect(result.counter).toBe(10);
	});

	it('coverage requests v3/coverage/current and returns countries', async () => {
		mockRequest.mockResolvedValue({
			countries: [
				{ iso: 'US', covered: true },
				{ iso: 'CA', covered: true },
			],
			updatedAt: '2026-07-04T04:15:00Z',
		});
		const ctx = createContext();

		const result = await Coverage.get(ctx as never, {});

		expect(mockRequest).toHaveBeenCalledWith('v3/coverage/current', 'test-key');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'veriphone.coverage',
			{},
			'completed',
		);
		expect(result.countries).toHaveLength(2);
		expect(result.countries[0]?.iso).toBe('US');
	});
});
