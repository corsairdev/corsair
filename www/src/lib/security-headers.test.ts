import assert from 'node:assert/strict';
import test from 'node:test';
import nextConfig from '../../next.config.ts';
import { securityHeaders } from './security-headers';

const headerValue = (key: string): string | undefined =>
	securityHeaders.find((header) => header.key === key)?.value;

test('uses report-only CSP while the production allowlist is observed', () => {
	assert.ok(headerValue('Content-Security-Policy-Report-Only'));
	assert.equal(headerValue('Content-Security-Policy'), undefined);
	assert.match(
		headerValue('Content-Security-Policy-Report-Only') ?? '',
		/default-src 'self'/,
	);
	assert.match(
		headerValue('Content-Security-Policy-Report-Only') ?? '',
		/https:\/\/www\.googletagmanager\.com/,
	);
	assert.match(
		headerValue('Content-Security-Policy-Report-Only') ?? '',
		/https:\/\/cdn\.sanity\.io/,
	);
});

test('sets defense-in-depth browser headers without enabling HSTS preload', () => {
	assert.equal(headerValue('X-Frame-Options'), 'DENY');
	assert.equal(headerValue('X-Content-Type-Options'), 'nosniff');
	assert.equal(
		headerValue('Referrer-Policy'),
		'strict-origin-when-cross-origin',
	);
	assert.equal(
		headerValue('Permissions-Policy'),
		'camera=(), geolocation=(), microphone=()',
	);
	assert.equal(headerValue('Strict-Transport-Security'), undefined);
});

test('applies the security headers to every Next.js route', async () => {
	assert.equal(nextConfig.poweredByHeader, false);

	const headerRules = await nextConfig.headers?.();
	assert.deepEqual(headerRules, [
		{
			source: '/:path*',
			headers: [...securityHeaders],
		},
	]);
});
