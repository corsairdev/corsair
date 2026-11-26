export interface RateLimitConfig {
	enabled: boolean;
	maxRetries: number;
	initialRetryDelay: number;
	backoffMultiplier: number;
	headerNames: {
		retryAfter?: string;
		resetTime?: string;
		remaining?: string;
		limit?: string;
	};
	isRateLimitError?: (status: number, body: any) => boolean;
}

export interface RateLimitInfo {
	retryAfter?: number;
	rateLimitReset?: number;
	rateLimitRemaining?: number;
	rateLimitLimit?: number;
}

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

// RFC 9110 HTTP-date: IMF-fixdate, then the obsolete RFC 850 and asctime forms.
const IMF_FIXDATE =
	/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/;
const RFC850_DATE =
	/^[A-Z][a-z]+, \d{2}-[A-Z][a-z]{2}-\d{2} \d{2}:\d{2}:\d{2} GMT$/;
const ASCTIME_DATE =
	/^[A-Z][a-z]{2} [A-Z][a-z]{2} [ \d]\d \d{2}:\d{2}:\d{2} \d{4}$/;

// Node's setTimeout ceiling (2^31-1 ms, ~24.8 days). Larger delays fire
// immediately instead of waiting, so they are treated as invalid and the
// reset-time or backoff fallback applies.
const MAX_TIMER_MS = 2_147_483_647;

/**
 * Parses a Retry-After value into milliseconds. RFC 9110 allows only
 * delay-seconds (digits) or an HTTP-date, so anything else, such as "0.5"
 * or "-5", returns undefined. Delays beyond MAX_TIMER_MS are also rejected
 * because setTimeout cannot represent them and would fire immediately.
 */
function parseRetryAfter(value: string): number | undefined {
	const trimmed = value.trim();
	let delay: number | undefined;
	if (/^\d+$/.test(trimmed)) {
		delay = Number(trimmed) * 1000;
	} else {
		let date: number | undefined;
		if (IMF_FIXDATE.test(trimmed) || RFC850_DATE.test(trimmed)) {
			date = Date.parse(trimmed);
		} else if (ASCTIME_DATE.test(trimmed)) {
			// asctime carries no zone but is always GMT.
			date = Date.parse(`${trimmed} GMT`);
		}
		if (date !== undefined && Number.isFinite(date)) {
			delay = Math.max(0, date - Date.now());
		}
	}
	if (delay === undefined || delay > MAX_TIMER_MS) {
		return undefined;
	}
	return delay;
}

export function extractRateLimitInfo(
	response: Response,
	config: RateLimitConfig,
): RateLimitInfo {
	const info: RateLimitInfo = {};

	if (config.headerNames.retryAfter) {
		const retryAfter = response.headers.get(config.headerNames.retryAfter);
		if (retryAfter) {
			const delay = parseRetryAfter(retryAfter);
			// Ignore invalid values so the reset fallback still applies.
			if (delay !== undefined) {
				info.retryAfter = delay;
			}
		}
	}

	if (config.headerNames.resetTime) {
		const resetTime = response.headers.get(config.headerNames.resetTime);
		if (resetTime) {
			const timestamp = parseInt(resetTime, 10);
			if (!isNaN(timestamp)) {
				const now = Date.now();
				const resetMs =
					timestamp > 1000000000000 ? timestamp : timestamp * 1000;
				info.rateLimitReset = resetMs;
				// retry-after is the server's explicit instruction for this response;
				// the window reset is only a fallback when it is absent (e.g. GitHub
				// secondary limits send a short retry-after and a reset up to an hour out).
				if (
					info.retryAfter === undefined &&
					resetMs > now &&
					resetMs - now <= MAX_TIMER_MS
				) {
					info.retryAfter = resetMs - now;
				}
			}
		}
	}

	if (config.headerNames.remaining) {
		const remaining = response.headers.get(config.headerNames.remaining);
		if (remaining) {
			const value = parseInt(remaining, 10);
			if (!isNaN(value)) {
				info.rateLimitRemaining = value;
			}
		}
	}

	if (config.headerNames.limit) {
		const limit = response.headers.get(config.headerNames.limit);
		if (limit) {
			const value = parseInt(limit, 10);
			if (!isNaN(value)) {
				info.rateLimitLimit = value;
			}
		}
	}

	return info;
}

export function isRateLimitError(
	status: number,
	body: any,
	config: RateLimitConfig,
): boolean {
	if (!config.enabled) {
		return false;
	}

	if (status === 429) {
		return true;
	}

	if (config.isRateLimitError) {
		return config.isRateLimitError(status, body);
	}

	return false;
}

export function calculateRetryDelay(
	attempt: number,
	rateLimitInfo: RateLimitInfo,
	config: RateLimitConfig,
): number {
	if (rateLimitInfo.retryAfter !== undefined) {
		return rateLimitInfo.retryAfter;
	}

	const delay =
		config.initialRetryDelay * Math.pow(config.backoffMultiplier, attempt - 1);

	return Math.min(delay, 60000);
}

export async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
