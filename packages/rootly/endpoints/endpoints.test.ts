import * as client from '../client';
import type { RootlyContext } from '../index';
import { ActionItems, Incidents } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeRootlyRequest: jest.fn(),
}));

const mockedRequest = jest.mocked(client.makeRootlyRequest);

// Test context built field-by-field against RootlyContext with no type
// assertion, so a context-shape change fails typecheck instead of silently
// passing. Endpoints under test only read ctx.key; the keys/db stubs exist
// solely to satisfy the context type.
function makeCtx(): RootlyContext {
	return {
		key: 'test-rootly-api-key',
		endpoints: {},
		db: {},
		$getAccountId: () => Promise.resolve('test-account-id'),
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-rootly-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
	};
}

const ctx = makeCtx();

describe('Rootly endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({});
	});

	describe('actionItems', () => {
		it('actionItems.list calls correct endpoint with query parameters', async () => {
			const mockResponse = {
				data: [
					{
						id: 'ai-1',
						type: 'action_items',
						attributes: { summary: 'Fix database index' },
					},
				],
				meta: { total_count: 1 },
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const result = await ActionItems.list(ctx, {
				incident_id: 'inc-123',
				include: 'user',
				page_number: 1,
				page_size: 25,
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'incidents/inc-123/action_items',
				ctx.key,
				{
					method: 'GET',
					query: {
						include: 'user',
						'page[number]': 1,
						'page[size]': 25,
					},
				},
			);
			expect(result).toEqual(mockResponse);
		});

		it('actionItems.get retrieves an action item by ID', async () => {
			const mockResponse = {
				data: {
					id: 'ai-1',
					type: 'action_items',
					attributes: { summary: 'Fix database index' },
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const result = await ActionItems.get(ctx, { id: 'ai-1' });

			expect(mockedRequest).toHaveBeenCalledWith('action_items/ai-1', ctx.key);
			expect(result).toEqual(mockResponse);
		});

		it('actionItems.delete deletes an action item by ID', async () => {
			const mockResponse = {
				data: {
					id: 'ai-1',
					type: 'action_items',
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const result = await ActionItems.delete(ctx, { id: 'ai-1' });

			expect(mockedRequest).toHaveBeenCalledWith('action_items/ai-1', ctx.key, {
				method: 'DELETE',
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe('incidents', () => {
		it('incidents.get retrieves an incident by ID', async () => {
			const mockResponse = {
				data: {
					id: 'inc-123',
					type: 'incidents',
					attributes: { title: 'Major outage in production' },
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const result = await Incidents.get(ctx, { id: 'inc-123' });

			expect(mockedRequest).toHaveBeenCalledWith('incidents/inc-123', ctx.key);
			expect(result).toEqual(mockResponse);
		});

		it('incidents.update updates an incident with JSON:API PUT body', async () => {
			const mockResponse = {
				data: {
					id: 'inc-123',
					type: 'incidents',
					attributes: { title: 'Resolved: Major outage in production' },
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const result = await Incidents.update(ctx, {
				id: 'inc-123',
				title: 'Resolved: Major outage in production',
				summary: 'Root cause was identified and patched',
			});

			expect(mockedRequest).toHaveBeenCalledWith('incidents/inc-123', ctx.key, {
				method: 'PUT',
				body: {
					data: {
						type: 'incidents',
						attributes: {
							title: 'Resolved: Major outage in production',
							summary: 'Root cause was identified and patched',
						},
					},
				},
			});
			expect(result).toEqual(mockResponse);
		});

		it('incidents.delete deletes an incident by ID', async () => {
			const mockResponse = {
				data: {
					id: 'inc-123',
					type: 'incidents',
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const result = await Incidents.delete(ctx, { id: 'inc-123' });

			expect(mockedRequest).toHaveBeenCalledWith('incidents/inc-123', ctx.key, {
				method: 'DELETE',
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
