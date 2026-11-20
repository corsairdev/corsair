// Response shapes recorded from the live run on 11-20 (trial account, trimmed,
// made-up example.com leads) plus input rules from the review threads.
import { logEventFromContext } from 'corsair/core';
import { makeLemlistRequest } from './client';
import { Campaigns, Leads, Unsubscribes } from './endpoints';
import {
	CampaignsGetBatchStatsInputSchema,
	CampaignsGetStatsInputSchema,
	CampaignsUpdateSettingsInputSchema,
	LeadsCreateInCampaignInputSchema,
	LeadsGetInputSchema,
	LeadsPauseInputSchema,
} from './endpoints/types';
import type { LemlistPluginContext } from './index';
import { lemlist, lemlistEndpointMeta } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeLemlistRequest: jest.fn() };
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

const mockRequest = jest.mocked(makeLemlistRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

const ctx = {
	key: 'test_api_key',
	endpoints: {},
	db: {},
	$getAccountId: async () => 'test-account-id',
	options: {},
	keys: {
		get_dek: async () => 'test-dek',
		issue_new_dek: async () => 'test-dek',
		get_api_key: async () => 'stored_api_key',
		get_webhook_signature: async () => null,
		set_api_key: async () => undefined,
		set_webhook_signature: async () => undefined,
	},
} satisfies LemlistPluginContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockReset();
});

describe('campaigns.list (live v2 envelope)', () => {
	it('parses the { campaigns, pagination } page Lemlist returns for version=v2', async () => {
		mockRequest.mockResolvedValue({
			campaigns: [
				{
					_id: 'cam_9piDTe967frJKnsYu',
					name: 'corsair-plugin-test',
					sequenceId: 'seq_6q3K7PncnNMLcua9X',
					folderId: 'root',
					emoji: '👑',
					createdAt: '2026-11-20T14:24:33.915Z',
					createdBy: 'usr_CEFv9d8FdRPT4P3nZ',
					status: 'draft',
				},
			],
			pagination: {
				totalRecords: 1,
				currentPage: 1,
				nextPage: 1,
				totalPage: 1,
			},
		});

		const res = await Campaigns.list(ctx, { status: 'draft' });

		expect(res.campaigns).toHaveLength(1);
		expect(res.campaigns[0]?._id).toBe('cam_9piDTe967frJKnsYu');
		expect(res.pagination?.totalRecords).toBe(1);
		expect(mockLogEvent.mock.calls[0]?.[2]).toEqual({ count: 1 });
	});

	it('wraps a bare array (legacy shape) in the same envelope', async () => {
		mockRequest.mockResolvedValue([{ _id: 'cam_1', name: 'A' }]);
		const res = await Campaigns.list(ctx, {});
		expect(res.campaigns.map((c) => c._id)).toEqual(['cam_1']);
	});
});

describe('leads.get (LeadV2 variables)', () => {
	it('accepts non-string custom variable values', async () => {
		mockRequest.mockResolvedValue([
			{
				_id: 'lea_GzwJoYTChSccPx6d7',
				state: 'scanned',
				status: 'review',
				source: 'api',
				variables: {
					email: 'lead@example.com',
					employeeCount: 50,
					tags: ['a', 'b'],
				},
				contactId: 'ctc_i7bHAoKii75qFdbBh',
				enrichment: {},
				campaign: { id: 'cam_1', name: 'x', status: 'draft' },
				sendingUser: { email: '' },
			},
		]);

		const res = await Leads.get(ctx, {
			email: 'lead@example.com',
			version: 'v2',
		});
		expect(res[0]?.variables?.employeeCount).toBe(50);
	});

	it('rejects an empty id', () => {
		expect(LeadsGetInputSchema.safeParse({ id: '' }).success).toBe(false);
		expect(
			LeadsGetInputSchema.safeParse({ email: 'lead@example.com' }).success,
		).toBe(true);
	});
});

describe('leads.resume / leads.pause campaign scope', () => {
	it('forwards campaignId when resuming in one campaign', async () => {
		mockRequest.mockResolvedValue([{ _id: 'lea_1', isPaused: false }]);
		await Leads.resume(ctx, { leadId: 'lea_1', campaignId: 'cam_1' });
		expect(mockRequest.mock.calls[0]?.[0]).toBe('/leads/start/lea_1');
		expect(mockRequest.mock.calls[0]?.[2]?.query).toEqual({
			campaignId: 'cam_1',
		});
	});

	it('resumes in every campaign when campaignId is omitted', async () => {
		mockRequest.mockResolvedValue([{ _id: 'lea_1', isPaused: false }]);
		await Leads.resume(ctx, { leadId: 'lea_1' });
		expect(mockRequest.mock.calls[0]?.[2]?.query).toBeUndefined();
	});

	it('rejects a blank campaignId instead of pausing everywhere', () => {
		expect(
			LeadsPauseInputSchema.safeParse({ leadId: 'lea_1', campaignId: '' })
				.success,
		).toBe(false);
	});
});

