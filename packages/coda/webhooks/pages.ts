import type { CodaWebhooks } from '..';
import { receiveCodaEvents } from './receive';
import {
	CodaPageAuditEventSchema,
	createCodaMatch,
	isPageCreated,
	isPageUpdated,
} from './types';

const created: CodaWebhooks['pagesCreated'] = {
	match: createCodaMatch(isPageCreated),
	handler: (ctx, request) =>
		receiveCodaEvents(
			ctx,
			request,
			isPageCreated,
			CodaPageAuditEventSchema,
			'coda.webhook.pages.created',
		),
};

const updated: CodaWebhooks['pagesUpdated'] = {
	match: createCodaMatch(isPageUpdated),
	handler: (ctx, request) =>
		receiveCodaEvents(
			ctx,
			request,
			isPageUpdated,
			CodaPageAuditEventSchema,
			'coda.webhook.pages.updated',
		),
};

export const PageWebhooks = { created, updated };
