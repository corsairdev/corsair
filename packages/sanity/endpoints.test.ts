import { logEventFromContext } from 'corsair/core';
import { SanityAPIError, SanityError } from './client';
import {
	generate as agentGenerate,
	prompt as agentPrompt,
	transform as agentTransform,
	translate as agentTranslate,
} from './endpoints/agent-actions';
import { upload as assetsUpload } from './endpoints/assets';
import {
	create as datasetsCreate,
	deleteDataset as datasetsDelete,
	list as datasetsList,
} from './endpoints/datasets';
import {
	create as documentsCreate,
	deleteDocuments as documentsDelete,
	discardDraft as documentsDiscardDraft,
	edit as documentsEdit,
	get as documentsGet,
	history as documentsHistory,
	mutate as documentsMutate,
	patch as documentsPatch,
	publish as documentsPublish,
	query as documentsQuery,
	transactions as documentsTransactions,
	unpublish as documentsUnpublish,
	parseNdjson,
} from './endpoints/documents';
import { list as schemasList } from './endpoints/schemas';
import { isStrictBase64, MAX_UPLOAD_BYTES } from './endpoints/types';
import {
	attempts as webhooksAttempts,
	create as webhooksCreate,
	deleteWebhook as webhooksDelete,
	list as webhooksList,
	update as webhooksUpdate,
	withoutSecret,
} from './endpoints/webhooks';
import {
	API,
	DATASET,
	jsonResponse,
	PROJECT_ID,
	TOKEN,
	textResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = logEventFromContext as jest.Mock;

type Ctx = Parameters<typeof documentsQuery>[0];

// unknown: endpoints read ctx.key, ctx.options and ctx.keys; the rest is the runtime's.
const makeCtx = (
	options: Record<string, unknown> = { projectId: PROJECT_ID },
	keys: Record<string, () => Promise<string | null>> = {},
	// unknown: endpoints read ctx.key, ctx.options and ctx.keys; the rest is the runtime's.
) => ({ key: TOKEN, options, keys }) as unknown as Ctx;

const ctx = makeCtx();

let fetchMock: jest.SpyInstance;

const callOf = (index: number) => {
	const [url, init] = fetchMock.mock.calls[index];
	return {
		url: String(url),
		init,
		body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
	};
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('project and dataset', () => {
	it('uses the stored project id and dataset when no option names them', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ result: 1, ms: 1 }));
		await documentsQuery(
			makeCtx(
				{},
				{
					get_project_id: async () => 'stored99',
					get_dataset: async () => 'staging',
				},
			),
			{ query: 'count(*)' },
		);
		expect(callOf(0).url).toBe(
			'https://stored99.api.sanity.io/v2025-02-19/data/query/staging?returnQuery=false',
		);
	});

	it('falls back to production and lets a call name another dataset', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ result: 1 }))
			.mockResolvedValueOnce(jsonResponse({ result: 1 }));
		await documentsQuery(ctx, { query: 'count(*)' });
		await documentsQuery(ctx, { query: 'count(*)', dataset: 'blog-staging' });
		expect(callOf(0).url).toContain('/data/query/production?');
		expect(callOf(1).url).toContain('/data/query/blog-staging?');
	});

	it('raises auth-missing without a project id, before any request', async () => {
		await expect(
			documentsQuery(makeCtx({}), { query: 'count(*)' }),
		).rejects.toThrow(/auth-missing:sanity:project_id/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a project id that could change the host', async () => {
		await expect(
			documentsQuery(makeCtx({ projectId: 'evil.com/x' }), { query: '*' }),
		).rejects.toBeInstanceOf(SanityError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a dataset name with a path in it', async () => {
		await expect(
			documentsQuery(ctx, { query: '*', dataset: '../projects' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('documents.query', () => {
	it('POSTs the query and params with the bearer token, and the perspective in the URL', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ result: [{ _id: 'a' }], ms: 4, syncTags: ['s1'] }),
		);
		const response = await documentsQuery(ctx, {
			query: '*[_type == $type]',
			params: { type: 'post' },
			perspective: ['rSpring', 'drafts'],
		});
		const { url, init, body } = callOf(0);
		expect(url).toBe(
			`${API}/data/query/${DATASET}?perspective=rSpring%2Cdrafts&returnQuery=false`,
		);
		expect(init.method).toBe('POST');
		expect(init.redirect).toBe('error');
		expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);
		expect(body).toEqual({
			query: '*[_type == $type]',
			params: { type: 'post' },
		});
		expect(response).toMatchObject({ result: [{ _id: 'a' }], ms: 4 });
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'sanity.documents.query',
			expect.objectContaining({ dataset: DATASET }),
			'completed',
		);
	});

	it("throws Sanity's description and error type", async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					error: {
						description: "expected ']' following expression",
						type: 'queryParseError',
						start: 1,
						end: 2,
					},
				},
				400,
				{ 'x-request-id': 'req-9' },
			),
		);
		const error = await documentsQuery(ctx, { query: '*[' }).catch((e) => e);
		expect(error).toBeInstanceOf(SanityAPIError);
		expect(error.status).toBe(400);
		expect(error.errorType).toBe('queryParseError');
		expect(error.requestId).toBe('req-9');
		expect(error.message).toBe(
			"Sanity 400: expected ']' following expression (queryParseError). Request id: req-9.",
		);
	});
});

