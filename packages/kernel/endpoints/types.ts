import type { z } from 'zod';
import { kernelInputSchemas, kernelOutputSchemas } from './openapi-schema';
import type {
	KernelOperationInputs,
	KernelOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`browsers.create`, `browsers.playwright.execute`).

export type KernelEndpointInputs = KernelOperationInputs;
export type KernelEndpointOutputs = KernelOperationOutputs;

export type {
	KernelJsonValue,
	KernelOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const KernelEndpointInputSchemas =
	kernelInputSchemas as unknown as Readonly<
		Record<keyof KernelEndpointInputs, z.ZodType>
	>;

export const KernelEndpointOutputSchemas =
	kernelOutputSchemas as unknown as Readonly<
		Record<keyof KernelEndpointOutputs, z.ZodType>
	>;
