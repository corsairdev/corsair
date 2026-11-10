/**
 * Live tests against Sanity. They run when SANITY_API_KEY, SANITY_PROJECT_ID and
 * SANITY_TEST_DATASET are set (CI has none, so they skip), and write only to
 * SANITY_TEST_DATASET, which must not be `production`. Everything they create
 * is deleted, failed tests included. Free, except the Agent Actions tests,
 * which run only with SANITY_LIVE_AGENT=1 and spend four Sanity AI credits.
 * They read a document of another dataset (SANITY_AGENT_DATASET,
 * SANITY_AGENT_DOCUMENT_ID, SANITY_AGENT_SCHEMA_ID) with noWrite, so nothing is
 * written there.
 */
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { SanityAPIError } from './client';
import {
	generate as agentGenerate,
	prompt as agentPrompt,
	transform as agentTransform,
	translate as agentTranslate,
} from './endpoints/agent-actions';
import { upload as assetsUpload } from './endpoints/assets';
import { list as datasetsList } from './endpoints/datasets';
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
} from './endpoints/documents';
import { list as schemasList } from './endpoints/schemas';
import {
	attempts as webhooksAttempts,
	create as webhooksCreate,
	deleteWebhook as webhooksDelete,
	list as webhooksList,
	update as webhooksUpdate,
} from './endpoints/webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const ENV = z
	.object({
		SANITY_API_KEY: z.string().min(1),
		SANITY_PROJECT_ID: z.string().min(1),
		SANITY_TEST_DATASET: z
			.string()
			.min(1)
			.refine((name) => name !== 'production', 'Never run against production'),
	})
	.safeParse(process.env);
const describeLive = ENV.success ? describe : describe.skip;
const agentLive =
	ENV.success &&
	process.env.SANITY_LIVE_AGENT === '1' &&
	Boolean(process.env.SANITY_AGENT_DOCUMENT_ID);
const itAgent = agentLive ? it : it.skip;

const DATASET = ENV.data?.SANITY_TEST_DATASET ?? '';

// unknown: endpoints read ctx.key and ctx.options; the rest is the runtime's.
const ctx = {
	key: ENV.data?.SANITY_API_KEY ?? '',
	options: { projectId: ENV.data?.SANITY_PROJECT_ID, dataset: DATASET },
} as unknown as Parameters<typeof documentsQuery>[0];

const PIXEL_PNG =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==';

const created = new Set<string>();
const createdAssets = new Set<string>();
const createdHooks = new Set<string>();

afterAll(async () => {
	if (!ENV.success) return;
	if (created.size > 0) {
		await documentsDelete(ctx, { ids: [...created] }).catch(() => undefined);
	}
	for (const id of createdAssets) {
		await documentsMutate(ctx, { mutations: [{ delete: { id } }] }).catch(
			() => undefined,
		);
	}
	for (const id of createdHooks) {
		await webhooksDelete(ctx, { id }).catch(() => undefined);
	}
});

const newId = () => `corsair-live-${randomUUID().slice(0, 8)}`;

