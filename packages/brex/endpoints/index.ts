import { createBrexEndpoint } from './factory';
import type { BrexRouteKey } from './routes';
import { BREX_ROUTES } from './routes';

type BrexGroup = (typeof BREX_ROUTES)[BrexRouteKey]['group'];
type BrexEndpointFn = ReturnType<typeof createBrexEndpoint>;
type OpsFor<G extends BrexGroup> = {
	[K in BrexRouteKey as (typeof BREX_ROUTES)[K]['group'] extends G
		? (typeof BREX_ROUTES)[K]['op']
		: never]: BrexEndpointFn;
};

export type BrexEndpointsNested = {
	[G in BrexGroup]: OpsFor<G>;
};

function buildEndpoints(): BrexEndpointsNested {
	const tree: Record<string, Record<string, BrexEndpointFn>> = {};
	for (const key of Object.keys(BREX_ROUTES) as BrexRouteKey[]) {
		const route = BREX_ROUTES[key];
		const group = tree[route.group] ?? {};
		group[route.op] = createBrexEndpoint(key);
		tree[route.group] = group;
	}
	return tree as BrexEndpointsNested;
}

export const brexEndpointsNested = buildEndpoints();

export * from './routes';
export * from './types';
