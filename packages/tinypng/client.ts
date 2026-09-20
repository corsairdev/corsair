import { z } from 'zod';

export class TinypngAPIError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
	) {
		super(message);
		this.name = 'TinypngAPIError';
	}
}

const TINYPNG_API_BASE = 'https://api.tinify.com';

const TinypngOutputSchema = z.object({
	size: z.number(),
	type: z.string(),
	width: z.number(),
	height: z.number(),
	url: z.string().url(),
});

const TinypngResultSchema = z.object({
	output: TinypngOutputSchema,
});

export type TinypngOutput = z.infer<typeof TinypngOutputSchema>;

export async function compressImageFromUrl(
	imageUrl: string,
	apiKey: string,
): Promise<TinypngOutput> {
	const credentials = Buffer.from(`api:${apiKey}`).toString('base64');

	const response = await fetch(`${TINYPNG_API_BASE}/shrink`, {
		method: 'POST',

		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/json',
		},

		body: JSON.stringify({
			source: {
				url: imageUrl,
			},
		}),
	});

	const text = await response.text();
	let data: unknown;

	try {
		data = JSON.parse(text);
	} catch {
		throw new TinypngAPIError(
			'TinyPNG API returned invalid JSON',
			response.status,
		);
	}

	if (!response.ok) {
		const errorData = data as {
			message?: string;
		};

		throw new TinypngAPIError(
			errorData.message ?? 'TinyPNG API request failed',
			response.status,
		);
	}

	const parsed = TinypngResultSchema.safeParse(data);
	if (!parsed.success) {
		throw new TinypngAPIError(
			'TinyPNG API returned an unexpected response format',
			response.status,
		);
	}

	return parsed.data.output;
}
