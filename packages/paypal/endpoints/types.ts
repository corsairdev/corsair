import type { z } from 'zod';
import { paypalInputSchemas, paypalOutputSchemas } from './openapi-schema';
import type {
	PaypalOperationInputs,
	PaypalOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type PaypalEndpointInputs = PaypalOperationInputs;
export type PaypalEndpointOutputs = PaypalOperationOutputs;

export type {
	PaypalJsonValue,
	PaypalOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const PaypalEndpointInputSchemas =
	paypalInputSchemas as unknown as Readonly<
		Record<keyof PaypalEndpointInputs, z.ZodType>
	>;

export const PaypalEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	paypalOutputSchemas as unknown as Readonly<
		Record<keyof PaypalEndpointOutputs, z.ZodType>
	>;
