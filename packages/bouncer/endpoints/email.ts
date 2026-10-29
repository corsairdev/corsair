import { logEventFromContext } from 'corsair/core';
import type { BouncerEndpoints } from '..';
import { makeBouncerRequest, redactEmail } from '../client';
import {
	CreateBatchRequestResponseSchema,
	DeleteBatchRequestResponseSchema,
	FinishBatchResponseSchema,
	GetBatchResultsResponseSchema,
	GetBatchStatusResponseSchema,
	VerifyDomainResponseSchema,
	VerifyEmailResponseSchema,
} from './types';

// Bouncer's responses are not guaranteed to match our types at compile time,
// so every handler parses the registered output schema before returning.

export const verifyEmail: BouncerEndpoints['verifyEmail'] = async (
	ctx,
	input,
) => {
	const raw = await makeBouncerRequest<unknown>('v1.1/email/verify', ctx.key, {
		method: 'GET',
		query: {
			email: input.email,
			timeout: input.timeout,
		},
	});
	const response = VerifyEmailResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'bouncer.email.verifyEmail',
		{ email: redactEmail(input.email) },
		'completed',
	);
	return response;
};

export const verifyDomain: BouncerEndpoints['verifyDomain'] = async (
	ctx,
	input,
) => {
	const raw = await makeBouncerRequest<unknown>('v1.1/domain', ctx.key, {
		method: 'GET',
		query: { domain: input.domain },
	});
	const response = VerifyDomainResponseSchema.parse(raw);

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

		const raw = await makeBouncerRequest<unknown>(
			'v1.1/email/verify/batch',
			ctx.key,
			{
				method: 'POST',
				body,
				// `callback` is a query parameter, not part of the request body.
				query: { callback: input.callback },
			},
		);
		const response = CreateBatchRequestResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'bouncer.email.createBatchRequest',
			{ batchId: response.batchId, count: input.recipients.length },
			'completed',
		);
		return response;
	};

export const getBatchStatus: BouncerEndpoints['getBatchStatus'] = async (
	ctx,
	input,
) => {
	const raw = await makeBouncerRequest<unknown>(
		`v1.1/email/verify/batch/${encodeURIComponent(input.batchId)}`,
		ctx.key,
		{
			method: 'GET',
			query: { 'with-stats': input.withStats },
		},
	);
	const response = GetBatchStatusResponseSchema.parse(raw);

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
	const raw = await makeBouncerRequest<unknown>(
		`v1.1/email/verify/batch/${encodeURIComponent(input.batchId)}/download`,
		ctx.key,
		{
			method: 'GET',
			query: { download: input.download },
		},
	);
	const response = GetBatchResultsResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'bouncer.email.getBatchResults',
		{ batchId: input.batchId, count: response.length },
		'completed',
	);
	return response;
};

export const finishBatch: BouncerEndpoints['finishBatch'] = async (
	ctx,
	input,
) => {
	// Bouncer answers 202 with an empty body, so there is nothing to decode.
	const raw = await makeBouncerRequest<unknown>(
		`v1.1/email/verify/batch/${encodeURIComponent(input.batchId)}/finish`,
		ctx.key,
		{ method: 'POST' },
	);
	const response = FinishBatchResponseSchema.parse(raw ?? {});

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
		// Bouncer answers 200 with an empty body, so there is nothing to decode.
		const raw = await makeBouncerRequest<unknown>(
			`v1.1/email/verify/batch/${encodeURIComponent(input.batchId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const response = DeleteBatchRequestResponseSchema.parse(raw ?? {});

		await logEventFromContext(
			ctx,
			'bouncer.email.deleteBatchRequest',
			{ batchId: input.batchId },
			'completed',
		);
		return response;
	};
