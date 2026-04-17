import { processOAuthCallback } from 'corsair';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/server/corsair';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ tenantId?: string[] }> },
) {
	const { tenantId: tenantIdSegments } = await params;
	const tenantId = tenantIdSegments?.[0];
	const url = new URL(request.url);

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');

	if (!code && !error) {
		return NextResponse.json({
			status: 'ok',
			message: 'OAuth callback endpoint is active',
			...(tenantId && { tenantId }),
			timestamp: new Date().toISOString(),
		});
	}

	const result = await processOAuthCallback(
		corsair,
		{ code, state, error },
		tenantId ? { tenantId } : undefined,
	);

	console.info('OAuth Callback:', result.plugin, result.success, 'tenant:', result.tenantId);

	if (!result.success) {
		return new NextResponse(
			`<html><body>
				<h2>Authorization failed</h2>
				<p>${result.error ?? 'Unknown error'}</p>
				<p>You can close this tab.</p>
			</body></html>`,
			{
				status: 400,
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
			},
		);
	}

	return new NextResponse(
		`<html><body>
			<h2>Authorization successful!</h2>
			<p>Plugin <strong>${result.plugin}</strong> has been authenticated${result.tenantId && result.tenantId !== 'default' ? ` for tenant <strong>${result.tenantId}</strong>` : ''}.</p>
			<p>You can close this tab and return to your application.</p>
		</body></html>`,
		{
			status: 200,
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		},
	);
}
