import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';

// ─────────────────────────────────────────────────────────────────────────────
// Next.js App Router adapter.
//
// Mount in app/api/corsair/[[...path]]/route.ts (optional catch-all so bare
// /api/corsair hits hub delivery as well as management subpaths):
//
//   import { toNextJsHandler } from 'corsair';
//   import { corsair } from '@/lib/corsair';
//   export const { GET, POST, OPTIONS } = toNextJsHandler(corsair, {
//     basePath: '/api/corsair',
//   });
//
// Next's Route Handlers already speak the fetch API, so the adapter fans the
// same handler out per exported method.
// ─────────────────────────────────────────────────────────────────────────────

export function toNextJsHandler(
	// `unknown` matches the managementHandler signature — see the justification
	// there. The handler only reads the CORSAIR_INTERNAL symbol, so the public
	// client shape isn't needed at this seam.
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): {
	GET: (req: Request) => Promise<Response>;
	POST: (req: Request) => Promise<Response>;
	OPTIONS: (req: Request) => Promise<Response>;
} {
	const handler = managementHandler(corsair, opts);
	return { GET: handler, POST: handler, OPTIONS: handler };
}
