import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';
import type { SendMessageInput, SendMessageResponse } from './types';
import { EndpointInputSchemas } from './types';

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

	return client.post<SendMessageResponse>('/messages/send/', body);
};
