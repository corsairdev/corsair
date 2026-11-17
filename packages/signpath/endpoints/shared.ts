import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SignpathContext } from '..';
import type { SignpathRequest } from '../client';
import { makeSignpathRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Every route carries the organization id in its path, and the id is fixed per
 * account: a SignPath API token belongs to one user in one organization. Read
 * it from the account key manager once, then reuse it for the whole call.
 */
export async function resolveOrganizationId(
	ctx: SignpathContext,
): Promise<string> {
	const fromOptions = ctx.options.organizationId;
	if (fromOptions) return fromOptions;

	const stored = await ctx.keys?.get_organization_id?.();
	if (stored) return stored;

	throw new AuthMissingError(
		'signpath',
		'api_key',
		'[auth-missing:signpath:organization_id] Set organizationId on the plugin or store organization_id on the account.',
	);
}

/** Prefixes an operation path with the organization id every route needs. */
export function orgPath(organizationId: string, path: string): string {
	return `/v1/${encodeURIComponent(organizationId)}${path}`;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged verbatim: they carry artifact
 * bytes and participant ids, so `log` picks the fields worth keeping.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SignpathContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: unknown, // unknown: raw caller input, parsed by the input schema
	toRequest: (
		parsed: z.output<Input>,
		organizationId: string,
	) => SignpathRequest,
	options: {
		shape?: (
			raw: unknown, // unknown: the response body, undefined when absent
			parsed: z.output<Input>,
			organizationId: string,
		) => unknown; // unknown: the output schema validates what this returns
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const organizationId = await resolveOrganizationId(ctx);
	const raw = await makeSignpathRequest(
		ctx.key,
		toRequest(parsed, organizationId),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed, organizationId) : raw,
	);

	await logEventFromContext(
		ctx,
		`signpath.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Most mutating routes answer 204 with no body, so their result is built from
 * the input. A body here means a proxy answered an HTML error page with a 2xx,
 * or SignPath changed the route; either way reporting success would be wrong.
 */
export function assertBodyless(
	raw: unknown, // unknown: the body of a route the spec calls bodyless
	operation: string,
): void {
	if (raw === undefined || raw === null) return;
	if (typeof raw === 'object' && Object.keys(raw).length === 0) return;
	throw new Error(
		`${operation} answered with a body, but SignPath documents this route as bodyless. Nothing was confirmed; re-read the resource before assuming the change applied.`,
	);
}
