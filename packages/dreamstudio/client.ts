import type { DreamstudioEndpointOutputs } from './endpoints/types';

const DREAMSTUDIO_API_BASE = 'https://api.stability.ai/v1';

export class DreamstudioAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'DreamstudioAPIError';
	}
}

function buildUrl(path: string): string {
	const base = DREAMSTUDIO_API_BASE.replace(/\/$/, '');
	const normalized = path.replace(/^\//, '');
	return `${base}/${normalized}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
	const text = await response.text();

	if (!response.ok) {
		throw new DreamstudioAPIError(
			`DreamStudio API error ${response.status}: ${text}`,
			response.status,
		);
	}

	if (!text) {
		return undefined as T;
	}

	try {
		return JSON.parse(text) as T;
	} catch {
		return text as T;
	}
}

export async function makeDreamstudioRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		headers?: Record<string, string>;
		body?: BodyInit;
	} = {},
): Promise<T> {
	const response = await fetch(buildUrl(path), {
		method: options.method ?? 'GET',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			...options.headers,
		},
		body: options.body,
	});

	return parseResponse<T>(response);
}

export async function getUserBalance(
	apiKey: string,
): Promise<DreamstudioEndpointOutputs['userBalance']> {
	return makeDreamstudioRequest('/user/balance', apiKey);
}

export async function getUserAccount(
	apiKey: string,
): Promise<DreamstudioEndpointOutputs['userAccount']> {
	return makeDreamstudioRequest('/user/account', apiKey);
}

export async function listEngines(
	apiKey: string,
): Promise<DreamstudioEndpointOutputs['listEngines']> {
	return makeDreamstudioRequest('/engines/list', apiKey);
}

export async function generateImageFromImage(
	apiKey: string,
	input: {
		engine_id: string;
		init_image: Blob;
		text_prompts: Array<{
			text: string;
			weight?: number;
		}>;
		init_image_mode?: 'IMAGE_STRENGTH' | 'STEP_SCHEDULE';
		image_strength?: number;
		step_schedule_start?: number;
		step_schedule_end?: number;
		cfg_scale?: number;
		sampler?: string;
		samples?: number;
		steps?: number;
		width?: number;
		height?: number;
		seed?: number;
		style_preset?: string;
		extras?: Record<string, unknown>;
	},
): Promise<DreamstudioEndpointOutputs['generateImageFromImage']> {
	const form = new FormData();

	form.append('init_image', input.init_image);

	for (let index = 0; index < input.text_prompts.length; index += 1) {
		const prompt = input.text_prompts[index];

		form.append(`text_prompts[${index}][text]`, prompt.text);

		if (prompt.weight !== undefined) {
			form.append(
				`text_prompts[${index}][weight]`,
				String(prompt.weight),
			);
		}
	}

	const scalarFields: Record<string, unknown> = {
		init_image_mode: input.init_image_mode,
		image_strength: input.image_strength,
		step_schedule_start: input.step_schedule_start,
		step_schedule_end: input.step_schedule_end,
		cfg_scale: input.cfg_scale,
		sampler: input.sampler,
		samples: input.samples,
		steps: input.steps,
		width: input.width,
		height: input.height,
		seed: input.seed,
		style_preset: input.style_preset,
	};

	for (const [key, value] of Object.entries(scalarFields)) {
		if (value !== undefined) {
			form.append(key, String(value));
		}
	}

	if (input.extras !== undefined) {
		form.append('extras', JSON.stringify(input.extras));
	}

	return makeDreamstudioRequest(
		`/generation/${encodeURIComponent(input.engine_id)}/image-to-image`,
		apiKey,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body: form,
		},
	);
}
