import {
	Catalog,
	Destinations,
	Functions,
	Regulations,
	Sources,
	TrackingPlans,
	Warehouses,
	Workspaces,
} from './endpoints';
import { SEGMENT_DEFAULT_PAGE_SIZE } from './client';
import {
	DESTINATION,
	DESTINATION_METADATA,
	FUNCTION,
	PAGINATION,
	REGULATION,
	REGULATION_ENTRY,
	RULE,
	SOURCE,
	SOURCE_METADATA,
	TRACKING_PLAN,
	WAREHOUSE,
	WORKSPACE,
	errorBody,
	forbiddenBody,
	rateLimitedBody,
	sourceEnvelope,
} from './test-fixtures';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is left untyped.
// unknown: each endpoint has its own output type, so no shared return type
// exists narrower than unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = 'sst-test-token';

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

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: TOKEN } as never, input as never);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('workspaces.get returns the workspace', async () => {
		respond({ data: { workspace: WORKSPACE } });
		await expect(invoke(Workspaces.get, {})).resolves.toEqual({
			data: { workspace: WORKSPACE },
		});
	});

	it('sources.list returns sources with pagination and keeps write keys', async () => {
		respond({
			data: {
				sources: [SOURCE],
				pagination: { ...PAGINATION, next: 'Mg==' },
			},
		});
		await expect(invoke(Sources.list, {})).resolves.toEqual({
			data: {
				sources: [SOURCE],
				pagination: { current: PAGINATION.current, totalEntries: 2, next: 'Mg==' },
			},
		});
	});

	it('sources.get returns the source and a null trackingPlanId', async () => {
		respond(sourceEnvelope);
		await expect(invoke(Sources.get, { sourceId: 'qQ1' })).resolves.toEqual(
			sourceEnvelope,
		);
	});

	it('sources.createWriteKey returns the updated source with its new key', async () => {
		const keyed = { ...SOURCE, writeKeys: [...SOURCE.writeKeys, 'wk-new'] };
		respond({ data: { source: keyed } });
		await expect(
			invoke(Sources.createWriteKey, { sourceId: 'qQ1' }),
		).resolves.toEqual({ data: { source: keyed } });
	});

	it('destinations.list passes the catalog-free destination shape through', async () => {
		respond({
			data: { destinations: [DESTINATION], pagination: PAGINATION },
		});
		await expect(invoke(Destinations.list, {})).resolves.toEqual({
			data: { destinations: [DESTINATION], pagination: PAGINATION },
		});
	});

	it('warehouses.getConnectionState returns the enum', async () => {
		respond({ data: { connectionState: 'FAILED' } });
		await expect(
			invoke(Warehouses.getConnectionState, { warehouseId: 'kjU' }),
		).resolves.toEqual({ data: { connectionState: 'FAILED' } });
	});

	it('warehouses.validate returns CONNECTED or FAILED without a job', async () => {
		respond({ data: { status: 'CONNECTED' } });
		await expect(
			invoke(Warehouses.validate, {
				metadataId: '55d3d3aea3c',
				settings: { host: 'db.example.com' },
			}),
		).resolves.toEqual({ data: { status: 'CONNECTED' } });
	});

	it('trackingPlans.listRules returns rules with their JSON schemas', async () => {
		respond({ data: { rules: [RULE], pagination: PAGINATION } });
		await expect(
			invoke(TrackingPlans.listRules, { trackingPlanId: 'tp_1' }),
		).resolves.toEqual({ data: { rules: [RULE], pagination: PAGINATION } });
	});

	it('functions.get accepts the documented null function', async () => {
		respond({ data: { function: null } });
		await expect(
			invoke(Functions.get, { functionId: 'fn_1' }),
		).resolves.toEqual({ data: { function: null } });
	});

	it('functions.deploy returns the deployment status object', async () => {
		respond({ data: { functionDeployment: { status: 'SUCCESS' } } });
		await expect(
			invoke(Functions.deploy, { functionId: 'fn_1' }),
		).resolves.toEqual({ data: { functionDeployment: { status: 'SUCCESS' } } });
	});

	it('catalog.getDestination returns the catalog item', async () => {
		respond({ data: { destinationMetadata: DESTINATION_METADATA } });
		await expect(
			invoke(Catalog.getDestination, { destinationMetadataId: '5gPpjD6ikn' }),
		).resolves.toEqual({
			data: { destinationMetadata: DESTINATION_METADATA },
		});
	});

	it('catalog.listSources returns the catalog page', async () => {
		respond({ data: { sourcesCatalog: [SOURCE_METADATA], pagination: PAGINATION } });
		await expect(invoke(Catalog.listSources, {})).resolves.toEqual({
			data: { sourcesCatalog: [SOURCE_METADATA], pagination: PAGINATION },
		});
	});

	it('regulations.list returns entries whose status field is the enum', async () => {
		respond({ data: { regulations: [REGULATION_ENTRY], pagination: PAGINATION } });
		await expect(invoke(Regulations.list, {})).resolves.toEqual({
			data: { regulations: [REGULATION_ENTRY], pagination: PAGINATION },
		});
	});

	it('regulations.get returns the regulation with overallStatus', async () => {
		respond({ data: { regulation: REGULATION } });
		await expect(
			invoke(Regulations.get, { regulateId: '1qJ' }),
		).resolves.toEqual({ data: { regulation: REGULATION } });
	});

	it('regulations.create returns only the regulateId', async () => {
		respond({ data: { regulateId: '1qJkfE1tpwvQcklImGksLN629wn' } });
		await expect(
			invoke(Regulations.create, {
				regulationType: 'DELETE_ONLY',
				subjectType: 'USER_ID',
				subjectIds: ['user_123'],
			}),
		).resolves.toEqual({ data: { regulateId: '1qJkfE1tpwvQcklImGksLN629wn' } });
	});
});

