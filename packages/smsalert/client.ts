import { AuthMissingError } from 'corsair/core';
import { z } from 'zod';

export class SmsalertError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'SmsalertError';
	}
}

const envelope = z.object({ status: z.string() }).loose();

/** The shared transport logs JSON parse errors and does not redact `apikey`.
 * Keep URLs, parse failures, request data, and response bodies out of errors and logs.
 * The raw JSON is unknown because each operation has a different response shape;
 * the caller validates it against that operation's schema before exposing it. */
export async function smsalertRequest(
	key: string,
	method: 'GET' | 'POST',
	path: string,
	query: Record<string, string | number | undefined>,
	form?: Record<string, string>,
	auth: 'query' | 'form' | 'none' = 'query',
): Promise<unknown> {
	if (auth !== 'none' && !key.trim())
		throw new AuthMissingError('smsalert', 'api_key');
	const body =
		form === undefined && auth !== 'form'
			? undefined
			: new URLSearchParams({
					...form,
					...(auth === 'form' ? { apikey: key } : {}),
				}).toString();
	const url = new URL(path, 'https://www.smsalert.co.in');
	for (const [name, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(name, String(value));
	}
	if (auth === 'query') url.searchParams.set('apikey', key);
	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method,
			redirect: 'error',
			credentials: 'omit',
			signal: AbortSignal.timeout(20_000),
			headers: {
				Accept: 'application/json',
				...(body === undefined
					? {}
					: { 'Content-Type': 'application/x-www-form-urlencoded' }),
			},
			...(body === undefined ? {} : { body }),
		});
	} catch {
		throw new SmsalertError('SMS Alert request failed');
	}
	if (!response.ok) {
		const retryAfter = response.headers.get('retry-after');
		const seconds =
			retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : undefined;
		throw new SmsalertError(
			'SMS Alert HTTP request failed',
			response.status,
			seconds === undefined ? undefined : seconds * 1000,
		);
	}
	// JSON from the provider is untrusted until the envelope and endpoint schemas parse it.
	let result: unknown;
	try {
		result = await response.json();
	} catch {
		throw new SmsalertError('SMS Alert returned an invalid response');
	}
	const parsed = envelope.safeParse(result);
	if (!parsed.success)
		throw new SmsalertError('SMS Alert returned an invalid response');
	if (parsed.data.status !== 'success')
		throw new SmsalertError('SMS Alert returned an error');
	return result;
}
