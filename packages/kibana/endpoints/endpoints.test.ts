import * as client from '../client';
import { DataViews, SavedObjects, Status } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeKibanaRequest: jest.fn(),
}));

const mockedRequest = client.makeKibanaRequest as jest.MockedFunction<
	typeof client.makeKibanaRequest
>;

const ctx = {
	key: 'test-api-key',
	options: {
		baseUrl: 'https://kibana.example.com:5601',
	},
	keys: {
		get_base_url: jest
			.fn()
			.mockResolvedValue('https://kibana.example.com:5601'),
	},
} as any;

describe('Kibana Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
	});

	describe('savedObjects', () => {
		it('finds saved objects with query parameters', async () => {
			mockedRequest.mockResolvedValueOnce({ total: 1, saved_objects: [] });

			const input = {
				type: ['dashboard', 'visualization'],
				search: 'logs',
				page: 1,
				per_page: 10,
			};

			await SavedObjects.find(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/_find',
				'https://kibana.example.com:5601',
				ctx.key,
				{
					method: 'GET',
					query: {
						type: 'dashboard,visualization',
						search: 'logs',
						page: 1,
						per_page: 10,
					},
				},
			);
		});

		it('gets a saved object by type and ID', async () => {
			mockedRequest.mockResolvedValueOnce({
				id: 'my-id',
				type: 'dashboard',
				attributes: {},
			});

			await SavedObjects.get(ctx, { type: 'dashboard', id: 'my-id' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/dashboard/my-id',
				'https://kibana.example.com:5601',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('creates a new saved object', async () => {
			const input = {
				type: 'index-pattern',
				attributes: { title: 'filebeat-*' },
			};

			mockedRequest.mockResolvedValueOnce({
				id: 'new-id',
				type: 'index-pattern',
				attributes: { title: 'filebeat-*' },
			});

			await SavedObjects.create(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/index-pattern',
				'https://kibana.example.com:5601',
				ctx.key,
				{
					method: 'POST',
					query: undefined,
					body: {
						attributes: { title: 'filebeat-*' },
					},
				},
			);
		});

		it('deletes a saved object', async () => {
			mockedRequest.mockResolvedValueOnce({});

			await SavedObjects.remove(ctx, { type: 'dashboard', id: 'old-id' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/saved_objects/dashboard/old-id',
				'https://kibana.example.com:5601',
				ctx.key,
				{ method: 'DELETE' },
			);
		});
	});

	describe('dataViews', () => {
		it('retrieves a data view by ID', async () => {
			mockedRequest.mockResolvedValueOnce({
				data_view: { id: 'view-1', title: 'packetbeat-*' },
			});

			await DataViews.get(ctx, { id: 'view-1' });

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/data_views/data_view/view-1',
				'https://kibana.example.com:5601',
				ctx.key,
				{ method: 'GET' },
			);
		});
	});

	describe('status', () => {
		it('retrieves Kibana status', async () => {
			mockedRequest.mockResolvedValueOnce({
				name: 'kibana-node-1',
				status: { overall: { state: 'green' } },
			});

			await Status.get(ctx, {});

			expect(mockedRequest).toHaveBeenCalledWith(
				'api/status',
				'https://kibana.example.com:5601',
				ctx.key,
				{ method: 'GET' },
			);
		});
	});
});
