import { BuiltWithEndpoints } from './endpoints';
import type { BuiltWithContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

// Safe: Row is only forwarded to the jest mock and compared with toEqual, never read by field.
// A narrower type is not practical because the stub serves eleven entity clients with different row shapes.
type Row = Record<string, unknown>;

function makeCtx() {
	const upserts = {
		domains: jest.fn(),
		domainTechnologies: jest.fn(),
		technologies: jest.fn(),
		domainCoverage: jest.fn(),
		listSites: jest.fn(),
		recommendations: jest.fn(),
		redirects: jest.fn(),
		companyFinancials: jest.fn(),
		socialLinks: jest.fn(),
		products: jest.fn(),
		mcpServers: jest.fn(),
	};
	const db = {
		domains: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.domains(id, data),
		},
		domainTechnologies: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.domainTechnologies(id, data),
		},
		technologies: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.technologies(id, data),
		},
		domainCoverage: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.domainCoverage(id, data),
		},
		listSites: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.listSites(id, data),
		},
		recommendations: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.recommendations(id, data),
		},
		redirects: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.redirects(id, data),
		},
		companyFinancials: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.companyFinancials(id, data),
		},
		socialLinks: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.socialLinks(id, data),
		},
		products: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.products(id, data),
		},
		mcpServers: {
			upsertByEntityId: async (id: string, data: Row) =>
				upserts.mcpServers(id, data),
		},
	};
	// Safe: the endpoints under test read only ctx.key and call upsertByEntityId on the entity clients, all provided by this stub.
	// A narrower type is not practical because the full context and entity clients need a real corsair instance and database.
	const ctx = Object.assign({ key: 'k' } as BuiltWithContext, { db });
	return { ctx, upserts };
}

function respondWith(body: object | string) {
	global.fetch = async () =>
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'text/json; charset=utf-8' },
		});
}

