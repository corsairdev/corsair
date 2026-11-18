import { request } from 'corsair/http';
import { gong } from './index';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const mockedRequest = jest.mocked(request);
const endpoints = gong().endpoints;
if (!endpoints)
	throw new Error('Gong endpoint tree is required for schema validation tests');
const ctx = {
	key: 'key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://tenant.api.gong.io',
	},
	$getAccountId: async () => 'account',
} as never;

describe('Gong registered runtime schemas', () => {
	beforeEach(() => mockedRequest.mockReset());

	it('rejects invalid public input before making an HTTP request', async () => {
		await expect(endpoints.calls.list(ctx, {} as never)).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an invalid provider response before returning it', async () => {
		mockedRequest.mockResolvedValue({
			requestId: 'r',
			calls: 'not-an-array',
			records: {},
		});
		await expect(
			endpoints.calls.list(ctx, {
				fromDateTime: '2025-01-01T00:00:00Z',
				toDateTime: '2025-01-02T00:00:00Z',
			}),
		).rejects.toThrow();
	});

	it('returns a parsed provider response for valid requests', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', calls: [], records: {} });
		await expect(
			endpoints.calls.list(ctx, {
				fromDateTime: '2025-01-01T00:00:00Z',
				toDateTime: '2025-01-02T00:00:00Z',
			}),
		).resolves.toMatchObject({ requestId: 'r', calls: [] });
	});
});
