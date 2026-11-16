import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Contacts,
	Letters,
	Postcards,
	SelfMailers,
	Templates,
	Trackers,
} from './endpoints';
import { PostcardsCreateInputSchema } from './endpoints/types';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePostgridRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePostgridRequest);
const mockedLog = jest.mocked(logEventFromContext);

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest(index = -1) {
	const call = mockedRequest.mock.calls.at(index);
	if (!call) throw new Error('no request was sent');
	return call[1];
}

const contact = {
	id: 'contact_1',
	object: 'contact',
	addressLine1: '20 Bay St',
	countryCode: 'CA',
	addressStatus: 'verified',
};

const to = { addressLine1: '145 Mulberry St', countryCode: 'US' };
const from = { id: 'contact_sender' };

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('contacts endpoints', () => {
	it('contacts.list sends the skip/limit page and the search', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			limit: 10,
			skip: 0,
			totalCount: 1,
			data: [contact],
		});

		const result = await Contacts.list(ctx, {
			skip: 0,
			limit: 10,
			search: 'New York',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/contacts',
			query: { skip: 0, limit: 10, search: 'New York' },
		});
		expect(result.data).toHaveLength(1);
		expect(result.totalCount).toBe(1);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'postgrid.contacts.list',
			{ count: 1 },
			'completed',
		);
	});

	it('contacts.get reads one contact by path', async () => {
		mockedRequest.mockResolvedValue(contact);

		const result = await Contacts.get(ctx, { id: 'contact_1' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/contacts/contact_1',
		});
		expect(result.addressStatus).toBe('verified');
	});

	it('contacts.create sends the address body', async () => {
		mockedRequest.mockResolvedValue(contact);

		await Contacts.create(ctx, {
			addressLine1: '20 Bay St',
			countryCode: 'CA',
			firstName: 'Kevin',
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/contacts');
		expect(request?.body).toEqual({
			addressLine1: '20 Bay St',
			countryCode: 'CA',
			firstName: 'Kevin',
		});
		// A contact is not an order, so no idempotency key is sent.
		expect(request?.idempotencyKey).toBeUndefined();
	});

	it('contacts.delete removes by path', async () => {
		mockedRequest.mockResolvedValue({
			id: 'contact_1',
			object: 'contact',
			deleted: true,
		});

		const result = await Contacts.remove(ctx, { id: 'contact_1' });

		expect(result.deleted).toBe(true);

		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/contacts/contact_1',
		});
	});
});

describe('templates endpoints', () => {
	it('templates.list pages the templates', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			totalCount: 0,
			data: [],
		});

		await Templates.list(ctx, { limit: 5 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/templates',
			query: { skip: undefined, limit: 5, search: undefined },
		});
	});

	it('templates.get reads one template', async () => {
		mockedRequest.mockResolvedValue({ id: 'template_1', html: '<b>Hi</b>' });

		const result = await Templates.get(ctx, { id: 'template_1' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/templates/template_1',
		});
		expect(result.html).toBe('<b>Hi</b>');
	});

	it('templates.create posts the html and description', async () => {
		mockedRequest.mockResolvedValue({ id: 'template_new' });

		await Templates.create(ctx, {
			html: '<b>Hello</b> {{to.firstName}}!',
			description: 'Test',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/templates',
			body: { html: '<b>Hello</b> {{to.firstName}}!', description: 'Test' },
		});
	});

	it('templates.update posts only the fields given, without the path id', async () => {
		mockedRequest.mockResolvedValue({ id: 'template_1' });

		await Templates.update(ctx, {
			id: 'template_1',
			description: 'Updated',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/templates/template_1',
			body: { description: 'Updated' },
		});
	});

	it('templates.delete removes by path', async () => {
		mockedRequest.mockResolvedValue({ id: 'template_1' });

		await Templates.remove(ctx, { id: 'template_1' });

		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/templates/template_1',
		});
	});
});

