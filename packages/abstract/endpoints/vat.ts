import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeAbstractRequest, tryGetStoredKey } from '../client';
import type { AbstractEndpoints } from '../index';
import type { AbstractEndpointOutputs } from './types';
import { VatGetCategoriesResponseSchema } from './types';

/**
 * Retrieve VAT rate categories for a specific country, including standard,
 * reduced, and special VAT rates. Use when you need to determine applicable
 * VAT rates for different product/service categories in a country.
 *
 * API: GET vat.abstractapi.com/v1/categories
 * Docs: https://www.abstractapi.com/api/vat-validation-rates-api
 */
export const getCategories: AbstractEndpoints['vatGetCategories'] = async (
	ctx,
	input,
) => {
	const apiKey =
		ctx.options.vatApiKey ??
		(await tryGetStoredKey(() => ctx.keys.get_vat_api_key())) ??
		ctx.key;

	if (!apiKey) {
		throw new AuthMissingError('abstract', 'api_key');
	}

	const rawResponse = await makeAbstractRequest<
		AbstractEndpointOutputs['vatGetCategories']
	>('vat', 'categories', apiKey, {
		query: {
			country_code: input.countryCode,
		},
	});

	// Abstract's response shape isn't guaranteed to match our types at
	// compile time — validate it at runtime before trusting or persisting it.
	const response = VatGetCategoriesResponseSchema.parse(rawResponse);

	if (ctx.db.vatCategories) {
		try {
			for (const vatCategory of response) {
				await ctx.db.vatCategories.upsertByEntityId(
					`${vatCategory.country_code}:${vatCategory.category}`,
					{
						countryCode: vatCategory.country_code,
						category: vatCategory.category,
						description: vatCategory.description,
						rate: vatCategory.rate,
						checkedAt: new Date(),
					},
				);
			}
		} catch (error) {
			console.warn('Failed to save VAT categories to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'abstract.vat.getCategories',
		{ ...input },
		'completed',
	);

	return response;
};
