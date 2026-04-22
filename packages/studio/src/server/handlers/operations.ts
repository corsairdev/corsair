import { readJsonBody } from '../router';
import type { HandlerFn } from '../types';

function navigateToEndpoint(
	client: Record<string, unknown>,
	path: string,
): ((...args: unknown[]) => Promise<unknown>) | undefined {
	const parts = path.split('.');
	let current: unknown = client;
	for (const part of parts) {
		if (current === null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === 'function'
		? (current as (...args: unknown[]) => Promise<unknown>)
		: undefined;
}

export const listOperations: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const plugin = body.plugin ? String(body.plugin) : undefined;
	const type = body.type ? String(body.type) : undefined;

	const { instance } = await ctx.getCorsair();
	const corsair = instance as Record<string, unknown>;
	if (typeof corsair.list_operations !== 'function') {
		throw new Error('list_operations not available on this Corsair instance.');
	}
	const opts: Record<string, unknown> = {};
	if (plugin) opts.plugin = plugin;
	if (type === 'api' || type === 'webhooks' || type === 'db') opts.type = type;
	return (corsair.list_operations as (o: unknown) => unknown)(opts);
};

export const schemaForOperation: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const path = String(body.path ?? '');
	if (!path) throw new Error('Missing path.');

	const { instance } = await ctx.getCorsair();
	const corsair = instance as Record<string, unknown>;
	if (typeof corsair.get_schema !== 'function') {
		throw new Error('get_schema not available on this Corsair instance.');
	}
	const schema = (corsair.get_schema as (p: string) => string)(path);
	return { schema };
};

export const runOperation: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const path = String(body.path ?? '');
	const tenant = body.tenant ? String(body.tenant) : undefined;
	const input = (body.input ?? {}) as Record<string, unknown>;

	if (!path) throw new Error('Missing path.');

	const handle = await ctx.getCorsair();
	const client = handle.resolveClient(tenant);
	const fn = navigateToEndpoint(client, path);
	if (!fn) throw new Error(`Could not find endpoint '${path}'.`);

	const started = Date.now();
	try {
		const result = await fn(input);
		return {
			ok: true,
			durationMs: Date.now() - started,
			result,
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return {
			ok: false,
			durationMs: Date.now() - started,
			error: message.slice(0, 4000),
		};
	}
};

export const runScript: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const code = String(body.code ?? '');
	const tenant = body.tenant ? String(body.tenant) : undefined;
	if (!code) throw new Error('Missing code.');

	const handle = await ctx.getCorsair();
	const client = handle.resolveClient(tenant);

	const AsyncFunction = Object.getPrototypeOf(async function () {})
		.constructor as new (
		...args: string[]
	) => (...fnArgs: unknown[]) => Promise<unknown>;
	const fn = new AsyncFunction('corsair', code);

	const started = Date.now();
	try {
		const result = await fn(client);
		return {
			ok: true,
			durationMs: Date.now() - started,
			result: result ?? null,
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return {
			ok: false,
			durationMs: Date.now() - started,
			error: message.slice(0, 4000),
		};
	}
};
