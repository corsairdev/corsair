import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { CommCareContext } from '..';
import type { CommCareAuth, CommCareRequest } from '../client';
import { makeCommCareRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

export async function safeLog(
	ctx: CommCareContext,
	event: string,
	fields: () => LogFields,
): Promise<void> {
	try {
		await logEventFromContext(ctx, event, fields(), 'completed');
	} catch (error) {
		console.warn(`Failed to log ${event}:`, error);
	}
}

/**
 * Resolves the connection details, validates the input, sends the request,
 * shapes and validates the response, then logs the event. Inputs are not
 * logged, because forms and cases carry field data; `log` picks the safe
 * fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: CommCareContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (domain: string, parsed: z.output<Input>) => CommCareRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	// Every input schema carries `domain` (one CommCare connection serves
	// multiple projects), so the request is scoped to the caller's project.
	// Both the project domain and the auth username are per-call inputs:
	// ApiKey auth is user-scoped, so each tenant carries its own pair.
	const scoped = parsed as { domain: string; username: string };
	const domain = scoped.domain;
	const auth: CommCareAuth = {
		domain,
		username: scoped.username,
		apiKey: ctx.key,
	};
	const raw = await makeCommCareRequest(auth, toRequest(domain, parsed));
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await safeLog(
		ctx,
		`commcare.${operation.event}`,
		() => options.log?.(parsed, result) ?? {},
	);
	return result;
}