describe('documents.get', () => {
	it('fetches ids comma-separated and passes omitted through', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				documents: [{ _id: 'drafts.a', _type: 'post' }],
				omitted: [{ id: 'a', reason: 'existence' }],
			}),
		);
		const response = await documentsGet(ctx, { ids: ['a', 'drafts.a'] });
		expect(callOf(0).url).toBe(`${API}/data/doc/${DATASET}/a,drafts.a`);
		expect(callOf(0).init.method).toBe('GET');
		expect(response.omitted).toEqual([{ id: 'a', reason: 'existence' }]);
	});

	it('refuses ids with characters Sanity never uses', async () => {
		await expect(documentsGet(ctx, { ids: ['a/../b'] })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('documents.create', () => {
	it('creates a draft through the Actions API by default', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx1' }));
		const response = await documentsCreate(ctx, {
			document: { _id: 'post-1', _type: 'post', title: 'Hi' },
		});
		const { url, body } = callOf(0);
		expect(url).toBe(`${API}/data/actions/${DATASET}`);
		expect(body).toEqual({
			actions: [
				{
					actionType: 'sanity.action.document.create',
					publishedId: 'post-1',
					document: { _id: 'drafts.post-1', _type: 'post', title: 'Hi' },
					ifExists: 'fail',
				},
			],
		});
		expect(response).toEqual({
			transactionId: 'tx1',
			id: 'post-1',
			draftId: 'drafts.post-1',
			published: false,
		});
	});

	it('makes an id when none is given, and publishes in the same transaction', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx2' }));
		const response = await documentsCreate(ctx, {
			document: { _type: 'post' },
			publish: true,
			dryRun: true,
		});
		const { body } = callOf(0);
		expect(response.id).toMatch(/^[0-9a-f-]{36}$/);
		expect(body.dryRun).toBe(true);
		expect(body.actions[1]).toEqual({
			actionType: 'sanity.action.document.publish',
			publishedId: response.id,
			versionId: `drafts.${response.id}`,
		});
		expect(response.published).toBe(true);
	});

	it('takes a drafts. id as the document id', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx' }));
		const response = await documentsCreate(ctx, {
			document: { _id: 'drafts.post-2', _type: 'post' },
			ifExists: 'ignore',
		});
		expect(response.id).toBe('post-2');
		expect(callOf(0).body.actions[0]).toMatchObject({
			publishedId: 'post-2',
			ifExists: 'ignore',
		});
	});
});

