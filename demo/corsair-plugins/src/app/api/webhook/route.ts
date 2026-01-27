import { filterWebhook } from 'corsair';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/server/corsair';
import { inngest } from '@/server/inngest/client';

export async function POST(request: NextRequest) {
	console.log('\n' + '═'.repeat(60));
	console.log('📨 INCOMING WEBHOOK REQUEST');
	console.log('═'.repeat(60));

	// Extract tenant ID from headers
	const tenantId = request.headers.get('x-tenant-id') || 'default';
	console.log('Tenant ID:', tenantId);

	// Get headers as a plain object
	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});

	// Get body - handle both JSON and text
	const contentType = request.headers.get('content-type');
	let body: any;

	if (contentType?.includes('application/json')) {
		body = await request.json();
	} else {
		body = await request.text();
	}

	console.log('Headers:', JSON.stringify(headers, null, 2));
	console.log(
		'Body:',
		typeof body === 'string'
			? body.substring(0, 200)
			: JSON.stringify(body, null, 2),
	);

	// Filter webhook to identify provider
	console.log('\n🔍 Running filterWebhook function...\n');
	const tenantScopedCorsair = corsair.withTenant(tenantId);
	const result = await filterWebhook(tenantScopedCorsair, headers, body);

	console.log('✅ Filter Result:');
	console.log('   Plugin:', result.plugin || 'null (unknown provider)');
	console.log('   Action:', result.action || 'null (unknown action)');
	console.log('═'.repeat(60));

	// Handle Slack URL verification synchronously
	if (result.plugin === 'slack') {
		const slackBody = result.body as {
			type?: string;
			challenge?: string;
			event?: { type?: string };
			event_id?: string;
			team_id?: string;
		};

		if (slackBody.type === 'url_verification') {
			console.log('\n🔐 Slack URL Verification Challenge');
			console.log('Challenge:', slackBody.challenge);
			return NextResponse.json({ challenge: slackBody.challenge });
		}

		// Send Slack event to Inngest for async processing
		if (slackBody.type === 'event_callback' && slackBody.event) {
			console.log('\n📬 Slack Event - Sending to Inngest');
			console.log('   Event Type:', slackBody.event.type);
			console.log('   Event ID:', slackBody.event_id);
			console.log('   Team ID:', slackBody.team_id);

			await inngest.send({
				name: 'slack/event',
				data: {
					tenantId,
					event: slackBody.event,
					rawBody: body,
				},
			});

			return NextResponse.json({ success: true, queued: true });
		}
	}

	// Handle Linear events - send to Inngest
	if (result.plugin === 'linear') {
		const linearBody = result.body as {
			type?: string;
			action?: string;
			data?: { id?: string; title?: string; body?: string };
		};

		console.log('\n📋 Linear Event - Sending to Inngest');
		console.log('   Type:', linearBody.type);
		console.log('   Action:', linearBody.action);
		if (linearBody.data) {
			console.log('   Data ID:', linearBody.data.id);
		}

		await inngest.send({
			name: 'linear/event',
			data: {
				tenantId,
				event: linearBody,
				rawBody: body,
			},
		});

		return NextResponse.json({ success: true, queued: true });
	}

	// Unknown provider
	console.log('\n⚠️  Unknown provider or event type');
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
