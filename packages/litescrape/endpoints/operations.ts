import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeLitescrapeRequest } from '../client';
import type { LitescrapeContext } from '../index';
import {
	getLitescrapeInputSchema,
	getLitescrapeOutputSchema,
	litescrapeOperationFor,
	litescrapeQueryFields,
} from './openapi-schema';
import type {
	LitescrapeOperationId,
	LitescrapeOperationInputs,
	LitescrapeOperationOutputs,
} from './operation-types';

export type LitescrapeOperationEndpoint<Id extends LitescrapeOperationId> =
	CorsairEndpoint<
		LitescrapeContext,
		LitescrapeOperationInputs[Id],
		LitescrapeOperationOutputs[Id]
	>;

/**
 * One endpoint per manifest operation. Every Litescrape data route takes the
 * same request as a GET query or a JSON POST body; POST is used because only
 * the body carries arrays and nested objects (viewport, cookies, messages).
 * `timeout` is the exception: the API reads it from the query string on both.
 */
export function createLitescrapeOperation<Id extends LitescrapeOperationId>(
	id: Id,
): LitescrapeOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = litescrapeOperationFor(id);
		const parsedInput = getLitescrapeInputSchema(id).parse(input ?? {});

		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the body's fields differ per operation; each was just validated by its input schema.
		const body: Record<string, unknown> = { ...parsedInput };
		const query: Record<string, string | number | boolean | undefined> = {};
		for (const name of litescrapeQueryFields(id)) {
			const value = body[name];
			delete body[name];
			if (
				typeof value === 'string' ||
				typeof value === 'number' ||
				typeof value === 'boolean'
			) {
				query[name] = value;
			}
		}

		// `unknown` is necessary because the response is untrusted JSON until the operation's output schema parses it.
		const response = await makeLitescrapeRequest<unknown>(
			operation.path,
			ctx.key,
			{
				method: operation.method,
				body,
				query,
				budgetSeconds:
					typeof query.timeout === 'number' ? query.timeout : undefined,
			},
		);

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsed = getLitescrapeOutputSchema(id).parse(
			response,
		) as LitescrapeOperationOutputs[Id];

		// Queries, URLs and results are user content: log only which operation ran.
		await logEventFromContext(
			ctx,
			'litescrape.operation',
			{ operationId: id },
			'completed',
		);
		return parsed;
	};
}
