import { processCorsair } from 'corsair/tunnel';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { corsair } from '@/server/corsair';

export async function POST(request: NextRequest) {
	const signingSecret = process.env.CORSAIR_TUNNEL_SIGNING_SECRET;
	if (!signingSecret) {
		return NextResponse.json(
			{ error: 'Tunnel signing secret is not configured' },
			{ status: 503 },
		);
	}

	const body = await request.text();
	const ack = await processCorsair(
		corsair,
		{
			headers: request.headers,
			body,
		},
		{
			signingSecret,
		},
	);

	if (ack.status !== 'ok') {
		return NextResponse.json(
			{ error: ack.error ?? 'Tunnel processing failed' },
			{ status: ack.retryable === false ? 400 : 502 },
		);
	}

	const webhookResponse = ack.webhookResponse;
	if (!webhookResponse) {
		return new NextResponse(null, { status: 204 });
	}

	const responseHeaders = new Headers();
	for (const [key, value] of Object.entries(webhookResponse.headers ?? {})) {
		if (typeof value === 'string') {
			responseHeaders.set(key, value);
		}
	}

	const status = webhookResponse.status ?? 200;
	if (
		webhookResponse.body &&
		typeof webhookResponse.body === 'object' &&
		!(webhookResponse.body instanceof ArrayBuffer)
	) {
		return NextResponse.json(webhookResponse.body, {
			status,
			headers: responseHeaders,
		});
	}

	return new NextResponse(
		typeof webhookResponse.body === 'string'
			? webhookResponse.body
			: webhookResponse.body
				? JSON.stringify(webhookResponse.body)
				: null,
		{
			status,
			headers: responseHeaders,
		},
	);
}

export async function GET() {
	return NextResponse.json({
		status: 'ok',
		message: 'Corsair tunnel endpoint is active',
		timestamp: new Date().toISOString(),
	});
}
