import {
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
});
