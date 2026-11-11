import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import {
	createETerminSignature,
	ETERMIN_API_BASE,
	makeETerminRequest,
} from './client';
import { eTerminOperations } from './operations';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

import { request } from 'corsair/http';

const mockRequest = request as jest.MockedFunction<typeof request>;

function headers(config: OpenAPIConfig): Record<string, string> {
	if (!config.HEADERS || typeof config.HEADERS === 'function') {
		throw new Error('Expected static request headers');
	}
	return config.HEADERS;
}

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

beforeEach(() => mockRequest.mockReset());

describe('eTermin request authentication', () => {
	it('uses eTermin production host and HMAC headers without Authorization', async () => {
		mockRequest.mockResolvedValue({});
		await makeETerminRequest(
			'/api/timeslots',
			{ publicKey: 'public', privateKey: 'private' },
			{
				method: 'GET',
				query: { date: '2026-11-12' },
			},
		);
		const [config, options] = lastCall();
		expect(config.BASE).toBe(ETERMIN_API_BASE);
		expect(config.TOKEN).toBeUndefined();
		const requestHeaders = headers(config);
		expect(requestHeaders).toMatchObject({ publickey: 'public' });
		expect(requestHeaders).not.toHaveProperty('Authorization');
		expect(typeof requestHeaders.salt).toBe('string');
		expect(requestHeaders.signature).toBe(
			createETerminSignature(requestHeaders.salt ?? '', 'private'),
		);
		expect(options).toMatchObject({
			method: 'GET',
			url: '/api/timeslots',
			query: { date: '2026-11-12' },
		});
	});

	it('creates a new salt and signature for each request', async () => {
		mockRequest.mockResolvedValue({});
		await makeETerminRequest(
			'/api/calendar',
			{ publicKey: 'public', privateKey: 'private' },
			{ method: 'GET' },
		);
		const [first] = lastCall();
		await makeETerminRequest(
			'/api/calendar',
			{ publicKey: 'public', privateKey: 'private' },
			{ method: 'GET' },
		);
		const [second] = lastCall();
		expect(headers(first).salt).not.toBe(headers(second).salt);
		expect(headers(first).signature).not.toBe(headers(second).signature);
	});
});

describe('eTermin operation catalog', () => {
	it('contains all 70 unique documented operations with query-only transport', () => {
		expect(eTerminOperations).toHaveLength(70);
		expect(
			new Set(eTerminOperations.map((operation) => operation.key)).size,
		).toBe(70);
		for (const operation of eTerminOperations) {
			expect(operation.path).toMatch(/^\/api\//);
			expect(['GET', 'POST', 'PUT', 'DELETE']).toContain(operation.method);
		}
	});
});

describe('eTermin query transport', () => {
	it.each([
		['GET', '/api/timeslots'],
		['POST', '/api/appointment'],
		['PUT', '/api/appointment'],
		['DELETE', '/api/appointment'],
	] as const)(
		'%s retains false and zero query values for %s',
		async (method, path) => {
			mockRequest.mockResolvedValue({});
			await makeETerminRequest(
				path,
				{ publicKey: 'public', privateKey: 'private' },
				{
					method,
					query: { enabled: false, index: 0 },
				},
			);
			const [, options] = lastCall();
			expect(options).toMatchObject({
				method,
				url: path,
				query: { enabled: false, index: 0 },
			});
		},
	);
});
