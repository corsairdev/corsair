import * as CorsairCore from 'corsair/core';
import * as Client from './client';
import {
	AccountEndpoints,
	CollectionsEndpoints,
	DatasetsEndpoints,
	DiscussionsEndpoints,
	DocsEndpoints,
	EndpointsEndpoints,
	InferenceEndpoints,
	JobsEndpoints,
	ModelsEndpoints,
	OrganizationsEndpoints,
	PapersEndpoints,
	ReposEndpoints,
	SettingsEndpoints,
	SpacesEndpoints,
	TrendingEndpoints,
	UsersEndpoints,
} from './endpoints';
import { summarize } from './endpoints/helpers';
import type { HuggingFaceEndpoints } from './index';

const mockReq = jest.spyOn(Client, 'makeHuggingFaceRequest');

// Unit tests only assert HTTP path construction — skip real event logging.
const logSpy = jest.spyOn(CorsairCore, 'logEventFromContext');
logSpy.mockImplementation(async () => null);

type HandlerCtx = Parameters<HuggingFaceEndpoints['getWhoami']>[0];

function ctx(key = 'hf_test'): HandlerCtx {
	const partial = {
		key,
		db: {},
		authType: 'api_key' as const,
		keys: {
			get_api_key: async () => key,
			get_access_token: async () => key,
		},
	};
	// Handler unit tests only need key + keys; cast through unknown to avoid
	// constructing a full CorsairPluginContext (database, hooks, etc.).
	return partial as unknown as HandlerCtx;
}

function lastCall() {
	const call = mockReq.mock.calls.at(-1);
	if (!call) throw new Error('makeHuggingFaceRequest was not called');
	return call;
}

function expectPath(path: string) {
	expect(lastCall()[0]).toBe(path);
}

beforeEach(() => {
	mockReq.mockReset();
	mockReq.mockResolvedValue({ ok: true });
	logSpy.mockClear();
	logSpy.mockImplementation(async () => null);
});

