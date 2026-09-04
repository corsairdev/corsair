import type { SpokiClient } from '../client';
import type { SendMessageInput, SendMessageResponse } from './types';

export async function sendMessage(
	client: SpokiClient,
	input: SendMessageInput,
): Promise<SendMessageResponse> {
	return client.post<SendMessageResponse>('/messages', input);
}
