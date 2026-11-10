import { logEventFromContext } from 'corsair/core';
import {
	eventsCreate,
	eventsGet,
	eventsList,
	listsAddProfiles,
	listsCreate,
	listsGet,
	listsList,
	listsProfiles,
	listsRemove,
	listsRemoveProfiles,
	listsUpdate,
	metricsAggregate,
	metricsGet,
	metricsList,
	profilesCreate,
	profilesGet,
	profilesList,
	profilesSubscribe,
	profilesUpdate,
	segmentsCreate,
	segmentsGet,
	segmentsList,
	segmentsProfiles,
	segmentsRemove,
	segmentsUpdate,
	tagGroupsCreate,
	tagGroupsList,
	tagGroupsRemove,
	tagsCreate,
	tagsGet,
	tagsList,
	tagsRemove,
	tagsUpdate,
	webhooksCreate,
	webhooksGet,
	webhooksList,
	webhooksRemove,
	webhooksUpdate,
	webhookTopicsList,
} from './endpoints';
import {
	event,
	eventsListResponse,
	list,
	listResponse,
	listsListResponse,
	metric,
	metricAggregateResponse,
	profile,
	profileResponse,
	profilesListResponse,
	segment,
	segmentsListResponse,
	tag,
	tagGroupResponse,
	tagGroupsListResponse,
	tagResponse,
	tagsListResponse,
	webhook,
	webhookResponse,
	webhooksListResponse,
	webhookTopicsListResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pk_test_key';

// The date range every aggregate needs: the spec marks `filter` required.
const AGGREGATE_RANGE = [
	'greater-or-equal(datetime,2026-01-01T00:00:00)',
	'less-than(datetime,2026-01-03T00:00:00)',
];

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
		// The spec gives this route a 202 with no content, so there is no job to
		// read back.
		respond(undefined, 202);

		const result = (await invoke(profilesSubscribe, {
			listId: 'R7QkZp',
			email: 'jordan@acme.com',
			channels: ['email'],
		})) as { success: boolean };

		expectAuthenticated('/api/profile-subscription-bulk-create-jobs', 'POST');
		expect(result).toEqual({ success: true });
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

	it('rejects a subscribe with no email for the default email channel', async () => {
		// The default channel is email, and a job without an address does nothing.
		await expect(
			invoke(profilesSubscribe, { listId: 'R7QkZp' }),
		).rejects.toThrow(/email channel/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an sms subscribe with no phone number', async () => {
		await expect(
			invoke(profilesSubscribe, {
				listId: 'R7QkZp',
				email: 'a@b.co',
				channels: ['sms'],
			}),
		).rejects.toThrow(/phone_number/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a subscribe that has the identifier for each channel', async () => {
		respond(undefined, 202);

		await invoke(profilesSubscribe, {
			listId: 'R7QkZp',
			email: 'a@b.co',
			phone_number: '+15550100',
			channels: ['email', 'sms'],
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
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

	it('puts a profile id beside the resource type, not inside attributes', async () => {
		// The spec's event profile object carries `id` next to `type`; only the
		// email belongs in `attributes`.
		respond(undefined, 202);

		await invoke(eventsCreate, {
			metric: 'Viewed Product',
			profileId: 'p1',
			properties: {},
		});

		expect(lastRequest().body).toEqual({
			data: {
				type: 'event',
				attributes: {
					metric: {
						data: {
							type: 'metric',
							attributes: { name: 'Viewed Product' },
						},
					},
					profile: {
						data: { type: 'profile', id: 'p1', attributes: {} },
					},
					properties: {},
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
			filter: AGGREGATE_RANGE,
		})) as {
			data?: {
				attributes?: {
					dates?: string[] | null;
					data?:
						| {
								dimensions?: string[] | null;
								measurements?: { count?: number[] } | null;
						  }[]
						| null;
				} | null;
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
					filter: AGGREGATE_RANGE,
				},
			},
		});
		// The spec's report: bucket times as strings, the series under `data`.
		expect(result.data?.attributes?.dates).toEqual([
			'2026-01-01T00:00:00+00:00',
			'2026-01-02T00:00:00+00:00',
		]);
		expect(result.data?.attributes?.data?.[0]?.dimensions).toEqual([]);
		expect(result.data?.attributes?.data?.[0]?.measurements?.count).toEqual([
			3, 5,
		]);
	});

	it('sends the page cursor of a longer report', async () => {
		respond(metricAggregateResponse);

		await invoke(metricsAggregate, {
			metricId: 'Mt123',
			measurements: ['count'],
			interval: 'day',
			filter: AGGREGATE_RANGE,
			pageCursor: 'bmV4dA',
		});

		expect(lastRequest().body).toMatchObject({
			data: { attributes: { page_cursor: 'bmV4dA' } },
		});
	});

	it('requires the date range filter the spec marks required', async () => {
		await expect(
			invoke(metricsAggregate, {
				metricId: 'Mt123',
				measurements: ['count'],
				interval: 'day',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an interval outside the enum', async () => {
		await expect(
			invoke(metricsAggregate, {
				metricId: 'Mt123',
				measurements: ['count'],
				interval: 'year',
				filter: AGGREGATE_RANGE,
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

describe('per-endpoint coverage', () => {
	it('events.get reads one event', async () => {
		respond({ data: event });
		const result = (await invoke(eventsGet, { id: 'Ev123' })) as {
			data: { id: string };
		};
		expectAuthenticated('/api/events/Ev123', 'GET');
		expect(result.data.id).toBe('Ev123');
	});

	it('lists.get reads one list', async () => {
		respond({ data: list });
		const result = (await invoke(listsGet, { id: 'R7QkZp' })) as {
			data: { id: string };
		};
		expectAuthenticated('/api/lists/R7QkZp', 'GET');
		expect(result.data.id).toBe('R7QkZp');
	});

	it('lists.update renames with PATCH', async () => {
		respond({ data: list });
		await invoke(listsUpdate, { id: 'R7QkZp', name: 'Renamed' });
		expectAuthenticated('/api/lists/R7QkZp', 'PATCH');
		expect(lastRequest().body).toEqual({
			data: { type: 'list', id: 'R7QkZp', attributes: { name: 'Renamed' } },
		});
	});

	it('lists.remove deletes', async () => {
		respond(undefined, 204);
		const result = (await invoke(listsRemove, { id: 'R7QkZp' })) as {
			success: boolean;
		};
		expectAuthenticated('/api/lists/R7QkZp', 'DELETE');
		expect(result.success).toBe(true);
	});

	it('lists.removeProfiles deletes a relationship', async () => {
		respond(undefined, 204);
		await invoke(listsRemoveProfiles, { id: 'R7QkZp', profileIds: ['p1'] });
		expectAuthenticated('/api/lists/R7QkZp/relationships/profiles', 'DELETE');
		expect(lastRequest().body).toEqual({
			data: [{ type: 'profile', id: 'p1' }],
		});
	});

	it('metrics.get reads one metric', async () => {
		respond({ data: metric });
		const result = (await invoke(metricsGet, { id: 'Mt123' })) as {
			data: { id: string };
		};
		expectAuthenticated('/api/metrics/Mt123', 'GET');
		expect(result.data.id).toBe('Mt123');
	});

	it('metrics.list sends no page size, which the route rejects', async () => {
		respond({ data: [metric], links: { next: null } });
		await invoke(metricsList, { filter: 'equals(name,"Placed Order")' });
		expectAuthenticated('/api/metrics', 'GET');
		expect(lastRequest().query).toEqual({
			filter: 'equals(name,"Placed Order")',
		});
		expect(lastRequest().query).not.toHaveProperty('page[size]');
	});

	it('profiles.update patches by id', async () => {
		respond({ data: profile });
		await invoke(profilesUpdate, { id: 'p1', first_name: 'Jo' });
		expectAuthenticated('/api/profiles/p1', 'PATCH');
		expect(lastRequest().body).toEqual({
			data: { type: 'profile', id: 'p1', attributes: { first_name: 'Jo' } },
		});
	});

	it('profiles.update rejects a no-op', async () => {
		await expect(invoke(profilesUpdate, { id: 'p1' })).rejects.toThrow(
			/at least one/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('segments.get reads one segment', async () => {
		respond({ data: segment });
		const result = (await invoke(segmentsGet, { id: 'SgXy12' })) as {
			data: { id: string };
		};
		expectAuthenticated('/api/segments/SgXy12', 'GET');
		expect(result.data.id).toBe('SgXy12');
	});

	it('segments.list lists', async () => {
		respond(segmentsListResponse);
		await invoke(segmentsList, { pageSize: 10 });
		expectAuthenticated('/api/segments', 'GET');
	});

	it('segments.update patches name or definition', async () => {
		respond({ data: segment });
		await invoke(segmentsUpdate, { id: 'SgXy12', name: 'Renamed' });
		expectAuthenticated('/api/segments/SgXy12', 'PATCH');
	});

	it('segments.update rejects a no-op', async () => {
		await expect(invoke(segmentsUpdate, { id: 'SgXy12' })).rejects.toThrow(
			/at least one/,
		);
	});

	it('segments.remove deletes', async () => {
		respond(undefined, 204);
		await invoke(segmentsRemove, { id: 'SgXy12' });
		expectAuthenticated('/api/segments/SgXy12', 'DELETE');
	});

	it('segments.profiles pages the members', async () => {
		respond(profilesListResponse);
		await invoke(segmentsProfiles, { id: 'SgXy12', pageSize: 10 });
		expectAuthenticated('/api/segments/SgXy12/profiles', 'GET');
	});

	it('tagGroups.list lists groups', async () => {
		respond(tagGroupsListResponse);
		const result = (await invoke(tagGroupsList, {})) as {
			data: { id: string }[];
		};
		expectAuthenticated('/api/tag-groups', 'GET');
		expect(result.data).toHaveLength(1);
	});

	it('tagGroups.remove deletes', async () => {
		respond(undefined, 204);
		await invoke(tagGroupsRemove, { id: 'TgG123' });
		expectAuthenticated('/api/tag-groups/TgG123', 'DELETE');
	});

	it('tags.get reads one tag', async () => {
		respond({ data: tag });
		const result = (await invoke(tagsGet, { id: 'Tg123' })) as {
			data: { id: string };
		};
		expectAuthenticated('/api/tags/Tg123', 'GET');
		expect(result.data.id).toBe('Tg123');
	});

	it('tags.update renames', async () => {
		// The spec gives this route a 204 with no content.
		respond(undefined, 204);
		const result = (await invoke(tagsUpdate, {
			id: 'Tg123',
			name: 'urgent',
		})) as { success: boolean };
		expectAuthenticated('/api/tags/Tg123', 'PATCH');
		expect(result).toEqual({ success: true });
		expect(lastRequest().body).toEqual({
			data: { type: 'tag', id: 'Tg123', attributes: { name: 'urgent' } },
		});
	});

	it('tags.remove deletes', async () => {
		respond(undefined, 204);
		await invoke(tagsRemove, { id: 'Tg123' });
		expectAuthenticated('/api/tags/Tg123', 'DELETE');
	});

	it('webhookTopics.list reads the topics', async () => {
		respond(webhookTopicsListResponse);
		const result = (await invoke(webhookTopicsList, {})) as {
			data: { id: string }[];
		};
		expectAuthenticated('/api/webhook-topics', 'GET');
		expect(result.data[0]?.id).toBe('Placed Order');
	});

	it('webhooks.get reads one webhook', async () => {
		respond({ data: webhook });
		const result = (await invoke(webhooksGet, { id: 'Wh123' })) as {
			data: { id: string };
		};
		expectAuthenticated('/api/webhooks/Wh123', 'GET');
		expect(result.data.id).toBe('Wh123');
	});

	it('webhooks.update patches', async () => {
		respond({ data: webhook });
		await invoke(webhooksUpdate, { id: 'Wh123', enabled: false });
		expectAuthenticated('/api/webhooks/Wh123', 'PATCH');
	});

	it('webhooks.update rejects a no-op', async () => {
		await expect(invoke(webhooksUpdate, { id: 'Wh123' })).rejects.toThrow(
			/at least one/,
		);
	});

	it('webhooks.remove deletes', async () => {
		respond(undefined, 204);
		await invoke(webhooksRemove, { id: 'Wh123' });
		expectAuthenticated('/api/webhooks/Wh123', 'DELETE');
	});
});

describe('the included array', () => {
	it('survives a list response when include was requested', async () => {
		// JSON:API puts related resources in a top-level `included`, which the
		// envelope has to keep or a caller never sees what it asked for.
		respond({
			data: [event],
			included: [{ type: 'profile', id: '01H8XYZABC123', attributes: {} }],
			links: { next: null },
		});

		const result = (await invoke(eventsList, {
			include: ['profile'],
		})) as { included?: { id: string }[] | null };

		expect(result.included).toHaveLength(1);
		expect(result.included?.[0]?.id).toBe('01H8XYZABC123');
	});

	it('survives a single-resource response', async () => {
		respond({
			data: profile,
			included: [{ type: 'conversation', id: 'c1', attributes: {} }],
		});

		const result = (await invoke(profilesGet, {
			id: 'p1',
			include: ['conversations'],
		})) as { included?: { id: string }[] | null };

		expect(result.included?.[0]?.id).toBe('c1');
	});
});

describe('page sizes per route', () => {
	it('lists.list rejects a page size over 10', async () => {
		await expect(invoke(listsList, { pageSize: 11 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('segments.list rejects a page size over 10', async () => {
		await expect(invoke(segmentsList, { pageSize: 11 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('tags.list rejects a page size over 50', async () => {
		await expect(invoke(tagsList, { pageSize: 51 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('events.list allows the 1000 rows the route supports', async () => {
		respond(eventsListResponse);

		await invoke(eventsList, { pageSize: 1000 });

		expect(lastRequest().query).toEqual({ 'page[size]': '1000' });
	});

	it('webhooks.list never sends a page size, which the route does not take', async () => {
		respond(webhooksListResponse);

		await invoke(webhooksList, { pageSize: 20 });

		expect(lastRequest().query).toEqual({});
	});

	it('tagGroups.list sends the cursor for the next page', async () => {
		respond(tagGroupsListResponse);

		await invoke(tagGroupsList, { cursor: 'bmV4dA', pageSize: 25 });

		expect(lastRequest().query).toEqual({
			'page[cursor]': 'bmV4dA',
			'page[size]': '25',
		});
	});
});

describe('profile location', () => {
	it('reads a latitude Klaviyo sends as a string', async () => {
		// The spec types latitude and longitude as string or number.
		respond({
			data: {
				...profile,
				attributes: {
					...profile.attributes,
					location: { latitude: '30.2672', longitude: -97.7431 },
				},
			},
		});

		const result = (await invoke(profilesGet, { id: '01H8XYZABC123' })) as {
			data: {
				attributes?: {
					location?: { latitude?: string | number | null } | null;
				} | null;
			};
		};

		expect(result.data.attributes?.location?.latitude).toBe('30.2672');
	});
});
