import { ApiError, request } from 'corsair/http';
import {
	BART_API_BASE,
	BART_PUBLIC_API_KEY,
	BartAPIError,
	compactQuery,
	makeBartRequest,
} from '../client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

describe('BART Client', () => {
	const mockRequest = request as jest.MockedFunction<typeof request>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('uses default public API key when no key provided', async () => {
		mockRequest.mockResolvedValueOnce({
			root: {
				date: '08/21/2026',
				time: '12:00:00 PM',
				traincount: '42',
			},
		});

		const res = await makeBartRequest<{ traincount: string }>(
			'bsa.aspx',
			undefined,
			{
				query: { cmd: 'count' },
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const callConfig = mockRequest.mock.calls[0]?.[0];
		const callOptions = mockRequest.mock.calls[0]?.[1];

		expect(callConfig?.BASE).toBe(BART_API_BASE);
		expect(callOptions?.query).toEqual({
			cmd: 'count',
			key: BART_PUBLIC_API_KEY,
			json: 'y',
		});
		expect(res.traincount).toBe('42');
	});

	it('uses custom API key when provided', async () => {
		mockRequest.mockResolvedValueOnce({
			root: {
				traincount: '50',
			},
		});

		const res = await makeBartRequest<{ traincount: string }>(
			'bsa.aspx',
			'MY-CUSTOM-KEY',
			{
				query: { cmd: 'count' },
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const callOptions = mockRequest.mock.calls[0]?.[1];
		expect(callOptions?.query?.key).toBe('MY-CUSTOM-KEY');
		expect(res.traincount).toBe('50');
	});

	it('unwraps root object from BART response', async () => {
		const payload = {
			root: {
				station: [{ name: '12th St', abbr: '12TH' }],
			},
		};
		mockRequest.mockResolvedValueOnce(payload);

		const res = await makeBartRequest<{
			station: Array<{ name: string; abbr: string }>;
		}>('stn.aspx', undefined, { query: { cmd: 'stns' } });

		expect(res.station).toHaveLength(1);
		expect(res.station?.[0]?.abbr).toBe('12TH');
	});

	it('detects in-body error messages from root.message.error and throws BartAPIError', async () => {
		mockRequest.mockResolvedValueOnce({
			root: {
				message: {
					error: {
						text: 'Invalid origin station specified',
					},
				},
			},
		});

		await expect(
			makeBartRequest('stn.aspx', undefined, {
				query: { cmd: 'stninfo', orig: 'INVALID' },
			}),
		).rejects.toThrow('Invalid origin station specified');
	});

	it('detects in-body error messages from root.error and throws BartAPIError', async () => {
		mockRequest.mockResolvedValueOnce({
			root: {
				error: {
					text: 'Command not found',
				},
			},
		});

		await expect(
			makeBartRequest('bsa.aspx', undefined, { query: { cmd: 'badcmd' } }),
		).rejects.toThrow('Command not found');
	});

	it('handles ApiError and preserves status and retry-after', async () => {
		const apiError = new ApiError(
			{
				method: 'GET',
				url: 'bsa.aspx',
			},
			{
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'Rate limit exceeded' },
				ok: false,
				url: 'https://api.bart.gov/api/bsa.aspx',
			},
			'Rate limit exceeded',
			{
				retryAfter: 60000,
			},
		);

		mockRequest.mockRejectedValueOnce(apiError);

		try {
			await makeBartRequest('bsa.aspx', undefined, { query: { cmd: 'bsa' } });
			fail('Expected makeBartRequest to throw');
		} catch (error) {
			expect(error).toBeInstanceOf(BartAPIError);
			const bartErr = error as BartAPIError;
			expect(bartErr.status).toBe(429);
			expect(bartErr.retryAfter).toBe(60000);
		}
	});

	it('compactQuery filters out undefined values properly', () => {
		const input = {
			cmd: 'bsa',
			orig: undefined,
			date: 'today',
			count: 5,
			flag: false,
		};
		const compacted = compactQuery(input);
		expect(compacted).toEqual({
			cmd: 'bsa',
			date: 'today',
			count: 5,
			flag: false,
		});
		expect(compactQuery(undefined)).toBeUndefined();
		expect(compactQuery({ a: undefined })).toBeUndefined();
	});
});
