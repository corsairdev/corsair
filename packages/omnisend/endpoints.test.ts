import { logEventFromContext } from 'corsair/core';
import {
	batchesCreate,
	batchesGet,
	campaignsCreate,
	campaignsSetUtm,
	contactsList,
	contactsUpsert,
	eventsQueryMetadata,
	eventsSend,
	productsGet,
	templatesGet,
} from './endpoints';
import { nextOffset, withCursor } from './endpoints/call';
import {
	batch,
	contact,
	contactsListResponse,
	eventsMetadataResponse,
	product,
	template,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'omnisend_test_key';

type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: each endpoint returns its own type.

// unknown: each test passes a differently-shaped input; the endpoint's input
// schema validates it.
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

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<Error> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(Error);
	return error as Error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	mockLog.mockClear();
});

describe('output parsing', () => {
	it('contacts.list keeps the envelope and derives nextCursor', async () => {
		respond(contactsListResponse);
		const result = (await invoke(contactsList, {})) as {
			contacts: { id: string; email?: string | null }[];
			paging?: unknown; // unknown: only its pass-through is asserted.
			nextCursor?: string;
		};
		expect(result.contacts).toHaveLength(2);
		expect(result.contacts[0]?.email).toBe('example@example.com');
		expect(result.paging).toEqual(contactsListResponse.paging);
		expect(result.nextCursor).toBe('eyJpZCI6ImNvbnRhY3QtNDU2In0');
	});

	it('contacts.upsert passes a full contact through', async () => {
		respond(contact, 201);
		const result = (await invoke(contactsUpsert, {
			identifiers: [{ id: 'a@b.co', type: 'email' }],
		})) as { id?: string; email?: string | null };
		expect(result.id).toBe(contact.id);
		expect(result.email).toBe(contact.email);
	});

	it('products.get keeps variant prices as floats', async () => {
		respond(product);
		const result = (await invoke(productsGet, { id: 'p1' })) as {
			variants: { price: number }[];
		};
		expect(result.variants?.[0]?.price).toBe(9.99);
	});

	it('templates.get passes the editor trees through', async () => {
		respond(template);
		const result = (await invoke(templatesGet, { id: 't1' })) as {
			sections?: { type: string }[];
		};
		expect(result.sections?.[0]?.type).toBe('header');
	});

	it('batches.get keeps the per-item results', async () => {
		respond(batch);
		const result = (await invoke(batchesGet, { id: 'b1' })) as {
			status?: string;
			responses?: { responseCode: number }[];
		};
		expect(result.status).toBe('inProgress');
		expect(result.responses?.[0]?.responseCode).toBe(201);
	});

	it('events.queryMetadata parses the property tree', async () => {
		respond(eventsMetadataResponse);
		const result = (await invoke(eventsQueryMetadata, {
			category: 'events',
		})) as {
			events: {
				name: string;
				properties?: { orderId?: { type: string } };
			}[];
		};
		expect(result.events[0]?.name).toBe('placed order');
		expect(result.events[0]?.properties?.orderId?.type).toBe('string');
	});
});

describe('rejections', () => {
	it('rejects a wrong-shaped list payload instead of faking an empty page', async () => {
		// A body without the contacts array must fail loudly: mapping it to an
		// empty page would tell the caller there are no contacts.
		respond({ paging: { limit: 50, hasMore: false, cursors: {} } });
		const error = await failure(invoke(contactsList, {}));
		expect(error.name).toBe('ZodError');
	});

	it('rejects a malformed known field', async () => {
		respond({ ...product, variants: 'not-an-array' });
		const error = await failure(invoke(productsGet, { id: 'p1' }));
		expect(error.name).toBe('ZodError');
	});

	it('rejects a status value outside the documented enum', async () => {
		respond({ events: [{ name: 'x', properties: { a: { type: 'map' } } }] });
		const error = await failure(
			invoke(eventsQueryMetadata, { category: 'events' }),
		);
		expect(error.name).toBe('ZodError');
	});

	it('rejects a batch whose counts are strings', async () => {
		respond({ ...batch, totalCount: '100' });
		const error = await failure(invoke(batchesGet, { id: 'b1' }));
		expect(error.name).toBe('ZodError');
	});

	it('rejects a template response missing its id', async () => {
		respond({ name: 'Welcome Email 1' });
		const error = await failure(invoke(templatesGet, { id: 't1' }));
		expect(error.name).toBe('ZodError');
	});
});

describe('input rejections', () => {
	it('rejects tag and status in one contacts.list before any request', async () => {
		// Both restrictions are documented on the route; Omnisend answers 400.
		const error = await failure(
			invoke(contactsList, {
				tag: 'vip',
				status: 'subscribed',
			}),
		);
		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects updatedAtFrom beside email in one contacts.list', async () => {
		const error = await failure(
			invoke(contactsList, {
				updatedAtFrom: '2026-01-01T00:00:00Z',
				email: 'a@b.co',
			}),
		);
		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a regular email campaign with no template', async () => {
		const error = await failure(
			invoke(campaignsCreate, {
				type: 'regular',
				channel: 'email',
			}),
		);
		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an event with no contact identifier', async () => {
		const error = await failure(
			invoke(eventsSend, {
				eventName: 'custom',
				contact: { firstName: 'John' },
			}),
		);
		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects campaigns.setUtm with both tags and variants set', async () => {
		const error = await failure(
			invoke(campaignsSetUtm, {
				id: 'camp-1',
				tags: { source: 'omnisend' },
				variants: { a: { source: 'a' }, b: { source: 'b' } },
			}),
		);
		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects campaigns.setUtm with neither tags nor variants', async () => {
		const error = await failure(invoke(campaignsSetUtm, { id: 'camp-1' }));
		expect(error.name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a batch over the 100-item cap', async () => {
		const error = await failure(
			invoke(batchesCreate, {
				endpoint: 'contacts',
				method: 'POST',
				items: Array.from({ length: 101 }, () => ({})),
			}),
		);
		expect(error.name).toBe('ZodError');
	});

	it('rejects a limit above the documented 250 cap', async () => {
		const error = await failure(invoke(contactsList, { limit: 251 }));
		expect(error.name).toBe('ZodError');
	});

	it('rejects a list envelope that arrives bare', async () => {
		respond([{ id: '60a617' }]);
		const error = await failure(invoke(contactsList, {}));
		expect(error.name).toBe('ZodError');
	});
});

describe('shape helpers', () => {
	it('withCursor passes a null after through as an absent cursor', () => {
		const shaped = withCursor({
			contacts: [],
			paging: { cursors: { after: null, before: null } },
		}) as { nextCursor?: string };
		expect(shaped.nextCursor).toBeUndefined();
	});

	it('nextOffset parses the offset out of the paging.next URL', () => {
		expect(
			nextOffset({
				paging: {
					next: 'https://api.omnisend.com/api/products?limit=100&offset=105',
				},
			}),
		).toBe(105);
		expect(nextOffset({ paging: { next: null } })).toBeUndefined();
		expect(nextOffset({})).toBeUndefined();
		expect(nextOffset({ paging: { next: 'https://x/y' } })).toBeUndefined();
	});
});
