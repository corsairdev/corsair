import { ApiError, request } from 'corsair/http';
import {
	CLICKUP_API_V2_BASE,
	CLICKUP_API_V3_BASE,
	ClickupAPIError,
	makeClickupRequest,
} from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const TOKEN = 'test-token-not-a-secret';

describe('ClickUp API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('targets the v2 base URL with the raw API token by default', async () => {
		await makeClickupRequest('team', TOKEN, { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: CLICKUP_API_V2_BASE,
				HEADERS: expect.objectContaining({ Authorization: TOKEN }),
			}),
			expect.objectContaining({ method: 'GET', url: 'team' }),
		);
		expect(CLICKUP_API_V2_BASE).toBe('https://api.clickup.com/api/v2');
	});

	it('targets the v3 base URL when requested', async () => {
		await makeClickupRequest('workspaces/ws1/docs', TOKEN, {
			method: 'GET',
			version: 'v3',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: CLICKUP_API_V3_BASE }),
			expect.objectContaining({ method: 'GET' }),
		);
		expect(CLICKUP_API_V3_BASE).toBe('https://api.clickup.com/api/v3');
	});

	it('sends bodies on write methods', async () => {
		await makeClickupRequest('list/list1/task', TOKEN, {
			method: 'POST',
			body: { name: 'New Task' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				body: { name: 'New Task' },
			}),
		);
	});

	it('forwards query parameters on GET requests', async () => {
		await makeClickupRequest('list/list1/task', TOKEN, {
			method: 'GET',
			query: { page: 2 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				query: { page: 2 },
			}),
		);
	});

	it('forwards array query parameters for filtered reads', async () => {
		await makeClickupRequest('team/team1/task', TOKEN, {
			method: 'GET',
			query: { list_ids: ['list1', 'list2'], page: 0 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { list_ids: ['list1', 'list2'], page: 0 },
			}),
		);
	});

	it('forwards query parameters on DELETE requests', async () => {
		await makeClickupRequest('task/task1/dependency', TOKEN, {
			method: 'DELETE',
			query: { depends_on: 'task2' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				query: { depends_on: 'task2' },
			}),
		);
	});

	it('preserves ApiError so error handlers can match status codes', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'team' },
			{
				status: 429,
				statusText: 'Too Many Requests',
				ok: false,
				url: 'team',
				body: {},
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(apiError);

		const outcome = await makeClickupRequest('team', TOKEN).then(
			() => 'resolved',
			(error: Error) => error,
		);

		expect(outcome).toBe(apiError);
	});

	it('wraps generic failures in ClickupAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('boom'));

		const outcome = await makeClickupRequest('team', TOKEN).then(
			() => 'resolved',
			(error: Error) => error,
		);

		expect(outcome).toBeInstanceOf(ClickupAPIError);
		if (outcome instanceof ClickupAPIError) {
			expect(outcome.message).toBe('boom');
		}
	});
});
