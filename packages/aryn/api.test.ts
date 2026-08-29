import 'dotenv/config';
import { makeArynBinaryRequest, makeArynRequest } from './client';
import type {
	ArynEndpointInputs,
	ArynEndpointOutputs,
} from './endpoints/types';
import {
	ArynEndpointInputSchemas,
	ArynEndpointOutputSchemas,
	ASYNC_LIST_PATH_FILTER,
} from './endpoints/types';

const TEST_API_KEY = process.env.ARYN_API_KEY;

const liveApi = TEST_API_KEY ? describe : describe.skip;

liveApi('Aryn API Type Tests', () => {
	const apiKey = TEST_API_KEY ?? '';

	describe('docsets', () => {
		let createdDocsetId: string;

		it('docsetCreate returns a valid ArynDocSet', async () => {
			const input = ArynEndpointInputSchemas.docsetCreate.parse({
				name: `corsair-test-${Date.now()}`,
			});
			const response = await makeArynRequest<
				ArynEndpointOutputs['docsetCreate']
			>('/v1/storage/docsets', apiKey, {
				method: 'POST',
				body: {
					name: input.name,
					schema: input.schema,
					properties: input.properties,
					prompts: input.prompts,
				},
			});
			const result = ArynEndpointOutputSchemas.docsetCreate.parse(response);

			expect(result.docset_id).toBeTruthy();
			expect(result.name).toBe(input.name);
			createdDocsetId = result.docset_id;
		});

		it('docsetGet returns valid metadata for the created DocSet', async () => {
			expect(createdDocsetId).toBeTruthy();

			const input = ArynEndpointInputSchemas.docsetGet.parse({
				docset_id: createdDocsetId,
			});
			const response = await makeArynRequest<ArynEndpointOutputs['docsetGet']>(
				`/v1/storage/docsets/${input.docset_id}`,
				apiKey,
				{ method: 'GET' },
			);
			const result = ArynEndpointOutputSchemas.docsetGet.parse(response);

			expect(result.docset_id).toBe(createdDocsetId);
		});

		it('docsetDelete removes the created DocSet', async () => {
			expect(createdDocsetId).toBeTruthy();

			const input = ArynEndpointInputSchemas.docsetDelete.parse({
				docset_id: createdDocsetId,
			});
			const response = await makeArynRequest<
				ArynEndpointOutputs['docsetDelete']
			>(`/v1/storage/docsets/${input.docset_id}`, apiKey, { method: 'DELETE' });
			const result = ArynEndpointOutputSchemas.docsetDelete.parse(response);

			expect(result).toBeDefined();
		});
	});

	describe('queries', () => {
		it('queryGeneratePlan returns plan fields', async () => {
			const input = ArynEndpointInputSchemas.queryGeneratePlan.parse({
				query: 'revenue breakdown by region',
			});
			const response = await makeArynRequest<
				ArynEndpointOutputs['queryGeneratePlan']
			>('/v1/query/plan', apiKey, {
				method: 'POST',
				body: {
					query: input.query,
					docset_id: input.docset_id,
					summarize_result: input.summarize_result,
					stream: input.stream,
				},
			});
			const result =
				ArynEndpointOutputSchemas.queryGeneratePlan.parse(response);

			expect(result).toBeDefined();
		});
	});

	describe('asyncTasks', () => {
		it('asyncTasksList returns a tasks map', async () => {
			ArynEndpointInputSchemas.asyncTasksList.parse({});
			const response = await makeArynRequest<
				ArynEndpointOutputs['asyncTasksList']
			>('/v1/async/list', apiKey, {
				method: 'GET',
				query: { path_filter: ASYNC_LIST_PATH_FILTER },
			});
			const result = ArynEndpointOutputSchemas.asyncTasksList.parse(response);

			expect(result.tasks).toBeDefined();
		});
	});

	describe('documents', () => {
		it('documentPartition with a public file_url returns parsed elements', async () => {
			const input = ArynEndpointInputSchemas.documentPartition.parse({
				file_url:
					'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
				options: { threshold: 'auto' },
			});
			const response = await makeArynRequest<
				ArynEndpointOutputs['documentPartition']
			>('/v1/document/partition', apiKey, {
				method: 'POST',
				baseUrl: 'https://api.aryn.cloud',
				formData: {
					file_url: input.file_url,
					options: input.options ? JSON.stringify(input.options) : undefined,
				},
			});
			const result =
				ArynEndpointOutputSchemas.documentPartition.parse(response);

			expect(Array.isArray(result.status)).toBe(true);
			expect(result.elements?.length ?? 0).toBeGreaterThan(0);
			expect(typeof result.elements?.[0]?.type).toBe('string');
		}, 120_000);

		it('async add-doc lifecycle: submit, poll, get doc and binary', async () => {
			const docsetName = `corsair-test-async-${Date.now()}`;
			const created = await makeArynRequest<
				ArynEndpointOutputs['docsetCreate']
			>('/v1/storage/docsets', apiKey, {
				method: 'POST',
				body: { name: docsetName },
			});
			const docset = ArynEndpointOutputSchemas.docsetCreate.parse(created);

			try {
				const submitted = await makeArynRequest<
					ArynEndpointOutputs['documentSubmitAsyncAdd']
				>(`/v1/async/submit/storage/docsets/${docset.docset_id}/docs`, apiKey, {
					method: 'POST',
					formData: {
						file_url:
							'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
					},
				});
				const submit =
					ArynEndpointOutputSchemas.documentSubmitAsyncAdd.parse(submitted);
				expect(submit.task_id).toBeTruthy();

				// Poll asyncTasksList until the task reaches a terminal state.
				let taskStatus: string | undefined;
				for (let attempt = 0; attempt < 30; attempt++) {
					await new Promise((resolve) => setTimeout(resolve, 4000));
					const listed = ArynEndpointOutputSchemas.asyncTasksList.parse(
						await makeArynRequest<ArynEndpointOutputs['asyncTasksList']>(
							'/v1/async/list',
							apiKey,
							{ method: 'GET', query: { path_filter: ASYNC_LIST_PATH_FILTER } },
						),
					);
					taskStatus = listed.tasks[submit.task_id]?.task_status;
					if (taskStatus === 'done' || taskStatus === 'abort') break;
				}
				expect(taskStatus).toBe('done');

				const docsListed = await makeArynRequest<{
					docs?: Array<{ doc_id?: string; id?: string }>;
				}>(`/v1/storage/docsets/${docset.docset_id}/docs`, apiKey, {
					method: 'GET',
				});
				const docId = docsListed.docs?.[0]?.doc_id ?? docsListed.docs?.[0]?.id;
				expect(docId).toBeTruthy();

				const doc = await makeArynRequest<ArynEndpointOutputs['documentGet']>(
					`/v1/storage/docsets/${docset.docset_id}/docs/${docId}`,
					apiKey,
					{ method: 'GET', query: { include_elements: false } },
				);
				const validatedDoc = ArynEndpointOutputSchemas.documentGet.parse(doc);
				expect(validatedDoc.id).toBeTruthy();

				const binary = await makeArynBinaryRequest(
					`/v1/storage/docsets/${docset.docset_id}/docs/${docId}/binary`,
					apiKey,
				);
				expect(binary.byteLength).toBeGreaterThan(0);
			} finally {
				await makeArynRequest<ArynEndpointOutputs['docsetDelete']>(
					`/v1/storage/docsets/${docset.docset_id}`,
					apiKey,
					{ method: 'DELETE' },
				);
			}
		}, 300_000);
	});
});

describe('Aryn binary request typing', () => {
	it('makeArynBinaryRequest is typed as ArrayBuffer (compile-time check)', () => {
		const fn: (endpoint: string, apiKey: string) => Promise<ArrayBuffer> =
			makeArynBinaryRequest;
		expect(typeof fn).toBe('function');
	});
});
