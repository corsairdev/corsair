import type { HubConnectSource } from 'corsair/hub';
import { createHubConnectSession, HubNotConfiguredError } from 'corsair/hub';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { corsair } from '@/server/corsair';

export async function POST(request: NextRequest) {
	let body: {
		plugin?: string;
		tenantId?: string;
		source?: HubConnectSource;
	};

	try {
		body = (await request.json()) as typeof body;
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const plugin = body.plugin?.trim();
	const tenantId = body.tenantId?.trim() || 'demo-user';
	const source = body.source;

	if (!plugin) {
		return NextResponse.json({ error: 'plugin is required' }, { status: 400 });
	}

	if (source !== 'client' && source !== 'server') {
		return NextResponse.json(
			{ error: 'source is required and must be "client" or "server"' },
			{ status: 400 },
		);
	}

	try {
		const session = await createHubConnectSession(corsair, {
			plugin,
			tenantId,
			source,
		});

		return NextResponse.json({
			ok: true,
			connectUrl: session.connectUrl,
			token: session.token,
			projectId: session.projectId,
		});
	} catch (error) {
		if (error instanceof HubNotConfiguredError) {
			return NextResponse.json({ error: error.message }, { status: 503 });
		}

		const message = error instanceof Error ? error.message : String(error);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const plugin = searchParams.get('plugin');
	const tenantId = searchParams.get('tenantId') ?? 'demo-user';
	const source = searchParams.get('source');

	if (!plugin) {
		return NextResponse.json({ error: 'plugin is required' }, { status: 400 });
	}

	if (source !== 'client' && source !== 'server') {
		return NextResponse.json(
			{ error: 'source is required and must be "client" or "server"' },
			{ status: 400 },
		);
	}

	const fakeRequest = new Request(request.url, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ plugin, tenantId, source }),
	});

	return POST(fakeRequest as NextRequest);
}
