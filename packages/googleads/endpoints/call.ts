import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { GoogleAdsContext } from '..';
import type { GoogleAdsRequest } from '../client';
import { customerPathId, makeGoogleAdsRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * The two headers every call needs beyond the token. The developer token comes
 * from the integration (it identifies the app), and the login customer id is
 * optional and names the manager account a call is made through.
 */
export async function clientConfig(
	ctx: GoogleAdsContext,
): Promise<{ developerToken: string; loginCustomerId?: string }> {
	const credentials = await ctx.keys.get_integration_credentials();
	const developerToken = credentials.developer_token;
	if (!developerToken) {
		throw new Error(
			'The Google Ads developer token is missing. Store it on the integration as `developer_token`',
		);
	}
	// The header takes digits only, like a path id, so a stored
	// `123-456-7890` is normalised the same way.
	const storedLogin = credentials.login_customer_id?.trim();
	return {
		developerToken,
		loginCustomerId: storedLogin ? customerPathId(storedLogin) : undefined,
	};
}

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. The log payload is a count or a flag: a customer id is account data
 * and stays out of event payloads.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: GoogleAdsContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => GoogleAdsRequest,
	options: {
		shape?: (
			raw: unknown, // unknown: validated by the operation's output schema.
			parsed: z.output<Input>,
		) => unknown; // unknown: the output schema validates what shape returns.
		log?: (result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const { developerToken, loginCustomerId } = await clientConfig(ctx);
	const raw = await makeGoogleAdsRequest(
		{ accessToken: ctx.key, developerToken, loginCustomerId },
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`googleads.${operation.event}`,
		options.log?.(result) ?? {},
		'completed',
	);
	return result;
}

/** Log fields for a search: how many rows this response holds. */
export function rowCount(
	rows: { length: number } | null | undefined,
): LogFields {
	return { rows: rows?.length ?? 0 };
}