describe('handler path construction', () => {
	it('account.getWhoami → /api/whoami-v2', async () => {
		await AccountEndpoints.getWhoami(ctx(), {});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/whoami-v2',
			'hf_test',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('account.deleteNotifications sends discussionIds in body, filters in query', async () => {
		await AccountEndpoints.deleteNotifications(ctx(), {
			discussionIds: ['5f7f5b1b'],
			applyToAll: true,
			filter: { readStatus: 'unread', repoType: 'model' },
		});
		expect(mockReq).toHaveBeenCalledWith('/api/notifications', 'hf_test', {
			method: 'DELETE',
			body: { discussionIds: ['5f7f5b1b'] },
			query: {
				applyToAll: true,
				readStatus: 'unread',
				repoType: 'model',
			},
		});
	});

	it('models.list → /api/models', async () => {
		await ModelsEndpoints.list(ctx(), { limit: 5 });
		expect(mockReq).toHaveBeenCalledWith(
			'/api/models',
			'hf_test',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ limit: 5 }),
			}),
		);
	});

	it('models.get → /api/models/ns/repo', async () => {
		await ModelsEndpoints.get(ctx(), { repoId: 'gpt2/small' });
		expectPath('/api/models/gpt2/small');
	});

	it('models.createTag body uses tag field (not key)', async () => {
		await ModelsEndpoints.createTag(ctx(), {
			repoId: 'gpt2/small',
			revision: 'main',
			tag: 'v1.0',
			message: 'release',
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/models/gpt2/small/tag/main',
			'hf_test',
			expect.objectContaining({
				method: 'POST',
				body: { tag: 'v1.0', message: 'release' },
			}),
		);
	});

	it('models.createBranch puts branch name in URL, starting point in body', async () => {
		await ModelsEndpoints.createBranch(ctx(), {
			repoId: 'gpt2/small',
			branch: 'dev',
			revision: 'main',
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/models/gpt2/small/branch/dev',
			'hf_test',
			expect.objectContaining({
				method: 'POST',
				body: { startingPoint: 'main' },
			}),
		);
	});

	it('datasets.createBranch puts branch name in URL, starting point in body', async () => {
		await DatasetsEndpoints.createBranch(ctx(), {
			repoId: 'org/data',
			branch: 'experiment',
			revision: 'v2',
			startingPoint: 'v2',
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/datasets/org/data/branch/experiment',
			'hf_test',
			expect.objectContaining({
				method: 'POST',
				body: { startingPoint: 'v2' },
			}),
		);
	});

	it('spaces.createBranch puts branch name in URL, starting point in body', async () => {
		await SpacesEndpoints.createBranch(ctx(), {
			repoId: 'user/space',
			branch: 'preview',
			revision: 'main',
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/spaces/user/space/branch/preview',
			'hf_test',
			expect.objectContaining({
				method: 'POST',
				body: { startingPoint: 'main' },
			}),
		);
	});

	it('datasets.checkValidity uses datasets-server', async () => {
		await DatasetsEndpoints.checkValidity(ctx(), {
			dataset: 'nyu-mll/glue',
		});
		const call = lastCall();
		expect(call[0]).toBe('/is-valid');
		expect(call[2]).toEqual(
			expect.objectContaining({
				baseUrl: Client.HF_DATASETS_SERVER_BASE,
			}),
		);
	});

	it('trending.get → /api/trending', async () => {
		await TrendingEndpoints.get(ctx(), { type: 'model' });
		expectPath('/api/trending');
	});

	it('docs.search → /api/docs/search', async () => {
		await DocsEndpoints.search(ctx(), { q: 'hub' });
		expectPath('/api/docs/search');
	});

	it('collections.list → /api/collections', async () => {
		await CollectionsEndpoints.list(ctx(), { limit: 3 });
		expectPath('/api/collections');
	});

	it('inference.chatCompletion uses inference base', async () => {
		await InferenceEndpoints.chatCompletion(ctx(), {
			model: 'm',
			messages: [{ role: 'user', content: 'hi' }],
		});
		const call = lastCall();
		expect(call[0]).toBe('/v1/chat/completions');
		expect(call[2]?.baseUrl).toBe(Client.LLM_GATEWAY_BASE);
	});

	it('repos.create → /api/repos/create', async () => {
		await ReposEndpoints.create(ctx(), {
			name: 'x',
			type: 'model',
		});
		expectPath('/api/repos/create');
	});

	// --- previously untested groups (Greptile / review-bot P1) ---

	it('settings.listWebhooks → /api/settings/webhooks', async () => {
		await SettingsEndpoints.listWebhooks(ctx(), {});
		expectPath('/api/settings/webhooks');
	});

	it('settings.getBillingUsageV2 → /api/settings/billing/usage-v2', async () => {
		await SettingsEndpoints.getBillingUsageV2(ctx(), {});
		expectPath('/api/settings/billing/usage-v2');
	});

	it('settings.getMcp → /api/settings/mcp', async () => {
		await SettingsEndpoints.getMcp(ctx(), {});
		expectPath('/api/settings/mcp');
	});

	it('discussions.list → /api/models/ns/repo/discussions', async () => {
		await DiscussionsEndpoints.list(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
		});
		expectPath('/api/models/org/model/discussions');
	});

	it('discussions.get → /api/models/ns/repo/discussions/1', async () => {
		await DiscussionsEndpoints.get(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
			discussionNum: 1,
		});
		expectPath('/api/models/org/model/discussions/1');
	});

	it('discussions.create sends title/description/pullRequest body', async () => {
		await DiscussionsEndpoints.create(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
			title: 'Hello',
			description: 'Details here',
			pullRequest: true,
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/models/org/model/discussions',
			'hf_test',
			expect.objectContaining({
				method: 'POST',
				body: {
					title: 'Hello',
					description: 'Details here',
					pullRequest: true,
				},
			}),
		);
	});

	it('papers.getDaily → /api/daily_papers', async () => {
		await PapersEndpoints.getDaily(ctx(), {});
		expectPath('/api/daily_papers');
	});

	it('papers.search → /api/papers/search', async () => {
		await PapersEndpoints.search(ctx(), { q: 'llm' });
		expectPath('/api/papers/search');
	});

	it('spaces.listHardware → /api/spaces/hardware', async () => {
		await SpacesEndpoints.listHardware(ctx(), {});
		expectPath('/api/spaces/hardware');
	});

	it('spaces.createSecret → /api/spaces/ns/repo/secrets', async () => {
		await SpacesEndpoints.createSecret(ctx(), {
			repoId: 'user/space',
			key: 'FOO',
			value: 'bar',
		});
		expectPath('/api/spaces/user/space/secrets');
		expect(lastCall()[2]).toEqual(expect.objectContaining({ method: 'POST' }));
	});

	it('spaces.getMetrics → /api/spaces/ns/repo/metrics (SSE)', async () => {
		await SpacesEndpoints.getMetrics(ctx(), { repoId: 'user/space' });
		const call = lastCall();
		expect(call[0]).toBe('/api/spaces/user/space/metrics');
		expect(call[2]).toEqual(
			expect.objectContaining({ method: 'GET', sse: true, timeoutMs: 10_000 }),
		);
	});

	it('spaces.getEvents → /api/spaces/ns/repo/events (SSE)', async () => {
		await SpacesEndpoints.getEvents(ctx(), { repoId: 'user/space' });
		const call = lastCall();
		expect(call[0]).toBe('/api/spaces/user/space/events');
		expect(call[2]).toEqual(
			expect.objectContaining({ method: 'GET', sse: true, timeoutMs: 10_000 }),
		);
	});

	it('users.getOverview → /api/users/u/overview', async () => {
		await UsersEndpoints.getOverview(ctx(), { username: 'huggingface' });
		expectPath('/api/users/huggingface/overview');
	});

	it('organizations.getMembers → /api/organizations/n/members', async () => {
		await OrganizationsEndpoints.getMembers(ctx(), { name: 'huggingface' });
		expectPath('/api/organizations/huggingface/members');
	});

	it('jobs.getHardware → /api/jobs/hardware', async () => {
		await JobsEndpoints.getHardware(ctx(), {});
		expectPath('/api/jobs/hardware');
	});

	it('endpoints.list uses inference endpoints base', async () => {
		await EndpointsEndpoints.list(ctx(), { namespace: 'my-ns' });
		const call = lastCall();
		expect(call[0]).toBe('/v2/endpoint/my-ns');
		expect(call[2]?.baseUrl).toBe(Client.HF_ENDPOINTS_BASE);
	});

	it('endpoints.listVendors → /v2/provider', async () => {
		await EndpointsEndpoints.listVendors(ctx(), {});
		expect(lastCall()[0]).toBe('/v2/provider');
		expect(lastCall()[2]?.baseUrl).toBe(Client.HF_ENDPOINTS_BASE);
	});
});

describe('summarize redaction', () => {
	it('redacts secrets and free-form PII-bearing fields', () => {
		const out = summarize({
			repoId: 'org/model',
			revision: 'main',
			value: 'sk-123',
			secret: 'hf_abc',
			comment: 'personal email: a@b.c',
			content: 'raw prompt text',
			extra: { stream: true },
			settings: { apiKey: 'x' },
			fields: { email: 'a@b.c' },
			messages: [{ role: 'user', content: 'hi' }],
			limit: 10,
		});
		expect(out).toEqual({
			repoId: 'org/model',
			revision: 'main',
			value: '[redacted]',
			secret: '[redacted]',
			comment: '[redacted]',
			content: '[redacted]',
			extra: '[redacted]',
			settings: '[redacted]',
			fields: '[redacted]',
			messages: '[redacted]',
			limit: 10,
		});
	});

	it('returns an empty record for non-object input', () => {
		expect(summarize('not-an-object')).toEqual({});
		expect(summarize(null)).toEqual({});
		expect(summarize(undefined)).toEqual({});
	});
});
