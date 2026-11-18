import type { SaperlyEndpoints } from '../index';
import { callSaperly, idempotencyHeaders, omitUndefined } from './call';
import {
	AssistantSchema,
	CheckConsentInputSchema,
	ConsentCheckSchema,
	ConsentSchema,
	HealthSchema,
	MintedTokenSchema,
	MintKeyInputSchema,
	QuoteInputSchema,
	QuoteSchema,
	RecordConsentInputSchema,
	RevokeConsentInputSchema,
	RevokeKeyInputSchema,
	SaperlyEndpointInputSchemas,
	SaperlyEndpointOutputSchemas,
	StatusSchema,
	UsageSchema,
} from './types';

export const listLanguages: SaperlyEndpoints['listLanguages'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.languages.list',
		SaperlyEndpointInputSchemas.listLanguages,
		SaperlyEndpointOutputSchemas.listLanguages,
		input,
		() => ({ method: 'GET', url: '/languages' }),
		(_input, languages) => ({ count: languages.length }),
	);
};

export const getUsage: SaperlyEndpoints['getUsage'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.usage.summary',
		SaperlyEndpointInputSchemas.getUsage,
		UsageSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/usage',
			query: { since: body.since },
		}),
		(body, usage) => ({
			since: body.since ?? null,
			balanceCents: usage.balanceCents,
		}),
	);
};

export const listConsent: SaperlyEndpoints['listConsent'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.consent.list',
		SaperlyEndpointInputSchemas.listConsent,
		SaperlyEndpointOutputSchemas.listConsent,
		input,
		() => ({ method: 'GET', url: '/consent' }),
		(_input, records) => ({ count: records.length }),
	);
};

export const recordConsent: SaperlyEndpoints['recordConsent'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.consent.record',
		RecordConsentInputSchema,
		ConsentSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/consent',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: {
				numberId: body.numberId,
				peerNumber: body.peerNumber,
				consentType: body.consentType,
				source: body.source,
			},
		}),
		(body, record) => ({
			consentId: record.id,
			numberId: body.numberId,
			consentType: body.consentType,
		}),
	);
};

export const revokeConsent: SaperlyEndpoints['revokeConsent'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.consent.revoke',
		RevokeConsentInputSchema,
		StatusSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/consent/revoke',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: { numberId: body.numberId, peerNumber: body.peerNumber },
		}),
		(body, result) => ({ numberId: body.numberId, status: result.status }),
	);
};

export const checkConsent: SaperlyEndpoints['checkConsent'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.consent.check',
		CheckConsentInputSchema,
		ConsentCheckSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/consent/check',
			query: { numberId: body.numberId, peerNumber: body.peerNumber },
		}),
		(body, result) => ({
			numberId: body.numberId,
			hasConsent: result.hasConsent,
		}),
	);
};

export const quotePrice: SaperlyEndpoints['quotePrice'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.pricing.quote',
		QuoteInputSchema,
		QuoteSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/pricing/quote',
			query: { country: body.country, numberType: body.numberType },
		}),
		(body, quote) => ({
			country: body.country,
			numberType: body.numberType,
			customerMonthlyCents: quote.customerMonthlyCents,
		}),
	);
};

export const listKeys: SaperlyEndpoints['listKeys'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.keys.list',
		SaperlyEndpointInputSchemas.listKeys,
		SaperlyEndpointOutputSchemas.listKeys,
		input,
		() => ({ method: 'GET', url: '/api-tokens' }),
		(_input, keys) => ({ count: keys.length }),
	);
};

export const mintKey: SaperlyEndpoints['mintKey'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.keys.mint',
		MintKeyInputSchema,
		MintedTokenSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/api-tokens',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: omitUndefined({
				name: body.name,
				scopes: body.scopes,
				numberScope: body.numberScope,
				spendLimitCents: body.spendLimitCents,
				spendLimitResetPeriod: body.spendLimitResetPeriod,
			}),
		}),
		(body, key) => ({ keyId: key.id, name: body.name }),
	);
};

export const revokeKey: SaperlyEndpoints['revokeKey'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.keys.revoke',
		RevokeKeyInputSchema,
		StatusSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/api-tokens/{id}/revoke',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
		}),
		(body, result) => ({ keyId: body.id, status: result.status }),
	);
};

export const checkHealth: SaperlyEndpoints['checkHealth'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.health.check',
		SaperlyEndpointInputSchemas.checkHealth,
		HealthSchema,
		input,
		() => ({ method: 'GET', url: '/health' }),
		(_input, health) => ({ status: health.status }),
	);
};

export const askAssistant: SaperlyEndpoints['askAssistant'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.assistant.answer',
		SaperlyEndpointInputSchemas.askAssistant,
		AssistantSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/assistant/answer',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: {
				workspaceSlug: body.workspaceSlug,
				question: body.question,
			},
		}),
		(body) => ({ workspaceSlug: body.workspaceSlug }),
	);
};
