import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { EcologiContext } from './context';
import {
	getCarbonOffset,
	getCarbonRemoval,
	getHabitat,
	getImpact,
	getTrees,
} from './endpoints/get';
import {
	purchaseCarbonAvoidance,
	purchaseCarbonRemoval,
	purchaseHabitat,
	purchaseLocalTrees,
	purchaseTrees,
} from './endpoints/purchase';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(db?: EcologiContext['db']): EcologiContext {
	// A partial mock context: the endpoints read only `key` and `db`, so the
	// rest is left out on purpose. The `db` fixtures below are partial too.
	return { key: 'sekrit', db } as unknown as EcologiContext;
}

describe('ecologi reads', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores a tree total and does not send the key', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ total: 10, pending: 1, extra: 'no' });
		const result = await getTrees(
			context({
				trees: { upsertByEntityId: upsert },
			} as unknown as EcologiContext['db']),
			{ username: 'ecologi' },
		);
		expect(result.total).toEqual({ id: 'ecologi', total: 10, pending: 1 });
		expect(upsert).toHaveBeenCalledWith('ecologi', result.total);
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('extra');
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://public.ecologi.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toEqual({ Accept: 'application/json' });
		expect(JSON.stringify(config)).not.toContain('sekrit');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/users/ecologi/trees',
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('ecologi');
	});

	it('stores combined impact', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			trees: 1,
			carbonOffset: 2,
			carbonRemoval: 3,
			habitatRestoration: 4,
			pending: {
				trees: 5,
				carbonOffset: 6,
				carbonRemoval: 7,
				habitatRestoration: 8,
			},
		});
		const result = await getImpact(
			context({
				impacts: { upsertByEntityId: upsert },
			} as unknown as EcologiContext['db']),
			{ username: 'acme' },
		);
		expect(result.impact.pendingHabitatRestoration).toBe(8);
		expect(upsert).toHaveBeenCalledWith('acme', result.impact);
	});

	it('rejects a total body that is missing pending', async () => {
		mockRequest.mockResolvedValue({ total: 1 });
		await expect(getTrees(context(), { username: 'acme' })).rejects.toThrow(
			'missing total or pending',
		);
	});

	it('rejects a username with a slash before calling the API', async () => {
		await expect(getTrees(context(), { username: 'a/b' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 404 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/users/missing/trees' },
			{
				url: 'https://public.ecologi.com/users/missing/trees',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { error: 'User missing not found or is private' },
			},
			'not found',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getTrees(context(), { username: 'missing' })).rejects.toBe(
			error,
		);
	});

	it('returns the total when the database write fails', async () => {
		mockRequest.mockResolvedValue({ total: 3, pending: 0 });
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const result = await getTrees(
			context({
				trees: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db')),
				},
			} as unknown as EcologiContext['db']),
			{ username: 'acme' },
		);
		expect(result.total.total).toBe(3);
		expect(warn).toHaveBeenCalledWith('Failed to save Ecologi total');
		warn.mockRestore();
	});
});

describe.each([
	['carbonOffsets.get', getCarbonOffset, 'carbonOffsets', 'carbon-offset'],
	['carbonRemovals.get', getCarbonRemoval, 'carbonRemovals', 'carbon-removal'],
	['habitats.get', getHabitat, 'habitats', 'habitat-restoration'],
] as const)('%s', (_name, endpoint, table, path) => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it(`reads /users/{username}/${path} and saves the total to ${table}`, async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ total: 187.4, pending: 14.9 });
		const result = await endpoint(
			context({
				[table]: { upsertByEntityId: upsert },
			} as unknown as EcologiContext['db']),
			{ username: 'business-name' },
		);
		expect(result.total).toEqual({
			id: 'business-name',
			total: 187.4,
			pending: 14.9,
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: `/users/business-name/${path}`,
		});
		expect(upsert).toHaveBeenCalledWith('business-name', result.total);
	});
});

