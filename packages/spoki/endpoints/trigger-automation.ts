import { SpokiClient } from '../client';
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

	const client = new SpokiClient({ apiKey: ctx.key });

	const url = `https://api.spoki.com/wh/ap/${encodeURIComponent(uuid)}/`;

	const result = await client.post<unknown>(url, payload);

	// The documented Start Automation response is a 200 with an empty body;
	// treat it as an empty object.
	return EndpointOutputSchemas.triggerAutomation.parse(result ?? {});
};
