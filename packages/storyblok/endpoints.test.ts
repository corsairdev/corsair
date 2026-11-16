import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { STORYBLOK_HOSTS, segment, spacePath } from './client';
import {
	Assets,
	Components,
	DatasourceEntries,
	Datasources,
	Releases,
	Spaces,
	Stories,
	Tags,
	Webhooks,
} from './endpoints';
import type { UnknownJson } from './json';
import {
	allowedActions,
	asset,
	authProblem,
	component,
	datasource,
	datasourceEntry,
	release,
	space,
	story,
	tag,
	webhook,
} from './test-fixtures';
import { lastRequest, respond } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'storyblok-personal-token';
const SPACE_ID = 288868932106293;

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint(
		{ key: API_KEY, options: { spaceId: SPACE_ID } } as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('client', () => {
	it('maps the five regional hosts', () => {
		expect(STORYBLOK_HOSTS).toEqual({
			eu: 'https://mapi.storyblok.com/v1',
			us: 'https://api-us.storyblok.com/v1',
			ca: 'https://api-ca.storyblok.com/v1',
			ap: 'https://api-ap.storyblok.com/v1',
			cn: 'https://app.storyblokchina.cn/v1',
		});
	});

	it('builds the space path', () => {
		expect(spacePath(123)).toBe('/spaces/123');
	});

	it('encodes a path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});

describe('stories', () => {
	it('lists with the documented filters and sends the token as a raw header', async () => {
		respond(fetchMock, { stories: [story] });

		const result = await invoke(Stories.list, {
			by_slugs: 'posts/*',
			is_published: true,
			per_page: 100,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://mapi.storyblok.com');
		expect(sent.path).toBe(`/v1/spaces/${SPACE_ID}/stories`);
		// Storyblok takes the raw token, not a Bearer-prefixed one.
		expect(sent.headers.get('authorization')).toBe(API_KEY);
		expect(sent.query).toEqual({
			by_slugs: 'posts/*',
			is_published: 'true',
			per_page: '100',
		});
		expect(result).toMatchObject({ stories: [story] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'storyblok.stories.list',
			{ count: 1 },
			'completed',
		);
	});

	it('gets one story by id', async () => {
		respond(fetchMock, { story });

		const result = await invoke(Stories.get, { story_id: 369689 });

		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/stories/369689`,
		);
		expect(result).toEqual({ story });
	});

	it('creates a story and wraps the body in a story key', async () => {
		respond(fetchMock, { story });

		await invoke(Stories.create, {
			name: 'Home',
			slug: 'home',
			content: { component: 'page', title: 'Welcome' },
			publish: true,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			story: {
				name: 'Home',
				slug: 'home',
				content: { component: 'page', title: 'Welcome' },
			},
			publish: true,
			release_id: undefined,
		});
	});

	it('rejects a create with no content, which Storyblok requires', async () => {
		await expect(
			invoke(Stories.create, { name: 'Home', slug: 'home' }),
		).rejects.toThrow(/content/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a create with no slug', async () => {
		await expect(
			invoke(Stories.create, {
				name: 'Home',
				content: { component: 'page' },
			}),
		).rejects.toThrow(/slug/);
	});

	it('updates a story with the id in the path only', async () => {
		respond(fetchMock, { story });

		await invoke(Stories.update, {
			story_id: 369689,
			name: 'Home',
			slug: 'home',
			content: { component: 'page', title: 'Hello' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(`/v1/spaces/${SPACE_ID}/stories/369689`);
		expect(sent.body).toMatchObject({
			story: { name: 'Home', content: { component: 'page', title: 'Hello' } },
		});
		expect(sent.body).not.toHaveProperty('story.story_id');
	});

	it('publishes through a GET, which changes published state', async () => {
		respond(fetchMock, { story });

		await invoke(Stories.publish, { story_id: 369689 });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(`/v1/spaces/${SPACE_ID}/stories/369689/publish`);
	});

	it('adds a story to a release instead of publishing it now', async () => {
		respond(fetchMock, { story });

		await invoke(Stories.publish, { story_id: 369689, release_id: 321 });

		expect(lastRequest(fetchMock).query).toEqual({ release_id: '321' });
	});

	it('unpublishes and deletes', async () => {
		respond(fetchMock, { story });
		await invoke(Stories.unpublish, { story_id: 369689 });
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/stories/369689/unpublish`,
		);

		respond(fetchMock, { story });
		await invoke(Stories.remove, { story_id: 369689 });
		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'DELETE',
			path: `/v1/spaces/${SPACE_ID}/stories/369689`,
		});
	});
});

describe('spaces', () => {
	it('lists spaces above the space prefix', async () => {
		respond(fetchMock, { spaces: [space] });

		const result = await invoke(Spaces.list, {});

		// This route sits above the space, so no /spaces/:id prefix.
		expect(lastRequest(fetchMock).path).toBe('/v1/spaces');
		expect(result).toMatchObject({ spaces: [space] });
	});

	it('reads the configured space at the space root', async () => {
		respond(fetchMock, { space });

		const result = await invoke(Spaces.get, {});

		expect(lastRequest(fetchMock).path).toBe(`/v1/spaces/${SPACE_ID}`);
		expect(result).toEqual({ space });
	});
});

describe('components', () => {
	it('lists, creates, updates and deletes', async () => {
		respond(fetchMock, { components: [component] });
		expect(await invoke(Components.list, {})).toMatchObject({
			components: [component],
		});

		respond(fetchMock, { component });
		await invoke(Components.create, {
			name: 'page',
			schema: { title: { type: 'text' } },
		});
		expect(lastRequest(fetchMock).body).toEqual({
			component: { name: 'page', schema: { title: { type: 'text' } } },
		});

		respond(fetchMock, { component });
		await invoke(Components.update, {
			component_id: 12345,
			name: 'page',
			schema: { title: { type: 'text' } },
		});
		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'PUT',
			path: `/v1/spaces/${SPACE_ID}/components/12345`,
		});

		respond(fetchMock, { component });
		await invoke(Components.remove, { component_id: 12345 });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('rejects a component with no schema', async () => {
		await expect(invoke(Components.create, { name: 'page' })).rejects.toThrow(
			/schema/,
		);
	});
});

describe('datasources', () => {
	it('lists, reads, creates, updates and deletes', async () => {
		respond(fetchMock, { datasources: [datasource] });
		await invoke(Datasources.list, {});
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/datasources`,
		);

		respond(fetchMock, { datasource });
		await invoke(Datasources.get, { datasource_id: 777 });
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/datasources/777`,
		);

		respond(fetchMock, { datasource });
		await invoke(Datasources.create, { name: 'Countries', slug: 'countries' });
		expect(lastRequest(fetchMock).body).toEqual({
			datasource: { name: 'Countries', slug: 'countries' },
		});

		respond(fetchMock, { datasource });
		await invoke(Datasources.update, {
			datasource_id: 777,
			name: 'Countries',
			slug: 'countries-v2',
		});
		expect(lastRequest(fetchMock).body).toEqual({
			datasource: { name: 'Countries', slug: 'countries-v2' },
		});

		respond(fetchMock, { datasource });
		await invoke(Datasources.remove, { datasource_id: 777 });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('datasourceEntries', () => {
	it('lists with the datasource and dimension filters', async () => {
		respond(fetchMock, { datasource_entries: [datasourceEntry] });

		await invoke(DatasourceEntries.list, {
			datasource_id: 777,
			dimension: 'nl',
		});

		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/datasource_entries`,
		);
		expect(lastRequest(fetchMock).query).toEqual({
			datasource_id: '777',
			dimension: 'nl',
		});
	});

	it('creates, reads, updates and deletes', async () => {
		respond(fetchMock, { datasource_entry: datasourceEntry });
		await invoke(DatasourceEntries.create, {
			name: 'Netherlands',
			value: 'nl',
			datasource_id: 777,
		});
		expect(lastRequest(fetchMock).body).toEqual({
			datasource_entry: {
				name: 'Netherlands',
				value: 'nl',
				datasource_id: 777,
			},
		});

		respond(fetchMock, { datasource_entry: datasourceEntry });
		await invoke(DatasourceEntries.get, { datasource_entry_id: 888 });
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/datasource_entries/888`,
		);

		respond(fetchMock, { datasource_entry: datasourceEntry });
		await invoke(DatasourceEntries.update, {
			datasource_entry_id: 888,
			name: 'The Netherlands',
			value: 'nl',
			datasource_id: 777,
			dimension_id: 5,
			dimension_value: 'Nederland',
		});
		expect(lastRequest(fetchMock).method).toBe('PUT');
		expect(lastRequest(fetchMock).body).toEqual({
			datasource_entry: {
				name: 'The Netherlands',
				value: 'nl',
				datasource_id: 777,
				dimension_value: 'Nederland',
			},
			dimension_id: 5,
		});

		respond(fetchMock, { datasource_entry: datasourceEntry });
		await invoke(DatasourceEntries.remove, { datasource_entry_id: 888 });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('tags', () => {
	it('lists, creates with a story, renames and deletes', async () => {
		respond(fetchMock, { tags: [tag] });
		await invoke(Tags.list, {});
		expect(lastRequest(fetchMock).path).toBe(`/v1/spaces/${SPACE_ID}/tags`);

		respond(fetchMock, { tag });
		await invoke(Tags.create, { name: 'home', story_id: 369689 });
		expect(lastRequest(fetchMock).body).toEqual({
			tag: { name: 'home', story_id: 369689 },
		});

		respond(fetchMock, { tag });
		await invoke(Tags.update, { tag_id: '5', name: 'landing' });
		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'PUT',
			path: `/v1/spaces/${SPACE_ID}/tags/5`,
			body: { tag: { name: 'landing' } },
		});

		respond(fetchMock, { tag });
		await invoke(Tags.remove, { tag_id: '5' });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('webhooks', () => {
	it('lists and reads endpoints', async () => {
		respond(fetchMock, { webhook_endpoints: [webhook] });
		await invoke(Webhooks.list, {});
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/webhook_endpoints`,
		);

		respond(fetchMock, { webhook_endpoint: webhook });
		await invoke(Webhooks.get, { webhook_endpoint_id: 4569 });
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/webhook_endpoints/4569`,
		);
	});

	it('creates a webhook with its actions', async () => {
		respond(fetchMock, { webhook_endpoint: webhook });

		await invoke(Webhooks.create, {
			name: 'Rebuild Website',
			endpoint: 'https://example.com',
			actions: ['story.published'],
		});

		expect(lastRequest(fetchMock).body).toEqual({
			webhook_endpoint: {
				name: 'Rebuild Website',
				endpoint: 'https://example.com',
				actions: ['story.published'],
			},
		});
	});

	it('rejects a webhook with no actions, which would never fire', async () => {
		await expect(
			invoke(Webhooks.create, {
				endpoint: 'https://example.com',
				actions: [],
			}),
		).rejects.toThrow(/actions/);
	});

	it('updates and deletes', async () => {
		respond(fetchMock, { webhook_endpoint: webhook });
		await invoke(Webhooks.update, {
			webhook_endpoint_id: 4569,
			endpoint: 'https://example.com',
			actions: ['story.published'],
			activated: false,
		});
		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'PUT',
			path: `/v1/spaces/${SPACE_ID}/webhook_endpoints/4569`,
		});

		respond(fetchMock, { webhook_endpoint: webhook });
		await invoke(Webhooks.remove, { webhook_endpoint_id: 4569 });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('reads the accepted action names rather than hardcoding them', async () => {
		respond(fetchMock, allowedActions);

		const result = await invoke(Webhooks.listActions, {});

		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/webhook_endpoints/allowed_actions`,
		);
		expect(result).toEqual(allowedActions);
	});
});

describe('assets', () => {
	it('lists and reads', async () => {
		respond(fetchMock, { assets: [asset] });
		await invoke(Assets.list, { search: 'logo' });
		expect(lastRequest(fetchMock).query).toEqual({ search: 'logo' });

		respond(fetchMock, { asset });
		await invoke(Assets.get, { asset_id: 900 });
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/assets/900`,
		);
	});

	it('updates only the metadata fields sent', async () => {
		respond(fetchMock, { asset });

		await invoke(Assets.update, { asset_id: 900, alt: 'Company logo' });

		expect(lastRequest(fetchMock).body).toEqual({
			asset: { alt: 'Company logo' },
		});
	});

	it('deletes one and many', async () => {
		respond(fetchMock, { asset });
		await invoke(Assets.remove, { asset_id: 900 });
		expect(lastRequest(fetchMock).method).toBe('DELETE');

		respond(fetchMock, { deleted: 2, message: 'ok' });
		const result = await invoke(Assets.bulkDelete, { ids: [900, 901] });
		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'POST',
			path: `/v1/spaces/${SPACE_ID}/assets/bulk_destroy`,
			body: { ids: [900, 901] },
		});
		expect(result).toMatchObject({ deleted: 2 });
	});

	it('rejects a bulk delete with no ids', async () => {
		await expect(invoke(Assets.bulkDelete, { ids: [] })).rejects.toThrow(/ids/);
	});
});

describe('releases', () => {
	it('lists, reads, creates and deletes', async () => {
		respond(fetchMock, { releases: [release] });
		await invoke(Releases.list, {});
		expect(lastRequest(fetchMock).path).toBe(`/v1/spaces/${SPACE_ID}/releases`);

		respond(fetchMock, { release });
		await invoke(Releases.get, { release_id: 321 });
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/spaces/${SPACE_ID}/releases/321`,
		);

		respond(fetchMock, { release });
		await invoke(Releases.create, { name: 'Spring launch' });
		expect(lastRequest(fetchMock).body).toEqual({
			release: { name: 'Spring launch' },
		});

		respond(fetchMock, { release });
		await invoke(Releases.remove, { release_id: 321 });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('publishes a release with do_release on update', async () => {
		respond(fetchMock, { release });

		await invoke(Releases.update, {
			release_id: 321,
			name: 'Spring launch',
			do_release: true,
		});

		expect(lastRequest(fetchMock).body).toEqual({
			release: { name: 'Spring launch' },
			do_release: true,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'storyblok.releases.update',
			{ releaseId: 321, doRelease: true },
			'completed',
		);
	});
});

describe('error handling', () => {
	it('reads a 401 body and keeps the token out of util.inspect', async () => {
		respond(fetchMock, authProblem, 401);
		const util = await import('node:util');

		const error = await invoke(Stories.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		const failure = error as ApiError;
		expect(failure.status).toBe(401);
		expect(failure.message).toContain('Unauthorized');
		expect(util.inspect(error)).not.toContain(API_KEY);
		expect(failure.message).not.toContain(API_KEY);
	});

	it('reads a 404 as not found, which includes the wrong regional host', async () => {
		respond(fetchMock, { error: 'Not Found' }, 404);

		const error = await invoke(Spaces.get, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
	});
});

describe('space resolution', () => {
	it('uses the configured region host', async () => {
		respond(fetchMock, { stories: [] });

		await Stories.list(
			{ key: API_KEY, options: { spaceId: SPACE_ID, region: 'us' } } as never,
			{} as never,
		);

		expect(lastRequest(fetchMock).origin).toBe('https://api-us.storyblok.com');
	});

	it('reads the space and region from the account when the options omit them', async () => {
		respond(fetchMock, { stories: [] });

		await Stories.list(
			{
				key: API_KEY,
				options: {},
				keys: {
					get_space_id: jest.fn().mockResolvedValue(String(SPACE_ID)),
					get_region: jest.fn().mockResolvedValue('ap'),
				},
			} as never,
			{} as never,
		);

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api-ap.storyblok.com');
		expect(sent.path).toBe(`/v1/spaces/${SPACE_ID}/stories`);
	});

	it('prefers the region option over the stored region', async () => {
		respond(fetchMock, { stories: [] });

		await Stories.list(
			{
				key: API_KEY,
				options: { region: 'us' },
				keys: {
					get_space_id: jest.fn().mockResolvedValue(String(SPACE_ID)),
					get_region: jest.fn().mockResolvedValue(null),
				},
			} as never,
			{} as never,
		);

		expect(lastRequest(fetchMock).origin).toBe('https://api-us.storyblok.com');
	});

	it('lists spaces with no space configured, since that is how one is found', async () => {
		respond(fetchMock, { spaces: [] });

		await Spaces.list(
			{
				key: API_KEY,
				options: { region: 'us' },
				keys: {
					get_space_id: jest.fn().mockResolvedValue(null),
					get_region: jest.fn().mockResolvedValue(null),
				},
			} as never,
			{} as never,
		);

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api-us.storyblok.com');
		expect(sent.path).toBe('/v1/spaces');
	});

	it('throws a clear error when no space is configured', async () => {
		const { AuthMissingError } = jest.requireActual('corsair/core');

		await expect(
			Stories.list(
				{
					key: API_KEY,
					options: {},
					keys: {
						get_space_id: jest.fn().mockResolvedValue(null),
						get_region: jest.fn().mockResolvedValue(null),
					},
				} as never,
				{} as never,
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