describe('documents.edit', () => {
	it('sends only the patch operations given, to the draft', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx' }));
		await documentsEdit(ctx, {
			id: 'post-1',
			set: { title: 'New' },
			unset: ['subtitle'],
			insert: { after: 'tags[-1]', items: ['x'] },
		});
		expect(callOf(0).body).toEqual({
			actions: [
				{
					actionType: 'sanity.action.document.edit',
					publishedId: 'post-1',
					versionId: 'drafts.post-1',
					patch: {
						set: { title: 'New' },
						unset: ['subtitle'],
						insert: { after: 'tags[-1]', items: ['x'] },
					},
				},
			],
		});
	});

	it('publishes in the same transaction when asked', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx' }));
		const response = await documentsEdit(ctx, {
			id: 'drafts.post-1',
			inc: { views: 1 },
			publish: true,
		});
		expect(
			callOf(0).body.actions.map((a: { actionType: string }) => a.actionType),
		).toEqual([
			'sanity.action.document.edit',
			'sanity.action.document.publish',
		]);
		expect(response).toMatchObject({ id: 'post-1', published: true });
	});

	it('needs at least one patch operation', async () => {
		await expect(documentsEdit(ctx, { id: 'post-1' })).rejects.toThrow(
			/at least one of set/,
		);
	});

	it('refuses an insert with two positions', async () => {
		await expect(
			documentsEdit(ctx, {
				id: 'post-1',
				insert: { after: 'a[-1]', before: 'a[0]', items: [1] },
			}),
		).rejects.toThrow(/exactly one of before, after or replace/);
	});
});

describe('documents.patch', () => {
	it('patches the exact id with ifRevisionID and returns the document', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				transactionId: 'tx',
				results: [
					{
						id: 'post-1',
						operation: 'update',
						document: { _id: 'post-1', _type: 'post', views: 2 },
					},
				],
			}),
		);
		const response = await documentsPatch(ctx, {
			id: 'post-1',
			inc: { views: 1 },
			ifRevisionId: 'rev-1',
		});
		const { url, body } = callOf(0);
		expect(url).toBe(`${API}/data/mutate/${DATASET}?returnDocuments=true`);
		expect(body).toEqual({
			mutations: [
				{ patch: { id: 'post-1', inc: { views: 1 }, ifRevisionID: 'rev-1' } },
			],
		});
		expect(response).toEqual({
			transactionId: 'tx',
			document: { _id: 'post-1', _type: 'post', views: 2 },
		});
	});

	it('passes a 409 revision conflict through', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					error: {
						description: 'transaction failed',
						type: 'mutationError',
						items: [
							{ error: { description: 'Document has unexpected revision ID' } },
						],
					},
				},
				409,
			),
		);
		const error = await documentsPatch(ctx, {
			id: 'post-1',
			set: { a: 1 },
			ifRevisionId: 'old',
		}).catch((e) => e);
		expect(error.status).toBe(409);
		expect(error.message).toContain('Document has unexpected revision ID');
	});
});

describe('documents.publish, unpublish, discardDraft and delete', () => {
	it('publishes with the revision guards renamed to the current fields', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx' }));
		const response = await documentsPublish(ctx, {
			id: 'post-1',
			ifDraftRevisionId: 'd1',
			ifPublishedRevisionId: 'p1',
		});
		expect(callOf(0).body.actions).toEqual([
			{
				actionType: 'sanity.action.document.publish',
				publishedId: 'post-1',
				versionId: 'drafts.post-1',
				ifVersionRevisionId: 'd1',
				ifPublishedRevisionId: 'p1',
			},
		]);
		expect(response).toEqual({
			transactionId: 'tx',
			id: 'post-1',
			draftId: 'drafts.post-1',
		});
	});

	it('unpublishes into the draft', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx' }));
		await documentsUnpublish(ctx, { id: 'post-1' });
		expect(callOf(0).body.actions).toEqual([
			{
				actionType: 'sanity.action.document.unpublish',
				publishedId: 'post-1',
				versionId: 'drafts.post-1',
			},
		]);
	});

	it('discards the draft with version.discard', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx' }));
		await documentsDiscardDraft(ctx, { id: 'post-1', purge: true });
		expect(callOf(0).body.actions).toEqual([
			{
				actionType: 'sanity.action.document.version.discard',
				versionId: 'drafts.post-1',
				purge: true,
			},
		]);
	});

	it('deletes each document with its draft, once per id', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));
		const response = await documentsDelete(ctx, {
			ids: ['a', 'drafts.a', 'b'],
		});
		expect(callOf(0).body.actions).toEqual([
			{
				actionType: 'sanity.action.document.delete',
				publishedId: 'a',
				includeDrafts: ['drafts.a'],
			},
			{
				actionType: 'sanity.action.document.delete',
				publishedId: 'b',
				includeDrafts: ['drafts.b'],
			},
		]);
		// Nothing to delete: Sanity answers {} with no transaction.
		expect(response).toEqual({ ids: ['a', 'b'] });
	});
});

