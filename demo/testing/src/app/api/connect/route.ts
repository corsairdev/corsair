import { generateOAuthUrl } from 'corsair/oauth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsair } from '@/server/corsair';

const REDIRECT_URI = `${process.env.APP_URL ?? 'http://localhost:3001'}/api/auth`;

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const plugin = searchParams.get('plugin');
	const tenantId = searchParams.get('tenantId') ?? 'demo-user';

	if (!plugin) {
		return NextResponse.json(
			{ error: 'Missing plugin param' },
			{ status: 400 },
		);
	}

	try {
		const { url, state } = await generateOAuthUrl(corsair, plugin, {
			tenantId,
			redirectUri: REDIRECT_URI,
		});
		const response = NextResponse.redirect(url);
		// Store state in httpOnly cookie for CSRF verification in /api/auth
		response.cookies.set('oauth_state', state, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 10, // 10 minutes
		});
		return response;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
