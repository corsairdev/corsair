import { NextResponse } from 'next/server';

import { LUG_HANDLE_API, readLugHandleAnswer } from '@/lib/lug-handle';
import { lugHandleProblem } from '@/lib/site-links';

const TIMEOUT_MS = 4000;

/** Is yourname.lug.dev free? Asked from the homepage claim box. */
export async function GET(request: Request) {
	const handle =
		new URL(request.url).searchParams.get('handle')?.trim().toLowerCase() ?? '';
	const problem = lugHandleProblem(handle);
	// Shape and reserved names need no network.
	if (problem) {
		return NextResponse.json({ available: false, reason: problem });
	}

	try {
		const upstream = await fetch(
			`${LUG_HANDLE_API}?${new URLSearchParams({ handle })}`,
			{ cache: 'no-store', signal: AbortSignal.timeout(TIMEOUT_MS) },
		);
		if (upstream.status === 429) {
			const retryAfter = upstream.headers.get('retry-after');
			return NextResponse.json(
				{ error: 'rate_limited' },
				{
					status: 429,
					headers: retryAfter ? { 'Retry-After': retryAfter } : undefined,
				},
			);
		}
		const answer = readLugHandleAnswer(await upstream.json().catch(() => null));
		if (!upstream.ok || !answer) {
			return NextResponse.json({ error: 'unavailable' }, { status: 502 });
		}
		return NextResponse.json(answer, {
			headers: { 'Cache-Control': 'no-store' },
		});
	} catch {
		return NextResponse.json({ error: 'unavailable' }, { status: 502 });
	}
}
