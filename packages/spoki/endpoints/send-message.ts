import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';
import type { SendMessageInput, SendMessageResponse } from './types';
import { EndpointInputSchemas, EndpointOutputSchemas } from './types';

export const sendMessage = async (
	ctx: SpokiContext & { key: string },
	input: SendMessageInput,
): Promise<SendMessageResponse> => {
	const parsed = EndpointInputSchemas.sendMessage.parse(input);

	const client = new SpokiClient({ apiKey: ctx.key });

	const body: Record<string, unknown> = {
		type: 'Message',
		content_type: 'Text',
		phone: parsed.phone,
		text: parsed.text,
	};

	if (parsed.channel_id !== undefined) {
		body.channel_id = parsed.channel_id;
	}

	if (parsed.metadata !== undefined) {
		body.metadata = parsed.metadata;
	}

	const result = await client.post<unknown>('/messages/send/', body);

	// Spoki may answer 200 with an empty body (as documented for the
	// automation webhook); treat it as an empty object.
	return EndpointOutputSchemas.sendMessage.parse(result ?? {});
};
