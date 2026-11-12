import type { RiteKitEndpoints } from '..';
import { call } from './call';
import {
	RiteKitEndpointInputSchemas as Inputs,
	RiteKitEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The freemail route's parameter is named `domain`, but the sample and the demo
 * both pass a full address under it, so the input describes it as either.
 */
export const freemail: RiteKitEndpoints['personFreemail'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'person.freemail',
			input: Inputs.personFreemail,
			output: Outputs.personFreemail,
		},
		input,
		({ domain }) => ({
			method: 'GET',
			path: '/v2/person-insights/freemail-detection',
			query: { domain },
			replayable: true,
		}),
		{
			log: (_, result) => ({ freemail: result.freemail ?? undefined }),
		},
	);

export const disposable: RiteKitEndpoints['personDisposable'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'person.disposable',
			input: Inputs.personDisposable,
			output: Outputs.personDisposable,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: '/v2/person-insights/disposable-email-detection',
			query: { email },
			replayable: true,
		}),
		{
			log: (_, result) => ({ disposable: result.disposable ?? undefined }),
		},
	);

export const emailTypo: RiteKitEndpoints['personEmailTypo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'person.emailTypo',
			input: Inputs.personEmailTypo,
			output: Outputs.personEmailTypo,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: '/v2/person-insights/email-typo',
			query: { email },
			replayable: true,
		}),
		{
			log: (_, result) => ({ suggestions: result.suggestions?.length ?? 0 }),
		},
	);

export const nameFromEmail: RiteKitEndpoints['personNameFromEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'person.nameFromEmail',
			input: Inputs.personNameFromEmail,
			output: Outputs.personNameFromEmail,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: '/v2/person-insights/name-from-email-address',
			query: { email },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				named:
					typeof result.info === 'string'
						? result.info.length > 0
						: typeof result.info?.givenName === 'string',
			}),
		},
	);
