import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { OnedeskContext } from '..';
import type { OnedeskClientOptions, OnedeskRequest } from '../client';
import { makeOnedeskRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Inputs are not logged: a create body holds customer
 * records and an upload holds the raw file.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: OnedeskContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => OnedeskRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const clientOptions: OnedeskClientOptions = { host: ctx.options.host };

	// Logging is outside the request's error path so a logging failure cannot
	// mask a write that OneDesk has already committed.
	const logSafely = async (
		payload: LogFields,
		status: 'completed' | 'failed',
	): Promise<void> => {
		await logEventFromContext(
			ctx,
			`onedesk.${operation.event}`,
			payload,
			status,
		).catch(() => undefined);
	};

	let result: z.output<Output>;
	try {
		const raw = await makeOnedeskRequest(
			ctx.key,
			toRequest(parsed),
			clientOptions,
		);
		result = operation.output.parse(
			options.shape ? options.shape(raw, parsed) : raw,
		);
	} catch (error) {
		await logSafely(
			{ error: error instanceof Error ? error.message : String(error) },
			'failed',
		);
		throw error;
	}

	await logSafely(options.log?.(parsed, result) ?? {}, 'completed');
	return result;
}
