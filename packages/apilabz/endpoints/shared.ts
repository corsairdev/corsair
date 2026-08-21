import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ApiLabzContext } from '..';
import { ApiLabzAPIError, makeApiLabzRequest } from '../client';

/**
 * Hub module ids / slugs.
 * Only IBAN (113) is available on hub.apilabz.com today; other catalog ops
 * have no public module and stay unavailable until API Labz exposes them.
 */
export const APILABZ_MODULES = {
	ibanValidate: '113',
	dealsIntegrate: null,
	airtableListTables: null,
	trelloAiSearchEngine: null,
} as const;

export const APILABZ_CATALOG_SLUGS = {
	ibanValidate: 'API_LABZ_IBAN_VALIDATOR',
	dealsIntegrate: 'API_LABZ_INTEGRATE_DEAL',
	airtableListTables: 'API_LABZ_LIST_TABLES',
	trelloAiSearchEngine: 'API_LABZ_TRELLO_AI_SEARCH_ENGINE',
} as const;

function redactOperationInput(
	catalogSlug: string,
	input: Record<string, unknown>,
): Record<string, unknown> {
	if (catalogSlug === APILABZ_CATALOG_SLUGS.ibanValidate) {
		return {
			hasIban: typeof input.iban === 'string' && input.iban.length > 0,
		};
	}

	if (catalogSlug === APILABZ_CATALOG_SLUGS.dealsIntegrate) {
		return {
			dealId: typeof input.dealId === 'string' ? input.dealId : undefined,
			status: typeof input.status === 'string' ? input.status : undefined,
			hasAmount: typeof input.amount === 'number',
			hasTitle: typeof input.title === 'string',
			hasCurrency: typeof input.currency === 'string',
			customFieldCount:
				typeof input.customFields === 'object' && input.customFields !== null
					? Object.keys(input.customFields as Record<string, unknown>).length
					: 0,
		};
	}

	return input;
}

/**
 * Execute one hub module: POST /module/<id> with the operation input as body.
 */
export async function executeApiLabzModule<T>(
	ctx: ApiLabzContext,
	eventName: string,
	operation: keyof typeof APILABZ_MODULES,
	input: Record<string, unknown>,
	outputSchema: z.ZodType<T>,
): Promise<T> {
	const moduleId = APILABZ_MODULES[operation];
	const catalogSlug = APILABZ_CATALOG_SLUGS[operation];

	if (moduleId === null) {
		throw new ApiLabzAPIError(
			`API Labz hub has no public module for ${catalogSlug}. Live hub only exposes IBAN validation (module 113).`,
			'MODULE_UNAVAILABLE',
		);
	}

	const response = await makeApiLabzRequest<unknown>(
		`module/${moduleId}`,
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	const parsedResponse = outputSchema.parse(response);
	await logEventFromContext(
		ctx,
		eventName,
		redactOperationInput(catalogSlug, input),
		'completed',
	);
	return parsedResponse;
}
