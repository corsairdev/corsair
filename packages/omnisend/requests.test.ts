import { logEventFromContext } from 'corsair/core';
import {
	batchesCreate,
	batchesGet,
	batchesList,
	batchesListItems,
	campaignsCancel,
	campaignsCopy,
	campaignsCreate,
	campaignsGet,
	campaignsGetUtm,
	campaignsList,
	campaignsRemove,
	campaignsRestoreToDraft,
	campaignsSend,
	campaignsSendTestEmail,
	campaignsSetUtm,
	campaignsUpdate,
	categoriesCreate,
	categoriesGet,
	categoriesList,
	categoriesRemove,
	categoriesUpdate,
	contactsAddTags,
	contactsGet,
	contactsList,
	contactsRemoveTags,
	contactsUpdate,
	contactsUpdateByEmail,
	contactsUpsert,
	emailContentGet,
	emailContentRender,
	emailContentReplace,
	eventsDefineSchema,
	eventsQueryMetadata,
	eventsSend,
	eventsUpdateSchema,
	productsCreate,
	productsGet,
	productsList,
	productsRemove,
	productsReplace,
	templatesCreate,
	templatesGet,
	templatesImportFromHtml,
	templatesList,
	templatesRemove,
	templatesRender,
	templatesReplace,
} from './endpoints';
import {
	batch,
	batchesCreateResponse,
	batchesListResponse,
	campaign,
	campaignsListResponse,
	categoriesListResponse,
	category,
	contact,
	contactsListResponse,
	eventsMetadataResponse,
	eventWriteResponse,
	product,
	productsListResponse,
	renderedTemplate,
	template,
	templatesListResponse,
	utmResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'omnisend_test_key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return type is dropped.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: each endpoint returns its own type.

// Safe: the fake context carries only ctx.key, which is all any endpoint reads.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// unknown: see AnyEndpoint.
	// unknown: see AnyEndpoint.
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: decodedPath(parsed.pathname),
		query: Object.fromEntries(parsed.searchParams),
		queryAll: allQueryValues(parsed),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

/** Percent-encoded path segments, decoded for readable assertions. */
function decodedPath(pathname: string): string {
	return pathname
		.split('/')
		.map((part) => decodeURIComponent(part))
		.join('/');
}

/** Every value a repeated query parameter carried, in order. */
function allQueryValues(url: URL): Record<string, string[]> {
	const all: Record<string, string[]> = {};
	for (const [key, value] of url.searchParams) {
		all[key] = [...(all[key] ?? []), value];
	}
	return all;
}

function expectAuthenticated(path: string, method: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.omnisend.com');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('authorization')).toBe(`Omnisend-API-Key ${API_KEY}`);
	expect(sent.headers.get('omnisend-version')).toBe('2026-03-15');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	mockLog.mockClear();
});

// One test per operation: URL, method, auth placement, and every query or body
// field the operation sends.

