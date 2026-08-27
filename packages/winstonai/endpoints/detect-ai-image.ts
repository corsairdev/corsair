import { makeWinstonAiRequest } from '../client';

export async function detectAiImage(apiKey: string, imageUrl: string) {
	return makeWinstonAiRequest<{
		score: number;
		is_ai_generated: boolean;
	}>('/image-predict', apiKey, {
		method: 'POST',
		body: { image_url: imageUrl },
	});
}
