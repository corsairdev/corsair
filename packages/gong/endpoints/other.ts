import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';
import type { GongOtherOutputs } from './other-types';

type OtherOp = keyof GongOtherOutputs;
type OtherEndpoint<K extends OtherOp> = (
	ctx: GongFamilyContext,
	input: GongOtherOutputs[K] extends never
		? never
		: import('./other-types').GongOtherInputs[K],
) => Promise<GongOtherOutputs[K]>;

async function send<T>(
	ctx: GongFamilyContext,
	op: OtherOp,
	method: 'GET' | 'POST',
	path: string,
	input: Record<string, unknown>,
	query?: Record<string, unknown>,
	body?: unknown,
): Promise<T> {
	const baseUrl = ctx.options.baseUrl;
	if (!baseUrl)
		throw new Error(
			'Gong baseUrl is required; use the workspace API URL from Gong',
		);
	const parsed = new URL(baseUrl);
	if (
		parsed.protocol !== 'https:' ||
		parsed.username ||
		parsed.password ||
		parsed.search ||
		parsed.hash
	)
		throw new Error('Gong baseUrl must be a safe HTTPS URL');
	const credentials = gongCredentials(ctx);
	const response = await gongRequest<T>({
		baseUrl,
		credentials,
		method,
		path,
		query,
		body,
	});
	await logEventFromContext(ctx, `gong.${op}`, input, 'completed');
	return response;
}

export const addDigitalInteraction = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['addDigitalInteraction'],
) =>
	send<GongOtherOutputs['addDigitalInteraction']>(
		ctx,
		'addDigitalInteraction',
		'POST',
		'/v2/digital-interaction',
		input,
		undefined,
		input,
	);
export const purgePhoneNumber = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['purgePhoneNumber'],
) =>
	send<GongOtherOutputs['purgePhoneNumber']>(
		ctx,
		'purgePhoneNumber',
		'POST',
		'/v2/data-privacy/erase-data-for-phone-number',
		input,
		input,
	);
export const purgeEmailAddress = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['purgeEmailAddress'],
) =>
	send<GongOtherOutputs['purgeEmailAddress']>(
		ctx,
		'purgeEmailAddress',
		'POST',
		'/v2/data-privacy/erase-data-for-email-address',
		input,
		input,
	);
export const findAllReferencesToPhoneNumber = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['findAllReferencesToPhoneNumber'],
) =>
	send<GongOtherOutputs['findAllReferencesToPhoneNumber']>(
		ctx,
		'findAllReferencesToPhoneNumber',
		'GET',
		'/v2/data-privacy/data-for-phone-number',
		input,
		input,
	);
export const findAllReferencesToEmailAddress = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['findAllReferencesToEmailAddress'],
) =>
	send<GongOtherOutputs['findAllReferencesToEmailAddress']>(
		ctx,
		'findAllReferencesToEmailAddress',
		'GET',
		'/v2/data-privacy/data-for-email-address',
		input,
		input,
	);
export const accountsEnrich = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['accountsEnrich'],
) => {
	const { dataCategories, ...body } = input;
	return send<GongOtherOutputs['accountsEnrich']>(
		ctx,
		'accountsEnrich',
		'POST',
		'/v2/accounts/enrich',
		input,
		{ dataCategories },
		body,
	);
};
export const getAccountsEnrichResults = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['getAccountsEnrichResults'],
) => {
	if (!/^[A-Za-z0-9_-]+$/.test(input.jobId))
		throw new Error('Unsafe Gong job id');
	return send<GongOtherOutputs['getAccountsEnrichResults']>(
		ctx,
		'getAccountsEnrichResults',
		'GET',
		`/v2/accounts/enrich/${encodeURIComponent(input.jobId)}/results`,
		input,
	);
};
export const contactsEnrich = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['contactsEnrich'],
) => {
	const { dataCategories, ...body } = input;
	return send<GongOtherOutputs['contactsEnrich']>(
		ctx,
		'contactsEnrich',
		'POST',
		'/v2/contacts/enrich',
		input,
		{ dataCategories },
		body,
	);
};
export const getContactsEnrichResults = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['getContactsEnrichResults'],
) => {
	if (!/^[A-Za-z0-9_-]+$/.test(input.jobId))
		throw new Error('Unsafe Gong job id');
	return send<GongOtherOutputs['getContactsEnrichResults']>(
		ctx,
		'getContactsEnrichResults',
		'GET',
		`/v2/contacts/enrich/${encodeURIComponent(input.jobId)}/results`,
		input,
	);
};
export const listLogs = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['listLogs'],
) =>
	send<GongOtherOutputs['listLogs']>(
		ctx,
		'listLogs',
		'GET',
		'/v2/logs',
		input,
		input,
	);
export const generateBrief = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['generateBrief'],
) =>
	send<GongOtherOutputs['generateBrief']>(
		ctx,
		'generateBrief',
		'GET',
		'/v2/entities/get-brief',
		input,
		input,
	);
export const askEntity = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['askEntity'],
) =>
	send<GongOtherOutputs['askEntity']>(
		ctx,
		'askEntity',
		'GET',
		'/v2/entities/ask-entity',
		input,
		input,
	);
export const listCoaching = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['listCoaching'],
) =>
	send<GongOtherOutputs['listCoaching']>(
		ctx,
		'listCoaching',
		'GET',
		'/v2/coaching',
		input,
		input,
	);
export const listCallOutcomes = (
	ctx: GongFamilyContext,
	input: import('./other-types').GongOtherInputs['listCallOutcomes'],
) =>
	send<GongOtherOutputs['listCallOutcomes']>(
		ctx,
		'listCallOutcomes',
		'GET',
		'/v2/call-outcomes',
		input,
		input,
	);
