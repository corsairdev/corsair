import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PLUGIN_ID_PATTERN = /^[a-z0-9]+$/;
const iconCache = new Map<string, Buffer>();

function iconsDir(): string {
	return join(process.cwd(), '..', '..', 'explorer', 'icons');
}

function loadIcon(id: string): Buffer | null {
	const cached = iconCache.get(id);
	if (cached) return cached;

	const iconPath = join(iconsDir(), `${id}.png`);
	if (!existsSync(iconPath)) return null;

	const bytes = readFileSync(iconPath);
	iconCache.set(id, bytes);
	return bytes;
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	if (!PLUGIN_ID_PATTERN.test(id)) {
		return new Response('Not found', { status: 404 });
	}

	const bytes = loadIcon(id);
	if (!bytes) {
		return new Response('Not found', { status: 404 });
	}

	return new Response(new Uint8Array(bytes), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
}
