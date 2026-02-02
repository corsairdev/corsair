import { filterWebhook } from 'corsair';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/server/corsair';

export async function POST(request: NextRequest) {
	
	const tenantId = request.headers.get('x-tenant-id') || 'default';

	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});

	const contentType = request.headers.get('content-type');
	let body = contentType?.includes('application/json') ? await request.json() : await request.text();

	const tenantScopedCorsair = corsair.withTenant(tenantId);
	const result = await filterWebhook(tenantScopedCorsair, headers, body);

	if (result.plugin === 'slack') {
		if ((result.body as any).type === 'url_verification') {
			return NextResponse.json({ challenge: (result.body as any).challenge });
		}
	}

	if (result.response) {
		return NextResponse.json(result.response);
	}

	return NextResponse.json(
		{
			success: false,
			error: 'Unknown provider',
			filtered: {
				plugin: result.plugin,
				action: result.action,
			},
		},
		{ status: 400 },
	);
}

export async function GET() {
	return NextResponse.json({
		status: 'ok',
		message: 'Webhook endpoint is active',
		timestamp: new Date().toISOString(),
	});
}
