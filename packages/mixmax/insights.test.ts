import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const REPORT = {
	_id: 'report-1',
	userId: 'user-1',
	title: 'Sent in the last 30 days',
	type: 'messages',
	query: 'sent:last30days from:me',
	fields: ['sent', 'opened'],
	createdAt: '2026-10-14T18:10:15.414Z',
	updatedAt: '2026-10-14T18:10:15.414Z',
};

const DATA_TABLE = {
	buckets: [
		{
			subject: 'Quick question',
			opens: 1,
			clicks: 0,
			delivered: 1,
			fromEmail: 'sender@example.com',
			recipientEmails: ['ada@example.com'],
		},
	],
	totals: {
		sent: 1,
		delivered: 1,
		opened: 1,
		earliest: 1792008516000,
		latest: 1792008516000,
	},
	extra: {
		total: 1,
		hasNext: false,
		interval: 'day',
		trend: null,
		dateRange: {
			lower: 1789790400000,
			upper: 1792468799000,
			trend: 1787198400000,
		},
	},
};

describe('Mixmax insights endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('insightsReports.list sends GET /v1/insightsreports with documented query params', async () => {
		const page = { results: [REPORT], hasNext: false };
		request.mockResolvedValue(page);
		const result = await endpoints.insightsReports.list(ctx, {
			limit: 50,
			accessThrough: 'myself,shared',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/insightsreports', {
			method: 'GET',
			query: {
				limit: 50,
				accessThrough: 'myself,shared',
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('insightsReports.create posts the documented body', async () => {
		request.mockResolvedValue(REPORT);
		const body = {
			title: 'Sent in the last 30 days',
			type: 'messages' as const,
			query: 'sent:last30days from:me',
		};
		const result = await endpoints.insightsReports.create(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/insightsreports', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(REPORT);
	});

	it('insightsReports.update patches /v1/insightsreports/:id without the id in the body', async () => {
		const updated = { ...REPORT, title: 'Sent this quarter' };
		request.mockResolvedValue(updated);
		const result = await endpoints.insightsReports.update(ctx, {
			id: 'report-1',
			title: 'Sent this quarter',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/insightsreports/report-1', {
			method: 'PATCH',
			body: {
				title: 'Sent this quarter',
			},
		});
		expect(result).toEqual(updated);
	});

	it('insightsReports.delete sends DELETE /v1/insightsreports/:id', async () => {
		const result = await endpoints.insightsReports.delete(ctx, {
			id: 'report-1',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/insightsreports/report-1', {
			method: 'DELETE',
		});
		// 204 with no body.
		expect(result).toBeUndefined();
	});

	it('reports.runDataTable posts /v1/reports/data/table with the documented body', async () => {
		request.mockResolvedValue(DATA_TABLE);
		const body = {
			type: 'messages',
			groupBy: 'message',
			query: 'sent:last30days from:everyone',
			fields: 'delivered,opened',
			limit: 50,
			offset: 0,
			sortBy: 'sent',
			sortDesc: true,
			timezone: 'America/New_York',
		};
		const result = await endpoints.reports.runDataTable(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/reports/data/table', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(DATA_TABLE);
	});

	it('rejects missing ids before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.insightsReports.update(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.insightsReports.delete(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects unsafe report ids before any request', async () => {
		await expect(
			endpoints.insightsReports.delete(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).not.toHaveBeenCalled();
	});
});
