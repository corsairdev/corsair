import { request } from 'corsair/http';
import { buildBasecampWireRequest } from './endpoints/factory';
import { basecampOperationCatalog } from './endpoints/operations';
import { BasecampEndpointInputSchemas } from './endpoints/types';
import { basecamp } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;
type Endpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function context() {
	return {
		key: 'test-access-token',
		options: {
			accountId: '42',
			userAgent: 'Corsair Test (test@example.com)',
		},
		keys: { get_account_id: jest.fn().mockResolvedValue('42') },
		db: {},
		database: undefined,
		$getAccountId: jest.fn().mockResolvedValue('test-corsair-account'),
	};
}

describe('Basecamp routing coverage', () => {
	const plugin = basecamp({ key: 'test-access-token', accountId: '42' });
	const endpointGroups = plugin.endpoints as unknown as Record<
		string,
		Record<string, Endpoint>
	>;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('registers exactly 161 unique catalog operations', () => {
		expect(basecampOperationCatalog).toHaveLength(161);
		expect(new Set(basecampOperationCatalog.map((row) => row.code)).size).toBe(
			161,
		);
		expect(new Set(basecampOperationCatalog.map((row) => row.path)).size).toBe(
			161,
		);
	});

	it.each(basecampOperationCatalog)(
		'$code validates and dispatches $httpMethod $apiPath',
		async (operation) => {
			const parsed = BasecampEndpointInputSchemas[operation.key].parse(
				operation.exampleInput,
			);
			const wire = buildBasecampWireRequest(operation, parsed, '42');
			expect(wire.url).not.toMatch(/[{}]/);
			expect(wire.url).not.toContain('undefined');
			expect(wire.method).toBe(operation.httpMethod);
			expect(wire.retrySafe).toBe(operation.riskLevel === 'read');

			mockRequest.mockResolvedValueOnce(operation.exampleOutput);
			const endpoint = endpointGroups[operation.group]?.[operation.key];
			expect(typeof endpoint).toBe('function');
			await endpoint?.(context(), parsed);
			expect(mockRequest).toHaveBeenCalledTimes(1);

			const [config, requestOptions, transport] =
				mockRequest.mock.calls[0] ?? [];
			expect(requestOptions?.method).toBe(operation.httpMethod);
			expect(requestOptions?.url).toBe(wire.url);
			expect(JSON.stringify(requestOptions)).not.toContain('undefined');
			if (operation.chatbotAuth) {
				expect(config?.HEADERS).not.toHaveProperty('Authorization');
			} else {
				expect(config?.HEADERS).toMatchObject({
					Authorization: 'Bearer test-access-token',
				});
			}
			expect(transport?.rateLimitConfig?.maxRetries).toBe(
				operation.riskLevel === 'read' ? 3 : 0,
			);
		},
	);

	it('uses the keyed chatbot URL without leaking the key into audit data', () => {
		const operation = basecampOperationCatalog.find(
			(row) => row.providerOperationId === 'PostChatbotLine',
		);
		expect(operation).toBeDefined();
		const wire = buildBasecampWireRequest(
			operation!,
			{ chatbotKey: 'secret-key', bucketId: 1, campfireId: 2, content: 'hi' },
			'42',
		);
		expect(wire.url).toContain('/integrations/secret-key/');
		expect(wire.authenticated).toBe(false);
	});
});
