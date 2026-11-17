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
	it('sends the PUT toggle when the state differs', async () => {
		mockRequest.mockResolvedValueOnce(CAMPAIGNS);
		mockRequest.mockResolvedValueOnce({
			ok: true,
			status: 200,
			data: 'Campaign successfully disabled',
		});
		const result = await setCampaignEnabled(ctx(), {
			campaign_id: '464014',
			enabled: false,
		});
		expect(call(0)).toMatchObject({ method: 'GET', url: '/campaigns' });
		expect(call(1)).toMatchObject({ method: 'PUT', url: '/campaign/464014' });
		expect(result).toEqual({
			campaign_id: '464014',
			enabled: false,
			changed: true,
			message: 'Campaign successfully disabled',
		});
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
