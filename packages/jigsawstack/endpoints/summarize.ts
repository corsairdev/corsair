import type { CorsairEndpoint } from 'corsair/core';
import type { JigsawstackContext } from '../index';
import type { SummarizeTextInput, SummarizeTextOutput } from './types';

// Export as a function, not an object with 'handler'
export const summarize: CorsairEndpoint<
	JigsawstackContext,
	SummarizeTextInput,
	SummarizeTextOutput
> = async (ctx, input) => {
	const { text } = input;

	// Use ctx.key (the resolved key from keyBuilder), NOT ctx.options.key
	const apiKey = ctx.key;
	if (!apiKey) {
		throw new Error(
			'Missing JigsawStack API key. Please configure your integration.',
		);
	}

	const response = await fetch('https://api.jigsawstack.com/v1/ai/summary', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
		body: JSON.stringify({ text }),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			`JigsawStack API error (${response.status}): ${errorData.message || response.statusText}`,
		);
	}

	const data = await response.json();
	if (!data.summary) {
		throw new Error('Unexpected response: missing "summary" field');
	}

	return { summary: data.summary };
};
