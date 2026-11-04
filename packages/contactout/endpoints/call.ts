import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { ContactOutContext } from '..';
import type { ContactOutQuery } from '../client';
import { makeContactOutRequest } from '../client';
import type {
	ContactOutEndpointInputs,
	ContactOutEndpointOutputs,
	EmailType,
} from './types';
import {
	ContactOutEndpointInputSchemas,
	ContactOutEndpointOutputSchemas,
} from './types';

type Operation = keyof ContactOutEndpointInputs;

/**
 * ContactOut issues one key per email kind, and each key returns only its own
 * kind. The work-email key is the plugin's API key; the personal-email key is
 * the `personalKey` option or the account's stored `personal_api_key`.
 */
async function resolveKey(
	ctx: ContactOutContext,
	emailType: EmailType,
): Promise<string> {
	if (emailType === 'work') {
		if (!ctx.key) throw new AuthMissingError('contactout', 'api_key');
		return ctx.key;
	}
	// ctx.keys is absent when no key store is configured.
	const personal =
		ctx.options.personalKey ?? (await ctx.keys?.get_personal_api_key());
	if (!personal) {
		throw new AuthMissingError('contactout', 'personal_api_key');
	}
	return personal;
}

export async function call<K extends Operation>(
	ctx: ContactOutContext,
	operation: K,
	event: string,
	method: 'GET' | 'POST',
	path: string,
	// unknown: raw caller input, parsed below by the operation's input schema.
	input: unknown,
): Promise<ContactOutEndpointOutputs[K]> {
	const parsed = ContactOutEndpointInputSchemas[operation].parse(input ?? {});
	const { emailType = 'work', ...params } = parsed as typeof parsed & {
		emailType?: EmailType;
	};
	const key = await resolveKey(ctx, emailType);

	const raw = await makeContactOutRequest(path, key, {
		method,
		...(method === 'GET'
			? { query: params as ContactOutQuery }
			: { body: params }),
	});
	const result = ContactOutEndpointOutputSchemas[operation].parse(
		raw,
	) as ContactOutEndpointOutputs[K];

	await logEventFromContext(
		ctx,
		`contactout.${event}`,
		{ emailType },
		'completed',
	);
	return result;
}
