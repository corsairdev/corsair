import { request } from 'corsair/http';
import { listTasks, updateReminder } from './tasks';
import { GongTasksInputSchemas, GongTasksOutputSchemas } from './tasks-types';

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

describe('Gong Tasks request contracts', () => {
	beforeEach(() => mockedRequest.mockReset());
	it('validates task input and output schemas', () => {
		expect(GongTasksInputSchemas.listTasks.safeParse({}).success).toBe(false);
		expect(
			GongTasksInputSchemas.listTasks.safeParse({
				filter: {
					userId: 'u',
					types: ['MANUAL'],
					taskAction: ['CALL'],
					status: ['OPEN'],
				},
			}).success,
		).toBe(true);
		expect(
			GongTasksOutputSchemas.listTasks.safeParse({
				requestId: 'r',
				tasks: [],
				crmType: 'GENERIC',
			}).success,
		).toBe(true);
	});
	it('posts the task filter unchanged', async () => {
		const body = {
			filter: {
				userId: 'u',
				types: ['MANUAL' as const],
				taskAction: ['CALL' as const],
				status: ['OPEN' as const],
			},
		};
		mockedRequest.mockResolvedValue({
			requestId: 'r',
			tasks: [],
			crmType: 'GENERIC',
		});
		await listTasks(ctx, body);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'POST', url: '/v2/tasks', body }),
		);
	});
	it('patches a reminder with the id in the path and remaining fields in the body', async () => {
		const input = {
			taskId: '123',
			userId: 'u',
			status: 'DONE' as const,
			priority: 'HIGH',
		};
		mockedRequest.mockResolvedValue({ requestId: 'r' });
		await updateReminder(ctx, input);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PATCH',
				url: '/v2/tasks/123',
				body: { userId: 'u', status: 'DONE', priority: 'HIGH' },
			}),
		);
	});
	it.each(['', '.', '..', '/', '\\', 'a/b', 'a\\b', '"x"', "'x'"])(
		'rejects unsafe task id %s',
		async (taskId) => {
			await expect(
				updateReminder(ctx, { taskId, userId: 'u' }),
			).rejects.toThrow('Unsafe Gong');
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);
});
