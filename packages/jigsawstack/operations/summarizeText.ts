import { z } from 'zod';

export const summarizeText = {
	name: 'summarizeText',
	description: 'Summarize text using JigsawStack AI',
	inputSchema: z.object({ text: z.string().min(1) }),
	outputSchema: z.object({ summary: z.string() }),
	async execute({ text }, { apiKey, fetch }) {
		const res = await fetch('https://api.jigsawstack.com/v1/ai/summary', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
			body: JSON.stringify({ text }),
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(
				`JigsawStack API error: ${err.message || res.statusText}`,
			);
		}
		const data = await res.json();
		return { summary: data.summary };
	},
};
