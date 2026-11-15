import type { TaxJarEndpoints } from '..';
import { call } from './call';
import {
	AddressesValidateInputSchema,
	AddressesValidateResponseSchema,
	CategoriesInputSchema,
	CategoriesResponseSchema,
	NexusRegionsInputSchema,
	NexusRegionsResponseSchema,
	RatesGetInputSchema,
	RatesGetResponseSchema,
	SummaryRatesInputSchema,
	SummaryRatesResponseSchema,
	TaxesCalculateInputSchema,
	TaxesCalculateResponseSchema,
} from './types';

export const categoriesList: TaxJarEndpoints['categoriesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'categories.list',
			input: CategoriesInputSchema,
			output: CategoriesResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/categories' }),
	);
};

export const ratesGet: TaxJarEndpoints['ratesGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'rates.get',
			input: RatesGetInputSchema,
			output: RatesGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/rates/${parsed.zip}`,
			// The rate route takes the address as query values, not a body. The
			// rate itself comes back as a decimal string.
			query: {
				country: parsed.country,
				state: parsed.state,
				city: parsed.city,
				street: parsed.street,
			},
		}),
	);
};

export const nexusRegionsList: TaxJarEndpoints['nexusRegionsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'nexusRegions.list',
			input: NexusRegionsInputSchema,
			output: NexusRegionsResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/nexus/regions' }),
	);
};

export const summaryRatesList: TaxJarEndpoints['summaryRatesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'summaryRates.list',
			input: SummaryRatesInputSchema,
			output: SummaryRatesResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/summary_rates' }),
	);
};

export const addressesValidate: TaxJarEndpoints['addressesValidate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'addresses.validate',
			input: AddressesValidateInputSchema,
			output: AddressesValidateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/addresses/validate',
			body: parsed,
		}),
	);
};

export const taxesCalculate: TaxJarEndpoints['taxesCalculate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'taxes.calculate',
			input: TaxesCalculateInputSchema,
			output: TaxesCalculateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/taxes',
			body: parsed,
		}),
	);
};
