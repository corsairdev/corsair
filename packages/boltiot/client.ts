export class BoltIotAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'BoltIotAPIError';
	}
}

export class BoltIotRateLimitError extends BoltIotAPIError {
	constructor(message = 'Bolt IoT API rate limit exceeded') {
		super(message, 'RATE_LIMIT_ERROR', 429);
		this.name = 'BoltIotRateLimitError';
	}
}

const BOLT_IOT_API_BASE = 'https://cloud.boltiot.com/remote';

export interface BoltIotApiResponse {
	success: string | number;
	value: string;
	time?: string;
}

export async function makeBoltIotRequest<
	T extends BoltIotApiResponse = BoltIotApiResponse,
>(
	command: string,
	apiKey: string,
	query: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value));
	}
	const qs = params.toString();
	const url = `${BOLT_IOT_API_BASE}/${apiKey}/${command}${qs ? `?${qs}` : ''}`;

	const res = await fetch(url);
	if (res.status === 429) {
		throw new BoltIotRateLimitError();
	}

	let body: T;
	try {
		body = (await res.json()) as T;
	} catch {
		throw new BoltIotAPIError(
			`Bolt IoT command ${command} failed`,
			undefined,
			res.status,
		);
	}

	if (String(body.success) === '0') {
		throw new BoltIotAPIError(
			String(body.value || `Bolt IoT command ${command} failed`),
			undefined,
			res.status,
		);
	}
	if (!res.ok) {
		throw new BoltIotAPIError(
			String(body.value || `Bolt IoT command ${command} failed`),
			undefined,
			res.status,
		);
	}
	return body;
}
