import { logEventFromContext } from 'corsair/core';
import {
	eventsCreate,
	eventsList,
	listsAddProfiles,
	listsCreate,
	listsList,
	listsProfiles,
	metricsAggregate,
	profilesCreate,
	profilesGet,
	profilesList,
	profilesSubscribe,
	segmentsCreate,
	tagGroupsCreate,
	tagsCreate,
	tagsList,
	webhooksCreate,
	webhooksList,
} from './endpoints';
import {
	eventsListResponse,
	jobResponse,
	listResponse,
	listsListResponse,
	metricAggregateResponse,
	profileResponse,
	profilesListResponse,
	tagGroupResponse,
	tagResponse,
	tagsListResponse,
	webhookResponse,
	webhooksListResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pk_test_key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: each endpoint returns its own type.

// Safe: the fake context carries only ctx.key, which is all any endpoint reads.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// unknown: see AnyEndpoint.
	// unknown: see AnyEndpoint.
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

/**
 * A response as Klaviyo sends it: JSON text under `application/vnd.api+json`,
 * which the shared client returns unparsed, so the endpoint has to parse it.
 */
// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/vnd.api+json' },
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
	expect(sent.origin).toBe('https://a.klaviyo.com');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('authorization')).toBe(`Klaviyo-API-Key ${API_KEY}`);
	expect(sent.headers.get('revision')).toBe('2026-10-15');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('profiles', () => {
	it('lists profiles and surfaces the next cursor', async () => {
		respond(profilesListResponse);

		const result = (await invoke(profilesList, { pageSize: 20 })) as {
			data: { id: string }[];
			nextCursor?: string | null;
		};

		expectAuthenticated('/api/profiles', 'GET');
		expect(lastRequest().query).toEqual({ 'page[size]': '20' });
		expect(result.data).toHaveLength(2);
		// The cursor lives inside the full next URL, so it is parsed out.
		expect(result.nextCursor).toBe('bmV4dDo6aWQ6Ok43dW1iVw');
	});

	it('joins the sparse fieldset and extra fields', async () => {
		respond(profilesListResponse);

		await invoke(profilesList, {
			fields: ['email', 'first_name'],
			additionalFields: ['subscriptions'],
			include: ['conversations'],
		});

		expect(lastRequest().query).toEqual({
			'fields[profile]': 'email,first_name',
			'additional-fields[profile]': 'subscriptions',
			include: 'conversations',
		});
	});

	it('sends a filter expression through unchanged', async () => {
		respond(profilesListResponse);

		await invoke(profilesList, { filter: 'equals(email,"a@b.com")' });

		expect(lastRequest().query.filter).toBe('equals(email,"a@b.com")');
	});

	it('rejects a page size over 100', async () => {
		await expect(invoke(profilesList, { pageSize: 101 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets one profile', async () => {
		respond(profileResponse);

		const result = (await invoke(profilesGet, { id: '01H8XYZABC123' })) as {
			data: { id: string; attributes?: { email?: string | null } | null };
		};

		expect(lastRequest().path).toBe('/api/profiles/01H8XYZABC123');
		expect(result.data.attributes?.email).toBe('jordan@acme.com');
	});

	it('creates a profile with the JSON:API envelope', async () => {
		respond(profileResponse, 201);

		await invoke(profilesCreate, {
			email: 'jordan@acme.com',
			first_name: 'Jordan',
		});

		expectAuthenticated('/api/profiles', 'POST');
		// The caller passes flat fields; the envelope is built for them.
		expect(lastRequest().body).toEqual({
			data: {
				type: 'profile',
				attributes: { email: 'jordan@acme.com', first_name: 'Jordan' },
			},
		});
	});

	it('requires an identifier on create', async () => {
		await expect(
			invoke(profilesCreate, { first_name: 'Jordan' }),
		).rejects.toThrow(/email, phone_number or external_id/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an invalid email before sending', async () => {
		await expect(
			invoke(profilesCreate, { email: 'not-an-email' }),
		).rejects.toThrow();
	});

	it('subscribes as a bulk job with the list relationship', async () => {
		respond(jobResponse, 202);

		const result = (await invoke(profilesSubscribe, {
			listId: 'R7QkZp',
			email: 'jordan@acme.com',
			channels: ['email'],
		})) as { data?: { id?: string | null } | null };

		expectAuthenticated('/api/profile-subscription-bulk-create-jobs', 'POST');
		// A job, not the profile: subscription is asynchronous.
		expect(result.data?.id).toBe('Job123');
		expect(lastRequest().body).toMatchObject({
			data: {
				type: 'profile-subscription-bulk-create-job',
				relationships: { list: { data: { type: 'list', id: 'R7QkZp' } } },
			},
		});
	});
});

describe('lists', () => {
	it('lists lists', async () => {
		respond(listsListResponse);

		const result = (await invoke(listsList, {})) as {
			data: { id: string; attributes?: { name?: string | null } | null }[];
		};

		expectAuthenticated('/api/lists', 'GET');
		expect(result.data[0]?.attributes?.name).toBe('Newsletter');
	});

	it('creates a list', async () => {
		respond(listResponse, 201);

		await invoke(listsCreate, { name: 'Newsletter' });

		expectAuthenticated('/api/lists', 'POST');
		expect(lastRequest().body).toEqual({
			data: { type: 'list', attributes: { name: 'Newsletter' } },
		});
	});

	it('adds profiles as a relationship body', async () => {
		respond(undefined, 204);

		const result = (await invoke(listsAddProfiles, {
			id: 'R7QkZp',
			profileIds: ['p1', 'p2'],
		})) as { success: boolean };

		expectAuthenticated('/api/lists/R7QkZp/relationships/profiles', 'POST');
		expect(lastRequest().body).toEqual({
			data: [
				{ type: 'profile', id: 'p1' },
				{ type: 'profile', id: 'p2' },
			],
		});
		expect(result.success).toBe(true);
	});

	it('rejects an empty profile list', async () => {
		await expect(
			invoke(listsAddProfiles, { id: 'R7QkZp', profileIds: [] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads the profiles of a list', async () => {
		respond(profilesListResponse);

		await invoke(listsProfiles, { id: 'R7QkZp' });

		expect(lastRequest().path).toBe('/api/lists/R7QkZp/profiles');
	});
});

describe('segments', () => {
	it('creates a segment with its definition', async () => {
		respond({ data: { type: 'segment', id: 'Sg1', attributes: {} } }, 201);

		await invoke(segmentsCreate, {
			name: 'Engaged',
			definition: { condition_groups: [] },
		});

		expectAuthenticated('/api/segments', 'POST');
		expect(lastRequest().body).toEqual({
			data: {
				type: 'segment',
				attributes: {
					name: 'Engaged',
					definition: { condition_groups: [] },
				},
			},
		});
	});
});

describe('events', () => {
	it('lists events', async () => {
		respond(eventsListResponse);

		const result = (await invoke(eventsList, { pageSize: 10 })) as {
			data: { id: string }[];
		};

		expect(lastRequest().path).toBe('/api/events');
		expect(result.data).toHaveLength(1);
	});

	it('creates an event with the metric and profile as nested objects', async () => {
		// Both are objects inside attributes, not plain ids.
		respond(undefined, 202);

		const result = (await invoke(eventsCreate, {
			metric: 'Placed Order',
			email: 'jordan@acme.com',
			properties: { Total: 129.5 },
		})) as { success: boolean };

		expectAuthenticated('/api/events', 'POST');
		expect(lastRequest().body).toEqual({
			data: {
				type: 'event',
				attributes: {
					metric: {
						data: { type: 'metric', attributes: { name: 'Placed Order' } },
					},
					profile: {
						data: {
							type: 'profile',
							attributes: { email: 'jordan@acme.com' },
						},
					},
					properties: { Total: 129.5 },
				},
			},
		});
		expect(result.success).toBe(true);
	});

	it('sends the profile id when given', async () => {
		respond(undefined, 202);

		await invoke(eventsCreate, {
			metric: 'Viewed Product',
			profileId: 'p1',
			properties: {},
		});

		expect(lastRequest().body).toMatchObject({
			data: {
				attributes: {
					profile: { data: { attributes: { id: 'p1' } } },
				},
			},
		});
	});

	it('requires a profile and properties', async () => {
		await expect(
			invoke(eventsCreate, { metric: 'X', properties: {} }),
		).rejects.toThrow(/profileId or email/);
		await expect(
			invoke(eventsCreate, { metric: 'X', profileId: 'p1' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('metrics', () => {
	it('aggregates into date buckets', async () => {
		respond(metricAggregateResponse);

		const result = (await invoke(metricsAggregate, {
			metricId: 'Mt123',
			measurements: ['count'],
			interval: 'day',
		})) as {
			data?: {
				attributes?: { dates?: { date?: string | null }[] | null } | null;
			} | null;
		};

		expectAuthenticated('/api/metric-aggregates', 'POST');
		expect(lastRequest().body).toEqual({
			data: {
				type: 'metric-aggregate',
				attributes: {
					metric_id: 'Mt123',
					measurements: ['count'],
					interval: 'day',
				},
			},
		});
		expect(result.data?.attributes?.dates).toHaveLength(2);
	});

	it('rejects an interval outside the enum', async () => {
		await expect(
			invoke(metricsAggregate, {
				metricId: 'Mt123',
				measurements: ['count'],
				interval: 'year',
			}),
		).rejects.toThrow();
	});
});

describe('webhooks', () => {
	it('lists webhooks', async () => {
		respond(webhooksListResponse);

		const result = (await invoke(webhooksList, {})) as {
			data: { id: string }[];
		};
		expect(result.data).toHaveLength(1);
	});

	it('creates a webhook with its secret and topics', async () => {
		// The spec marks secret_key and the webhook-topics relationship required.
		respond(webhookResponse, 201);

		await invoke(webhooksCreate, {
			name: 'Order events',
			endpointUrl: 'https://example.com/klaviyo/events',
			secretKey: 'a-long-shared-secret',
			topicIds: ['Placed Order'],
		});

		expectAuthenticated('/api/webhooks', 'POST');
		expect(lastRequest().body).toEqual({
			data: {
				type: 'webhook',
				attributes: {
					name: 'Order events',
					endpoint_url: 'https://example.com/klaviyo/events',
					secret_key: 'a-long-shared-secret',
				},
				relationships: {
					'webhook-topics': {
						data: [{ type: 'webhook-topic', id: 'Placed Order' }],
					},
				},
			},
		});
	});

	it('requires at least one topic', async () => {
		await expect(
			invoke(webhooksCreate, {
				name: 'x',
				endpointUrl: 'https://example.com/x',
				secretKey: 's',
				topicIds: [],
			}),
		).rejects.toThrow();
	});
});

describe('tags', () => {
	it('lists tags', async () => {
		respond(tagsListResponse);

		const result = (await invoke(tagsList, {})) as { data: { id: string }[] };
		expectAuthenticated('/api/tags', 'GET');
		expect(result.data).toHaveLength(1);
	});

	it('creates a tag', async () => {
		respond(tagResponse, 201);

		await invoke(tagsCreate, { name: 'priority' });

		expect(lastRequest().body).toEqual({
			data: { type: 'tag', attributes: { name: 'priority' } },
		});
	});

	it('creates a tag group', async () => {
		respond(tagGroupResponse, 201);

		await invoke(tagGroupsCreate, { name: 'Campaign type' });

		expect(lastRequest().path).toBe('/api/tag-groups');
		expect(lastRequest().body).toMatchObject({
			data: { type: 'tag-group', attributes: { name: 'Campaign type' } },
		});
	});
});

describe('logging', () => {
	it('logs the count without the profile fields', async () => {
		respond(profilesListResponse);

		await invoke(profilesList, {});

		const [, event, fields] = mockLog.mock.calls.at(-1) ?? [];
		expect(event).toBe('klaviyo.profiles.list');
		// A profile carries personal data; only the count is logged.
		expect(JSON.stringify(fields)).not.toContain('jordan@');
		expect(fields).toMatchObject({ count: 2 });
	});
});
