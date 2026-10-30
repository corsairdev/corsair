import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Email, phone and bank identifier validation.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Returns metadata (including whether it is valid) for a given email
 * address. This API will check the formatting of the email and the
 * existence of DNS records for the domain to make sure it is a valid email
 * address.
 */
export const email: ApiNinjasEndpoints['validationEmail'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['validationEmail']
	>('validateemail', ctx.key, {
		version: 'v1',
		query: {
			email: input.email,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.validation.email',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns metadata for a given email address, including whether it is from
 * a disposable email provider. We maintain a large database of hundreds of
 * thousands of disposable domains and check against it for every email
 * address.
 */
export const disposableEmail: ApiNinjasEndpoints['validationDisposableEmail'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['validationDisposableEmail']
		>('disposableemailchecker', ctx.key, {
			version: 'v1',
			query: {
				email: input.email,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.validation.disposableEmail',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/**
 * Returns metadata (including whether it is valid) for a given phone
 * number.
 */
export const phone: ApiNinjasEndpoints['validationPhone'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['validationPhone']
	>('validatephone', ctx.key, {
		version: 'v1',
		query: {
			number: input.number,
			country: input.country,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.validation.phone',
		withCount(auditPayload(input, ['country']), result),
		'completed',
	);
	return result;
};

/** Returns detailed information about a bank based on its routing number. */
export const routingNumber: ApiNinjasEndpoints['validationRoutingNumber'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['validationRoutingNumber']
		>('routingnumber', ctx.key, {
			version: 'v1',
			query: {
				routing_number: input.routing_number,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.validation.routingNumber',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/** Returns detailed information on a given IBAN. */
export const iban: ApiNinjasEndpoints['validationIban'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['validationIban']
	>('iban', ctx.key, {
		version: 'v1',
		query: {
			iban: input.iban,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.validation.iban',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns detailed information about a bank based on the BIN number
 * provided.
 */
export const bin: ApiNinjasEndpoints['validationBin'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['validationBin']
	>('bin', ctx.key, {
		version: 'v2',
		query: {
			bin: input.bin,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.validation.bin',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns a list of bank information (including SWIFT/BIC Code) that match
 * the input parameter. Returns at most 100 results. For more results, use
 * the offset parameter.
 */
export const swiftCode: ApiNinjasEndpoints['validationSwiftCode'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['validationSwiftCode']
	>('swiftcode', ctx.key, {
		version: 'v1',
		query: {
			swift: input.swift,
			bank: input.bank,
			city: input.city,
			country: input.country,
			routing_number: input.routing_number,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.validation.swiftCode',
		withCount(
			auditPayload(input, ['bank', 'city', 'country', 'offset']),
			result,
		),
		'completed',
	);
	return result;
};
