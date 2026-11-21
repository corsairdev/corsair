import type { z } from 'zod';
import {
	tailscaleInputSchemas,
	tailscaleOutputSchemas,
} from './openapi-schema';
import type {
	TailscaleOperationInputs,
	TailscaleOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`devices.list`, `policyFile.set`).

export type TailscaleEndpointInputs = TailscaleOperationInputs;
export type TailscaleEndpointOutputs = TailscaleOperationOutputs;

export type {
	TailscaleJsonValue,
	TailscaleOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const TailscaleEndpointInputSchemas =
	tailscaleInputSchemas as unknown as Readonly<
		Record<keyof TailscaleEndpointInputs, z.ZodType>
	>;

export const TailscaleEndpointOutputSchemas =
	tailscaleOutputSchemas as unknown as Readonly<
		Record<keyof TailscaleEndpointOutputs, z.ZodType>
	>;
