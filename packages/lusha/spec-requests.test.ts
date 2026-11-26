import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LUSHA_SPEC_ROUTES } from './endpoints/generated/spec-ops';
import { LushaSpecInputSchemas } from './endpoints/generated/spec-schemas';
import { lushaEndpointSchemas } from './index';
import {
	BASE,
	currentFetch,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

/**
 * The generated operations against docs.lusha.com/openapi.json: every route
 * sends its documented method and path (path values encoded), and every
 * request example in the reference passes the input schema and goes out as
 * the documented body.
 */
// unknown: the fixtures are arbitrary JSON copied from the reference.
const fixtures = JSON.parse(
	readFileSync(join(__dirname, 'fixtures', 'spec-examples.json'), 'utf8'),
) as {
	responses: Record<string, unknown[]>;
	requests: Record<string, Record<string, unknown>[]>;
};

type Key = keyof typeof LUSHA_SPEC_ROUTES;
type Route = {
	op: string;
	method: string;
	path: string;
	pathParams?: Record<string, string>;
	query?: Record<string, string>;
	body?: readonly string[];
};
const ROUTES = LUSHA_SPEC_ROUTES as Record<Key, Route>;
const KEYS = Object.keys(ROUTES) as Key[];

// unknown: the endpoint tree's function types vary per operation; tests call
// them through this one signature.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;
const { lusha } = jest.requireActual('./index') as typeof import('./index');
const tree = lusha({ key: 'test-key' }).endpoints as unknown as Record<
	string,
	Record<string, AnyEndpoint>
>;

function endpointFor(route: Route): AnyEndpoint {
	const [group, name] = route.op.split('.') as [string, string];
	const fn = tree[group]?.[name];
	if (!fn) throw new Error(`no endpoint for ${route.op}`);
	return fn;
}

/** A path value with characters that must be encoded. */
const RAW_ID = 'a b/1';
const ENCODED_ID = 'a%20b%2F1';

/** Enum path values (filter types) use their first documented value. */
function enumValue(key: Key, field: string): string | undefined {
	const shape = LushaSpecInputSchemas[key].shape as Record<
		string,
		{ options?: readonly string[] }
	>;
	return shape[field]?.options?.[0];
}

function pathInput(key: Key): Record<string, string> {
	return Object.fromEntries(
		Object.values(ROUTES[key].pathParams ?? {}).map((field) => [
			field,
			enumValue(key, field) ?? RAW_ID,
		]),
	);
}

function expectedPath(key: Key): string {
	const route = ROUTES[key];
	let path = route.path;
	for (const [specName, field] of Object.entries(route.pathParams ?? {})) {
		path = path.replace(`{${specName}}`, enumValue(key, field) ?? ENCODED_ID);
	}
	return path;
}

// unknown: a documented response example, or an empty object.
function responseFor(route: Route): unknown {
	return fixtures.responses[route.op]?.[0] ?? {};
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('generated routes', () => {
	it('registers schemas for every generated route', () => {
		for (const key of KEYS) {
			const route = ROUTES[key];
			expect(
				lushaEndpointSchemas[route.op as keyof typeof lushaEndpointSchemas],
			).toBeDefined();
		}
	});

	const bodiless = KEYS.filter((key) => ROUTES[key].body === undefined);
	it.each(bodiless)('%s sends its method and path', async (key) => {
		const route = ROUTES[key];
		mockFetch(jsonResponse(responseFor(route)));
		await endpointFor(route)(makeCtx(), pathInput(key));
		expect(lastCall().init.method).toBe(route.method);
		expect(lastCall().url).toBe(`${BASE}${expectedPath(key)}`);
		expect(lastCall().init.body).toBeUndefined();
	});

	const withExamples = KEYS.flatMap((key) =>
		(fixtures.requests[ROUTES[key].op] ?? []).map(
			(example, index) =>
				[`${ROUTES[key].op} #${index}`, key, example] as const,
		),
	);
	it('has request examples for most body routes', () => {
		expect(withExamples.length).toBeGreaterThan(30);
	});

	it.each(withExamples)(
		'%s: the documented request passes and is sent as documented',
		async (_label, key, example) => {
			const route = ROUTES[key];
			const input = { ...example, ...pathInput(key) };
			const parsed = LushaSpecInputSchemas[key].safeParse(input);
			expect(parsed.error?.issues ?? []).toEqual([]);

			mockFetch(jsonResponse(responseFor(route)));
			await endpointFor(route)(makeCtx(), input);
			expect(lastCall().init.method).toBe(route.method);
			expect(lastCall().url).toBe(`${BASE}${expectedPath(key)}`);
			expect(JSON.parse(String(lastCall().init.body))).toEqual(example);
		},
	);
});

describe('generated request details', () => {
	it('sends query parameters under their spec names', async () => {
		mockFetch(jsonResponse({ data: [] }));
		await tree.contactTables!.listEntities!(makeCtx(), {
			tableId: '482910',
			ownerEmail: 'owner@example.com',
			page: 2,
			size: 50,
		});
		const url = new URL(lastCall().url);
		expect(url.pathname).toBe('/v3/contacts/tables/482910/entities');
		expect(url.searchParams.get('email')).toBe('owner@example.com');
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.get('size')).toBe('50');
	});

	it('sends a DELETE body for removing table entities', async () => {
		mockFetch(jsonResponse({ data: { removed: 2 } }));
		await tree.contactTables!.removeEntities!(makeCtx(), {
			tableId: '482910',
			entityIds: ['10042851', '10042852'],
			owner: { email: 'owner@example.com' },
		});
		expect(lastCall().init.method).toBe('DELETE');
		expect(JSON.parse(String(lastCall().init.body))).toEqual({
			entityIds: ['10042851', '10042852'],
			owner: { email: 'owner@example.com' },
		});
	});

	it('rejects a missing path value before any request', async () => {
		await expect(tree.contactTables!.get!(makeCtx(), {})).rejects.toThrow();
		expect(currentFetch()).not.toHaveBeenCalled();
	});

	it('does not offer regenerateSecret on subscriptions.update', () => {
		const shape = LushaSpecInputSchemas.subscriptionsUpdate.shape;
		expect(Object.keys(shape)).not.toContain('regenerateSecret');
	});

	it('strips the webhook secret from subscription responses', async () => {
		mockFetch(
			jsonResponse({
				id: '507f1f77bcf86cd799439011',
				isActive: true,
				secret: 'whsec_abc123',
			}),
		);
		const result = await tree.subscriptions!.update!(makeCtx(), {
			id: '507f1f77bcf86cd799439011',
			isActive: true,
		});
		expect(JSON.stringify(result)).not.toContain('whsec_abc123');
		expect(result).toMatchObject({ isActive: true });
	});

	it('strips nested secrets from bulk create results', async () => {
		mockFetch(
			jsonResponse(
				{
					total: 1,
					successful: 1,
					failed: 0,
					results: [
						{
							index: 0,
							success: true,
							subscription: { id: 's1', secret: 'whsec_nested' },
						},
					],
				},
				{ status: 201 },
			),
		);
		const result = await tree.subscriptions!.create!(makeCtx(), {
			defaults: {
				entityType: 'contact',
				signalTypes: ['promotion'],
				url: 'https://example.com/webhooks/lusha',
			},
			subscriptions: [{ entityId: '123456' }],
		});
		expect(JSON.stringify(result)).not.toContain('whsec_nested');
	});
});
