import type { z } from 'zod';
import { openseoInputSchemas, openseoOutputSchemas } from './json-schema';
import type {
	OpenseoOperationInputs,
	OpenseoOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`keywords.research`, `projects.list`).
export type OpenseoEndpointInputs = OpenseoOperationInputs;
export type OpenseoEndpointOutputs = OpenseoOperationOutputs;

export type {
	OpenseoJsonValue,
	OpenseoOperationId,
} from './operation-types';

// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters lazyRecord adds, so the record looks like a plain string map.
// schema.test.ts checks every id is present.
/**
 * Every operation's zod schemas by id. Each entry is a getter that builds its
 * schema on first read; see endpoints/json-schema.ts.
 */
export const OpenseoEndpointInputSchemas =
	openseoInputSchemas as unknown as Readonly<
		Record<keyof OpenseoEndpointInputs, z.ZodType>
	>;

export const OpenseoEndpointOutputSchemas =
	openseoOutputSchemas as unknown as Readonly<
		Record<keyof OpenseoEndpointOutputs, z.ZodType>
	>;
