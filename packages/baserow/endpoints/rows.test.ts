import type { BaserowContext } from '..';
import { makeBaserowRequest } from '../client';
import { create, get, list, remove, update } from './rows';

jest.mock('../client', () => ({
	makeBaserowRequest: jest.fn(),
}));

const mockedMakeBaserowRequest = makeBaserowRequest as jest.MockedFunction<
	typeof makeBaserowRequest
>;

const createContext = (): BaserowContext =>
	({
		key: 'test-api-key',
		$getAccountId: async () => 'test-account-id',
	}) as BaserowContext;

describe('Baserow row endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists rows with pagination and search parameters', async () => {
		const response = {
			count: 1,
			next: null,
			previous: null,
			results: [{ id: 1, name: 'Test' }],
		};

		mockedMakeBaserowRequest.mockResolvedValue(response);

		const result = await list(createContext(), {
			tableId: '123',
			page: 2,
			size: 25,
			search: 'Test',
			orderBy: '-id',
		});

		expect(mockedMakeBaserowRequest).toHaveBeenCalledWith(
			'api/database/rows/table/123/',
			'test-api-key',
			{
				method: 'GET',
				query: {
					page: 2,
					size: 25,
					search: 'Test',
					order_by: '-id',
				},
			},
		);

		expect(result).toEqual(response);
	});

	it('gets a specific row', async () => {
		const response = {
			id: 42,
			name: 'Test row',
		};

		mockedMakeBaserowRequest.mockResolvedValue(response);

		const result = await get(createContext(), {
			tableId: '123',
			rowId: 42,
		});

		expect(mockedMakeBaserowRequest).toHaveBeenCalledWith(
			'api/database/rows/table/123/42/',
			'test-api-key',
			{
				method: 'GET',
			},
		);

		expect(result).toEqual(response);
	});

	it('creates a row with the supplied data', async () => {
		const data = {
			name: 'New row',
			status: 'active',
		};

		const response = {
			id: 100,
			...data,
		};

		mockedMakeBaserowRequest.mockResolvedValue(response);

		const result = await create(createContext(), {
			tableId: '123',
			data,
		});

		expect(mockedMakeBaserowRequest).toHaveBeenCalledWith(
			'api/database/rows/table/123/',
			'test-api-key',
			{
				method: 'POST',
				body: data,
			},
		);

		expect(result).toEqual(response);
	});

	it('updates a row with PATCH', async () => {
		const data = {
			name: 'Updated row',
		};

		const response = {
			id: 42,
			name: 'Updated row',
		};

		mockedMakeBaserowRequest.mockResolvedValue(response);

		const result = await update(createContext(), {
			tableId: '123',
			rowId: 42,
			data,
		});

		expect(mockedMakeBaserowRequest).toHaveBeenCalledWith(
			'api/database/rows/table/123/42/',
			'test-api-key',
			{
				method: 'PATCH',
				body: data,
			},
		);

		expect(result).toEqual(response);
	});

	it('deletes a row and returns success', async () => {
		mockedMakeBaserowRequest.mockResolvedValue(undefined);

		const result = await remove(createContext(), {
			tableId: '123',
			rowId: 42,
		});

		expect(mockedMakeBaserowRequest).toHaveBeenCalledWith(
			'api/database/rows/table/123/42/',
			'test-api-key',
			{
				method: 'DELETE',
			},
		);

		expect(result).toEqual({
			success: true,
		});
	});
});
