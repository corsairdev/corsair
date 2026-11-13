import type { z } from 'zod';
import { makeDopplerMarketingAutomationRequest } from '../client';
import type { DopplerMarketingAutomationContext } from '../index';
import {
	listInputSchemas,
	listOutputSchemas,
	subscriberInputSchemas,
	subscriberOutputSchemas,
} from './types';

const accountPath = (accountName: string) =>
	`/accounts/${encodeURIComponent(accountName)}/lists`;

export const lists = {
	list: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof listInputSchemas.list>,
	) => {
		const { accountName, ...query } = listInputSchemas.list.parse(raw);
		return listOutputSchemas.list.parse(
			await makeDopplerMarketingAutomationRequest(
				accountPath(accountName),
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	create: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof listInputSchemas.create>,
	) => {
		const { accountName, list, ...headers } =
			listInputSchemas.create.parse(raw);
		return listOutputSchemas.create.parse(
			await makeDopplerMarketingAutomationRequest(
				accountPath(accountName),
				ctx.key,
				{ method: 'POST', headers, body: list },
			),
		);
	},
	get: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof listInputSchemas.get>,
	) => {
		const { accountName, listId } = listInputSchemas.get.parse(raw);
		return listOutputSchemas.get.parse(
			await makeDopplerMarketingAutomationRequest(
				`${accountPath(accountName)}/${listId}`,
				ctx.key,
				{ method: 'GET' },
			),
		);
	},
	update: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof listInputSchemas.update>,
	) => {
		const { accountName, listId, list, ...headers } =
			listInputSchemas.update.parse(raw);
		return listOutputSchemas.update.parse(
			await makeDopplerMarketingAutomationRequest(
				`${accountPath(accountName)}/${listId}`,
				ctx.key,
				{ method: 'PUT', headers, body: list },
			),
		);
	},
	delete: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof listInputSchemas.delete>,
	) => {
		const { accountName, listId } = listInputSchemas.delete.parse(raw);
		return listOutputSchemas.delete.parse(
			await makeDopplerMarketingAutomationRequest(
				`${accountPath(accountName)}/${listId}`,
				ctx.key,
				{ method: 'DELETE' },
			),
		);
	},
} as const;

const subscribersPath = (accountName: string) =>
	`/accounts/${encodeURIComponent(accountName)}/subscribers`;
const listSubscribersPath = (accountName: string, listId: number) =>
	`${accountPath(accountName)}/${listId}/subscribers`;
const subscriberPath = (accountName: string, email: string) =>
	`${subscribersPath(accountName)}/${encodeURIComponent(email)}`;