describe('contacts', () => {
	it('contacts.list sends the filters and paging', async () => {
		respond(contactsListResponse);
		await invoke(contactsList, {
			limit: 50,
			after: 'cursor-1',
			sort: 'createdAt',
			direction: 'asc',
			status: 'subscribed',
			segmentID: 'seg-1',
		});
		expectAuthenticated('/api/contacts', 'GET');
		const sent = lastRequest();
		expect(sent.query).toEqual({
			limit: '50',
			after: 'cursor-1',
			sort: 'createdAt',
			direction: 'asc',
			status: 'subscribed',
			segmentID: 'seg-1',
		});
	});

	it('contacts.list sends updatedAtFrom only beside the shared filters', async () => {
		// updatedAtFrom cannot combine with email, phone, status, segmentID or
		// tag, which the input schema rejects; this pair is allowed.
		respond(contactsListResponse);
		await invoke(contactsList, {
			limit: 50,
			updatedAtFrom: '2026-01-01T00:00:00Z',
		});
		expect(lastRequest().query).toEqual({
			limit: '50',
			updatedAtFrom: '2026-01-01T00:00:00Z',
		});
	});

	it('contacts.get reads by id', async () => {
		respond(contact);
		await invoke(contactsGet, { id: '60a617' });
		expectAuthenticated('/api/contacts/60a617', 'GET');
	});

	it('contacts.upsert POSTs the contact fields', async () => {
		respond(contact, 201);
		await invoke(contactsUpsert, {
			firstName: 'John',
			lastName: 'Doe',
			identifiers: [
				{
					id: 'example@example.com',
					type: 'email',
					channels: { email: { status: 'subscribed' } },
				},
			],
			tags: ['source: api'],
			customProperties: { externalCreated: '2024-01-01' },
		});
		expectAuthenticated('/api/contacts', 'POST');
		expect(lastRequest().body).toEqual({
			firstName: 'John',
			lastName: 'Doe',
			identifiers: [
				{
					id: 'example@example.com',
					type: 'email',
					channels: { email: { status: 'subscribed' } },
				},
			],
			tags: ['source: api'],
			customProperties: { externalCreated: '2024-01-01' },
		});
	});

	it('contacts.update PATCHes by id', async () => {
		respond(contact);
		await invoke(contactsUpdate, { id: '60a617', firstName: 'Jane' });
		expectAuthenticated('/api/contacts/60a617', 'PATCH');
		expect(lastRequest().body).toEqual({ firstName: 'Jane' });
	});

	it('contacts.updateByEmail PATCHes with the email as a query parameter', async () => {
		respond(contact);
		await invoke(contactsUpdateByEmail, {
			email: 'example@example.com',
			lastName: 'Doe',
		});
		expectAuthenticated('/api/contacts', 'PATCH');
		const sent = lastRequest();
		expect(sent.query.email).toBe('example@example.com');
		expect(sent.body).toEqual({ lastName: 'Doe' });
	});

	it('contacts.addTags POSTs to the tag route', async () => {
		respond(undefined, 202);
		await invoke(contactsAddTags, {
			contactIDs: ['60a617'],
			tags: ['vip'],
		});
		expectAuthenticated('/api/contacts/tags', 'POST');
		expect(lastRequest().body).toEqual({
			contactIDs: ['60a617'],
			emails: undefined,
			phones: undefined,
			segmentID: undefined,
			tags: ['vip'],
		});
	});

	it('contacts.removeTags DELETEs with a body', async () => {
		respond(undefined, 202);
		await invoke(contactsRemoveTags, {
			emails: ['example@example.com'],
			tags: ['vip'],
		});
		expectAuthenticated('/api/contacts/tags', 'DELETE');
		expect(lastRequest().body).toEqual({
			contactIDs: undefined,
			emails: ['example@example.com'],
			phones: undefined,
			segmentID: undefined,
			tags: ['vip'],
		});
	});
});

