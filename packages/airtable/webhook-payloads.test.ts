import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { makeAirtableRequest } from './client';
import { airtable } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeAirtableRequest: jest.fn(),
}));

const request = jest.mocked(makeAirtableRequest);

const testDb = createTestDatabase();
const corsair = createCorsair({
	plugins: [airtable({ key: 'pat-test' })],
	database: testDb.db,
	kek: 'test-kek',
});

// Shape from https://airtable.com/developers/web/api/list-webhook-payloads
const listResponse = {
	cursor: 5,
	mightHaveMore: true,
	payloads: [
		{
			timestamp: '2022-02-01T21:25:05.663Z',
			baseTransactionNumber: 4,
			payloadFormat: 'v0',
			actionMetadata: { source: 'client' },
		},
	],
};

describe('webhooks.getPayloads', () => {
	beforeAll(() =>
		createIntegrationAndAccount(testDb.db, 'airtable', 'default'),
	);
	afterAll(() => testDb.cleanup());
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(listResponse);
	});

	it('returns cursor and mightHaveMore so callers can page', async () => {
		const result = await corsair.airtable.api.webhooks.getPayloads({
			baseId: 'appBase',
			webhookId: 'achHook',
		});

		expect(result.cursor).toBe(5);
		expect(result.mightHaveMore).toBe(true);
		expect(result.payloads).toHaveLength(1);
		expect(result.payloads[0]).toMatchObject({ payloadFormat: 'v0' });
	});

	it('forwards cursor and limit as query parameters', async () => {
		await corsair.airtable.api.webhooks.getPayloads({
			baseId: 'appBase',
			webhookId: 'achHook',
			cursor: 5,
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(
			'bases/appBase/webhooks/achHook/payloads',
			expect.anything(),
			{ method: 'GET', query: { cursor: 5, limit: 50 } },
		);
	});

	it('leaves cursor out on the first call so Airtable uses its default', async () => {
		await corsair.airtable.api.webhooks.getPayloads({
			baseId: 'appBase',
			webhookId: 'achHook',
		});

		expect(request).toHaveBeenCalledWith(
			'bases/appBase/webhooks/achHook/payloads',
			expect.anything(),
			{ method: 'GET', query: { cursor: undefined, limit: undefined } },
		);
	});
});
