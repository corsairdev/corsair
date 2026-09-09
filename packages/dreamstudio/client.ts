export class DreamstudioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'DreamstudioAPIError';
	}
}

export class DreamstudioRateLimitError extends DreamstudioAPIError {
	constructor(
		message = 'DreamStudio API rate limit exceeded',
		public readonly retryAfterMs?: number,
	) {
		super(message, 'RATE_LIMIT_ERROR', 429);
		this.name = 'DreamstudioRateLimitError';
	}
}

export const DREAMSTUDIO_API_BASE = 'https://api.stability.ai/v1';
const REQUEST_TIMEOUT_MS = 60_000;
const NO_DEK_ERROR_PATTERN = /no dek found/i;

export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

function errorMessage(status: number, body: unknown): string {
	if (body && typeof body === 'object' && 'message' in body) {
		const message = (body as { message?: unknown }).message;
		if (typeof message === 'string' && message.length > 0) return message;
	}
	if (typeof body === 'string' && body.length > 0) return body;
	return `DreamStudio request failed (${status})`;
}

function errorCode(body: unknown): string | undefined {
	if (body && typeof body === 'object' && 'name' in body) {
		const name = (body as { name?: unknown }).name;
		if (typeof name === 'string' && name.length > 0) return name;
	}
	return undefined;
}

async function parseBody(res: Response): Promise<unknown> {
	const text = await res.text();
	if (!text) return undefined;
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

export async function initImageBlob(source: string): Promise<Blob> {
	const comma = source.indexOf(',');
	const encoded =
		source.startsWith('data:') && comma !== -1
			? source.slice(comma + 1)
			: source;
	if (/^https?:\/\//i.test(encoded.trim())) {
		throw new DreamstudioAPIError(
			'init_image must be base64 or a data URL, not an http URL',
		);
	}
	const bytes = Buffer.from(encoded, 'base64');
	if (bytes.length === 0) {
		throw new DreamstudioAPIError('init_image is empty');
	}
	const type = encoded.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
	return new Blob([new Uint8Array(bytes)], { type });
}

export async function makeDreamstudioRequest(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		headers?: Record<string, string>;
		body?: FormData | string;
	} = {},
): Promise<unknown> {
	const url = `${DREAMSTUDIO_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
	let res: Response;
	try {
		res = await fetch(url, {
			method: options.method ?? 'GET',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: 'application/json',
				...options.headers,
			},
			body: options.body,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new DreamstudioAPIError('DreamStudio request timed out');
		}
		throw new DreamstudioAPIError(
			error instanceof Error ? error.message : 'DreamStudio request failed',
		);
	}

	if (res.status === 429) {
		await res.body?.cancel();
		throw new DreamstudioRateLimitError(undefined, retryAfterMs(res));
	}

	const parsed = await parseBody(res);
	if (!res.ok) {
		throw new DreamstudioAPIError(
			errorMessage(res.status, parsed),
			errorCode(parsed),
			res.status,
		);
	}
	if (parsed === undefined || typeof parsed !== 'object' || parsed === null) {
		throw new DreamstudioAPIError(
			'DreamStudio returned a non-JSON response',
			undefined,
			res.status,
		);
	}
	return parsed;
}

export async function generateImageFromImage(
	apiKey: string,
	input: {
		engine_id: string;
		init_image: string;
		text_prompts: Array<{ text: string; weight?: number }>;
		init_image_mode?: 'IMAGE_STRENGTH' | 'STEP_SCHEDULE';
		image_strength?: number;
		step_schedule_start?: number;
		step_schedule_end?: number;
		cfg_scale?: number;
		clip_guidance_preset?: string;
		sampler?: string;
		samples?: number;
		steps?: number;
		seed?: number;
		style_preset?: string;
	},
): Promise<unknown> {
	const form = new FormData();
	form.append('init_image', await initImageBlob(input.init_image), 'init.png');

	for (const [index, prompt] of input.text_prompts.entries()) {
		form.append(`text_prompts[${index}][text]`, prompt.text);
		if (prompt.weight !== undefined) {
			form.append(`text_prompts[${index}][weight]`, String(prompt.weight));
		}
	}

	const fields: Record<string, string | number | undefined> = {
		init_image_mode: input.init_image_mode,
		image_strength: input.image_strength,
		step_schedule_start: input.step_schedule_start,
		step_schedule_end: input.step_schedule_end,
		cfg_scale: input.cfg_scale,
		clip_guidance_preset: input.clip_guidance_preset,
		sampler: input.sampler,
		samples: input.samples,
		steps: input.steps,
		seed: input.seed,
		style_preset: input.style_preset,
	};
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined) form.append(key, String(value));
	}

	return makeDreamstudioRequest(
		`/generation/${encodeURIComponent(input.engine_id)}/image-to-image`,
		apiKey,
		{ method: 'POST', body: form },
	);
}
