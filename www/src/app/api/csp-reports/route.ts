import { z } from 'zod';

const cspReportSchema = z.object({
	'csp-report': z.object({
		'blocked-uri': z.string().max(2_048).optional(),
		'document-uri': z.string().max(2_048).optional(),
		'effective-directive': z.string().max(200).optional(),
		'violated-directive': z.string().max(200).optional(),
	}),
});

const redactUrl = (value: string | undefined) => {
	if (!value) {
		return undefined;
	}

	try {
		const url = new URL(value);
		return `${url.origin}${url.pathname}`;
	} catch {
		return value;
	}
};

/**
 * Records report-only CSP violations in deployment logs while avoiding URL
 * query strings, which may contain user-specific data.
 */
export async function POST(request: Request) {
	const report = cspReportSchema.safeParse(
		await request.json().catch(() => null),
	);

	if (report.success) {
		const violation = report.data['csp-report'];
		console.warn('[csp-report]', {
			blockedUri: redactUrl(violation['blocked-uri']),
			documentUri: redactUrl(violation['document-uri']),
			effectiveDirective: violation['effective-directive'],
			violatedDirective: violation['violated-directive'],
		});
	}

	return new Response(null, { status: 204 });
}
