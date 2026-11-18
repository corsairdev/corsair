import type { QuadernoEndpoints } from '..';
import { segment } from '../client';
import { call, requireArray, wrap } from './call';
import {
	QuadernoEndpointInputSchemas as Inputs,
	QuadernoEndpointOutputSchemas as Outputs,
} from './types';

export const ping: QuadernoEndpoints['ping'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ping',
			input: Inputs.ping,
			output: Outputs.ping,
			toRequest: () => ({ method: 'GET', path: '/ping' }),
		},
		input,
		{
			log: (_, result) => ({ status: result.status }),
		},
	);

/**
 * The only route that works with a key alone, and the way to find which account
 * a key belongs to: `identity.href` is that account's base URL. It goes to the
 * bare `quadernoapp.com` host, so it works before any account name is known.
 */
export const authorization: QuadernoEndpoints['authorization'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'authorization',
			input: Inputs.authorization,
			output: Outputs.authorization,
			toRequest: () => ({ method: 'GET', path: '/authorization' }),
			rootHost: true,
		},
		input,
		{
			log: (_, result) => ({
				account: result.identity.href ?? undefined,
				name: result.identity.name ?? undefined,
			}),
		},
	);

export const calculate: QuadernoEndpoints['taxRatesCalculate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'taxRates.calculate',
			input: Inputs.taxRatesCalculate,
			output: Outputs.taxRatesCalculate,
			toRequest: ({
				to_country,
				to_postal_code,
				to_region,
				tax_code,
				amount,
			}) => ({
				method: 'GET',
				path: '/tax_rates/calculate',
				query: {
					to_country,
					to_postal_code,
					to_region,
					tax_code,
					amount,
				},
			}),
		},
		input,
		{
			log: ({ to_country }, result) => ({
				country: to_country,
				rate: result.rate ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

export const validateTaxId: QuadernoEndpoints['taxIdsValidate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'taxIds.validate',
			input: Inputs.taxIdsValidate,
			output: Outputs.taxIdsValidate,
			toRequest: ({ tax_id, country }) => ({
				method: 'GET',
				path: '/tax_ids/validate',
				query: { tax_id, country },
			}),
		},
		input,
		{
			log: ({ country }, result) => ({
				country,
				valid: result.valid ?? undefined,
			}),
		},
	);

export const taxCodesList: QuadernoEndpoints['taxCodesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'taxCodes.list',
			input: Inputs.taxCodesList,
			output: Outputs.taxCodesList,
			toRequest: ({ limit }) => ({
				method: 'GET',
				path: '/tax_codes',
				query: { limit },
			}),
		},
		input,
		{
			// Verified live: this route honours `limit`, unlike `/jurisdictions`.
			shape: (raw) => ({ tax_codes: requireArray(raw, 'tax codes') }),
			log: (_, result) => ({ count: result.tax_codes.length }),
		},
	);

export const taxCodesGet: QuadernoEndpoints['taxCodesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'taxCodes.get',
			input: Inputs.taxCodesGet,
			output: Outputs.taxCodesGet,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/tax_codes/${segment(id)}`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('tax_code', raw),
			log: ({ id }) => ({ code: id }),
		},
	);

export const jurisdictionsList: QuadernoEndpoints['jurisdictionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'jurisdictions.list',
			input: Inputs.jurisdictionsList,
			output: Outputs.jurisdictionsList,
			toRequest: ({ country }) => ({
				method: 'GET',
				path: '/jurisdictions',
				query: { country },
			}),
		},
		input,
		{
			// Verified live: `/jurisdictions` ignores `limit` and always answers the
			// full static list, so no paging parameters are offered for it.
			shape: (raw) => ({ jurisdictions: requireArray(raw, 'jurisdictions') }),
			log: (_, result) => ({ count: result.jurisdictions.length }),
		},
	);

export const jurisdictionsGet: QuadernoEndpoints['jurisdictionsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'jurisdictions.get',
			input: Inputs.jurisdictionsGet,
			output: Outputs.jurisdictionsGet,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/jurisdictions/${segment(id)}`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('jurisdiction', raw),
			log: ({ id }) => ({ jurisdictionId: id }),
		},
	);

export const createTransaction: QuadernoEndpoints['transactionsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transactions.create',
			input: Inputs.transactionsCreate,
			output: Outputs.transactionsCreate,
			toRequest: (body) => ({ method: 'POST', path: '/transactions', body }),
		},
		input,
		{
			shape: (raw) => wrap('transaction', raw),
			log: ({ type, payment }, result) => ({
				transactionId: result.transaction.id,
				number: result.transaction.number ?? undefined,
				type: type ?? 'sale',
				paymentMethod: payment.method,
			}),
		},
	);

/**
 * Removes `auth_key` from a webhook row. It is the secret Quaderno signs that
 * endpoint's deliveries with, and nothing in this plugin needs it: left in, it
 * would travel to whoever reads the list, including a model's context.
 */
// unknown: one row of the untyped list body; the output schema validates it.
function withoutAuthKey(row: unknown): unknown {
	if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
	// unknown: the remaining fields are passed through as sent.
	const { auth_key: _authKey, ...rest } = row as Record<string, unknown>;
	return rest;
}

export const webhooksList: QuadernoEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
			toRequest: () => ({ method: 'GET', path: '/webhooks' }),
		},
		input,
		{
			shape: (raw) => ({
				webhooks: requireArray(raw, 'webhooks').map(withoutAuthKey),
			}),
			log: (_, result) => ({ count: result.webhooks.length }),
		},
	);