describe('leads.createInCampaign custom variables', () => {
	it('accepts string custom variables and rejects other types', () => {
		const base = { campaignId: 'cam_1', email: 'lead@example.com' };
		expect(
			LeadsCreateInCampaignInputSchema.safeParse({
				...base,
				companySize: '50-100',
			}).success,
		).toBe(true);
		expect(
			LeadsCreateInCampaignInputSchema.safeParse({
				...base,
				companySize: { min: 50 },
			}).success,
		).toBe(false);
	});
});

describe('campaigns.updateSettings input', () => {
	it('needs a settings field with a value, keeping falsy values', () => {
		expect(
			CampaignsUpdateSettingsInputSchema.safeParse({
				campaignId: 'cam_1',
				tracking: undefined,
			}).success,
		).toBe(false);
		expect(
			CampaignsUpdateSettingsInputSchema.safeParse({
				campaignId: 'cam_1',
				tracking: { trackOpens: false },
			}).success,
		).toBe(true);
	});
});

describe('unsubscribes text replies (live: plain text under application/json)', () => {
	it('reads resubscribe and contact replies as text', async () => {
		mockRequest.mockResolvedValue('Variable subscribed');
		await expect(
			Unsubscribes.resubscribeVariable(ctx, { value: 'lead@example.com' }),
		).resolves.toBe('Variable subscribed');
		expect(mockRequest.mock.calls[0]?.[2]?.text).toBe(true);

		mockRequest.mockResolvedValue('Contact subscription updated');
		await expect(
			Unsubscribes.unsubscribeContact(ctx, { contactId: 'ctc_1' }),
		).resolves.toBe('Contact subscription updated');
		expect(mockRequest.mock.calls[1]?.[2]?.text).toBe(true);

		await expect(
			Unsubscribes.resubscribeContact(ctx, { contactId: 'ctc_1' }),
		).resolves.toBe('Contact subscription updated');
		expect(mockRequest.mock.calls[2]?.[2]?.text).toBe(true);
	});

	it('parses the JSON summary bulk unsubscribe returns live', async () => {
		mockRequest.mockResolvedValue({
			message: 'Variables unsubscribed',
			count: 1,
			values: ['lead@example.com'],
			skippedValues: [],
		});
		const res = await Unsubscribes.bulkUnsubscribeVariables(ctx, {
			values: ['lead@example.com'],
		});
		expect(res).toMatchObject({ count: 1, skippedValues: [] });
		expect(mockRequest.mock.calls[0]?.[2]?.text).toBe(true);
	});
});

describe('risk levels and key selection', () => {
	it('marks ops that email an address or can launch outreach as destructive', () => {
		expect(lemlistEndpointMeta['campaigns.setExportEmail'].riskLevel).toBe(
			'destructive',
		);
		expect(lemlistEndpointMeta['campaigns.addAbmLeads'].riskLevel).toBe(
			'destructive',
		);
	});

	it('falls back to the stored key when the inline key is blank', async () => {
		const { keyBuilder } = lemlist({ key: '   ' });
		if (!keyBuilder) throw new Error('lemlist has no keyBuilder');
		// `unknown` cast: the key builder only reads `keys`.
		const builderCtx = { keys: ctx.keys } as unknown as Parameters<
			NonNullable<typeof keyBuilder>
		>[0];
		await expect(keyBuilder(builderCtx, 'endpoint')).resolves.toBe(
			'stored_api_key',
		);
	});
});

describe('stats date ranges', () => {
	it('accepts ISO dates with a time zone offset (live: +02:00 answered 200)', () => {
		const range = {
			startDate: '2026-11-01T09:00:00+02:00',
			endDate: '2026-11-21T09:00:00+02:00',
		};
		expect(
			CampaignsGetStatsInputSchema.safeParse({ campaignId: 'cam_1', ...range })
				.success,
		).toBe(true);
		expect(
			CampaignsGetBatchStatsInputSchema.safeParse({
				campaignIds: ['cam_1'],
				...range,
			}).success,
		).toBe(true);
	});
});
