import type { z } from 'zod';
import type {
	ScrapeCreatorsOperationInputs,
	ScrapeCreatorsOperationOutputs,
} from './operation-types';
import {
	scrapeCreatorsInputSchemas,
	scrapeCreatorsOutputSchemas,
} from './schemas';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`tiktok.profile`, `youtube.videoTranscript`, `account.creditBalance`).
export type ScrapeCreatorsEndpointInputs = ScrapeCreatorsOperationInputs;
export type ScrapeCreatorsEndpointOutputs = ScrapeCreatorsOperationOutputs;

export type {
	ScrapeCreatorsEnvelope,
	ScrapeCreatorsJsonValue,
	ScrapeCreatorsOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each entry is a getter that builds its
 * schema on first read; see endpoints/schemas.ts.
 */
export const ScrapeCreatorsEndpointInputSchemas =
	scrapeCreatorsInputSchemas as Readonly<
		Record<keyof ScrapeCreatorsEndpointInputs, z.ZodType>
	>;

export const ScrapeCreatorsEndpointOutputSchemas =
	scrapeCreatorsOutputSchemas as Readonly<
		Record<keyof ScrapeCreatorsEndpointOutputs, z.ZodType>
	>;
