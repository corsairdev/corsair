import type { NetSuiteContext } from '..';
import type { NetSuiteEndpointHandler } from './run';
import { makeNetSuiteEndpoint } from './run';
import type { NetSuiteSpecKey } from './specs';
import { netSuiteSpecs } from './specs';
import type { NetSuiteEndpointInputs, NetSuiteEndpointOutputs } from './types';

export const NetSuite = Object.fromEntries(
	(Object.keys(netSuiteSpecs) as NetSuiteSpecKey[]).map((key) => [
		key,
		makeNetSuiteEndpoint(key),
	]),
) as unknown as NetSuiteEndpoints;

export type NetSuiteEndpoints = {
	[K in NetSuiteSpecKey]: (
		ctx: NetSuiteContext,
		input: NetSuiteEndpointInputs[K],
	) => Promise<NetSuiteEndpointOutputs[K]>;
};

export type { NetSuiteEndpointHandler };
export * from './types';
