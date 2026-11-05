import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PLUGIN_ID_PATTERN = /^[a-z0-9]+$/;

function iconsDir(): string {
	return join(process.cwd(), '..', 'explorer', 'icons');
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	if (!PLUGIN_ID_PATTERN.test(id)) {
		return new Response('Not found', { status: 404 });
	}

	const iconPath = join(iconsDir(), `${id}.png`);
	if (!existsSync(iconPath)) {
		return new Response('Not found', { status: 404 });
	}

	const body = readFileSync(iconPath);

	return new Response(body, {
		headers: {
			'Content-Type': 'image/png',
			// Not immutable: an icon can be replaced under the same URL (a wrong
			// domain fixed in explorer/icons), and a year-long immutable copy would
			// keep the old mark in every browser that loaded it.
			'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
		},
	});
}
