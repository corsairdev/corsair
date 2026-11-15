import type { TeltelEndpoints } from '..';
import { call } from './call';
import {
	CallCreateInputSchema,
	CallCreateResponseSchema,
	CallsListInputSchema,
	CallsListResponseSchema,
	MetaResultSchema,
	NumberCountriesListInputSchema,
	NumberCountriesListResponseSchema,
	NumberCountryGetInputSchema,
	NumberCountryGetResponseSchema,
	NumbersGetInputSchema,
	NumbersGetResponseSchema,
	NumbersListInputSchema,
	NumbersListResponseSchema,
	NumbersUpdateInputSchema,
	PriceGroupsListInputSchema,
	PriceGroupsListResponseSchema,
	UsersListInputSchema,
	UsersListResponseSchema,
} from './types';

// ── calls ─────────────────────────────────────────────────────────────────

export const callsList: TeltelEndpoints['callsList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'calls.list',
			input: CallsListInputSchema,
			output: CallsListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/calls',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				fields: parsed.fields,
				sort: parsed.sort,
				direction: parsed.direction,
				'starttime[from]': parsed['starttime[from]'],
				'starttime[to]': parsed['starttime[to]'],
			},
		}),
	);
};

export const callsCreate: TeltelEndpoints['callsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'calls.create',
			input: CallCreateInputSchema,
			output: CallCreateResponseSchema,
		},
		input,
		(parsed) => parsed,
		() => ({ method: 'POST', path: '/calls' }),
	);
};

// ── DID numbers ───────────────────────────────────────────────────────────

export const numbersList: TeltelEndpoints['numbersList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'numbers.list',
			input: NumbersListInputSchema,
			output: NumbersListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/dids/my-numbers',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				fields: parsed.fields,
				sort: parsed.sort,
			},
		}),
	);
};

export const numbersGet: TeltelEndpoints['numbersGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'numbers.get',
			input: NumbersGetInputSchema,
			output: NumbersGetResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: `/dids/my-numbers/${parsed.numberId}`,
		}),
	);
};

export const numbersUpdate: TeltelEndpoints['numbersUpdate'] = async (
	ctx,
	input,
) => {
	// This route answers the standard update envelope, so it goes through the
	// wrapped-body path rather than the bare meta one.
	return call(
		ctx,
		{
			event: 'numbers.update',
			input: NumbersUpdateInputSchema,
			output: MetaResultSchema,
		},
		input,
		(parsed) => {
			const { numberId, ...body } = parsed;
			return body;
		},
		(parsed) => ({
			method: 'PATCH',
			path: `/dids/my-numbers/${parsed.numberId}`,
		}),
	);
};

export const countriesList: TeltelEndpoints['numberCountriesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'numberCountries.list',
			input: NumberCountriesListInputSchema,
			output: NumberCountriesListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/dids/new-numbers/countries',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				fields: parsed.fields,
			},
		}),
	);
};

export const countryGet: TeltelEndpoints['numberCountryGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'numberCountries.get',
			input: NumberCountryGetInputSchema,
			output: NumberCountryGetResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: `/dids/new-numbers/countries/${parsed.countryId}`,
		}),
	);
};

export const priceGroupsList: TeltelEndpoints['priceGroupsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'priceGroups.list',
			input: PriceGroupsListInputSchema,
			output: PriceGroupsListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: `/dids/new-numbers/countries/${parsed.countryId}/price-groups`,
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				fields: parsed.fields,
			},
		}),
	);
};

// ── users ─────────────────────────────────────────────────────────────────

export const usersList: TeltelEndpoints['usersList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'users.list',
			input: UsersListInputSchema,
			output: UsersListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/users',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				fields: parsed.fields,
			},
		}),
	);
};
