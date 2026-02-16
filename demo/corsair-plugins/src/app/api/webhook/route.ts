import { processWebhook } from 'corsair';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/server/corsair';

function buildGoogleChannelBody(headers: Record<string, string>) {
	const resourceUri = headers['x-goog-resource-uri'];
	const channelId = headers['x-goog-channel-id'];
	if (!resourceUri || !channelId) return null;

	const notification: Record<string, string> = {
		resourceId: headers['x-goog-resource-id'] || '',
		resourceState: headers['x-goog-resource-state'] || '',
		resourceUri,
		channelId,
		channelExpiration: headers['x-goog-channel-expiration'] || '',
	};

	if (resourceUri.includes('/drive/')) {
		notification.kind = 'drive#change';
	}

	const data = Buffer.from(JSON.stringify(notification)).toString('base64');

	return {
		message: {
			data,
			messageId: headers['x-goog-message-number'] || '',
		},
	};
}

export async function POST(request: NextRequest) {
	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});

	const contentType = request.headers.get('content-type');

	let body: string | Record<string, unknown>;

	if (contentType?.includes('application/json')) {
		body = await request.json();
	} else {
		const text = await request.text();
		if (text && text.trim()) {
			body = text;
		} else if (headers['x-goog-resource-uri']) {
			body = buildGoogleChannelBody(headers) || {};
		} else {
			body = {};
		}
	}

	const url = new URL(request.url);

	const tenantId =
		url.searchParams.get('tenantId') ||
		url.searchParams.get('tenant_id') ||
		undefined;
	console.log('headers', headers);
	console.log('body', body);
	const result = await processWebhook(corsair, headers, body, { tenantId });

	console.info('Plugin Processed:', result.plugin, result.action);

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
