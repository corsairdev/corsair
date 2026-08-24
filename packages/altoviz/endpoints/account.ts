import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheClassification, cacheUnit, cacheVat } from './persist';
import type { AltovizEndpointOutputs } from './types';

export const getCurrentUser: AltovizEndpoints['account']['getCurrentUser'] =
	async (ctx) => {
		// /v1/users/me and /v1/users/whoami share an operationId and return a
		// byte-identical body, confirmed live - only one route is called here.
		const result = await makeAltovizRequest<
			AltovizEndpointOutputs['accountGetCurrentUser']
		>('v1/users/me', ctx.key);

		await logEventFromContext(
			ctx,
			'altoviz.account.getCurrentUser',
			{},
			'completed',
		);
		return result;
	};

/**
 * `/hello` takes no parameters. The spec declares an optional `api-version`
 * query parameter, but sending it - with the document's own version string -
 * returns 400 with an empty body, confirmed live. Sending nothing returns 200
 * with the account identity, so nothing is sent.
 */
export const testApiKey: AltovizEndpoints['account']['testApiKey'] = async (
	ctx,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['accountTestApiKey']
	>('hello', ctx.key);

	await logEventFromContext(ctx, 'altoviz.account.testApiKey', {}, 'completed');
	return result;
};

export const getSettings: AltovizEndpoints['account']['getSettings'] = async (
	ctx,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['accountGetSettings']
	>('v1/settings', ctx.key);

	await logEventFromContext(
		ctx,
		'altoviz.account.getSettings',
		{},
		'completed',
	);
	return result;
};

export const getUnits: AltovizEndpoints['account']['getUnits'] = async (
	ctx,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['accountGetUnits']
	>('v1/units', ctx.key);

	for (const unit of result) await cacheUnit(ctx.db.units, unit);

	await logEventFromContext(ctx, 'altoviz.account.getUnits', {}, 'completed');
	return result;
};

export const getVats: AltovizEndpoints['account']['getVats'] = async (ctx) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['accountGetVats']
	>('v1/vats', ctx.key);

	for (const vat of result) await cacheVat(ctx.db.vats, vat);

	await logEventFromContext(ctx, 'altoviz.account.getVats', {}, 'completed');
	return result;
};

export const getClassifications: AltovizEndpoints['account']['getClassifications'] =
	async (ctx, input) => {
		const result = await makeAltovizRequest<
			AltovizEndpointOutputs['accountGetClassifications']
		>('v1/classifications', ctx.key, { query: { type: input.type } });

		for (const classification of result) {
			await cacheClassification(ctx.db.classifications, classification);
		}

		await logEventFromContext(
			ctx,
			'altoviz.account.getClassifications',
			auditPayload(input),
			'completed',
		);
		return result;
	};
