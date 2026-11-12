import { AuthMissingError } from 'corsair/core';

export class ServiceM8Error extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly providerCode?: number,
	) {
		super(message);
		this.name = 'ServiceM8Error';
	}
}

export type ServiceM8Response = {
	body: unknown;
	nextCursor?: string;
	recordUuid?: string;
};

/** HTTP data is unknown until validated by the operation's output schema. */
export async function serviceM8Request(
	key: string,
	authType: 'api_key' | 'oauth_2',
	method: 'GET' | 'POST' | 'DELETE',
	path: string,
	query: Record<string, string | undefined> = {},
	body?: unknown,
	form = false,
): Promise<ServiceM8Response> {
	if (!key.trim()) throw new AuthMissingError('servicem8', authType);
	const url = new URL(path, 'https://api.servicem8.com');
	for (const [name, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(name, value);
	}
	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method,
			redirect: 'error',
			credentials: 'omit',
			signal: AbortSignal.timeout(20_000),
			headers: {
				Accept: 'application/json',
				...(authType === 'api_key'
					? { 'X-API-Key': key }
					: { Authorization: `Bearer ${key}` }),
				...(body === undefined
					? {}
					: {
							'Content-Type': form
								? 'application/x-www-form-urlencoded'
								: 'application/json',
						}),
			},
			...(body === undefined
				? {}
				: {
						body: form
							? new URLSearchParams(body as Record<string, string>).toString()
							: JSON.stringify(body),
					}),
		});
	} catch {
		throw new ServiceM8Error('ServiceM8 request failed');
	}
	if (!response.ok) {
		const retry = response.headers.get('retry-after');
		const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : undefined;
		const retryDate =
			retry && seconds === undefined ? Date.parse(retry) : Number.NaN;
		const retryAfter =
			seconds !== undefined
				? seconds * 1000
				: Number.isFinite(retryDate)
					? Math.max(0, retryDate - Date.now())
					: undefined;
		let providerCode: number | undefined;
		try {
			const error: unknown = await response.json();
			if (
				error &&
				typeof error === 'object' &&
				'errorCode' in error &&
				typeof error.errorCode === 'number'
			)
				providerCode = error.errorCode;
		} catch {
			// ServiceM8 documents plain-text rate-limit responses as well as JSON errors.
		}
		throw new ServiceM8Error(
			'ServiceM8 HTTP request failed',
			response.status,
			retryAfter,
			providerCode,
		);
	}
	let data: unknown;
	try {
		data = await response.json();
	} catch {
		throw new ServiceM8Error(
			'ServiceM8 returned invalid JSON',
			response.status,
		);
	}
	if (
		data !== null &&
		typeof data === 'object' &&
		'errorCode' in data &&
		typeof data.errorCode === 'number' &&
		data.errorCode !== 0
	) {
		throw new ServiceM8Error(
			'ServiceM8 returned an error',
			response.status,
			undefined,
			data.errorCode,
		);
	}
	return {
		body: data,
		nextCursor: response.headers.get('x-next-cursor') ?? undefined,
		recordUuid: response.headers.get('x-record-uuid') ?? undefined,
	};
}
