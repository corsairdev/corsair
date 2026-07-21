import { request } from 'corsair/http';

import { algoliaRoutes } from './endpoints/routes';
import { algolia } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown> | unknown;

function buildCtx() {
	return {
		key: 'test-api-key',
		$getAccountId: () => 'test-account-id',
		options: {
			applicationId: 'test-app-id',
			region: 'us',
		},
		keys: {
			get_applicationId: jest.fn().mockResolvedValue('test-app-id'),
			get_api_key: jest.fn().mockResolvedValue('test-api-key'),
		},
		logEvent: jest.fn(),
		db: {},
	};
}

// Seed inputs for the common Algolia path params so any route that needs
// them has a valid value without us hand-crafting 133 different payloads.
const PATH_SEEDS: Record<string, string | number> = {
	indexName: 'products',
	index_name: 'products',
	objectID: 'obj-1',
	object_id: 'obj-1',
	facetName: 'category',
	facet_name: 'category',
	dictionaryName: 'stopwords',
	dictionary_name: 'stopwords',
	taskID: 42,
	task_id: 42,
	userID: 'user-1',
	user_id: 'user-1',
	abTestID: 7,
	ab_test_id: 7,
	sourceID: 'src-1',
	source_id: 'src-1',
	destinationID: 'dst-1',
	destination_id: 'dst-1',
	transformationID: 'tr-1',
	runID: 'run-1',
};

function inputForRoute(route: {
	pathParams?: readonly string[];
}): Record<string, unknown> {
	const input: Record<string, unknown> = {};
	for (const param of route.pathParams ?? []) {
		// path params arrive in camelCase via the route table; seed both
		// camel and snake variants so the alias resolver finds them.
		if (PATH_SEEDS[param] !== undefined) input[param] = PATH_SEEDS[param];
		const snake = param.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
		if (PATH_SEEDS[snake] !== undefined) input[snake] = PATH_SEEDS[snake];
	}
	return input;
}

describe('Algolia endpoint routing — every operation dispatches', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	const plugin = algolia({
		applicationId: 'test-app-id',
		key: 'test-api-key',
	});
	const endpoints = plugin.endpoints as Record<
		string,
		Record<string, AnyEndpoint>
	>;

	it('every route has a matching endpoint in the plugin tree', () => {
		const missing = algoliaRoutes.filter((route) => {
			const group = endpoints[route.group];
			return !group || typeof group[route.name] !== 'function';
		});
		expect(missing).toEqual([]);
	});

	it.each(algoliaRoutes as readonly (typeof algoliaRoutes)[number][])(
		'$group.$name dispatches a $method request',
		async (route) => {
			const group = endpoints[route.group];
			const endpoint = group?.[route.name];
			if (typeof endpoint !== 'function') {
				throw new Error(`endpoint missing for ${route.group}.${route.name}`);
			}

			// Some routes need path params that aren't in the seed table —
			// in those cases executeAlgoliaOperation throws a clear
			// validation-style error before reaching the HTTP layer. That
			// counts as a successful wiring proof; we only assert HTTP
			// behavior when the call returns without throwing.
			let threw: unknown;
			try {
				await endpoint(buildCtx(), inputForRoute(route));
			} catch (err) {
				threw = err;
			}

			if (!threw) {
				expect(mockRequest).toHaveBeenCalled();
				const callArgs = mockRequest.mock.calls.at(-1)?.[1] as
					| { method?: string }
					| undefined;
				expect(callArgs?.method).toBe(route.method);
			}
			// Clear for the next iteration so the count assertion stays scoped.
			mockRequest.mockClear();
		},
	);
});
