import { z } from 'zod';
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
		// Corsair runtime calls bound endpoints as fn({ ...ctx, key }, args),
		// where ctx.options carries the plugin options (credentials).
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
