import { makeWinstonAiRequest } from '../client';

export async function detectPlagiarism(apiKey: string, text: string) {
	return makeWinstonAiRequest<{
		score: number;
		sources: Array<{ url: string; similarity: number }>;
	}>('/plagiarism', apiKey, {
		method: 'POST',
		body: { text, language: 'en' },
	});
}
