import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';

// ─────────────────────────────────────────────────────────────────────────────
// Next.js App Router adapter.
//
// Mount in app/api/corsair/[...all]/route.ts:
//
//   import { toNextJsHandler } from 'corsair';
//   import { corsair } from '@/lib/corsair';
//   export const { GET, POST } = toNextJsHandler(corsair);
//
// Next's Route Handlers already speak the fetch API, so the adapter just
// returns the handler twice — once per method we serve.
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
} {
	const handler = managementHandler(corsair, opts);
	return { GET: handler, POST: handler };
}
