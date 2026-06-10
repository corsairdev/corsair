import type { ManagementHandlerOptions } from '../handler';
import { managementHandler } from '../handler';

// ─────────────────────────────────────────────────────────────────────────────
// Hono adapter.
//
// Mount on any path pattern that matches your basePath:
//
//   import { Hono } from 'hono';
//   import { toHonoHandler } from 'corsair';
//   import { corsair } from './lib/corsair';
//   const app = new Hono();
//   app.all('/api/corsair/*', toHonoHandler(corsair));
//
// Hono already speaks the fetch API — `c.req.raw` is a Web Request. The
// adapter is a one-line bridge. Context type is declared structurally to
// avoid taking a `hono` peer dep.
// ─────────────────────────────────────────────────────────────────────────────

type HonoLikeContext = {
	req: { raw: Request };
};

export type HonoHandler = (
	c: HonoLikeContext,
) => Response | Promise<Response>;

export function toHonoHandler(
	// `unknown` matches the managementHandler signature — see the justification
	// there. The handler only reads the CORSAIR_INTERNAL symbol, so the public
	// client shape isn't needed at this seam.
	corsair: unknown,
	opts?: ManagementHandlerOptions,
): HonoHandler {
	const handler = managementHandler(corsair, opts);
	return (c) => handler(c.req.raw);
}
