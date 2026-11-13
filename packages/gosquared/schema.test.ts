import {
	GosquaredEndpointInputSchemas,
	GosquaredEndpointOutputSchemas,
	SiteSchema,
} from './endpoints/types';
import {
	gosquared,
	gosquaredEndpointMeta,
	gosquaredEndpointSchemas,
} from './index';
import { GosquaredSchema } from './schema';

describe('Gosquared schema tests', () => {
	it('exports valid database and plugin schema', () => {
		expect(GosquaredSchema.version).toBe('1.0.0');
		expect(GosquaredSchema.entities).toEqual({});
	});

	it('ensures endpoint schemas and endpoint metadata match exactly', () => {
		const schemaKeys = Object.keys(gosquaredEndpointSchemas).sort();
		const metaKeys = Object.keys(gosquaredEndpointMeta).sort();
		expect(schemaKeys).toEqual(metaKeys);
		expect(schemaKeys.length).toBe(47);
	});

	it('ensures plugin instance contains all nested endpoint groups', () => {
		const plugin = gosquared();
		const groups = Object.keys(plugin.endpoints ?? {}).sort();
		expect(groups).toEqual([
			'account',
			'auth',
			'chat',
			'now',
			'people',
			'tracking',
			'trends',
		]);
	});

	describe('Account schemas', () => {
		it('validates SiteSchema', () => {
			const validSite = {
				site_token: 'GSN-123456-X',
				name: 'Test Site',
				domain_name: 'test.example.com',
				timezone: 'UTC',
				created: '2026-01-01T00:00:00Z',
			};
			const parsed = SiteSchema.parse(validSite);
			expect(parsed.site_token).toBe('GSN-123456-X');

			// `unknown` because Zod throws unknown error on invalid type.
			expect(() => SiteSchema.parse({ name: 123 })).toThrow();
		});

		it('validates account.getSites input and output schemas', () => {
			expect(
				GosquaredEndpointInputSchemas['account.getSites'].parse({
					presenter: 'flat',
				}),
			).toEqual({ presenter: 'flat' });
			expect(
				GosquaredEndpointInputSchemas['account.getSites'].parse({}),
			).toEqual({});
			// `unknown` because invalid input rejection throws an untyped error.
			expect(() =>
				GosquaredEndpointInputSchemas['account.getSites'].parse({
					presenter: 'invalid',
				}),
			).toThrow();

			const listOutput = [{ site_token: 'GSN-111' }];
			expect(
				GosquaredEndpointOutputSchemas['account.getSites'].parse(listOutput),
			).toEqual(listOutput);

			const groupedOutput = {
				owned: [{ site_token: 'GSN-111' }],
			};
			expect(
				GosquaredEndpointOutputSchemas['account.getSites'].parse(groupedOutput),
			).toEqual(groupedOutput);
		});

		it('validates account.createSite input and output schemas', () => {
			const input = { domain_name: 'site.example.com', name: 'My Site' };
			expect(
				GosquaredEndpointInputSchemas['account.createSite'].parse(input),
			).toEqual(input);
			// `unknown` because empty domain throws Zod validation error.
			expect(() =>
				GosquaredEndpointInputSchemas['account.createSite'].parse({
					domain_name: '',
				}),
			).toThrow();

			const output = { site_token: 'GSN-999', domain_name: 'site.example.com' };
			expect(
				GosquaredEndpointOutputSchemas['account.createSite'].parse(output),
			).toEqual(output);
		});

		it('validates account.getSite input and output schemas', () => {
			const input = { site_token: 'GSN-123' };
			expect(
				GosquaredEndpointInputSchemas['account.getSite'].parse(input),
			).toEqual(input);
			// `unknown` because empty site_token throws.
			expect(() =>
				GosquaredEndpointInputSchemas['account.getSite'].parse({
					site_token: '',
				}),
			).toThrow();
		});

		it('validates account.getSharedUsers input and output schemas', () => {
			expect(
				GosquaredEndpointInputSchemas['account.getSharedUsers'].parse({}),
			).toEqual({});
			const output = [
				{ email: 'user@example.com', role: 'admin', status: 'active' },
			];
			expect(
				GosquaredEndpointOutputSchemas['account.getSharedUsers'].parse(output),
			).toEqual(output);
		});

		it('validates account.getBlocked input and output schemas', () => {
			expect(
				GosquaredEndpointInputSchemas['account.getBlocked'].parse({
					presenter: 'plain',
				}),
			).toEqual({ presenter: 'plain' });
			const plainOutput = ['1.2.3.4'];
			expect(
				GosquaredEndpointOutputSchemas['account.getBlocked'].parse(plainOutput),
			).toEqual(plainOutput);
		});
	});

	describe('Now schemas', () => {
		it('validates now.getOverview input and output schemas', () => {
			expect(
				GosquaredEndpointInputSchemas['now.getOverview'].parse({
					minimal: true,
				}),
			).toEqual({ minimal: true });

			const output = {
				visitors: 42,
				pages: 5,
				pageviews: 120,
			};
			expect(
				GosquaredEndpointOutputSchemas['now.getOverview'].parse(output),
			).toEqual(output);
		});

		it('validates now.getConcurrents input and output schemas', () => {
			expect(
				GosquaredEndpointInputSchemas['now.getConcurrents'].parse({}),
			).toEqual({});
			const output = { concurrents: 15, online: 15 };
			expect(
				GosquaredEndpointOutputSchemas['now.getConcurrents'].parse(output),
			).toEqual(output);
		});

		it('validates now query with limit', () => {
			expect(
				GosquaredEndpointInputSchemas['now.getPages'].parse({
					limit: 10,
				}),
			).toEqual({ limit: 10 });
			expect(
				GosquaredEndpointInputSchemas['now.getPages'].parse({
					limit: '0,10',
				}),
			).toEqual({ limit: '0,10' });
		});
	});

	describe('Trends schemas', () => {
		it('validates trends input schema requirements and optional filters', () => {
			const valid = {
				from: '2026-01-01',
				to: '2026-01-31',
				interval: 'day' as const,
				limit: 20,
				format: 'json' as const,
			};
			expect(
				GosquaredEndpointInputSchemas['trends.getAggregate'].parse(valid),
			).toEqual(valid);

			// `unknown` because missing required from/to dates throws.
			expect(() =>
				GosquaredEndpointInputSchemas['trends.getAggregate'].parse({
					from: '2026-01-01',
				}),
			).toThrow();
		});

		it('validates trends output parsing for records and arrays', () => {
			const record = { total: 100, pageviews: 250 };
			expect(
				GosquaredEndpointOutputSchemas['trends.getAggregate'].parse(record),
			).toEqual(record);

			const list = [{ date: '2026-01-01', visits: 10 }];
			expect(
				GosquaredEndpointOutputSchemas['trends.getBrowser'].parse(list),
			).toEqual(list);
		});
	});

	describe('People schemas', () => {
		it('validates people.getPeople input with sort and order', () => {
			const input = {
				sort: 'created_at',
				order: 'desc' as const,
				limit: 50,
			};
			expect(
				GosquaredEndpointInputSchemas['people.getPeople'].parse(input),
			).toEqual(input);
		});

		it('validates people.getPerson requires person_id', () => {
			expect(
				GosquaredEndpointInputSchemas['people.getPerson'].parse({
					person_id: 'person_123',
				}),
			).toEqual({ person_id: 'person_123' });

			// `unknown` because empty string throws.
			expect(() =>
				GosquaredEndpointInputSchemas['people.getPerson'].parse({
					person_id: '',
				}),
			).toThrow();
		});

		it('validates people.getDevice requires device_id', () => {
			expect(
				GosquaredEndpointInputSchemas['people.getDevice'].parse({
					device_id: 'dev_abc',
				}),
			).toEqual({ device_id: 'dev_abc' });
		});
	});

	describe('Tracking schemas', () => {
		it('validates tracking.trackEvent input', () => {
			const valid = {
				event: {
					name: 'Signed Up',
					data: { plan: 'pro' },
				},
				person_id: 'person_1',
			};
			expect(
				GosquaredEndpointInputSchemas['tracking.trackEvent'].parse(valid),
			).toEqual(valid);

			// `unknown` because empty event name throws.
			expect(() =>
				GosquaredEndpointInputSchemas['tracking.trackEvent'].parse({
					event: { name: '' },
				}),
			).toThrow();
		});

		it('validates tracking.identify input', () => {
			const valid = {
				person_id: 'person_1',
				properties: {
					email: 'test@example.com',
					first_name: 'Test',
					company: { name: 'Acme' },
				},
			};
			expect(
				GosquaredEndpointInputSchemas['tracking.identify'].parse(valid),
			).toEqual(valid);
		});

		it('validates tracking.trackTransaction input', () => {
			const valid = {
				transaction: {
					id: 'order_123',
					revenue: 99.99,
					quantity: 1,
					items: [{ name: 'Widget', price: 99.99 }],
				},
			};
			expect(
				GosquaredEndpointInputSchemas['tracking.trackTransaction'].parse(valid),
			).toEqual(valid);
		});

		it('validates tracking.trackPageview input', () => {
			const valid = {
				page: {
					url: 'https://example.com/pricing',
					title: 'Pricing Page',
				},
			};
			expect(
				GosquaredEndpointInputSchemas['tracking.trackPageview'].parse(valid),
			).toEqual(valid);
		});
	});

	describe('Chat schemas', () => {
		it('validates chat.sendMessage requires content and chat_id', () => {
			const valid = {
				chat_id: 'chat_123',
				content: 'Hello there!',
				from: 'agent' as const,
			};
			expect(
				GosquaredEndpointInputSchemas['chat.sendMessage'].parse(valid),
			).toEqual(valid);

			// `unknown` because missing content throws.
			expect(() =>
				GosquaredEndpointInputSchemas['chat.sendMessage'].parse({
					chat_id: 'chat_123',
					content: '',
				}),
			).toThrow();
		});

		it('validates chat.archiveChat requires chat_id', () => {
			expect(
				GosquaredEndpointInputSchemas['chat.archiveChat'].parse({
					chat_id: 'chat_123',
				}),
			).toEqual({ chat_id: 'chat_123' });
		});
	});

	describe('Auth schemas', () => {
		it('validates auth.getTokenInfo input and output schemas', () => {
			expect(
				GosquaredEndpointInputSchemas['auth.getTokenInfo'].parse({}),
			).toEqual({});

			const output = {
				scopes: ['read_account', 'write_tracking'],
				user_id: 1234,
				site_token: 'GSN-987',
			};
			expect(
				GosquaredEndpointOutputSchemas['auth.getTokenInfo'].parse(output),
			).toEqual(output);
		});
	});
});
