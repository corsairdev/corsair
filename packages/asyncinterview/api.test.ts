import { asyncinterview } from './index';

// Mock the network requests
jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

import { request } from 'corsair/http';

describe('AsyncInterview Plugin Endpoints', () => {
	const mockPlugin = asyncinterview({ key: 'test-key' });
	const mockContext = {
		key: 'test-key',
		plugin: mockPlugin,
	} as any; // Type assertion since we only need the auth portion for these tests

	it('should list jobs', async () => {
		const mockResponse = [{ id: 'job1', title: 'Test Job' }];
		(request as jest.Mock).mockResolvedValueOnce(mockResponse);

		const result = await mockPlugin.endpoints!.jobs.list(mockContext, {});

		expect(result).toEqual(mockResponse);
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://app.asyncinterview.ai/api',
				TOKEN: 'test-key',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/jobs',
			}),
		);
	});

	it('should delete a job', async () => {
		const mockResponse = { success: true };
		(request as jest.Mock).mockResolvedValueOnce(mockResponse);

		const result = await mockPlugin.endpoints!.jobs.delete(mockContext, {
			id: 'job1',
		});

		expect(result).toEqual(mockResponse);
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: 'test-key',
			}),
			expect.objectContaining({
				method: 'DELETE',
				url: '/jobs/job1',
			}),
		);
	});

	it('should list responses for a job', async () => {
		const mockResponse = [{ id: 'resp1', candidate_name: 'John Doe' }];
		(request as jest.Mock).mockResolvedValueOnce(mockResponse);

		const result = await mockPlugin.endpoints!.jobs.listResponses(mockContext, {
			jobId: 'job1',
		});

		expect(result).toEqual(mockResponse);
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: 'test-key',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/jobs/job1/responses',
			}),
		);
	});

	it('should update a job', async () => {
		const mockResponse = { id: 'job1', title: 'Updated Job' };
		(request as jest.Mock).mockResolvedValueOnce(mockResponse);

		const result = await mockPlugin.endpoints!.jobs.update(mockContext, {
			id: 'job1',
			title: 'Updated Job',
		});

		expect(result).toEqual(mockResponse);
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: 'test-key',
			}),
			expect.objectContaining({
				method: 'PATCH',
				url: '/jobs/job1',
				body: { title: 'Updated Job' },
			}),
		);
	});

	it('should reject a malformed provider payload', async () => {
		// id is required and must be a string; a numeric id fails output validation.
		(request as jest.Mock).mockResolvedValueOnce({ id: 42 });

		await expect(
			mockPlugin.endpoints!.jobs.update(mockContext, { id: 'job1' }),
		).rejects.toThrow();
	});
});
