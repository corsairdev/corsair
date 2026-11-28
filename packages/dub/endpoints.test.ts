import {
	nextCursorFrom,
	DubEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import {
	clickEvent,
	customer,
	domain,
	folder,
	leadEvent,
	link,
	linkError,
	saleEvent,
	svgDocument,
	tag,
	trackLeadResponse,
	trackSaleResponse,
} from './test-fixtures';

describe('nextCursorFrom', () => {
	const pageSize = 2;

	it('derives the cursor from the last item id on a full page', () => {
		expect(nextCursorFrom([{ id: 'link_1' }, { id: 'link_2' }], pageSize)).toBe(
			'link_2',
		);
	});

	it('returns null on a short page, which ends the list', () => {
		expect(nextCursorFrom([{ id: 'link_1' }], pageSize)).toBeNull();
		expect(nextCursorFrom([], pageSize)).toBeNull();
	});

	it('returns null when a full page has no usable last id', () => {
		expect(nextCursorFrom([{}, {}], pageSize)).toBeNull();
		expect(nextCursorFrom([{ id: '' }, { id: null }], pageSize)).toBeNull();
	});
});

// Every operation parses its real answer shape; a wrong-shaped payload fails
// loudly rather than reading as an empty success.
describe('output parsing per operation', () => {
	it('links.list wraps a bare array with the derived cursor', () => {
		const parsed = Outputs.linksList.parse({
			items: [link, { ...link, id: 'link_2' }],
			nextCursor: 'link_2',
		});
		expect(parsed.nextCursor).toBe('link_2');
	});

	it('links.create parses a full link', () => {
		expect(Outputs.linksCreate.parse(link)).toMatchObject({
			id: 'link_1KAP4CQ4Y1',
			shortLink: 'https://dub.sh/try',
		});
	});

	it('links.upsert parses through the same link schema', () => {
		expect(Outputs.linksUpsert.parse(link).id).toBe('link_1KAP4CQ4Y1');
	});

	it('links.bulkCreate keeps per-link error rows beside created links', () => {
		const parsed = Outputs.linksBulkCreate.parse([link, linkError]);
		expect(parsed).toHaveLength(2);
		expect(parsed[1]).toMatchObject({ code: 'conflict' });
	});

	it('links.bulkUpdate parses an array of links', () => {
		expect(Outputs.linksBulkUpdate.parse([link])).toHaveLength(1);
	});

	it('links.count parses a bare number', () => {
		expect(Outputs.linksCount.parse(42)).toBe(42);
	});

	it('links.delete and the other deletes parse their bare ids', () => {
		expect(Outputs.linksDelete.parse({ id: 'link_1' })).toEqual({
			id: 'link_1',
		});
		expect(Outputs.tagsDelete.parse({ id: 'tag_1' })).toEqual({ id: 'tag_1' });
		expect(Outputs.domainsDelete.parse({ slug: 'ac.me' })).toEqual({
			slug: 'ac.me',
		});
		expect(Outputs.foldersDelete.parse({ id: 'fold_1' })).toEqual({
			id: 'fold_1',
		});
		expect(Outputs.customersDelete.parse({ id: 'cus_1' })).toEqual({
			id: 'cus_1',
		});
		expect(Outputs.linksBulkDelete.parse({ deletedCount: 3 })).toMatchObject({
			deletedCount: 3,
		});
	});

	it('analytics parses a count object and grouped rows', () => {
		expect(
			Outputs.analyticsRetrieve.parse({
				clicks: 1,
				leads: 0,
				sales: 0,
				saleAmount: 0,
			}),
		).toMatchObject({ clicks: 1 });
		expect(
			Outputs.analyticsRetrieve.parse([
				{ country: 'US', clicks: 2, leads: 0, sales: 0, saleAmount: 0 },
			]),
		).toHaveLength(1);
		// A groupBy value the spec leaves undocumented passes through the loose row.
		expect(
			Outputs.analyticsRetrieve.parse([
				{ utm_source: 'newsletter', clicks: 5 },
			]),
		).toHaveLength(1);
	});

	it('events parses click, lead and sale rows as one discriminated union', () => {
		const events = Outputs.eventsList.parse({
			items: [clickEvent, leadEvent, saleEvent],
			page: 1,
			limit: 3,
			nextPage: null,
		});
		expect(events.items.map((row) => row.event)).toEqual([
			'click',
			'lead',
			'sale',
		]);
	});

	it('qr parses the wrapped SVG string', () => {
		expect(Outputs.qrGet.parse({ svg: svgDocument }).svg).toBe(svgDocument);
	});

	it('tags parses create, update and list rows', () => {
		expect(Outputs.tagsCreate.parse(tag)).toMatchObject({
			name: 'Announcement',
		});
		const list = Outputs.tagsList.parse({
			items: [tag],
			page: 1,
			pageSize: 100,
			nextPage: null,
		});
		expect(list.items).toHaveLength(1);
	});

	it('domains, folders and customers parse their resources', () => {
		expect(Outputs.domainsCreate.parse(domain).slug).toBe('acme.link');
		const domains = Outputs.domainsList.parse({
			items: [domain],
			page: 1,
			pageSize: 50,
			nextPage: null,
		});
		expect(domains.items).toHaveLength(1);
		expect(Outputs.foldersCreate.parse(folder).id).toBe('fold_1KAP4CZF3T');
		const folders = Outputs.foldersList.parse({
			items: [folder],
			page: 1,
			pageSize: 50,
			nextPage: null,
		});
		expect(folders.items).toHaveLength(1);
		expect(Outputs.customersGet.parse(customer).externalId).toBe('ext_123456');
		const customers = Outputs.customersList.parse({
			items: [customer],
			nextCursor: null,
		});
		expect(customers.items).toHaveLength(1);
	});

	it('track parses the lead and sale answers', () => {
		expect(Outputs.trackLead.parse(trackLeadResponse).click?.id).toBe(
			'click_1KAP4CD1E2',
		);
		expect(Outputs.trackSale.parse(trackSaleResponse).sale?.amount).toBe(4900);
	});
});

// Three rejection kinds: a wrong-shaped payload, a malformed known field,
// and a body missing a required field. Dub documents no 206 partial success.
describe('output rejections', () => {
	it('rejects a wrong-shaped payload', () => {
		// A links.list envelope object instead of the wrapped answer.
		expect(() => Outputs.linksList.parse([link])).toThrow();
		// An analytics answer that is neither a count object nor an array.
		expect(() => Outputs.analyticsRetrieve.parse('nope')).toThrow();
		// An event row without its discriminator.
		expect(() =>
			Outputs.eventsList.parse({
				items: [{ timestamp: '2026-11-20' }],
				page: 1,
				limit: 1,
				nextPage: null,
			}),
		).toThrow();
	});

	it('rejects a malformed known field', () => {
		// clicks is a number, not a string.
		expect(() =>
			Outputs.analyticsRetrieve.parse({
				clicks: 'many',
				leads: 0,
				sales: 0,
				saleAmount: 0,
			}),
		).toThrow();
		// deletedCount is required by the delete answer.
		expect(() => Outputs.linksBulkDelete.parse({})).toThrow();
		// qr.get output needs the svg string.
		expect(() => Outputs.qrGet.parse({ svg: 12 })).toThrow();
		// A link without its id fails rather than paging from nothing.
		expect(() =>
			Outputs.linksList.parse({
				items: [{ domain: 'dub.sh' }],
				nextCursor: null,
			}),
		).toThrow();
	});

	it('rejects a body missing a required field', () => {
		expect(() => Outputs.linksCreate.parse({ domain: 'dub.sh' })).toThrow();
		expect(() => Outputs.tagsCreate.parse({ color: 'red' })).toThrow();
	});
});
