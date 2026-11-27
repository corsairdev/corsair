import type { z } from 'zod';
import { crawl4aiInputSchemas, crawl4aiOutputSchemas } from './openapi-schema';
import type {
	Crawl4aiOperationInputs,
	Crawl4aiOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type Crawl4aiEndpointInputs = Crawl4aiOperationInputs;
export type Crawl4aiEndpointOutputs = Crawl4aiOperationOutputs;

export type {
	Crawl4aiJsonValue,
	Crawl4aiOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const Crawl4aiEndpointInputSchemas =
	crawl4aiInputSchemas as unknown as Readonly<
		Record<keyof Crawl4aiEndpointInputs, z.ZodType>
	>;

export const Crawl4aiEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	crawl4aiOutputSchemas as unknown as Readonly<
		Record<keyof Crawl4aiEndpointOutputs, z.ZodType>
	>;
