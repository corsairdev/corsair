import { logEventFromContext } from 'corsair/core';
import type { KofiEndpoints } from '..';
import { KOFI_WEBHOOK_EVENTS } from '../webhooks/types';
import {
	KofiEndpointInputSchemas as Inputs,
	KofiEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The documented payment types, from Ko-fi's webhook reference. This makes no
 * HTTP call: Ko-fi has no REST API, so the only thing an operation can
 * truthfully return is what a delivery can carry.
 */
export const listEvents: KofiEndpoints['webhooksListEvents'] = async (
	ctx,
	input,
) => {
	Inputs.webhooksListEvents.parse(input ?? {});
	const result = Outputs.webhooksListEvents.parse({
		events: KOFI_WEBHOOK_EVENTS,
	});

	await logEventFromContext(
		ctx,
		'kofi.webhooks.listEvents',
		{ count: result.events.length },
		'completed',
	);
	return result;
};