describe('documents.mutate', () => {
	it('sends the mutations, transaction id and options', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				transactionId: 'mine',
				results: [{ id: 'a', operation: 'create' }],
			}),
		);
		const response = await documentsMutate(ctx, {
			mutations: [{ create: { _type: 'post' } }, { delete: { id: 'b' } }],
			transactionId: 'mine',
			visibility: 'async',
			autoGenerateArrayKeys: true,
		});
		const { url, body } = callOf(0);
		expect(url).toBe(
			`${API}/data/mutate/${DATASET}?returnIds=true&visibility=async&autoGenerateArrayKeys=true`,
		);
		expect(body).toEqual({
			mutations: [{ create: { _type: 'post' } }, { delete: { id: 'b' } }],
			transactionId: 'mine',
		});
		expect(response.results).toEqual([{ id: 'a', operation: 'create' }]);
	});

	it('refuses a mutation that is not one known kind', async () => {
		await expect(
			documentsMutate(ctx, { mutations: [{ create: {}, delete: {} }] }),
		).rejects.toThrow(/Each mutation is one of/);
		await expect(
			documentsMutate(ctx, { mutations: [{ drop: {} }] }),
		).rejects.toThrow(/Each mutation is one of/);
	});
});

describe('documents.history and transactions', () => {
	it('reads a revision', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ documents: [{ _id: 'a', _type: 'post', _rev: 'r1' }] }),
		);
		const response = await documentsHistory(ctx, { id: 'a', revision: 'r1' });
		expect(callOf(0).url).toBe(
			`${API}/data/history/${DATASET}/documents/a?revision=r1`,
		);
		expect(response.document).toMatchObject({ _rev: 'r1' });
	});

	it('answers null for a time before the document existed', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ documents: [] }));
		const response = await documentsHistory(ctx, {
			id: 'a',
			time: '2020-01-01T00:00:00Z',
		});
		expect(response.document).toBeNull();
	});

	it('reads the last revision of a deleted document', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ documents: [{ _id: 'a', _type: 'post' }] }),
		);
		await documentsHistory(ctx, { id: 'a', lastRevision: true });
		expect(callOf(0).url).toContain('?lastRevision=true');
	});

	it('needs exactly one of revision, time or lastRevision', async () => {
		await expect(documentsHistory(ctx, { id: 'a' })).rejects.toThrow(
			/exactly one/,
		);
		await expect(
			documentsHistory(ctx, { id: 'a', revision: 'r', lastRevision: true }),
		).rejects.toThrow(/exactly one/);
	});

	it('always sends excludeContent (Sanity answers 403 without it) and parses NDJSON', async () => {
		fetchMock.mockResolvedValueOnce(
			textResponse(
				'{"id":"t1","timestamp":"2026-11-10T00:00:00Z","author":"u","mutations":[{"create":{"_id":"a"}}],"documentIDs":["a"]}\n' +
					'{"id":"t2","timestamp":"2026-11-10T00:00:01Z","author":"u","mutations":[],"documentIDs":["a"]}\n',
			),
		);
		const response = await documentsTransactions(ctx, {
			ids: ['a', 'drafts.a'],
			authors: ['u1', 'u2'],
			reverse: true,
		});
		const { url, init } = callOf(0);
		expect(url).toBe(
			`${API}/data/history/${DATASET}/transactions/a,drafts.a?limit=20&reverse=true&authors=u1%2Cu2&excludeContent=true`,
		);
		expect(init.headers.Accept).toBe('application/x-ndjson');
		expect(response.transactions.map((t) => t.id)).toEqual(['t1', 't2']);
	});

	it('refuses an NDJSON line that is not JSON', () => {
		expect(() => parseNdjson('{"id":1}\nnot json\n')).toThrow(SanityError);
		expect(parseNdjson('\n\n')).toEqual([]);
	});
});

