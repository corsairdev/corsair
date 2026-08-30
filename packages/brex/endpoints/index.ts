import { createBrexEndpoint } from './factory';
import type { BrexRouteKey } from './routes';
import { BREX_ROUTES } from './routes';

type EndpointTree = Record<
	string,
	Record<string, ReturnType<typeof createBrexEndpoint>>
>;

function buildEndpoints(): EndpointTree {
	const tree: EndpointTree = {};
	for (const key of Object.keys(BREX_ROUTES) as BrexRouteKey[]) {
		const route = BREX_ROUTES[key];
		const group = tree[route.group] ?? {};
		group[route.op] = createBrexEndpoint(key);
		tree[route.group] = group;
	}
	return tree;
}

export const brexEndpointsNested = buildEndpoints();

export * from './routes';
export * from './types';
