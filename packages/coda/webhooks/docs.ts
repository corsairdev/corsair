import type { CodaWebhooks } from '..';
import { saveDocs } from '../endpoints/persist';
import { receiveCodaEvents } from './receive';
import {
	CodaDocAuditEventSchema,
	createCodaMatch,
	isDocCreated,
	isDocDeleted,
} from './types';

const created: CodaWebhooks['docsCreated'] = {
	match: createCodaMatch(isDocCreated),
	handler: async (ctx, request) => {
		const response = await receiveCodaEvents(
			ctx,
			request,
			isDocCreated,
			CodaDocAuditEventSchema,
			'coda.webhook.docs.created',
		);
		await saveDocs(
			ctx,
			(response.data?.events ?? []).map((event) => event.entity.doc),
		);
		return response;
	},
};

const deleted: CodaWebhooks['docsDeleted'] = {
	match: createCodaMatch(isDocDeleted),
	handler: async (ctx, request) => {
		const response = await receiveCodaEvents(
			ctx,
			request,
			isDocDeleted,
			CodaDocAuditEventSchema,
			'coda.webhook.docs.deleted',
		);
		for (const event of response.data?.events ?? []) {
			try {
				await ctx.db.documents?.deleteByEntityId(event.entity.doc.id);
			} catch (error) {
				console.warn(
					`Failed to remove Coda doc ${event.entity.doc.id}:`,
					error,
				);
			}
		}
		return response;
	},
};

export const DocWebhooks = { created, deleted };
