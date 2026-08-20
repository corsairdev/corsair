import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * National statistics, interest rates and tax.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Get GDP data from given parameters. Returns GDP statistics that satisfy
 * the parameters.
 */
export const gdp: ApiNinjasEndpoints['economicsGdp'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsGdp']
	>('gdp', ctx.key, {
		version: 'v1',
		query: {
			country: input.country,
			year: input.year,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.gdp',
		withCount(auditPayload(input, ['country', 'year']), result),
		'completed',
	);
	return result;
};

/** Returns current monthly and annual inflation percentages. */
export const inflation: ApiNinjasEndpoints['economicsInflation'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsInflation']
	>('inflation', ctx.key, {
		version: 'v1',
		query: {
			type: input.type,
			country: input.country,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.inflation',
		withCount(auditPayload(input, ['type', 'country']), result),
		'completed',
	);
	return result;
};

/**
 * Get unemployment data for a given country. Returns historical, current
 * and forecast unemployment statistics.
 */
export const unemployment: ApiNinjasEndpoints['economicsUnemployment'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsUnemployment']
	>('unemployment', ctx.key, {
		version: 'v1',
		query: {
			country: input.country,
			year: input.year,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.unemployment',
		withCount(auditPayload(input, ['country', 'year']), result),
		'completed',
	);
	return result;
};

/**
 * Get population data from given parameters. Returns a list of up to 5
 * country population statistics that satisfy the parameters. For more
 * results use the offset parameter.
 */
export const population: ApiNinjasEndpoints['economicsPopulation'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsPopulation']
	>('population', ctx.key, {
		version: 'v1',
		query: {
			country: input.country,
			min_population: input.min_population,
			max_population: input.max_population,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.population',
		withCount(
			auditPayload(input, [
				'country',
				'min_population',
				'max_population',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get a specific interest rate by name. Returns the rate value, name, and
 * last updated timestamp.
 */
export const interestRate: ApiNinjasEndpoints['economicsInterestRate'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsInterestRate']
	>('interestrate', ctx.key, {
		version: 'v2',
		query: {
			rate: input.rate,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.interestRate',
		withCount(auditPayload(input, ['rate']), result),
		'completed',
	);
	return result;
};

/**
 * Returns the daily 30-year and 15-year fixed-rate mortgage (FRM) data. If
 * no parameters are set, the mortgage rate data for the most recent day is
 * returned.
 */
export const mortgageRate: ApiNinjasEndpoints['economicsMortgageRate'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsMortgageRate']
	>('mortgagerate', ctx.key, {
		version: 'v2',
		query: {
			date: input.date,
			min_date: input.min_date,
			max_date: input.max_date,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.mortgageRate',
		withCount(auditPayload(input, ['date', 'min_date', 'max_date']), result),
		'completed',
	);
	return result;
};

/**
 * Returns monthly payment, annual payment, and interest rate information
 * based on given mortgage parameters.
 */
export const mortgageCalculator: ApiNinjasEndpoints['economicsMortgageCalculator'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['economicsMortgageCalculator']
		>('mortgagecalculator', ctx.key, {
			version: 'v1',
			query: {
				loan_amount: input.loan_amount,
				home_value: input.home_value,
				downpayment: input.downpayment,
				interest_rate: input.interest_rate,
				duration_years: input.duration_years,
				monthly_hoa: input.monthly_hoa,
				annual_property_tax: input.annual_property_tax,
				annual_home_insurance: input.annual_home_insurance,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.economics.mortgageCalculator',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/**
 * Returns comprehensive income tax information including tax brackets and
 * rates at both federal and state/provincial levels (where applicable).
 */
export const incomeTax: ApiNinjasEndpoints['economicsIncomeTax'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsIncomeTax']
	>('incometax', ctx.key, {
		version: 'v2',
		query: {
			country: input.country,
			year: input.year,
			regions: input.regions,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.incomeTax',
		withCount(auditPayload(input, ['country', 'year', 'regions']), result),
		'completed',
	);
	return result;
};

/**
 * Returns comprehensive annual tax calculations including federal,
 * state/provincial, and FICA taxes where applicable.
 */
export const incomeTaxCalculator: ApiNinjasEndpoints['economicsIncomeTaxCalculator'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['economicsIncomeTaxCalculator']
		>('incometaxcalculator', ctx.key, {
			version: 'v1',
			query: {
				country: input.country,
				region: input.region,
				income: input.income,
				tax_year: input.tax_year,
				filing_status: input.filing_status,
				deductions: input.deductions,
				credits: input.credits,
				self_employed: input.self_employed,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.economics.incomeTaxCalculator',
			withCount(auditPayload(input, ['country', 'region', 'tax_year']), result),
			'completed',
		);
		return result;
	};

/**
 * Returns one or more sales tax breakdowns by ZIP code according to the
 * specified parameters. Each breakdown includes the state sales tax (if
 * any), county sales tax (if any), city sales tax (if any), and any
 * additional special sales taxes. All tax values are presented in decimals
 * (e.g. 0.1 means 10% tax).
 */
export const salesTax: ApiNinjasEndpoints['economicsSalesTax'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsSalesTax']
	>('salestax', ctx.key, {
		version: 'v1',
		query: {
			zip_code: input.zip_code,
			street_address: input.street_address,
			city: input.city,
			state: input.state,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.salesTax',
		withCount(auditPayload(input, ['city', 'state']), result),
		'completed',
	);
	return result;
};

/**
 * Calculates sales tax for a given amount and location. Returns a detailed
 * breakdown including state, county, city, and special district taxes,
 * along with the calculated tax amount and total amount after tax.
 */
export const salesTaxCalculator: ApiNinjasEndpoints['economicsSalesTaxCalculator'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['economicsSalesTaxCalculator']
		>('salestaxcalculator', ctx.key, {
			version: 'v1',
			query: {
				amount: input.amount,
				zip_code: input.zip_code,
				street_address: input.street_address,
				city: input.city,
				state: input.state,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.economics.salesTaxCalculator',
			withCount(auditPayload(input, ['city', 'state']), result),
			'completed',
		);
		return result;
	};

/**
 * Returns a list of regions and corresponding 25th, 50th (median), and
 * 75th percentile effective property tax rates. The region is mostly
 * zipcode-based, but sometimes a single zipcode can contain multiple
 * regions due to local tax laws.
 */
export const propertyTax: ApiNinjasEndpoints['economicsPropertyTax'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsPropertyTax']
	>('propertytax', ctx.key, {
		version: 'v1',
		query: {
			state: input.state,
			county: input.county,
			city: input.city,
			zip: input.zip,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.propertyTax',
		withCount(auditPayload(input, ['state', 'county', 'city']), result),
		'completed',
	);
	return result;
};

/**
 * Returns VAT rates for a specified EU country. Results include standard
 * rate, reduced rates, super-reduced rates, and any special categories.
 */
export const vatRates: ApiNinjasEndpoints['economicsVatRates'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['economicsVatRates']
	>('vat', ctx.key, {
		version: 'v1',
		query: {
			country: input.country,
			type: input.type,
			min_date: input.min_date,
			max_date: input.max_date,
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.economics.vatRates',
		withCount(
			auditPayload(input, [
				'country',
				'type',
				'min_date',
				'max_date',
				'limit',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};