describe('campaigns', () => {
	it('campaigns.list sends status as repeated query values', async () => {
		respond(campaignsListResponse);
		await invoke(campaignsList, {
			status: ['draft', 'scheduled'],
			channel: ['email', 'sms'],
			nameContains: 'Welcome',
			type: 'regular',
			limit: 10,
		});
		expectAuthenticated('/api/campaigns', 'GET');
		const sent = lastRequest();
		expect(sent.queryAll.status).toEqual(['draft', 'scheduled']);
		expect(sent.queryAll.channel).toEqual(['email', 'sms']);
		expect(sent.query.nameContains).toBe('Welcome');
		expect(sent.query.type).toBe('regular');
		expect(sent.query.limit).toBe('10');
	});

	it('campaigns.get reads by id', async () => {
		respond(campaign);
		await invoke(campaignsGet, { id: 'camp-1' });
		expectAuthenticated('/api/campaigns/camp-1', 'GET');
	});

	it('campaigns.create POSTs the campaign body', async () => {
		respond(campaign, 201);
		await invoke(campaignsCreate, {
			type: 'regular',
			channel: 'email',
			name: 'Welcome Email Campaign',
			content: {
				email: { templateID: 'tpl-1', subject: 'Welcome to Omnisend!' },
			},
			audience: { includedSegmentIDs: ['seg-1'] },
			sendingSettings: { strategy: 'immediate' },
		});
		expectAuthenticated('/api/campaigns', 'POST');
		expect(lastRequest().body).toEqual({
			type: 'regular',
			channel: 'email',
			name: 'Welcome Email Campaign',
			content: {
				email: { templateID: 'tpl-1', subject: 'Welcome to Omnisend!' },
			},
			audience: { includedSegmentIDs: ['seg-1'] },
			sendingSettings: { strategy: 'immediate' },
		});
	});

	it('campaigns.update PATCHes without the id in the body', async () => {
		respond(campaign);
		await invoke(campaignsUpdate, { id: 'camp-1', name: 'Renamed' });
		expectAuthenticated('/api/campaigns/camp-1', 'PATCH');
		expect(lastRequest().body).toEqual({ name: 'Renamed' });
	});

	it('campaigns.delete DELETEs by id', async () => {
		respond(undefined, 204);
		await invoke(campaignsRemove, { id: 'camp-1' });
		expectAuthenticated('/api/campaigns/camp-1', 'DELETE');
	});

	it('campaigns.send POSTs the send action', async () => {
		respond(undefined, 204);
		await invoke(campaignsSend, { id: 'camp-1' });
		expectAuthenticated('/api/campaigns/camp-1/send', 'POST');
	});

	it('campaigns.cancel POSTs the cancel action', async () => {
		respond(undefined, 204);
		await invoke(campaignsCancel, { id: 'camp-1' });
		expectAuthenticated('/api/campaigns/camp-1/cancel', 'POST');
	});

	it('campaigns.copy POSTs the copy action', async () => {
		respond(campaign, 201);
		await invoke(campaignsCopy, { id: 'camp-1' });
		expectAuthenticated('/api/campaigns/camp-1/copy', 'POST');
	});

	it('campaigns.restoreToDraft POSTs the restore action', async () => {
		respond(undefined, 204);
		await invoke(campaignsRestoreToDraft, { id: 'camp-1' });
		expectAuthenticated('/api/campaigns/camp-1/restoreToDraft', 'POST');
	});

	it('campaigns.sendTestEmail POSTs the recipients', async () => {
		respond(undefined, 204);
		await invoke(campaignsSendTestEmail, {
			id: 'camp-1',
			recipients: ['merchant@example.com'],
		});
		expectAuthenticated('/api/campaigns/camp-1/test-email', 'POST');
		expect(lastRequest().body).toEqual({
			recipients: ['merchant@example.com'],
		});
	});

	it('campaigns.getUtm reads the UTM settings', async () => {
		respond(utmResponse);
		await invoke(campaignsGetUtm, { id: 'camp-1' });
		expectAuthenticated('/api/campaigns/camp-1/utm', 'GET');
	});

	it('campaigns.setUtm PUTs the tags', async () => {
		respond(utmResponse);
		await invoke(campaignsSetUtm, {
			id: 'camp-1',
			tags: { source: 'omnisend', medium: 'email', campaign: 'Welcome' },
		});
		expectAuthenticated('/api/campaigns/camp-1/utm', 'PUT');
		expect(lastRequest().body).toEqual({
			tags: { source: 'omnisend', medium: 'email', campaign: 'Welcome' },
			variants: undefined,
		});
	});
});

describe('events', () => {
	it('events.send POSTs the event with its contact', async () => {
		respond(undefined, 202);
		await invoke(eventsSend, {
			eventName: 'placed order',
			eventVersion: 'v2',
			origin: 'api',
			contact: { email: 'example@example.com', firstName: 'John' },
			properties: { orderId: '12345', currency: 'USD' },
		});
		expectAuthenticated('/api/events', 'POST');
		expect(lastRequest().body).toEqual({
			eventName: 'placed order',
			eventVersion: 'v2',
			eventTime: undefined,
			eventID: undefined,
			origin: 'api',
			contact: { email: 'example@example.com', firstName: 'John' },
			properties: { orderId: '12345', currency: 'USD' },
		});
	});

	it('events.queryMetadata POSTs the category filter', async () => {
		respond(eventsMetadataResponse);
		await invoke(eventsQueryMetadata, {
			category: 'automations',
			includeProperties: true,
		});
		expectAuthenticated('/api/event-metadata/query', 'POST');
		expect(lastRequest().body).toEqual({
			category: 'automations',
			events: undefined,
			origins: undefined,
			includeProperties: true,
			excludeCustomEvents: undefined,
		});
	});

	it('events.defineSchema POSTs the property tree', async () => {
		respond(eventWriteResponse, 201);
		await invoke(eventsDefineSchema, {
			name: 'loyalty points earned',
			origin: 'api',
			displayName: 'Loyalty Points Earned',
			properties: { points: { type: 'integer' } },
		});
		expectAuthenticated('/api/event-metadata', 'POST');
		expect(lastRequest().body).toEqual({
			name: 'loyalty points earned',
			origin: 'api',
			displayName: 'Loyalty Points Earned',
			properties: { points: { type: 'integer' } },
		});
	});

	it('events.updateSchema PUTs the merge', async () => {
		respond(eventWriteResponse);
		await invoke(eventsUpdateSchema, {
			name: 'loyalty points earned',
			origin: 'api',
			properties: { points: { type: 'float' } },
		});
		expectAuthenticated('/api/event-metadata', 'PUT');
		expect(lastRequest().body).toEqual({
			name: 'loyalty points earned',
			origin: 'api',
			displayName: undefined,
			properties: { points: { type: 'float' } },
		});
	});
});

