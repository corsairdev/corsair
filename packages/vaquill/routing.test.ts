import { logEventFromContext } from 'corsair/core';
import { makeVaquillRequest } from './client';
import { Account, Alerts, SessionLaws, Statutes } from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	VaquillAPIError: class VaquillAPIError extends Error {},
	makeVaquillRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeVaquillRequest);
const mockLog = jest.mocked(logEventFromContext);

// never parameters: any concrete endpoint function is assignable to this
// (parameters are contravariant), so the table needs no per-entry casts.
// The return stays unknown because each endpoint resolves its own shape.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// Partial context stub; call sites cast to `never` because it supplies only
// the key and the db client the endpoints touch.
function createContext() {
	return {
		key: 'vq_key_test',
		options: {},
		db: {
			searchResults: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

beforeEach(() => {
	mockRequest.mockReset().mockResolvedValue({});
	mockLog.mockClear();
});

const cases: Array<{
	name: string;
	endpoint: AnyEndpoint;
	// Each row feeds a different endpoint schema, so these stay unknown and
	// the schemas own validation at call time.
	input: unknown;
	method: string;
	url: string;
	// Minimal body that passes the endpoint's output schema.
	response?: unknown;
}> = [
	{
		name: 'search',
		endpoint: Statutes.search,
		input: { query: 'due process' },
		method: 'POST',
		url: '/us/statutes/search',
		response: { results: [] },
	},
	{
		name: 'count',
		endpoint: Statutes.count,
		input: { corpusType: 'USC', titleNumber: 42 },
		method: 'POST',
		url: '/us/statutes/count',
		response: { count: 0 },
	},
	{
		name: 'coverage',
		endpoint: Statutes.coverage,
		input: {},
		method: 'GET',
		url: '/us/statutes/coverage',
		response: { data: { corpusTypes: [], jurisdictions: [] } },
	},
	{
		name: 'divisions',
		endpoint: Statutes.divisions,
		input: { corpusType: 'USC', titleNumber: 42 },
		method: 'GET',
		url: '/us/statutes/divisions',
		response: { corpusType: 'USC', divisions: [] },
	},
	{
		name: 'resolve',
		endpoint: Statutes.resolve,
		input: { citations: ['42 U.S.C. 1983'] },
		method: 'POST',
		url: '/us/statutes/resolve',
		response: { results: [] },
	},
	{
		name: 'resolveCitation',
		endpoint: Statutes.resolveCitation,
		input: { cite: '42 U.S.C. 1983' },
		method: 'GET',
		url: '/us/statutes/resolve',
		response: { resolved: false },
	},
	{
		name: 'section',
		endpoint: Statutes.section,
		input: { act_id: 'USC_T42_C21_S1983' },
		method: 'GET',
		url: '/us/statutes/section/USC_T42_C21_S1983',
		response: { section: { actId: 'USC_T42_C21_S1983' } },
	},
	{
		name: 'sections',
		endpoint: Statutes.sections,
		input: { actIds: ['USC_T42_C21_S1983'] },
		method: 'POST',
		url: '/us/statutes/sections',
		response: { sections: [] },
	},
	{
		name: 'sectionBody',
		endpoint: Statutes.sectionBody,
		input: { act_id: 'USC_T42_C21_S1983', format: 'plain' },
		method: 'GET',
		url: '/us/statutes/section/USC_T42_C21_S1983/body',
		response: { actId: 'USC_T42_C21_S1983' },
	},
	{
		name: 'sectionChanges',
		endpoint: Statutes.sectionChanges,
		input: { act_id: 'USC_T26_C1_S1', limit: 3 },
		method: 'GET',
		url: '/us/statutes/section/USC_T26_C1_S1/changes',
		response: { actId: 'USC_T26_C1_S1', changes: [] },
	},
	{
		name: 'sectionCitedBy',
		endpoint: Statutes.sectionCitedBy,
		input: { act_id: 'USC_T42_C21_S1983', limit: 100 },
		method: 'GET',
		url: '/us/statutes/section/USC_T42_C21_S1983/cited-by',
		response: { section: { actId: 'USC_T42_C21_S1983' }, citers: [] },
	},
	{
		name: 'sectionCrossState',
		endpoint: Statutes.sectionCrossState,
		input: { act_id: 'USC_T42_C21_S1983', limit: 25 },
		method: 'GET',
		url: '/us/statutes/section/USC_T42_C21_S1983/cross-state',
		response: { section: { actId: 'USC_T42_C21_S1983' }, neighbors: [] },
	},
	{
		name: 'sectionDefinitions',
		endpoint: Statutes.sectionDefinitions,
		input: { act_id: 'USC_T42_C21_S1983' },
		method: 'GET',
		url: '/us/statutes/section/USC_T42_C21_S1983/definitions',
		response: { section: { actId: 'USC_T42_C21_S1983' }, terms: [] },
	},
	{
		name: 'sectionRelated',
		endpoint: Statutes.sectionRelated,
		input: { act_id: 'USC_T42_C21_S1983', limit: 10 },
		method: 'GET',
		url: '/us/statutes/section/USC_T42_C21_S1983/related',
		response: {
			section: { actId: 'USC_T42_C21_S1983' },
			previous: [],
			next: [],
		},
	},
	{
		name: 'enactments',
		endpoint: Statutes.enactments,
		input: { act_id: 'USC_T42_C21_S1983' },
		method: 'GET',
		url: '/us/statutes/section/USC_T42_C21_S1983/enactments',
		response: { actId: 'USC_T42_C21_S1983', enactments: [] },
	},
	{
		name: 'extractCitations',
		endpoint: Statutes.extractCitations,
		input: { text: 'See 42 U.S.C. 1983.' },
		method: 'POST',
		url: '/us/statutes/extract-citations',
		response: { citations: [] },
	},
	{
		name: 'sessionLaws.changes',
		endpoint: SessionLaws.changes,
		input: { jurisdiction: 'ca', limit: 5 },
		method: 'GET',
		url: '/us/session-laws/changes',
		response: { changes: [] },
	},
	{
		name: 'sessionLaws.batch',
		endpoint: SessionLaws.batch,
		input: { ids: ['CA_1988_1234'] },
		method: 'POST',
		url: '/us/session-laws/batch',
		response: { laws: [] },
	},
	{
		name: 'sessionLaws.search',
		endpoint: SessionLaws.search,
		input: { query: 'tenant protections', limit: 25, offset: 59 },
		method: 'POST',
		url: '/us/session-laws/search',
		response: { results: [] },
	},
	{
		name: 'sessionLaws.list',
		endpoint: SessionLaws.list,
		input: { jurisdiction: 'ca', limit: 200 },
		method: 'GET',
		url: '/us/session-laws/list',
		response: { results: [] },
	},
	{
		name: 'sessionLaws.body',
		endpoint: SessionLaws.body,
		input: { session_law_id: 'CA_1988_1234' },
		method: 'GET',
		url: '/us/session-laws/CA_1988_1234/body',
		response: { sessionLawId: 'CA_1988_1234' },
	},
	{
		name: 'sessionLaws.get',
		endpoint: SessionLaws.get,
		input: { session_law_id: 'CA_1988_1234' },
		method: 'GET',
		url: '/us/session-laws/CA_1988_1234',
	},
	{
		name: 'boards',
		endpoint: Alerts.boards,
		input: { limit: 500 },
		method: 'GET',
		url: '/boards',
		response: { data: { boards: [] } },
	},
	{
		name: 'watchesList',
		endpoint: Alerts.watchesList,
		input: { limit: 200 },
		method: 'GET',
		url: '/watches',
	},
	{
		name: 'watchesCreate',
		endpoint: Alerts.watchesCreate,
		input: { corpusType: 'state', state: 'wa', channel: 'webhook' },
		method: 'POST',
		url: '/watches',
	},
	{
		name: 'watchesTest',
		endpoint: Alerts.watchesTest,
		input: { watch_id: 'w1' },
		method: 'POST',
		url: '/watches/w1/test',
	},
	{
		name: 'watchesUpdate',
		endpoint: Alerts.watchesUpdate,
		input: { watch_id: 'w1', isActive: false },
		method: 'PATCH',
		url: '/watches/w1',
	},
	{
		name: 'watchesDelete',
		endpoint: Alerts.watchesDelete,
		input: { watch_id: 'w1' },
		method: 'DELETE',
		url: '/watches/w1',
	},
	{
		name: 'watchChanges',
		endpoint: Alerts.watchChanges,
		input: { watch_id: 'w1', sinceId: 9 },
		method: 'GET',
		url: '/watches/w1/changes',
		response: { data: { changes: [] } },
	},
	{
		name: 'watchChangeDiff',
		endpoint: Alerts.watchChangeDiff,
		input: { watch_id: 'w1', change_id: 9 },
		method: 'GET',
		url: '/watches/w1/changes/9/diff',
		response: { data: { changeId: 9 } },
	},
	{
		name: 'watchDeliveries',
		endpoint: Alerts.watchDeliveries,
		input: { watch_id: 'w1' },
		method: 'GET',
		url: '/watches/w1/deliveries',
		response: { data: { deliveries: [] } },
	},
	{
		name: 'creditsBalance',
		endpoint: Account.creditsBalance,
		input: {},
		method: 'GET',
		url: '/credits/balance',
	},
	{
		name: 'creditsPricing',
		endpoint: Account.creditsPricing,
		input: {},
		method: 'GET',
		url: '/api-credits/pricing',
	},
];

describe('vaquill endpoint routing', () => {
	it.each(cases)(
		'$name calls $method $url',
		async ({ endpoint, input, method, url, response }) => {
			const ctx = createContext();
			mockRequest.mockResolvedValueOnce(response ?? {});
			await endpoint(ctx as never, input as never);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [calledUrl, calledKey, options] = mockRequest.mock.calls[0] ?? [];
			expect(calledUrl).toBe(url);
			expect(calledKey).toBe('vq_key_test');
			expect(options?.method ?? 'GET').toBe(method);
		},
	);

	it('search sends the validated body', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce({ results: [] });
		await Statutes.search(ctx as never, {
			query: 'due process',
			corpusType: ['USC'],
			limit: 5,
		});

		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual({
			query: 'due process',
			corpusType: ['USC'],
			limit: 5,
		});
	});

	it('resolveCitation sends the cite as a query param', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce({ resolved: false });
		await Statutes.resolveCitation(ctx as never, {
			cite: '42 U.S.C. 1983',
			state: 'tx',
		});

		expect(mockRequest.mock.calls[0]?.[2]?.query).toEqual({
			cite: '42 U.S.C. 1983',
			state: 'tx',
			corpusType: undefined,
		});
	});

	it('watchesUpdate strips watch_id from the patch body', async () => {
		const ctx = createContext();
		await Alerts.watchesUpdate(ctx as never, {
			watch_id: 'w1',
			isActive: false,
		});

		expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual({ isActive: false });
	});

	it('section caches the fetched section by actId', async () => {
		mockRequest.mockResolvedValueOnce({
			section: { actId: 'USC_T42_C21_S1983', citation: '42 U.S.C. § 1983' },
		});
		const ctx = createContext();
		await Statutes.section(ctx as never, { act_id: 'USC_T42_C21_S1983' });

		expect(ctx.db.searchResults.upsertByEntityId).toHaveBeenCalledWith(
			'USC_T42_C21_S1983',
			expect.objectContaining({ actId: 'USC_T42_C21_S1983' }),
		);
	});

	it('search caches each hit by actId with the query', async () => {
		mockRequest.mockResolvedValueOnce({
			results: [{ actId: 'USC_T42_C21_S1983' }, { actId: 'USC_T42_C21_S1984' }],
		});
		const ctx = createContext();
		await Statutes.search(ctx as never, { query: 'due process' });

		expect(ctx.db.searchResults.upsertByEntityId).toHaveBeenCalledTimes(2);
		expect(ctx.db.searchResults.upsertByEntityId).toHaveBeenCalledWith(
			'USC_T42_C21_S1983',
			expect.objectContaining({ query: 'due process' }),
		);
	});

	it('a later search keeps the body saved by an earlier section fetch', async () => {
		const ctx = createContext();
		// Mimics the entity client: findByEntityId returns the stored row's
		// data, upsertByEntityId replaces the whole object. The stored data
		// is arbitrary JSON per entity, hence the record of unknown values.
		const rows = new Map<string, Record<string, unknown>>();
		ctx.db.searchResults.findByEntityId.mockImplementation(
			async (entityId: string) => {
				const data = rows.get(entityId);
				return data ? { data } : null;
			},
		);
		ctx.db.searchResults.upsertByEntityId.mockImplementation(
			async (entityId: string, data: Record<string, unknown>) => {
				rows.set(entityId, data);
			},
		);

		mockRequest.mockResolvedValueOnce({
			section: {
				actId: 'USC_T42_C21_S1983',
				body: 'Civil action for deprivation of rights',
			},
		});
		await Statutes.section(ctx as never, { act_id: 'USC_T42_C21_S1983' });

		mockRequest.mockResolvedValueOnce({
			results: [{ actId: 'USC_T42_C21_S1983', title: 'Civil action' }],
		});
		await Statutes.search(ctx as never, { query: 'deprivation' });

		expect(rows.get('USC_T42_C21_S1983')).toEqual({
			actId: 'USC_T42_C21_S1983',
			title: 'Civil action',
			body: 'Civil action for deprivation of rights',
			query: 'deprivation',
			createdAt: expect.any(Date),
		});
	});

	it('rejects an invalid input before any request is made', async () => {
		const ctx = createContext();
		await expect(
			Statutes.search(ctx as never, { query: 'a' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
