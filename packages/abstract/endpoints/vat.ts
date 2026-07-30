import { logEventFromContext } from 'corsair/core';
import { makeAbstractRequest } from '../client';
import type { AbstractEndpoints } from '../index';
import type { AbstractEndpointOutputs } from './types';

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
		ctx.options.vatApiKey ?? (await ctx.keys.get_vat_api_key()) ?? ctx.key;

	const response = await makeAbstractRequest<
		AbstractEndpointOutputs['vatGetCategories']
	>('vat', 'categories', apiKey, {
		query: {
			country_code: input.countryCode,
		},
	});

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
