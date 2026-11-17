import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import type { ProoflyContext } from './context';
import {
	getNotificationData,
	listNotifications,
	setCampaignEnabled,
} from './endpoints/notifications';
import { proofly } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function ctx(): ProoflyContext {
	// unknown: the endpoints read only `key` from the context.
	return { key: 'pk-test' } as unknown as ProoflyContext;
}

function call(index: number) {
	const [config, options] = mockRequest.mock.calls[index] ?? [];
	return {
		key: (config?.HEADERS as Record<string, string>)['X-Api-Key'],
		method: options?.method,
		url: options?.url,
	};
}

// Bodies from the examples at https://proofly.io/developers.
const CAMPAIGNS = {
	ok: true,
	status: 200,
	data: [
		{
			id: 464014,
			name: 'Example',
			domain: { domain: 'example.com', subdomains: true },
			enabled: true,
			created: '1970-01-01 00:00:00',
		},
	],
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('notifications.list', () => {
	it('GETs /campaign/{id} and returns the notifications with stats', async () => {
		mockRequest.mockResolvedValueOnce({
			ok: true,
			status: 200,
			data: [
				{
					id: 745613007,
					name: 'Recent buyers',
					type: 'LATEST_CONVERSION',
					settings: { display: { position: 'bottom_center' } },
					stats: { impressions: 4136, hovers: 1822, clicks: 0, leads: 0 },
					enabled: true,
					created: '1970-01-01 00:00:00',
				},
			],
		});
		const result = await listNotifications(ctx(), { campaign_id: 464014 });
		expect(call(0)).toEqual({
			key: 'pk-test',
			method: 'GET',
			url: '/campaign/464014',
		});
		expect(result.data[0]).toMatchObject({
			id: 745613007,
			stats: { impressions: 4136 },
		});
	});

	it('turns an ok:false answer into an error', async () => {
		mockRequest.mockResolvedValueOnce({
			ok: false,
			error: 'Campaign not found',
		});
		await expect(listNotifications(ctx(), { campaign_id: 1 })).rejects.toThrow(
			'Campaign not found',
		);
	});

	it('rejects a non-numeric campaign id before sending', async () => {
		await expect(
			listNotifications(ctx(), { campaign_id: '../user' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('campaigns.setEnabled', () => {
	it('sends the PUT toggle when the state differs, then confirms and saves it', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValueOnce(CAMPAIGNS);
		mockRequest.mockResolvedValueOnce({
			ok: true,
			status: 200,
			data: 'Campaign successfully disabled',
		});
		mockRequest.mockResolvedValueOnce({
			...CAMPAIGNS,
			data: [{ ...CAMPAIGNS.data[0], enabled: false }],
		});
		const result = await setCampaignEnabled(
			// unknown: the endpoint reads only `key` and `db.campaigns`.
			{
				key: 'pk-test',
				db: { campaigns: { upsertByEntityId: upsert } },
			} as unknown as ProoflyContext,
			{ campaign_id: '464014', enabled: false },
		);
		expect(call(0)).toMatchObject({ method: 'GET', url: '/campaigns' });
		expect(call(1)).toMatchObject({ method: 'PUT', url: '/campaign/464014' });
		expect(call(2)).toMatchObject({ method: 'GET', url: '/campaigns' });
		expect(result).toEqual({
			campaign_id: '464014',
			enabled: false,
			changed: true,
			message: 'Campaign successfully disabled',
		});
		expect(upsert).toHaveBeenCalledWith(
			'464014',
			expect.objectContaining({ enabled: false }),
		);
	});

	it('changes nothing when the campaign state is missing', async () => {
		mockRequest.mockResolvedValueOnce({
			...CAMPAIGNS,
			data: [{ id: 464014, name: 'Example' }],
		});
		await expect(
			setCampaignEnabled(ctx(), { campaign_id: 464014, enabled: false }),
		).rejects.toThrow('nothing was changed');
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('fails when the PUT reply is not the documented success body', async () => {
		mockRequest.mockResolvedValueOnce(CAMPAIGNS);
		mockRequest.mockResolvedValueOnce('<html>oops</html>');
		await expect(
			setCampaignEnabled(ctx(), { campaign_id: 464014, enabled: false }),
		).rejects.toThrow();
	});

	it('reports a change made elsewhere at the same time', async () => {
		mockRequest.mockResolvedValueOnce(CAMPAIGNS);
		mockRequest.mockResolvedValueOnce({
			ok: true,
			status: 200,
			data: 'Campaign successfully disabled',
		});
		mockRequest.mockResolvedValueOnce(CAMPAIGNS);
		await expect(
			setCampaignEnabled(ctx(), { campaign_id: 464014, enabled: false }),
		).rejects.toThrow('changed elsewhere');
	});

	it('runs overlapping calls for one campaign one after the other', async () => {
		let state = true;
		const fake = async (
			_config: unknown,
			options: { method?: string },
		): Promise<unknown> => {
			if (options.method === 'PUT') {
				state = !state;
				return { ok: true, status: 200, data: 'toggled' };
			}
			return { ...CAMPAIGNS, data: [{ ...CAMPAIGNS.data[0], enabled: state }] };
		};
		// never: request() returns a CancelablePromise; a plain async fake
		// (unknown config and body) stands in for it.
		mockRequest.mockImplementation(fake as never);
		const [a, b] = await Promise.all([
			setCampaignEnabled(ctx(), { campaign_id: 464014, enabled: false }),
			setCampaignEnabled(ctx(), { campaign_id: 464014, enabled: false }),
		]);
		expect(state).toBe(false);
		expect([a.changed, b.changed].sort()).toEqual([false, true]);
	});

	it('sends nothing when the campaign already has that state', async () => {
		mockRequest.mockResolvedValueOnce(CAMPAIGNS);
		const result = await setCampaignEnabled(ctx(), {
			campaign_id: 464014,
			enabled: true,
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result).toEqual({
			campaign_id: '464014',
			enabled: true,
			changed: false,
		});
	});

	it('fails on an unknown campaign without toggling anything', async () => {
		mockRequest.mockResolvedValueOnce(CAMPAIGNS);
		await expect(
			setCampaignEnabled(ctx(), { campaign_id: 1, enabled: false }),
		).rejects.toThrow('not found');
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

describe('notifications.getData', () => {
	it('GETs /data/{id} and does not log what visitors entered', async () => {
		mockRequest.mockResolvedValueOnce({
			ok: true,
			status: 200,
			data: [
				{
					type: 'collector',
					data: { input: 'visitor@example.com' },
					ip: '46.101.129.76',
					url: 'https://example.com/',
					location: {
						city: 'Amsterdam',
						country_code: 'NL',
						country: 'The Netherlands',
					},
					date: '1970-01-01 00:00:00',
				},
			],
		});
		const result = await getNotificationData(ctx(), {
			notification_id: '745613007',
		});
		expect(call(0)).toMatchObject({ method: 'GET', url: '/data/745613007' });
		expect(result.data[0]?.location?.country_code).toBe('NL');
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('visitor@example.com');
		expect(logged).not.toContain('46.101.129.76');
	});
});

describe('risk levels', () => {
	it('marks the toggle write and the rest read', () => {
		const meta = proofly().endpointMeta ?? {};
		expect(meta['campaigns.setEnabled']?.riskLevel).toBe('write');
		expect(meta['notifications.list']?.riskLevel).toBe('read');
		expect(meta['notifications.getData']?.riskLevel).toBe('read');
	});
});
