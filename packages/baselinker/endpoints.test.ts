import { ApiError } from 'corsair/http';
import { auditPayload } from './endpoints/logging';
import { baseLinkerOperationCatalog } from './endpoints/operations';
import { errorHandlers } from './error-handlers';
import {
	baseLinkerEndpointMeta,
	baseLinkerEndpointSchemas,
	baseLinkerEndpointsNested,
} from './index';

type TestEndpoint = (
	context: Record<string, unknown>,
	input: Record<string, unknown>,
) => Promise<unknown>;

function flattenEndpoints(): Map<string, TestEndpoint> {
	const result = new Map<string, TestEndpoint>();
	for (const [group, endpoints] of Object.entries(baseLinkerEndpointsNested)) {
		for (const [name, endpoint] of Object.entries(endpoints)) {
			result.set(`${group}.${name}`, endpoint as unknown as TestEndpoint);
		}
	}
	return result;
}

const originalFetch = global.fetch;
let lastBody = '';

beforeAll(() => {
	global.fetch = (async (_url: string, init: RequestInit) => {
		lastBody = String(init.body ?? '');
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: 'https://api.baselinker.com/connector.php',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({ status: 'SUCCESS' }),
			text: async () => '{"status":"SUCCESS"}',
		};
	}) as unknown as typeof global.fetch;
});

afterAll(() => {
	global.fetch = originalFetch;
});

describe('operation registry', () => {
	it('registers exactly the 106 requested operations', () => {
		const endpoints = flattenEndpoints();
		expect(baseLinkerOperationCatalog).toHaveLength(106);
		expect(endpoints).toHaveProperty('size', 106);
		expect(
			new Set(baseLinkerOperationCatalog.map((operation) => operation.code)),
		).toHaveProperty('size', 106);
	});

	it('keeps endpoint, schema and metadata paths identical', () => {
		const endpointPaths = [...flattenEndpoints().keys()].sort();
		const schemaPaths = Object.keys(baseLinkerEndpointSchemas).sort();
		const metadataPaths = Object.keys(baseLinkerEndpointMeta).sort();
		expect(schemaPaths).toEqual(endpointPaths);
		expect(metadataPaths).toEqual(endpointPaths);
		expect(
			baseLinkerOperationCatalog.map((operation) => operation.path).sort(),
		).toEqual(endpointPaths);
	});

	it('routes every wrapper to its exact provider method', async () => {
		const endpoints = flattenEndpoints();
		const context = {
			key: 'fake-baselinker-token-for-tests-only',
			db: {},
			database: undefined,
			$getAccountId: async () => 'test-account',
		};

		let exercised = 0;
		for (const operation of baseLinkerOperationCatalog) {
			const endpoint = endpoints.get(operation.path);
			expect(endpoint).toBeDefined();
			await endpoint?.(context, {});
			const form = new URLSearchParams(lastBody);
			expect(form.get('method')).toBe(operation.method);
			exercised += 1;
		}
		expect(exercised).toBe(106);
	});

	it('tolerates a no-argument call to a parameterless operation', async () => {
		const endpoint = flattenEndpoints().get('inventory.getInventories');
		const context = {
			key: 'fake-baselinker-token-for-tests-only',
			db: {},
			database: undefined,
			$getAccountId: async () => 'test-account',
		};
		await expect(
			endpoint?.(context, undefined as unknown as Record<string, unknown>),
		).resolves.toBeDefined();
	});

	it('marks reads, writes and destructive calls from provider semantics', () => {
		const reads = baseLinkerOperationCatalog.filter(
			(operation) => operation.riskLevel === 'read',
		);
		const destructive = baseLinkerOperationCatalog.filter(
			(operation) => operation.riskLevel === 'destructive',
		);
		expect(reads.length).toBeGreaterThan(50);
		expect(destructive.length).toBeGreaterThan(10);
		expect(baseLinkerEndpointMeta['inventory.deleteInventory']).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
	});
});

describe('retry and audit safety', () => {
	type HandlerContext = Parameters<
		typeof errorHandlers.NETWORK_ERROR.handler
	>[1];

	it('retries reads but never replays writes after a network failure', async () => {
		const error = new Error('fetch failed');
		const read = await errorHandlers.NETWORK_ERROR.handler(error, {
			operation: 'inventory.getInventories',
		} as HandlerContext);
		const write = await errorHandlers.NETWORK_ERROR.handler(error, {
			operation: 'orders.addOrder',
		} as HandlerContext);
		expect(read.maxRetries).toBe(3);
		expect(write.maxRetries).toBe(0);
	});

	it('classifies HTTP 403 as a permission error, not an auth error', () => {
		const forbidden = new ApiError(
			{ method: 'POST', url: '/connector.php' } as never,
			{
				url: 'https://api.baselinker.com/connector.php',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: {},
			} as never,
			'Forbidden',
		);
		expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(false);
		expect(errorHandlers.PERMISSION_ERROR.match(forbidden)).toBe(true);
	});

	it('retains field names, identifiers and counts without customer values', () => {
		const payload = auditPayload({
			order_id: 42,
			email: 'customer@example.com',
			phone: '+15550100',
			admin_comments: 'private note',
			order_ids: [41, 42],
			want_invoice: false,
		});
		expect(payload.order_id).toBe(42);
		expect(payload.order_ids_count).toBe(2);
		expect(payload.want_invoice).toBe(false);
		expect(JSON.stringify(payload)).not.toContain('customer@example.com');
		expect(JSON.stringify(payload)).not.toContain('private note');
	});
});
