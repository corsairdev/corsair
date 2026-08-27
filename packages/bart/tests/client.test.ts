import { ApiError, request } from 'corsair/http';
import {
	BART_API_BASE,
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

	it('throws 401 BartAPIError when API key is missing or empty', async () => {
		await expect(
			makeBartRequest('bsa.aspx', undefined, { query: { cmd: 'count' } }),
		).rejects.toThrow('API key is required for BART API requests');

		await expect(
			makeBartRequest('bsa.aspx', '', { query: { cmd: 'count' } }),
		).rejects.toThrow('API key is required for BART API requests');

		await expect(
			makeBartRequest('bsa.aspx', '   ', { query: { cmd: 'count' } }),
		).rejects.toThrow('API key is required for BART API requests');
	});

	it('uses explicit API key in request options', async () => {
		mockRequest.mockResolvedValueOnce({
			root: {
				date: '08/21/2026',
				time: '12:00:00 PM',
				traincount: '42',
			},
		});

		const res = await makeBartRequest<{ traincount: string }>(
			'bsa.aspx',
			'MY-EXPLICIT-KEY',
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
			key: 'MY-EXPLICIT-KEY',
			json: 'y',
		});
		expect(res.traincount).toBe('42');
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
		}>('stn.aspx', 'TEST-KEY', { query: { cmd: 'stns' } });

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

		try {
			await makeBartRequest('stn.aspx', 'TEST-KEY', {
				query: { cmd: 'stninfo', orig: 'INVALID' },
			});
			fail('Expected makeBartRequest to throw');
		} catch (error) {
			expect(error).toBeInstanceOf(BartAPIError);
			expect((error as BartAPIError).message).toBe(
				'Invalid origin station specified',
			);
			expect((error as BartAPIError).status).toBeUndefined();
			expect((error as BartAPIError).code).toBeUndefined();
		}
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
			makeBartRequest('bsa.aspx', 'TEST-KEY', { query: { cmd: 'badcmd' } }),
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
			await makeBartRequest('bsa.aspx', 'TEST-KEY', {
				query: { cmd: 'bsa' },
			});
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