describe('letters endpoints', () => {
	it('letters.list pages with the search', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			totalCount: 0,
			data: [],
		});

		await Letters.list(ctx, {
			search: '{"metadata.campaignID": "ABC"}',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/letters',
			query: {
				skip: undefined,
				limit: undefined,
				search: '{"metadata.campaignID": "ABC"}',
			},
		});
	});

	it('letters.get sends expand as the key[] form', async () => {
		mockedRequest.mockResolvedValue({ id: 'letter_1', status: 'ready' });

		await Letters.get(ctx, { id: 'letter_1', expand: ['template'] });

		// The client turns `expand` into `expand[]`, so the endpoint passes the
		// array through and buildQuery owns the wire shape.
		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/letters/letter_1',
			query: { expand: ['template'] },
		});
	});

	it('letters.create carries an idempotency key and the letter body', async () => {
		mockedRequest.mockResolvedValue({
			id: 'letter_new',
			status: 'ready',
			pageCount: 1,
		});

		await Letters.create(ctx, {
			to,
			from,
			html: '<b>Hello</b>',
			color: true,
			doubleSided: false,
			size: 'us_letter',
			mailingClass: 'usps_first_class',
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/letters');
		expect(request?.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);
		expect(request?.body).toEqual({
			to,
			from: 'contact_sender',
			html: '<b>Hello</b>',
			color: true,
			doubleSided: false,
			size: 'us_letter',
			mailingClass: 'usps_first_class',
		});
	});

	it('letters.create reuses a caller-supplied idempotency key on a retry', async () => {
		mockedRequest.mockResolvedValue({ id: 'letter_new', status: 'ready' });

		const input = {
			to,
			from,
			html: '<b>Hi</b>',
			idempotencyKey: 'order-991-attempt-1',
		};
		await Letters.create(ctx, input);
		await Letters.create(ctx, input);

		expect(sentRequest(-2)?.idempotencyKey).toBe('order-991-attempt-1');
		expect(sentRequest(-1)?.idempotencyKey).toBe('order-991-attempt-1');
	});

	it('letters.cancel deletes by id, the route that takes no note', async () => {
		mockedRequest.mockResolvedValue({ id: 'letter_1', status: 'cancelled' });

		const result = await Letters.cancel(ctx, { id: 'letter_1' });

		// The POST .../cancellation route requires a `note`, so an id-only call
		// uses DELETE, which PostGrid documents as "Cancel Letter".
		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/letters/letter_1',
		});
		expect(result.status).toBe('cancelled');
	});
});

describe('postcards endpoints', () => {
	it('postcards.list pages the cards', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			totalCount: 0,
			data: [],
		});

		await Postcards.list(ctx, { skip: 20, limit: 20 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/postcards',
			query: { skip: 20, limit: 20, search: undefined },
		});
	});

	it('postcards.get reads one card', async () => {
		mockedRequest.mockResolvedValue({ id: 'postcard_1', status: 'ready' });

		await Postcards.get(ctx, { id: 'postcard_1' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/postcards/postcard_1',
			query: { expand: undefined },
		});
	});

	it('postcards.create sends both faces and a size', async () => {
		mockedRequest.mockResolvedValue({ id: 'postcard_new', status: 'ready' });

		await Postcards.create(ctx, {
			to,
			from,
			size: '6x4',
			frontHTML: '<b>Front</b>',
			backHTML: '<b>Back</b>',
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/postcards');
		expect(request?.idempotencyKey).toBeDefined();
		expect(request?.body).toMatchObject({
			size: '6x4',
			frontHTML: '<b>Front</b>',
			backHTML: '<b>Back</b>',
		});
	});

	it('postcards.cancel deletes by id, the route that takes no note', async () => {
		mockedRequest.mockResolvedValue({ id: 'postcard_1', status: 'cancelled' });

		await Postcards.cancel(ctx, { id: 'postcard_1' });

		// The POST .../cancellation route requires a `note`, so an id-only call
		// uses DELETE, which PostGrid documents as "Cancel Postcard".
		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/postcards/postcard_1',
		});
	});
});

describe('selfMailers endpoints', () => {
	it('selfMailers.list pages the mailers', async () => {
		mockedRequest.mockResolvedValue({
			object: 'list',
			totalCount: 0,
			data: [],
		});

		await SelfMailers.list(ctx, { limit: 10 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/self_mailers',
			query: { skip: undefined, limit: 10, search: undefined },
		});
	});

	it('selfMailers.get reads one mailer', async () => {
		mockedRequest.mockResolvedValue({ id: 'self_mailer_1', status: 'ready' });

		await SelfMailers.get(ctx, { id: 'self_mailer_1' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/self_mailers/self_mailer_1',
			query: { expand: undefined },
		});
	});

	it('selfMailers.create sends both panels and a fold size', async () => {
		mockedRequest.mockResolvedValue({
			id: 'self_mailer_new',
			status: 'ready',
		});

		await SelfMailers.create(ctx, {
			to,
			from,
			size: '8.5x11_bifold',
			insideHTML: '<b>Inside</b>',
			outsideHTML: '<b>Outside</b>',
		});

		const request = sentRequest();
		expect(request?.method).toBe('POST');
		expect(request?.path).toBe('/self_mailers');
		expect(request?.idempotencyKey).toBeDefined();
		expect(request?.body).toMatchObject({
			size: '8.5x11_bifold',
			insideHTML: '<b>Inside</b>',
			outsideHTML: '<b>Outside</b>',
		});
	});
});

