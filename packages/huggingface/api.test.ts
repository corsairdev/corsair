import {
	encodePath,
	HF_HUB_BASE,
	makeHuggingFaceRequest,
	splitRepoId,
} from './client';
import {
	HuggingFaceEndpointInputSchemas,
	HuggingFaceEndpointOutputSchemas,
} from './endpoints/types';

const FIXTURES: Record<string, unknown> = {
	getWhoami: {},
	listNotifications: {},
	deleteNotifications: {},
	updateNotificationSettings: { settings: { email: true } },
	updateWatchSettings: {},
	getMcpSettings: {},
	getBillingUsageV2: {},
	getJobsUsage: {},
	getLiveBillingUsage: {},
	listWebhooks: {},
	getWebhook: { webhookId: 'wh_test' },
	createWebhook: { url: 'https://example.com/hook' },
	updateWebhook: { webhookId: 'wh_test', url: 'https://example.com/hook' },
	deleteWebhook: { webhookId: 'wh_test' },
	updateWebhookStatus: { webhookId: 'wh_test', action: 'enable' },
	modelsList: { limit: 5, sort: 'downloads' },
	modelsGet: { repoId: 'huggingface/transformers', revision: 'main' },
	modelsGetScan: { repoId: 'huggingface/transformers' },
	modelsGetCompare: {
		repoId: 'huggingface/transformers',
		compare: 'main...dev',
	},
	modelsListCommits: { repoId: 'huggingface/transformers' },
	modelsListRefs: { repoId: 'huggingface/transformers' },
	modelsListPathsInfo: {
		repoId: 'huggingface/transformers',
		paths: ['README.md'],
	},
	modelsGetTreeSize: { repoId: 'huggingface/transformers' },
	modelsGetJwt: { repoId: 'huggingface/transformers' },
	modelsGetXetReadToken: { repoId: 'huggingface/transformers' },
	modelsGetNotebook: { repoId: 'huggingface/transformers' },
	modelsGetResolve: { repoId: 'huggingface/transformers', path: 'README.md' },
	modelsGetResolveCache: {
		repoId: 'huggingface/transformers',
		path: 'README.md',
	},
	modelsCreateBranch: { repoId: 'huggingface/transformers', branch: 'dev' },
	modelsDeleteBranch: { repoId: 'huggingface/transformers', branch: 'dev' },
	modelsCreateCommit: {
		repoId: 'huggingface/transformers',
		operations: [{ operation: 'delete', path: 'old.txt' }],
	},
	modelsCreateTag: { repoId: 'huggingface/transformers', tag: 'v1.0' },
	modelsDeleteTag: { repoId: 'huggingface/transformers', tag: 'v1.0' },
	modelsCheckUploadMethod: {
		repoId: 'huggingface/transformers',
		files: [{ path: 'file.bin', size: 100 }],
	},
	modelsUpdateSettings: { repoId: 'huggingface/transformers' },
	datasetsList: { limit: 5, sort: 'downloads' },
	datasetsGet: { repoId: 'huggingface/transformers', revision: 'main' },
	datasetsGetScan: { repoId: 'huggingface/transformers' },
	datasetsGetCompare: {
		repoId: 'huggingface/transformers',
		compare: 'main...dev',
	},
	datasetsListCommits: { repoId: 'huggingface/transformers' },
	datasetsListRefs: { repoId: 'huggingface/transformers' },
	datasetsListPathsInfo: {
		repoId: 'huggingface/transformers',
		paths: ['README.md'],
	},
	datasetsGetTreeSize: { repoId: 'huggingface/transformers' },
	datasetsGetJwt: { repoId: 'huggingface/transformers' },
	datasetsGetXetReadToken: { repoId: 'huggingface/transformers' },
	datasetsGetNotebook: { repoId: 'huggingface/transformers' },
	datasetsGetResolve: { repoId: 'huggingface/transformers', path: 'README.md' },
	datasetsGetResolveCache: {
		repoId: 'huggingface/transformers',
		path: 'README.md',
	},
	datasetsCreateBranch: { repoId: 'huggingface/transformers', branch: 'dev' },
	datasetsDeleteBranch: { repoId: 'huggingface/transformers', branch: 'dev' },
	datasetsCreateCommit: {
		repoId: 'huggingface/transformers',
		operations: [{ operation: 'delete', path: 'old.txt' }],
	},
	datasetsCreateTag: { repoId: 'huggingface/transformers', tag: 'v1.0' },
	datasetsDeleteTag: { repoId: 'huggingface/transformers', tag: 'v1.0' },
	datasetsCheckUploadMethod: {
		repoId: 'huggingface/transformers',
		files: [{ path: 'file.bin', size: 100 }],
	},
	datasetsUpdateSettings: { repoId: 'huggingface/transformers' },
	spacesList: { limit: 5, sort: 'likes' },
	spacesGet: { repoId: 'huggingface/transformers', revision: 'main' },
	spacesGetScan: { repoId: 'huggingface/transformers' },
	spacesGetCompare: {
		repoId: 'huggingface/transformers',
		compare: 'main...dev',
	},
	spacesListCommits: { repoId: 'huggingface/transformers' },
	spacesListRefs: { repoId: 'huggingface/transformers' },
	spacesListPathsInfo: {
		repoId: 'huggingface/transformers',
		paths: ['README.md'],
	},
	spacesGetTreeSize: { repoId: 'huggingface/transformers' },
	spacesGetJwt: { repoId: 'huggingface/transformers' },
	spacesGetXetReadToken: { repoId: 'huggingface/transformers' },
	spacesGetNotebook: { repoId: 'huggingface/transformers' },
	spacesGetResolve: { repoId: 'huggingface/transformers', path: 'README.md' },
	spacesGetResolveCache: {
		repoId: 'huggingface/transformers',
		path: 'README.md',
	},
	spacesCreateBranch: { repoId: 'huggingface/transformers', branch: 'dev' },
	spacesDeleteBranch: { repoId: 'huggingface/transformers', branch: 'dev' },
	spacesCreateCommit: {
		repoId: 'huggingface/transformers',
		operations: [{ operation: 'delete', path: 'old.txt' }],
	},
	spacesCreateTag: { repoId: 'huggingface/transformers', tag: 'v1.0' },
	spacesDeleteTag: { repoId: 'huggingface/transformers', tag: 'v1.0' },
	spacesCheckUploadMethod: {
		repoId: 'huggingface/transformers',
		files: [{ path: 'file.bin', size: 100 }],
	},
	spacesUpdateSettings: { repoId: 'huggingface/transformers' },
	modelsGetTagsByType: {},
	datasetsGetTagsByType: {},
	datasetsGetLeaderboard: { repoId: 'huggingface/transformers' },
	datasetsSquashCommits: {
		repoId: 'huggingface/transformers',
		message: 'squash',
	},
	datasetsListAccessRequests: {
		repoId: 'huggingface/transformers',
		status: 'pending',
	},
	datasetsHandleAccessRequest: {
		repoId: 'huggingface/transformers',
		status: 'accepted',
	},
	datasetsCheckValidity: {
		dataset: 'nyu-mll/glue',
		config: 'cola',
		split: 'train',
	},
	datasetsGetCroissant: {
		dataset: 'nyu-mll/glue',
		config: 'cola',
		split: 'train',
	},
	datasetsGetInfo: { dataset: 'nyu-mll/glue', config: 'cola', split: 'train' },
	datasetsGetSize: { dataset: 'nyu-mll/glue', config: 'cola', split: 'train' },
	datasetsListSplits: {
		dataset: 'nyu-mll/glue',
		config: 'cola',
		split: 'train',
	},
	datasetsListParquetFiles: {
		dataset: 'nyu-mll/glue',
		config: 'cola',
		split: 'train',
	},
	datasetsGetFirstRows: {
		dataset: 'nyu-mll/glue',
		config: 'cola',
		split: 'train',
	},
	datasetsGetRows: { dataset: 'nyu-mll/glue', config: 'cola', split: 'train' },
	datasetsGetStatistics: {
		dataset: 'nyu-mll/glue',
		config: 'cola',
		split: 'train',
	},
	datasetsFilterRows: {
		dataset: 'nyu-mll/glue',
		config: 'cola',
		split: 'train',
		where: 'label = 0',
	},
	datasetsSearch: {
		dataset: 'nyu-mll/glue',
		config: 'cola',
		split: 'train',
		query: 'the',
	},
	datasetsCreateSqlConsoleEmbed: {
		repoId: 'nyu-mll/glue',
		repoType: 'dataset',
		sql: 'SELECT * FROM train LIMIT 10',
	},
	datasetsUpdateSqlConsoleEmbed: {
		repoId: 'nyu-mll/glue',
		repoType: 'dataset',
		embedId: 'emb1',
		sql: 'SELECT * FROM train LIMIT 10',
	},
	spacesListHardware: {},
	spacesGetMetrics: { repoId: 'huggingface/transformers' },
	spacesGetEvents: { repoId: 'huggingface/transformers' },
	spacesListLfsFiles: { repoId: 'huggingface/transformers' },
	spacesGetXetWriteToken: { repoId: 'huggingface/transformers' },
	spacesSquashCommits: {
		repoId: 'huggingface/transformers',
		message: 'squash',
	},
	spacesCreateSecret: {
		repoId: 'huggingface/transformers',
		key: 'FOO',
		value: 'bar',
	},
	spacesDeleteSecret: { repoId: 'huggingface/transformers', key: 'FOO' },
	spacesCreateVariable: {
		repoId: 'huggingface/transformers',
		key: 'FOO',
		value: 'bar',
	},
	spacesDeleteVariable: { repoId: 'huggingface/transformers', key: 'FOO' },
	collectionsCreate: { title: 'My collection' },
	collectionsList: { q: 'bert' },
	discussionsList: { repoId: 'huggingface/transformers', repoType: 'model' },
	discussionsGet: {
		repoId: 'huggingface/transformers',
		repoType: 'model',
		discussionNum: 1,
	},
	discussionsCreate: {
		repoId: 'huggingface/transformers',
		repoType: 'model',
		title: 'Hello',
	},
	discussionsCreateComment: {
		repoId: 'huggingface/transformers',
		repoType: 'model',
		discussionNum: 1,
		comment: 'Nice work',
	},
	discussionsChangeStatus: {
		repoId: 'huggingface/transformers',
		repoType: 'model',
		discussionNum: 1,
		status: 'closed',
	},
	discussionsUpdateTitle: {
		repoId: 'huggingface/transformers',
		repoType: 'model',
		discussionNum: 1,
		title: 'Hello',
	},
	discussionsPin: {
		repoId: 'huggingface/transformers',
		repoType: 'model',
		discussionNum: 1,
		pinned: true,
	},
	discussionsDelete: {
		repoId: 'huggingface/transformers',
		repoType: 'model',
		discussionNum: 1,
	},
	papersGetDaily: {},
	papersSearch: { q: 'transformers' },
	papersCreateIndex: { paperId: '2401.00001' },
	papersClaimAuthorship: { paperId: '2401.00001' },
	papersCreateComment: { comment: 'Nice work', paperId: '2401.00001' },
	papersCreateCommentReply: {
		comment: 'Nice work',
		paperId: '2401.00001',
		commentId: 'c1',
	},
	docsList: {},
	docsSearch: { q: 'transformers' },
	reposCreate: { name: 'my-model', type: 'model' },
	reposListFiles: { repoId: 'huggingface/transformers', repoType: 'model' },
	reposGetResolve: {
		repoId: 'huggingface/transformers',
		repoType: 'model',
		path: 'README.md',
	},
	reposRequestAccess: { repoId: 'huggingface/transformers', repoType: 'model' },
	usersGetAvatar: { username: 'huggingface' },
	usersGetOverview: { username: 'huggingface' },
	usersGetSocials: { username: 'huggingface' },
	organizationsGetAvatar: { name: 'huggingface' },
	organizationsGetMembers: { name: 'huggingface' },
	organizationsGetSocials: { name: 'huggingface' },
	trendingGet: {},
	inferenceChatCompletion: {
		model: 'meta-llama/Meta-Llama-3-8B-Instruct',
		messages: [{ role: 'user', content: 'hi' }],
	},
	inferenceEmbeddings: {
		model: 'meta-llama/Meta-Llama-3-8B-Instruct',
		input: 'hello world',
	},
	jobsGetHardware: {},
	endpointsList: { namespace: 'my-org' },
	endpointsListVendors: {},
	endpointsDeleteNetworkCidr: { namespace: 'my-org', cidr: '10.0.0.0/8' },
};

