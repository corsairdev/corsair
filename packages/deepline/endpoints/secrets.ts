import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	InspectSecretInputSchema,
	InspectSecretOutputSchema,
	ListSecretsInputSchema,
	ListSecretsOutputSchema,
	SetSecretInputSchema,
	SetSecretOutputSchema,
	UpdateSecretNoteInputSchema,
	UpdateSecretNoteOutputSchema,
} from './types-integrations';
// Secret values go up in secrets.set only. Every response is metadata, and the
// output schemas strip unknown keys so no value can be passed back.

export const list = defineEndpoint({
	event: 'deepline.secrets.list',
	input: ListSecretsInputSchema,
	output: ListSecretsOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`/api/v2/secrets`, ctx.key, { method: 'GET' }),
});
/** Effective scope and active-version health of one secret, without its value. */
export const inspect = defineEndpoint({
	event: 'deepline.secrets.inspect',
	input: InspectSecretInputSchema,
	output: InspectSecretOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/secrets`, ctx.key, {
			method: 'GET',
			query: { name: input.name, play: input.playName },
		}),
});
/** Creates or rotates a secret. */
export const set = defineEndpoint({
	event: 'deepline.secrets.set',
	input: SetSecretInputSchema,
	output: SetSecretOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/secrets`, ctx.key, {
			method: 'POST',
			body: {
				name: input.name,
				value: input.value,
				scope: input.scope,
				...(input.playName ? { playName: input.playName } : {}),
				...(input.note !== undefined ? { note: input.note } : {}),
			},
		}),
});
export const updateNote = defineEndpoint({
	event: 'deepline.secrets.updateNote',
	input: UpdateSecretNoteInputSchema,
	output: UpdateSecretNoteOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/secrets/${segment(input.secretId)}`, ctx.key, {
			method: 'PATCH',
			body: { note: input.note },
		}),
});
