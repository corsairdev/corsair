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

// Unit tests only assert HTTP path construction â€” skip real event logging.
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
	it('account.getWhoami â†’ /api/whoami-v2', async () => {
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

	it('models.list â†’ /api/models', async () => {
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

	it('models.get â†’ /api/models/ns/repo', async () => {
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
			branch: 'feature/fix',
			revision: 'main',
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/models/gpt2/small/branch/feature%2Ffix',
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
			branch: 'feature/fix',
			revision: 'v2',
			startingPoint: 'v2',
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/datasets/org/data/branch/feature%2Ffix',
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
			branch: 'feature/fix',
			revision: 'main',
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/api/spaces/user/space/branch/feature%2Ffix',
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

	it('trending.get â†’ /api/trending', async () => {
		await TrendingEndpoints.get(ctx(), { type: 'model' });
		expectPath('/api/trending');
	});

	it('docs.search â†’ /api/docs/search', async () => {
		await DocsEndpoints.search(ctx(), { q: 'hub' });
		expectPath('/api/docs/search');
	});

	it('collections.list â†’ /api/collections', async () => {
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

	it('repos.create â†’ /api/repos/create', async () => {
		await ReposEndpoints.create(ctx(), {
			name: 'x',
			type: 'model',
		});
		expectPath('/api/repos/create');
	});

	// --- previously untested groups (Greptile / review-bot P1) ---

	it('settings.listWebhooks â†’ /api/settings/webhooks', async () => {
		await SettingsEndpoints.listWebhooks(ctx(), {});
		expectPath('/api/settings/webhooks');
	});

	it('settings.getBillingUsageV2 â†’ /api/settings/billing/usage-v2', async () => {
		await SettingsEndpoints.getBillingUsageV2(ctx(), {});
		expectPath('/api/settings/billing/usage-v2');
	});

	it('settings.getMcp â†’ /api/settings/mcp', async () => {
		await SettingsEndpoints.getMcp(ctx(), {});
		expectPath('/api/settings/mcp');
	});

	it('discussions.list â†’ /api/models/ns/repo/discussions', async () => {
		await DiscussionsEndpoints.list(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
		});
		expectPath('/api/models/org/model/discussions');
	});

	it('discussions.get â†’ /api/models/ns/repo/discussions/1', async () => {
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

	it('papers.getDaily â†’ /api/daily_papers', async () => {
		await PapersEndpoints.getDaily(ctx(), {});
		expectPath('/api/daily_papers');
	});

	it('papers.search â†’ /api/papers/search', async () => {
		await PapersEndpoints.search(ctx(), { q: 'llm' });
		expectPath('/api/papers/search');
	});

	it('spaces.listHardware â†’ /api/spaces/hardware', async () => {
		await SpacesEndpoints.listHardware(ctx(), {});
		expectPath('/api/spaces/hardware');
	});

	it('spaces.createSecret â†’ /api/spaces/ns/repo/secrets', async () => {
		await SpacesEndpoints.createSecret(ctx(), {
			repoId: 'user/space',
			key: 'FOO',
			value: 'bar',
		});
		expectPath('/api/spaces/user/space/secrets');
		expect(lastCall()[2]).toEqual(expect.objectContaining({ method: 'POST' }));
	});

	it('spaces.getMetrics â†’ /api/spaces/ns/repo/metrics (SSE)', async () => {
		await SpacesEndpoints.getMetrics(ctx(), { repoId: 'user/space' });
		const call = lastCall();
		expect(call[0]).toBe('/api/spaces/user/space/metrics');
		expect(call[2]).toEqual(
			expect.objectContaining({ method: 'GET', sse: true, timeoutMs: 10_000 }),
		);
	});

	it('spaces.getEvents â†’ /api/spaces/ns/repo/events (SSE)', async () => {
		await SpacesEndpoints.getEvents(ctx(), { repoId: 'user/space' });
		const call = lastCall();
		expect(call[0]).toBe('/api/spaces/user/space/events');
		expect(call[2]).toEqual(
			expect.objectContaining({ method: 'GET', sse: true, timeoutMs: 10_000 }),
		);
	});

	it('users.getOverview â†’ /api/users/u/overview', async () => {
		await UsersEndpoints.getOverview(ctx(), { username: 'huggingface' });
		expectPath('/api/users/huggingface/overview');
	});

	it('organizations.getMembers â†’ /api/organizations/n/members', async () => {
		await OrganizationsEndpoints.getMembers(ctx(), { name: 'huggingface' });
		expectPath('/api/organizations/huggingface/members');
	});

	it('jobs.getHardware â†’ /api/jobs/hardware', async () => {
		await JobsEndpoints.getHardware(ctx(), {});
		expectPath('/api/jobs/hardware');
	});

	it('endpoints.list uses inference endpoints base', async () => {
		await EndpointsEndpoints.list(ctx(), { namespace: 'my-ns' });
		const call = lastCall();
		expect(call[0]).toBe('/v2/endpoint/my-ns');
		expect(call[2]?.baseUrl).toBe(Client.HF_ENDPOINTS_BASE);
	});

	it('endpoints.listVendors â†’ /v2/provider', async () => {
		await EndpointsEndpoints.listVendors(ctx(), {});
		expect(lastCall()[0]).toBe('/v2/provider');
		expect(lastCall()[2]?.baseUrl).toBe(Client.HF_ENDPOINTS_BASE);
	});

	it('settings.getLiveBillingUsage â†’ /api/settings/billing/usage/live (SSE)', async () => {
		await SettingsEndpoints.getLiveBillingUsage(ctx(), {});
		const call = lastCall();
		expect(call[0]).toBe('/api/settings/billing/usage/live');
		expect(call[2]).toEqual(
			expect.objectContaining({ method: 'GET', sse: true, timeoutMs: 10_000 }),
		);
	});

	it('settings.getBillingUsageV2 â†’ /api/settings/billing/usage-v2', async () => {
		await SettingsEndpoints.getBillingUsageV2(ctx(), {
			from: 1700000000,
			to: 1700003600,
		});
		expect(lastCall()[0]).toBe('/api/settings/billing/usage-v2');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'GET',
				query: { from: 1700000000, to: 1700003600 },
			}),
		);
	});

	it('settings.getWebhook â†’ GET /api/settings/webhooks/{id}', async () => {
		await SettingsEndpoints.getWebhook(ctx(), { webhookId: 'wh_1' });
		expect(lastCall()[0]).toBe('/api/settings/webhooks/wh_1');
		expect(lastCall()[2]).toEqual(expect.objectContaining({ method: 'GET' }));
	});

	it('settings.listWebhooks â†’ GET /api/settings/webhooks', async () => {
		await SettingsEndpoints.listWebhooks(ctx(), {});
		expectPath('/api/settings/webhooks');
	});

	it('datasets.createTag sends tag body field', async () => {
		await DatasetsEndpoints.createTag(ctx(), {
			repoId: 'org/data',
			tag: 'v1.0',
			revision: 'main',
		});
		const call = lastCall();
		expect(call[0]).toBe('/api/datasets/org/data/tag/main');
		expect(call[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ tag: 'v1.0' }),
			}),
		);
	});

	it('datasets.createCommit sends Hub NDJSON with parentCommit', async () => {
		await DatasetsEndpoints.createCommit(ctx(), {
			repoId: 'org/data',
			revision: 'main',
			summary: 'Update',
			files: [{ path: 'a.txt', content: 'x' }],
			parentCommit: 'abc123',
		});
		const call = lastCall();
		expect(call[0]).toBe('/api/datasets/org/data/commit/main');
		expect(call[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				rawText: true,
				headers: expect.objectContaining({
					'Content-Type': 'application/x-ndjson',
				}),
			}),
		);
		const opts = call[2] as {
			body?: unknown;
		};
		expect(String(opts.body)).toContain('"parentCommit":"abc123"');
		expect(String(opts.body)).toContain('"key":"file"');
	});

	it('datasets.getRows → datasets-server /rows', async () => {
		await DatasetsEndpoints.getRows(ctx(), {
			dataset: 'org/data',
			config: 'default',
			split: 'train',
			offset: 0,
			length: 10,
		});
		const call = lastCall();
		expect(call[0]).toBe('/rows');
		expect(call[2]).toEqual(
			expect.objectContaining({
				method: 'GET',
				baseUrl: Client.HF_DATASETS_SERVER_BASE,
				query: expect.objectContaining({
					dataset: 'org/data',
					config: 'default',
					split: 'train',
				}),
			}),
		);
	});

	it('models.createCommit sends Hub NDJSON with parentCommit + create_pr query', async () => {
		await ModelsEndpoints.createCommit(ctx(), {
			repoId: 'org/model',
			revision: 'main',
			summary: 'Update',
			files: [{ path: 'a.txt', content: 'x' }],
			parentCommit: 'abc123',
			createPr: true,
		});
		const call = lastCall();
		expect(call[0]).toBe('/api/models/org/model/commit/main');
		expect(call[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				rawText: true,
				query: expect.objectContaining({ create_pr: true }),
				headers: expect.objectContaining({
					'Content-Type': 'application/x-ndjson',
				}),
			}),
		);
		const opts = call[2] as {
			body?: unknown;
		};
		expect(String(opts.body)).toContain('"parentCommit":"abc123"');
		expect(String(opts.body)).not.toContain('operations');
	});

	it('models.getResolve uses raw fetch path', async () => {
		await ModelsEndpoints.getResolve(ctx(), {
			repoId: 'org/model',
			revision: 'main',
			path: 'config.json',
		});
		const call = lastCall();
		expect(call[0]).toBe('/org/model/resolve/main/config.json');
		expect(call[2]).toEqual(expect.objectContaining({ rawText: true }));
	});

	it('models.createTag sends tag body field', async () => {
		await ModelsEndpoints.createTag(ctx(), {
			repoId: 'org/model',
			tag: 'v1.0',
			revision: 'main',
		});
		const call = lastCall();
		expect(call[0]).toBe('/api/models/org/model/tag/main');
		expect(call[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ tag: 'v1.0' }),
			}),
		);
	});

	it('settings.updateNotifications → PATCH /api/settings/notifications', async () => {
		await SettingsEndpoints.updateNotifications(ctx(), {
			notifications: { announcements: true },
		});
		expect(lastCall()[0]).toBe('/api/settings/notifications');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'PATCH',
				body: { notifications: { announcements: true } },
			}),
		);
	});

	it('settings.updateWatch â†’ PATCH /api/settings/watch', async () => {
		await SettingsEndpoints.updateWatch(ctx(), {
			add: [{ repo: 'org/repo' }],
			remove: [{ repo: 'other/repo' }],
		});
		expect(lastCall()[0]).toBe('/api/settings/watch');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'PATCH',
				body: {
					add: [{ repo: 'org/repo' }],
					remove: [{ repo: 'other/repo' }],
				},
			}),
		);
	});

	it('settings.createWebhook â†’ POST /api/settings/webhooks with body', async () => {
		await SettingsEndpoints.createWebhook(ctx(), {
			url: 'https://example.com/hook',
			domains: ['example.com'],
			extra: { enabled: true },
		});
		expect(lastCall()[0]).toBe('/api/settings/webhooks');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					url: 'https://example.com/hook',
					domains: ['example.com'],
					enabled: true,
				}),
			}),
		);
	});

	it('settings.updateWebhook â†’ POST /api/settings/webhooks/{id}', async () => {
		await SettingsEndpoints.updateWebhook(ctx(), {
			webhookId: 'wh_1',
			url: 'https://example.com/new',
			extra: { enabled: false },
		});
		expect(lastCall()[0]).toBe('/api/settings/webhooks/wh_1');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					url: 'https://example.com/new',
					enabled: false,
				}),
			}),
		);
	});

	it('settings.deleteWebhook â†’ DELETE /api/settings/webhooks/{id}', async () => {
		await SettingsEndpoints.deleteWebhook(ctx(), { webhookId: 'wh_1' });
		expect(lastCall()[0]).toBe('/api/settings/webhooks/wh_1');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('settings.updateWebhookStatus â†’ POST /api/settings/webhooks/{id}/disable', async () => {
		await SettingsEndpoints.updateWebhookStatus(ctx(), {
			webhookId: 'wh_1',
			action: 'disable',
		});
		expect(lastCall()[0]).toBe('/api/settings/webhooks/wh_1/disable');
		expect(lastCall()[2]).toEqual(expect.objectContaining({ method: 'POST' }));
	});

	it('discussions.createComment â†’ POST .../discussions/1/comment', async () => {
		await DiscussionsEndpoints.createComment(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
			discussionNum: 1,
			comment: 'Nice work',
		});
		expect(lastCall()[0]).toBe('/api/models/org/model/discussions/1/comment');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { comment: 'Nice work' },
			}),
		);
	});

	it('discussions.changeStatus â†’ POST .../discussions/1/status', async () => {
		await DiscussionsEndpoints.changeStatus(ctx(), {
			repoType: 'dataset',
			repoId: 'org/data',
			discussionNum: 1,
			status: 'closed',
		});
		expect(lastCall()[0]).toBe('/api/datasets/org/data/discussions/1/status');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { status: 'closed' },
			}),
		);
	});

	it('discussions.updateTitle â†’ POST .../discussions/1/title', async () => {
		await DiscussionsEndpoints.updateTitle(ctx(), {
			repoType: 'space',
			repoId: 'org/space',
			discussionNum: 1,
			title: 'New title',
		});
		expect(lastCall()[0]).toBe('/api/spaces/org/space/discussions/1/title');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { title: 'New title' },
			}),
		);
	});

	it('discussions.pin â†’ POST .../discussions/1/pin', async () => {
		await DiscussionsEndpoints.pin(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
			discussionNum: 1,
			pinned: true,
		});
		expect(lastCall()[0]).toBe('/api/models/org/model/discussions/1/pin');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { pinned: true },
			}),
		);
	});

	it('discussions.delete â†’ DELETE .../discussions/1', async () => {
		await DiscussionsEndpoints.delete(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
			discussionNum: 1,
		});
		expect(lastCall()[0]).toBe('/api/models/org/model/discussions/1');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('papers.createIndex â†’ POST /api/papers/index with arxivId body', async () => {
		await PapersEndpoints.createIndex(ctx(), { paperId: '2301.12345' });
		expect(lastCall()[0]).toBe('/api/papers/index');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { arxivId: '2301.12345' },
			}),
		);
	});

	it('papers.claimAuthorship â†’ POST /api/settings/papers/claim', async () => {
		await PapersEndpoints.claimAuthorship(ctx(), {
			paperId: '2301.12345',
			extra: { method: 'email' },
		});
		expect(lastCall()[0]).toBe('/api/settings/papers/claim');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { paperId: '2301.12345', method: 'email' },
			}),
		);
	});

	it('papers.createComment â†’ POST /api/papers/{id}/comment', async () => {
		await PapersEndpoints.createComment(ctx(), {
			paperId: '2301.12345',
			comment: 'Nice paper',
		});
		expect(lastCall()[0]).toBe('/api/papers/2301.12345/comment');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { comment: 'Nice paper' },
			}),
		);
	});

	it('papers.createCommentReply â†’ POST /api/papers/{id}/comment/{cid}/reply', async () => {
		await PapersEndpoints.createCommentReply(ctx(), {
			paperId: '2301.12345',
			commentId: 'c1',
			comment: 'Agreed',
		});
		expect(lastCall()[0]).toBe('/api/papers/2301.12345/comment/c1/reply');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { comment: 'Agreed' },
			}),
		);
	});

	it('inference.embeddings â†’ LLM gateway /v1/embeddings', async () => {
		await InferenceEndpoints.embeddings(ctx(), {
			model: 'text-embedding',
			input: 'hello',
		});
		const call = lastCall();
		expect(call[0]).toBe('/v1/embeddings');
		expect(call[2]?.baseUrl).toBe(Client.LLM_GATEWAY_BASE);
		expect(call[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					model: 'text-embedding',
					input: 'hello',
				}),
			}),
		);
	});

	it('repos.listFiles â†’ /api/models/ns/repo/tree/main', async () => {
		await ReposEndpoints.listFiles(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
			revision: 'main',
			path: '',
			recursive: true,
		});
		expect(lastCall()[0]).toBe('/api/models/org/model/tree/main/');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ recursive: true }),
			}),
		);
	});

	it('repos.getResolve â†’ raw resolve path', async () => {
		await ReposEndpoints.getResolve(ctx(), {
			repoType: 'dataset',
			repoId: 'org/data',
			revision: 'main',
			path: 'file.csv',
		});
		expect(lastCall()[0]).toBe('/datasets/org/data/resolve/main/file.csv');
		expect(lastCall()[2]).toEqual(expect.objectContaining({ rawText: true }));
	});

	it('repos.requestAccess â†’ POST ask-access with fields body', async () => {
		await ReposEndpoints.requestAccess(ctx(), {
			repoType: 'model',
			repoId: 'org/model',
			fields: { name: 'Ada' },
		});
		expect(lastCall()[0]).toBe('/org/model/ask-access');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { name: 'Ada' },
			}),
		);
	});

	it('datasets.get â†’ /api/datasets/ns/repo', async () => {
		await DatasetsEndpoints.get(ctx(), { repoId: 'org/data', full: true });
		expect(lastCall()[0]).toBe('/api/datasets/org/data');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'GET',
				query: { full: true },
			}),
		);
	});

	it('datasets.getScan â†’ /api/datasets/ns/repo/scan', async () => {
		await DatasetsEndpoints.getScan(ctx(), { repoId: 'org/data' });
		expectPath('/api/datasets/org/data/scan');
	});

	it('datasets.getResolve uses rawText path', async () => {
		await DatasetsEndpoints.getResolve(ctx(), {
			repoId: 'org/data',
			revision: 'main',
			path: 'data.csv',
		});
		expect(lastCall()[0]).toBe('/datasets/org/data/resolve/main/data.csv');
		expect(lastCall()[2]).toEqual(expect.objectContaining({ rawText: true }));
	});

	it('datasets.deleteBranch â†’ DELETE /api/datasets/.../branch/{name}', async () => {
		await DatasetsEndpoints.deleteBranch(ctx(), {
			repoId: 'org/data',
			branch: 'tmp',
		});
		expect(lastCall()[0]).toBe('/api/datasets/org/data/branch/tmp');
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({ method: 'DELETE' }),
		);
	});

	it('users.getAvatar â†’ /api/users/{username}/avatar', async () => {
		await UsersEndpoints.getAvatar(ctx(), { username: 'alice' });
		expectPath('/api/users/alice/avatar');
	});

	it('users.getSocials â†’ /api/users/{username}/socials', async () => {
		await UsersEndpoints.getSocials(ctx(), { username: 'alice' });
		expectPath('/api/users/alice/socials');
	});

	it('organizations.getAvatar â†’ /api/organizations/{name}/avatar', async () => {
		await OrganizationsEndpoints.getAvatar(ctx(), { name: 'acme' });
		expectPath('/api/organizations/acme/avatar');
	});

	it('organizations.getSocials â†’ /api/organizations/{name}/socials', async () => {
		await OrganizationsEndpoints.getSocials(ctx(), { name: 'acme' });
		expectPath('/api/organizations/acme/socials');
	});

	it('endpoints.deleteNetworkCidr â†’ DELETE /v2/endpoint/.../cidr', async () => {
		await EndpointsEndpoints.deleteNetworkCidr(ctx(), {
			namespace: 'org',
			cidr: '10.0.0.0/8',
		});
		expect(lastCall()[0]).toBe(
			'/v2/endpoint/org/network-security/cidr/10.0.0.0%2F8',
		);
		expect(lastCall()[2]).toEqual(
			expect.objectContaining({
				method: 'DELETE',
				baseUrl: Client.HF_ENDPOINTS_BASE,
			}),
		);
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

	it('redacts nested credential keys under non-sensitive parents', () => {
		const out = summarize({
			repoId: 'org/model',
			metadata: {
				apiKey: 'hf_secret_token',
				nested: { access_token: 'tok_abc', safe: 'ok' },
			},
			items: [{ token: 'leak', name: 'keep' }],
		});
		expect(out).toEqual({
			repoId: 'org/model',
			metadata: {
				apiKey: '[redacted]',
				nested: { access_token: '[redacted]', safe: 'ok' },
			},
			items: [{ token: '[redacted]', name: 'keep' }],
		});
	});

	it('returns an empty record for non-object input', () => {
		expect(summarize('not-an-object')).toEqual({});
		expect(summarize(null)).toEqual({});
		expect(summarize(undefined)).toEqual({});
	});
});
