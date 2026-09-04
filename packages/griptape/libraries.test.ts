import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { create, get, list, remove, update } from './endpoints/libraries';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = jest.mocked(logEventFromContext);

const ctx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('libraries endpoints', () => {
	it('list sends GET /libraries with pagination', async () => {
		const payload = {
			items: [{ library_id: 'library-001', name: 'Shared prompts' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await list(ctx, { page: 1, page_size: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'libraries' }),
		);
		expect(result).toEqual(payload);
	});

	it('create sends POST /libraries', async () => {
		const payload = { library_id: 'library-002', name: 'New library' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await create(ctx, { body: { name: 'New library' } });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'libraries' }),
		);
		expect(result).toEqual(payload);
	});

	it('get sends GET /libraries/{library_id}', async () => {
		const payload = { library_id: 'library-003', name: 'Prompt pack' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await get(ctx, { library_id: 'library-003' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'libraries/library-003',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('update sends PATCH /libraries/{library_id}', async () => {
		const payload = { library_id: 'library-004', name: 'Renamed library' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await update(ctx, {
			library_id: 'library-004',
			body: { name: 'Renamed library' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'libraries/library-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('remove sends DELETE /libraries/{library_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await remove(ctx, { library_id: 'library-005' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'libraries/library-005',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('libraries input schemas', () => {
	it('accepts a valid libraryGet input', () => {
		const parsed = GriptapeEndpointInputSchemas.libraryGet.safeParse({
			library_id: 'library-003',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty library_id for libraryGet', () => {
		const parsed = GriptapeEndpointInputSchemas.libraryGet.safeParse({
			library_id: '',
		});
		expect(parsed.success).toBe(false);
	});
});
