import { processWebhook } from 'corsair';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/server/corsair';

export async function POST(request: NextRequest) {
	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});

	const contentType = request.headers.get('content-type');

	const body = contentType?.includes('application/json')
		? await request.json()
		: await request.text();

	const url = new URL(request.url);

	const tenantId =
		url.searchParams.get('tenantId') ||
		url.searchParams.get('tenant_id') ||
		undefined;

	const result = await processWebhook(corsair, headers, body, { tenantId });
	// Handle case where no webhook matched
	if (!result.response) {
		return NextResponse.json(
			{
				success: false,
				message: 'No matching webhook handler found',
			},
			{ status: 404 },
		);
	}

	// Only return data if returnToSender is not null (like Slack challenge)
	// filterWebhook already handles stripping 'type' and extracting the value
	if (result.response !== undefined) {
		return NextResponse.json(result.response);
	}

	// Webhook processed successfully, but no data to return to sender
	return new NextResponse(null, { status: 200 });
}

export async function GET() {
	return NextResponse.json({
		status: 'ok',
		message: 'Webhook endpoint is active',
		timestamp: new Date().toISOString(),
	});
}
