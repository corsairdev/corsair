import { filterWebhook } from 'corsair';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/server/corsair';

export async function POST(request: NextRequest) {
	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});

	const contentType = request.headers.get('content-type');
	let body = contentType?.includes('application/json')
		? await request.json()
		: await request.text();

	const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;

	if (parsedBody && typeof parsedBody === 'object' && parsedBody.type === 'url_verification') {
		return NextResponse.json({ challenge: parsedBody.challenge });
	}

	const url = new URL(request.url);

	const tenantId =
		url.searchParams.get('tenantId') ||
		url.searchParams.get('tenant_id') ||
		undefined;

	const result = await filterWebhook(corsair, headers, body, { tenantId });

	return NextResponse.json(result.response);
}

export async function GET() {
	return NextResponse.json({
		status: 'ok',
		message: 'Webhook endpoint is active',
		timestamp: new Date().toISOString(),
	});
}