describe('ecologi purchases (mocked only; never run live)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const TREES_RESPONSE = {
		amount: 1.8,
		currency: 'GBP',
		treeUrl: 'https://app.ecologi.com/profile/test?tileId=604a',
		name: 'Order 1042',
		projectDetails: [
			{
				name: 'Forest restoration in Kenya',
				projectUrl: 'https://ecologi.com/projects/forest-restoration-in-kenya',
				splitPercentage: 100,
				splitAmountTrees: 3,
			},
		],
	};

	it('posts trees with the Bearer key, test flag and Idempotency-Key header', async () => {
		mockRequest.mockResolvedValue(TREES_RESPONSE);
		const result = await purchaseTrees(context(), {
			number: 3,
			name: 'Order 1042',
			test: true,
			idempotencyKey: 'order-1042',
		});
		expect(result.amount).toBe(1.8);
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config?.BASE).toBe('https://public.ecologi.com');
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Bearer sekrit',
			'Idempotency-Key': 'order-1042',
		});
		expect(options).toMatchObject({
			method: 'POST',
			url: '/impact/trees',
			mediaType: 'application/json',
			body: { number: 3, name: 'Order 1042', test: true },
		});
		expect(options?.body).not.toHaveProperty('idempotencyKey');
		const payload = mockLog.mock.calls[0]?.[2];
		expect(payload).toEqual({ number: 3, test: true });
		expect(JSON.stringify(payload)).not.toContain('Order 1042');
	});

	it('posts local trees with a country and carbon avoidance with units', async () => {
		mockRequest.mockResolvedValue({ amount: 11, currency: 'GBP' });
		await purchaseLocalTrees(context(), { number: 2, country: 'UK' });
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/impact/local-trees',
			body: { number: 2, country: 'UK' },
		});
		mockRequest.mockResolvedValue({
			number: 10,
			units: 'KG',
			numberInTonnes: 0.01,
			amount: 0.09,
			currency: 'GBP',
			tileUrl: 'https://app.ecologi.com/profile/business-name?tileId=abc123',
			projectDetails: [{ splitPercentage: 14, splitAmountTonnes: 0.0014 }],
		});
		const carbon = await purchaseCarbonAvoidance(context(), {
			number: 10,
			units: 'KG',
		});
		expect(carbon.numberInTonnes).toBe(0.01);
		expect(mockRequest.mock.calls[1]?.[1]).toMatchObject({
			url: '/impact/carbon',
			body: { number: 10, units: 'KG' },
		});
	});

	it('posts carbon removal and habitat restoration to their routes', async () => {
		mockRequest.mockResolvedValue({ amount: 1.5, currency: 'GBP' });
		await purchaseCarbonRemoval(context(), { number: 10 });
		await purchaseHabitat(context(), {
			number: 5.5,
			recipientEmail: 'pranay+ecologi-test@corsair.dev',
			test: true,
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/impact/carbon-removal',
			body: { number: 10 },
		});
		expect(mockRequest.mock.calls[1]?.[1]).toMatchObject({
			url: '/impact/habitat-restoration',
			body: { number: 5.5, test: true },
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('corsair.dev');
	});

	it('refuses out-of-range amounts and a bad email before any request', async () => {
		await expect(purchaseTrees(context(), { number: 0 })).rejects.toThrow();
		await expect(
			purchaseTrees(context(), { number: 250_001 }),
		).rejects.toThrow();
		await expect(
			purchaseHabitat(context(), { number: 0.05 }),
		).rejects.toThrow();
		await expect(
			purchaseLocalTrees(context(), { number: 1, country: 'FR' } as never),
		).rejects.toThrow();
		await expect(
			purchaseTrees(context(), { number: 1, recipientEmail: 'not-an-email' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('strips the name and recipient email from a failed purchase error', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/impact/trees',
					body: {
						number: 1,
						name: 'Jane Customer',
						recipientEmail: 'jane@example.com',
					},
				},
				{
					url: 'https://public.ecologi.com/impact/trees',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { responseCode: 'Unauthorized' },
				},
				'Unauthorized',
				{ retryAfter: 2 },
			),
		);
		const error = await purchaseTrees(context(), {
			number: 1,
			name: 'Jane Customer',
			recipientEmail: 'jane@example.com',
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(401);
		expect(apiError.retryAfter).toBe(2);
		expect(apiError.request.body).toEqual({
			number: 1,
			name: '[REDACTED]',
			recipientEmail: '[REDACTED]',
		});
		expect(JSON.stringify(apiError)).not.toContain('jane@example.com');
	});

	it('refuses a purchase without a key before any request', async () => {
		await expect(
			purchaseTrees({ key: '' } as unknown as EcologiContext, { number: 1 }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
