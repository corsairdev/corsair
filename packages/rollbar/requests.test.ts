import * as Endpoints from './endpoints/endpoints';
import {
	COMMENT_CREATED,
	COMMENT_PAGE,
	DEPLOY_CREATED,
	DEPLOY_PAGE,
	EVENT_PAGE,
	ITEM,
	ITEM_ID,
	ITEM_PAGE,
	ITEM_RESULT,
	ITEM_UPDATE_RESULT,
	OCCURRENCE_ID,
	OCCURRENCE_PAGE,
	OCCURRENCE_RESULT,
	PROJECT_PAGE,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('items.list', () => {
	it('sends the filters and repeats the level parameter', async () => {
		respond(fetchMock, ITEM_PAGE);

		const result = (await invoke(Endpoints.itemsList, {
			status: 'active',
			level: ['error', 'critical'],
			environment: 'production',
			page: 2,
			limit: 20,
		})) as Awaited<ReturnType<typeof Endpoints.itemsList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/1/items');
		expect(request.query).toMatchObject({
			status: 'active',
			environment: 'production',
			page: '2',
			limit: '20',
		});
		// Level is a repeatable filter, so both values reach the query string.
		expect(request.allQuery('level')).toEqual(['error', 'critical']);
		expect(result.items[0]?.title).toBe(ITEM.title);
		expect(result.total_count).toBe(1);
	});

	it('rejects a level Rollbar does not define', async () => {
		await expect(
			invoke(Endpoints.itemsList, { level: ['fatal'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a page size above the documented maximum', async () => {
		await expect(invoke(Endpoints.itemsList, { limit: 101 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('items.get', () => {
	it('reads one item by id', async () => {
		respond(fetchMock, ITEM_RESULT);

		const result = (await invoke(Endpoints.itemsGet, {
			item_id: ITEM_ID,
		})) as Awaited<ReturnType<typeof Endpoints.itemsGet>>;

		expect(lastRequest(fetchMock).path).toBe(`/api/1/item/${ITEM_ID}`);
		expect(result.item.level).toBe('error');
		expect(result.item.total_occurrences).toBe(42);
	});
});

describe('items.update', () => {
	it('patches the status', async () => {
		respond(fetchMock, ITEM_UPDATE_RESULT);

		const result = (await invoke(Endpoints.itemsUpdate, {
			item_id: ITEM_ID,
			status: 'resolved',
			resolved_in_version: '1.2.3',
		})) as Awaited<ReturnType<typeof Endpoints.itemsUpdate>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe(`/api/1/item/${ITEM_ID}`);
		expect(request.json()).toEqual({
			status: 'resolved',
			resolved_in_version: '1.2.3',
		});
		expect(result.item.status).toBe('resolved');
	});

	it('rejects a status Rollbar does not define', async () => {
		await expect(
			invoke(Endpoints.itemsUpdate, { item_id: ITEM_ID, status: 'closed' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a snooze with no duration', async () => {
		await expect(
			invoke(Endpoints.itemsUpdate, {
				item_id: ITEM_ID,
				snooze_enabled: true,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a snooze with a duration', async () => {
		respond(fetchMock, ITEM_UPDATE_RESULT);

		await invoke(Endpoints.itemsUpdate, {
			item_id: ITEM_ID,
			snooze_enabled: true,
			snooze_expiration_in_seconds: 3600,
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('item comments', () => {
	it('lists the comments on an item', async () => {
		respond(fetchMock, COMMENT_PAGE);

		const result = (await invoke(Endpoints.itemComments, {
			item_id: ITEM_ID,
		})) as Awaited<ReturnType<typeof Endpoints.itemComments>>;

		expect(lastRequest(fetchMock).path).toBe(`/api/1/item/${ITEM_ID}/comments`);
		expect(result.comments[0]?.body).toBe('Fixed in the next deploy.');
	});

	it('adds a comment', async () => {
		respond(fetchMock, COMMENT_CREATED);

		const result = (await invoke(Endpoints.itemCommentCreate, {
			item_id: ITEM_ID,
			body: 'Thanks!',
		})) as Awaited<ReturnType<typeof Endpoints.itemCommentCreate>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.json()).toEqual({ body: 'Thanks!' });
		expect(result.comment_id).toBe(100);
	});

	it('rejects an empty comment', async () => {
		await expect(
			invoke(Endpoints.itemCommentCreate, { item_id: ITEM_ID, body: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('item events', () => {
	it('lists the history events for an item', async () => {
		respond(fetchMock, EVENT_PAGE);

		const result = (await invoke(Endpoints.itemEvents, {
			item_id: ITEM_ID,
		})) as Awaited<ReturnType<typeof Endpoints.itemEvents>>;

		expect(lastRequest(fetchMock).path).toBe(`/api/1/item/${ITEM_ID}/events`);
		expect(result.events[0]?.event_name).toBe('status_change');
	});
});

describe('occurrences', () => {
	it('reads the route that names occurrences instances', async () => {
		respond(fetchMock, OCCURRENCE_PAGE);

		const result = (await invoke(Endpoints.occurrencesList, {
			page: 1,
			limit: 20,
		})) as Awaited<ReturnType<typeof Endpoints.occurrencesList>>;

		expect(lastRequest(fetchMock).path).toBe('/api/1/instances');
		// The route's `instances` array is returned under the plugin's name.
		expect(result.occurrences).toHaveLength(1);
		expect(result.occurrences[0]?.id).toBe(OCCURRENCE_ID);
	});

	it('reads one occurrence', async () => {
		respond(fetchMock, OCCURRENCE_RESULT);

		const result = (await invoke(Endpoints.occurrencesGet, {
			occurrence_id: OCCURRENCE_ID,
		})) as Awaited<ReturnType<typeof Endpoints.occurrencesGet>>;

		expect(lastRequest(fetchMock).path).toBe(
			`/api/1/instance/${OCCURRENCE_ID}`,
		);
		expect(result.occurrence.level).toBe('error');
	});
});

describe('projects and deploys', () => {
	it('lists projects', async () => {
		respond(fetchMock, PROJECT_PAGE);

		const result = (await invoke(Endpoints.projectsList, {})) as Awaited<
			ReturnType<typeof Endpoints.projectsList>
		>;

		expect(result.projects[0]?.name).toBe('Acme Web');
	});

	it('lists deploys for an environment', async () => {
		respond(fetchMock, DEPLOY_PAGE);

		const result = (await invoke(Endpoints.deploysList, {
			environment: 'production',
		})) as Awaited<ReturnType<typeof Endpoints.deploysList>>;

		expect(lastRequest(fetchMock).query).toEqual({
			environment: 'production',
		});
		expect(result.deploys[0]?.revision).toBe('abc1234');
	});

	it('creates a deploy', async () => {
		respond(fetchMock, DEPLOY_CREATED);

		const result = (await invoke(Endpoints.deploysCreate, {
			environment: 'production',
			revision: 'abc1234',
			comment: 'Ship it',
		})) as Awaited<ReturnType<typeof Endpoints.deploysCreate>>;

		expect(lastRequest(fetchMock).json()).toEqual({
			environment: 'production',
			revision: 'abc1234',
			comment: 'Ship it',
		});
		expect(result.deploy_id).toBe(555);
	});

	it('rejects a deploy with no revision', async () => {
		await expect(
			invoke(Endpoints.deploysCreate, { environment: 'production' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('envelope handling', () => {
	it('fails rather than inventing an empty list when the array is missing', async () => {
		respond(fetchMock, { err: 0, result: { page: 1, total_count: 0 } });

		await expect(invoke(Endpoints.itemsList, {})).rejects.toThrow();
	});
});
