import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PointagramContext } from '..';
import type { PointagramCredentials, PointagramRequest } from '../client';
import {
	errorFromEnvelope,
	makePointagramRequest,
	maskValues,
	PointagramAPIError,
	readEnvelopeMessage,
	readEnvelopeStatus,
	reportsInvalidCredentials,
	requestValues,
	resolvePointagramApiUser,
} from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

function readData(
	envelope: unknown, // unknown: the provider's response before validation.
): unknown {
	// unknown: `data` is untyped until the output schema parses it.
	return envelope !== null && typeof envelope === 'object'
		? (envelope as Record<string, unknown>).data // unknown: untyped envelope.
		: undefined;
}

/** True when Pointagram answered a success envelope, so `data` can be trusted. */
function isSuccessEnvelope(
	envelope: unknown, // unknown: the provider's response before validation.
): boolean {
	const status = readEnvelopeStatus(envelope);
	return status !== undefined && /^ok$/i.test(status);
}

/**
 * Validates the input, sends it, rejects a failure envelope, shapes the
 * envelope's `data` and validates the result, then logs the event.
 *
 * Credentials are resolved before the request so a missing `Api-User` fails
 * without a round trip. Inputs are not logged: they hold player names, email
 * addresses and comments, and `log` picks the safe fields.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: PointagramContext,
	operation: { event: string; input: Input; output: Output },
	rawInput: unknown, // unknown: parsed by the operation's input schema below.
	toRequest: (parsed: z.output<Input>) => PointagramRequest,
	options: {
		// `shape` receives `data` already unwrapped from the envelope. Both it and
		// the envelope stay untyped because the output schema validates the result.
		shape?: (
			data: unknown, // unknown: unwrapped by readData, validated after shape().
			envelope: unknown, // unknown: raw provider response, read via messageOf().
			parsed: z.output<Input>,
		) => unknown; // unknown: its return value is what the output schema parses.
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const apiUser = await resolvePointagramApiUser(ctx);
	const request = toRequest(parsed);

	const credentials: PointagramCredentials = {
		apiKey: ctx.key,
		apiUser,
	};
	const envelope = await makePointagramRequest(credentials, request);

	// Pointagram's error text can repeat what was sent (a player's name or email),
	// so the caller's values are masked before the message becomes an error.
	const values = requestValues(request);
	const mask = (text: string) => maskValues(text, values) as string;
	const envelopeError = errorFromEnvelope(envelope, request.method, mask);
	if (envelopeError) throw envelopeError;

	if (!isSuccessEnvelope(envelope)) {
		// A 2xx body with neither `status: "Ok"` nor `status: "Error"` is not a
		// success, and it must not reach the output schema as if it were.
		throw new PointagramAPIError(
			`Pointagram returned an unrecognised envelope: ${mask(readEnvelopeMessage(envelope) ?? 'no message')}`,
			{ method: request.method },
		);
	}

	// A key Pointagram accepted at the transport level but rejected in the body.
	// The docs describe a bad key as a 404 `Error` envelope, so an `Ok` envelope
	// carrying the credential message is not a success either: reading it as one
	// would hand back an empty organization for a key that does not work.
	if (reportsInvalidCredentials(envelope)) {
		// A fixed message: the provider's text is not guaranteed to be free of
		// the login it rejected.
		throw new PointagramAPIError(
			'Pointagram rejected the Api-Key and Api-User pair',
			{ method: request.method, credentialsRejected: true },
		);
	}

	const data = readData(envelope);
	const result = operation.output.parse(
		options.shape ? options.shape(data, envelope, parsed) : data,
	);

	await logEventFromContext(
		ctx,
		`pointagram.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/**
 * Reads the envelope message for the operations whose only confirmation is that
 * text: Pointagram answers `data: {}` with `"Player removed"` or similar.
 */
export function messageOf(
	envelope: unknown, // unknown: the provider's response before validation.
): string {
	const message = readEnvelopeMessage(envelope);
	if (!message) {
		throw new Error('Pointagram did not send a confirmation message');
	}
	return message;
}
