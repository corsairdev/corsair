import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import * as Assistants from './endpoints/assistants';
import * as billing from './endpoints/billing';
import * as buckets from './endpoints/buckets';
import * as DataConnectors from './endpoints/data-connectors';
import * as Functions from './endpoints/functions';
import * as Integrations from './endpoints/integrations';
import * as KnowledgeBases from './endpoints/knowledge-bases';
import * as Libraries from './endpoints/libraries';
import * as Messages from './endpoints/messages';
import * as misc from './endpoints/misc';
import * as models from './endpoints/models';
import * as organizations from './endpoints/organizations';
import {
	createComponent,
	createRetriever,
	getComponent,
	getRetriever,
	listComponents,
	listRetrievers,
	queryRetriever,
	updateComponent,
	updateRetriever,
} from './endpoints/retrievers';
import {
	createRule,
	createRuleset,
	getRule,
	getRuleset,
	getRulesetByAlias,
	listRules,
	removeRule,
	removeRuleset,
	updateRule,
	updateRuleset,
} from './endpoints/rules';
import * as Secrets from './endpoints/secrets';
import * as Structures from './endpoints/structures';
import * as Threads from './endpoints/threads';
import * as Tools from './endpoints/tools';
import type {
	AssistantGetResponse,
	AssistantListResponse,
} from './endpoints/types';
import {
	GriptapeEndpointInputSchemas,
	GriptapeEndpointOutputSchemas,
} from './endpoints/types';
import * as users from './endpoints/users';
import type { GriptapeContext } from './index';
import { griptape } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = jest.mocked(logEventFromContext);

