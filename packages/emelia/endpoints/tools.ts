import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRestRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

// Tools (finder/verifier jobs) — request/response shapes verified from the
// docs OpenAPI blobs (base https://api.emelia.io, `Authorization: <key>`).

export const findEmailSingle: EmeliaEndpoints['findEmailSingle'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['findEmailSingle']
	>('/tools/find/email', ctx.key, {
		method: 'POST',
		body: {
			fullname: input.fullname,
			companyName: input.companyName,
			...(input.companyWebsite !== undefined
				? { companyWebsite: input.companyWebsite }
				: {}),
			...(input.country !== undefined ? { country: input.country } : {}),
		},
	});

	await logEventFromContext(
		ctx,
		'emelia.tools.findEmailSingle',
		{ fullname: input.fullname, companyName: input.companyName },
		'completed',
	);
	return response;
};

export const getFindEmailResult: EmeliaEndpoints['getFindEmailResult'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['getFindEmailResult']
	>(`/tools/find/email/${encodeURIComponent(input.jobId)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'emelia.tools.getFindEmailResult',
		{ jobId: input.jobId },
		'completed',
	);
	return response;
};

export const findPhoneSingle: EmeliaEndpoints['findPhoneSingle'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['findPhoneSingle']
	>('/tools/find/phone', ctx.key, {
		method: 'POST',
		body: { linkedinUrl: input.linkedinUrl },
	});

	await logEventFromContext(
		ctx,
		'emelia.tools.findPhoneSingle',
		{ linkedinUrl: input.linkedinUrl },
		'completed',
	);
	return response;
};

export const getFindPhoneResult: EmeliaEndpoints['getFindPhoneResult'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['getFindPhoneResult']
	>(`/tools/find/phone/${encodeURIComponent(input.jobId)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'emelia.tools.getFindPhoneResult',
		{ jobId: input.jobId },
		'completed',
	);
	return response;
};

export const verifyEmailSingle: EmeliaEndpoints['verifyEmailSingle'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['verifyEmailSingle']
	>('/tools/verify/email', ctx.key, {
		method: 'POST',
		body: { email: input.email },
	});

	await logEventFromContext(
		ctx,
		'emelia.tools.verifyEmailSingle',
		{ email: input.email },
		'completed',
	);
	return response;
};

export const getVerifyEmailResult: EmeliaEndpoints['getVerifyEmailResult'] =
	async (ctx, input) => {
		const response = await makeEmeliaRestRequest<
			EmeliaEndpointOutputs['getVerifyEmailResult']
		>(`/tools/verify/email/${encodeURIComponent(input.jobId)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'emelia.tools.getVerifyEmailResult',
			{ jobId: input.jobId },
			'completed',
		);
		return response;
	};