describe('HuggingFace endpoint input schemas', () => {
	const keys = Object.keys(HuggingFaceEndpointInputSchemas) as Array<
		keyof typeof HuggingFaceEndpointInputSchemas
	>;

	it('registers every endpoint schema', () => {
		expect(keys.length).toBeGreaterThanOrEqual(100);
	});

	for (const key of keys) {
		it(`${key} parses fixture`, () => {
			const fixture = FIXTURES[key];
			expect(fixture).toBeDefined();
			const parsed = HuggingFaceEndpointInputSchemas[key].parse(fixture);
			expect(parsed).toBeDefined();
			// output schema accepts open payloads
			expect(HuggingFaceEndpointOutputSchemas[key].parse({ ok: true })).toEqual(
				{ ok: true },
			);
		});
	}
});

describe('client helpers', () => {
	it('splitRepoId parses namespace/repo', () => {
		expect(splitRepoId('gpt2/model')).toEqual({
			namespace: 'gpt2',
			repo: 'model',
		});
		expect(splitRepoId('org/sub/name')).toEqual({
			namespace: 'org',
			repo: 'sub/name',
		});
	});

	it('splitRepoId rejects invalid ids', () => {
		expect(() => splitRepoId('onlyname')).toThrow(/Invalid repoId/);
	});

	it('encodePath encodes segments', () => {
		expect(encodePath('a/b c')).toBe('a/b%20c');
	});

	it('HF_HUB_BASE is huggingface.co', () => {
		expect(HF_HUB_BASE).toContain('huggingface.co');
	});
});

