import type { SimilarwebEndpoints } from '..';
import type { JsonObject, UnknownJson } from '../json';
import { isJsonObject } from '../json';
import { call } from './shared';
import {
	SimilarwebEndpointInputSchemas as Inputs,
	SimilarwebEndpointOutputSchemas as Outputs,
} from './types';

/**
 * This route answers the capability map directly, without the `meta` envelope
 * every data route uses. Wrapping it keeps the output named.
 */
export const get: SimilarwebEndpoints['capabilitiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'capabilities.get',
			input: Inputs.capabilitiesGet,
			output: Outputs.capabilitiesGet,
		},
		input,
		() => ({ method: 'GET', path: '/capabilities' }),
		{
			shape: (raw) => {
				if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
					throw new Error(
						'capabilities.get expected a capability map from Similarweb.',
					);
				}
				return { capabilities: raw };
			},
			log: (_, result) => ({
				capabilities: Object.keys(result.capabilities).length,
			}),
		},
	);

/**
 * The usage route answers `{ allowance, user_remaining }` with no envelope.
 * `used` is derived here, before the schema parses, because a `.transform()`
 * would be invisible to the generated docs.
 */
export const usage: SimilarwebEndpoints['usageGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'usage.get',
			input: Inputs.usageGet,
			output: Outputs.usageGet,
		},
		input,
		() => ({ method: 'GET', path: '/user-capabilities' }),
		{
			shape: (raw) => {
				const record = asObject(raw);
				if (!record) {
					throw new Error('usage.get expected a usage object from Similarweb.');
				}
				const allowance = readNumber(record.allowance);
				const remaining = readNumber(record.user_remaining);
				return {
					allowance,
					user_remaining: remaining,
					used:
						allowance !== undefined && remaining !== undefined
							? allowance - remaining
							: undefined,
				};
			},
			log: (_, result) => ({
				remaining: result.user_remaining ?? undefined,
				allowance: result.allowance ?? undefined,
			}),
		},
	);

function asObject(value: UnknownJson): JsonObject | null {
	return isJsonObject(value) ? value : null;
}

function readNumber(value: UnknownJson): number | undefined {
	return typeof value === 'number' ? value : undefined;
}
