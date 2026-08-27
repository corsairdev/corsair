import { makeWinstonAiRequest } from '../client';

export async function detectAiText(apiKey: string, text: string) {
	return makeWinstonAiRequest<{
		score: number;
		is_human: boolean;
		sentences: Array<{ text: string; score: number }>;
	}>('/predict', apiKey, {
		method: 'POST',
		body: { text, language: 'en', sentences: true },
	});
}
