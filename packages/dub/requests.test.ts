import { logEventFromContext } from 'corsair/core';
import {
	Analytics,
	Customers,
	Domains,
	Events,
	Folders,
	Links,
	Qr,
	Tags,
	Track,
} from './endpoints';
import {
	customer,
	domain,
	errorEnvelope,
	folder,
	link,
	linkError,
	rateLimited,
	svgDocument,
	tag,
	trackLeadResponse,
	trackSaleResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'dub-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'image/svg+xml' : 'application/json',
				...headers,
			},
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.dub.co');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('links', () => {
	it('create POSTs the link fields', async () => {
		respond(link);

		const result = await invoke(Links.create, {
			url: 'https://dub.co',
			domain: 'dub.sh',
			key: 'try',
			tagIds: ['tag_1KAP4C9G2F'],
			utm_source: 'newsletter',
			archived: false,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/links',
			query: {},
			body: {
				url: 'https://dub.co',
				domain: 'dub.sh',
				key: 'try',
				tagIds: ['tag_1KAP4C9G2F'],
				utm_source: 'newsletter',
				archived: false,
			},
		});
		expect(result).toEqual(link);
	});

	it('create rejects a url past 32000 characters before calling Dub', async () => {
		await expect(
			invoke(Links.create, { url: `https://${'a'.repeat(32_000)}.com` }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('list fails loudly when a 2xx body is not the bare array', async () => {
		respond(errorEnvelope, 200);

		await expect(invoke(Links.list, {})).rejects.toThrow();
	});

	it('list answers an empty page with a null cursor', async () => {
		respond([]);

		const result = await invoke(Links.list, {});

		expect(result).toEqual({ items: [], nextCursor: null });
	});

	it('list sends the filters and the cursor page', async () => {
		respond([link, { ...link, id: 'link_2', key: 'go' }]);

		const result = await invoke(Links.list, {
			domain: 'dub.sh',
			tagIds: ['tag_1'],
			tagNames: ['Announcement'],
			search: 'try',
			showArchived: true,
			startingAfter: 'link_1',
			pageSize: 2,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/links' });
		expect(lastRequest().query).toEqual({
			domain: 'dub.sh',
			tagIds: 'tag_1',
			tagNames: 'Announcement',
			search: 'try',
			showArchived: 'true',
			startingAfter: 'link_1',
			pageSize: '2',
		});
		expect(result).toEqual({
			items: [link, { ...link, id: 'link_2', key: 'go' }],
			nextCursor: 'link_2',
		});
	});

	it('get queries /links/info by id', async () => {
		respond(link);

		await invoke(Links.get, { linkId: 'link_1KAP4CQ4Y1' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/links/info',
			query: { linkId: 'link_1KAP4CQ4Y1' },
		});
	});

	it('get requires one selector', async () => {
		await expect(invoke(Links.get, { domain: 'dub.sh' })).rejects.toThrow();
		await expect(invoke(Links.get, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('update PATCHes the link id with the body fields', async () => {
		respond(link);

		await invoke(Links.update, {
			linkId: 'link_1KAP4CQ4Y1',
			url: 'https://changed.example',
			archived: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/links/link_1KAP4CQ4Y1',
			body: { url: 'https://changed.example', archived: true },
		});
	});

	it('upsert PUTs /links/upsert', async () => {
		respond(link);

		await invoke(Links.upsert, {
			url: 'https://dub.co',
			domain: 'dub.sh',
			key: 'try',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/links/upsert',
			body: { url: 'https://dub.co', domain: 'dub.sh', key: 'try' },
		});
	});

	it('count queries /links/count with groupBy', async () => {
		respond(7);

		const result = await invoke(Links.count, {
			groupBy: 'domain',
			search: 'a',
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/links/count',
			query: { groupBy: 'domain', search: 'a' },
		});
		expect(result).toBe(7);
	});

	it('count accepts a grouped object answer', async () => {
		respond({ 'dub.sh': 5, 'acme.link': 2 });

		await expect(invoke(Links.count, {})).resolves.toEqual({
			'dub.sh': 5,
			'acme.link': 2,
		});
	});

	it('count accepts the grouped array Dub returns with groupBy', async () => {
		respond([
			{ domain: 'dub.sh', _count: 5 },
			{ domain: 'acme.link', _count: 2 },
		]);
		await expect(invoke(Links.count, { groupBy: 'domain' })).resolves.toEqual([
			{ domain: 'dub.sh', _count: 5 },
			{ domain: 'acme.link', _count: 2 },
		]);
		respond([]);
		await expect(invoke(Links.count, { groupBy: 'domain' })).resolves.toEqual(
			[],
		);
	});

	it('delete DELETEs the link id', async () => {
		respond({ id: 'link_1KAP4CQ4Y1' });

		const result = await invoke(Links.remove, { linkId: 'link_1KAP4CQ4Y1' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/links/link_1KAP4CQ4Y1',
		});
		expect(result).toEqual({ id: 'link_1KAP4CQ4Y1' });
	});

	it('bulkCreate POSTs the array', async () => {
		respond([link, linkError]);

		const result = await invoke(Links.bulkCreate, {
			links: [
				{ url: 'https://dub.co', key: 'try' },
				{ url: 'https://not-a-domain.example', key: 'taken' },
			],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/links/bulk',
			body: [
				{ url: 'https://dub.co', key: 'try' },
				{ url: 'https://not-a-domain.example', key: 'taken' },
			],
		});
		expect(result).toEqual([link, linkError]);
	});

	it('bulkCreate rejects more than 100 links', async () => {
		const many = Array.from({ length: 101 }, (_, i) => ({
			url: `https://p${i}.example`,
		}));
		await expect(invoke(Links.bulkCreate, { links: many })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('bulkUpdate PATCHes link ids with one data payload', async () => {
		respond([link]);

		await invoke(Links.bulkUpdate, {
			linkIds: ['link_1', 'link_2'],
			data: { archived: true },
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/links/bulk',
			body: { linkIds: ['link_1', 'link_2'], data: { archived: true } },
		});
	});

	it('bulkUpdate requires a target list', async () => {
		await expect(
			invoke(Links.bulkUpdate, { data: { archived: true } }),
		).rejects.toThrow();
		await expect(invoke(Links.bulkUpdate, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('bulkDelete joins the ids into one comma-separated query value', async () => {
		respond({ deletedCount: 2 });

		const result = await invoke(Links.bulkDelete, {
			linkIds: ['link_1', 'link_2'],
		});

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/links/bulk',
			query: { linkIds: 'link_1,link_2' },
		});
		expect(result).toEqual({ deletedCount: 2 });
	});
});

describe('analytics.retrieve', () => {
	it('sends the default-free query with the filters', async () => {
		respond({ clicks: 10, leads: 2, sales: 1, saleAmount: 4900 });

		const result = await invoke(Analytics.retrieve, {
			event: 'clicks',
			groupBy: 'count',
			interval: '7d',
			linkId: 'link_1KAP4CQ4Y1',
			country: 'US',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/analytics' });
		expect(lastRequest().query).toEqual({
			event: 'clicks',
			groupBy: 'count',
			interval: '7d',
			linkId: 'link_1KAP4CQ4Y1',
			country: 'US',
		});
		expect(result).toEqual({
			clicks: 10,
			leads: 2,
			sales: 1,
			saleAmount: 4900,
		});
	});

	it('keeps a timeseries array answer', async () => {
		respond([
			{ start: '2026-11-20', clicks: 3, leads: 0, sales: 0, saleAmount: 0 },
		]);

		await expect(
			invoke(Analytics.retrieve, { groupBy: 'timeseries' }),
		).resolves.toEqual([
			{ start: '2026-11-20', clicks: 3, leads: 0, sales: 0, saleAmount: 0 },
		]);
	});

	it('rejects an unknown groupBy before calling Dub', async () => {
		await expect(
			invoke(Analytics.retrieve, { groupBy: 'everything' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('events.list', () => {
	it('sends page paging and wraps the bare array', async () => {
		respond([{ event: 'click', timestamp: '2026-11-20T10:00:00.000Z' }]);

		const result = await invoke(Events.list, {
			event: 'clicks',
			page: 2,
			limit: 1,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/events' });
		expect(lastRequest().query).toEqual({
			event: 'clicks',
			page: '2',
			limit: '1',
		});
		expect(result).toEqual({
			items: [{ event: 'click', timestamp: '2026-11-20T10:00:00.000Z' }],
			page: 2,
			limit: 1,
			// The page came back full at limit 1, so the next page is offered.
			nextPage: 3,
		});
	});

	it('offers the next page while the page came back full', async () => {
		respond([
			{ event: 'click', timestamp: 'a' },
			{ event: 'click', timestamp: 'b' },
		]);

		const result = await invoke(Events.list, { limit: 2 });

		expect(result).toMatchObject({ page: 1, limit: 2, nextPage: 2 });
	});

	it('rejects a limit past the documented 1000', async () => {
		await expect(invoke(Events.list, { limit: 1001 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('qr.get', () => {
	it('pins the format to svg and wraps the document', async () => {
		respond(svgDocument);

		const result = await invoke(Qr.get, {
			url: 'https://dub.sh/try',
			size: 512,
			level: 'Q',
			fgColor: '#000000',
			margin: 2,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/qr' });
		expect(lastRequest().query).toEqual({
			url: 'https://dub.sh/try',
			size: '512',
			level: 'Q',
			fgColor: '#000000',
			margin: '2',
			format: 'svg',
		});
		expect(result).toEqual({ svg: svgDocument });
	});

	it('rejects a non-SVG body loudly', async () => {
		respond('<html>not a qr</html>');

		await expect(invoke(Qr.get, { url: 'https://dub.sh/try' })).rejects.toThrow(
			expect.objectContaining({ name: 'ZodError' }),
		);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a url past 32000 characters', async () => {
		await expect(
			invoke(Qr.get, { url: `https://${'a'.repeat(32_000)}.com` }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tags', () => {
	it('create POSTs the name and color', async () => {
		respond(tag, 201);

		const result = await invoke(Tags.create, {
			name: 'Announcement',
			color: 'red',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/tags',
			body: { name: 'Announcement', color: 'red' },
		});
		expect(result).toEqual(tag);
	});

	it('create rejects a missing name, which the spec leaves unpinned but the docs require', async () => {
		await expect(invoke(Tags.create, { color: 'red' })).rejects.toThrow();
		await expect(
			invoke(Tags.create, { name: '', color: 'red' }),
		).rejects.toThrow();
		await expect(
			invoke(Tags.create, { name: 'Announcement', color: 'magenta' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('list sends the paging and sort', async () => {
		respond([tag]);

		const result = await invoke(Tags.list, {
			sortBy: 'name',
			sortOrder: 'asc',
			search: 'ann',
			page: 1,
			pageSize: 50,
		});

		expect(lastRequest().query).toEqual({
			sortBy: 'name',
			sortOrder: 'asc',
			search: 'ann',
			page: '1',
			pageSize: '50',
		});
		expect(result).toMatchObject({ items: [tag], page: 1, pageSize: 50 });
	});

	it('update PATCHes the tag id', async () => {
		respond({ ...tag, name: 'Launch' });

		await invoke(Tags.update, { id: 'tag_1KAP4C9G2F', name: 'Launch' });

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/tags/tag_1KAP4C9G2F',
			body: { name: 'Launch' },
		});
	});

	it('delete DELETEs the tag id', async () => {
		respond({ id: 'tag_1KAP4C9G2F' });

		await invoke(Tags.remove, { id: 'tag_1KAP4C9G2F' });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/tags/tag_1KAP4C9G2F',
		});
	});
});

describe('domains', () => {
	it('create POSTs the slug and redirect fields', async () => {
		respond(domain, 201);

		const result = await invoke(Domains.create, {
			slug: 'acme.link',
			expiredUrl: 'https://acme.link/expired',
			archived: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/domains',
			body: {
				slug: 'acme.link',
				expiredUrl: 'https://acme.link/expired',
				archived: false,
			},
		});
		expect(result).toEqual(domain);
	});

	it('create rejects a missing slug, which the spec leaves unpinned but the docs require', async () => {
		await expect(invoke(Domains.create, { archived: false })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('list sends the paging', async () => {
		respond([domain]);

		const result = await invoke(Domains.list, { archived: true, page: 3 });

		expect(lastRequest().query).toEqual({
			archived: 'true',
			page: '3',
		});
		expect(result).toMatchObject({ items: [domain], page: 3, pageSize: 50 });
	});

	it('update PATCHes the slug path and sends a rename as body slug', async () => {
		respond({ ...domain, slug: 'acme.io' });

		await invoke(Domains.update, {
			slug: 'acme.link',
			newSlug: 'acme.io',
			notFoundUrl: 'https://acme.io/404',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/domains/acme.link',
			body: { slug: 'acme.io', notFoundUrl: 'https://acme.io/404' },
		});
	});

	it('update sends no slug when there is no rename', async () => {
		respond(domain);

		await invoke(Domains.update, { slug: 'acme.link', archived: true });

		expect(lastRequest().body).toEqual({ archived: true });
	});

	it('delete DELETEs the slug', async () => {
		respond({ slug: 'acme.link' });

		await invoke(Domains.remove, { slug: 'acme.link' });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/domains/acme.link',
		});
	});
});

describe('folders', () => {
	it('create POSTs the name and access level', async () => {
		respond(folder, 201);

		const result = await invoke(Folders.create, {
			name: 'Campaigns',
			accessLevel: 'write',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/folders',
			body: { name: 'Campaigns', accessLevel: 'write' },
		});
		expect(result).toEqual(folder);
	});

	it('create rejects a missing name', async () => {
		await expect(invoke(Folders.create, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('list sends the paging', async () => {
		respond([folder]);

		const result = await invoke(Folders.list, { search: 'camp', pageSize: 10 });

		expect(lastRequest().query).toEqual({ search: 'camp', pageSize: '10' });
		expect(result).toMatchObject({ items: [folder], page: 1, pageSize: 10 });
	});

	it('update PATCHes the folder id', async () => {
		respond(folder);

		await invoke(Folders.update, { id: 'fold_1KAP4CZF3T', name: 'Q4' });

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/folders/fold_1KAP4CZF3T',
			body: { name: 'Q4' },
		});
	});

	it('delete DELETEs the folder id', async () => {
		respond({ id: 'fold_1KAP4CZF3T' });

		await invoke(Folders.remove, { id: 'fold_1KAP4CZF3T' });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/folders/fold_1KAP4CZF3T',
		});
	});
});

describe('track', () => {
	it('lead POSTs the click attribution', async () => {
		respond(trackLeadResponse);

		const result = await invoke(Track.lead, {
			clickId: 'click_1KAP4CD1E2',
			eventName: 'Sign up',
			customerExternalId: 'ext_123456',
			customerEmail: 'jordan@acme-logistics.example',
			mode: 'wait',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/track/lead',
			body: {
				clickId: 'click_1KAP4CD1E2',
				eventName: 'Sign up',
				customerExternalId: 'ext_123456',
				customerEmail: 'jordan@acme-logistics.example',
				mode: 'wait',
			},
		});
		expect(result).toEqual(trackLeadResponse);
	});

	it('lead rejects a malformed email before calling Dub', async () => {
		await expect(
			invoke(Track.lead, {
				clickId: 'click_1',
				eventName: 'Sign up',
				customerExternalId: 'ext_1',
				customerEmail: 'not-an-address.example',
			}),
		).rejects.toThrow();
		await expect(
			invoke(Track.lead, {
				clickId: 'click_1',
				eventName: 'Sign up',
				customerExternalId: 'ext_1',
				customerEmail: 'dots..dots@example.com',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lead rejects a missing clickId, eventName or customerExternalId', async () => {
		await expect(
			invoke(Track.lead, { eventName: 'Sign up', customerExternalId: 'e1' }),
		).rejects.toThrow();
		await expect(
			invoke(Track.lead, { clickId: 'c1', customerExternalId: 'e1' }),
		).rejects.toThrow();
		await expect(
			invoke(Track.lead, { clickId: 'c1', eventName: 'Sign up' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sale POSTs the amount in cents', async () => {
		respond(trackSaleResponse);

		const result = await invoke(Track.sale, {
			customerExternalId: 'ext_123456',
			amount: 4900,
			currency: 'usd',
			eventName: 'Invoice paid',
			paymentProcessor: 'stripe',
			invoiceId: 'inv_1KAP4CD1E2',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/track/sale',
			body: {
				customerExternalId: 'ext_123456',
				amount: 4900,
				currency: 'usd',
				eventName: 'Invoice paid',
				paymentProcessor: 'stripe',
				invoiceId: 'inv_1KAP4CD1E2',
			},
		});
		expect(result).toEqual(trackSaleResponse);
	});

	it('sale rejects an amount that is not an integer', async () => {
		await expect(
			invoke(Track.sale, {
				customerExternalId: 'ext_1',
				amount: 49.99,
			}),
		).rejects.toThrow();
		await expect(
			invoke(Track.sale, { customerExternalId: 'ext_1', amount: -1 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('customers', () => {
	it('list sends the filters and cursor page', async () => {
		respond([customer, { ...customer, id: 'cus_2' }]);

		const result = await invoke(Customers.list, {
			email: 'jordan@acme-logistics.example',
			sortBy: 'createdAt',
			startingAfter: 'cus_1',
			pageSize: 2,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/customers',
			query: {
				email: 'jordan@acme-logistics.example',
				sortBy: 'createdAt',
				startingAfter: 'cus_1',
				pageSize: '2',
			},
		});
		expect(result).toEqual({
			items: [customer, { ...customer, id: 'cus_2' }],
			nextCursor: 'cus_2',
		});
	});

	it('get fetches the customer id path', async () => {
		respond(customer);

		const result = await invoke(Customers.get, {
			id: 'cus_1KAP4CXQ2W',
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/customers/cus_1KAP4CXQ2W',
			query: {},
		});
		expect(result).toEqual(customer);
	});

	it('update PATCHes the customer body', async () => {
		respond(customer);

		await invoke(Customers.update, {
			id: 'cus_1KAP4CXQ2W',
			name: 'Jordan Lee',
			country: 'US',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/customers/cus_1KAP4CXQ2W',
			body: { name: 'Jordan Lee', country: 'US' },
		});
	});

	it('update rejects a malformed email', async () => {
		await expect(
			invoke(Customers.update, { id: 'cus_1', email: 'broken@@example' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('delete DELETEs the customer id', async () => {
		respond({ id: 'cus_1KAP4CXQ2W' });

		await invoke(Customers.remove, { id: 'cus_1KAP4CXQ2W' });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/customers/cus_1KAP4CXQ2W',
		});
	});
});

describe('error surfacing', () => {
	it('surfaces the envelope of a conflict', async () => {
		respond(
			errorEnvelope('conflict', 'A link with this key already exists.'),
			409,
		);

		await expect(
			invoke(Links.create, { url: 'https://dub.co' }),
		).rejects.toMatchObject({
			status: 409,
			body: { error: { code: 'conflict' } },
			message: 'Dub 409 conflict: A link with this key already exists.',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('surfaces a rate-limited analytics call', async () => {
		// The first attempt and core's three retries.
		for (let i = 0; i < 4; i++) {
			respond(rateLimited, 429, { 'Retry-After': '0' });
		}

		await expect(invoke(Analytics.retrieve, {})).rejects.toMatchObject({
			status: 429,
			body: { error: { code: 'rate_limit_exceeded' } },
		});
	});
});
