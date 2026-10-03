import { z } from 'zod';
import type { DocusignAuthOptions } from '../client';
import { DocusignClient } from '../client';
import type { DocusignExecutionContext } from './types';

const DocusignCredentialsSchema = z.object({
	accessToken: z.string().min(1),
	accountId: z.string().min(1),
	baseUri: z.string().optional(),
});

const DocusignOptionsEnvelopeSchema = z.object({
	options: DocusignCredentialsSchema,
});

const DocusignRoutingSchema = z.object({
	accountId: z.string().min(1),
	baseUri: z.string().optional(),
});

const DocusignOptionsRoutingEnvelopeSchema = z.object({
	options: DocusignRoutingSchema,
});

/**
 * Tenant credential bundle produced by the plugin keyBuilder, which resolves
 * the active tenant's DocuSign credentials per request. Carried through the
 * runtime `key` channel (a string), so it is JSON-encoded.
 */
const DocusignKeyBundleSchema = DocusignCredentialsSchema;

function parseKeyBundle(key: string): DocusignAuthOptions | undefined {
	let parsed: unknown;
	try {
		parsed = JSON.parse(key);
	} catch {
		return undefined;
	}
	const bundle = DocusignKeyBundleSchema.safeParse(parsed);
	return bundle.success ? bundle.data : undefined;
}

export function resolveClient(
	contextOrClient: DocusignExecutionContext | unknown,
): DocusignClient {
	if (contextOrClient instanceof DocusignClient) {
		return contextOrClient;
	}
	if (typeof contextOrClient === 'object' && contextOrClient !== null) {
		if (
			'client' in contextOrClient &&
			contextOrClient.client instanceof DocusignClient
		) {
			return contextOrClient.client;
		}
		// Corsair runtime calls bound endpoints as fn({ ...ctx, key }, args).
		// `key` carries the active tenant's credentials resolved per request
		// by the plugin keyBuilder, so it wins over factory-wide options.
		if ('key' in contextOrClient && typeof contextOrClient.key === 'string') {
			const bundle = parseKeyBundle(contextOrClient.key);
			if (bundle) {
				return new DocusignClient(bundle);
			}
			if (contextOrClient.key.length > 0) {
				const routing =
					DocusignOptionsRoutingEnvelopeSchema.safeParse(contextOrClient);
				if (routing.success) {
					return new DocusignClient({
						...routing.data.options,
						accessToken: contextOrClient.key,
					});
				}
			}
		}
		// Factory/direct credentials carried on `ctx.options`.
		const enveloped = DocusignOptionsEnvelopeSchema.safeParse(contextOrClient);
		if (enveloped.success) {
			return new DocusignClient(enveloped.data.options);
		}
		const direct = DocusignCredentialsSchema.safeParse(contextOrClient);
		if (direct.success) {
			return new DocusignClient(direct.data);
		}
	}
	throw new Error(
		'Invalid execution context: DocuSign client is not initialized or accessible.',
	);
}
