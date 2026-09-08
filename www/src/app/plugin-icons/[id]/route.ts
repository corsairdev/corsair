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
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
}