describe('rejections', () => {
	it.each([
		['sources.list', Sources.list, { count: 0 }],
		['sources.list page over the cap', Sources.list, { count: 1001 }],
		['sources.get', Sources.get, {}],
		['sources.create', Sources.create, { slug: 'x', metadataId: 'm' }],
		['sources.create bad slug', Sources.create, { metadataId: 'm', enabled: true }],
		['sources.removeWriteKey', Sources.removeWriteKey, { sourceId: 'qQ1' }],
		[
			'destinations.create',
			Destinations.create,
			{ sourceId: 'qQ1', metadataId: 'm' },
		],
		['warehouses.create', Warehouses.create, { metadataId: 'm' }],
		['warehouses.validate', Warehouses.validate, { metadataId: 'm' }],
		[
			'trackingPlans.create wrong type',
			TrackingPlans.create,
			{ name: 'x', type: 'LEGACY' },
		],
		['trackingPlans.replaceRules', TrackingPlans.replaceRules, { trackingPlanId: 'tp_1' }],
		['trackingPlans.replaceRules empty', TrackingPlans.replaceRules, { trackingPlanId: 'tp_1', rules: [] }],
		['functions.list', Functions.list, {}],
		[
			'functions.create',
			Functions.create,
			{ code: 'x', displayName: 'n' },
		],
		['regulations.create', Regulations.create, { regulationType: 'DELETE_ONLY', subjectIds: ['u'] }],
		['regulations.create empty subjects', Regulations.create, { regulationType: 'DELETE_ONLY', subjectType: 'USER_ID', subjectIds: [] }],
		['catalog.getDestination', Catalog.getDestination, {}],
	])(
		'%s rejects %o before calling Segment',
		async (_name, endpoint: AnyEndpoint, input) => {
			await expect(invoke(endpoint, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('malformed responses', () => {
	it('rejects a list that lost its pagination object', async () => {
		respond({ data: { sources: [SOURCE] } });
		await expect(invoke(Sources.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});

	it('rejects a delete whose status is not SUCCESS', async () => {
		respond({ data: { status: 'PENDING' } });
		await expect(
			invoke(Sources.remove, { sourceId: 'qQ1' }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects a body that lost its data envelope', async () => {
		respond({ workspace: WORKSPACE });
		await expect(invoke(Workspaces.get, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});

	it('rejects a connection state outside the enum', async () => {
		respond({ data: { connectionState: 'PENDING' } });
		await expect(
			invoke(Warehouses.getConnectionState, { warehouseId: 'kjU' }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects a regulation status outside the documented set', async () => {
		respond({ data: { regulation: { ...REGULATION, overallStatus: 'ARCHIVED' } } });
		await expect(
			invoke(Regulations.get, { regulateId: '1qJ' }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('keeps fields and statuses it does not know', async () => {
		respond({
			data: {
				workspace: { ...WORKSPACE, brandNewField: true },
			},
		});
		await expect(invoke(Workspaces.get, {})).resolves.toEqual({
			data: { workspace: { ...WORKSPACE, brandNewField: true } },
		});
	});
});

describe('error shapes surface to the caller', () => {
	it('surfaces a 403 forbidden with its message', async () => {
		respond(forbiddenBody, 403);
		await expect(invoke(Sources.list, {})).rejects.toMatchObject({
			status: 403,
			message: expect.stringContaining('Not authorized'),
		});
	});

	it('surfaces a 404 not found', async () => {
		respond(errorBody('NotFound', 'Resource not found'), 404);
		await expect(
			invoke(Sources.get, { sourceId: 'nope' }),
		).rejects.toMatchObject({ status: 404 });
	});

	it('surfaces a 429 with its ms delay', async () => {
		respond(rateLimitedBody, 429);
		await expect(invoke(Sources.list, {})).rejects.toMatchObject({
			status: 429,
			retryAfter: 2500,
		});
	});

	it('surfaces a field-scoped validation failure', async () => {
		respond(
			errorBody(
				'input-validation',
				'settings is required',
				'warehouse.metadataId',
			),
			422,
		);
		await expect(
			invoke(Warehouses.validate, {
				metadataId: 'x',
				settings: { host: 'h' },
			}),
		).rejects.toMatchObject({ status: 422, message: expect.stringContaining('settings is required') });
	});

	it('omits the page-size argument when the caller sends none', async () => {
		respond({ data: { sources: [], pagination: PAGINATION } });
		await invoke(Sources.list, {});
		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain(`pagination.count=${SEGMENT_DEFAULT_PAGE_SIZE}`);
	});
});
