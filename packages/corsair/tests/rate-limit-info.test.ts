import {
	calculateRetryDelay,
	DEFAULT_RATE_LIMIT_CONFIG,
	extractRateLimitInfo,
} from '../async-core/rate-limit';

function response429(headers: Record<string, string>): Response {
	return new Response(null, { status: 429, headers });
}

describe('extractRateLimitInfo', () => {
	it('prefers retry-after over a later x-ratelimit-reset', () => {
		const resetInAnHour = Math.floor(Date.now() / 1000) + 3600;

		const info = extractRateLimitInfo(
			response429({
				'retry-after': '30',
				'x-ratelimit-reset': String(resetInAnHour),
			}),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBe(30_000);
		expect(info.rateLimitReset).toBe(resetInAnHour * 1000);
	});

	it('falls back to x-ratelimit-reset when retry-after is absent', () => {
		const resetInAMinute = Math.floor(Date.now() / 1000) + 60;

		const info = extractRateLimitInfo(
			response429({ 'x-ratelimit-reset': String(resetInAMinute) }),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBeGreaterThan(55_000);
		expect(info.retryAfter).toBeLessThanOrEqual(60_000);
	});

	it('uses retry-after alone when no reset header is sent', () => {
		const info = extractRateLimitInfo(
			response429({ 'retry-after': '5' }),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBe(5_000);
		expect(info.rateLimitReset).toBeUndefined();
	});

	it('falls back to x-ratelimit-reset when retry-after is negative', () => {
		const resetInAMinute = Math.floor(Date.now() / 1000) + 60;

		const info = extractRateLimitInfo(
			response429({
				'retry-after': '-5',
				'x-ratelimit-reset': String(resetInAMinute),
			}),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBeGreaterThan(55_000);
		expect(info.retryAfter).toBeLessThanOrEqual(60_000);
	});

	it('parses an HTTP-date retry-after over a later x-ratelimit-reset', () => {
		const retryAt = new Date(Date.now() + 30_000).toUTCString();
		const resetInAnHour = Math.floor(Date.now() / 1000) + 3600;

		const info = extractRateLimitInfo(
			response429({
				'retry-after': retryAt,
				'x-ratelimit-reset': String(resetInAnHour),
			}),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBeGreaterThan(25_000);
		expect(info.retryAfter).toBeLessThanOrEqual(30_000);
	});

	it('clamps an HTTP-date retry-after in the past to zero', () => {
		const info = extractRateLimitInfo(
			response429({
				'retry-after': new Date(Date.now() - 60_000).toUTCString(),
			}),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBe(0);
	});

	it('falls back to x-ratelimit-reset when retry-after is fractional', () => {
		const resetInAMinute = Math.floor(Date.now() / 1000) + 60;

		const info = extractRateLimitInfo(
			response429({
				'retry-after': '0.5',
				'x-ratelimit-reset': String(resetInAMinute),
			}),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBeGreaterThan(55_000);
		expect(info.retryAfter).toBeLessThanOrEqual(60_000);
	});

	it('ignores a fractional retry-after when no reset header is sent', () => {
		const info = extractRateLimitInfo(
			response429({ 'retry-after': '0.5' }),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBeUndefined();
	});

	it('parses an asctime retry-after as GMT', () => {
		// "Sun, 06 Nov 1994 08:49:37 GMT" becomes "Sun Nov  6 08:49:37 1994".
		const [weekday, day, month, year, time] = new Date(Date.now() + 30_000)
			.toUTCString()
			.split(' ');
		const asctime = `${weekday?.slice(0, 3)} ${month} ${String(Number(day)).padStart(2, ' ')} ${time} ${year}`;

		const info = extractRateLimitInfo(
			response429({ 'retry-after': asctime }),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBeGreaterThan(25_000);
		expect(info.retryAfter).toBeLessThanOrEqual(30_000);
	});

	it('keeps an explicit zero retry-after', () => {
		const info = extractRateLimitInfo(
			response429({ 'retry-after': '0' }),
			DEFAULT_RATE_LIMIT_CONFIG,
		);

		expect(info.retryAfter).toBe(0);
		expect(calculateRetryDelay(1, info, DEFAULT_RATE_LIMIT_CONFIG)).toBe(0);
	});
});
