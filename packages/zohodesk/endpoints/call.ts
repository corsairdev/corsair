import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ZohoDeskRequest } from '../client';
import {
	downloadZohoDeskFile,
	makeZohoDeskRequest,
	withZohoDeskAuth,
} from '../client';
import type { ZohoDeskContext } from '../index';

/** Zoho takes multi-value query params as one comma-separated value. */
export function csv(values: readonly string[] | undefined) {
	return values?.join(',');
}

// unknown: every input schema is an object; its fields differ per operation.
type InputSchema = z.ZodType<Record<string, unknown>>;

type ZohoDeskCall<I extends InputSchema, O extends z.ZodType> = {
	event: string;
	input: I;
	output: O;
	toRequest: (input: z.output<I>) => ZohoDeskRequest;
	/** What a 204 means here. Without it an empty answer fails validation. */
	empty?: z.input<O>;
	/** Input fields worth logging, when the full input should not be stored. */
	// unknown: logged fields differ per operation and are only serialized.
	logFields?: (input: z.output<I>) => Record<string, unknown>;
	/** Runs on the validated result, before it is returned. */
	sync?: (result: z.output<O>, input: z.output<I>) => Promise<void>;
};

/** Validates the input, sends the request, validates the answer and logs it. */
export async function zohoDeskCall<I extends InputSchema, O extends z.ZodType>(
	ctx: ZohoDeskContext,
	// unknown: raw caller input, parsed below by the operation's input schema.
	raw: unknown,
	spec: ZohoDeskCall<I, O>,
): Promise<z.output<O>> {
	const input = spec.input.parse(raw ?? {});
	const req = spec.toRequest(input);
	const body = await withZohoDeskAuth(ctx, req, (token, orgId) =>
		makeZohoDeskRequest(token, ctx.options.region, req, orgId),
	);
	const result = spec.output.parse(body ?? spec.empty);
	await spec.sync?.(result, input);
	await logEventFromContext(
		ctx,
		spec.event,
		spec.logFields?.(input) ?? input,
		'completed',
	);
	return result;
}

/** The same steps for a binary answer, which needs its own transport. */
export async function zohoDeskDownload<
	I extends InputSchema,
	O extends z.ZodType,
>(
	ctx: ZohoDeskContext,
	// unknown: see zohoDeskCall.
	raw: unknown,
	spec: Pick<ZohoDeskCall<I, O>, 'event' | 'input' | 'output' | 'toRequest'>,
): Promise<z.output<O>> {
	const input = spec.input.parse(raw ?? {});
	const req = spec.toRequest(input);
	const file = await withZohoDeskAuth(ctx, req, (token, orgId) =>
		downloadZohoDeskFile(token, ctx.options.region, req, orgId),
	);
	const result = spec.output.parse(file);
	await logEventFromContext(ctx, spec.event, input, 'completed');
	return result;
}

/**
 * Runs a local save without letting it fail the call: Zoho has already
 * answered, and the caller wants that answer even if the save did not work.
 */
export async function syncBestEffort(
	entity: string,
	// unknown: each entity's save returns its own row, and this discards it.
	save: () => Promise<unknown>,
): Promise<void> {
	try {
		await save();
	} catch (error) {
		console.warn(`[zohodesk] Could not save ${entity}:`, error);
	}
}
