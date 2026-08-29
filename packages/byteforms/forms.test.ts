import {
	create,
	deleteForm,
	getAll,
	getById,
	getResponses,
} from './endpoints/forms';

jest.mock('./client', () => ({
	makeByteFormsRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

import { logEventFromContext } from 'corsair/core';
import { makeByteFormsRequest } from './client';

const mockRequest = makeByteFormsRequest as jest.Mock;
const mockLog = logEventFromContext as jest.Mock;

const ctx = { key: 'test-api-key' } as any;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockReset();
});

describe('ByteForms endpoints', () => {
	it('create posts to /form with the API key and returns the envelope', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 1, public_id: 'abc', name: 'Demo' },
			status: 'success',
		});

		const res = await create(ctx, {
			name: 'Demo',
			body: [{ component: 'input', type: 'text', label: 'Name' }],
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledWith(
			'form',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(res.status).toBe('success');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'byteforms.forms.create',
			expect.any(Object),
			'completed',
		);
	});

	it('delete issues a DELETE to /form/:id', async () => {
		mockRequest.mockResolvedValue({ status: 'success' });

		const res = await deleteForm(ctx, { formId: '42' });

		expect(mockRequest).toHaveBeenCalledWith(
			'form/42',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expect(res.status).toBe('success');
	});

	it('getById fetches a single form by id', async () => {
		mockRequest.mockResolvedValue({
			data: {
				id: 7,
				public_id: 'xyz',
				name: 'Contact',
				body: [],
				is_custom: false,
				options: {},
				user_id: 1,
				created_at: '2024-01-01T00:00:00Z',
				updated_at: '2024-01-01T00:00:00Z',
			},
			status: 'success',
		});

		const res = await getById(ctx, { formId: '7' });

		expect(mockRequest).toHaveBeenCalledWith(
			'form/7',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(res.data.name).toBe('Contact');
	});

	it('list returns the array of forms', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{
					id: 1,
					public_id: 'a',
					name: 'A',
					body: [],
					is_custom: false,
					options: {},
					user_id: 1,
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			],
			status: 'success',
		});

		const res = await getAll(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			'form',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(Array.isArray(res.data)).toBe(true);
		expect(res.data).toHaveLength(1);
	});

	it('responses passes pagination query params and returns the cursor envelope', async () => {
		mockRequest.mockResolvedValue({
			count: 2,
			cursor: { after: null, before: null },
			data: [
				{
					id: 1,
					form_id: 9,
					response: { email: 'a@b.com' },
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			],
			status: 'success',
		});

		const res = await getResponses(ctx, {
			formId: '9',
			limit: 10,
			order: 'desc',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'form/responses/9',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ limit: 10, order: 'desc' }),
			}),
		);
		expect(res.count).toBe(2);
		expect(res.cursor).toEqual({ after: null, before: null });
	});
});
