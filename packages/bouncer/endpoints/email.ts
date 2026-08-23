import { logEventFromContext } from 'corsair/core';
import type { BouncerEndpoints } from '..';
import { makeBouncerRequest } from '../client';
import type { BouncerEndpointOutputs } from './types';

export const verifyEmail: BouncerEndpoints['verifyEmail'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		email: input.email,
		timeout: input.timeout,
	};

	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['verifyEmail']
	>('email/verify', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'bouncer.email.verifyEmail',
		{ email: input.email },
		'completed',
	);
	return response;
};

export const verifyDomain: BouncerEndpoints['verifyDomain'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		domain: input.domain,
		timeout: input.timeout,
	};

	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['verifyDomain']
	>('domain/verify', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'bouncer.email.verifyDomain',
		{ domain: input.domain },
		'completed',
	);
	return response;
};

export const createBatchRequest: BouncerEndpoints['createBatchRequest'] =
	async (ctx, input) => {
		const body = Array.isArray(input.recipients)
			? input.recipients.map((r) => (typeof r === 'string' ? { email: r } : r))
			: input;

		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['createBatchRequest']
		>('email/verify/batch', ctx.key, {
			method: 'POST',
			body: body as unknown as Record<string, unknown>,
		});

		await logEventFromContext(
			ctx,
			'bouncer.email.createBatchRequest',
			{ count: Array.isArray(input.recipients) ? input.recipients.length : 0 },
			'completed',
		);
		return response;
	};

export const getBatchResults: BouncerEndpoints['getBatchResults'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		download: input.download,
	};

	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['getBatchResults']
	>(
		`email/verify/batch/${encodeURIComponent(input.batchId)}/download`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'bouncer.email.getBatchResults',
		{ batchId: input.batchId },
		'completed',
	);
	return response;
};

export const finishBatch: BouncerEndpoints['finishBatch'] = async (
	ctx,
	input,
) => {
	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['finishBatch']
	>(`email/verify/batch/${encodeURIComponent(input.batchId)}/finish`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'bouncer.email.finishBatch',
		{ batchId: input.batchId },
		'completed',
	);
	return response;
};

export const deleteBatchRequest: BouncerEndpoints['deleteBatchRequest'] =
	async (ctx, input) => {
		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['deleteBatchRequest']
		>(`email/verify/batch/${encodeURIComponent(input.batchId)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'bouncer.email.deleteBatchRequest',
			{ batchId: input.batchId },
			'completed',
		);
		return response;
	};
