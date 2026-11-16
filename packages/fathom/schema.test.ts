import { ZodError } from 'zod';
import {
	AccountSchema,
	AggregationFilterSchema,
	AggregationsResponseSchema,
	CurrentVisitorsResponseSchema,
	DateGroupingEnum,
	DeprecatedEventResponseSchema,
	EventDeleteResponseSchema,
	EventItemSchema,
	EventListResponseSchema,
	EventSetCurrencyResponseSchema,
	FathomEndpointInputSchemas,
	FathomEndpointOutputSchemas,
	MilestoneDeleteResponseSchema,
	MilestoneListResponseSchema,
	MilestoneSchema,
	SiteDeleteResponseSchema,
	SiteListResponseSchema,
	SiteSchema,
	SiteWipeResponseSchema,
	TokenSchema,
} from './endpoints/types';

describe('Fathom schemas', () => {
	describe('Account schemas', () => {
		it('validates a valid Account', () => {
			const valid = {
				id: 500302232,
				object: 'account',
				name: 'Homer Simpson',
				email: 'homer@example.com',
			};
			expect(AccountSchema.parse(valid)).toEqual(valid);
		});

		it('validates account with string id', () => {
			const valid = {
				id: 'acc_12345',
				object: 'account',
				name: 'Homer Simpson',
				email: 'homer@example.com',
			};
			expect(AccountSchema.parse(valid)).toEqual(valid);
		});

		it('rejects account with missing name or invalid object', () => {
			expect(() =>
				AccountSchema.parse({
					id: 123,
					object: 'user',
					name: 'Test',
					email: 'test@example.com',
				}),
			).toThrow(ZodError);
		});

		it('validates TokenSchema', () => {
			const valid = {
				name: 'Production server',
				version: 4,
				abilities: ['*'],
				last_used_at: '2024-01-15 09:24:00',
				expires_at: null,
				created_at: '2024-01-01 12:00:00',
				updated_at: '2024-01-15 09:24:00',
			};
			expect(TokenSchema.parse(valid)).toEqual(valid);
		});

		it('rejects invalid TokenSchema', () => {
			expect(() =>
				TokenSchema.parse({
					name: 'Prod',
					version: 'not-a-number',
					abilities: ['*'],
				}),
			).toThrow(ZodError);
		});
	});

	describe('Site schemas', () => {
		it('validates SiteSchema', () => {
			const valid = {
				id: 'CDBUGS',
				object: 'site',
				name: 'Bugs Bunny Portfolio',
				sharing: 'none',
				created_at: '2020-07-27 12:01:01',
				timezone: 'America/New_York',
			};
			expect(SiteSchema.parse(valid)).toEqual(valid);
		});

		it('accepts a sharing value the spec does not list yet', () => {
			expect(
				SiteSchema.parse({
					id: 'CDBUGS',
					object: 'site',
					name: 'Bugs Bunny Portfolio',
					sharing: 'all',
					created_at: '2020-07-27 12:01:01',
					timezone: 'America/New_York',
				}).sharing,
			).toBe('all');
		});

		it('validates SiteListResponseSchema', () => {
			const valid = {
				object: 'list',
				url: '/v1/sites',
				has_more: false,
				data: [
					{
						id: 'CDBUGS',
						object: 'site',
						name: 'Bugs Bunny Portfolio',
						sharing: 'none',
						created_at: '2020-07-27 12:01:01',
						timezone: 'America/New_York',
					},
				],
			};
			expect(SiteListResponseSchema.parse(valid)).toEqual(valid);
		});

		it('validates SiteDeleteResponseSchema and SiteWipeResponseSchema', () => {
			const del = { id: 'CDBUGS', object: 'site', deleted: true };
			expect(SiteDeleteResponseSchema.parse(del)).toEqual(del);

			const wipe = { id: 'CDBUGS', deleted: true, message: 'Retired' };
			expect(SiteWipeResponseSchema.parse(wipe)).toEqual(wipe);
		});

		it('validates sites.create input boundaries and defaults', () => {
			const input = {
				name: 'My Site',
				sharing: 'private' as const,
				share_password: 'secret-password',
				multi_domain: true,
				multi_domain_option: 'combined' as const,
			};
			expect(FathomEndpointInputSchemas['sites.create'].parse(input)).toEqual(
				input,
			);

			// rejects missing name
			expect(() =>
				FathomEndpointInputSchemas['sites.create'].parse({}),
			).toThrow(ZodError);

			// rejects empty name
			expect(() =>
				FathomEndpointInputSchemas['sites.create'].parse({ name: '' }),
			).toThrow(ZodError);
		});

		it('validates sites.list input bounds (limit 1 to 100)', () => {
			expect(
				FathomEndpointInputSchemas['sites.list'].parse({ limit: 50 }),
			).toEqual({ limit: 50 });

			expect(() =>
				FathomEndpointInputSchemas['sites.list'].parse({ limit: 0 }),
			).toThrow(ZodError);

			expect(() =>
				FathomEndpointInputSchemas['sites.list'].parse({ limit: 101 }),
			).toThrow(ZodError);
		});
	});

	describe('Event schemas', () => {
		it('validates EventItemSchema with nullable currency and created_at', () => {
			const item = {
				id: 'IJKLMNOP',
				object: 'event',
				name: 'Purchased product',
				currency: 'pound',
				created_at: '2020-08-21 15:24:00',
			};
			expect(EventItemSchema.parse(item)).toEqual(item);

			const itemNull = {
				id: 'ABCDEFGH',
				object: 'event',
				name: 'Newsletter sign up',
				currency: null,
				created_at: null,
			};
			expect(EventItemSchema.parse(itemNull)).toEqual(itemNull);
		});

		it('validates EventListResponseSchema', () => {
			const list = {
				object: 'list',
				url: '/v1/sites/CDBUGS/events',
				has_more: false,
				data: [
					{
						id: 'IJKLMNOP',
						object: 'event',
						name: 'Purchased',
						currency: null,
						created_at: null,
					},
				],
			};
			expect(EventListResponseSchema.parse(list)).toEqual(list);
		});

		it('validates EventSetCurrencyResponseSchema and EventDeleteResponseSchema', () => {
			const setCur = {
				object: 'event',
				name: 'Purchase early access',
				currency: 'pound',
				updated: true,
			};
			expect(EventSetCurrencyResponseSchema.parse(setCur)).toEqual(setCur);

			const del = {
				object: 'event',
				name: 'Purchase early access',
				deleted: true,
			};
			expect(EventDeleteResponseSchema.parse(del)).toEqual(del);
		});

		it('validates DeprecatedEventResponseSchema', () => {
			const dep = {
				id: 'EV_1',
				object: 'event',
				name: 'Old event',
				deleted: true,
			};
			expect(DeprecatedEventResponseSchema.parse(dep)).toEqual(dep);
		});

		it('validates events.setCurrency input schema and currency enum', () => {
			const valid = {
				site_id: 'CDBUGS',
				name: 'Signup',
				currency: 'euro' as const,
			};
			expect(
				FathomEndpointInputSchemas['events.setCurrency'].parse(valid),
			).toEqual(valid);

			expect(() =>
				FathomEndpointInputSchemas['events.setCurrency'].parse({
					site_id: 'CDBUGS',
					name: 'Signup',
					currency: 'bitcoin',
				}),
			).toThrow(ZodError);
		});

		it('validates events.deleteByName input schema', () => {
			const valid = { site_id: 'CDBUGS', name: 'Purchase' };
			expect(
				FathomEndpointInputSchemas['events.deleteByName'].parse(valid),
			).toEqual(valid);

			expect(() =>
				FathomEndpointInputSchemas['events.deleteByName'].parse({
					site_id: 'CDBUGS',
				}),
			).toThrow(ZodError);
		});
	});

	describe('Milestone schemas', () => {
		it('validates MilestoneSchema and MilestoneListResponseSchema', () => {
			const m = {
				id: 'ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
				object: 'milestone',
				name: 'Website Redesign',
				milestone_date: '2024-01-15 00:00:00',
				created_at: '2024-01-10 12:00:00',
				updated_at: '2024-01-10 12:00:00',
			};
			expect(MilestoneSchema.parse(m)).toEqual(m);

			const list = {
				object: 'list',
				url: '/api/v1/CDBUGS/milestones',
				has_more: false,
				data: [m],
			};
			expect(MilestoneListResponseSchema.parse(list)).toEqual(list);

			const del = {
				id: 'ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
				object: 'milestone',
				deleted: true,
			};
			expect(MilestoneDeleteResponseSchema.parse(del)).toEqual(del);
		});

		it('validates milestones.create input and enforces YYYY-MM-DD date regex', () => {
			const valid = {
				site_id: 'CDBUGS',
				name: 'Launch',
				milestone_date: '2024-01-15',
			};
			expect(
				FathomEndpointInputSchemas['milestones.create'].parse(valid),
			).toEqual(valid);

			// Rejects invalid date format
			expect(() =>
				FathomEndpointInputSchemas['milestones.create'].parse({
					site_id: 'CDBUGS',
					name: 'Launch',
					milestone_date: '01/15/2024',
				}),
			).toThrow(ZodError);

			// Rejects name exceeding 30 characters
			expect(() =>
				FathomEndpointInputSchemas['milestones.create'].parse({
					site_id: 'CDBUGS',
					name: 'This is a milestone name that exceeds thirty characters in length',
					milestone_date: '2024-01-15',
				}),
			).toThrow(ZodError);
		});
	});

	describe('Reports schemas', () => {
		it('validates AggregationFilterSchema', () => {
			const filter = {
				property: 'pathname',
				operator: 'is' as const,
				value: '/about',
			};
			expect(AggregationFilterSchema.parse(filter)).toEqual(filter);

			expect(() =>
				AggregationFilterSchema.parse({
					property: 'pathname',
					operator: 'invalid-op',
					value: '/about',
				}),
			).toThrow(ZodError);
		});

		it('validates AggregationsResponseSchema', () => {
			const rows = [
				{
					browser: 'Chrome',
					device_type: 'Desktop',
					pageviews: '30000',
					avg_duration: '45.2',
					bounce_rate: '0.35',
				},
				{
					browser: 'Firefox',
					device_type: 'Mobile',
					pageviews: '12000',
					conversions: 5,
				},
			];
			expect(AggregationsResponseSchema.parse(rows)).toEqual(rows);
		});

		it('validates reports.aggregation input schema and limits', () => {
			const input = {
				entity: 'pageview' as const,
				entity_id: 'CDBUGS',
				aggregates: 'pageviews,visits,uniques',
				date_grouping: 'day' as const,
				field_grouping: 'browser,device_type',
				limit: 500,
				filters: [
					{
						property: 'country_code',
						operator: 'is' as const,
						value: 'US',
					},
				],
			};
			expect(
				FathomEndpointInputSchemas['reports.aggregation'].parse(input),
			).toEqual(input);

			// Limit over 1000 is rejected
			expect(() =>
				FathomEndpointInputSchemas['reports.aggregation'].parse({
					entity: 'pageview',
					aggregates: 'pageviews',
					limit: 1001,
				}),
			).toThrow(ZodError);
		});

		it('validates DateGroupingEnum', () => {
			expect(DateGroupingEnum.parse('hour')).toBe('hour');
			expect(DateGroupingEnum.parse('day')).toBe('day');
			expect(DateGroupingEnum.parse('month')).toBe('month');
			expect(DateGroupingEnum.parse('year')).toBe('year');
			expect(() => DateGroupingEnum.parse('week')).toThrow(ZodError);
		});

		it('validates CurrentVisitorsResponseSchema for simple and detailed outputs', () => {
			const simple = { total: 14 };
			expect(CurrentVisitorsResponseSchema.parse(simple)).toEqual(simple);

			const detailed = {
				total: 144,
				content: [
					{
						hostname: 'example.com',
						pathname: '/home',
						total: 100,
					},
				],
				referrers: [
					{
						referrer_hostname: 'google.com',
						referrer_pathname: '/',
						total: 44,
					},
				],
			};
			expect(CurrentVisitorsResponseSchema.parse(detailed)).toEqual(detailed);
		});

		it('validates reports.currentVisitors input schema', () => {
			expect(
				FathomEndpointInputSchemas['reports.currentVisitors'].parse({
					site_id: 'CDBUGS',
					detailed: true,
				}),
			).toEqual({ site_id: 'CDBUGS', detailed: true });

			expect(() =>
				FathomEndpointInputSchemas['reports.currentVisitors'].parse({}),
			).toThrow(ZodError);
		});
	});

	describe('Registry consistency', () => {
		it('registers matching input and output schemas for all 23 operations', () => {
			const inputKeys = Object.keys(FathomEndpointInputSchemas).sort();
			const outputKeys = Object.keys(FathomEndpointOutputSchemas).sort();
			expect(inputKeys).toEqual(outputKeys);
			expect(inputKeys.length).toBe(23);
		});
	});
});
