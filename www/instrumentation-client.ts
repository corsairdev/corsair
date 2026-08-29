import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !host) {
	if (process.env.NODE_ENV === 'development') {
		const missingVariable = !projectToken
			? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
			: 'NEXT_PUBLIC_POSTHOG_HOST';
		console.error(
			`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
		);
	}
} else {
	posthog.init(projectToken, {
		// Route ingestion through /ingest (see next.config rewrites) so ad
		// blockers — heavily used by our developer audience — don't drop events
		// and skew session/bounce numbers.
		api_host: '/ingest',
		ui_host: host,
		defaults: '2026-01-30',
		capture_exceptions: true,
		debug: process.env.NODE_ENV === 'development',
		// Share the anonymous id across corsair.dev, docs.corsair.dev and
		// hub.corsair.dev so the funnel is one session. Localhost can't set a
		// .corsair.dev cookie, so only apply it in production.
		...(process.env.NODE_ENV === 'production' && {
			cookie_domain: '.corsair.dev',
		}),
	});
}
// Mem0 plugin test 