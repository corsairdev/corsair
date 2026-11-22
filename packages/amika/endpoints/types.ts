import type { z } from 'zod';
import { amikaInputSchemas, amikaOutputSchemas } from './openapi-schema';
import type {
	AmikaOperationInputs,
	AmikaOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`rigs.list`, `commandRuns.create`).

export type AmikaEndpointInputs = AmikaOperationInputs;
export type AmikaEndpointOutputs = AmikaOperationOutputs;

export type {
	AmikaJsonValue,
	AmikaOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const AmikaEndpointInputSchemas =
	amikaInputSchemas as unknown as Readonly<
		Record<keyof AmikaEndpointInputs, z.ZodType>
	>;

export const AmikaEndpointOutputSchemas =
	amikaOutputSchemas as unknown as Readonly<
		Record<keyof AmikaEndpointOutputs, z.ZodType>
	>;
