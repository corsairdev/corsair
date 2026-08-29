import { POSTMAN_CREATE_A_COLLECTION } from './collections';

describe('POSTMAN_CREATE_A_COLLECTION', () => {
	it('validates collection input', () => {
		const result = POSTMAN_CREATE_A_COLLECTION.inputSchema.safeParse({
			name: 'Test Collection',
			description: 'Test description',
		});

		expect(result.success).toBe(true);
	});

	it('creates a collection with the correct request body', async () => {
		const post = jest.fn().mockResolvedValue({
			collection: {
				id: 'test-id',
				name: 'Test Collection',
				uid: 'test-uid',
			},
		});

		const client = { post } as never;

		await POSTMAN_CREATE_A_COLLECTION.execute(client, {
			name: 'Test Collection',
			description: 'Test description',
		});

		expect(post).toHaveBeenCalledWith('/collections', {
			workspace: undefined,
			collection: {
				info: {
					name: 'Test Collection',
					description: 'Test description',
					schema:
						'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
				},
				item: [],
			},
		});
	});
});
