import { asRecord } from 'corsair/core';
import type { TeltelEndpoints } from '..';
import { call, filterParam } from './call';
import {
	CallCreateInputSchema,
	CallCreateResponseSchema,
	CallsListInputSchema,
	CallsListResponseSchema,
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
				sort: parsed.sort,
				filter: filterParam([
					['direction', '=', parsed.direction],
					['starttime', '>', parsed['starttime[from]']],
					['starttime', '<', parsed['starttime[to]']],
				]),
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
	// This route answers with the updated number under `data`.
	return call(
		ctx,
		{
			event: 'numbers.update',
			input: NumbersUpdateInputSchema,
			output: NumbersGetResponseSchema,
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
			},
		}),
	);
};

// ── users ─────────────────────────────────────────────────────────────────

// unknown: the raw users response; non-object entries pass through untouched
// and the output schema rejects them.
function withoutUserApiKeys(raw: unknown): unknown {
	const body = asRecord(raw);
	if (!body || !Array.isArray(body.data)) return raw;
	return {
		...body,
		data: body.data.map((entry: unknown) => {
			const user = asRecord(entry);
			if (!user) return entry;
			const { api_key: _apiKey, ...rest } = user;
			return rest;
		}),
	};
}

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
			},
		}),
		// TelTEL returns each user's API key in the list. It is dropped here
		// so a credential never reaches the caller or an agent's context.
		{ shape: withoutUserApiKeys },
	);
};
