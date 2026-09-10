import { SpokiApiError } from '../client';
import type { SpokiContext } from '../index';
import type {
	TriggerAutomationInput,
	TriggerAutomationResponse,
} from './types';
import { EndpointInputSchemas, EndpointOutputSchemas } from './types';

export const triggerAutomation = async (
	ctx: SpokiContext & { key: string },
	input: TriggerAutomationInput,
): Promise<TriggerAutomationResponse> => {
	const parsed = EndpointInputSchemas.triggerAutomation.parse(input);

	const { uuid, ...payload } = parsed;

	const url = `https://api.spoki.com/wh/ap/${encodeURIComponent(uuid)}/`;

	// The automation trigger authenticates via the per-automation `secret` in
	// the payload, not the account API key. Use plain fetch so no
	// X-Spoki-Api-Key header leaves the client on this public URL.
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	const text = await response.text();

	let body: unknown;
	if (text) {
		try {
			body = JSON.parse(text);
		} catch {
			body = text;
		}
	}

	if (!response.ok) {
		throw new SpokiApiError(
			response.status,
			`Spoki API request failed with status ${response.status}`,
			body,
		);
	}

	// The documented Start Automation response is a 200 with an empty body;
	// treat it as an empty object.
	return EndpointOutputSchemas.triggerAutomation.parse(body ?? {});
};