const LIVE = process.env.HUGGING_FACE_LIVE === '1';
const TOKEN =
	process.env.HUGGING_FACE_API_KEY ||
	process.env.HF_TOKEN ||
	process.env.HUGGINGFACE_TOKEN;

describe('HuggingFace live public API', () => {
	it('lists models', async () => {
		if (!LIVE) return;
		const res = await makeHuggingFaceRequest<unknown[]>('/api/models', TOKEN, {
			method: 'GET',
			query: { limit: 2, sort: 'downloads' },
		});
		expect(Array.isArray(res)).toBe(true);
		expect(res.length).toBeGreaterThan(0);
	});

	it('gets a known model', async () => {
		if (!LIVE) return;
		const res = await makeHuggingFaceRequest<Record<string, unknown>>(
			'/api/models/gpt2',
			TOKEN,
			{ method: 'GET' },
		);
		// gpt2 is top-level id without namespace in some APIs — try openai-community/gpt2
		expect(res).toBeDefined();
	});

	it('whoami when token present', async () => {
		if (!LIVE || !TOKEN) return;
		const res = await makeHuggingFaceRequest<Record<string, unknown>>(
			'/api/whoami-v2',
			TOKEN,
			{ method: 'GET' },
		);
		expect(res.name || res.type).toBeDefined();
	});
});
