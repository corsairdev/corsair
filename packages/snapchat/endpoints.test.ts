import * as core from 'corsair/core';
import * as client from './client';
import { Actions } from './endpoints';
import { SNAPCHAT_REQUIRED_INPUT_FIELDS } from './endpoints/types';
import type { SnapchatContext } from './index';
import { SNAPCHAT_OPERATIONS } from './operations';

jest.mock('./client', () => ({
	makeSnapchatRequest: jest.fn(),
	requireString: jest.fn().mockReturnValue('snap-token'),
	SnapchatAPIError: class SnapchatAPIError extends Error {},
	SNAPCHAT_ADS_API_BASE: 'https://adsapi.snapchat.com/v1',
	SNAPCHAT_CONVERSION_API_BASE: 'https://tr.snapchat.com/v2',
}));

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const makeRequestMock = client.makeSnapchatRequest as jest.MockedFunction<
	typeof client.makeSnapchatRequest
>;

const logEventMock = core.logEventFromContext as jest.MockedFunction<
	typeof core.logEventFromContext
>;

function buildValidInput(
	operationName: keyof typeof SNAPCHAT_REQUIRED_INPUT_FIELDS,
) {
	const requiredFields = SNAPCHAT_REQUIRED_INPUT_FIELDS[operationName];
	return Object.fromEntries(
		requiredFields.map((field) => [field, `${field}-value`]),
	);
}

const ctx = {
	key: 'snap-token',
	options: {},
} as SnapchatContext;

describe('Snapchat actions endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		makeRequestMock.mockResolvedValue({ ok: true, request_status: 'SUCCESS' });
	});

	it('exposes full operation surface', () => {
		expect(Object.keys(Actions)).toHaveLength(139);
	});

	for (const operation of SNAPCHAT_OPERATIONS) {
		it(`executes and wires ${operation.id} correctly`, async () => {
			const endpoint = Actions[operation.name];
			const input = buildValidInput(operation.name);
			const result = await endpoint(ctx, input);

			expect(makeRequestMock).toHaveBeenCalledTimes(1);
			const [path, token, options] = makeRequestMock.mock.calls[0]!;

			expect(typeof path).toBe('string');
			expect(path.startsWith('/')).toBe(true);
			expect(token).toBe('snap-token');
			expect(options).toBeDefined();
			expect(options?.method).toMatch(/^(GET|POST|PUT|DELETE|PATCH)$/);
			expect(result).toEqual({ ok: true, request_status: 'SUCCESS' });

			expect(logEventMock).toHaveBeenCalledWith(
				ctx,
				`snapchat.actions.${operation.name}`,
				expect.any(Object),
				'completed',
			);
		});
	}

	it('rejects invalid input when required fields are missing', async () => {
		await expect(Actions.addSegmentUsers(ctx, {})).rejects.toThrow();
	});

	it('passes access token to makeSnapchatRequest', async () => {
		await Actions.listOrganizations(ctx, {});
		expect(makeRequestMock).toHaveBeenCalledWith(
			'/me/organizations',
			'snap-token',
			expect.any(Object),
		);
	});

	it('calls correct path for getOrganization', async () => {
		await Actions.getOrganization(ctx, { organization_id: 'org_abc' });
		const [path] = makeRequestMock.mock.calls[0]!;
		expect(path).toBe('/organizations/org_abc');
	});

	it('calls correct path for getCampaign', async () => {
		await Actions.getCampaign(ctx, { campaign_id: 'camp_xyz' });
		const [path] = makeRequestMock.mock.calls[0]!;
		expect(path).toBe('/campaigns/camp_xyz');
	});

	it('calls correct path for listCampaigns', async () => {
		await Actions.listCampaigns(ctx, { ad_account_id: 'acc_123' });
		const [path] = makeRequestMock.mock.calls[0]!;
		expect(path).toBe('/adaccounts/acc_123/campaigns');
	});

	it('uses DELETE for deleteSegment', async () => {
		await Actions.deleteSegment(ctx, { segment_id: 'seg_1' });
		const [, , opts] = makeRequestMock.mock.calls[0]!;
		expect(opts?.method).toBe('DELETE');
	});

	it('strips path parameters from createCampaign body', async () => {
		await Actions.createCampaign(ctx, {
			ad_account_id: 'acc_123',
			name: 'Summer Sale',
			start_time: '2026-06-01',
			daily_budget_micro: 1000000,
		});
		const [path, , opts] = makeRequestMock.mock.calls[0]!;
		expect(path).toBe('/adaccounts/acc_123/campaigns');
		expect(opts?.method).toBe('POST');
		const body = opts?.body as { campaigns: Array<Record<string, unknown>> };
		expect(body.campaigns[0]).toEqual({
			name: 'Summer Sale',
			start_time: '2026-06-01',
			daily_budget_micro: 1000000,
		});
		expect(body.campaigns[0]!.ad_account_id).toBeUndefined();
	});

	it('strips path parameters from updateCampaign body', async () => {
		await Actions.updateCampaign(ctx, {
			ad_account_id: 'acc_123',
			campaign_id: 'camp_456',
			name: 'Updated Sale',
		});
		const [path, , opts] = makeRequestMock.mock.calls[0]!;
		expect(path).toBe('/adaccounts/acc_123/campaigns');
		expect(opts?.method).toBe('PUT');
		const body = opts?.body as { campaigns: Array<Record<string, unknown>> };
		expect(body.campaigns[0]).toEqual({
			id: 'camp_456',
			name: 'Updated Sale',
		});
		expect(body.campaigns[0]!.ad_account_id).toBeUndefined();
		expect(body.campaigns[0]!.campaign_id).toBeUndefined();
	});

	it('forwards timeoutMs and signal from context options to makeSnapchatRequest', async () => {
		const controller = new AbortController();
		const customCtx = {
			key: 'snap-token',
			options: {
				timeoutMs: 8000,
				signal: controller.signal,
			},
		} as SnapchatContext;

		await Actions.getCampaign(customCtx, { campaign_id: 'camp_1' });
		const [, , opts] = makeRequestMock.mock.calls[0]!;
		expect(opts?.timeoutMs).toBe(8000);
		expect(opts?.signal).toBe(controller.signal);
	});

	it('validateConversionEvent uses conversion API base', async () => {
		await Actions.validateConversionEvent(ctx, {
			events: [],
			pixel_id: 'px_1',
		});
		const [, , opts] = makeRequestMock.mock.calls[0]!;
		expect(opts?.base).toBe('https://tr.snapchat.com/v2');
	});

	it('targeting endpoints pass country_code as query param', async () => {
		await Actions.getTargetingCarriers(ctx, { country_code: 'US' });
		const [path, , opts] = makeRequestMock.mock.calls[0]!;
		expect(path).toBe('/targeting/carriers');
		expect(opts?.query?.country_code).toBe('US');
	});
});
