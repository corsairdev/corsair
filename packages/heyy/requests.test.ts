import { logEventFromContext } from 'corsair/core';
import {
	apiWebhooksCreate,
	apiWebhooksRemove,
	apiWebhooksSearch,
	apiWebhooksUpdate,
	attributesCreate,
	attributesRemove,
	attributesSearch,
	automationsSearch,
	channelsSearch,
	contactsCreate,
	contactsSearch,
	labelsCreate,
	labelsRemove,
	labelsSearch,
	messageTemplatesSearch,
} from './endpoints';
import {
	attributesCreateResponse,
	attributesSearchResponse,
	automationsSearchResponse,
	channelsSearchResponse,
	contact,
	contactsCreateResponse,
	contactsSearchEmpty,
	contactsSearchResponse,
	deletedNothingResponse,
	deletedResponse,
	labelsCreateResponse,
	labelsSearchResponse,
	messageTemplatesSearchResponse,
	webhookCreateResponse,
	webhookInactive,
	webhooksSearchResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

/** The scope every webhook event needs: at least one channel id. */
const CHANNEL_SCOPE = [{ type: 'channel', ids: ['ch-1'] }];
const API_KEY = 'heyy-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: each endpoint returns its own type.

// Safe: the fake context carries only ctx.key, which is all any endpoint reads.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// unknown: negative cases pass invalid values.
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
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
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated(path: string, method: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.heyy.io');
	// v3 is the base the whole plugin is built on.
	expect(sent.path).toBe(`/v3${path}`);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('contacts.search', () => {
	it('POSTs an empty body and returns the rows with pagination', async () => {
		respond(contactsSearchResponse);

		const result = (await invoke(contactsSearch, {})) as {
			contacts: { id: string; email?: string | null }[];
			pagination: { page: number; limit: number; total: number };
			success: boolean;
		};

		expectAuthenticated('/contacts/search', 'POST');
		expect(lastRequest().body).toEqual({});
		expect(result.contacts).toHaveLength(2);
		expect(result.contacts[0]?.email).toBe('jordan@acme.com');
		expect(result.pagination).toEqual({ page: 0, limit: 25, total: 2 });
		expect(result.success).toBe(true);
	});

	it('sends query, sortBy and pagination as given', async () => {
		respond(contactsSearchResponse);

		await invoke(contactsSearch, {
			query: "equals(email, 'jordan@acme.com')",
			sortBy: 'desc(createdAt)',
			pagination: { page: 1, limit: 50 },
		});

		expect(lastRequest().body).toEqual({
			query: "equals(email, 'jordan@acme.com')",
			sortBy: 'desc(createdAt)',
			pagination: { page: 1, limit: 50 },
		});
	});

	it('omits the keys the caller did not set', async () => {
		// The search body is additionalProperties: false, so an explicit null for
		// an omitted field is not the same as leaving it out.
		respond(contactsSearchResponse);

		await invoke(contactsSearch, { search: 'Jordan' });

		expect(lastRequest().body).toEqual({ search: 'Jordan' });
	});

	it('rejects query and search together', async () => {
		// They filter differently, so a caller passing both usually means one.
		await expect(
			invoke(contactsSearch, {
				query: "equals(email, 'a@b.co')",
				search: 'Jordan',
			}),
		).rejects.toThrow(/structured filter/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a limit above 100 and a negative page', async () => {
		await expect(
			invoke(contactsSearch, { pagination: { page: 0, limit: 101 } }),
		).rejects.toThrow();
		await expect(
			invoke(contactsSearch, { pagination: { page: -1, limit: 10 } }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts the boundaries the spec allows', async () => {
		respond(contactsSearchEmpty);

		await invoke(contactsSearch, { pagination: { page: 0, limit: 100 } });

		expect(lastRequest().body).toEqual({
			pagination: { page: 0, limit: 100 },
		});
	});

	it('returns an empty page rather than failing when nothing matches', async () => {
		respond(contactsSearchEmpty);

		const result = (await invoke(contactsSearch, {
			query: "equals(email, 'nobody@acme.com')",
		})) as { contacts: unknown[]; pagination: { total: number } }; // unknown: the empty page is what matters.

		expect(result.contacts).toEqual([]);
		expect(result.pagination.total).toBe(0);
	});

	it('fails visibly when the rows are not an array', async () => {
		// A 200 with a valid envelope but unreadable rows must not look like a
		// successful empty page.
		respond({
			success: true,
			data: { contacts: [] },
			pagination: { page: 0, limit: 10, total: 0 },
		});

		await expect(invoke(contactsSearch, {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('keeps nested objects in a vendor payload', async () => {
		// vendorDetails and messageContent are unconstrained provider objects, so
		// a response can nest. A scalar-only schema would throw after success.
		respond({
			success: true,
			data: [
				{
					...contact,
					metadata: {
						channel: 'whatsapp',
						nested: { profile: { name: 'Jordan', tags: ['vip'] } },
						counts: [1, 2, 3],
					},
					handles: [
						{
							provider: { id: 'abc', capabilities: { templates: true } },
						},
					],
				},
			],
			pagination: { page: 0, limit: 10, total: 1 },
		});

		const result = (await invoke(contactsSearch, {})) as {
			contacts: { metadata?: Record<string, unknown> | null }[];
		};

		expect(result.contacts[0]?.metadata).toMatchObject({
			channel: 'whatsapp',
			nested: { profile: { name: 'Jordan', tags: ['vip'] } },
		});
	});
});

describe('contacts.create', () => {
	it('POSTs the contact and returns it', async () => {
		respond(contactsCreateResponse);

		const result = (await invoke(contactsCreate, {
			firstName: 'Jordan',
			lastName: 'Reyes',
			email: 'jordan@acme.com',
		})) as { contact: { id: string }; success: boolean };

		expectAuthenticated('/contacts', 'POST');
		expect(lastRequest().body).toEqual({
			firstName: 'Jordan',
			lastName: 'Reyes',
			email: 'jordan@acme.com',
		});
		expect(result.contact.id).toBeTruthy();
		expect(result.success).toBe(true);
	});

	it('sends label ids and attribute values', async () => {
		respond(contactsCreateResponse);

		await invoke(contactsCreate, {
			email: 'jordan@acme.com',
			labels: [{ id: 'lbl-1' }],
			attributes: [{ id: 'attr-1', value: ['pro', 'beta'] }],
		});

		expect(lastRequest().body).toMatchObject({
			labels: [{ id: 'lbl-1' }],
			attributes: [{ id: 'attr-1', value: ['pro', 'beta'] }],
		});
	});

	it('rejects an invalid email', async () => {
		await expect(
			invoke(contactsCreate, { email: 'not-an-email' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a contact with only a phone number', async () => {
		respond(contactsCreateResponse);

		await invoke(contactsCreate, { phoneNumber: '+15550100' });

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('attributes.search', () => {
	it('returns attributes with options and visibility', async () => {
		respond(attributesSearchResponse);

		const result = (await invoke(attributesSearch, {})) as {
			attributes: {
				type: string;
				visibility?: { inbox?: boolean } | null;
				details?: { options?: { value: string }[] | null } | null;
			}[];
			pagination: { total: number };
		};

		expectAuthenticated('/attributes/search', 'POST');
		expect(result.attributes[0]?.type).toBe('single_select');
		expect(result.attributes[0]?.visibility?.inbox).toBe(true);
		expect(result.attributes[0]?.details?.options?.[0]?.value).toBe('pro');
	});
});

describe('attributes.create', () => {
	it('POSTs a select attribute with its options', async () => {
		respond(attributesCreateResponse);

		await invoke(attributesCreate, {
			type: 'single_select',
			displayName: 'Plan',
			visibility: { inbox: true, contacts: true, create: true },
			details: { options: [{ value: 'pro', color: '#3B82F6' }] },
		});

		expectAuthenticated('/attributes', 'POST');
		expect(lastRequest().body).toMatchObject({
			type: 'single_select',
			displayName: 'Plan',
			details: { options: [{ value: 'pro', color: '#3B82F6' }] },
		});
	});

	it('rejects a select attribute with no options', async () => {
		await expect(
			invoke(attributesCreate, {
				type: 'multi_select',
				displayName: 'Tags',
				visibility: { inbox: true, contacts: true, create: true },
			}),
		).rejects.toThrow(/needs at least one option/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects options on a text attribute', async () => {
		await expect(
			invoke(attributesCreate, {
				type: 'text',
				displayName: 'Notes',
				visibility: { inbox: true, contacts: true, create: true },
				details: { options: [{ value: 'x', color: '#000' }] },
			}),
		).rejects.toThrow(/only apply to single_select/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a text attribute with no details', async () => {
		respond(attributesCreateResponse);

		await invoke(attributesCreate, {
			type: 'text',
			displayName: 'Notes',
			visibility: { inbox: false, contacts: true, create: false },
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('rejects a type outside the documented enum', async () => {
		await expect(
			invoke(attributesCreate, {
				type: 'boolean',
				displayName: 'Flag',
				visibility: { inbox: true, contacts: true, create: true },
			}),
		).rejects.toThrow();
	});
});

describe('attributes.remove', () => {
	it('DELETEs by the attribute path segment', async () => {
		respond(deletedResponse);

		const result = (await invoke(attributesRemove, {
			attributeId: 'attr-1',
		})) as { result: { deletedIds: string[] } };

		expectAuthenticated('/attributes/attr-1', 'DELETE');
		expect(result.result.deletedIds).toEqual(['lbl-1']);
	});

	it('percent-encodes the id', async () => {
		respond(deletedResponse);

		await invoke(attributesRemove, { attributeId: 'a b/c' });

		expect(lastRequest().path).toBe('/v3/attributes/a%20b%2Fc');
	});

	it('reports a missing id through notFoundIds, not an error', async () => {
		respond(deletedNothingResponse);

		const result = (await invoke(attributesRemove, {
			attributeId: 'attr-missing',
		})) as { result: { deletedIds: string[]; notFoundIds: string[] } };

		expect(result.result.deletedIds).toEqual([]);
		expect(result.result.notFoundIds).toEqual(['lbl-missing']);
	});
});

describe('labels.search', () => {
	it('returns labels with pagination', async () => {
		respond(labelsSearchResponse);

		const result = (await invoke(labelsSearch, {})) as {
			labels: { name: string; color?: string | null }[];
			pagination: { total: number };
		};

		expectAuthenticated('/labels/search', 'POST');
		expect(result.labels[0]).toMatchObject({ name: 'Priority' });
		expect(result.pagination.total).toBe(1);
	});
});

describe('labels.create', () => {
	it('POSTs the name and colour', async () => {
		respond(labelsCreateResponse);

		const result = (await invoke(labelsCreate, {
			name: 'Priority',
			color: '#EF4444',
		})) as { label: { id: string } };

		expectAuthenticated('/labels', 'POST');
		expect(lastRequest().body).toEqual({ name: 'Priority', color: '#EF4444' });
		expect(result.label.id).toBe('lbl-1');
	});

	it('requires a colour, which the spec marks required', async () => {
		await expect(invoke(labelsCreate, { name: 'Priority' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty name', async () => {
		await expect(
			invoke(labelsCreate, { name: '', color: '#EF4444' }),
		).rejects.toThrow();
	});
});

describe('labels.remove', () => {
	it('DELETEs by the label path segment', async () => {
		respond(deletedResponse);

		await invoke(labelsRemove, { labelId: 'lbl-1' });

		expectAuthenticated('/labels/lbl-1', 'DELETE');
	});
});

describe('apiWebhooks.create', () => {
	it('POSTs the url and events', async () => {
		respond(webhookCreateResponse);

		const result = (await invoke(apiWebhooksCreate, {
			url: 'https://example.com/heyy/events',
			events: [{ type: 'message.received', scopes: CHANNEL_SCOPE }],
		})) as { webhook: { id: string; status: string } };

		expectAuthenticated('/api_webhooks', 'POST');
		expect(lastRequest().body).toEqual({
			url: 'https://example.com/heyy/events',
			events: [{ type: 'message.received', scopes: CHANNEL_SCOPE }],
		});
		expect(result.webhook.status).toBe('active');
	});

	it('sends channel scopes when given', async () => {
		respond(webhookCreateResponse);

		await invoke(apiWebhooksCreate, {
			url: 'https://example.com/heyy/events',
			events: [
				{
					type: 'message.sent',
					scopes: [{ type: 'channel', ids: ['ch-1'] }],
				},
			],
		});

		expect(lastRequest().body).toMatchObject({
			events: [
				{ type: 'message.sent', scopes: [{ type: 'channel', ids: ['ch-1'] }] },
			],
		});
	});

	it('rejects an event with no channel scope, which the spec requires', async () => {
		// openapi-v3.json marks events[].scopes required, and the webhook guide
		// says at least one channel is required per event.
		await expect(
			invoke(apiWebhooksCreate, {
				url: 'https://example.com/heyy/events',
				events: [{ type: 'message.received' }],
			}),
		).rejects.toThrow();
		await expect(
			invoke(apiWebhooksCreate, {
				url: 'https://example.com/heyy/events',
				events: [{ type: 'message.received', scopes: [] }],
			}),
		).rejects.toThrow();
		await expect(
			invoke(apiWebhooksUpdate, {
				webhookId: 'wh-1',
				events: [{ type: 'message.sent' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an http url, which Heyy will not deliver to', async () => {
		await expect(
			invoke(apiWebhooksCreate, {
				url: 'http://example.com/heyy',
				events: [{ type: 'message.received', scopes: CHANNEL_SCOPE }],
			}),
		).rejects.toThrow(/https/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty event list', async () => {
		await expect(
			invoke(apiWebhooksCreate, {
				url: 'https://example.com/heyy',
				events: [],
			}),
		).rejects.toThrow();
	});

	it('rejects an event type outside the enum', async () => {
		await expect(
			invoke(apiWebhooksCreate, {
				url: 'https://example.com/heyy',
				events: [{ type: 'contact.created', scopes: CHANNEL_SCOPE }],
			}),
		).rejects.toThrow();
	});
});

describe('apiWebhooks.search', () => {
	it('returns webhooks with status and events', async () => {
		respond(webhooksSearchResponse);

		const result = (await invoke(apiWebhooksSearch, {})) as {
			webhooks: { status: string; events?: { type: string }[] | null }[];
			pagination: { total: number };
		};

		expectAuthenticated('/api_webhooks/search', 'POST');
		expect(result.webhooks[0]?.status).toBe('active');
		expect(result.webhooks[0]?.events?.[0]?.type).toBe('message.received');
	});
});

describe('apiWebhooks.update', () => {
	it('PUTs only the fields being changed', async () => {
		respond({ success: true, data: webhookInactive });

		const result = (await invoke(apiWebhooksUpdate, {
			webhookId: 'wh-1',
			status: 'inactive',
		})) as { webhook: { status: string } };

		expectAuthenticated('/api_webhooks/wh-1', 'PUT');
		expect(lastRequest().body).toEqual({ status: 'inactive' });
		expect(result.webhook.status).toBe('inactive');
	});

	it('rejects a call that changes nothing', async () => {
		await expect(
			invoke(apiWebhooksUpdate, { webhookId: 'wh-1' }),
		).rejects.toThrow(/at least one/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an http url', async () => {
		await expect(
			invoke(apiWebhooksUpdate, {
				webhookId: 'wh-1',
				url: 'http://example.com/heyy',
			}),
		).rejects.toThrow(/https/);
	});
});

describe('apiWebhooks.remove', () => {
	it('DELETEs by the webhook path segment', async () => {
		respond(deletedResponse);

		const result = (await invoke(apiWebhooksRemove, {
			webhookId: 'wh-1',
		})) as { result: { deletedIds: string[] } };

		expectAuthenticated('/api_webhooks/wh-1', 'DELETE');
		expect(result.result.deletedIds).toEqual(['lbl-1']);
	});
});

describe('channels.search', () => {
	it('returns channels with type and status', async () => {
		respond(channelsSearchResponse);

		const result = (await invoke(channelsSearch, {})) as {
			channels: { type: string; status: string; vendor?: string | null }[];
			pagination: { total: number };
		};

		expectAuthenticated('/channels/search', 'POST');
		expect(result.channels[0]).toMatchObject({
			type: 'whatsapp',
			status: 'connected',
		});
	});
});

describe('automations.search', () => {
	it('returns automations with their status', async () => {
		respond(automationsSearchResponse);

		const result = (await invoke(automationsSearch, {})) as {
			automations: { name: string; status: string }[];
			pagination: { total: number };
		};

		expectAuthenticated('/automations/search', 'POST');
		expect(result.automations[0]).toMatchObject({
			name: 'Welcome flow',
			status: 'active',
		});
	});

	it('filters by status through a query expression', async () => {
		respond(automationsSearchResponse);

		await invoke(automationsSearch, { query: "equals(status, 'paused')" });

		expect(lastRequest().body).toEqual({ query: "equals(status, 'paused')" });
	});
});

describe('messageTemplates.search', () => {
	it('returns templates with content and variables', async () => {
		respond(messageTemplatesSearchResponse);

		const result = (await invoke(messageTemplatesSearch, {})) as {
			messageTemplates: {
				name: string;
				status?: string | null;
				channelId?: string | null;
			}[];
			pagination: { total: number };
		};

		expectAuthenticated('/message_templates/search', 'POST');
		expect(result.messageTemplates[0]).toMatchObject({
			name: 'order_update',
			status: 'active',
			channelId: 'ch-1',
			messageContent: { body: 'Your order {{1}} is on its way.' },
			variables: ['1'],
		});
	});
});

describe('logging', () => {
	it('logs the operation with the page total', async () => {
		respond(contactsSearchResponse);

		await invoke(contactsSearch, { pagination: { page: 0, limit: 25 } });

		const [, event, fields] = mockLog.mock.calls.at(-1) ?? [];
		expect(event).toBe('heyy.contacts.search');
		expect(fields).toMatchObject({ count: 2, total: 2, page: 0 });
	});

	it('logs the created id, not the contact details', async () => {
		respond(contactsCreateResponse);

		await invoke(contactsCreate, {
			email: 'someone@example.com',
			firstName: 'Jordan',
		});

		const [, event, fields] = mockLog.mock.calls.at(-1) ?? [];
		expect(event).toBe('heyy.contacts.create');
		expect(JSON.stringify(fields)).not.toContain('example.com');
		expect(fields).toMatchObject({
			contactId: '3f1a2b4c-0000-4000-8000-000000000001',
		});
	});
});
