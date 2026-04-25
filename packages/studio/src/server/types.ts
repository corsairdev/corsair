import type { IncomingMessage, ServerResponse } from 'node:http';
import type { CorsairInternalConfig } from 'corsair/core';

export type HandlerCtx = {
	req: IncomingMessage;
	res: ServerResponse;
	url: URL;
	cwd: string;
	getCorsair: () => Promise<CorsairHandle>;
};

export type CorsairHandle = {
	instance: unknown;
	internal: CorsairInternalConfig;
	/**
	 * Returns a concrete single-tenant client (the target of API calls).
	 * If the instance is multi-tenant, uses the provided tenantId.
	 */
	resolveClient: (tenantId?: string) => Record<string, unknown>;
};

/** Handlers return JSON-serializable data; the router stringifies it for the response. */
export type HandlerFn = (ctx: HandlerCtx) => Promise<unknown>;
