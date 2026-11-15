import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TaggunContext } from '..';
import type { TaggunRequestOptions } from '../client';
import { makeTaggunRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Drops `undefined` values so a field is neither sent as an empty multipart
 * part nor serialised into a JSON body as null, which Taggun reads as a value.
 */
// unknown: a request body holds strings, numbers, booleans, arrays, Blobs and
// nested objects depending on the endpoint, so no narrower type fits.
export function compact(
	fields: Record<string, unknown /* unknown: see above */>,
): Record<string, unknown /* unknown: see above */> {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
}

/** A hint that every scan request accepts, whatever the document is sent as. */
export type ScanHints = {
	language?: string | undefined;
	near?: string | undefined;
	ipAddress?: string | undefined;
	ignoreMerchantName?: string | undefined;
	refresh?: boolean | undefined;
	incognito?: boolean | undefined;
	userId?: string | undefined;
	containerId?: string | undefined;
	subAccountId?: string | undefined;
	referenceId?: string | undefined;
	extractTime?: boolean | undefined;
};

/** The scan hints under Taggun's own names, with the unset ones dropped. */
export function scanFields(
	parsed: ScanHints,
): Record<string, unknown /* unknown: sent as form fields or JSON values */> {
	return compact({
		language: parsed.language,
		near: parsed.near,
		ipAddress: parsed.ipAddress,
		ignoreMerchantName: parsed.ignoreMerchantName,
		refresh: parsed.refresh,
		incognito: parsed.incognito,
		userId: parsed.userId,
		containerId: parsed.containerId,
		subAccountId: parsed.subAccountId,
		referenceId: parsed.referenceId,
		extractTime: parsed.extractTime,
	});
}

/**
 * Parses the input, sends the request, shapes the answer and validates it with
 * the operation's output schema, then logs. The document itself is never
 * logged: `log` picks the fields that describe the call instead.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: TaggunContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: unknown /* unknown: parsed below by the input schema */,
	toRequest: (parsed: z.output<Input>) => TaggunRequestOptions,
	options: {
		// unknown: raw is the response body, which the output schema has not seen
		// yet, and shape returns whatever that schema is meant to validate.
		shape?: (
			raw: unknown /* unknown: see above */,
			parsed: z.output<Input>,
		) => unknown /* unknown: see above */;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeTaggunRequest(ctx.key, toRequest(parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`taggun.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
