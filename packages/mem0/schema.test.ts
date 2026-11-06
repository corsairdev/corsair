import {
	Mem0EndpointInputSchemas,
	Mem0EndpointOutputSchemas,
} from './endpoints/types';
import { Mem0Schema } from './schema';

describe('Mem0 schema', () => {
	it('declares a semver version', () => {
		expect(Mem0Schema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, so no local tables are created', () => {
		expect(Mem0Schema.entities).toEqual({});
	});

	it('has an input and an output schema for every operation', () => {
		expect(Object.keys(Mem0EndpointInputSchemas).sort()).toEqual([
			'eventsGet',
			'eventsList',
			'memoriesAdd',
			'memoriesBatchDelete',
			'memoriesBatchUpdate',
			'memoriesDelete',
			'memoriesDeleteAll',
			'memoriesGet',
			'memoriesHistory',
			'memoriesList',
			'memoriesSearch',
			'memoriesUpdate',
			'webhooksCreate',
			'webhooksDelete',
			'webhooksList',
			'webhooksUpdate',
		]);
		expect(Object.keys(Mem0EndpointOutputSchemas).sort()).toEqual(
			Object.keys(Mem0EndpointInputSchemas).sort(),
		);
	});

	it('accepts the documented search example', () => {
		const parsed = Mem0EndpointInputSchemas.memoriesSearch.parse({
			query: 'where does the user live?',
			filters: { user_id: 'alice' },
			top_k: 10,
		});

		expect(parsed.filters).toEqual({ user_id: 'alice' });
	});

	it('parses the documented search response', () => {
		const parsed = Mem0EndpointOutputSchemas.memoriesSearch.parse({
			results: [
				{
					id: 'ea925981-272f-40dd-b576-be64e4871429',
					memory: 'Likes to play cricket and plays cricket on weekends.',
					user_id: 'alice',
					metadata: { category: 'hobbies' },
					score: 0.82,
					expiration_date: null,
					created_at: '2024-07-26T10:29:36.630547-07:00',
					updated_at: null,
					categories: ['hobbies'],
				},
			],
		});

		expect(parsed.results[0]?.score).toBe(0.82);
		expect(parsed.results[0]?.updated_at).toBeNull();
	});

	it('keeps fields Mem0 adds that the schema does not name', () => {
		const parsed = Mem0EndpointOutputSchemas.memoriesGet.parse({
			id: 'ea925981',
			memory: 'A fact',
			created_at: '2026-01-15T10:30:00Z',
			some_new_field: 'kept',
		});

		expect(parsed).toMatchObject({ some_new_field: 'kept' });
	});

	it('rejects an add with no entity ID', () => {
		const result = Mem0EndpointInputSchemas.memoriesAdd.safeParse({
			messages: [{ role: 'user', content: 'hello' }],
		});

		expect(result.success).toBe(false);
	});
});
