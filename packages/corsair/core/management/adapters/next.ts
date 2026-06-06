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
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): {
	GET: (req: Request) => Promise<Response>;
	POST: (req: Request) => Promise<Response>;
} {
	const handler = managementHandler(corsair, opts);
	return { GET: handler, POST: handler };
}
