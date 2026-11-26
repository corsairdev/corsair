import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeScrapeCreatorsRequest } from '../client';
import type { ScrapeCreatorsContext } from '../index';
import type {
	ScrapeCreatorsOperationId,
	ScrapeCreatorsOperationInputs,
	ScrapeCreatorsOperationOutputs,
} from './operation-types';
import {
	getScrapeCreatorsInputSchema,
	getScrapeCreatorsOutputSchema,
	scrapeCreatorsOperationFor,
} from './schemas';

export type ScrapeCreatorsOperationEndpoint<
	Id extends ScrapeCreatorsOperationId,
> = CorsairEndpoint<
	ScrapeCreatorsContext,
	ScrapeCreatorsOperationInputs[Id],
	ScrapeCreatorsOperationOutputs[Id]
>;

/**
 * The longest query string sent as a GET on a route that also takes a POST
 * body. ScrapeCreators asks for POST once a pagination cursor gets too long for
 * a URL (Meta Ad Library search and company ads, Reddit comments); shorter
 * requests stay on GET, which the docs recommend.
 */
export const SCRAPECREATORS_MAX_QUERY_LENGTH = 2000;

/** One endpoint per manifest operation: every route is a GET with query parameters. */
export function createScrapeCreatorsOperation<
	Id extends ScrapeCreatorsOperationId,
>(id: Id): ScrapeCreatorsOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = scrapeCreatorsOperationFor(id);
		// Send what was validated, not the caller's object.
		const parsedInput = getScrapeCreatorsInputSchema(id).parse(input ?? {});

		const query: Record<string, string | number | boolean> = {};
		for (const [name, value] of Object.entries(parsedInput)) {
			if (
				typeof value === 'string' ||
				typeof value === 'number' ||
				typeof value === 'boolean'
			) {
				query[name] = value;
			}
		}
		const usePost =
			operation.postFallback &&
			new URLSearchParams(
				Object.entries(query).map(([k, v]): [string, string] => [k, String(v)]),
			).toString().length > SCRAPECREATORS_MAX_QUERY_LENGTH;

		// `unknown` is necessary because the response is untrusted JSON until the operation's output schema parses it.
		const response = await makeScrapeCreatorsRequest<unknown>(
			operation.path,
			ctx.key,
			usePost ? { method: 'POST', body: query } : { method: 'GET', query },
		);

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsed = getScrapeCreatorsOutputSchema(id).parse(response);

		// Under managed pricing the call ran on Corsair's ScrapeCreators account:
		// its balance isn't the caller's to see. `credits_charged` stays, it is
		// what Hub meters the call by.
		const result =
			ctx.options.authType === 'managed_pricing' &&
			typeof parsed === 'object' &&
			parsed !== null &&
			!Array.isArray(parsed)
				? withoutBalance(parsed as Record<string, unknown>)
				: parsed;

		// Handles, URLs and results are user content: log only which operation ran.
		await logEventFromContext(
			ctx,
			'scrapecreators.operation',
			{ operationId: id },
			'completed',
		);
		return result as ScrapeCreatorsOperationOutputs[Id];
	};
}

// `unknown` is necessary because the response fields differ per operation; only the balance is removed.
function withoutBalance(response: Record<string, unknown>) {
	const { credits_remaining: _balance, ...rest } = response;
	return rest;
}