describe('assets.upload', () => {
	const PNG = 'iVBORw0KGgo=';

	it('POSTs the bytes with their type and the metadata as query params', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				document: {
					_id: 'image-abc-1x1-png',
					_type: 'sanity.imageAsset',
					url: 'https://cdn.sanity.io/images/x/y/abc-1x1.png',
				},
			}),
		);
		const response = await assetsUpload(ctx, {
			kind: 'image',
			contentBase64: PNG,
			contentType: 'image/png',
			filename: 'a.png',
			imageMetadata: ['palette', 'exif'],
		});
		const { url, init } = callOf(0);
		expect(url).toBe(
			`${API}/assets/images/${DATASET}?filename=a.png&meta=palette&meta=exif`,
		);
		expect(init.headers['Content-Type']).toBe('image/png');
		expect(Buffer.from(init.body)).toEqual(Buffer.from(PNG, 'base64'));
		expect(response.asset._id).toBe('image-abc-1x1-png');
	});

	it('uploads files to the files route without image metadata', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				document: { _id: 'file-abc-txt', _type: 'sanity.fileAsset' },
			}),
		);
		await assetsUpload(ctx, {
			kind: 'file',
			contentBase64: Buffer.from('hi').toString('base64'),
			contentType: 'text/plain',
			imageMetadata: ['exif'],
		});
		expect(callOf(0).url).toBe(`${API}/assets/files/${DATASET}`);
	});

	it('accepts a file at the 25 MB limit and refuses one byte more, before any request', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				document: { _id: 'file-big', _type: 'sanity.fileAsset' },
			}),
		);
		const atLimit = Buffer.alloc(MAX_UPLOAD_BYTES, 7).toString('base64');
		await assetsUpload(ctx, {
			kind: 'file',
			contentBase64: atLimit,
			contentType: 'application/octet-stream',
		});
		expect(Buffer.from(callOf(0).init.body).byteLength).toBe(MAX_UPLOAD_BYTES);

		const overLimit = Buffer.alloc(MAX_UPLOAD_BYTES + 1, 7).toString('base64');
		await expect(
			assetsUpload(ctx, {
				kind: 'file',
				contentBase64: overLimit,
				contentType: 'application/octet-stream',
			}),
		).rejects.toThrow();
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('checks base64 padding and characters', () => {
		for (const valid of ['QQ==', 'QUI=', 'QUJD', 'QUJDRA==']) {
			expect(isStrictBase64(valid)).toBe(true);
		}
		for (const invalid of ['QQ', 'A===', 'QQ=A', 'QQ==QQ==', 'Q-_=', 'Q Q=']) {
			expect(isStrictBase64(invalid)).toBe(false);
		}
	});

	it('refuses base64 that is not strict', async () => {
		await expect(
			assetsUpload(ctx, {
				kind: 'file',
				contentBase64: 'not base64!!',
				contentType: 'text/plain',
			}),
		).rejects.toThrow(/base64/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('datasets', () => {
	it('lists the project datasets', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse([{ name: 'production', aclMode: 'public' }]),
		);
		const response = await datasetsList(ctx, {});
		expect(callOf(0).url).toBe(`${API}/datasets`);
		expect(response.datasets).toEqual([
			{ name: 'production', aclMode: 'public' },
		]);
	});

	it('creates with PUT and only the ACL asked for', async () => {
		fetchMock
			.mockResolvedValueOnce(
				jsonResponse({ datasetName: 'staging', aclMode: 'public' }),
			)
			.mockResolvedValueOnce(
				jsonResponse({ datasetName: 'drafts2', aclMode: 'private' }),
			);
		await datasetsCreate(ctx, { name: 'staging' });
		await datasetsCreate(ctx, { name: 'drafts2', aclMode: 'private' });
		expect(callOf(0).init.method).toBe('PUT');
		expect(callOf(0).body).toEqual({});
		expect(callOf(1).body).toEqual({ aclMode: 'private' });
	});

	it('passes the free plan refusing a private dataset through', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					statusCode: 400,
					error: 'Bad Request',
					message: 'ACL mode "private" not allowed for this project',
				},
				400,
			),
		);
		const error = await datasetsCreate(ctx, {
			name: 'x',
			aclMode: 'private',
		}).catch((e) => e);
		expect(error.message).toContain(
			'ACL mode "private" not allowed for this project',
		);
	});

	it('deletes only when the name is confirmed', async () => {
		await expect(
			datasetsDelete(ctx, { name: 'staging', confirmName: 'stagin' }),
		).rejects.toThrow(/confirmName must equal name/);
		expect(fetchMock).not.toHaveBeenCalled();
		fetchMock.mockResolvedValueOnce(jsonResponse({ deleted: true }));
		const response = await datasetsDelete(ctx, {
			name: 'staging',
			confirmName: 'staging',
		});
		expect(callOf(0).init.method).toBe('DELETE');
		expect(response.deleted).toBe(true);
	});
});

