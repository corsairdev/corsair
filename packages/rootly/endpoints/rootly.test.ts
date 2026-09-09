import * as client from '../client';
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

const mockedRequest = client.makeRootlyRequest as jest.MockedFunction<
	typeof client.makeRootlyRequest
>;

const ctx = {
	key: 'test-rootly-api-key',
	db: {},
} as any;

describe('Rootly endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
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
			mockedRequest.mockResolvedValueOnce(mockResponse as never);

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
			mockedRequest.mockResolvedValueOnce(mockResponse as never);

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
			mockedRequest.mockResolvedValueOnce(mockResponse as never);

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
			mockedRequest.mockResolvedValueOnce(mockResponse as never);

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
			mockedRequest.mockResolvedValueOnce(mockResponse as never);

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
			mockedRequest.mockResolvedValueOnce(mockResponse as never);

			const result = await Incidents.delete(ctx, { id: 'inc-123' });

			expect(mockedRequest).toHaveBeenCalledWith('incidents/inc-123', ctx.key, {
				method: 'DELETE',
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
