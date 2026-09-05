import { makeCampaignCleanerRequest } from './client';
import {
	DeleteCampaign,
	GetCampaignList,
	GetCampaignPdfAnalysis,
	GetCampaignStatus,
	GetCredits,
} from './endpoints';
import { CampaignCleanerSchema } from './schema';

jest.mock('./client', () => ({
	makeCampaignCleanerRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const mockRequest = makeCampaignCleanerRequest as jest.MockedFunction<
	typeof makeCampaignCleanerRequest
>;

const ctx = {
	key: 'test-api-key',
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('CampaignCleaner schema', () => {
	it('declares a semver version', () => {
		expect(CampaignCleanerSchema.version).toBeDefined();
		expect(CampaignCleanerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CampaignCleanerSchema.entities).toBe('object');
		expect(CampaignCleanerSchema.entities).not.toBeNull();

		expect(Array.isArray(Object.keys(CampaignCleanerSchema.entities))).toBe(
			true,
		);

		for (const entity of Object.values(CampaignCleanerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('CampaignCleaner endpoints', () => {
	it('deleteCampaign sends the correct request and validates the response', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
		});

		const result = await DeleteCampaign.remove(ctx, {
			campaignId: 'campaign-123',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'v1/delete_campaign',
			'test-api-key',
			{
				method: 'POST',
				body: {
					campaign: {
						id: 'campaign-123',
					},
				},
			},
		);

		expect(result).toEqual({
			status: 'success',
		});
	});

	it('getCampaignList sends the correct request and validates the response', async () => {
		mockRequest.mockResolvedValueOnce({
			campaign_list: [
				{
					id: 'campaign-123',
					campaign_name: 'Test Campaign',
					status: 'completed',
					date_added: '2026-09-05',
				},
			],
		});

		const result = await GetCampaignList.list(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			'v1/get_campaign_list',
			'test-api-key',
			{
				method: 'GET',
			},
		);

		expect(result).toEqual({
			campaign_list: [
				{
					id: 'campaign-123',
					campaign_name: 'Test Campaign',
					status: 'completed',
					date_added: '2026-09-05',
				},
			],
		});
	});

	it('getCampaignStatus sends the correct request and validates the response', async () => {
		mockRequest.mockResolvedValueOnce({
			campaign_status: {
				id: 'campaign-123',
				campaign_name: 'Test Campaign',
				status: 'processing',
				date_added: '2026-09-05',
			},
		});

		const result = await GetCampaignStatus.status(ctx, {
			campaignId: 'campaign-123',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'v1/get_campaign_status',
			'test-api-key',
			{
				method: 'POST',
				body: {
					campaign: {
						id: 'campaign-123',
					},
				},
			},
		);

		expect(result).toEqual({
			campaign_status: {
				id: 'campaign-123',
				campaign_name: 'Test Campaign',
				status: 'processing',
				date_added: '2026-09-05',
			},
		});
	});

	it('getCampaignPdfAnalysis sends the correct request and returns the response', async () => {
		const pdfResponse = {
			analysis: 'Campaign analysis',
		};

		mockRequest.mockResolvedValueOnce(pdfResponse);

		const result = await GetCampaignPdfAnalysis.pdfAnalysis(ctx, {
			campaignId: 'campaign-123',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'v1/get_campaign_pdf_analysis',
			'test-api-key',
			{
				method: 'POST',
				body: {
					campaign: {
						id: 'campaign-123',
					},
				},
			},
		);

		expect(result).toEqual(pdfResponse);
	});

	it('getCredits sends the correct request and validates the response', async () => {
		mockRequest.mockResolvedValueOnce({
			credits: 100,
		});

		const result = await GetCredits.credits(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith('v1/get_credits', 'test-api-key', {
			method: 'GET',
		});

		expect(result).toEqual({
			credits: 100,
		});
	});
});

describe('CampaignCleaner input validation', () => {
	it('rejects an invalid deleteCampaign input', async () => {
		await expect(
			DeleteCampaign.remove(ctx, {
				campaignId: 123 as unknown as string,
			}),
		).rejects.toThrow();

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an invalid getCampaignStatus input', async () => {
		await expect(
			GetCampaignStatus.status(ctx, {
				campaignId: 123 as unknown as string,
			}),
		).rejects.toThrow();

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an invalid getCampaignPdfAnalysis input', async () => {
		await expect(
			GetCampaignPdfAnalysis.pdfAnalysis(ctx, {
				campaignId: 123 as unknown as string,
			}),
		).rejects.toThrow();

		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('CampaignCleaner response validation', () => {
	it('rejects an invalid deleteCampaign response', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'invalid-status',
		});

		await expect(
			DeleteCampaign.remove(ctx, {
				campaignId: 'campaign-123',
			}),
		).rejects.toThrow();
	});

	it('rejects an invalid getCampaignList response', async () => {
		mockRequest.mockResolvedValueOnce({
			campaign_list: [
				{
					id: 'campaign-123',
					campaign_name: 'Test Campaign',
					status: 'invalid-status',
					date_added: '2026-09-05',
				},
			],
		});

		await expect(GetCampaignList.list(ctx, {})).rejects.toThrow();
	});

	it('rejects an invalid getCampaignStatus response', async () => {
		mockRequest.mockResolvedValueOnce({
			campaign_status: {
				id: 'campaign-123',
				campaign_name: 'Test Campaign',
				status: 'invalid-status',
				date_added: '2026-09-05',
			},
		});

		await expect(
			GetCampaignStatus.status(ctx, {
				campaignId: 'campaign-123',
			}),
		).rejects.toThrow();
	});

	it('rejects an invalid getCredits response', async () => {
		mockRequest.mockResolvedValueOnce({
			credits: 'invalid',
		});

		await expect(GetCredits.credits(ctx, {})).rejects.toThrow();
	});
});