describe('schemas.list', () => {
	const deployed = [
		{
			_id: '_.schemas.default',
			_updatedAt: '2026-06-26T19:50:34Z',
			workspace: { name: 'default', title: 'Blog' },
			schema: JSON.stringify([
				{
					name: 'post',
					type: 'document',
					title: 'Post',
					fields: [
						{ name: 'title', type: 'string' },
						{ name: 'author', type: 'reference', to: [{ type: 'person' }] },
					],
				},
				{
					name: 'person',
					type: 'document',
					fields: [{ name: 'name', type: 'string' }],
				},
			]),
		},
	];

	it('summarizes each type and its fields', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(deployed));
		const response = await schemasList(ctx, {});
		expect(callOf(0).url).toBe(
			`${API}/projects/${PROJECT_ID}/datasets/${DATASET}/schemas`,
		);
		expect(response.schemas).toEqual([
			{
				schemaId: '_.schemas.default',
				workspace: 'default',
				title: 'Blog',
				deployedAt: '2026-06-26T19:50:34Z',
				types: [
					{
						name: 'post',
						type: 'document',
						title: 'Post',
						fields: [
							{
								name: 'title',
								type: 'string',
								title: null,
								of: null,
								to: null,
							},
							{
								name: 'author',
								type: 'reference',
								title: null,
								of: null,
								to: [{ type: 'person' }],
							},
						],
					},
					{
						name: 'person',
						type: 'document',
						title: null,
						fields: [
							{ name: 'name', type: 'string', title: null, of: null, to: null },
						],
					},
				],
			},
		]);
	});

	it('adds the full definition of the type asked for', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(deployed));
		const response = await schemasList(ctx, { type: 'person' });
		expect(response.schemas[0]?.definition).toMatchObject({ name: 'person' });
	});

	it('copes with a schema string that is not JSON', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse([{ _id: '_.schemas.x', schema: '{' }]),
		);
		const response = await schemasList(ctx, {});
		expect(response.schemas[0]?.types).toEqual([]);
	});
});

