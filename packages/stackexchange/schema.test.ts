import { ROUTE_GROUPS } from './endpoints/routes';
import {
	NetworkReadInputSchema,
	SiteReadInputSchema,
	SiteWriteInputSchema,
	StackExchangeResponseSchema,
} from './endpoints/types';

describe('Stack Exchange API schemas', () => {
	it('accepts a site read with common paging parameters', () => {
		expect(
			SiteReadInputSchema.parse({
				route: 'questions',
				site: 'stackoverflow',
				parameters: { page: 2, pagesize: 50, sort: 'activity', order: 'desc' },
			}),
		).toMatchObject({ route: 'questions', site: 'stackoverflow' });
	});

	it('accepts the three documented API operation categories', () => {
		expect(
			SiteWriteInputSchema.parse({
				route: 'create-question',
				site: 'stackoverflow',
			}).route,
		).toBe('create-question');
		expect(NetworkReadInputSchema.parse({ route: 'sites' }).route).toBe(
			'sites',
		);
		expect(
			NetworkReadInputSchema.parse({ route: 'create-filter', method: 'POST' })
				.route,
		).toBe('create-filter');
	});

	it('rejects undocumented routes and extra top-level properties', () => {
		expect(
			SiteReadInputSchema.safeParse({ route: 'made-up', site: 'stackoverflow' })
				.success,
		).toBe(false);
		expect(
			SiteReadInputSchema.safeParse({
				route: 'questions',
				site: 'stackoverflow',
				callback: 'alert(1)',
			}).success,
		).toBe(false);
	});

	it('rejects credential query parameters and JSONP callbacks', () => {
		for (const name of ['key', 'access_token', 'callback']) {
			expect(
				NetworkReadInputSchema.safeParse({
					route: 'sites',
					parameters: { [name]: 'not-allowed' },
				}).success,
			).toBe(false);
		}
	});

	it('validates common paging bounds, sort order direction and parameter names', () => {
		for (const parameters of [
			{ pagesize: 101 },
			{ page: 0 },
			{ order: 'sideways' },
			{ undocumented: true },
		]) {
			expect(
				NetworkReadInputSchema.safeParse({ route: 'sites', parameters })
					.success,
			).toBe(false);
		}
	});

	it('validates common wrapper pagination and quota fields strictly', () => {
		const response = {
			items: [{ question_id: 17, title: 'Question', tags: ['api'] }],
			has_more: true,
			backoff: 3,
			page: 1,
			page_size: 30,
			quota_max: 10000,
			quota_remaining: 9999,
			type: 'question',
		};
		expect(StackExchangeResponseSchema.parse(response)).toEqual(response);
		expect(
			StackExchangeResponseSchema.safeParse({ ...response, unexpected: true })
				.success,
		).toBe(false);
		expect(
			StackExchangeResponseSchema.safeParse({ ...response, has_more: 'yes' })
				.success,
		).toBe(false);
	});

	it('keeps route maps and documented method source links populated', () => {
		for (const routes of Object.values(ROUTE_GROUPS)) {
			expect(routes.length).toBeGreaterThan(0);
			for (const route of routes) {
				expect(route.path).not.toMatch(/^https?:\/\//);
				expect(route.docs).toMatch(
					/^https:\/\/api\.stackexchange\.com\/docs\//,
				);
			}
		}
	});

	it('records method-specific OAuth scope groups and filter method alternatives', () => {
		const routes = Object.values(ROUTE_GROUPS).flat();
		const inbox = routes.find((route) => route.id === 'user-inbox');
		const privateHistory = routes.find(
			(route) => route.id === 'full-reputation-history',
		);
		const questionCreate = routes.find(
			(route) => route.id === 'create-question',
		);
		const filterCreate = routes.find((route) => route.id === 'create-filter');
		expect(inbox?.scope).toBe('read_inbox');
		expect(privateHistory?.scope).toBe('private_info');
		expect(questionCreate?.scope).toBe('write_access');
		expect(filterCreate?.methods).toEqual(['GET', 'POST']);
	});
});