describe('order recipients and senders, as PostGrid reads them', () => {
	// PostGrid takes an existing contact as its id string (`contact_123`) or an
	// inline contact body. An object holding only `id` is read as an inline
	// contact with no address, so the plugin sends the id string instead.
	it('letters.create sends an existing contact as its id string', async () => {
		mockedRequest.mockResolvedValue({ id: 'letter_new', status: 'ready' });

		await Letters.create(ctx, {
			to: 'contact_recipient',
			from: { id: 'contact_sender' },
			html: '<b>Hello</b>',
		});

		expect(sentRequest()?.body).toEqual({
			to: 'contact_recipient',
			from: 'contact_sender',
			html: '<b>Hello</b>',
		});
	});

	it('letters.create sends no sender when none is given, which PostGrid allows', async () => {
		mockedRequest.mockResolvedValue({ id: 'letter_new', status: 'ready' });

		await Letters.create(ctx, { to, html: '<b>Hello</b>' });

		expect(sentRequest()?.body).toEqual({ to, html: '<b>Hello</b>' });
	});

	it('letters.create sends `envelope`, the documented field, and no `express` flag', async () => {
		mockedRequest.mockResolvedValue({ id: 'letter_new', status: 'ready' });

		await Letters.create(ctx, {
			to,
			html: '<b>Hello</b>',
			envelope: 'standard',
			mailingClass: 'express',
		});

		expect(sentRequest()?.body).toEqual({
			to,
			html: '<b>Hello</b>',
			envelope: 'standard',
			mailingClass: 'express',
		});
	});

	it('postcards.create sends an existing recipient as its id string', async () => {
		mockedRequest.mockResolvedValue({ id: 'postcard_new', status: 'ready' });

		await Postcards.create(ctx, {
			to: { id: 'contact_recipient' },
			size: '6x4',
			frontHTML: '<b>Front</b>',
			backHTML: '<b>Back</b>',
		});

		expect(sentRequest()?.body).toEqual({
			to: 'contact_recipient',
			size: '6x4',
			frontHTML: '<b>Front</b>',
			backHTML: '<b>Back</b>',
		});
	});

	it('postcards.create keeps the verification flags on an inline recipient', async () => {
		mockedRequest.mockResolvedValue({ id: 'postcard_new', status: 'ready' });
		const input = PostcardsCreateInputSchema.parse({
			to: { ...to, forceVerifiedStatus: true, skipVerification: true },
			size: '6x4',
			frontHTML: '<b>Front</b>',
			backHTML: '<b>Back</b>',
		});

		await Postcards.create(ctx, input);

		expect(sentRequest()?.body).toMatchObject({
			to: { ...to, forceVerifiedStatus: true, skipVerification: true },
		});
	});

	it('selfMailers.create takes the 9.5x16 trifold without a sender', async () => {
		mockedRequest.mockResolvedValue({ id: 'self_mailer_new', status: 'ready' });

		await SelfMailers.create(ctx, {
			to: 'contact_recipient',
			size: '9.5x16_trifold',
			insideHTML: '<b>Inside</b>',
			outsideHTML: '<b>Outside</b>',
		});

		expect(sentRequest()?.body).toEqual({
			to: 'contact_recipient',
			size: '9.5x16_trifold',
			insideHTML: '<b>Inside</b>',
			outsideHTML: '<b>Outside</b>',
		});
	});
});

describe('trackers endpoints', () => {
	it('trackers.get reads a tracker, with its visit counts', async () => {
		mockedRequest.mockResolvedValue({
			id: 'tracker_1',
			object: 'tracker',
			redirectURLTemplate: 'https://example.com?name={{to.firstName}}',
			urlExpireAfterDays: 30,
			visitCount: 12,
			uniqueVisitCount: 7,
		});

		const result = await Trackers.get(ctx, { id: 'tracker_1' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/trackers/tracker_1',
		});
		expect(result.visitCount).toBe(12);
		expect(result.uniqueVisitCount).toBe(7);
		expect(result.redirectURLTemplate).toContain('example.com');
		// The event records the tracker's own numbers, not an order status.
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'postgrid.trackers.get',
			{ trackerId: 'tracker_1', visitCount: 12, uniqueVisitCount: 7 },
			'completed',
		);
	});
});
