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

	let body: any;

	try {
		body = contentType?.includes('application/json')
			? await request.json()
			: await request.text();
	} catch (e) {
		console.error(e);
	}

	const url = new URL(request.url);

	const tenantId =
		url.searchParams.get('tenantId') ||
		url.searchParams.get('tenant_id') ||
		undefined;

	const result = await filterWebhook(corsair, headers, body, { tenantId });

	// Ensure response is serializable - NextResponse.json can fail on certain values
	try {
		return NextResponse.json(result.response);
	} catch (error) {
		console.error('Error serializing webhook response:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to serialize response',
				message:
					error instanceof Error
						? error.message
						: 'Unknown serialization error',
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json({
		status: 'ok',
		message: 'Webhook endpoint is active',
		timestamp: new Date().toISOString(),
	});
}
