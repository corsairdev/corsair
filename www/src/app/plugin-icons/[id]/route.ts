import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
	ICON_CACHE_CONTROL,
	missingIconResponse,
	PLACEHOLDER_CACHE_CONTROL,
	PLUGIN_ID_PATTERN,
	parseIconQuery,
	pickIconFile,
	placeholderSvg,
	SVG_SECURITY_HEADERS,
} from '@/lib/plugin-icons';

const explorerDir = () => join(process.cwd(), '..', 'explorer');

let catalogIds: Set<string> | null = null;

/** Plugin ids in the catalog, from the icon manifest's domain list. */
function isCatalogPlugin(id: string): boolean {
	if (!catalogIds) {
		const manifest = JSON.parse(
			readFileSync(join(explorerDir(), 'data', 'icon-manifest.json'), 'utf8'),
		) as { domains: Record<string, string> };
		catalogIds = new Set(Object.keys(manifest.domains));
	}
	return catalogIds.has(id);
}

/**
 * `/plugin-icons/<id>` with `?theme=dark` for dark surfaces and
 * `?format=png` for clients that can't draw SVG. See `@/lib/plugin-icons`.
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	if (!PLUGIN_ID_PATTERN.test(id)) {
		return new Response('Not found', { status: 404 });
	}

	const iconsDir = join(explorerDir(), 'icons');
	const query = parseIconQuery(new URL(request.url).searchParams);
	const icon = pickIconFile(id, query, (file) =>
		existsSync(join(iconsDir, file)),
	);

	if (!icon) {
		if (!isCatalogPlugin(id) || missingIconResponse(query) === 'not-found') {
			return new Response('Not found', { status: 404 });
		}
		return new Response(placeholderSvg(id), {
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': PLACEHOLDER_CACHE_CONTROL,
				'X-Icon-Fallback': '1',
				...SVG_SECURITY_HEADERS,
			},
		});
	}

	return new Response(readFileSync(join(iconsDir, icon.file)), {
		headers: {
			'Content-Type': icon.type,
			'Cache-Control': ICON_CACHE_CONTROL,
			...(icon.type === 'image/svg+xml' ? SVG_SECURITY_HEADERS : {}),
		},
	});
}
