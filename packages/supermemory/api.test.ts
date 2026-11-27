import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { supermemory } from './index';

/**
 * Live run against a free Supermemory organization. Skipped unless
 * SUPERMEMORY_API_KEY is set (CI never runs files named api.test.ts).
 *
 *   SUPERMEMORY_API_KEY=... npx jest api.test.ts
 *   (SUPERMEMORY_LIVE_REPORT=<file> also writes one line per operation)
 *
 * Everything happens in two throwaway namespaces and two legacy container
 * tags named corsair_live_<timestamp>; they are deleted at the end, even when
 * a step fails. Organization settings that a step changes are put back.
 *
 * Never run here: feedback.send (it reaches Supermemory's team) and
 * legacy.settings.reset (it deletes everything in the organization).
 */
const key = process.env.SUPERMEMORY_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) {
	console.warn('Skipping Supermemory live run: set SUPERMEMORY_API_KEY.');
}

const RUN = `corsair_live_${Date.now()}`;
const NS = RUN;
const NS_MOVED = `${RUN}_moved`;
const NS_TARGET = `${RUN}_target`;
const TAG = `${RUN}_legacy`;
const TAG_MERGED = `${RUN}_legacy_merged`;
const TAG_INTO = `${RUN}_legacy_into`;
const NOTE_FILE = {
	base64: Buffer.from(
		'Ada Lovelace keeps a reading list of mathematics papers and prefers PDFs.',
	).toString('base64'),
	filename: 'ada-reading.txt',
	contentType: 'text/plain',
};

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'supermemory', 'default');
	const corsair = createCorsair({
		plugins: [supermemory({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describeIfKey('supermemory live', () => {
	jest.setTimeout(300_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const report: Array<{ op: string; ok: boolean; note: string }> = [];
	const ids: Record<string, string> = {};
	let originalContext: unknown = null;
	let originalChunkSize: unknown;

	// `unknown` because the walk goes through the generated API object by name.
	const call = async (op: string, args: Json = {}): Promise<Json> => {
		let fn: unknown = (client as NonNullable<typeof client>).corsair.supermemory
			.api;
		for (const part of op.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		return (await (fn as (input: Json) => Promise<unknown>)(args)) as Json;
	};
	/** Runs one operation, records the result, and rethrows a failure. */
	const step = async (
		op: string,
		args: Json,
		note: (out: Json) => string = () => 'ok',
	): Promise<Json> => {
		try {
			const out = await call(op, args);
			report.push({ op, ok: true, note: note(out) });
			return out;
		} catch (error) {
			report.push({ op, ok: false, note: (error as Error).message });
			throw error;
		}
	};
	/** An operation Supermemory may refuse for a reason outside the plugin (no OAuth yet). */
	const expectRefusal = async (op: string, args: Json, status: RegExp) => {
		try {
			const out = await call(op, args);
			report.push({ op, ok: true, note: 'ok' });
			return out;
		} catch (error) {
			const message = (error as Error).message;
			report.push({ op, ok: status.test(message), note: message });
			expect(message).toMatch(status);
			return undefined;
		}
	};

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		if (client) {
			for (const [op, args] of [
				['namespaces.delete', { namespace: NS }],
				['namespaces.delete', { namespace: NS_MOVED }],
				['namespaces.delete', { namespace: NS_TARGET }],
				['legacy.containerTags.delete', { containerTag: TAG }],
				['legacy.containerTags.delete', { containerTag: TAG_MERGED }],
				['legacy.containerTags.delete', { containerTag: TAG_INTO }],
			] as const) {
				await call(op, args).catch(() => undefined);
			}
			await client.testDb.cleanup?.();
		}
		const file = process.env.SUPERMEMORY_LIVE_REPORT;
		if (file) writeFileSync(file, JSON.stringify(report, null, 1));
	});

	describe('reads', () => {
		it('organization.get', async () => {
			const out = await step(
				'organization.get',
				{},
				(o) => `namespaceCount ${String(o.namespaceCount)}`,
			);
			originalContext = out.organizationalContext ?? null;
		});
		it.each([
			'namespaces.list',
			'connectors.listAll',
			'legacy.settings.get',
			'legacy.containerTags.list',
			'legacy.connections.list',
			'legacy.documents.listProcessing',
		])('%s', async (op) => {
			const out = await step(op, {});
			if (op === 'legacy.settings.get') originalChunkSize = out.chunkSize;
		});
	});

	describe('v5 documents, search and profiles', () => {
		it('documents.add', async () => {
			const out = await step(
				'documents.add',
				{
					namespace: NS,
					id: 'ada_notes',
					content:
						'Ada Lovelace prefers morning meetings, works from London and is writing notes on the Analytical Engine.',
					metadata: { source: 'corsair-live', topic: 'work' },
				},
				(o) => `status ${String(o.status)}`,
			);
			expect(out.id).toBe('ada_notes');
		});
		it('documents.batchAdd', async () => {
			await step(
				'documents.batchAdd',
				{
					namespace: NS,
					documents: [
						{
							id: 'ada_tea',
							content: 'Ada drinks green tea in the afternoon.',
						},
						{ id: 'ada_travel', content: 'Ada travels to Paris every spring.' },
					],
				},
				(o) => `${JSON.stringify(o).length} bytes`,
			);
		});
		it('documents.uploadFile', async () => {
			const out = await step(
				'documents.uploadFile',
				{
					namespace: NS,
					file: NOTE_FILE,
					metadata: '{"source":"corsair-live"}',
				},
				(o) => `id ${String(o.id)}, status ${String(o.status)}`,
			);
			ids.file = String(out.id);
		});
		it('documents.get (until processed)', async () => {
			let status = '';
			for (let i = 0; i < 30; i++) {
				const out = await call('documents.get', {
					namespace: NS,
					id: 'ada_notes',
					include: ['chunks', 'memories'],
				});
				status = String((out.system as Json | undefined)?.status);
				if (status === 'done' || status === 'failed') break;
				await sleep(4000);
			}
			await step(
				'documents.get',
				{ namespace: NS, id: 'ada_notes', include: ['chunks', 'memories'] },
				(o) =>
					`status ${String((o.system as Json | undefined)?.status)}, ${(o.chunks as unknown[] | undefined)?.length ?? 0} chunks, ${(o.memories as unknown[] | undefined)?.length ?? 0} memories`,
			);
		});
		it('documents.update', async () => {
			await step('documents.update', {
				namespace: NS,
				id: 'ada_notes',
				content: 'Ada also mentors two students on Fridays.',
				metadata: { source: 'corsair-live', topic: 'mentoring' },
			});
		});
		it('documents.memoryCounts', async () => {
			await step(
				'documents.memoryCounts',
				{ namespace: NS, ids: ['ada_notes', 'ada_tea'] },
				(o) => JSON.stringify(o).slice(0, 120),
			);
		});
		it.each(['documents', 'chunks', 'memories'])(
			'resources.list %s',
			async (type) => {
				const out = await step(
					'resources.list',
					{ namespace: NS, type, limit: 20 },
					(o) =>
						`${type}: ${(o[type] as unknown[] | undefined)?.length ?? 0} items`,
				);
				const first = (out.memories as Json[] | undefined)?.[0];
				if (type === 'memories' && first) ids.memory = String(first.id);
			},
		);
		it('search.query', async () => {
			await step(
				'search.query',
				{ namespace: NS, query: 'When does Ada like to meet?', limit: 5 },
				(o) => `${(o.results as unknown[] | undefined)?.length ?? 0} results`,
			);
		});
		it('profiles.get', async () => {
			await step('profiles.get', { namespace: NS }, (o) =>
				JSON.stringify(o.profile ?? o).slice(0, 120),
			);
		});
		it('profiles.buckets.get / set / delete', async () => {
			await step('profiles.buckets.get', { namespace: NS });
			await step('profiles.buckets.set', {
				namespace: NS,
				buckets: { reading: 'Books and papers the user reads' },
			});
			await step('profiles.buckets.delete', {
				namespace: NS,
				buckets: ['reading'],
			});
		});
		it('graph.get', async () => {
			await step('graph.get', { namespace: NS }, (o) =>
				Object.keys(o).join(','),
			);
		});
		it('memories.get (when one has formed)', async () => {
			// Memory formation runs in the background; the legacy step reads one for sure.
			if (ids.memory) {
				await step('memories.get', { namespace: NS, id: ids.memory });
			}
		});
		it('memories.forgetMatching (dry run)', async () => {
			await step(
				'memories.forgetMatching',
				{ namespace: NS, query: 'green tea', dryRun: true },
				(o) => JSON.stringify(o).slice(0, 120),
			);
		});
		it('memories.forget', async () => {
			if (!ids.memory) {
				await expectRefusal(
					'memories.forget',
					{ namespace: NS, ids: ['mem_does_not_exist'] },
					/4\d\d|forgotten|notFound/i,
				);
				return;
			}
			await step('memories.forget', { namespace: NS, ids: [ids.memory] });
		});
		it('documents.updateFile and documents.replaceWithFile', async () => {
			await step('documents.updateFile', {
				namespace: NS,
				id: ids.file,
				metadata: '{"source":"corsair-live","edited":true}',
			});
			await step('documents.replaceWithFile', {
				namespace: NS,
				id: ids.file,
				file: { ...NOTE_FILE, filename: 'ada-reading-v2.txt' },
			});
		});
		it('documents.delete', async () => {
			await step('documents.delete', { namespace: NS, ids: ['ada_travel'] });
		});
	});

	describe('v5 namespaces, connectors and organization', () => {
		it('namespaces.get / update', async () => {
			await step(
				'namespaces.get',
				{ namespace: NS },
				(o) =>
					`documents ${String(o.documentCount ?? (o.namespace as Json | undefined)?.documentCount)}`,
			);
			await step('namespaces.update', {
				namespace: NS,
				supportingContext: 'Test namespace for the Corsair plugin live run.',
			});
		});
		it('namespaces.delete with moveTo', async () => {
			await step('documents.add', {
				namespace: NS_MOVED,
				id: 'moved_note',
				content: 'A note that moves into another namespace.',
				// No memory formation: a move waits for it, and it runs for minutes.
				taskType: 'superrag',
			});
			// Supermemory refuses a move (409) while ingestion is still running.
			for (let i = 0; i < 12; i++) {
				const out = await call('documents.get', {
					namespace: NS_MOVED,
					id: 'moved_note',
				});
				const system = (out.system as Json | undefined) ?? {};
				// Memory formation ("dreaming") also counts as work in flight.
				if (system.status === 'done' && system.dreamingStatus !== 'dreaming')
					break;
				await sleep(5000);
			}
			await step('documents.add', {
				namespace: NS_TARGET,
				id: 'target_note',
				content: 'The namespace the move lands in.',
				taskType: 'superrag',
			});
			for (let i = 0; i < 12; i++) {
				const out = await call('documents.get', {
					namespace: NS_TARGET,
					id: 'target_note',
				});
				const system = (out.system as Json | undefined) ?? {};
				if (system.status === 'done' && system.dreamingStatus !== 'dreaming')
					break;
				await sleep(5000);
			}
			await step(
				'namespaces.delete',
				{ namespace: NS_MOVED, moveTo: NS_TARGET },
				(o) => JSON.stringify(o).slice(0, 120),
			);
		});
		it('connectors (Pro plan only)', async () => {
			// The free plan answers 403 "This feature requires Pro plan or higher".
			await expectRefusal(
				'connectors.create',
				{
					namespace: NS,
					provider: 'notion',
					redirectUrl: 'https://example.com/connected',
				},
				/403/,
			);
			await step(
				'connectors.list',
				{ namespace: NS },
				(o) =>
					`${(o.connectors as unknown[] | undefined)?.length ?? 0} connectors`,
			);
			await expectRefusal(
				'connectors.get',
				{ namespace: NS, id: 'PTzGiUYei7pgzg5buzZHgA' },
				/40[34]/,
			);
		});
		it('organization.update (and back)', async () => {
			await step('organization.update', {
				organizationalContext:
					'Corsair test organization for plugin live runs.',
			});
			// Bucket suggestions need an organization context (400 without one).
			await step('legacy.settings.suggestBuckets', {}, (o) =>
				JSON.stringify(o).slice(0, 120),
			);
			await step('organization.update', {
				organizationalContext: originalContext,
			});
		});
	});

	describe('legacy v3/v4', () => {
		it('legacy documents', async () => {
			const added = await step(
				'legacy.documents.add',
				{
					content: 'Grace Hopper keeps a nanosecond wire on her desk.',
					containerTag: TAG,
					customId: `${RUN}_grace`,
					metadata: { source: 'corsair-live' },
				},
				(o) => `id ${String(o.id)}, status ${String(o.status)}`,
			);
			ids.legacyDoc = String(added.id);
			await step('legacy.documents.batchAdd', {
				documents: [
					{ content: 'Grace wrote the first compiler.', containerTag: TAG },
				],
			});
			const uploaded = await step('legacy.documents.uploadFile', {
				file: NOTE_FILE,
				containerTags: JSON.stringify([TAG]),
			});
			ids.legacyFile = String(uploaded.id);
			for (let i = 0; i < 20; i++) {
				const out = await call('legacy.documents.get', { id: ids.legacyDoc });
				if (out.status === 'done' || out.status === 'failed') break;
				await sleep(4000);
			}
			await step(
				'legacy.documents.get',
				{ id: ids.legacyDoc },
				(o) => `status ${String(o.status)}`,
			);
			await step('legacy.documents.update', {
				id: ids.legacyDoc,
				metadata: { source: 'corsair-live', edited: true },
			});
			await step('legacy.documents.list', { containerTags: [TAG], limit: 10 });
			await step('legacy.documents.chunks', { id: ids.legacyDoc });
			await expectRefusal(
				'legacy.documents.fileUrl',
				{ id: ids.legacyFile },
				/4\d\d/,
			);
			await step('legacy.documents.search', {
				q: 'compiler',
				containerTags: [TAG],
			});
		});
		it('legacy memories, profile and conversations', async () => {
			const created = await step(
				'legacy.memories.create',
				{
					containerTag: TAG,
					memories: [{ content: 'Grace prefers COBOL for business software.' }],
				},
				(o) => JSON.stringify(o).slice(0, 120),
			);
			const memory = (created.memories as Json[] | undefined)?.[0];
			if (memory?.id) {
				// v5 reads a v4 memory: a container tag is a namespace.
				await step('memories.get', { namespace: TAG, id: String(memory.id) });
			}
			await step('legacy.memories.list', { containerTags: [TAG] });
			if (memory?.id) {
				await step('legacy.memories.update', {
					containerTag: TAG,
					id: String(memory.id),
					newContent: 'Grace prefers COBOL and FORTRAN.',
				});
			}
			await step('legacy.memories.search', { q: 'COBOL', containerTag: TAG });
			await step('legacy.profile.get', { containerTag: TAG });
			await step('legacy.profile.buckets', { containerTag: TAG });
			await step('legacy.conversations.ingest', {
				conversationId: `${RUN}_conv`,
				containerTags: [TAG],
				messages: [
					{ role: 'user', content: 'Remind me that I like Earl Grey.' },
					{ role: 'assistant', content: 'Noted: you like Earl Grey.' },
				],
			});
			await step('legacy.memories.forgetMatching', {
				containerTag: TAG,
				query: 'COBOL',
				dryRun: true,
			});
			if (memory?.id) {
				await step('legacy.memories.forget', {
					containerTag: TAG,
					id: String(memory.id),
				});
			}
		});
		it('legacy settings and container tags', async () => {
			await step('legacy.settings.update', { chunkSize: originalChunkSize });
			await step('legacy.containerTags.get', { containerTag: TAG });
			await step('legacy.containerTags.update', {
				containerTag: TAG,
				entityContext: 'Legacy test tag for the Corsair live run.',
			});
			// Merges wait for memory formation, so both tags hold retrieval-only notes.
			for (const tag of [TAG_INTO, TAG_MERGED]) {
				await step('legacy.documents.add', {
					content: `A retrieval-only note under ${tag}.`,
					containerTag: tag,
					taskType: 'superrag',
				});
			}
			await sleep(20000);
			const merge = await step(
				'legacy.containerTags.merge',
				{ containerTags: [TAG_INTO, TAG_MERGED], targetContainerTag: TAG_INTO },
				(o) => JSON.stringify(o).slice(0, 120),
			);
			const mergeId = merge.mergeId ?? merge.id;
			if (mergeId) {
				await step('legacy.containerTags.mergeStatus', {
					mergeId: String(mergeId),
				});
			}
		});
		it('legacy connections (Pro plan only)', async () => {
			await expectRefusal(
				'legacy.connections.create',
				{
					provider: 'notion',
					containerTags: [TAG],
					redirectUrl: 'https://example.com/connected',
				},
				/403/,
			);
			await step('legacy.connections.documents', {
				provider: 'notion',
				containerTags: [TAG],
			});
			await expectRefusal(
				'legacy.connections.getByProvider',
				{ provider: 'notion', containerTags: [TAG] },
				/4\d\d/,
			);
			await expectRefusal(
				'legacy.connections.get',
				{ connectionId: 'PTzGiUYei7pgzg5buzZHgA' },
				/4\d\d/,
			);
		});
		it('legacy deletes', async () => {
			await step('legacy.documents.delete', { id: ids.legacyFile });
			await step('legacy.documents.bulkDelete', { containerTags: [TAG] });
			await step('legacy.containerTags.delete', { containerTag: TAG });
		});
	});

	describe('cleanup', () => {
		it('namespaces.delete', async () => {
			await step('namespaces.delete', { namespace: NS }, (o) =>
				JSON.stringify(o).slice(0, 120),
			);
		});
	});
});
