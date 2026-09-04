import {
	GriptapeEndpointInputSchemas,
	GriptapeEndpointOutputSchemas,
} from './endpoints/types';
import { GriptapeSchema } from './schema';

describe('Griptape schema', () => {
	it('declares a semver version', () => {
		expect(GriptapeSchema.version).toBeDefined();
		expect(GriptapeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GriptapeSchema.entities).toBe('object');
		expect(GriptapeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GriptapeSchema.entities))).toBe(true);
		for (const entity of Object.values(GriptapeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers an input and output schema for every endpoint', () => {
		const inputKeys = Object.keys(GriptapeEndpointInputSchemas);
		const outputKeys = Object.keys(GriptapeEndpointOutputSchemas);

		expect(inputKeys.length).toBeGreaterThan(100);
		expect(outputKeys).toEqual(inputKeys);
	});

	it('requires a query for knowledge base query and search', () => {
		expect(
			GriptapeEndpointInputSchemas.knowledgeBaseQuery.safeParse({
				knowledge_base_id: 'kb-1',
				query: 'What is the refund policy?',
			}).success,
		).toBe(true);
		expect(
			GriptapeEndpointInputSchemas.knowledgeBaseQuery.safeParse({
				knowledge_base_id: 'kb-1',
				query: '',
			}).success,
		).toBe(false);
		expect(
			GriptapeEndpointInputSchemas.knowledgeBaseSearch.safeParse({
				knowledge_base_id: 'kb-1',
			}).success,
		).toBe(false);
	});

	it('requires input and output for thread message creation', () => {
		expect(
			GriptapeEndpointInputSchemas.threadMessageCreate.safeParse({
				thread_id: 'thread-1',
				input: 'hello',
				output: 'hi there',
			}).success,
		).toBe(true);
		expect(
			GriptapeEndpointInputSchemas.threadMessageCreate.safeParse({
				thread_id: 'thread-1',
				input: 'hello',
			}).success,
		).toBe(false);
	});

	it('rejects empty resource ids', () => {
		expect(
			GriptapeEndpointInputSchemas.threadGet.safeParse({ thread_id: '' })
				.success,
		).toBe(false);
		expect(
			GriptapeEndpointInputSchemas.rulesetGetByAlias.safeParse({ alias: '' })
				.success,
		).toBe(false);
	});

	it('accepts arbitrary Cloud fields in mutation bodies', () => {
		const parsed = GriptapeEndpointInputSchemas.assistantCreate.safeParse({
			body: { name: 'Support Bot', description: 'l1 support' },
		});

		expect(parsed.success).toBe(true);
	});

	it('accepts empty delete results (204 no content)', () => {
		expect(
			GriptapeEndpointOutputSchemas.assistantDelete.safeParse(undefined)
				.success,
		).toBe(true);
	});

	it('validates list outputs as objects with optional pagination', () => {
		expect(
			GriptapeEndpointOutputSchemas.threadList.safeParse({
				threads: [],
				pagination: {
					page_number: 1,
					page_size: 20,
					total_count: 0,
					total_pages: 0,
				},
			}).success,
		).toBe(true);
		expect(
			GriptapeEndpointOutputSchemas.threadList.safeParse('not-an-object')
				.success,
		).toBe(false);
	});
});
