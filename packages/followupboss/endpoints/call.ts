import { asRecord, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { FollowUpBossContext } from '..';
import type { FollowUpBossRequest } from '../client';
import { makeFollowUpBossRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged, because people hold names, email
 * addresses and phone numbers; `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: FollowUpBossContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => FollowUpBossRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeFollowUpBossRequest(ctx.key, toRequest(parsed), {
		systemName: ctx.options.systemName,
		systemKey: ctx.options.systemKey,
	});
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`followupboss.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

// FUB wraps resources in envelope objects keyed by the resource name: lists as
// `{ _metadata, people: [...] }` and single fetches as `{ people: [one] }`. A
// bare resource body is accepted as well, because the published examples are
// not consistent about the wrapper on create/update responses.
// unknown: raw is the response body until asRecord narrows it.
export function envelopeOne(
	raw: unknown,
	key: string,
): Record<string, unknown> | undefined {
	const record = raw === undefined ? null : asRecord(raw);
	const collection = record?.[key];
	if (Array.isArray(collection)) {
		return collection.length > 0
			? (asRecord(collection[0]) ?? undefined)
			: undefined;
	}
	return record ?? undefined;
}

// unknown: same open envelope as envelopeOne.
// The return is unknown, not unknown[], on purpose: a present non-array
// collection (a malformed reply) must reach the output schema's z.array and
// be rejected there, instead of being coerced into an empty-looking list.
// unknown: raw is the response body until asRecord narrows it.
export function envelopeMany(raw: unknown, key: string): unknown {
	if (raw === undefined) return [];
	const record = asRecord(raw);
	// A non-object body (a string, null) is malformed: hand it to output
	// validation so it fails instead of reading as an empty list.
	if (!record) return raw;
	const collection = record[key];
	return collection === undefined ? [] : collection;
}

// unknown: same open envelope as envelopeOne.
export function envelopeMeta(raw: unknown): unknown {
	const record = raw === undefined ? null : asRecord(raw);
	return record?._metadata;
}
