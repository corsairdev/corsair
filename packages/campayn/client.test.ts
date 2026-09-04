import { ApiError, request } from 'corsair/http';
import {
	CAMPAYN_API_BASE,
	CampaynAPIError,
	makeCampaynRequest,
} from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('makeCampaynRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends TRUEREST API key header for GET requests', async () => {
		mockRequest.mockResolvedValue([
			{ id: '1', list_name: 'Leads', contact_count: 3 },
		]);

		await makeCampaynRequest('lists.json', 'test-key', {
			method: 'GET',
			query: { from: 1 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: CAMPAYN_API_BASE,
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					Authorization: 'TRUEREST apikey=test-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'lists.json',
				query: { from: 1 },
			}),
		);
	});

	it('passes body for POST requests', async () => {
		mockRequest.mockResolvedValue({ success: true });

		await makeCampaynRequest('lists/10/unsubscribe.json', 'test-key', {
			method: 'POST',
			body: { email: 'a@b.com' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'lists/10/unsubscribe.json',
				body: { email: 'a@b.com' },
			}),
		);
	});

	it('maps ApiError to CampaynAPIError with code and status', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'lists.json' },
				{
					url: 'lists.json',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { msg: 'Invalid API key', errorCode: 'invalid_key' },
				},
				'Unauthorized',
			),
		);

		await expect(makeCampaynRequest('lists.json', 'bad')).rejects.toMatchObject(
			{
				constructor: CampaynAPIError,
				message: 'Invalid API key',
				code: 'invalid_key',
				status: 401,
			},
		);
	});
});
