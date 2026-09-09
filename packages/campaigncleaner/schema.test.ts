import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { CampaignCleanerAPIError, makeCampaignCleanerRequest } from './client';
import { CampaignCleanerEndpoints } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { CampaignCleanerContext } from './index';
import { campaignCleanerEndpointSchemas, campaigncleaner } from './index';
import { CampaignCleanerSchema } from './schema';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: jest.requireActual('corsair/core').AuthMissingError,
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;
const mockLog = logEventFromContext as jest.Mock;

const ctx = {
	key: 'test-api-key',
	$getAccountId: async () => 'acct',
	database: undefined,
	endpoints: {},
} as CampaignCleanerContext;

const campaign = {
	id: 'e8c8af95-c033-11ed-9848-003048d8d536',
	campaign_name: 'Test Campaign 1',
	status: 'completed' as const,
	date_added: '2023-02-23T12:02:46-05:00',
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Campaign Cleaner plugin shape', () => {
	it('registers the five official operations', () => {
		const plugin = campaigncleaner();
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual([
			'campaign.delete',
			'campaign.list',
			'campaign.pdfAnalysis',
			'campaign.status',
			'credits.get',
		]);
		expect(plugin.endpointMeta?.['campaign.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = campaigncleaner();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
	});
});

describe('docs-labeled schema', () => {
	it('parses official campaign_list and credits examples', () => {
		expect(Object.keys(CampaignCleanerSchema.entities)).toEqual([
			'campaigns',
			'credits',
		]);
		expect(
			CampaignCleanerSchema.entities.campaigns.parse(campaign).campaign_name,
		).toBe('Test Campaign 1');
		expect(
			CampaignCleanerSchema.entities.credits.parse({ credits: 987 }),
		).toEqual({ credits: 987 });
	});
});

describe('endpoints', () => {
	it('deleteCampaign POSTs { campaign: { id } }', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success' });
		const result = await CampaignCleanerEndpoints.deleteCampaign(ctx, {
			campaignId: campaign.id,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({ 'X-CC-API-Key': 'test-api-key' }),
			}),
			{
				method: 'POST',
				url: '/v1/delete_campaign',
				body: { campaign: { id: campaign.id } },
				mediaType: 'application/json',
			},
		);
		expect(result.status).toBe('success');
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'campaign_cleaner.campaign.delete',
			{ campaignId: campaign.id },
			'completed',
		);
	});

	it('getCampaignList GETs /v1/get_campaign_list', async () => {
		mockRequest.mockResolvedValueOnce({ campaign_list: [campaign] });
		const result = await CampaignCleanerEndpoints.getCampaignList(ctx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/get_campaign_list',
			}),
		);
		expect(result.campaign_list[0]?.id).toBe(campaign.id);
	});

	it('getCampaignStatus POSTs campaign id', async () => {
		mockRequest.mockResolvedValueOnce({ campaign_status: campaign });
		const result = await CampaignCleanerEndpoints.getCampaignStatus(ctx, {
			campaignId: campaign.id,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v1/get_campaign_status',
				body: { campaign: { id: campaign.id } },
			}),
		);
		expect(result.campaign_status.status).toBe('completed');
	});

	it('getCredits GETs /v1/get_credits', async () => {
		mockRequest.mockResolvedValueOnce({ credits: 987 });
		const result = await CampaignCleanerEndpoints.getCredits(ctx, {});
		expect(result.credits).toBe(987);
	});

	it('rejects invalid delete input before calling the API', async () => {
		await expect(
			CampaignCleanerEndpoints.deleteCampaign(ctx, {
				campaignId: 1 as unknown as string,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects invalid list and status payloads', async () => {
		mockRequest.mockResolvedValueOnce({
			campaign_list: [{ ...campaign, status: 'nope' }],
		});
		await expect(
			CampaignCleanerEndpoints.getCampaignList(ctx, {}),
		).rejects.toThrow();
		mockRequest.mockResolvedValueOnce({});
		await expect(
			CampaignCleanerEndpoints.getCampaignStatus(ctx, {
				campaignId: campaign.id,
			}),
		).rejects.toThrow();
	});
});

describe('PDF analysis', () => {
	it('returns base64 PDF bytes', async () => {
		const pdf = Buffer.from('%PDF-1.4 test');
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: { get: () => 'application/pdf' },
			arrayBuffer: async () =>
				pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength),
		});
		global.fetch = fetchMock as unknown as typeof fetch;

		const result = await makeCampaignCleanerRequest(
			'/v1/get_campaign_pdf_analysis',
			'test-api-key',
			{
				method: 'POST',
				binary: true,
				body: { campaign: { id: campaign.id } },
			},
		);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.campaigncleaner.com/v1/get_campaign_pdf_analysis',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ campaign: { id: campaign.id } }),
			}),
		);
		expect(result).toEqual({
			content_type: 'application/pdf',
			content_base64: pdf.toString('base64'),
		});
		expect(
			campaignCleanerEndpointSchemas['campaign.pdfAnalysis'].output.parse(
				result,
			),
		).toEqual(result);

		const fromHandler = await CampaignCleanerEndpoints.getCampaignPdfAnalysis(
			ctx,
			{ campaignId: campaign.id },
		);
		expect(fromHandler.content_base64).toBe(pdf.toString('base64'));
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'campaign_cleaner.campaign.pdfAnalysis',
			{ campaignId: campaign.id },
			'completed',
		);
	});

	it('treats numeric Retry-After as seconds', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			headers: {
				get: (name: string) =>
					name.toLowerCase() === 'retry-after' ? '45' : 'application/json',
			},
			json: async () => ({ error: 'slow down' }),
		}) as unknown as typeof fetch;

		await expect(
			makeCampaignCleanerRequest('/v1/get_campaign_pdf_analysis', 'k', {
				method: 'POST',
				binary: true,
				body: { campaign: { id: 'x' } },
			}),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 45_000,
			message: 'slow down',
		});
	});
});

describe('JSON error mapping', () => {
	it('surfaces Campaign Cleaner error bodies', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/v1/get_credits' },
				{
					url: 'https://api.campaigncleaner.com/v1/get_credits',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { error: 'invalid key' },
				},
				'Unauthorized',
			),
		);
		await expect(
			makeCampaignCleanerRequest('/v1/get_credits', 'k'),
		).rejects.toMatchObject({
			name: 'CampaignCleanerAPIError',
			message: 'invalid key',
			status: 401,
		});
	});
});

describe('error handlers', () => {
	it('retries 429 using server delay', async () => {
		const error = new CampaignCleanerAPIError('rate', 429, 2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});

	it('does not retry auth failures', async () => {
		const error = new CampaignCleanerAPIError('nope', 401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
