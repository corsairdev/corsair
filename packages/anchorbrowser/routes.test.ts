import { request } from 'corsair/http';
import { anchorBrowserRoutes } from './endpoints/routes';
import { AnchorBrowserEndpointInputSchemas } from './endpoints/types';
import type { AnchorBrowserContext } from './index';
import { anchorbrowser } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return { ...original, request: jest.fn() };
});

const mockRequest = request as jest.Mock;

const mockCtx = {
	key: 'test-api-key',
	options: {},
	db: {},
	// Test-only partial context; the factory only reads `key` and `db`.
} as unknown as AnchorBrowserContext;

type LooseRoute = {
	group: string;
	name: string;
	method: string;
	path: string;
	pathParams?: readonly string[];
};

const allRoutes = anchorBrowserRoutes as readonly LooseRoute[];

function endpointFor(route: LooseRoute) {
	const plugin = anchorbrowser({ key: 'test-api-key' });
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<
			string,
			(
				ctx: AnchorBrowserContext,
				input: Record<string, unknown>,
			) => Promise<unknown>
		>
	>;
	const handler = groups[route.group]?.[route.name];
	if (!handler) {
		throw new Error(`missing endpoint ${route.group}.${route.name}`);
	}
	return handler;
}

/** One synthetic value per declared path param, in declaration order. */
function pathParamValues(route: LooseRoute) {
	const input: Record<string, unknown> = {};
	const ordered: string[] = [];
	for (const param of route.pathParams ?? []) {
		const value = `test-${param}`;
		input[param] = value;
		ordered.push(value);
	}
	return { input, ordered };
}

function expectedUrlFor(route: LooseRoute, ordered: string[]) {
	let index = 0;
	return route.path.replace(/\{[^}]+\}/g, () => {
		const value = ordered[index];
		index += 1;
		return encodeURIComponent(value ?? '');
	});
}

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ ok: true });
});

describe('AnchorBrowser route wiring', () => {
	it('covers all 64 documented operations', () => {
		expect(allRoutes).toHaveLength(64);
	});

	it.each(allRoutes.map((r) => [`${r.group}.${r.name}`, r] as const))(
		'%s calls its declared method and fully-resolved path',
		async (_label, route) => {
			const { input, ordered } = pathParamValues(route);

			await endpointFor(route)(mockCtx, input);

			const sent = mockRequest.mock.calls[0]?.[1];
			expect(sent).toBeDefined();
			expect(sent.method).toBe(route.method);
			// The original suite only checked that no `{` survived; assert the
			// exact URL so a wrong path template cannot pass.
			expect(sent.url).toBe(expectedUrlFor(route, ordered));
			expect(sent.url).not.toContain('{');
		},
	);

	it('never sends a path parameter in the request body', async () => {
		for (const route of allRoutes) {
			if (!route.pathParams?.length) continue;
			const { input } = pathParamValues(route);

			mockRequest.mockClear();
			await endpointFor(route)(mockCtx, input);

			const body = mockRequest.mock.calls[0]?.[1]?.body;
			if (body === undefined) continue;
			for (const param of route.pathParams) {
				expect(Object.keys(body)).not.toContain(param);
			}
		}
	});
});

describe('AnchorBrowser list pagination', () => {
	it('sends page and limit as query parameters on listSessions', async () => {
		const route = allRoutes.find((r) => r.name === 'listSessions');
		if (!route) throw new Error('listSessions route missing');

		await endpointFor(route)(mockCtx, { page: 2, limit: 25 });

		const sent = mockRequest.mock.calls[0]?.[1];
		expect(sent.url).toBe('/sessions');
		expect(sent.query).toMatchObject({ page: 2, limit: 25 });
		// Query params must not also be posted in the body.
		expect(sent.body).toBeUndefined();
	});

	it('passes documented listSessions filters through as query parameters', async () => {
		const route = allRoutes.find((r) => r.name === 'listSessions');
		if (!route) throw new Error('listSessions route missing');

		await endpointFor(route)(mockCtx, {
			status: 'running',
			sort_by: 'created_at',
			sort_order: 'desc',
			profile_name: 'demo',
		});

		expect(mockRequest.mock.calls[0]?.[1]?.query).toMatchObject({
			status: 'running',
			sort_by: 'created_at',
			sort_order: 'desc',
			profile_name: 'demo',
		});
	});

	it('declares pagination on every list route the API documents it for', () => {
		const paginated = ['listSessions', 'listTasks', 'listTaskExecutions'];
		for (const name of paginated) {
			const route = allRoutes.find((r) => r.name === name);
			if (!route) throw new Error(`${name} route missing`);
			const declared = (route as { queryParams?: readonly string[] })
				.queryParams;
			expect(declared).toEqual(expect.arrayContaining(['page', 'limit']));
		}
	});
});

describe('AnchorBrowser public input naming', () => {
	it('uses a single camelCase spelling for every path parameter', () => {
		const snake = allRoutes.flatMap((route) =>
			(route.pathParams ?? []).filter((param) => param.includes('_')),
		);
		expect(snake).toEqual([]);
	});

	it('refers to a session and a task by exactly one name across all groups', () => {
		const params = new Set(allRoutes.flatMap((r) => r.pathParams ?? []));
		expect([...params].filter((p) => /session/i.test(p))).toEqual([
			'sessionId',
		]);
		expect([...params].filter((p) => /^task/i.test(p)).sort()).toEqual([
			'taskId',
			'taskName',
			'taskVersion',
		]);
	});

	it('names every path placeholder after its declared path parameter', () => {
		const mismatched = allRoutes
			.map((route) => ({
				id: `${route.group}.${route.name}`,
				placeholders: [...route.path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]),
				declared: [...(route.pathParams ?? [])],
			}))
			.filter(
				(r) => JSON.stringify(r.placeholders) !== JSON.stringify(r.declared),
			)
			.map((r) => `${r.id}: ${r.placeholders} vs ${r.declared}`);

		expect(mismatched).toEqual([]);
	});

	it('declares every path parameter as a field on the operation input schema', () => {
		const schemas = AnchorBrowserEndpointInputSchemas as unknown as Record<
			string,
			{ shape?: Record<string, unknown> }
		>;
		const missing: string[] = [];

		for (const route of allRoutes) {
			const shape = schemas[route.name]?.shape;
			if (!shape) continue;
			for (const param of route.pathParams ?? []) {
				if (!(param in shape)) missing.push(`${route.name}.${param}`);
			}
		}

		expect(missing).toEqual([]);
	});
});