describe('agentActions', () => {
	const schemaId = '_.schemas.default';

	it('generate POSTs to the vX route without Corsair-only fields', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ _id: 'drafts.p', _type: 'post', title: 'Generated' }),
		);
		const response = await agentGenerate(ctx, {
			schemaId,
			targetDocument: { operation: 'create', _type: 'post' },
			instruction: 'Write about $topic',
			instructionParams: { topic: 'GROQ' },
			target: { path: 'title' },
			dataset: 'staging',
		});
		const { url, body, init } = callOf(0);
		expect(url).toBe(
			`https://${PROJECT_ID}.api.sanity.io/vX/agent/action/generate/staging`,
		);
		expect(init.signal).toBeDefined();
		expect(body).toEqual({
			schemaId,
			targetDocument: { operation: 'create', _type: 'post' },
			instruction: 'Write about $topic',
			instructionParams: { topic: 'GROQ' },
			target: { path: 'title' },
		});
		expect(response.document).toMatchObject({
			_id: 'drafts.p',
			title: 'Generated',
		});
	});

	it('generate needs exactly one of documentId or targetDocument, and refuses async with noWrite', async () => {
		await expect(
			agentGenerate(ctx, { schemaId, instruction: 'x' }),
		).rejects.toThrow(/exactly one of documentId or targetDocument/);
		await expect(
			agentGenerate(ctx, {
				schemaId,
				instruction: 'x',
				documentId: 'a',
				async: true,
				noWrite: true,
			}),
		).rejects.toThrow(/async and noWrite/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('generate with async returns the id Sanity answers with', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ _id: 'drafts.a' }, 201));
		const response = await agentGenerate(ctx, {
			schemaId,
			documentId: 'a',
			instruction: 'x',
			async: true,
		});
		expect(response.document).toEqual({ _id: 'drafts.a' });
	});

	it('transform and translate post to their routes', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ _id: 'drafts.a', _type: 'post' }))
			.mockResolvedValueOnce(jsonResponse({ _id: 'drafts.b', _type: 'post' }));
		await agentTransform(ctx, {
			schemaId,
			documentId: 'a',
			instruction: 'Shorter',
		});
		await agentTranslate(ctx, {
			schemaId,
			documentId: 'a',
			toLanguage: { id: 'de-DE' },
			protectedPhrases: ['Corsair'],
			targetDocument: { operation: 'create' },
		});
		expect(callOf(0).url).toContain('/vX/agent/action/transform/production');
		expect(callOf(1).url).toContain('/vX/agent/action/translate/production');
		expect(callOf(1).body).toMatchObject({
			toLanguage: { id: 'de-DE' },
			protectedPhrases: ['Corsair'],
		});
	});

	it('prompt returns text as text, even when it looks like JSON', async () => {
		fetchMock.mockResolvedValueOnce(textResponse('42'));
		const response = await agentPrompt(ctx, { instruction: 'Pick a number' });
		expect(callOf(0).body).toEqual({
			instruction: 'Pick a number',
			format: 'string',
		});
		expect(response).toEqual({ text: '42' });
	});

	it('prompt parses json, and needs the word json in the instruction', async () => {
		fetchMock.mockResolvedValueOnce(textResponse('{"words":["a"]}'));
		const response = await agentPrompt(ctx, {
			instruction: 'Answer in JSON',
			format: 'json',
		});
		expect(response.json).toEqual({ words: ['a'] });
		await expect(
			agentPrompt(ctx, { instruction: 'Answer', format: 'json' }),
		).rejects.toThrow(/word json/);
	});

	it('passes the AI budget 429 through with its message', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					error: 'Plan or Budget Limit reached.',
					statusCode: 429,
					message:
						'Please change the plan or Agent Actions budget in sanity.io/manage.',
				},
				429,
			),
		);
		const error = await agentTransform(ctx, {
			schemaId,
			documentId: 'a',
			instruction: 'x',
		}).catch((e) => e);
		expect(error.status).toBe(429);
		expect(error.message).toContain('Agent Actions budget');
	});
});

