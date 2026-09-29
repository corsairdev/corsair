import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	FetchIpLocationInput,
	FetchIpLocationResponse,
	RequestAiCompletionInput,
	RequestAiCompletionResponse,
	SolveHCaptchaInput,
	SolveHCaptchaResponse,
	SolveRecaptchaInput,
	SolveRecaptchaResponse,
} from './types';

export const fetchIpLocation = async (
	ctx: PhantomBusterContext,
	input: FetchIpLocationInput,
): Promise<FetchIpLocationResponse> => {
	const response = await makePhantomBusterRequest<FetchIpLocationResponse>(
		'/location/ip',
		ctx.key,
		{
			method: 'GET',
			query: { ip: input.ip },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.misc.fetchIpLocation',
		{},
		'completed',
	);

	return response;
};

export const solveHCaptcha = async (
	ctx: PhantomBusterContext,
	input: SolveHCaptchaInput,
): Promise<SolveHCaptchaResponse> => {
	const response = await makePhantomBusterRequest<SolveHCaptchaResponse>(
		'/hcaptcha',
		ctx.key,
		{
			method: 'POST',
			body: { url: input.url, key: input.key },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.misc.solveHCaptcha',
		{},
		'completed',
	);

	return response;
};

export const solveRecaptcha = async (
	ctx: PhantomBusterContext,
	input: SolveRecaptchaInput,
): Promise<SolveRecaptchaResponse> => {
	// unknown: POST bodies are endpoint-specific JSON shapes accepted by makePhantomBusterRequest.
	const body: Record<string, unknown> = {
		url: input.url,
		key: input.key,
		type: input.type,
	};
	if (input.minScore !== undefined) body.minScore = input.minScore;
	if (input.pageAction !== undefined) body.pageAction = input.pageAction;
	if (input.enterprise !== undefined) body.enterprise = input.enterprise;

	const response = await makePhantomBusterRequest<SolveRecaptchaResponse>(
		'/recaptcha',
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.misc.solveRecaptcha',
		{},
		'completed',
	);

	return response;
};

export const requestAiCompletion = async (
	ctx: PhantomBusterContext,
	input: RequestAiCompletionInput,
): Promise<RequestAiCompletionResponse> => {
	const response = await makePhantomBusterRequest<RequestAiCompletionResponse>(
		'/ai/completions',
		ctx.key,
		{
			method: 'POST',
			body: {
				messages: input.messages.map((message) => ({ ...message })),
				model: input.model,
				temperature: input.temperature,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.misc.requestAiCompletion',
		{},
		'completed',
	);

	return response;
};