describe('BuiltWith entity persistence', () => {
	it('domainApiLookup upserts domains and domainTechnologies', async () => {
		respondWith({
			Results: [
				{
					Lookup: 'example.com',
					Result: {
						IsDB: 'True',
						Spend: 120,
						Paths: [
							{
								Domain: 'example.com',
								SubDomain: 'blog',
								Technologies: [
									{
										Name: 'WordPress',
										Id: 7,
										Tag: 'cms',
										Categories: ['Blog'],
										FirstDetected: 1300000000000,
										LastDetected: 1400000000000,
									},
								],
							},
						],
					},
					Meta: { CompanyName: 'Example Inc', Telephones: ['+1-555'] },
					Attributes: { Employees: 10 },
					FirstIndexed: '2012-07-29T14:00:00Z',
					LastIndexed: '2014-07-29T14:00:00Z',
				},
			],
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.domainApiLookup(ctx, { lookup: 'example.com' });

		expect(upserts.domains.mock.calls).toEqual([
			[
				'example.com',
				{
					id: 'example.com',
					lookup: 'example.com',
					isDb: 'True',
					spend: 120,
					salesRevenue: undefined,
					meta: { CompanyName: 'Example Inc', Telephones: ['+1-555'] },
					attributes: { Employees: 10 },
					firstIndexed: '2012-07-29T14:00:00Z',
					lastIndexed: '2014-07-29T14:00:00Z',
				},
			],
		]);
		expect(upserts.domainTechnologies.mock.calls).toEqual([
			[
				'example.com|blog|WordPress',
				{
					id: 'example.com|blog|WordPress',
					domain: 'example.com',
					subDomain: 'blog',
					name: 'WordPress',
					technologyId: 7,
					parent: undefined,
					description: undefined,
					link: undefined,
					confidence: undefined,
					isPremium: undefined,
					tag: 'cms',
					categories: ['Blog'],
					firstDetected: 1300000000000,
					lastDetected: 1400000000000,
				},
			],
		]);
	});

	it('datasetsLookup upserts a technology keyed by name', async () => {
		respondWith({
			Tech: {
				name: 'Shopify',
				tag: 'shop',
				is_premium: 'true',
				categories: ['Hosted Solution'],
				trends_link: '//trends.builtwith.com/shop/Shopify',
				coverage: { ten_k: 1, hundred_k: 2, milly: 3, live: 4, expired: 5 },
			},
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.datasetsLookup(ctx, { tech: 'Shopify' });

		expect(upserts.technologies.mock.calls).toEqual([
			[
				'Shopify',
				expect.objectContaining({
					id: 'Shopify',
					name: 'Shopify',
					isPremium: 'true',
					trendsLink: '//trends.builtwith.com/shop/Shopify',
					coverage: { tenK: 1, hundredK: 2, million: 3, live: 4, expired: 5 },
				}),
			],
		]);
	});

	it('freeApiLookup upserts domainCoverage', async () => {
		respondWith({
			domain: 'example.com',
			first: 10,
			last: 20,
			groups: [{ name: 'cms', live: 1, dead: 0, categories: [] }],
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.freeApiLookup(ctx, { lookup: 'example.com' });

		expect(upserts.domainCoverage.mock.calls).toEqual([
			[
				'example.com',
				{
					id: 'example.com',
					domain: 'example.com',
					first: 10,
					last: 20,
					groups: [{ name: 'cms', live: 1, dead: 0, categories: [] }],
				},
			],
		]);
	});

	it('listsApiGetList upserts listSites keyed by tech and domain', async () => {
		respondWith({
			NextOffset: 'END',
			Results: [
				{
					D: 'shop.example.com',
					LOS: ['shop.example.com'],
					FD: 1,
					LD: 2,
					S: 287,
					META: { CompanyName: 'Shop' },
				},
			],
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.listsApiGetList(ctx, {
			tech: 'Shopify',
			meta: true,
		});

		expect(upserts.listSites.mock.calls).toEqual([
			[
				'Shopify|shop.example.com',
				expect.objectContaining({
					id: 'Shopify|shop.example.com',
					tech: 'Shopify',
					domain: 'shop.example.com',
					locations: ['shop.example.com'],
					firstDetected: 1,
					lastDetected: 2,
					monthlySpend: 287,
					meta: { CompanyName: 'Shop' },
				}),
			],
		]);
	});

	it('mcpApiLookup upserts mcpServers keyed by domain', async () => {
		respondWith([
			{
				Domain: 'mcp.example.com',
				Category: 'Data',
				Description: 'Example',
				Endpoints: [
					{
						Endpoint: 'https://mcp.example.com/mcp',
						AuthRequired: false,
						Tools: [{ Name: 'search' }],
					},
				],
			},
		]);
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.mcpApiLookup(ctx, { search: 'example' });

		expect(upserts.mcpServers.mock.calls).toEqual([
			[
				'mcp.example.com',
				{
					id: 'mcp.example.com',
					domain: 'mcp.example.com',
					category: 'Data',
					description: 'Example',
					endpoints: [
						{
							Endpoint: 'https://mcp.example.com/mcp',
							AuthRequired: false,
							Tools: [{ Name: 'search' }],
						},
					],
				},
			],
		]);
	});

	it('productApiLookup upserts products keyed by shop and url', async () => {
		respondWith({
			shops: [
				{
					Domain: 'shop.com',
					Products: [
						{
							Title: 'Shoe',
							Url: 'shoe',
							Price: 12.5,
							Indexed: '2024-09-15T00:00:00',
						},
					],
				},
			],
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.productApiLookup(ctx, { query: 'shoe' });

		expect(upserts.products.mock.calls).toEqual([
			[
				'shop.com|shoe',
				{
					id: 'shop.com|shoe',
					shop: 'shop.com',
					title: 'Shoe',
					url: 'shoe',
					indexed: '2024-09-15T00:00:00',
					firstIndexed: undefined,
					price: 12.5,
				},
			],
		]);
	});

	it('recommendationsApiLookup upserts recommendations', async () => {
		respondWith({
			Recommendations: [
				{
					Domain: 'example.com',
					Compiled: '2026-01-13T13:52:29.335Z',
					Recommendations: [
						{
							name: 'Hotjar',
							link: 'https://hotjar.com',
							tag: 'analytics',
							categories: ['Heatmap'],
							stars: 3,
							match: 0.02,
						},
					],
				},
			],
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.recommendationsApiLookup(ctx, {
			lookup: 'example.com',
		});

		expect(upserts.recommendations.mock.calls).toEqual([
			[
				'example.com|Hotjar',
				{
					id: 'example.com|Hotjar',
					domain: 'example.com',
					compiled: '2026-01-13T13:52:29.335Z',
					name: 'Hotjar',
					link: 'https://hotjar.com',
					tag: 'analytics',
					categories: ['Heatmap'],
					stars: 3,
					match: 0.02,
				},
			],
		]);
	});

	it('redirectsApiLookup upserts inbound and outbound redirects', async () => {
		respondWith({
			Lookup: 'example.com',
			Inbound: [
				{
					Domain: 'old.com',
					FirstDetected: '2018-02-01',
					LastDetected: '2025-06-02',
				},
			],
			Outbound: [
				{
					Domain: 'new.com',
					FirstDetected: '2019-01-01',
					LastDetected: '2020-01-01',
				},
			],
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.redirectsApiLookup(ctx, { lookup: 'example.com' });

		expect(upserts.redirects.mock.calls).toEqual([
			[
				'example.com|inbound|old.com',
				{
					id: 'example.com|inbound|old.com',
					lookup: 'example.com',
					direction: 'inbound',
					domain: 'old.com',
					firstDetected: '2018-02-01',
					lastDetected: '2025-06-02',
				},
			],
			[
				'example.com|outbound|new.com',
				{
					id: 'example.com|outbound|new.com',
					lookup: 'example.com',
					direction: 'outbound',
					domain: 'new.com',
					firstDetected: '2019-01-01',
					lastDetected: '2020-01-01',
				},
			],
		]);
	});

	it('financialApiLookup upserts companyFinancials', async () => {
		respondWith({
			domain: 'robinhood.com',
			companyName: 'Robinhood Markets, Inc.',
			employees: 1281,
			followers: 394388,
			products: 0,
			spend: 7463.82,
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.financialApiLookup(ctx, {
			lookup: 'robinhood.com',
		});

		expect(upserts.companyFinancials.mock.calls).toEqual([
			[
				'robinhood.com',
				{
					id: 'robinhood.com',
					domain: 'robinhood.com',
					companyName: 'Robinhood Markets, Inc.',
					employees: 1281,
					followers: 394388,
					products: 0,
					spend: 7463.82,
				},
			],
		]);
	});

	it('socialApiLookup upserts socialLinks', async () => {
		respondWith({
			Socials: [
				{
					Name: 'overstock',
					Results: [
						{
							SocialUrl: 'https://instagram.com/overstock',
							Domains: [{ Root: 'overstock.com', BuiltWithRank: 769 }],
						},
					],
				},
			],
		});
		const { ctx, upserts } = makeCtx();
		await BuiltWithEndpoints.socialApiLookup(ctx, { lookup: 'overstock' });

		expect(upserts.socialLinks.mock.calls).toEqual([
			[
				'https://instagram.com/overstock|overstock.com',
				{
					id: 'https://instagram.com/overstock|overstock.com',
					socialUrl: 'https://instagram.com/overstock',
					root: 'overstock.com',
					builtWithRank: 769,
				},
			],
		]);
	});

	it('still returns the response when a database write fails', async () => {
		respondWith({ domain: 'example.com', first: 1, last: 2, groups: [] });
		const { ctx, upserts } = makeCtx();
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		upserts.domainCoverage.mockRejectedValue(new Error('db down'));

		await expect(
			BuiltWithEndpoints.freeApiLookup(ctx, { lookup: 'example.com' }),
		).resolves.toMatchObject({ domain: 'example.com' });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});
