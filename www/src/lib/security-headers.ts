type SecurityHeader = {
	key: string;
	value: string;
};

const contentSecurityPolicyReportOnly = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"form-action 'self'",
	"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: https://cdn.sanity.io https://github.com https://twenty-icons.com",
	"font-src 'self' data:",
	"connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com",
	'report-uri /api/csp-reports',
].join('; ');

/**
 * Browser protections for corsair.dev. CSP remains report-only until observed
 * violations prove the allowlist is complete for production traffic.
 */
export const securityHeaders: readonly SecurityHeader[] = [
	{
		key: 'Content-Security-Policy-Report-Only',
		value: contentSecurityPolicyReportOnly,
	},
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{
		key: 'Permissions-Policy',
		value: 'camera=(), geolocation=(), microphone=()',
	},
];
