import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { makeHookdeckRequest } from './client';
import {
	connectionsCreate,
	connectionsDelete,
	connectionsGet,
	connectionsList,
	connectionsUpdate,
} from './endpoints/connections';
import type { ConnectionsGetResponse } from './endpoints/types';
import type { HookdeckContext } from './index';
import { matchHookdeckTenantWebhook } from './webhooks/tenant-matcher';
import type { HookdeckWebhookPayload } from './webhooks/types';
import {
	createHookdeckMatch,
	verifyHookdeckWebhookSignature,
} from './webhooks/types';

jest.mock('./client', () => ({
	makeHookdeckRequest: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

// Narrow assertion: safe because jest.mock() replaces the module export at
// runtime; jest's types do not propagate automatically so the mocked-function
// cast is the practical way to access mock APIs.
const mockedRequest = makeHookdeckRequest as jest.MockedFunction<
	typeof makeHookdeckRequest
>;

// Narrow assertion: safe because connection handlers only read ctx.key and
// the full plugin context is built by the runtime; no better type is
// practical for this unit test.
const mockCtx = { key: 'test-api-key' } as HookdeckContext;

const makeConnection = (overrides: Partial<ConnectionsGetResponse> = {}) => ({
	id: 'conn_1',
	team_id: 'team_1',
	name: 'my-connection',
	full_name: 'source -> destination',
	disabled_at: null,
	paused_at: null,
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
	...overrides,
});

describe('connections endpoints', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
	});

	it('connectionsList calls GET /connections and returns the response', async () => {
		const mockResponse = {
			models: [makeConnection(), makeConnection({ id: 'conn_2' })],
			count: 2,
		};
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsList(mockCtx, {});

		expect(mockedRequest).toHaveBeenCalledWith('connections', 'test-api-key', {
			method: 'GET',
			query: {},
		});
		expect(result).toEqual(mockResponse);
	});

	it('connectionsList passes pagination params through as query params', async () => {
		const input = {
			limit: 50,
			next: 'web_abc123',
			order_by: 'created_at',
			dir: 'desc' as const,
		};
		const mockResponse = {
			models: [makeConnection()],
			count: 1,
			pagination: {
				order_by: 'created_at',
				dir: 'desc',
				limit: 50,
				next: 'web_def456',
			},
		};
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsList(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith('connections', 'test-api-key', {
			method: 'GET',
			query: { ...input },
		});
		expect(result).toEqual(mockResponse);
	});

	it('connectionsCreate calls POST /connections with the input body', async () => {
		const input = {
			name: 'my-connection',
			source_id: 'src_1',
			destination_id: 'dst_1',
		};
		const mockResponse = makeConnection({
			id: 'conn_new',
			name: input.name,
		});
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsCreate(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith('connections', 'test-api-key', {
			method: 'POST',
			body: { ...input },
		});
		expect(result).toEqual(mockResponse);
	});

	it('connectionsGet calls GET /connections/:id', async () => {
		const input = { id: 'conn_1' };
		const mockResponse = makeConnection();
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsGet(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'connections/conn_1',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
	});

	it('connectionsUpdate calls PUT /connections/:id with the remaining body (id stripped)', async () => {
		const input = { id: 'conn_1', name: 'renamed-connection' };
		const mockResponse = makeConnection({ name: 'renamed-connection' });
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsUpdate(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'connections/conn_1',
			'test-api-key',
			{
				method: 'PUT',
				body: { name: 'renamed-connection' },
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('connectionsDelete calls DELETE /connections/:id', async () => {
		const input = { id: 'conn_1' };
		// Matches the real DELETE /connections/{id} response shape ({ id }).
		const mockResponse = { id: 'conn_1' };
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsDelete(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'connections/conn_1',
			'test-api-key',
			{ method: 'DELETE' },
		);
		expect(result).toEqual({ id: 'conn_1' });
	});

	it('propagates errors from makeHookdeckRequest', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('API request failed'));

		await expect(connectionsList(mockCtx, {})).rejects.toThrow(
			'API request failed',
		);
	});
});

describe('verifyHookdeckWebhookSignature', () => {
	const secret = 'hookdeck-secret';
	const rawBody =
		'{"type":"example","created_at":"2026-01-01T00:00:00.000Z","data":{"id":"evt_1"}}';
	const validSignature = '0Z9gr7R90KjNqsh1CDqVmAEbNp+Cm6dofEcaVrJ+UXE=';
	const validSignature2 = '0Z9gr7R90KjNqsh1CDqVmAEbNp+Cm6dofEcaVrJ+UXE=';

	function makeRequest(
		overrides: Partial<WebhookRequest<HookdeckWebhookPayload>> = {},
	): WebhookRequest<HookdeckWebhookPayload> {
		return {
			payload: {
				type: 'example',
				created_at: '2026-01-01T00:00:00.000Z',
				data: { id: 'evt_1' },
			},
			headers: {
				'x-hookdeck-signature': validSignature,
			},
			rawBody,
			...overrides,
		};
	}

	it('accepts valid primary signature', () => {
		const result = verifyHookdeckWebhookSignature(makeRequest(), secret);
		expect(result).toEqual({ valid: true });
	});

	it('accepts valid fallback signature when primary is invalid', () => {
		const result = verifyHookdeckWebhookSignature(
			makeRequest({
				headers: {
					'x-hookdeck-signature': 'invalid',
					'x-hookdeck-signature-2': validSignature2,
				},
			}),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('returns invalid when both signatures are missing', () => {
		const result = verifyHookdeckWebhookSignature(
			makeRequest({ headers: {} }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hookdeck-signature or x-hookdeck-signature-2 header',
		});
	});

	it('returns invalid when signature does not match', () => {
		const result = verifyHookdeckWebhookSignature(
			makeRequest({
				headers: {
					'x-hookdeck-signature': 'invalid',
				},
			}),
			secret,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid signature' });
	});

	it('returns invalid without secret unless already hub verified', () => {
		const result = verifyHookdeckWebhookSignature(makeRequest(), '');
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('accepts hub-verified requests without plugin verification', () => {
		const result = verifyHookdeckWebhookSignature(
			makeRequest({ hubVerified: true, headers: {} }),
			'',
		);
		expect(result).toEqual({ valid: true });
	});
});

describe('hookdeck webhook matching', () => {
	function rawRequest(body: RawWebhookRequest['body']): RawWebhookRequest {
		return { headers: {}, body };
	}

	it('matches the example event type on parsed and string bodies', () => {
		const match = createHookdeckMatch('example');
		expect(match(rawRequest({ type: 'example', data: { id: 'evt_1' } }))).toBe(
			true,
		);
		expect(match(rawRequest('{"type":"example","data":{"id":"evt_1"}}'))).toBe(
			true,
		);
		expect(match(rawRequest({ type: 'other', data: {} }))).toBe(false);
	});

	it('resolves the tenant from top-level and nested team ids', () => {
		expect(matchHookdeckTenantWebhook(rawRequest({ team_id: 'tm_1' }))).toEqual(
			{ linkType: 'tenant_external_id', externalId: 'tm_1' },
		);
		expect(
			matchHookdeckTenantWebhook(rawRequest({ data: { team_id: 'tm_2' } })),
		).toEqual({ linkType: 'tenant_external_id', externalId: 'tm_2' });
		expect(matchHookdeckTenantWebhook(rawRequest({ data: {} }))).toBeNull();
	});
});
