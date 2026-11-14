import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PrismicContext } from '..';
import type { PrismicCredentials, PrismicRequest } from '../client';
import { makePrismicRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

/**
 * Reads the repository id, preferring the call's own override. The Content API
 * host is built from it, so a missing one fails before any request.
 */
export function repositoryOf(
	ctx: PrismicContext,
	override: string | undefined,
): string {
	const repository = override?.trim() || ctx.options?.repository?.trim() || '';
	if (!repository) {
		// The id is part of the URL, so there is no request to make without it.
		throw new Error(
			'Set `repository` in the plugin options, or pass it on the call.',
		);
	}
	return repository;
}

/**
 * Validates the input, sends it, shapes and validates the response, then logs
 * the event.
 *
 * Reads on a private repository carry the access token, and migration writes
 * carry the write token, both added by the client from the credentials here.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PrismicContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: Untyped,
	toRequest: (
		parsed: z.output<Input>,
		credentials: PrismicCredentials,
	) => PrismicRequest,
	options: {
		/** Rewrites the answer before the output schema parses it. */
		shape?: (raw: Untyped, parsed: z.output<Input>) => Untyped;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// Only the repository-info call takes an id, so the override is read from the
	// parsed input when that field exists.
	const override =
		parsed !== null &&
		typeof parsed === 'object' &&
		'repository' in parsed &&
		typeof (parsed as { repository?: string }).repository === 'string'
			? (parsed as { repository: string }).repository
			: undefined;
	const repository = repositoryOf(ctx, override);

	const credentials: PrismicCredentials = {
		repository,
		writeToken: ctx.options?.writeToken?.trim(),
		accessToken: ctx.options?.accessToken?.trim(),
	};
	const request = toRequest(parsed, credentials);
	const raw = await makePrismicRequest(credentials, request);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`prismic.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}
