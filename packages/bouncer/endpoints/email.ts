import { logEventFromContext } from 'corsair/core';
import type { BouncerEndpoints } from '..';
import { makeBouncerRequest } from '../client';
import type { BouncerEndpointOutputs } from './types';

export const verifyEmail: BouncerEndpoints['verifyEmail'] = async (
	ctx,
	input,
) => {
	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['verifyEmail']
	>('v1.1/email/verify', ctx.key, {
		method: 'GET',
		query: {
			email: input.email,
			timeout: input.timeout,
		},
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
	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['verifyDomain']
	>('v1.1/domain', ctx.key, {
		method: 'GET',
		query: { domain: input.domain },
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
		// Bouncer rejects bare strings here, so the shorthand form is expanded.
		const body = input.recipients.map((recipient) =>
			typeof recipient === 'string' ? { email: recipient } : recipient,
		);

		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['createBatchRequest']
		>('v1.1/email/verify/batch', ctx.key, {
			method: 'POST',
			body,
			// `callback` is a query parameter, not part of the request body.
			query: { callback: input.callback },
		});

		await logEventFromContext(
			ctx,
			'bouncer.email.createBatchRequest',
			{ count: input.recipients.length },
			'completed',
		);
		return response;
	};

export const getBatchStatus: BouncerEndpoints['getBatchStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['getBatchStatus']
	>(`v1.1/email/verify/batch/${encodeURIComponent(input.batchId)}`, ctx.key, {
		method: 'GET',
		query: { 'with-stats': input.withStats },
	});

	await logEventFromContext(
		ctx,
		'bouncer.email.getBatchStatus',
		{ batchId: input.batchId },
		'completed',
	);
	return response;
};

export const getBatchResults: BouncerEndpoints['getBatchResults'] = async (
	ctx,
	input,
) => {
	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['getBatchResults']
	>(
		`v1.1/email/verify/batch/${encodeURIComponent(input.batchId)}/download`,
		ctx.key,
		{
			method: 'GET',
			query: { download: input.download },
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
	// Bouncer answers 202 with an empty body, so there is nothing to decode.
	const response = await makeBouncerRequest<
		BouncerEndpointOutputs['finishBatch'] | undefined
	>(
		`v1.1/email/verify/batch/${encodeURIComponent(input.batchId)}/finish`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'bouncer.email.finishBatch',
		{ batchId: input.batchId },
		'completed',
	);
	return response ?? {};
};

export const deleteBatchRequest: BouncerEndpoints['deleteBatchRequest'] =
	async (ctx, input) => {
		// Bouncer answers 200 with an empty body, so there is nothing to decode.
		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['deleteBatchRequest'] | undefined
		>(`v1.1/email/verify/batch/${encodeURIComponent(input.batchId)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'bouncer.email.deleteBatchRequest',
			{ batchId: input.batchId },
			'completed',
		);
		return response ?? {};
	};
