import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	CapsuleCrmAPIError,
	CapsuleCrmRateLimitError,
	makeCapsuleCrmRequest,
} from './client';
import {
	activityTypesGet,
	activityTypesList,
	activityTypesListIcons,
	attachmentsGet,
	attachmentsUpload,
	boardsDelete,
	boardsGet,
	boardsList,
	boardsListStages,
	boardsRestore,
	boardsUpdate,
	categoriesCreate,
	categoriesDelete,
	categoriesGet,
	categoriesList,
	categoriesUpdate,
	countriesList,
	currenciesList,
	customFieldsCreate,
	customFieldsDelete,
	customFieldsGet,
	customFieldsList,
	customFieldsUpdate,
	entriesCreate,
	entriesDelete,
	entriesGet,
	entriesListByDate,
	entriesListForEntity,
	entriesUpdate,
	filtersRun,
	goalsList,
	lostReasonsCreate,
	lostReasonsDelete,
	lostReasonsGet,
	lostReasonsList,
	lostReasonsUpdate,
	milestonesCreate,
	milestonesDelete,
	milestonesGet,
	milestonesList,
	milestonesUpdate,
	opportunitiesAddParty,
	opportunitiesCreate,
	opportunitiesDelete,
	opportunitiesDeleteParty,
	opportunitiesGet,
	opportunitiesList,
	opportunitiesListDeleted,
	opportunitiesListParties,
	opportunitiesListProjects,
	opportunitiesSearch,
	opportunitiesUpdate,
	partiesCreate,
	partiesDelete,
	partiesGet,
	partiesList,
	partiesListDeleted,
	partiesListEmployees,
	partiesListOpportunities,
	partiesListProjects,
	partiesSearch,
	partiesUpdate,
	pipelinesGet,
	pipelinesList,
	pipelinesListMilestones,
	pipelinesUpdate,
	projectsAddParty,
	projectsCreate,
	projectsDelete,
	projectsDeleteParty,
	projectsGet,
	projectsList,
	projectsListDeleted,
	projectsListParties,
	projectsSearch,
	projectsUpdate,
	restHooksList,
	siteGet,
	stagesCreate,
	stagesDelete,
	stagesGet,
	stagesList,
	stagesUpdate,
	tagsDelete,
	tagsGet,
	tagsList,
	tagsUpdate,
	tasksCreate,
	tasksDelete,
	tasksGet,
	tasksList,
	tasksUpdate,
	teamsList,
	titlesCreate,
	titlesDelete,
	titlesList,
	trackDefinitionsCreate,
	trackDefinitionsDelete,
	trackDefinitionsGet,
	trackDefinitionsList,
	trackDefinitionsUpdate,
	tracksCreate,
	tracksDelete,
	tracksGet,
	tracksListForEntity,
	tracksUpdate,
	usersGet,
	usersGetCurrent,
	usersList,
	usersUpdate,
} from './endpoints';
import { CapsuleCrmEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { capsulecrm } from './index';
import { CapsuleCrmSchema } from './schema';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

const originalFetch = globalThis.fetch;

function jsonResponse(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	return {
		ok: status >= 200 && status < 300,
		status,
		statusText: status === 401 ? 'Unauthorized' : 'OK',
		headers: {
			get: (name: string) =>
				headers[name] ?? headers[name.toLowerCase()] ?? null,
		},
		text: async () => (body === undefined ? '' : JSON.stringify(body)),
		json: async () => body,
		arrayBuffer: async () => new ArrayBuffer(0),
	} as never;
}

beforeEach(() => {
	jest.mocked(logEventFromContext).mockReset();
	globalThis.fetch = jest.fn(async () => jsonResponse({ ok: true }));
});

afterEach(() => {
	globalThis.fetch = originalFetch;
});

const ctx = { key: 'test-token', $getAccountId: async () => 'test' } as never;

describe('Capsule CRM plugin', () => {
	it('registers 110 endpoints and Capsule CRM auth', () => {
		const plugin = capsulecrm();
		expect(plugin.id).toBe('capsulecrm');
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(110);
		expect(plugin.authConfig?.api_key?.account).toEqual(['subdomain']);
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://api.capsulecrm.com/oauth/authorise',
		);
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.webhooks).toEqual({});
	});

	it('declares labeled schema entities', () => {
		expect(CapsuleCrmSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(CapsuleCrmSchema.entities).length).toBeGreaterThan(0);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = capsulecrm({ key: 'explicit' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('explicit');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const plugin = capsulecrm();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('official API v2 request mapping', () => {
	it.each([
		['parties.list', 'GET', 'parties', partiesList, {}],
		['parties.get', 'GET', 'parties/1', partiesGet, { id: 1 }],
		['parties.create', 'POST', 'parties', partiesCreate, { type: 'person' }],
		['parties.update', 'PUT', 'parties/1', partiesUpdate, { id: 1 }],
		['parties.delete', 'DELETE', 'parties/1', partiesDelete, { id: 1 }],
		['parties.search', 'GET', 'parties/search', partiesSearch, { q: 'acme' }],
		[
			'parties.listDeleted',
			'GET',
			'parties/deleted',
			partiesListDeleted,
			{ since: '2020-01-01T00:00:00Z' },
		],
		[
			'parties.listEmployees',
			'GET',
			'parties/1/people',
			partiesListEmployees,
			{ id: 1 },
		],
		[
			'parties.listOpportunities',
			'GET',
			'parties/1/opportunities',
			partiesListOpportunities,
			{ id: 1 },
		],
		[
			'parties.listProjects',
			'GET',
			'parties/1/kases',
			partiesListProjects,
			{ id: 1 },
		],
		['opportunities.list', 'GET', 'opportunities', opportunitiesList, {}],
		[
			'opportunities.get',
			'GET',
			'opportunities/1',
			opportunitiesGet,
			{ id: 1 },
		],
		['opportunities.create', 'POST', 'opportunities', opportunitiesCreate, {}],
		[
			'opportunities.update',
			'PUT',
			'opportunities/1',
			opportunitiesUpdate,
			{ id: 1 },
		],
		[
			'opportunities.delete',
			'DELETE',
			'opportunities/1',
			opportunitiesDelete,
			{ id: 1 },
		],
		[
			'opportunities.search',
			'GET',
			'opportunities/search',
			opportunitiesSearch,
			{ q: 'acme' },
		],
		[
			'opportunities.listDeleted',
			'GET',
			'opportunities/deleted',
			opportunitiesListDeleted,
			{ since: '2020-01-01T00:00:00Z' },
		],
		[
			'opportunities.listParties',
			'GET',
			'opportunities/1/parties',
			opportunitiesListParties,
			{ id: 1 },
		],
		[
			'opportunities.addParty',
			'POST',
			'opportunities/1/parties/1',
			opportunitiesAddParty,
			{ id: 1, partyId: 1 },
		],
		[
			'opportunities.deleteParty',
			'DELETE',
			'opportunities/1/parties/1',
			opportunitiesDeleteParty,
			{ id: 1, partyId: 1 },
		],
		[
			'opportunities.listProjects',
			'GET',
			'opportunities/1/kases',
			opportunitiesListProjects,
			{ id: 1 },
		],
		['projects.list', 'GET', 'kases', projectsList, {}],
		['projects.get', 'GET', 'kases/1', projectsGet, { id: 1 }],
		['projects.create', 'POST', 'kases', projectsCreate, {}],
		['projects.update', 'PUT', 'kases/1', projectsUpdate, { id: 1 }],
		['projects.delete', 'DELETE', 'kases/1', projectsDelete, { id: 1 }],
		['projects.search', 'GET', 'kases/search', projectsSearch, { q: 'acme' }],
		[
			'projects.listDeleted',
			'GET',
			'kases/deleted',
			projectsListDeleted,
			{ since: '2020-01-01T00:00:00Z' },
		],
		[
			'projects.listParties',
			'GET',
			'kases/1/parties',
			projectsListParties,
			{ id: 1 },
		],
		[
			'projects.addParty',
			'POST',
			'kases/1/parties/1',
			projectsAddParty,
			{ id: 1, partyId: 1 },
		],
		[
			'projects.deleteParty',
			'DELETE',
			'kases/1/parties/1',
			projectsDeleteParty,
			{ id: 1, partyId: 1 },
		],
		['tasks.list', 'GET', 'tasks', tasksList, {}],
		['tasks.get', 'GET', 'tasks/1', tasksGet, { id: 1 }],
		['tasks.create', 'POST', 'tasks', tasksCreate, {}],
		['tasks.update', 'PUT', 'tasks/1', tasksUpdate, { id: 1 }],
		['tasks.delete', 'DELETE', 'tasks/1', tasksDelete, { id: 1 }],
		['entries.listByDate', 'GET', 'entries', entriesListByDate, {}],
		[
			'entries.listForEntity',
			'GET',
			'parties/1/entries',
			entriesListForEntity,
			{ entity: 'parties', id: 1 },
		],
		['entries.get', 'GET', 'entries/1', entriesGet, { id: 1 }],
		['entries.create', 'POST', 'entries', entriesCreate, { content: 'note' }],
		['entries.update', 'PUT', 'entries/1', entriesUpdate, { id: 1 }],
		['entries.delete', 'DELETE', 'entries/1', entriesDelete, { id: 1 }],
		['categories.list', 'GET', 'categories', categoriesList, {}],
		['categories.get', 'GET', 'categories/1', categoriesGet, { id: 1 }],
		['categories.create', 'POST', 'categories', categoriesCreate, {}],
		['categories.update', 'PUT', 'categories/1', categoriesUpdate, { id: 1 }],
		[
			'categories.delete',
			'DELETE',
			'categories/1',
			categoriesDelete,
			{ id: 1 },
		],
		['milestones.list', 'GET', 'milestones', milestonesList, {}],
		['milestones.get', 'GET', 'milestones/1', milestonesGet, { id: 1 }],
		['milestones.create', 'POST', 'milestones', milestonesCreate, {}],
		['milestones.update', 'PUT', 'milestones/1', milestonesUpdate, { id: 1 }],
		[
			'milestones.delete',
			'DELETE',
			'milestones/1',
			milestonesDelete,
			{ id: 1 },
		],
		['titles.list', 'GET', 'titles', titlesList, {}],
		['titles.create', 'POST', 'titles', titlesCreate, {}],
		['titles.delete', 'DELETE', 'titles/1', titlesDelete, { id: 1 }],
		[
			'customFields.list',
			'GET',
			'parties/fields/definitions',
			customFieldsList,
			{ entity: 'parties' },
		],
		[
			'customFields.get',
			'GET',
			'parties/fields/definitions/1',
			customFieldsGet,
			{ entity: 'parties', id: 1 },
		],
		[
			'customFields.create',
			'POST',
			'parties/fields/definitions',
			customFieldsCreate,
			{ entity: 'parties' },
		],
		[
			'customFields.update',
			'PUT',
			'parties/fields/definitions/1',
			customFieldsUpdate,
			{ entity: 'parties', id: 1 },
		],
		[
			'customFields.delete',
			'DELETE',
			'parties/fields/definitions/1',
			customFieldsDelete,
			{ entity: 'parties', id: 1 },
		],
		['lostReasons.list', 'GET', 'lostreasons', lostReasonsList, {}],
		['lostReasons.get', 'GET', 'lostreasons/1', lostReasonsGet, { id: 1 }],
		['lostReasons.create', 'POST', 'lostreasons', lostReasonsCreate, {}],
		[
			'lostReasons.update',
			'PUT',
			'lostreasons/1',
			lostReasonsUpdate,
			{ id: 1 },
		],
		[
			'lostReasons.delete',
			'DELETE',
			'lostreasons/1',
			lostReasonsDelete,
			{ id: 1 },
		],
		['stages.list', 'GET', 'stages', stagesList, {}],
		['stages.get', 'GET', 'stages/1', stagesGet, { id: 1 }],
		['stages.create', 'POST', 'stages', stagesCreate, {}],
		['stages.update', 'PUT', 'stages/1', stagesUpdate, { id: 1 }],
		['stages.delete', 'DELETE', 'stages/1', stagesDelete, { id: 1 }],
		['tracks.get', 'GET', 'tracks/1', tracksGet, { id: 1 }],
		['tracks.create', 'POST', 'tracks', tracksCreate, {}],
		['tracks.update', 'PUT', 'tracks/1', tracksUpdate, { id: 1 }],
		['tracks.delete', 'DELETE', 'tracks/1', tracksDelete, { id: 1 }],
		[
			'tracks.listForEntity',
			'GET',
			'parties/1/tracks',
			tracksListForEntity,
			{ entity: 'parties', id: 1 },
		],
		[
			'trackDefinitions.list',
			'GET',
			'trackdefinitions',
			trackDefinitionsList,
			{},
		],
		[
			'trackDefinitions.get',
			'GET',
			'trackdefinitions/1',
			trackDefinitionsGet,
			{ id: 1 },
		],
		[
			'trackDefinitions.create',
			'POST',
			'trackdefinitions',
			trackDefinitionsCreate,
			{},
		],
		[
			'trackDefinitions.update',
			'PUT',
			'trackdefinitions/1',
			trackDefinitionsUpdate,
			{ id: 1 },
		],
		[
			'trackDefinitions.delete',
			'DELETE',
			'trackdefinitions/1',
			trackDefinitionsDelete,
			{ id: 1 },
		],
		['boards.list', 'GET', 'boards', boardsList, {}],
		['boards.get', 'GET', 'boards/1', boardsGet, { id: 1 }],
		['boards.update', 'PUT', 'boards/1', boardsUpdate, { id: 1 }],
		['boards.delete', 'DELETE', 'boards/1', boardsDelete, { id: 1 }],
		['boards.restore', 'POST', 'boards/1/restore', boardsRestore, { id: 1 }],
		[
			'boards.listStages',
			'GET',
			'boards/1/stages',
			boardsListStages,
			{ id: 1 },
		],
		['pipelines.list', 'GET', 'pipelines', pipelinesList, {}],
		['pipelines.get', 'GET', 'pipelines/1', pipelinesGet, { id: 1 }],
		['pipelines.update', 'PUT', 'pipelines/1', pipelinesUpdate, { id: 1 }],
		[
			'pipelines.listMilestones',
			'GET',
			'pipelines/1/milestones',
			pipelinesListMilestones,
			{ id: 1 },
		],
		['users.list', 'GET', 'users', usersList, {}],
		['users.getCurrent', 'GET', 'users/current', usersGetCurrent, {}],
		['users.get', 'GET', 'users/1', usersGet, { id: 1 }],
		['users.update', 'PUT', 'users/1', usersUpdate, { id: 1 }],
		['teams.list', 'GET', 'teams', teamsList, {}],
		['site.get', 'GET', 'site', siteGet, {}],
		['restHooks.list', 'GET', 'resthooks', restHooksList, {}],
		['activityTypes.list', 'GET', 'activitytypes', activityTypesList, {}],
		[
			'activityTypes.get',
			'GET',
			'activitytypes/1',
			activityTypesGet,
			{ id: 1 },
		],
		[
			'activityTypes.listIcons',
			'GET',
			'activitytypes/icons',
			activityTypesListIcons,
			{},
		],
		['countries.list', 'GET', 'countries', countriesList, {}],
		['currencies.list', 'GET', 'currencies', currenciesList, {}],
		['goals.list', 'GET', 'goals', goalsList, {}],
		['tags.list', 'GET', 'parties/tags', tagsList, { entity: 'parties' }],
		[
			'tags.get',
			'GET',
			'parties/tags/1',
			tagsGet,
			{ entity: 'parties', id: 1 },
		],
		[
			'tags.update',
			'PUT',
			'parties/tags/1',
			tagsUpdate,
			{ entity: 'parties', id: 1 },
		],
		[
			'tags.delete',
			'DELETE',
			'parties/tags/1',
			tagsDelete,
			{ entity: 'parties', id: 1 },
		],
		[
			'filters.run',
			'POST',
			'parties/filters/results',
			filtersRun,
			{
				entity: 'parties',
				conditions: [{ field: 'tag', operator: 'is', value: 'VIP' }],
			},
		],
	] as const)('%s → %s %s', async (_name, method, url, handler, input) => {
		await (handler as (c: typeof ctx, i: never) => Promise<unknown>)(
			ctx,
			input as never,
		);
		expect(globalThis.fetch).toHaveBeenCalled();
		const [calledUrl, init] = (globalThis.fetch as jest.Mock).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(init.method).toBe(method);
		expect(new URL(calledUrl).pathname).toBe(`/api/v2/${url}`);
	});
});

describe('client errors', () => {
	it('preserves 429 Retry-After on CapsuleCrmRateLimitError', async () => {
		globalThis.fetch = jest.fn(async () =>
			jsonResponse({ error: 'rate limit reached' }, 429, {
				'Retry-After': '2',
			}),
		);
		const err = await makeCapsuleCrmRequest('parties', 'k').catch((e) => e);
		expect(err).toBeInstanceOf(CapsuleCrmRateLimitError);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		const handled = await errorHandlers.RATE_LIMIT_ERROR.handler(err as Error);
		expect(handled.headersRetryAfterMs).toBe(2000);
	});

	it('maps 401 to CapsuleCrmAPIError for AUTH_ERROR', async () => {
		globalThis.fetch = jest.fn(async () =>
			jsonResponse({ message: 'Requires authentication' }, 401),
		);
		const err = await makeCapsuleCrmRequest('parties', 'bad').catch((e) => e);
		expect(err).toBeInstanceOf(CapsuleCrmAPIError);
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
	});
});

describe('input schemas', () => {
	it('rejects fractional resource ids', () => {
		expect(
			CapsuleCrmEndpointInputSchemas.partiesGet.safeParse({ id: 1.5 }).success,
		).toBe(false);
		expect(
			CapsuleCrmEndpointInputSchemas.partiesGet.safeParse({ id: 12 }).success,
		).toBe(true);
	});
});

describe('attachments', () => {
	it('uploads via POST /attachments/upload', async () => {
		globalThis.fetch = jest.fn(async () =>
			jsonResponse({ upload: { token: 'tok' } }),
		);
		const result = await attachmentsUpload(ctx, {
			filename: 'a.txt',
			contentType: 'text/plain',
			contentBase64: Buffer.from('hi').toString('base64'),
		});
		expect(result).toEqual({ upload: { token: 'tok' } });
		expect(globalThis.fetch).toHaveBeenCalledWith(
			'https://api.capsulecrm.com/api/v2/attachments/upload',
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('downloads via GET /attachments/{id}', async () => {
		globalThis.fetch = jest.fn(async () => {
			return {
				ok: true,
				status: 200,
				headers: {
					get: (name: string) =>
						name === 'content-type' ? 'application/pdf' : null,
				},
				arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
			} as never;
		});
		const result = await attachmentsGet(ctx, { id: 9 });
		expect(result.contentBase64).toBe(
			Buffer.from([1, 2, 3]).toString('base64'),
		);
		expect(globalThis.fetch).toHaveBeenCalledWith(
			'https://api.capsulecrm.com/api/v2/attachments/9',
			expect.any(Object),
		);
	});

	it('keeps Retry-After on attachment 429', async () => {
		globalThis.fetch = jest.fn(async () =>
			jsonResponse({ error: 'rate limit reached' }, 429, {
				'Retry-After': '3',
			}),
		);
		const uploadErr = await attachmentsUpload(ctx, {
			filename: 'a.txt',
			contentType: 'text/plain',
			contentBase64: Buffer.from('hi').toString('base64'),
		}).catch((e) => e);
		expect(uploadErr).toBeInstanceOf(CapsuleCrmRateLimitError);
		expect(
			(await errorHandlers.RATE_LIMIT_ERROR.handler(uploadErr as Error))
				.headersRetryAfterMs,
		).toBe(3000);

		globalThis.fetch = jest.fn(async () =>
			jsonResponse(undefined, 429, { 'Retry-After': '4' }),
		);
		const downloadErr = await attachmentsGet(ctx, { id: 9 }).catch((e) => e);
		expect(downloadErr).toBeInstanceOf(CapsuleCrmRateLimitError);
		expect(
			(await errorHandlers.RATE_LIMIT_ERROR.handler(downloadErr as Error))
				.headersRetryAfterMs,
		).toBe(4000);
	});
});