describe('Griptape Plugin API', () => {
	const apiKey = 'test-api-key';

	const griptapePlugin = griptape({ key: apiKey });
	const endpoints = griptapePlugin.endpoints;
	if (!endpoints) throw new Error('griptape plugin must expose endpoints');

	// Narrow assertion: the handlers under test only read ctx.key, and
	// logEventFromContext is mocked above, so a partial context is safe here.
	// A full context would require constructing the encrypted key manager.
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	describe('assistant.list', () => {
		it('sends GET /assistants with pagination parameters', async () => {
			const mockResponse: AssistantListResponse = {
				assistants: [
					{
						assistant_id: '550e8400-e29b-41d4-a716-446655440000',
						created_at: '2026-01-01T00:00:00Z',
						created_by: 'user@example.com',
						description: 'Test assistant',
						input: 'text',
						knowledge_base_ids: [],
						model: 'gpt-5',
						name: 'Test Assistant',
						organization_id: '550e8400-e29b-41d4-a716-446655440001',
						retriever_ids: [],
						ruleset_ids: [],
						structure_ids: [],
						tool_ids: [],
						updated_at: '2026-01-01T00:00:00Z',
					},
				],
				pagination: {
					page_number: 1,
					page_size: 10,
					total_count: 1,
					total_pages: 1,
					next_page: 2,
					previous_page: 0,
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await endpoints.assistant.list(ctx, {
				page: 1,
				page_size: 10,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://cloud.griptape.ai/api',
					HEADERS: expect.objectContaining({
						Authorization: `Bearer ${apiKey}`,
					}),
				}),
				expect.objectContaining({
					method: 'GET',
					url: 'assistants',
					query: {
						page: 1,
						page_size: 10,
					},
				}),
			);

			expect(result).toEqual(mockResponse);
		});

		it('lists assistants without optional pagination parameters', async () => {
			const mockResponse: AssistantListResponse = {
				assistants: [],
				pagination: {
					page_number: 1,
					page_size: 20,
					total_count: 0,
					total_pages: 0,
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await endpoints.assistant.list(ctx, {});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: 'assistants',
					query: {
						page: undefined,
						page_size: undefined,
					},
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('assistant.get', () => {
		it('sends GET /assistants/{assistant_id}', async () => {
			const mockResponse: AssistantGetResponse = {
				assistant_id: '550e8400-e29b-41d4-a716-446655440000',
				created_at: '2026-01-01T00:00:00Z',
				created_by: 'user@example.com',
				description: 'Test assistant',
				knowledge_base_ids: [],
				name: 'Test Assistant',
				organization_id: '550e8400-e29b-41d4-a716-446655440001',
				retriever_ids: [],
				ruleset_ids: [],
				structure_ids: [],
				tool_ids: [],
				updated_at: '2026-01-01T00:00:00Z',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await endpoints.assistant.get(ctx, {
				assistant_id: '550e8400-e29b-41d4-a716-446655440000',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://cloud.griptape.ai/api',
					HEADERS: expect.objectContaining({
						Authorization: `Bearer ${apiKey}`,
					}),
				}),
				expect.objectContaining({
					method: 'GET',
					url: 'assistants/550e8400-e29b-41d4-a716-446655440000',
				}),
			);

			expect(result).toEqual(mockResponse);
		});

		it('propagates ApiError unchanged so status-based handlers keep working', async () => {
			const requestOptions = {
				method: 'GET' as const,
				url: 'assistants/550e8400-e29b-41d4-a716-446655440000',
			};
			const rateLimitError = new ApiError(
				requestOptions,
				{
					url: 'https://cloud.griptape.ai/api/assistants/550e8400-e29b-41d4-a716-446655440000',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { message: 'Too Many Requests' },
				},
				'Too Many Requests',
				{ retryAfter: 30000 },
			);

			mockRequest.mockRejectedValueOnce(rateLimitError);

			await expect(
				endpoints.assistant.get(ctx, {
					assistant_id: '550e8400-e29b-41d4-a716-446655440000',
				}),
			).rejects.toBe(rateLimitError);
			expect(mockLog).not.toHaveBeenCalled();
		});

		it('rejects non-UUID assistant ids at the input schema boundary', () => {
			const result = GriptapeEndpointInputSchemas.assistantGet.safeParse({
				assistant_id: 'not-a-uuid',
			});

			expect(result.success).toBe(false);
		});
	});

	describe('endpoint schemas', () => {
		it('validates well-formed list responses through the output schema', () => {
			const parsed = GriptapeEndpointOutputSchemas.assistantList.safeParse({
				assistants: [],
				pagination: {
					page_number: 2,
					page_size: 20,
					total_count: 41,
					total_pages: 3,
					next_page: 3,
					previous_page: 1,
				},
			});

			expect(parsed.success).toBe(true);
		});

		it('rejects responses with missing pagination fields', () => {
			const parsed = GriptapeEndpointOutputSchemas.assistantList.safeParse({
				assistants: [],
			});

			expect(parsed.success).toBe(false);
		});

		it('rejects detail payloads where ids are not UUIDs', () => {
			const parsed = GriptapeEndpointOutputSchemas.assistantGet.safeParse({
				assistant_id: 'garbage-id',
				created_at: '2026-01-01T00:00:00Z',
				created_by: 'user@example.com',
				description: 'Test assistant',
				knowledge_base_ids: [],
				name: 'Test Assistant',
				organization_id: '550e8400-e29b-41d4-a716-446655440001',
				retriever_ids: [],
				ruleset_ids: [],
				structure_ids: [],
				tool_ids: [],
				updated_at: '2026-01-01T00:00:00Z',
			});

			expect(parsed.success).toBe(false);
		});
	});
});

describe('griptape assistant runs', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;
	const assistantId = '550e8400-e29b-41d4-a716-446655440000';
	const runId = '660e8400-e29b-41d4-a716-446655440000';

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	describe('createRun', () => {
		it('sends POST /assistants/{assistant_id}/runs with explicit body fields', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'running',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Assistants.createRun(ctx, {
				assistant_id: assistantId,
				input: 'Hello',
				model: 'gpt-5',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'POST',
					url: `assistants/${assistantId}/runs`,
					body: expect.objectContaining({
						input: 'Hello',
						model: 'gpt-5',
					}),
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('listRuns', () => {
		it('sends GET /assistants/{assistant_id}/runs with pagination', async () => {
			const mockResponse = {
				pagination: {
					page_number: 1,
					page_size: 10,
					total_count: 1,
					total_pages: 1,
				},
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Assistants.listRuns(ctx, {
				assistant_id: assistantId,
				page: 1,
				page_size: 10,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistants/${assistantId}/runs`,
					query: { page: 1, page_size: 10 },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('getRun', () => {
		it('sends GET /assistant-runs/{assistant_run_id}', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'completed',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Assistants.getRun(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('cancelRun', () => {
		it('sends POST /assistant-runs/{assistant_run_id}/cancel', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'cancelled',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Assistants.cancelRun(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'POST',
					url: `assistant-runs/${runId}/cancel`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('getResult', () => {
		it('sends GET /assistant-runs/{assistant_run_id} for the run result', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'completed',
				output: 'Hello back',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Assistants.getResult(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('getErrorDetails', () => {
		it('sends GET /assistant-runs/{assistant_run_id} carrying embedded error details', async () => {
			const mockResponse = {
				assistant_run_id: runId,
				status: 'failed',
				error: 'Upstream model timed out',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Assistants.getErrorDetails(ctx, {
				assistant_run_id: runId,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('listLogs', () => {
		it('sends GET /assistant-runs/{assistant_run_id}/events with limit/offset', async () => {
			const mockResponse = {
				events: [],
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Assistants.listLogs(ctx, {
				assistant_run_id: runId,
				limit: 20,
				offset: 0,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}/events`,
					query: { limit: 20, offset: 0 },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('listEvents', () => {
		it('sends GET /assistant-runs/{assistant_run_id}/events with limit/offset', async () => {
			const mockResponse = {
				events: [
					{
						event_id: '770e8400-e29b-41d4-a716-446655440000',
						type: 'run_started',
					},
				],
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Assistants.listEvents(ctx, {
				assistant_run_id: runId,
				limit: 10,
				offset: 0,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `assistant-runs/${runId}/events`,
					query: { limit: 10, offset: 0 },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('input schemas', () => {
		it('accepts a well-formed assistantRunCreate payload', () => {
			const parsed = GriptapeEndpointInputSchemas.assistantRunCreate.safeParse({
				assistant_id: assistantId,
				input: 'Hello',
				model: 'gpt-5',
			});

			expect(parsed.success).toBe(true);
		});

		it('rejects assistantRunEvents with an empty run id', () => {
			const parsed = GriptapeEndpointInputSchemas.assistantRunEvents.safeParse({
				assistant_run_id: '',
				limit: 10,
			});

			expect(parsed.success).toBe(false);
		});
	});
});

describe('griptape assistants mutating endpoints', () => {
	const apiKey = 'test-api-key';
	// Narrow assertion: handlers under test only read ctx.key, and
	// logEventFromContext is mocked above.
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	it('create sends POST /assistants with the input body', async () => {
		const payload = { assistant_id: 'a-1', name: 'Support Bot' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await Assistants.create(ctx, {
			body: { name: 'Support Bot', description: 'l1 support' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://cloud.griptape.ai/api',
				HEADERS: expect.objectContaining({
					Authorization: `Bearer ${apiKey}`,
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: 'assistants',
				body: { name: 'Support Bot', description: 'l1 support' },
			}),
		);
		expect(result).toEqual(payload);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'griptape.assistant.create',
			expect.anything(),
			'completed',
		);
	});

	it('update sends PATCH /assistants/{assistant_id} with the input body', async () => {
		const payload = { assistant_id: 'a-1', name: 'Renamed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await Assistants.update(ctx, {
			assistant_id: 'a-1',
			body: { name: 'Renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PATCH',
				url: 'assistants/a-1',
				body: { name: 'Renamed' },
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE /assistants/{assistant_id} with no body', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Assistants.remove(ctx, { assistant_id: 'a-1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: 'assistants/a-1',
			}),
		);
		expect(result).toBeUndefined();
	});

	it('validates assistantCreate input bodies', () => {
		expect(
			GriptapeEndpointInputSchemas.assistantCreate.safeParse({
				body: { name: 'Support Bot' },
			}).success,
		).toBe(true);
		expect(
			GriptapeEndpointInputSchemas.assistantCreate.safeParse({
				body: 'not-an-object',
			}).success,
		).toBe(false);
	});

	it('rejects assistantUpdate without an id', () => {
		expect(
			GriptapeEndpointInputSchemas.assistantUpdate.safeParse({
				body: { name: 'x' },
			}).success,
		).toBe(false);
		expect(
			GriptapeEndpointInputSchemas.assistantDelete.safeParse({
				assistant_id: '',
			}).success,
		).toBe(false);
	});
});

describe('griptape billing endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('billing.managementUrl sends POST /billing/management-url', async () => {
		const payload = { url: 'https://example.com/billing/session' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await billing.managementUrl(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'billing/management-url',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('billing.creditBalance sends GET /credits/balance', async () => {
		const payload = { balance: 1250, currency: 'credits' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await billing.creditBalance(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'credits/balance' }),
		);
		expect(result).toEqual(payload);
	});

	it('billing.usage sends GET /usage', async () => {
		const payload = { period: '2026-08', total_runs: 42 };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await billing.usage(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'usage' }),
		);
		expect(result).toEqual(payload);
	});

	it('billing.config sends GET /config', async () => {
		const payload = { billing_enabled: true };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await billing.config(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'config' }),
		);
		expect(result).toEqual(payload);
	});

	it('accepts empty billingManagementUrl input', () => {
		const parsed = GriptapeEndpointInputSchemas.billingManagementUrl.safeParse(
			{},
		);

		expect(parsed.success).toBe(true);
	});

	it('accepts empty creditsBalance input', () => {
		const parsed = GriptapeEndpointInputSchemas.creditsBalance.safeParse({});

		expect(parsed.success).toBe(true);
	});
});

describe('griptape bucket endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('bucket.list sends GET /buckets with pagination', async () => {
		const payload = {
			buckets: [],
			pagination: {
				page_number: 1,
				page_size: 10,
				total_count: 0,
				total_pages: 0,
			},
		};
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'buckets' }),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.create sends POST /buckets', async () => {
		const payload = { bucket_id: 'bucket-test-001', name: 'test-bucket' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.create(ctx, { body: { name: 'test-bucket' } });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'buckets' }),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.get sends GET /buckets/{bucket_id}', async () => {
		const payload = { bucket_id: 'bucket-test-001', name: 'test-bucket' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.get(ctx, { bucket_id: 'bucket-test-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'buckets/bucket-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.update sends PATCH /buckets/{bucket_id}', async () => {
		const payload = { bucket_id: 'bucket-test-001', name: 'renamed-bucket' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.update(ctx, {
			bucket_id: 'bucket-test-001',
			body: { name: 'renamed-bucket' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'buckets/bucket-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.delete sends DELETE /buckets/{bucket_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await buckets.remove(ctx, { bucket_id: 'bucket-test-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'buckets/bucket-test-001',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('bucket.listAssets sends GET /buckets/{bucket_id}/assets with filters', async () => {
		const payload = { assets: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.listAssets(ctx, {
			bucket_id: 'bucket-test-001',
			page: 1,
			page_size: 10,
			prefix: 'docs/',
			postfix: '.pdf',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'buckets/bucket-test-001/assets',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.getAsset sends GET /buckets/{bucket_id}/assets/{name}', async () => {
		const payload = { name: 'report.pdf', bucket_id: 'bucket-test-001' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.getAsset(ctx, {
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'buckets/bucket-test-001/assets/report.pdf',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.createAsset sends PUT /buckets/{bucket_id}/assets', async () => {
		const payload = { name: 'report.pdf', bucket_id: 'bucket-test-001' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.createAsset(ctx, {
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
			body: { content_type: 'application/pdf' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PUT',
				url: 'buckets/bucket-test-001/assets',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('bucket.deleteAsset sends DELETE /buckets/{bucket_id}/assets/{name}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await buckets.deleteAsset(ctx, {
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'buckets/bucket-test-001/assets/report.pdf',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('bucket.assetUrl sends POST /buckets/{bucket_id}/asset-urls/{name}', async () => {
		const payload = { url: 'https://example.com/signed/report.pdf' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await buckets.assetUrl(ctx, {
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
			body: { expires_in: 3600 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'buckets/bucket-test-001/asset-urls/report.pdf',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates bucketCreateAsset input and rejects an empty name', () => {
		const valid = GriptapeEndpointInputSchemas.bucketCreateAsset.safeParse({
			bucket_id: 'bucket-test-001',
			name: 'report.pdf',
		});

		expect(valid.success).toBe(true);
	});

	it('rejects bucketCreateAsset input with an empty name', () => {
		const invalid = GriptapeEndpointInputSchemas.bucketCreateAsset.safeParse({
			bucket_id: 'bucket-test-001',
			name: '',
		});

		expect(invalid.success).toBe(false);
	});
});

describe('griptape data-connectors endpoints', () => {
	const ctx = { key: 'test-api-key' } as unknown as GriptapeContext;
	const connectorId = '550e8400-e29b-41d4-a716-446655440020';
	const dataJobId = '550e8400-e29b-41d4-a716-446655440021';

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('list sends GET data-connectors with pagination', async () => {
		const payload = { data: [], pagination: { page_number: 1 } };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.list(ctx, {
			page: 1,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'data-connectors' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST data-connectors', async () => {
		const payload = { data_connector_id: connectorId, name: 'dc-one' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.create(ctx, {
			body: { name: 'dc-one' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'data-connectors' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET data-connectors/{id}', async () => {
		const payload = { data_connector_id: connectorId, name: 'dc-one' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.get(ctx, {
			data_connector_id: connectorId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `data-connectors/${connectorId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH data-connectors/{id}', async () => {
		const payload = { data_connector_id: connectorId, name: 'dc-renamed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.update(ctx, {
			data_connector_id: connectorId,
			body: { name: 'dc-renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: `data-connectors/${connectorId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE data-connectors/{id}', async () => {
		const payload = undefined as unknown as Record<string, never>;
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.remove(ctx, {
			data_connector_id: connectorId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: `data-connectors/${connectorId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('createJob sends POST data-connectors/{id}/data-jobs', async () => {
		const payload = { data_job_id: dataJobId, status: 'queued' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.createJob(ctx, {
			data_connector_id: connectorId,
			body: { source: 's3' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `data-connectors/${connectorId}/data-jobs`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('getDataJob sends GET data-jobs/{id}', async () => {
		const payload = { data_job_id: dataJobId, status: 'done' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.getDataJob(ctx, {
			data_job_id: dataJobId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `data-jobs/${dataJobId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('cancelDataJob sends POST data-jobs/{id}/cancel', async () => {
		const payload = { data_job_id: dataJobId, status: 'cancelled' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await DataConnectors.cancelDataJob(ctx, {
			data_job_id: dataJobId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `data-jobs/${dataJobId}/cancel`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates dataConnectorCreateJob input', () => {
		const parsed =
			GriptapeEndpointInputSchemas.dataConnectorCreateJob.safeParse({
				data_connector_id: connectorId,
				body: { source: 's3' },
			});

		expect(parsed.success).toBe(true);
	});

	it('rejects dataConnectorCreateJob with an empty connector id', () => {
		const parsed =
			GriptapeEndpointInputSchemas.dataConnectorCreateJob.safeParse({
				data_connector_id: '',
			});

		expect(parsed.success).toBe(false);
	});
});

const functionsCtx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('function.list', () => {
	it('sends GET /functions with pagination parameters', async () => {
		const mockResponse = {
			functions: [{ function_id: 'func-001' }],
			pagination: {
				page_number: 1,
				page_size: 10,
				total_count: 1,
				total_pages: 1,
			},
		};

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.list(functionsCtx, {
			page: 1,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'functions',
				query: { page: 1, page_size: 10 },
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.create', () => {
	it('sends POST /functions with body', async () => {
		const mockResponse = { function_id: 'func-001', name: 'New function' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.create(functionsCtx, {
			body: { name: 'New function' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'functions' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.get', () => {
	it('sends GET /functions/{function_id}', async () => {
		const mockResponse = { function_id: 'func-001', name: 'My function' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.get(functionsCtx, {
			function_id: 'func-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'functions/func-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.update', () => {
	it('sends PATCH /functions/{function_id} with body', async () => {
		const mockResponse = { function_id: 'func-001', name: 'Renamed' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.update(functionsCtx, {
			function_id: 'func-001',
			body: { name: 'Renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'functions/func-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.remove', () => {
	it('sends DELETE /functions/{function_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Functions.remove(functionsCtx, {
			function_id: 'func-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'functions/func-001',
			}),
		);

		expect(result).toEqual(undefined);
	});
});

describe('function.listDeployments', () => {
	it('sends GET /functions/{function_id}/deployments', async () => {
		const mockResponse = { deployments: [{ deployment_id: 'deploy-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.listDeployments(functionsCtx, {
			function_id: 'func-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'functions/func-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('function.createDeployment', () => {
	it('sends POST /functions/{function_id}/deployments with body', async () => {
		const mockResponse = { deployment_id: 'deploy-001', status: 'pending' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Functions.createDeployment(functionsCtx, {
			function_id: 'func-001',
			body: { environment: 'production' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'functions/func-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('functionCreateDeployment input schema', () => {
	it('accepts a well-formed deployment create input', () => {
		const parsed =
			GriptapeEndpointInputSchemas.functionCreateDeployment.safeParse({
				function_id: 'func-001',
				body: { environment: 'production' },
			});

		expect(parsed.success).toBe(true);
	});

	it('rejects input without a function id', () => {
		const parsed =
			GriptapeEndpointInputSchemas.functionCreateDeployment.safeParse({
				body: { environment: 'production' },
			});

		expect(parsed.success).toBe(false);
	});
});

const integrationsCtx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('integrations endpoints', () => {
	it('list sends GET /integrations with pagination', async () => {
		const payload = {
			items: [{ integration_id: 'integration-001', name: 'Slack bridge' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Integrations.list(integrationsCtx, {
			page: 1,
			page_size: 10,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'integrations' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST /integrations', async () => {
		const payload = { integration_id: 'integration-002', name: 'New hook' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Integrations.create(integrationsCtx, {
			body: { name: 'New hook' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'integrations' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET /integrations/{integration_id}', async () => {
		const payload = { integration_id: 'integration-003', name: 'Webhook' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Integrations.get(integrationsCtx, {
			integration_id: 'integration-003',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'integrations/integration-003',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH /integrations/{integration_id}', async () => {
		const payload = { integration_id: 'integration-004', name: 'Renamed' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Integrations.update(integrationsCtx, {
			integration_id: 'integration-004',
			body: { name: 'Renamed' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'integrations/integration-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE /integrations/{integration_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Integrations.remove(integrationsCtx, {
			integration_id: 'integration-005',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'integrations/integration-005',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('integrations input schemas', () => {
	it('accepts a valid integrationGet input', () => {
		const parsed = GriptapeEndpointInputSchemas.integrationGet.safeParse({
			integration_id: 'integration-003',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty integration_id for integrationGet', () => {
		const parsed = GriptapeEndpointInputSchemas.integrationGet.safeParse({
			integration_id: '',
		});
		expect(parsed.success).toBe(false);
	});
});

describe('griptape knowledge-bases endpoints', () => {
	const ctx = { key: 'test-api-key' } as unknown as GriptapeContext;
	const kbId = '550e8400-e29b-41d4-a716-446655440010';
	const jobId = '550e8400-e29b-41d4-a716-446655440011';
	const searchId = '550e8400-e29b-41d4-a716-446655440012';

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('list sends GET knowledge-bases with pagination', async () => {
		const payload = { data: [], pagination: { page_number: 1 } };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.list(ctx, {
			page: 1,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'knowledge-bases' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST knowledge-bases', async () => {
		const payload = { knowledge_base_id: kbId, name: 'kb-one' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.create(ctx, {
			body: { name: 'kb-one' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'knowledge-bases' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET knowledge-bases/{id}', async () => {
		const payload = { knowledge_base_id: kbId, name: 'kb-one' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.get(ctx, { knowledge_base_id: kbId });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-bases/${kbId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH knowledge-bases/{id}', async () => {
		const payload = { knowledge_base_id: kbId, name: 'kb-renamed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.update(ctx, {
			knowledge_base_id: kbId,
			body: { name: 'kb-renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: `knowledge-bases/${kbId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE knowledge-bases/{id}', async () => {
		const payload = undefined as unknown as Record<string, never>;
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.remove(ctx, {
			knowledge_base_id: kbId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: `knowledge-bases/${kbId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('query sends POST knowledge-bases/{id}/query', async () => {
		const payload = { answer: 'hello' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.query(ctx, {
			knowledge_base_id: kbId,
			query: 'hello',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `knowledge-bases/${kbId}/query`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('search sends POST knowledge-bases/{id}/search', async () => {
		const payload = { results: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.search(ctx, {
			knowledge_base_id: kbId,
			query: 'hello',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `knowledge-bases/${kbId}/search`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('listQueries sends GET knowledge-bases/{id}/queries', async () => {
		const payload = { data: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.listQueries(ctx, {
			knowledge_base_id: kbId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-bases/${kbId}/queries`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('listSearches sends GET knowledge-bases/{id}/searches', async () => {
		const payload = { data: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.listSearches(ctx, {
			knowledge_base_id: kbId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-bases/${kbId}/searches`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('getSearch sends GET knowledge-base-searches/{id}', async () => {
		const payload = { knowledge_base_search_id: searchId };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.getSearch(ctx, {
			knowledge_base_search_id: searchId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-base-searches/${searchId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('createJob sends POST knowledge-bases/{id}/knowledge-base-jobs', async () => {
		const payload = { knowledge_base_job_id: jobId, status: 'queued' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.createJob(ctx, {
			knowledge_base_id: kbId,
			body: { source: 's3' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: `knowledge-bases/${kbId}/knowledge-base-jobs`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('listJobs sends GET knowledge-bases/{id}/knowledge-base-jobs', async () => {
		const payload = { data: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.listJobs(ctx, {
			knowledge_base_id: kbId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-bases/${kbId}/knowledge-base-jobs`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('getJob sends GET knowledge-base-jobs/{id}', async () => {
		const payload = { knowledge_base_job_id: jobId, status: 'done' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await KnowledgeBases.getJob(ctx, {
			knowledge_base_job_id: jobId,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: `knowledge-base-jobs/${jobId}`,
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates knowledgeBaseQuery input', () => {
		const parsed = GriptapeEndpointInputSchemas.knowledgeBaseQuery.safeParse({
			knowledge_base_id: kbId,
			query: 'hello',
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects knowledgeBaseQuery with an empty query', () => {
		const parsed = GriptapeEndpointInputSchemas.knowledgeBaseQuery.safeParse({
			knowledge_base_id: kbId,
			query: '',
		});

		expect(parsed.success).toBe(false);
	});

	it('validates knowledgeBaseSearch input', () => {
		const parsed = GriptapeEndpointInputSchemas.knowledgeBaseSearch.safeParse({
			knowledge_base_id: kbId,
			query: 'hello',
		});

		expect(parsed.success).toBe(true);
	});
});

const librariesCtx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('libraries endpoints', () => {
	it('list sends GET /libraries with pagination', async () => {
		const payload = {
			items: [{ library_id: 'library-001', name: 'Shared prompts' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Libraries.list(librariesCtx, {
			page: 1,
			page_size: 10,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'libraries' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST /libraries', async () => {
		const payload = { library_id: 'library-002', name: 'New library' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Libraries.create(librariesCtx, {
			body: { name: 'New library' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'libraries' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET /libraries/{library_id}', async () => {
		const payload = { library_id: 'library-003', name: 'Prompt pack' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Libraries.get(librariesCtx, {
			library_id: 'library-003',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'libraries/library-003',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH /libraries/{library_id}', async () => {
		const payload = { library_id: 'library-004', name: 'Renamed library' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Libraries.update(librariesCtx, {
			library_id: 'library-004',
			body: { name: 'Renamed library' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'libraries/library-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE /libraries/{library_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Libraries.remove(librariesCtx, {
			library_id: 'library-005',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'libraries/library-005',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('libraries input schemas', () => {
	it('accepts a valid libraryGet input', () => {
		const parsed = GriptapeEndpointInputSchemas.libraryGet.safeParse({
			library_id: 'library-003',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty library_id for libraryGet', () => {
		const parsed = GriptapeEndpointInputSchemas.libraryGet.safeParse({
			library_id: '',
		});
		expect(parsed.success).toBe(false);
	});
});

describe('griptape messages', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;
	const messageId = '550e8400-e29b-41d4-a716-446655440000';

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	describe('get', () => {
		it('sends GET /messages/{message_id}', async () => {
			const mockResponse = {
				message_id: messageId,
				input: 'Hello',
				output: 'Hi there',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Messages.get(ctx, { message_id: messageId });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `messages/${messageId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('update', () => {
		it('sends PATCH /messages/{message_id} with the input body', async () => {
			const mockResponse = {
				message_id: messageId,
				input: 'Hello',
				output: 'Updated reply',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Messages.update(ctx, {
				message_id: messageId,
				body: { output: 'Updated reply' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'PATCH',
					url: `messages/${messageId}`,
					body: { output: 'Updated reply' },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('remove', () => {
		it('sends DELETE /messages/{message_id}', async () => {
			const mockResponse = undefined as unknown as Record<string, unknown>;

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Messages.remove(ctx, { message_id: messageId });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'DELETE',
					url: `messages/${messageId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('input schemas', () => {
		it('accepts a well-formed messageGet payload', () => {
			const parsed = GriptapeEndpointInputSchemas.messageGet.safeParse({
				message_id: messageId,
			});

			expect(parsed.success).toBe(true);
		});

		it('rejects messageGet with an empty message id', () => {
			const parsed = GriptapeEndpointInputSchemas.messageGet.safeParse({
				message_id: '',
			});

			expect(parsed.success).toBe(false);
		});
	});
});

describe('griptape misc endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('connection.list sends GET /connections with pagination and type', async () => {
		const payload = { connections: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.listConnections(ctx, {
			page: 1,
			page_size: 10,
			type: 'github',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'connections' }),
		);
		expect(result).toEqual(payload);
	});

	it('exportJob.list sends GET /export-jobs', async () => {
		const payload = { export_jobs: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.listExportJobs(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'export-jobs' }),
		);
		expect(result).toEqual(payload);
	});

	it('exportJob.create sends POST /export-jobs', async () => {
		const payload = { export_job_id: 'export-test-001', status: 'queued' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.createExportJob(ctx, {
			body: { resource: 'threads' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'export-jobs' }),
		);
		expect(result).toEqual(payload);
	});

	it('exportJob.get sends GET /export-jobs/{export_job_id}', async () => {
		const payload = { export_job_id: 'export-test-001', status: 'completed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.getExportJob(ctx, {
			export_job_id: 'export-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'export-jobs/export-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('importJob.list sends GET /import-jobs', async () => {
		const payload = { import_jobs: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.listImportJobs(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'import-jobs' }),
		);
		expect(result).toEqual(payload);
	});

	it('importJob.create sends POST /import-jobs', async () => {
		const payload = { import_job_id: 'import-test-001', status: 'queued' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.createImportJob(ctx, {
			body: { resource: 'threads' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'import-jobs' }),
		);
		expect(result).toEqual(payload);
	});

	it('importJob.get sends GET /import-jobs/{import_job_id}', async () => {
		const payload = { import_job_id: 'import-test-001', status: 'completed' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await misc.getImportJob(ctx, {
			import_job_id: 'import-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'import-jobs/import-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates connectionList input with a type filter', () => {
		const parsed = GriptapeEndpointInputSchemas.connectionList.safeParse({
			page: 1,
			page_size: 10,
			type: 'github',
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects exportJobGet input with an empty id', () => {
		const parsed = GriptapeEndpointInputSchemas.exportJobGet.safeParse({
			export_job_id: '',
		});

		expect(parsed.success).toBe(false);
	});
});

describe('griptape model endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('model.list sends GET /models with pagination', async () => {
		const payload = { models: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.listModels(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'models' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.create sends POST /models', async () => {
		const payload = { model_config_id: 'model-test-001', name: 'test-model' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.createModel(ctx, {
			body: { name: 'test-model' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'models' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.get sends GET /models/{model_config_id}', async () => {
		const payload = { model_config_id: 'model-test-001', name: 'test-model' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.getModel(ctx, {
			model_config_id: 'model-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'models/model-test-001' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.update sends PATCH /models/{model_config_id}', async () => {
		const payload = {
			model_config_id: 'model-test-001',
			name: 'renamed-model',
		};
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.updateModel(ctx, {
			model_config_id: 'model-test-001',
			body: { name: 'renamed-model' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'models/model-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('model.delete sends DELETE /models/{model_config_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await models.removeModel(ctx, {
			model_config_id: 'model-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'models/model-test-001',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('model.listAuthConfigs sends GET /models/auth-configs', async () => {
		const payload = { auth_configs: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.listAuthConfigs(ctx, {
			page: 1,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'models/auth-configs' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.createAuthConfig sends POST /models/auth-configs', async () => {
		const payload = { auth_config_id: 'auth-test-001' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.createAuthConfig(ctx, {
			body: { provider: 'openai' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'models/auth-configs' }),
		);
		expect(result).toEqual(payload);
	});

	it('model.getAuthConfig sends GET /models/auth-configs/{auth_config_id}', async () => {
		const payload = { auth_config_id: 'auth-test-001', provider: 'openai' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.getAuthConfig(ctx, {
			auth_config_id: 'auth-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'models/auth-configs/auth-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('model.updateAuthConfig sends PATCH /models/auth-configs/{auth_config_id}', async () => {
		const payload = { auth_config_id: 'auth-test-001', provider: 'openai' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await models.updateAuthConfig(ctx, {
			auth_config_id: 'auth-test-001',
			body: { provider: 'openai' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'models/auth-configs/auth-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('model.deleteAuthConfig sends DELETE /models/auth-configs/{auth_config_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await models.removeAuthConfig(ctx, {
			auth_config_id: 'auth-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'models/auth-configs/auth-test-001',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('validates modelGetAuthConfig input', () => {
		const valid = GriptapeEndpointInputSchemas.modelGetAuthConfig.safeParse({
			auth_config_id: 'auth-test-001',
		});

		expect(valid.success).toBe(true);
	});

	it('rejects modelGetAuthConfig input with an empty id', () => {
		const invalid = GriptapeEndpointInputSchemas.modelGetAuthConfig.safeParse({
			auth_config_id: '',
		});

		expect(invalid.success).toBe(false);
	});
});

describe('griptape organization endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('organization.list sends GET /organizations with pagination', async () => {
		const payload = { organizations: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'organizations' }),
		);
		expect(result).toEqual(payload);
	});

	it('organization.get sends GET /organizations/{organization_id}', async () => {
		const payload = { organization_id: 'org-test-001', name: 'test-org' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.get(ctx, {
			organization_id: 'org-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'organizations/org-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('organization.update sends PATCH /organizations/{organization_id}', async () => {
		const payload = { organization_id: 'org-test-001', name: 'renamed-org' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.update(ctx, {
			organization_id: 'org-test-001',
			body: { name: 'renamed-org' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'organizations/org-test-001',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('organization.listApiKeys sends GET /organizations/{organization_id}/api-keys', async () => {
		const payload = { api_keys: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.listApiKeys(ctx, {
			organization_id: 'org-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'organizations/org-test-001/api-keys',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('organization.createApiKey sends POST /organizations/{organization_id}/api-keys', async () => {
		const payload = { api_key_id: 'key-test-001' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await organizations.createApiKey(ctx, {
			organization_id: 'org-test-001',
			body: { name: 'ci-key' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'organizations/org-test-001/api-keys',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('validates organizationCreateApiKey input', () => {
		const valid =
			GriptapeEndpointInputSchemas.organizationCreateApiKey.safeParse({
				organization_id: 'org-test-001',
				body: { name: 'ci-key' },
			});

		expect(valid.success).toBe(true);
	});

	it('rejects organizationCreateApiKey input without an organization id', () => {
		const invalid =
			GriptapeEndpointInputSchemas.organizationCreateApiKey.safeParse({
				body: { name: 'ci-key' },
			});

		expect(invalid.success).toBe(false);
	});
});

const retrieversCtx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('retrievers endpoints', () => {
	it('listRetrievers sends GET /retrievers with pagination', async () => {
		const payload = {
			items: [{ retriever_id: 'retriever-001', name: 'Docs retriever' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await listRetrievers(retrieversCtx, {
			page: 1,
			page_size: 10,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'retrievers' }),
		);
		expect(result).toEqual(payload);
	});

	it('createRetriever sends POST /retrievers', async () => {
		const payload = { retriever_id: 'retriever-002', name: 'New retriever' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await createRetriever(retrieversCtx, {
			body: { name: 'New retriever' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'retrievers' }),
		);
		expect(result).toEqual(payload);
	});

	it('getRetriever sends GET /retrievers/{retriever_id}', async () => {
		const payload = { retriever_id: 'retriever-003', name: 'KB retriever' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getRetriever(retrieversCtx, {
			retriever_id: 'retriever-003',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'retrievers/retriever-003',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('updateRetriever sends PATCH /retrievers/{retriever_id}', async () => {
		const payload = { retriever_id: 'retriever-004', name: 'Renamed' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await updateRetriever(retrieversCtx, {
			retriever_id: 'retriever-004',
			body: { name: 'Renamed' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'retrievers/retriever-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('queryRetriever sends POST /retrievers/{retriever_id}/query', async () => {
		const payload = { matches: [{ score: 0.9, text: 'refund policy' }] };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await queryRetriever(retrieversCtx, {
			retriever_id: 'retriever-005',
			query: 'what is the refund policy?',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'retrievers/retriever-005/query',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('listComponents sends GET /retriever-components with pagination', async () => {
		const payload = {
			items: [{ retriever_component_id: 'component-001' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await listComponents(retrieversCtx, {
			page: 1,
			page_size: 10,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'retriever-components' }),
		);
		expect(result).toEqual(payload);
	});

	it('createComponent sends POST /retriever-components', async () => {
		const payload = { retriever_component_id: 'component-002' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await createComponent(retrieversCtx, {
			body: { kind: 'reranker' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'retriever-components' }),
		);
		expect(result).toEqual(payload);
	});

	it('getComponent sends GET /retriever-components/{retriever_component_id}', async () => {
		const payload = { retriever_component_id: 'component-003' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getComponent(retrieversCtx, {
			retriever_component_id: 'component-003',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'retriever-components/component-003',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('updateComponent sends PATCH /retriever-components/{retriever_component_id}', async () => {
		const payload = { retriever_component_id: 'component-004' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await updateComponent(retrieversCtx, {
			retriever_component_id: 'component-004',
			body: { top_n: 5 },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'retriever-components/component-004',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('retrievers input schemas', () => {
	it('accepts a valid retrieverQuery input', () => {
		const parsed = GriptapeEndpointInputSchemas.retrieverQuery.safeParse({
			retriever_id: 'retriever-005',
			query: 'what is the refund policy?',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty query for retrieverQuery', () => {
		const parsed = GriptapeEndpointInputSchemas.retrieverQuery.safeParse({
			retriever_id: 'retriever-005',
			query: '',
		});
		expect(parsed.success).toBe(false);
	});
});

const rulesCtx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('rules endpoints', () => {
	it('listRules sends GET /rules with pagination', async () => {
		const payload = {
			items: [{ rule_id: 'rule-001', name: 'No PII' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await listRules(rulesCtx, { page: 1, page_size: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'rules' }),
		);
		expect(result).toEqual(payload);
	});

	it('createRule sends POST /rules', async () => {
		const payload = { rule_id: 'rule-002', name: 'Tone guardrail' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await createRule(rulesCtx, {
			body: { name: 'Tone guardrail' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'rules' }),
		);
		expect(result).toEqual(payload);
	});

	it('getRule sends GET /rules/{rule_id}', async () => {
		const payload = { rule_id: 'rule-003', name: 'Brand voice' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getRule(rulesCtx, { rule_id: 'rule-003' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'rules/rule-003' }),
		);
		expect(result).toEqual(payload);
	});

	it('updateRule sends PATCH /rules/{rule_id}', async () => {
		const payload = { rule_id: 'rule-004', name: 'Updated rule' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await updateRule(rulesCtx, {
			rule_id: 'rule-004',
			body: { name: 'Updated rule' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'PATCH', url: 'rules/rule-004' }),
		);
		expect(result).toEqual(payload);
	});

	it('removeRule sends DELETE /rules/{rule_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await removeRule(rulesCtx, { rule_id: 'rule-005' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'DELETE', url: 'rules/rule-005' }),
		);
		expect(result).toEqual(payload);
	});

	it('createRuleset sends POST /rulesets', async () => {
		const payload = { ruleset_id: 'ruleset-001', name: 'Support rules' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await createRuleset(rulesCtx, {
			body: { name: 'Support rules' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'rulesets' }),
		);
		expect(result).toEqual(payload);
	});

	it('getRuleset sends GET /rulesets/{ruleset_id}', async () => {
		const payload = { ruleset_id: 'ruleset-002', name: 'Safety rules' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getRuleset(rulesCtx, { ruleset_id: 'ruleset-002' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'rulesets/ruleset-002',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('getRulesetByAlias sends GET /rulesets with alias query', async () => {
		const payload = {
			items: [{ ruleset_id: 'ruleset-003', alias: 'support-default' }],
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getRulesetByAlias(rulesCtx, {
			alias: 'support-default',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'rulesets' }),
		);
		expect(result).toEqual(payload);
	});

	it('updateRuleset sends PATCH /rulesets/{ruleset_id}', async () => {
		const payload = { ruleset_id: 'ruleset-004', name: 'Renamed ruleset' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await updateRuleset(rulesCtx, {
			ruleset_id: 'ruleset-004',
			body: { name: 'Renamed ruleset' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'rulesets/ruleset-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('removeRuleset sends DELETE /rulesets/{ruleset_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await removeRuleset(rulesCtx, { ruleset_id: 'ruleset-005' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'rulesets/ruleset-005',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('rules input schemas', () => {
	it('accepts a valid rulesetGetByAlias input', () => {
		const parsed = GriptapeEndpointInputSchemas.rulesetGetByAlias.safeParse({
			alias: 'support-default',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty alias for rulesetGetByAlias', () => {
		const parsed = GriptapeEndpointInputSchemas.rulesetGetByAlias.safeParse({
			alias: '',
		});
		expect(parsed.success).toBe(false);
	});
});

const secretsCtx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('secrets endpoints', () => {
	it('list sends GET /secrets with pagination', async () => {
		const payload = {
			items: [{ secret_id: 'secret-001', name: 'api-token' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Secrets.list(secretsCtx, { page: 1, page_size: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'secrets' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST /secrets', async () => {
		const payload = { secret_id: 'secret-002', name: 'webhook-signing' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Secrets.create(secretsCtx, {
			body: { name: 'webhook-signing' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'secrets' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET /secrets/{secret_id}', async () => {
		const payload = { secret_id: 'secret-003', name: 'oauth-client' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Secrets.get(secretsCtx, { secret_id: 'secret-003' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'secrets/secret-003' }),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH /secrets/{secret_id}', async () => {
		const payload = { secret_id: 'secret-004', name: 'rotated-token' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Secrets.update(secretsCtx, {
			secret_id: 'secret-004',
			body: { name: 'rotated-token' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'secrets/secret-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE /secrets/{secret_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await Secrets.remove(secretsCtx, {
			secret_id: 'secret-005',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'secrets/secret-005',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('secrets input schemas', () => {
	it('accepts a valid secretGet input', () => {
		const parsed = GriptapeEndpointInputSchemas.secretGet.safeParse({
			secret_id: 'secret-003',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty secret_id for secretGet', () => {
		const parsed = GriptapeEndpointInputSchemas.secretGet.safeParse({
			secret_id: '',
		});
		expect(parsed.success).toBe(false);
	});
});

const structuresCtx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('structure.list', () => {
	it('sends GET /structures with pagination parameters', async () => {
		const mockResponse = {
			structures: [{ structure_id: 'struct-001' }],
			pagination: {
				page_number: 1,
				page_size: 10,
				total_count: 1,
				total_pages: 1,
			},
		};

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.list(structuresCtx, {
			page: 1,
			page_size: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'structures' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.create', () => {
	it('sends POST /structures with body', async () => {
		const mockResponse = { structure_id: 'struct-001', name: 'New structure' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.create(structuresCtx, {
			body: { name: 'New structure' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'structures' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.get', () => {
	it('sends GET /structures/{structure_id}', async () => {
		const mockResponse = { structure_id: 'struct-001', name: 'My structure' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.get(structuresCtx, {
			structure_id: 'struct-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'structures/struct-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.update', () => {
	it('sends PATCH /structures/{structure_id} with body', async () => {
		const mockResponse = { structure_id: 'struct-001', name: 'Renamed' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.update(structuresCtx, {
			structure_id: 'struct-001',
			body: { name: 'Renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'structures/struct-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.remove', () => {
	it('sends DELETE /structures/{structure_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Structures.remove(structuresCtx, {
			structure_id: 'struct-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'structures/struct-001',
			}),
		);

		expect(result).toEqual(undefined);
	});
});

describe('structure.dashboard', () => {
	it('sends GET /dashboards/structures with dashboard query', async () => {
		const mockResponse = { runs: 12, period: 'daily' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.dashboard(structuresCtx, {
			start_time: '2026-01-01T00:00:00Z',
			end_time: '2026-02-01T00:00:00Z',
			period: 'daily',
			structure_ids: ['struct-001'],
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'dashboards/structures',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.listRuns', () => {
	it('sends GET /structures/{structure_id}/runs', async () => {
		const mockResponse = { runs: [{ run_id: 'run-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.listRuns(structuresCtx, {
			structure_id: 'struct-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'structures/struct-001/runs',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.listDeployments', () => {
	it('sends GET /structures/{structure_id}/deployments', async () => {
		const mockResponse = { deployments: [{ deployment_id: 'deploy-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.listDeployments(structuresCtx, {
			structure_id: 'struct-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'structures/struct-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structure.createDeployment', () => {
	it('sends POST /structures/{structure_id}/deployments with body', async () => {
		const mockResponse = { deployment_id: 'deploy-001', status: 'pending' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Structures.createDeployment(structuresCtx, {
			structure_id: 'struct-001',
			body: { environment: 'production' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'structures/struct-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('structureDashboard input schema', () => {
	it('accepts a well-formed dashboard query', () => {
		const parsed = GriptapeEndpointInputSchemas.structureDashboard.safeParse({
			start_time: '2026-01-01T00:00:00Z',
			end_time: '2026-02-01T00:00:00Z',
			period: 'daily',
			structure_ids: ['struct-001'],
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects non-array structure_ids', () => {
		const parsed = GriptapeEndpointInputSchemas.structureDashboard.safeParse({
			structure_ids: 'struct-001',
		});

		expect(parsed.success).toBe(false);
	});
});

describe('griptape threads', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;
	const threadId = '550e8400-e29b-41d4-a716-446655440000';

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	describe('list', () => {
		it('sends GET /threads with pagination and filter parameters', async () => {
			const mockResponse = {
				threads: [],
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.list(ctx, {
				page: 1,
				page_size: 10,
				alias: 'support',
				starts_with: 'sup',
				created_by: 'user@example.com',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: 'threads',
					query: {
						page: 1,
						page_size: 10,
						alias: 'support',
						starts_with: 'sup',
						created_by: 'user@example.com',
					},
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('create', () => {
		it('sends POST /threads with the input body', async () => {
			const mockResponse = {
				thread_id: threadId,
				alias: 'support',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.create(ctx, {
				body: { alias: 'support' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'POST',
					url: 'threads',
					body: { alias: 'support' },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('get', () => {
		it('sends GET /threads/{thread_id}', async () => {
			const mockResponse = {
				thread_id: threadId,
				alias: 'support',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.get(ctx, { thread_id: threadId });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `threads/${threadId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('update', () => {
		it('sends PATCH /threads/{thread_id} with the input body', async () => {
			const mockResponse = {
				thread_id: threadId,
				alias: 'renamed',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.update(ctx, {
				thread_id: threadId,
				body: { alias: 'renamed' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'PATCH',
					url: `threads/${threadId}`,
					body: { alias: 'renamed' },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('remove', () => {
		it('sends DELETE /threads/{thread_id}', async () => {
			const mockResponse = undefined as unknown as Record<string, unknown>;

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.remove(ctx, { thread_id: threadId });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'DELETE',
					url: `threads/${threadId}`,
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('listMessages', () => {
		it('sends GET /threads/{thread_id}/messages with pagination', async () => {
			const mockResponse = {
				messages: [],
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.listMessages(ctx, {
				thread_id: threadId,
				page: 1,
				page_size: 10,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'GET',
					url: `threads/${threadId}/messages`,
					query: { page: 1, page_size: 10 },
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('createMessage', () => {
		it('sends POST /threads/{thread_id}/messages with input/output/metadata', async () => {
			const mockResponse = {
				message_id: '660e8400-e29b-41d4-a716-446655440000',
				input: 'Hello',
				output: 'Hi there',
			};

			mockRequest.mockResolvedValueOnce(mockResponse);

			const result = await Threads.createMessage(ctx, {
				thread_id: threadId,
				input: 'Hello',
				output: 'Hi there',
				metadata: { source: 'test' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
				expect.objectContaining({
					method: 'POST',
					url: `threads/${threadId}/messages`,
					body: {
						input: 'Hello',
						output: 'Hi there',
						metadata: { source: 'test' },
					},
				}),
			);

			expect(result).toEqual(mockResponse);
		});
	});

	describe('input schemas', () => {
		it('accepts a well-formed threadMessageCreate payload', () => {
			const parsed = GriptapeEndpointInputSchemas.threadMessageCreate.safeParse(
				{
					thread_id: threadId,
					input: 'Hello',
					output: 'Hi there',
				},
			);

			expect(parsed.success).toBe(true);
		});

		it('rejects threadMessageCreate with an empty thread id', () => {
			const parsed = GriptapeEndpointInputSchemas.threadMessageCreate.safeParse(
				{
					thread_id: '',
					input: 'Hello',
					output: 'Hi there',
				},
			);

			expect(parsed.success).toBe(false);
		});
	});
});

const toolsCtx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('tool.list', () => {
	it('sends GET /tools with pagination parameters', async () => {
		const mockResponse = {
			tools: [{ tool_id: 'tool-001' }],
			pagination: {
				page_number: 1,
				page_size: 10,
				total_count: 1,
				total_pages: 1,
			},
		};

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.list(toolsCtx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'tools' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.create', () => {
	it('sends POST /tools with body', async () => {
		const mockResponse = { tool_id: 'tool-001', name: 'New tool' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.create(toolsCtx, {
			body: { name: 'New tool' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'tools' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.get', () => {
	it('sends GET /tools/{tool_id}', async () => {
		const mockResponse = { tool_id: 'tool-001', name: 'My tool' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.get(toolsCtx, { tool_id: 'tool-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'tools/tool-001' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.update', () => {
	it('sends PATCH /tools/{tool_id} with body', async () => {
		const mockResponse = { tool_id: 'tool-001', name: 'Renamed' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.update(toolsCtx, {
			tool_id: 'tool-001',
			body: { name: 'Renamed' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'PATCH', url: 'tools/tool-001' }),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.remove', () => {
	it('sends DELETE /tools/{tool_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await Tools.remove(toolsCtx, { tool_id: 'tool-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'DELETE', url: 'tools/tool-001' }),
		);

		expect(result).toEqual(undefined);
	});
});

describe('tool.listRuns', () => {
	it('sends GET /tools/{tool_id}/runs', async () => {
		const mockResponse = { runs: [{ run_id: 'run-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.listRuns(toolsCtx, { tool_id: 'tool-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'tools/tool-001/runs',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.listDeployments', () => {
	it('sends GET /tools/{tool_id}/deployments', async () => {
		const mockResponse = { deployments: [{ deployment_id: 'deploy-001' }] };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.listDeployments(toolsCtx, {
			tool_id: 'tool-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'tools/tool-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.createDeployment', () => {
	it('sends POST /tools/{tool_id}/deployments with body', async () => {
		const mockResponse = { deployment_id: 'deploy-001', status: 'pending' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.createDeployment(toolsCtx, {
			tool_id: 'tool-001',
			body: { environment: 'production' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'tools/tool-001/deployments',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('tool.deploymentStatus', () => {
	it('sends GET /deployments/{deployment_id}', async () => {
		const mockResponse = { deployment_id: 'deploy-001', status: 'ready' };

		mockRequest.mockResolvedValueOnce(mockResponse);

		const result = await Tools.deploymentStatus(toolsCtx, {
			deployment_id: 'deploy-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'deployments/deploy-001',
			}),
		);

		expect(result).toEqual(mockResponse);
	});
});

describe('toolDeploymentStatus input schema', () => {
	it('accepts a well-formed deployment id', () => {
		const parsed = GriptapeEndpointInputSchemas.toolDeploymentStatus.safeParse({
			deployment_id: 'deploy-001',
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects an empty deployment id', () => {
		const parsed = GriptapeEndpointInputSchemas.toolDeploymentStatus.safeParse({
			deployment_id: '',
		});

		expect(parsed.success).toBe(false);
	});
});

describe('griptape user endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('user.list sends GET /users with pagination', async () => {
		const payload = { users: [] };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await users.list(ctx, { page: 1, page_size: 10 });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'users' }),
		);
		expect(result).toEqual(payload);
	});

	it('user.get sends GET /users/{user_id}', async () => {
		const payload = { user_id: 'user-test-001', email: 'user@example.com' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await users.get(ctx, { user_id: 'user-test-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'users/user-test-001' }),
		);
		expect(result).toEqual(payload);
	});

	it('user.getApiKey sends GET /api-keys/{api_key_id}', async () => {
		const payload = { api_key_id: 'key-test-001', name: 'ci-key' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await users.getApiKey(ctx, { api_key_id: 'key-test-001' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'api-keys/key-test-001' }),
		);
		expect(result).toEqual(payload);
	});

	it('user.deleteApiKey sends DELETE /api-keys/{api_key_id}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		const result = await users.deleteApiKey(ctx, {
			api_key_id: 'key-test-001',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'api-keys/key-test-001',
			}),
		);
		expect(result).toEqual(undefined);
	});

	it('validates userGet input', () => {
		const valid = GriptapeEndpointInputSchemas.userGet.safeParse({
			user_id: 'user-test-001',
		});

		expect(valid.success).toBe(true);
	});

	it('rejects userGet input with an empty id', () => {
		const invalid = GriptapeEndpointInputSchemas.userGet.safeParse({
			user_id: '',
		});

		expect(invalid.success).toBe(false);
	});
});

describe('griptape registry completeness', () => {
	const plugin = griptape({ key: 'test-api-key' });

	function flattenEndpoints(): string[] {
		const names: string[] = [];
		const nested = plugin.endpoints as Record<string, Record<string, unknown>>;
		for (const [group, ops] of Object.entries(nested)) {
			for (const op of Object.keys(ops)) {
				names.push(`${group}.${op}`);
			}
		}
		return names;
	}

	it('exposes 143 wired endpoints', () => {
		expect(flattenEndpoints()).toHaveLength(143);
	});

	it('defaults to api_key auth', () => {
		const options = plugin.options as { authType?: string };
		expect(options.authType).toBe('api_key');
		expect(plugin.id).toBe('griptape');
		expect(plugin.authConfig).toHaveProperty('api_key');
	});

	it('covers every endpoint with schemas and meta', () => {
		const schemas = plugin.endpointSchemas as Record<string, unknown>;
		const meta = plugin.endpointMeta as Record<string, unknown>;

		for (const name of flattenEndpoints()) {
			expect(schemas[name]).toBeDefined();
			expect(meta[name]).toBeDefined();
		}
		expect(Object.keys(schemas)).toHaveLength(143);
	});
});

describe('griptape endpoints scaffold', () => {
	it('does not keep the generator example file', () => {
		expect(existsSync(join(__dirname, 'endpoints', 'example.ts'))).toBe(false);
	});

	it('wires assistant endpoints from a single module', () => {
		const src = readFileSync(join(__dirname, 'endpoints', 'index.ts'), 'utf8');

		expect(src).toContain("from './assistants'");
		expect(src).toContain('list: assistantList');
		expect(src).toContain('get: assistantGet');
		expect(src).toContain('create: assistantCreate');
		expect(src).not.toContain("from './assistant-list'");
		expect(src).not.toContain("from './assistant-get'");
		expect(src).not.toContain("from './assistant-runs'");
		expect(src).not.toContain("from './example'");
	});
});
