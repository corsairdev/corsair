import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';
import type {
	TriggerAutomationInput,
	TriggerAutomationResponse,
} from './types';
import { EndpointInputSchemas } from './types';

export const triggerAutomation = async (
	ctx: SpokiContext & { key: string },
	input: TriggerAutomationInput,
): Promise<TriggerAutomationResponse> => {
	const parsed = EndpointInputSchemas.triggerAutomation.parse(input);

	const { uuid, ...payload } = parsed;

	const client = new SpokiClient({ apiKey: ctx.key });

	const url = `https://api.spoki.com/wh/ap/${encodeURIComponent(uuid)}/`;

	return client.post<TriggerAutomationResponse>(url, payload);
};
