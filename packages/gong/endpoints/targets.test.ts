import { request } from 'corsair/http';
import { listTargetDefinitions, uploadAssignments } from './targets';
import {
	GongTargetsInputSchemas,
	GongTargetsOutputSchemas,
} from './targets-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'token',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://tenant.api.gong.io',
	},
	$getAccountId: async () => 'account',
};

describe('Gong Targets request contracts', () => {
	beforeEach(() => mockedRequest.mockReset());
	it('validates target inputs and output', () => {
		expect(
			GongTargetsInputSchemas.listTargetDefinitions.safeParse({}).success,
		).toBe(false);
		expect(
			GongTargetsInputSchemas.listTargetDefinitions.safeParse({
				workspaceId: 12,
			}).success,
		).toBe(true);
		expect(
			GongTargetsOutputSchemas.listTargetDefinitions.safeParse({
				requestId: 'r',
				targets: [],
			}).success,
		).toBe(true);
	});
	it('gets target definitions with the workspace query parameter', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', targets: [] });
		await listTargetDefinitions(ctx, { workspaceId: 12 });
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/targets',
				query: { workspaceId: 12 },
			}),
		);
	});
	it('uploads CSV form data with documented query parameters', async () => {
		const file = new Blob(['target_id,value\n']);
		mockedRequest.mockResolvedValue({
			requestId: 'r',
			validateOnly: true,
			processedRows: 0,
		});
		await uploadAssignments(ctx, {
			targetId: '123',
			workspaceId: 8,
			validateOnly: true,
			file,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/v2/targets/123/assignments',
				query: { workspaceId: 8, validateOnly: true },
				formData: { file },
			}),
		);
	});
	it.each(['', '.', '..', '/', '\\', 'a/b', 'a\\b', '"x"', "'x'"])(
		'rejects unsafe target id %s',
		async (targetId) => {
			await expect(
				uploadAssignments(ctx, {
					targetId,
					workspaceId: 8,
					file: new Blob(['x']),
				}),
			).rejects.toThrow('Unsafe Gong');
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);
});