describe('products', () => {
	it('products.list pages by offset', async () => {
		respond(productsListResponse);
		await invoke(productsList, {
			offset: 20,
			limit: 10,
			sort: 'updatedAt',
			titleContains: 'shoe',
		});
		expectAuthenticated('/api/products', 'GET');
		expect(lastRequest().query).toEqual({
			offset: '20',
			limit: '10',
			sort: 'updatedAt',
			titleContains: 'shoe',
		});
	});

	it('products.get reads by id', async () => {
		respond(product);
		await invoke(productsGet, { id: 'shoes-blue-123' });
		expectAuthenticated('/api/products/shoes-blue-123', 'GET');
	});

	it('products.create POSTs the product with float prices', async () => {
		respond({ id: product.id }, 201);
		await invoke(productsCreate, {
			id: 'shoes-blue-123',
			title: 'My Product',
			currency: 'USD',
			url: 'https://example.com/product',
			status: 'inStock',
			variants: [
				{
					id: 'shoes-blue-123-42',
					title: 'My Variant',
					price: 9.99,
					url: 'https://example.com/variant',
				},
			],
		});
		expectAuthenticated('/api/products', 'POST');
		expect(lastRequest().body).toEqual({
			id: 'shoes-blue-123',
			title: 'My Product',
			currency: 'USD',
			url: 'https://example.com/product',
			status: 'inStock',
			variants: [
				{
					id: 'shoes-blue-123-42',
					title: 'My Variant',
					price: 9.99,
					url: 'https://example.com/variant',
				},
			],
		});
	});

	it('products.replace PUTs the full product', async () => {
		respond({ id: product.id });
		await invoke(productsReplace, {
			id: 'shoes-blue-123',
			title: 'My Product',
			currency: 'USD',
			url: 'https://example.com/product',
			status: 'outOfStock',
			variants: [
				{
					id: 'shoes-blue-123-42',
					title: 'My Variant',
					price: 12.5,
					url: 'https://example.com/variant',
				},
			],
		});
		expectAuthenticated('/api/products/shoes-blue-123', 'PUT');
		expect(lastRequest().body).toMatchObject({ status: 'outOfStock' });
	});

	it('products.delete DELETEs by id', async () => {
		respond(undefined, 204);
		await invoke(productsRemove, { id: 'shoes-blue-123' });
		expectAuthenticated('/api/products/shoes-blue-123', 'DELETE');
	});
});

describe('categories', () => {
	it('categories.list pages by offset', async () => {
		respond(categoriesListResponse);
		await invoke(categoriesList, { offset: 5, limit: 10, sort: 'title' });
		expectAuthenticated('/api/product-categories', 'GET');
		expect(lastRequest().query).toEqual({
			offset: '5',
			limit: '10',
			sort: 'title',
		});
	});

	it('categories.get reads by id', async () => {
		respond(category);
		await invoke(categoriesGet, { id: 'C1234' });
		expectAuthenticated('/api/product-categories/C1234', 'GET');
	});

	it('categories.create POSTs the category', async () => {
		respond({ categoryID: 'C1234' }, 201);
		await invoke(categoriesCreate, { categoryID: 'C1234', title: 'Shoes' });
		expectAuthenticated('/api/product-categories', 'POST');
		expect(lastRequest().body).toEqual({ categoryID: 'C1234', title: 'Shoes' });
	});

	it('categories.update PATCHes the title', async () => {
		respond({ categoryID: 'C1234' });
		await invoke(categoriesUpdate, { id: 'C1234', title: 'Sneakers' });
		expectAuthenticated('/api/product-categories/C1234', 'PATCH');
		expect(lastRequest().body).toEqual({ title: 'Sneakers' });
	});

	it('categories.delete DELETEs by id', async () => {
		respond(undefined, 204);
		await invoke(categoriesRemove, { id: 'C1234' });
		expectAuthenticated('/api/product-categories/C1234', 'DELETE');
	});
});

