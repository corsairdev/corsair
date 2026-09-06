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

type TinypngResult = {
	output: {
		size: number;
		type: string;
		width: number;
		height: number;
		url: string;
	};
};

export async function compressImageFromUrl(
	imageUrl: string,
	apiKey: string,
): Promise<TinypngResult['output']> {
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

	const data: unknown = await response.json();

	if (!response.ok) {
		const errorData = data as {
			message?: string;
		};

		throw new TinypngAPIError(
			errorData.message ?? 'TinyPNG API request failed',
			response.status,
		);
	}

	const successData = data as TinypngResult;

	return successData.output;
}