describe('webhooks', () => {
	const hook = {
		id: 'h1',
		name: 'Blog',
		type: 'document',
		url: 'https://example.com/hook',
		dataset: 'production',
		rule: { on: ['create'], filter: "_type == 'post'", projection: '{_id}' },
		secret: 'a-real-secret',
	};

	it('never returns the secret Sanity sends back', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse([hook, { ...hook, id: 'h2', secret: null }]),
		);
		const response = await webhooksList(ctx, {});
		expect(callOf(0).url).toBe(`${API}/hooks/projects/${PROJECT_ID}`);
		expect(JSON.stringify(response)).not.toContain('a-real-secret');
		expect(response.webhooks.map((h) => h.hasSecret)).toEqual([true, false]);
		expect(withoutSecret(null)).toBeNull();
	});

	it('creates a document webhook on the connection dataset', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(hook, 201));
		const response = await webhooksCreate(ctx, {
			name: 'Blog',
			url: 'https://example.com/hook',
			on: ['create'],
			filter: "_type == 'post'",
			projection: '{_id}',
			secret: 'a-real-secret-0123',
		});
		expect(callOf(0).body).toEqual({
			type: 'document',
			name: 'Blog',
			url: 'https://example.com/hook',
			dataset: DATASET,
			apiVersion: 'v2025-02-19',
			httpMethod: 'POST',
			rule: { on: ['create'], filter: "_type == 'post'", projection: '{_id}' },
			includeDrafts: false,
			secret: 'a-real-secret-0123',
		});
		expect(response.webhook).not.toHaveProperty('secret');
	});

	it("takes '*' for every dataset and refuses a URL with credentials", async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(hook, 201));
		await webhooksCreate(ctx, {
			name: 'All',
			url: 'https://example.com',
			on: ['delete'],
			dataset: '*',
		});
		expect(callOf(0).body.dataset).toBe('*');
		await expect(
			webhooksCreate(ctx, {
				name: 'x',
				url: 'https://u:p@example.com',
				on: ['create'],
			}),
		).rejects.toThrow(/without credentials/);
	});

	it('keeps the parts of the rule an update leaves out', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(hook)).mockResolvedValueOnce(
			jsonResponse({
				...hook,
				rule: { ...hook.rule, filter: "_type == 'page'" },
			}),
		);
		await webhooksUpdate(ctx, {
			id: 'h1',
			filter: "_type == 'page'",
			disabled: true,
		});
		const patch = callOf(1);
		expect(patch.init.method).toBe('PATCH');
		expect(patch.body).toEqual({
			rule: { on: ['create'], filter: "_type == 'page'", projection: '{_id}' },
			isDisabledByUser: true,
		});
	});

	it('updates without reading the rule when it is not touched', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(hook));
		await webhooksUpdate(ctx, { id: 'h1', name: 'Renamed' });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(callOf(0).body).toEqual({ name: 'Renamed' });
		await expect(webhooksUpdate(ctx, { id: 'h1' })).rejects.toThrow(
			/at least one field/,
		);
	});

	it('deletes, reading the count Sanity answers as a boolean', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'h1', deleted: 1 }));
		const response = await webhooksDelete(ctx, { id: 'h1' });
		expect(callOf(0).init.method).toBe('DELETE');
		expect(response).toEqual({ id: 'h1', deleted: true });
	});

	it('refuses a webhook id that would change the path', async () => {
		await expect(webhooksDelete(ctx, { id: '../../x' })).rejects.toThrow(
			/webhook id must be/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads delivery attempts with paging', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse([
				{ id: 'a1', isFailure: true, failureReason: 'http', resultCode: 500 },
			]),
		);
		const response = await webhooksAttempts(ctx, {
			id: 'h1',
			state: 'failure',
			offset: 25,
		});
		expect(callOf(0).url).toBe(
			`${API}/hooks/projects/${PROJECT_ID}/h1/attempts?state=failure&limit=25&offset=25`,
		);
		expect(response.attempts[0]).toMatchObject({ resultCode: 500 });
	});
});