describe('templates', () => {
	it('templates.list pages by cursor', async () => {
		respond(templatesListResponse);
		await invoke(templatesList, {
			limit: 20,
			nameContains: 'Welcome',
			sort: 'name',
		});
		expectAuthenticated('/api/email-templates', 'GET');
		expect(lastRequest().query).toEqual({
			limit: '20',
			nameContains: 'Welcome',
			sort: 'name',
		});
	});

	it('templates.get reads by id', async () => {
		respond(template);
		await invoke(templatesGet, { id: '68beca12d2e99b0c8d19fd5e' });
		expectAuthenticated('/api/email-templates/68beca12d2e99b0c8d19fd5e', 'GET');
	});

	it('templates.create POSTs the template', async () => {
		respond(template, 201);
		await invoke(templatesCreate, {
			name: 'Welcome Email 1',
			sections: [{ type: 'header' }],
		});
		expectAuthenticated('/api/email-templates', 'POST');
		expect(lastRequest().body).toEqual({
			name: 'Welcome Email 1',
			sections: [{ type: 'header' }],
			generalSettings: undefined,
		});
	});

	it('templates.replace PUTs the full template', async () => {
		respond(template);
		await invoke(templatesReplace, {
			id: '68beca12d2e99b0c8d19fd5e',
			name: 'Renamed',
		});
		expectAuthenticated('/api/email-templates/68beca12d2e99b0c8d19fd5e', 'PUT');
		expect(lastRequest().body).toEqual({
			name: 'Renamed',
			sections: undefined,
			generalSettings: undefined,
		});
	});

	it('templates.delete DELETEs by id', async () => {
		respond(undefined, 204);
		await invoke(templatesRemove, { id: '68beca12d2e99b0c8d19fd5e' });
		expectAuthenticated(
			'/api/email-templates/68beca12d2e99b0c8d19fd5e',
			'DELETE',
		);
	});

	it('templates.importFromHtml POSTs the html', async () => {
		respond(template, 201);
		await invoke(templatesImportFromHtml, {
			name: 'Imported',
			html: '<html><body>Hi</body></html>',
		});
		expectAuthenticated('/api/email-templates/import', 'POST');
		expect(lastRequest().body).toEqual({
			name: 'Imported',
			html: '<html><body>Hi</body></html>',
		});
	});

	it('templates.render POSTs the render action', async () => {
		respond(renderedTemplate);
		await invoke(templatesRender, { id: '68beca12d2e99b0c8d19fd5e' });
		expectAuthenticated(
			'/api/email-templates/68beca12d2e99b0c8d19fd5e/render',
			'POST',
		);
	});
});

describe('emailContent', () => {
	it('emailContent.get reads by id', async () => {
		respond(template);
		await invoke(emailContentGet, { id: 'content-1' });
		expectAuthenticated('/api/email-content/content-1', 'GET');
	});

	it('emailContent.replace PUTs the sections', async () => {
		respond(template);
		await invoke(emailContentReplace, {
			id: 'content-1',
			sections: [{ type: 'header' }],
		});
		expectAuthenticated('/api/email-content/content-1', 'PUT');
		expect(lastRequest().body).toEqual({
			sections: [{ type: 'header' }],
			generalSettings: undefined,
		});
	});

	it('emailContent.render POSTs the render action', async () => {
		respond(renderedTemplate);
		await invoke(emailContentRender, { id: 'content-1' });
		expectAuthenticated('/api/email-content/content-1/render', 'POST');
	});
});

describe('batches', () => {
	it('batches.create POSTs the batch', async () => {
		respond(batchesCreateResponse, 201);
		await invoke(batchesCreate, {
			endpoint: 'contacts',
			method: 'POST',
			items: [{ identifiers: [{ id: 'a@b.co', type: 'email' }] }],
		});
		expectAuthenticated('/api/batches', 'POST');
		expect(lastRequest().body).toEqual({
			endpoint: 'contacts',
			method: 'POST',
			items: [{ identifiers: [{ id: 'a@b.co', type: 'email' }] }],
			origin: undefined,
		});
	});

	it('batches.list requires the endpoint filter', async () => {
		respond(batchesListResponse);
		await invoke(batchesList, {
			endpoint: 'contacts',
			status: 'finished',
			offset: 10,
		});
		expectAuthenticated('/api/batches', 'GET');
		expect(lastRequest().query).toEqual({
			endpoint: 'contacts',
			status: 'finished',
			offset: '10',
		});
	});

	it('batches.get reads the batch status', async () => {
		respond(batch);
		await invoke(batchesGet, { id: '5f92cbf10cf217478ba93561' });
		expectAuthenticated('/api/batches/5f92cbf10cf217478ba93561', 'GET');
	});

	it('batches.listItems reads the per-item results', async () => {
		respond(batch);
		await invoke(batchesListItems, { id: '5f92cbf10cf217478ba93561' });
		expectAuthenticated('/api/batches/5f92cbf10cf217478ba93561/items', 'GET');
	});
});
