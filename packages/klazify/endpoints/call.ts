import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { KlazifyContext } from '..';
import type { KlazifyRequest } from '../client';
import { KlazifyAPIError, makeKlazifyRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The slice of a Klazify answer that reports a failure. Validated with zod
 * rather than an assertion, so a body of another shape is left for the
 * endpoint's own schema to reject.
 */
const FailureFlagSchema = z.object({
	success: z.literal(false),
	message: z.string().optional(),
	error: z.string().optional(),
});

/**
 * Klazify reports an internal failure inside a 200 with `success: false`, and
 * the docs name two such categories: `/Unreachable` and `/No indexable
 * content`. Parsing the answer with the endpoint's output schema first would
 * throw a missing-field `ZodError` and lose that reason, which is the one thing
 * a caller needs, so a failure is raised before the schema runs.
 */
// unknown: the raw body is unparsed here. The one shape this reads is validated
// by FailureFlagSchema, and a body that does not match is left to the caller's
// schema, which owns the success shape.
function raiseIfFailed(raw: unknown, event: string): void {
	const failure = FailureFlagSchema.safeParse(raw);
	// An endpoint without a success flag (the discovery search) is not a failure.
	if (!failure.success) return;

	const detail = failure.data.message ?? failure.data.error;
	throw new KlazifyAPIError(
		detail
			? `Klazify ${event} failed: ${detail}`
			: `Klazify ${event} reported a failure with no message.`,
		{ status: 200, errorLabel: 'success: false', detail },
	);
}

/**
 * Validates the input, sends the request, validates the answer, then logs the
 * event. The target (a URL or an email) is not logged at full length: an email
 * is a person's address, so `log` picks what is safe to keep.
 */
export async function callKlazify<
	Input extends z.ZodType,
	Output extends z.ZodType,
>(
	ctx: KlazifyContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => KlazifyRequest,
	options: {
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeKlazifyRequest(ctx.key, toRequest(parsed));
	raiseIfFailed(raw, operation.event);
	const result = operation.output.parse(raw);

	await logEventFromContext(
		ctx,
		`klazify.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * The body Klazify expects. `refresh` is only sent when the caller set it, so an
 * omitted value stays the service's default rather than becoming `false`.
 */
export function targetBody(target: {
	url?: string;
	email?: string;
	refresh?: boolean;
}): Record<string, string | boolean> {
	const body: Record<string, string | boolean> = {};
	if (target.url !== undefined) body.url = target.url;
	if (target.email !== undefined) body.email = target.email;
	if (target.refresh !== undefined) body.refresh = target.refresh;
	return body;
}