export const subscribers = {
	list: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.list>,
	) => {
		const { accountName, ...query } = subscriberInputSchemas.list.parse(raw);
		return subscriberOutputSchemas.list.parse(
			await makeDopplerMarketingAutomationRequest(
				subscribersPath(accountName),
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	listForList: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.listForList>,
	) => {
		const { accountName, listId, ...query } =
			subscriberInputSchemas.listForList.parse(raw);
		return subscriberOutputSchemas.listForList.parse(
			await makeDopplerMarketingAutomationRequest(
				listSubscribersPath(accountName, listId),
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	get: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.get>,
	) => {
		const { accountName, email } = subscriberInputSchemas.get.parse(raw);
		return subscriberOutputSchemas.get.parse(
			await makeDopplerMarketingAutomationRequest(
				subscriberPath(accountName, email),
				ctx.key,
				{ method: 'GET' },
			),
		);
	},
	exists: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.exists>,
	) => {
		const { accountName, email } = subscriberInputSchemas.exists.parse(raw);
		return subscriberOutputSchemas.exists.parse(
			await makeDopplerMarketingAutomationRequest(
				subscriberPath(accountName, email),
				ctx.key,
				{ method: 'HEAD', responseType: 'void' },
			),
		);
	},
	create: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.create>,
	) => {
		const { accountName, subscriber, ...headers } =
			subscriberInputSchemas.create.parse(raw);
		return subscriberOutputSchemas.create.parse(
			await makeDopplerMarketingAutomationRequest(
				subscribersPath(accountName),
				ctx.key,
				{ method: 'POST', headers, body: subscriber },
			),
		);
	},
	associate: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.associate>,
	) => {
		const { accountName, listId, subscriber, allowReSubscription, ...headers } =
			subscriberInputSchemas.associate.parse(raw);
		return subscriberOutputSchemas.associate.parse(
			await makeDopplerMarketingAutomationRequest(
				listSubscribersPath(accountName, listId),
				ctx.key,
				{
					method: 'POST',
					headers,
					body: subscriber,
					query: { allowReSubscription },
				},
			),
		);
	},
	removeFromList: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.removeFromList>,
	) => {
		const { accountName, listId, email } =
			subscriberInputSchemas.removeFromList.parse(raw);
		return subscriberOutputSchemas.removeFromList.parse(
			await makeDopplerMarketingAutomationRequest(
				`${listSubscribersPath(accountName, listId)}/${encodeURIComponent(email)}`,
				ctx.key,
				{ method: 'DELETE' },
			),
		);
	},
	archive: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.archive>,
	) => {
		const { accountName, email } = subscriberInputSchemas.archive.parse(raw);
		return subscriberOutputSchemas.archive.parse(
			await makeDopplerMarketingAutomationRequest(
				`${subscriberPath(accountName, email)}/archive`,
				ctx.key,
				{ method: 'POST' },
			),
		);
	},
	listUnsubscribed: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.listUnsubscribed>,
	) => {
		const { accountName, ...query } =
			subscriberInputSchemas.listUnsubscribed.parse(raw);
		return subscriberOutputSchemas.listUnsubscribed.parse(
			await makeDopplerMarketingAutomationRequest(
				`/accounts/${encodeURIComponent(accountName)}/unsubscribed`,
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	unsubscribe: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.unsubscribe>,
	) => {
		const { accountName, subscriber } =
			subscriberInputSchemas.unsubscribe.parse(raw);
		return subscriberOutputSchemas.unsubscribe.parse(
			await makeDopplerMarketingAutomationRequest(
				`/accounts/${encodeURIComponent(accountName)}/unsubscribed`,
				ctx.key,
				{ method: 'POST', body: subscriber },
			),
		);
	},
	import: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.import>,
	) => {
		const { accountName, subscribers, ...headers } =
			subscriberInputSchemas.import.parse(raw);
		return subscriberOutputSchemas.import.parse(
			await makeDopplerMarketingAutomationRequest(
				`${subscribersPath(accountName)}/import`,
				ctx.key,
				{ method: 'POST', headers, body: subscribers },
			),
		);
	},
	importToList: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.importToList>,
	) => {
		const { accountName, listId, subscribers, ...headers } =
			subscriberInputSchemas.importToList.parse(raw);
		return subscriberOutputSchemas.importToList.parse(
			await makeDopplerMarketingAutomationRequest(
				`${listSubscribersPath(accountName, listId)}/import`,
				ctx.key,
				{ method: 'POST', headers, body: subscribers },
			),
		);
	},
	importCsv: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.importCsv>,
	) => {
		const { accountName, listId, Body, ...headers } =
			subscriberInputSchemas.importCsv.parse(raw);
		return subscriberOutputSchemas.importCsv.parse(
			await makeDopplerMarketingAutomationRequest(
				`${listSubscribersPath(accountName, listId)}/import-csv`,
				ctx.key,
				{ method: 'POST', headers, body: Body, mediaType: 'text/csv' },
			),
		);
	},
	doubleOptIn: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.doubleOptIn>,
	) => {
		const { accountName, listId, templateId, subscriber, ...headers } =
			subscriberInputSchemas.doubleOptIn.parse(raw);
		return subscriberOutputSchemas.doubleOptIn.parse(
			await makeDopplerMarketingAutomationRequest(
				`${listSubscribersPath(accountName, listId)}/doble-optin/${templateId}`,
				ctx.key,
				{ method: 'POST', headers, body: subscriber },
			),
		);
	},
	listByOrigin: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.listByOrigin>,
	) => {
		const { origin, ...query } = subscriberInputSchemas.listByOrigin.parse(raw);
		return subscriberOutputSchemas.listByOrigin.parse(
			await makeDopplerMarketingAutomationRequest(
				`/subscribers/${encodeURIComponent(origin)}`,
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	permissionsHistory: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.permissionsHistory>,
	) => {
		const { accountName, email, fieldName, ...query } =
			subscriberInputSchemas.permissionsHistory.parse(raw);
		return subscriberOutputSchemas.permissionsHistory.parse(
			await makeDopplerMarketingAutomationRequest(
				`${subscriberPath(accountName, email)}/permissions-history/${encodeURIComponent(fieldName)}`,
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	deliveries: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.deliveries>,
	) => {
		const { accountName, email, ...query } =
			subscriberInputSchemas.deliveries.parse(raw);
		return subscriberOutputSchemas.deliveries.parse(
			await makeDopplerMarketingAutomationRequest(
				`${subscriberPath(accountName, email)}/deliveries`,
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	importUnsubscribed: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof subscriberInputSchemas.importUnsubscribed>,
	) => {
		const { accountName, subscribers } =
			subscriberInputSchemas.importUnsubscribed.parse(raw);
		return subscriberOutputSchemas.importUnsubscribed.parse(
			await makeDopplerMarketingAutomationRequest(
				`/accounts/${encodeURIComponent(accountName)}/unsubscribed/import`,
				ctx.key,
				{ method: 'POST', body: subscribers },
			),
		);
	},
} as const;
