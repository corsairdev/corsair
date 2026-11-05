import { logEventFromContext } from 'corsair/core';
import { makeLeexiRequest, resolveLeexiCredentials } from '../client';
import type { LeexiEndpoints } from '../index';
import type { CallsListInput } from './types';
import { LeexiEndpointInputSchemas, LeexiEndpointOutputSchemas } from './types';

type CallsListLogPayload = Record<
	string,
	string | number | boolean | string[] | undefined
>;

/**
 * Customer emails / phone numbers are PII used as search filters. The audit
 * log records that a PII filter was used (and how many values) but never the
 * values themselves — same policy as the meeting-URL redaction in
 * meeting-events.ts. UUID filters (owner, participants) are not PII and are
 * logged as-is for traceability.
 */
export function redactedCallsListLog(
	parsed: CallsListInput,
): CallsListLogPayload {
	const { customer_email_address, customer_phone_number, ...rest } = parsed;
	return {
		...rest,
		...(customer_email_address !== undefined
			? {
					customer_email_address_count: Array.isArray(customer_email_address)
						? customer_email_address.length
						: 1,
				}
			: {}),
		...(customer_phone_number !== undefined
			? {
					customer_phone_number_count: Array.isArray(customer_phone_number)
						? customer_phone_number.length
						: 1,
				}
			: {}),
	};
}

export const list: LeexiEndpoints['callsList'] = async (ctx, input) => {
	const parsed = LeexiEndpointInputSchemas.callsList.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	// `unknown`: unvalidated wire JSON — the output schema below is the
	// only thing allowed to shape it into a typed response.
	const raw = await makeLeexiRequest<unknown>('calls', credentials, {
		method: 'GET',
		query: parsed,
	});
	const response = LeexiEndpointOutputSchemas.callsList.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.calls.list',
		{ ...redactedCallsListLog(parsed) },
		'completed',
	);
	return response;
};

export const get: LeexiEndpoints['callsGet'] = async (ctx, input) => {
	const parsed = LeexiEndpointInputSchemas.callsGet.parse(input);
	const credentials = await resolveLeexiCredentials(ctx);

	// `unknown`: unvalidated wire JSON — the output schema below is the
	// only thing allowed to shape it into a typed response.
	const raw = await makeLeexiRequest<unknown>(
		`calls/${parsed.uuid}`,
		credentials,
		{ method: 'GET' },
	);
	const response = LeexiEndpointOutputSchemas.callsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'leexi.calls.get',
		{ uuid: parsed.uuid },
		'completed',
	);
	return response;
};

export const requestPresignedUrl: LeexiEndpoints['callsRequestPresignedUrl'] =
	async (ctx, input) => {
		const parsed =
			LeexiEndpointInputSchemas.callsRequestPresignedUrl.parse(input);
		const credentials = await resolveLeexiCredentials(ctx);

		// `unknown`: unvalidated wire JSON — the output schema below is the
		// only thing allowed to shape it into a typed response.
		const raw = await makeLeexiRequest<unknown>(
			'calls/presign_recording_url',
			credentials,
			{
				method: 'POST',
				body: { extension: parsed.extension ?? '.mp4' },
			},
		);
		const response =
			LeexiEndpointOutputSchemas.callsRequestPresignedUrl.parse(raw);

		await logEventFromContext(
			ctx,
			'leexi.calls.requestPresignedUrl',
			{ extension: parsed.extension ?? '.mp4' },
			'completed',
		);
		return response;
	};
