import type { NetSuiteContext } from '..';
import type { NetSuiteEndpointHandler } from './run';
import { makeNetSuiteEndpoint } from './run';
import type { NetSuiteSpecKey } from './specs';
import { netSuiteSpecs } from './specs';
import type { NetSuiteEndpointInputs, NetSuiteEndpointOutputs } from './types';

// Necessity: Cast dynamic runtime endpoint entries through unknown to the strongly typed NetSuiteEndpoints map.
// Why stricter typing is not feasible: Object.fromEntries returns Record<string, unknown> and TypeScript cannot statically correlate dynamic mapped tuple keys with individual per-operation input and output signatures.
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
