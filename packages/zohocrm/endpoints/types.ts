import type { z } from 'zod';
import { zohocrmInputSchemas, zohocrmOutputSchemas } from './openapi-schema';
import type {
	ZohoCrmOperationInputs,
	ZohoCrmOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type ZohoCrmEndpointInputs = ZohoCrmOperationInputs;
export type ZohoCrmEndpointOutputs = ZohoCrmOperationOutputs;

export type {
	ZohoCrmJsonValue,
	ZohoCrmOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const ZohoCrmEndpointInputSchemas =
	zohocrmInputSchemas as unknown as Readonly<
		Record<keyof ZohoCrmEndpointInputs, z.ZodType>
	>;

export const ZohoCrmEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	zohocrmOutputSchemas as unknown as Readonly<
		Record<keyof ZohoCrmEndpointOutputs, z.ZodType>
	>;
