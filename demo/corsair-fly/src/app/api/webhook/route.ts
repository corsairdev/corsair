import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { inngest } from '@/server/inngest/client';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		// Generic webhook handler that forwards to Inngest
		// You can customize this based on your webhook sources
		const eventType = req.headers.get('x-event-type') || 'webhook/received';

		await inngest.send({
			name: eventType as any,
			data: {
				...body,
				timestamp: new Date().toISOString(),
				headers: Object.fromEntries(req.headers.entries()),
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return NextResponse.json(
			{ error: 'Failed to process webhook' },
			{ status: 500 },
		);
	}
}
