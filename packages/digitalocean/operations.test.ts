import { logEventFromContext } from 'corsair/core';
import { makeDigitalOceanRequest } from './client';
import { digitalOceanEndpointsNested } from './endpoints';
import { getRoute, resolvePath } from './endpoints/factory';
import type { DigitalOceanRoute } from './endpoints/routes';
import { digitalOceanRoutes } from './endpoints/routes';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	makeDigitalOceanRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeDigitalOceanRequest);
const mockLog = jest.mocked(logEventFromContext);

// Endpoint closures are heterogeneous; unknown avoids a mega shared Ctx/Input union.
type AnyEndpoint = (ctx: unknown, input?: unknown) => Promise<unknown>;

function createContext() {
	return {
		key: 'test-api-key',
		options: { authType: 'api_key' as const },
		db: {},
	};
}

function sampleInput(route: DigitalOceanRoute): Record<string, unknown> {
	const input: Record<string, unknown> = {};
	for (const key of route.pathParams ?? []) {
		if (
			key === 'droplet_id' ||
			key === 'image_id' ||
			key === 'record_id' ||
			key.endsWith('_id')
		) {
			input[key] =
				key.includes('uuid') ||
				key.includes('firewall') ||
				key.includes('load_balancer') ||
				key.includes('vpc') ||
				key.includes('volume') ||
				key.includes('database') ||
				key.includes('key')
					? 'test-id'
					: 42;
		} else if (
			key === 'domain_name' ||
			key === 'name' ||
			key === 'tag_name' ||
			key.endsWith('_name')
		) {
			input[key] = 'example.com';
		} else {
			input[key] = 'test-value';
		}
	}
	return input;
}

function endpointFor(route: DigitalOceanRoute): AnyEndpoint {
	const group = digitalOceanEndpointsNested[
		route.group as keyof typeof digitalOceanEndpointsNested
	] as Record<string, AnyEndpoint>;
	const fn = group?.[route.name];
	if (!fn) {
		throw new Error(`missing endpoint ${route.group}.${route.name}`);
	}
	return fn;
}

describe('DigitalOcean endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('registers exactly 47 routes matching nested endpoints', () => {
		expect(digitalOceanRoutes).toHaveLength(47);
		for (const route of digitalOceanRoutes) {
			expect(() => getRoute(route.name)).not.toThrow();
			expect(endpointFor(route)).toEqual(expect.any(Function));
		}
	});

	it.each(
		digitalOceanRoutes.map((route) => ({
			name: `${route.group}.${route.name}`,
			route,
		})),
	)(
		'$name drives the endpoint closure against its route',
		async ({ route }) => {
			const input = sampleInput(route);
			const expectedPath = resolvePath(route.path, input, route);
			const ctx = createContext();

			await endpointFor(route)(ctx, input);

			expect(mockRequest).toHaveBeenCalledWith(
				expectedPath,
				ctx.key,
				expect.objectContaining({
					method: route.method,
				}),
			);
			expect(mockLog).toHaveBeenCalled();
		},
	);
});
