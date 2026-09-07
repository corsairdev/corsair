import type { EventLoggingContext } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeDocupostRequest } from '../client';
import type { DocupostEndpointOutputs } from './types';
import {
	DocupostEndpointInputSchemas,
	DocupostEndpointOutputSchemas,
} from './types';

export type DocupostHandlerContext = EventLoggingContext & {
	key: string;
};

class DocupostValidationError extends Error {
	constructor(
		public readonly kind: 'input' | 'output',
		public readonly operation: string,
		// unknown is necessary because Zod issue arrays are provider-agnostic; a closed issue union is infeasible because paths and codes vary by schema
		public readonly issues: unknown,
	) {
		super(`[docupost] ${kind} validation failed for ${operation}: ${issues}`);
		this.name = 'DocupostValidationError';
	}
}

function parseInput<T extends z.ZodTypeAny>(
	operation: string,
	schema: T,
	// unknown is necessary because handlers receive shared raw input bags; a closed input union is infeasible because each operation validates its own shape
	input: unknown,
): z.infer<T> {
	const parsed = schema.safeParse(input);
	if (!parsed.success) {
		throw new DocupostValidationError('input', operation, parsed.error);
	}
	return parsed.data;
}

export const accountBalance = async (
	ctx: DocupostHandlerContext,
	// unknown is necessary because handler inputs are raw bags validated by the operation schema; a closed bag type is infeasible because three operations share this handler shape
	input: Record<string, unknown>,
): Promise<DocupostEndpointOutputs['accountBalance']> => {
	const parsed = parseInput(
		'accountBalance',
		DocupostEndpointInputSchemas.accountBalance,
		input,
	);
	const response = await makeDocupostRequest<
		DocupostEndpointOutputs['accountBalance']
	>('accountbalance', ctx.key, {
		method: 'GET',
		outputSchema: DocupostEndpointOutputSchemas.accountBalance,
	});

	await logEventFromContext(ctx, 'docupost.account.balance', {
		operation: 'accountbalance',
	});

	return response;
};

export const sendLetter = async (
	ctx: DocupostHandlerContext,
	// unknown is necessary because handler inputs are raw bags validated by the operation schema; a closed bag type is infeasible because three operations share this handler shape
	input: Record<string, unknown>,
): Promise<DocupostEndpointOutputs['sendLetter']> => {
	const parsed = parseInput(
		'sendLetter',
		DocupostEndpointInputSchemas.sendLetter,
		input,
	);
	const {
		to_name,
		to_address,
		to_city,
		to_state,
		to_zip,
		from_name,
		from_address,
		from_city,
		from_state,
		from_zip,
		pdf_url,
		html,
	} = parsed;

	const query: Record<string, string | undefined> = {
		to_name,
		to_address1: to_address,
		to_city,
		to_state,
		to_zip,
		from_name,
		from_address1: from_address,
		from_city,
		from_state,
		from_zip,
		pdf: pdf_url,
	};

	const response = await makeDocupostRequest<
		DocupostEndpointOutputs['sendLetter']
	>('sendletter', ctx.key, {
		method: 'POST',
		query,
		body: html ? { html } : undefined,
		outputSchema: DocupostEndpointOutputSchemas.sendLetter,
	});

	await logEventFromContext(ctx, 'docupost.send.letter', {
		operation: 'sendletter',
		has_pdf: Boolean(pdf_url),
	});

	return response;
};

export const sendPostcard = async (
	ctx: DocupostHandlerContext,
	// unknown is necessary because handler inputs are raw bags validated by the operation schema; a closed bag type is infeasible because three operations share this handler shape
	input: Record<string, unknown>,
): Promise<DocupostEndpointOutputs['sendPostcard']> => {
	const parsed = parseInput(
		'sendPostcard',
		DocupostEndpointInputSchemas.sendPostcard,
		input,
	);
	const {
		to_name,
		to_address,
		to_city,
		to_state,
		to_zip,
		from_name,
		from_address,
		from_city,
		from_state,
		from_zip,
		front_image_url,
		back_image_url,
	} = parsed;

	const response = await makeDocupostRequest<
		DocupostEndpointOutputs['sendPostcard']
	>('sendpostcard', ctx.key, {
		method: 'POST',
		query: {
			to_name,
			to_address1: to_address,
			to_city,
			to_state,
			to_zip,
			from_name,
			from_address1: from_address,
			from_city,
			from_state,
			from_zip,
			front_image: front_image_url,
			back_image: back_image_url,
		},
		outputSchema: DocupostEndpointOutputSchemas.sendPostcard,
	});

	await logEventFromContext(ctx, 'docupost.send.postcard', {
		operation: 'sendpostcard',
	});

	return response;
};
