import { processWebhook } from 'corsair';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { agent, ensureAgentStarted } from '@/server/agent';
import { corsair } from '@/server/corsair';

export async function POST(request: NextRequest) {
	const url = new URL(request.url);
	const validationToken =
		url.searchParams.get('validationtoken') ||
		url.searchParams.get('validationToken');

	if (validationToken) {
		return new NextResponse(validationToken, {
			status: 200,
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
			},
		});
	}
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
		body = text && text.trim() ? text : {};
	}

	const tenantId =
		url.searchParams.get('tenantId') ||
		url.searchParams.get('tenant_id') ||
		undefined;

	const result = await processWebhook(corsair, headers, body, { tenantId });

	console.info('Plugin Processed:', result.plugin, result.action);

	// Forward to agent for dynamic hook dispatch (jobs created via agent.chat).
	if (result.plugin && result.action) {
		const agentPath = `${result.plugin}.webhooks.${result.action}`;
		console.info('[agent] dispatching webhook:', agentPath);
		await ensureAgentStarted();
		try {
			await agent.handleWebhookEvent({
				// processWebhook returns action relative to the webhooks subtree
				// (e.g. 'pullRequest.opened'), but agent hooks are stored with the
				// full path from list_operations (e.g. 'github.webhooks.pullRequest.opened').
				path: agentPath,
				// Prefer the enriched handler data (e.g. Google Calendar fetches the
				// full event from the API and returns it as response.data). Fall back
				// to result.body (processWebhook's normalized body — needed for plugins
				// like Google Calendar that send data in headers, not body) and finally
				// the raw request body.
				event: (result.handlerData ??
					result.body ??
					(typeof body === 'object' ? body : {})) as Record<string, unknown>,
			});
			console.info('[agent] webhook dispatch complete:', agentPath);
		} catch (err) {
			console.error('[agent] webhook dispatch failed:', err);
		}
	} else {
		console.info(
			'[agent] skipping dispatch — processWebhook returned no plugin/action',
		);
	}

	// Build response headers (e.g. Asana X-Hook-Secret handshake)
	// any/unknown cast needed since responseHeaders is a newer field not yet in the installed type definitions
	const responseHeaders = (result as Record<string, unknown>).responseHeaders as
		| Record<string, string>
		| undefined;
	const nextHeaders = new Headers();
	if (responseHeaders) {
		for (const [key, value] of Object.entries(responseHeaders)) {
			nextHeaders.set(key, value);
		}
	}

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
		return NextResponse.json(result.response, { headers: nextHeaders });
	}

	// Webhook processed successfully, but no data to return to sender
	return new NextResponse(null, { status: 200, headers: nextHeaders });
}

export async function GET() {
	return NextResponse.json({
		status: 'ok',
		message: 'Webhook endpoint is active',
		timestamp: new Date().toISOString(),
	});
}
