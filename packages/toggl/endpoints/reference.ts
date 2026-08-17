import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import type { TogglEndpointOutputs } from './types';

/**
 * Static reference data. These endpoints describe Toggl itself rather than the
 * authenticated account, so nothing here is workspace-scoped and none of it is
 * worth persisting locally.
 */

/** Lists the countries Toggl supports, with VAT and currency defaults. */
export const getCountries: TogglEndpoints['referenceGetCountries'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['referenceGetCountries']
	>('countries', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.reference.getCountries',
		auditPayload(input, []),
		'completed',
	);
	return result ?? [];
};

export const getCountrySubdivisions: TogglEndpoints['referenceGetCountrySubdivisions'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['referenceGetCountrySubdivisions']
		>(`countries/${input.country_id}/subdivisions`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'toggl.reference.getCountrySubdivisions',
			auditPayload(input, ['country_id']),
			'completed',
		);
		return result ?? [];
	};

/** Lists the currencies Toggl supports. */
export const getCurrencies: TogglEndpoints['referenceGetCurrencies'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['referenceGetCurrencies']
	>('currencies', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.reference.getCurrencies',
		auditPayload(input, []),
		'completed',
	);
	return result ?? [];
};

/** Lists the timezone names Toggl accepts. */
export const getTimezones: TogglEndpoints['referenceGetTimezones'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['referenceGetTimezones']
	>('timezones', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.reference.getTimezones',
		auditPayload(input, []),
		'completed',
	);
	return result ?? [];
};

export const getTimezoneOffsets: TogglEndpoints['referenceGetTimezoneOffsets'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['referenceGetTimezoneOffsets']
		>('timezones/offsets', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'toggl.reference.getTimezoneOffsets',
			auditPayload(input, []),
			'completed',
		);
		return result ?? [];
	};

/** JWKS keyset for verifying the signature on Toggl-issued JWTs. */
export const getKeys: TogglEndpoints['referenceGetKeys'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['referenceGetKeys']
	>('keys', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.reference.getKeys',
		auditPayload(input, []),
		'completed',
	);
	return result;
};
