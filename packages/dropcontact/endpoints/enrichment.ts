import { asRecord } from 'corsair/core';
import type { DropcontactEndpoints } from '..';
import { call, throwIfFailed } from './call';
import {
	DropcontactEndpointInputSchemas as Inputs,
	DropcontactEndpointOutputSchemas as Outputs,
} from './types';

// unknown: `data` is the provider's payload, which the output schema validates.
function dataOf(raw: unknown): unknown {
	return asRecord(raw)?.data;
}

// unknown: the envelope fields the routes repeat, renamed once here.
function envelopeOf(raw: unknown) {
	const record = asRecord(raw) ?? {};
	const creditsLeft = record.credits_left;
	return {
		error: record.error,
		success: record.success,
		creditsLeft: typeof creditsLeft === 'number' ? creditsLeft : undefined,
	};
}

export const enrich: DropcontactEndpoints['enrichmentEnrich'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'enrichment.enrich',
			input: Inputs.enrichmentEnrich,
			output: Outputs.enrichmentEnrich,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/enrich/all',
			// The spec reads this one option from the query string, not the body.
			query: { hashedInputs: parsed.hashed_inputs },
			body: {
				data: parsed.data,
				siren: parsed.siren,
				language: parsed.language,
				custom_callback_url: parsed.custom_callback_url,
			},
		}),
		{
			shape: (raw) => {
				// The submission itself must have worked: a 200 with success false
				// here is a real failure, unlike a not-ready result.
				throwIfFailed(raw);
				const record = asRecord(raw) ?? {};
				return {
					request_id: record.request_id,
					hashed_inputs: record.hashedInputs,
					records: dataOf(raw),
					...envelopeOf(raw),
				};
			},
			log: (parsed, result) => ({
				records: parsed.data.length,
				requestId: result.request_id,
				creditsLeft: result.creditsLeft ?? undefined,
			}),
		},
	);

export const results: DropcontactEndpoints['enrichmentResults'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'enrichment.results',
			input: Inputs.enrichmentResults,
			output: Outputs.enrichmentResults,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/enrich/all/${encodeURIComponent(parsed.request_id)}`,
			query: { forceResults: parsed.force_results },
		}),
		{
			// No throwIfFailed here on purpose: `success: false` is how a batch that
			// is still processing answers, and the caller polls again.
			shape: (raw) => {
				const record = asRecord(raw) ?? {};
				const { error, success, creditsLeft } = envelopeOf(raw);
				// The spec defaults this to true, so a body without it succeeded.
				const succeeded = success ?? true;
				// The provider only sets `status` when `force_results` is passed, so
				// it is derived here when absent. That keeps it readable on every
				// poll, which is what the declared job follows.
				const status =
					typeof record.status === 'string'
						? record.status
						: succeeded
							? 'ready'
							: 'in_progress';
				return {
					records: dataOf(raw) ?? [],
					status,
					reason: record.reason,
					error,
					success: succeeded,
					creditsLeft,
				};
			},
			log: (parsed, result) => ({
				requestId: parsed.request_id,
				records: result.records.length,
				// A forced partial read is success: true with status in_progress, so
				// the flag follows the batch status, not the envelope.
				ready: result.status === 'ready',
			}),
		},
	);

export const credits: DropcontactEndpoints['accountCredits'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.credits',
			input: Inputs.accountCredits,
			output: Outputs.accountCredits,
		},
		input,
		() => ({ method: 'GET', path: '/v1/account/credits' }),
		{
			shape: (raw) => {
				throwIfFailed(raw);
				return { credits: asRecord(raw)?.credits };
			},
			log: (_, result) => ({ credits: result.credits }),
		},
	);

export const getWebhook: DropcontactEndpoints['webhookGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhook.get',
			input: Inputs.webhookGet,
			output: Outputs.webhookGet,
		},
		input,
		() => ({ method: 'GET', path: '/v1/enrich/webhook' }),
		{
			shape: (raw) => ({
				callback_url: asRecord(raw)?.callback_url,
				...envelopeOf(raw),
			}),
			log: (_, result) => ({ configured: result.callback_url !== null }),
		},
	);

export const setWebhook: DropcontactEndpoints['webhookSet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhook.set',
			input: Inputs.webhookSet,
			output: Outputs.webhookSet,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: '/v1/enrich/webhook',
			body: { callback_url: parsed.callback_url },
		}),
		{
			shape: (raw) => {
				throwIfFailed(raw);
				return {
					callback_url: asRecord(raw)?.callback_url,
					...envelopeOf(raw),
				};
			},
			log: () => ({}),
		},
	);

export const removeWebhook: DropcontactEndpoints['webhookRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhook.remove',
			input: Inputs.webhookRemove,
			output: Outputs.webhookRemove,
		},
		input,
		() => ({ method: 'DELETE', path: '/v1/enrich/webhook' }),
		{
			// The only route with no envelope: it answers `{ detail }`.
			shape: (raw) => ({ detail: asRecord(raw)?.detail }),
			log: () => ({}),
		},
	);
