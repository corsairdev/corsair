import {
	DiscoverySearchInputSchema,
	ListItemsInputSchema,
	ListSchema,
	HypeAuditorEndpointOutputSchemas as Outputs,
	ReportOrPendingSchema,
	ReportResultSchema,
	ReportsByChannelInputSchema,
	ReportsInstagramInputSchema,
	ReportsYoutubeInputSchema,
	UnlockedReportsInputSchema,
} from './endpoints/types';

/** A report as the documented example returns one, trimmed to the envelope. */
const report = {
	result: {
		report_state: 'READY',
		user: {
			id: '123',
			username: 'nasa',
			full_name: 'NASA',
			is_private: false,
			is_verified: true,
			is_deleted: false,
			about: 'Exploring the universe.',
			photo_url: 'https://example.com/photo.jpg',
		},
		validUntil: 1796143953,
		restTokens: 9924,
	},
};

describe('report schemas', () => {
	it('parses the documented report envelope', () => {
		const parsed = ReportResultSchema.parse(report.result);
		expect(parsed.report_state).toBe('READY');
		expect(parsed.user?.username).toBe('nasa');
		expect(parsed.restTokens).toBe(9924);
	});

	it('keeps every metric the provider adds, rather than dropping it', () => {
		const parsed = ReportResultSchema.parse({
			...report.result,
			blogger_reach: { value: 1_000_000 },
			er: { value: 1.4 },
		});
		expect(parsed.blogger_reach).toEqual({ value: 1_000_000 });
		expect(parsed.er).toEqual({ value: 1.4 });
	});

	it('parses a pending answer carrying retryTtl', () => {
		const parsed = ReportOrPendingSchema.parse({
			result: { retryTtl: 30, restTokens: 10 },
		});
		expect(parsed.result).toBeDefined();
		expect('retryTtl' in parsed.result && parsed.result.retryTtl).toBe(30);
	});

	it('parses a report state other than READY, which the provider documents', () => {
		// A report can exist but lack demographic data, so the state is a string
		// rather than a fixed set.
		const parsed = ReportResultSchema.parse({
			...report.result,
			report_state: 'NO_DATA',
		});
		expect(parsed.report_state).toBe('NO_DATA');
	});

	it('refuses a report with no result envelope', () => {
		expect(ReportOrPendingSchema.safeParse({}).success).toBe(false);
	});

	it('allows a report whose user block is absent', () => {
		expect(
			ReportResultSchema.safeParse({ report_state: 'READY' }).success,
		).toBe(true);
	});
});

describe('report input rules', () => {
	it('accepts a username', () => {
		expect(
			ReportsInstagramInputSchema.parse({ username: 'nasa' }).username,
		).toBe('nasa');
	});

	it('accepts a user_id', () => {
		expect(ReportsInstagramInputSchema.parse({ user_id: '123' }).user_id).toBe(
			'123',
		);
	});

	it('refuses both identifiers, which would pick one silently', () => {
		expect(() =>
			ReportsInstagramInputSchema.parse({ username: 'nasa', user_id: '1' }),
		).toThrow(/exactly one/);
	});

	it('refuses neither identifier', () => {
		expect(() => ReportsInstagramInputSchema.parse({})).toThrow(/exactly one/);
	});

	it('refuses a report type the docs do not list', () => {
		expect(() =>
			ReportsYoutubeInputSchema.parse({ channel: 'NASA', type: 'full' }),
		).toThrow();
		expect(
			ReportsYoutubeInputSchema.parse({ channel: 'NASA', type: 'report' }).type,
		).toBe('report');
	});

	it('refuses a report type on Twitch, Twitter and Snapchat, which take none', () => {
		expect(() =>
			ReportsByChannelInputSchema.parse({ channel: 'nasa', type: 'report' }),
		).toThrow();
		expect(ReportsByChannelInputSchema.parse({ channel: 'nasa' })).toEqual({
			channel: 'nasa',
		});
	});
});

describe('discovery input rules', () => {
	it('accepts the five documented networks', () => {
		for (const network of [
			'instagram',
			'youtube',
			'tiktok',
			'twitter',
			'twitch',
		]) {
			expect(
				DiscoverySearchInputSchema.parse({ social_network: network })
					.social_network,
			).toBe(network);
		}
	});

	it('refuses snapchat, which discovery does not document', () => {
		expect(() =>
			DiscoverySearchInputSchema.parse({ social_network: 'snapchat' }),
		).toThrow();
	});

	it('bounds the page at 500, the documented maximum', () => {
		expect(
			DiscoverySearchInputSchema.parse({
				social_network: 'instagram',
				page: 500,
			}).page,
		).toBe(500);
		expect(() =>
			DiscoverySearchInputSchema.parse({
				social_network: 'instagram',
				page: 501,
			}),
		).toThrow();
		expect(() =>
			DiscoverySearchInputSchema.parse({
				social_network: 'instagram',
				page: 0,
			}),
		).toThrow();
	});

	it('passes documented filters through unchanged', () => {
		const filters = {
			search: ['nasa'],
			category: { include: [1, 2], exclude: [] },
			subscribers_count: { from: 1000, to: 100000 },
			sort: { field: 'subscribers_count', order: 'desc' },
		};
		expect(
			DiscoverySearchInputSchema.parse({
				social_network: 'instagram',
				filters,
			}).filters,
		).toEqual(filters);
	});
});

describe('lists', () => {
	it('parses the documented list object', () => {
		const parsed = ListSchema.parse({
			id: 0,
			name: 'Recent searches',
			count: 63,
			created: 1502009312,
			updated: 1602857408,
		});
		expect(parsed.id).toBe(0);
		expect(parsed.count).toBe(63);
	});

	it('parses a list collection', () => {
		const parsed = Outputs['lists.list'].parse({
			result: [{ id: 0, name: 'Recent searches' }],
		});
		expect(parsed.result).toHaveLength(1);
	});

	it('bounds the list page size at the documented 100', () => {
		expect(ListItemsInputSchema.parse({ id: 0, limit: 100 }).limit).toBe(100);
		expect(() => ListItemsInputSchema.parse({ id: 0, limit: 101 })).toThrow();
	});

	it('parses the documented boolean answers for the two list writes', () => {
		expect(Outputs['lists.add'].parse({ result: true }).result).toBe(true);
		expect(Outputs['lists.remove'].parse({ result: true }).result).toBe(true);
	});
});

describe('account activity', () => {
	it('parses an unlocked report with its refunded flag', () => {
		const parsed = Outputs['account.unlockedReports'].parse({
			result: [
				{
					report_id: 1,
					username: 'nasa',
					type: 'IG',
					unlocked_at: 1700000000,
					refunded: true,
				},
			],
		});
		expect(parsed.result).toEqual([
			{
				report_id: 1,
				username: 'nasa',
				type: 'IG',
				unlocked_at: 1700000000,
				refunded: true,
			},
		]);
	});

	it('accepts a date window on unlocked reports', () => {
		expect(
			UnlockedReportsInputSchema.parse({
				date_from: '2024-01-01',
				date_to: '2024-12-31',
			}),
		).toEqual({ date_from: '2024-01-01', date_to: '2024-12-31' });
	});
});
