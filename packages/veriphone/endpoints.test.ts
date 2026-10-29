import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeVeriphoneRequest } from './client';
import { getCoverage } from './endpoints/coverage';
import { getCredits } from './endpoints/credits';
import { getExamplePhoneNumber } from './endpoints/get-example-phone-number';
import type { VeriphoneEndpointContext } from './endpoints/verify-phone-number';
import { verifyPhoneNumber } from './endpoints/verify-phone-number';

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

function createContext(key = 'test-key'): VeriphoneEndpointContext {
	return {
		key,
		$getAccountId: async () => 'test-account',
	};
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

const EXAMPLE_RESPONSE = {
	status: 'success',
	phone_type: 'mobile',
	country_code: 'US',
	country_prefix: '1',
	international_number: '+1 202-555-0143',
	local_number: '(202) 555-0143',
	e164: '+12025550143',
};

describe('Veriphone endpoint operations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('throws AuthMissingError when no key is configured', async () => {
		const ctx = createContext('');
		await expect(
			verifyPhoneNumber(ctx, { phone: '+14169670000' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			getExamplePhoneNumber(ctx, { country_code: 'US' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a blank phone number without calling the provider', async () => {
		const ctx = createContext();
		await expect(verifyPhoneNumber(ctx, { phone: '' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a phone number with too few digits without calling the provider', async () => {
		const ctx = createContext();
		await expect(verifyPhoneNumber(ctx, { phone: '12' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a malformed default_country without calling the provider', async () => {
		const ctx = createContext();
		await expect(
			verifyPhoneNumber(ctx, {
				phone: '+14169670000',
				default_country: 'USA',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('verifyPhoneNumber sends the phone query and returns the parsed response', async () => {
		mockRequest.mockResolvedValue(VERIFY_RESPONSE);
		const ctx = createContext();

		const result = await verifyPhoneNumber(ctx, {
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
			'veriphone.verifyPhoneNumber',
			{ mode: 'static' },
			'completed',
		);
		expect(result.phone_valid).toBe(true);
		expect(result.country_code).toBe('CA');
	});

	it('verifyPhoneNumber forwards mode, default_country and record', async () => {
		mockRequest.mockResolvedValue({ ...VERIFY_RESPONSE, mode: 'current' });
		const ctx = createContext();

		const result = await verifyPhoneNumber(ctx, {
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

	it('verifyPhoneNumber rejects a malformed provider response', async () => {
		mockRequest.mockResolvedValue({ status: 42, phone_valid: 'yes' });
		const ctx = createContext();

		await expect(
			verifyPhoneNumber(ctx, { phone: '+14169670000' }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a malformed country_code for the example endpoint', async () => {
		const ctx = createContext();
		await expect(
			getExamplePhoneNumber(ctx, { country_code: 'USA' }),
		).rejects.toThrow();
		await expect(
			getExamplePhoneNumber(ctx, { country_code: '' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('getExamplePhoneNumber uppercases the country and returns the parsed response', async () => {
		mockRequest.mockResolvedValue(EXAMPLE_RESPONSE);
		const ctx = createContext();

		const result = await getExamplePhoneNumber(ctx, { country_code: 'us' });

		expect(mockRequest).toHaveBeenCalledWith('v2/example', 'test-key', {
			query: { country_code: 'US', type: undefined },
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'veriphone.getExamplePhoneNumber',
			{ country_code: 'US' },
			'completed',
		);
		expect(result.phone_type).toBe('mobile');
		expect(result.country_code).toBe('US');
	});

	it('getExamplePhoneNumber forwards the line type', async () => {
		mockRequest.mockResolvedValue({
			...EXAMPLE_RESPONSE,
			phone_type: 'fixed_line',
		});
		const ctx = createContext();

		const result = await getExamplePhoneNumber(ctx, {
			country_code: 'FR',
			type: 'fixed_line',
		});

		expect(mockRequest).toHaveBeenCalledWith('v2/example', 'test-key', {
			query: { country_code: 'FR', type: 'fixed_line' },
		});
		expect(result.phone_type).toBe('fixed_line');
	});

	it('getExamplePhoneNumber rejects a malformed provider response', async () => {
		mockRequest.mockResolvedValue({ status: 'bogus' });
		const ctx = createContext();

		await expect(
			getExamplePhoneNumber(ctx, { country_code: 'US' }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('getCredits requests v3/credits and logs the event', async () => {
		mockRequest.mockResolvedValue({
			email: 'user@example.com',
			counter: 5,
			active: true,
			payg: 0,
			limit: 1000,
			plan: 'FREE',
			renew: 5,
			last_reset: { seconds: 1788596342, nanos: 415000000 },
			usage: {
				static: { count: 5, credits: 5 },
				current: { count: 0, credits: 0 },
			},
		});
		const ctx = createContext();

		const result = await getCredits(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith('v3/credits', 'test-key');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'veriphone.credits',
			{},
			'completed',
		);
		expect(result.active).toBe(true);
		expect(result.counter).toBe(5);
		expect(result.plan).toBe('FREE');
	});

	it('getCredits rejects a malformed provider response', async () => {
		mockRequest.mockResolvedValue({ counter: 'many' });
		const ctx = createContext();

		await expect(getCredits(ctx, {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('getCoverage requests v3/coverage/current and returns countries', async () => {
		mockRequest.mockResolvedValue({
			countries: [
				{ iso: 'US', covered: true },
				{ iso: 'CA', covered: true },
			],
			updatedAt: '2026-09-09T17:08:41.510849670Z',
		});
		const ctx = createContext();

		const result = await getCoverage(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith('v3/coverage/current', 'test-key');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'veriphone.coverage',
			{},
			'completed',
		);
		expect(result.countries).toHaveLength(2);
		const first = result.countries[0];
		if (first === undefined) {
			throw new Error('expected at least one country');
		}
		expect(first.iso).toBe('US');
		expect(first.covered).toBe(true);
	});

	it('getCoverage rejects a response missing countries', async () => {
		mockRequest.mockResolvedValue({});
		const ctx = createContext();

		await expect(getCoverage(ctx, {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
});