describeLive('Sanity live', () => {
	it('lists datasets, including the test dataset', async () => {
		const { datasets } = await datasetsList(ctx, {});
		expect(datasets.map((dataset) => dataset.name)).toContain(DATASET);
	});

	it('runs a parameterized GROQ query', async () => {
		const response = await documentsQuery(ctx, {
			query: 'count(*[_type == $type])',
			params: { type: 'sanity.imageAsset' },
		});
		expect(typeof response.result).toBe('number');
		expect(typeof response.ms).toBe('number');
	});

	it('reports a GROQ syntax error with its type', async () => {
		const error = await documentsQuery(ctx, { query: '*[' }).catch((e) => e);
		expect(error).toBeInstanceOf(SanityAPIError);
		expect(error.status).toBe(400);
		expect(error.errorType).toBe('queryParseError');
	});

	it('takes a document through draft, publish, edit, unpublish and delete', async () => {
		const id = newId();
		created.add(id);

		const draft = await documentsCreate(ctx, {
			document: { _id: id, _type: 'post', title: 'Live draft' },
		});
		expect(draft).toMatchObject({
			id,
			draftId: `drafts.${id}`,
			published: false,
		});
		expect(draft.transactionId).toEqual(expect.any(String));

		const before = await documentsGet(ctx, { ids: [id, `drafts.${id}`] });
		expect(before.documents.map((doc) => doc._id)).toEqual([`drafts.${id}`]);
		expect(before.omitted).toEqual([{ id, reason: 'existence' }]);

		const published = await documentsQuery(ctx, {
			query: '*[_id == $id][0].title',
			params: { id },
		});
		expect(published.result).toBeNull();
		const drafts = await documentsQuery(ctx, {
			query: '*[_id == $id][0].title',
			params: { id },
			perspective: 'drafts',
		});
		expect(drafts.result).toBe('Live draft');

		await documentsEdit(ctx, {
			id,
			set: { title: 'Edited draft' },
			setIfMissing: { tags: [] },
			insert: { after: 'tags[-1]', items: ['live'] },
		});
		const current = await documentsGet(ctx, { ids: [`drafts.${id}`] });
		const rev = current.documents[0]?._rev ?? '';
		expect(current.documents[0]).toMatchObject({
			title: 'Edited draft',
			tags: ['live'],
		});

		const stale = await documentsPatch(ctx, {
			id: `drafts.${id}`,
			set: { title: 'nope' },
			ifRevisionId: 'not-the-revision',
		}).catch((e) => e);
		expect(stale).toBeInstanceOf(SanityAPIError);
		expect(stale.status).toBe(409);

		const patched = await documentsPatch(ctx, {
			id: `drafts.${id}`,
			set: { views: 1 },
			ifRevisionId: rev,
		});
		expect(patched.document).toMatchObject({ _id: `drafts.${id}`, views: 1 });

		await documentsPublish(ctx, {
			id,
			ifDraftRevisionId: patched.document?._rev ?? '',
		});
		const live = await documentsGet(ctx, { ids: [id, `drafts.${id}`] });
		expect(live.documents.map((doc) => doc._id)).toEqual([id]);

		await documentsEdit(ctx, {
			id,
			set: { title: 'Published edit' },
			publish: true,
		});
		const republished = await documentsGet(ctx, { ids: [id, `drafts.${id}`] });
		expect(republished.documents).toEqual([
			expect.objectContaining({ _id: id, title: 'Published edit' }),
		]);

		await documentsEdit(ctx, { id, set: { title: 'Throwaway' } });
		await documentsDiscardDraft(ctx, { id });
		const discarded = await documentsGet(ctx, { ids: [`drafts.${id}`] });
		expect(discarded.documents).toEqual([]);

		await documentsUnpublish(ctx, { id });
		const unpublished = await documentsGet(ctx, { ids: [id, `drafts.${id}`] });
		expect(unpublished.documents.map((doc) => doc._id)).toEqual([
			`drafts.${id}`,
		]);

		const history = await documentsTransactions(ctx, {
			ids: [id, `drafts.${id}`],
			limit: 50,
		});
		// Sanity merges quick successive edits by one author, so no exact count.
		expect(history.transactions.length).toBeGreaterThan(0);
		expect(history.transactions[0]).toMatchObject({
			id: expect.any(String),
			timestamp: expect.any(String),
		});

		const deleted = await documentsDelete(ctx, { ids: [id] });
		expect(deleted.ids).toEqual([id]);
		const gone = await documentsGet(ctx, { ids: [id, `drafts.${id}`] });
		expect(gone.documents).toEqual([]);

		const last = await documentsHistory(ctx, {
			id: `drafts.${id}`,
			lastRevision: true,
		});
		expect(last.document).toMatchObject({ title: 'Published edit' });
	});

	it('creates and publishes in one call, then reads a past revision', async () => {
		const id = newId();
		created.add(id);
		const response = await documentsCreate(ctx, {
			document: { _id: id, _type: 'post', title: 'Born published' },
			publish: true,
		});
		expect(response.published).toBe(true);
		const firstRev = (await documentsGet(ctx, { ids: [id] })).documents[0]
			?._rev;
		await documentsEdit(ctx, { id, set: { title: 'Second' }, publish: true });
		const past = await documentsHistory(ctx, { id, revision: firstRev ?? '' });
		expect(past.document).toMatchObject({ _id: id, title: 'Born published' });
	});

	it('refuses to publish when there is no draft', async () => {
		const error = await documentsPublish(ctx, { id: newId() }).catch((e) => e);
		expect(error).toBeInstanceOf(SanityAPIError);
		expect(error.status).toBe(404);
		expect(error.errorType).toBe('documentNotFoundError');
	});

	it('dry-runs a create without writing', async () => {
		const id = newId();
		const response = await documentsCreate(ctx, {
			document: { _id: id, _type: 'post', title: 'Dry' },
			dryRun: true,
		});
		expect(response.id).toBe(id);
		const after = await documentsGet(ctx, { ids: [`drafts.${id}`] });
		expect(after.documents).toEqual([]);
	});

	it('applies raw mutations in one transaction and refuses a reused transactionId', async () => {
		const id = newId();
		created.add(id);
		const transactionId = `corsair-live-${randomUUID()}`;
		const response = await documentsMutate(ctx, {
			transactionId,
			returnDocuments: true,
			mutations: [
				{ createOrReplace: { _id: id, _type: 'counter', n: 1 } },
				{ patch: { id, inc: { n: 2 } } },
			],
		});
		expect(response.transactionId).toBe(transactionId);
		expect(response.results.at(-1)?.document).toMatchObject({ n: 3 });

		const replay = await documentsMutate(ctx, {
			transactionId,
			mutations: [{ patch: { id, inc: { n: 2 } } }],
		}).catch((e) => e);
		expect(replay).toBeInstanceOf(SanityAPIError);
		expect(replay.status).toBe(409);
		const after = await documentsGet(ctx, { ids: [id] });
		expect(after.documents[0]).toMatchObject({ n: 3 });
	});

	it('uploads an image and a file as assets', async () => {
		const image = await assetsUpload(ctx, {
			kind: 'image',
			contentBase64: PIXEL_PNG,
			contentType: 'image/png',
			filename: 'pixel.png',
			title: 'Live pixel',
			imageMetadata: ['lqip'],
		});
		createdAssets.add(image.asset._id);
		expect(image.asset).toMatchObject({
			_type: 'sanity.imageAsset',
			mimeType: 'image/png',
			originalFilename: 'pixel.png',
			url: expect.stringMatching(/^https:\/\/cdn\.sanity\.io\/images\//),
		});

		const file = await assetsUpload(ctx, {
			kind: 'file',
			contentBase64: Buffer.from('hello sanity').toString('base64'),
			contentType: 'text/plain',
			filename: 'hello.txt',
		});
		createdAssets.add(file.asset._id);
		expect(file.asset).toMatchObject({
			_type: 'sanity.fileAsset',
			size: 12,
			url: expect.stringMatching(/^https:\/\/cdn\.sanity\.io\/files\//),
		});
	});

	it('lists schemas without failing on a dataset with none', async () => {
		const response = await schemasList(ctx, {});
		expect(Array.isArray(response.schemas)).toBe(true);
	});

	it('creates, lists, pauses, reads attempts of and deletes a webhook, never returning its secret', async () => {
		const { webhook } = await webhooksCreate(ctx, {
			name: `corsair-live-${randomUUID().slice(0, 8)}`,
			url: 'https://example.com/corsair-live-webhook',
			on: ['create', 'update'],
			filter: "_type == 'post'",
			projection: '{ _id, title }',
			secret: randomUUID(),
		});
		createdHooks.add(webhook.id);
		expect(webhook).toMatchObject({ dataset: DATASET, hasSecret: true });
		expect(webhook).not.toHaveProperty('secret');

		const { webhooks } = await webhooksList(ctx, {});
		const listed = webhooks.find((hook) => hook.id === webhook.id);
		expect(listed).toMatchObject({ hasSecret: true });
		expect(listed).not.toHaveProperty('secret');

		const paused = await webhooksUpdate(ctx, {
			id: webhook.id,
			disabled: true,
			filter: "_type == 'page'",
		});
		expect(paused.webhook).toMatchObject({ isDisabledByUser: true });
		expect(paused.webhook.rule).toMatchObject({
			on: ['create', 'update'],
			filter: "_type == 'page'",
			projection: '{ _id, title }',
		});

		const { attempts } = await webhooksAttempts(ctx, { id: webhook.id });
		expect(Array.isArray(attempts)).toBe(true);

		const removed = await webhooksDelete(ctx, { id: webhook.id });
		createdHooks.delete(webhook.id);
		expect(removed).toMatchObject({ id: webhook.id, deleted: true });
	});

	describe('Agent Actions (noWrite, spends Sanity AI credits)', () => {
		const agentCtx = {
			...ctx,
			options: {
				...(ctx as { options: object }).options,
				dataset: process.env.SANITY_AGENT_DATASET,
			},
		} as typeof ctx;
		const documentId = process.env.SANITY_AGENT_DOCUMENT_ID ?? '';
		const schemaId = process.env.SANITY_AGENT_SCHEMA_ID ?? '';

		itAgent(
			'generates a field without writing',
			async () => {
				const response = await agentGenerate(agentCtx, {
					schemaId,
					documentId,
					noWrite: true,
					instruction: 'Write a title for this post of at most eight words.',
					target: { path: 'title' },
				});
				expect(response.document).toMatchObject({ _id: expect.any(String) });
				expect(typeof (response.document as { title?: unknown }).title).toBe(
					'string',
				);
			},
			120_000,
		);

		itAgent(
			'transforms a field without writing',
			async () => {
				const response = await agentTransform(agentCtx, {
					schemaId,
					documentId,
					noWrite: true,
					instruction: 'Rewrite in a more formal tone.',
					target: { path: 'title' },
				});
				expect(typeof (response.document as { title?: unknown }).title).toBe(
					'string',
				);
			},
			120_000,
		);

		itAgent(
			'translates a field without writing',
			async () => {
				const response = await agentTranslate(agentCtx, {
					schemaId,
					documentId,
					noWrite: true,
					toLanguage: { id: 'de-DE', title: 'German' },
					target: { path: 'title' },
				});
				expect(typeof (response.document as { title?: unknown }).title).toBe(
					'string',
				);
			},
			120_000,
		);

		itAgent(
			'answers a prompt as JSON',
			async () => {
				const response = await agentPrompt(agentCtx, {
					instruction:
						'Return json: an object with key "words" holding three words about $topic.',
					instructionParams: { topic: 'content management' },
					format: 'json',
				});
				expect(response.json).toEqual(
					expect.objectContaining({ words: expect.any(Array) }),
				);
			},
			120_000,
		);
	});
});
