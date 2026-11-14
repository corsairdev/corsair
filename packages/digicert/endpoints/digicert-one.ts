import { logEventFromContext } from 'corsair/core';
import type { DigicertEndpoints } from '..';
import { makeDigicertRequest } from '../client';
import {
	DigicertEndpointInputSchemas,
	DigicertEndpointOutputSchemas,
} from './types';

export const accountManagerLocales: DigicertEndpoints['accountManager']['locales'] =
	async (ctx, input) => {
		DigicertEndpointInputSchemas.accountManagerLocales.parse(input);
		const response = await makeDigicertRequest(
			'accountManager',
			'/account/api/v1/locales',
			ctx.key,
			{ method: 'GET', digicertOneRegion: ctx.options.digicertOneRegion },
		);
		const parsed =
			DigicertEndpointOutputSchemas.accountManagerLocales.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.accountManager.locales',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	};

export const privateCAHelper: DigicertEndpoints['privateCA']['helper'] = async (
	ctx,
	input,
) => {
	DigicertEndpointInputSchemas.privateCAHelper.parse(input);
	const response = await makeDigicertRequest(
		'privateCA',
		'/certificate-authority/api/v1/helper',
		ctx.key,
		{ method: 'GET', digicertOneRegion: ctx.options.digicertOneRegion },
	);
	const parsed = DigicertEndpointOutputSchemas.privateCAHelper.parse(response);
	await logEventFromContext(ctx, 'digicert.privateCA.helper', {}, 'completed');
	return parsed;
};

export const certificateTags: DigicertEndpoints['trustLifecycle']['addCertificateTags'] =
	async (ctx, input) => {
		const parsedInput =
			DigicertEndpointInputSchemas.certificateTags.parse(input);
		const response = await makeDigicertRequest<undefined>(
			'trustLifecycle',
			`/mpki/api/v1/certificate/${encodeURIComponent(parsedInput.certificateId)}/tag`,
			ctx.key,
			{
				method: 'POST',
				body: { tags: parsedInput.tags },
				digicertOneRegion: ctx.options.digicertOneRegion,
			},
		);
		const parsed =
			DigicertEndpointOutputSchemas.certificateTags.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.trustLifecycle.addCertificateTags',
			{ count: parsedInput.tags.length },
			'completed',
		);
		return parsed;
	};

export const verifyTemplate: DigicertEndpoints['privateCA']['verifyTemplate'] =
	async (ctx, input) => {
		const parsedInput =
			DigicertEndpointInputSchemas.verifyTemplate.parse(input);
		const response = await makeDigicertRequest<undefined>(
			'privateCA',
			'/certificate-authority/api/v1/template/verify',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
				digicertOneRegion: ctx.options.digicertOneRegion,
			},
		);
		const parsed = DigicertEndpointOutputSchemas.verifyTemplate.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.privateCA.verifyTemplate',
			{},
			'completed',
		);
		return parsed;
	};
