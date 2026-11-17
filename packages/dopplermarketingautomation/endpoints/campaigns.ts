import type { z } from 'zod';
import { makeDopplerMarketingAutomationRequest } from '../client';
import type { DopplerMarketingAutomationContext } from '../index';
import {
	campaignInputSchemas as input,
	campaignOutputSchemas as output,
} from './campaign-types';

const collection = (account: string) =>
	`/accounts/${encodeURIComponent(account)}/campaigns`;
const item = (account: string, id: number) => `${collection(account)}/${id}`;

export const campaigns = {
	list: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.list>,
	) => {
		const { accountName, ...query } = input.list.parse(raw);
		return output.list.parse(
			await makeDopplerMarketingAutomationRequest(
				collection(accountName),
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	create: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.create>,
	) => {
		const { accountName, campaign } = input.create.parse(raw);
		return output.create.parse(
			await makeDopplerMarketingAutomationRequest(
				collection(accountName),
				ctx.key,
				{ method: 'POST', body: campaign },
			),
		);
	},
	get: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.get>,
	) => {
		const { accountName, campaignId } = input.get.parse(raw);
		return output.get.parse(
			await makeDopplerMarketingAutomationRequest(
				item(accountName, campaignId),
				ctx.key,
				{ method: 'GET' },
			),
		);
	},
	update: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.update>,
	) => {
		const { accountName, campaignId, campaign } = input.update.parse(raw);
		return output.update.parse(
			await makeDopplerMarketingAutomationRequest(
				item(accountName, campaignId),
				ctx.key,
				{ method: 'PUT', body: campaign },
			),
		);
	},
	delete: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.delete>,
	) => {
		const { accountName, campaignId } = input.delete.parse(raw);
		return output.delete.parse(
			await makeDopplerMarketingAutomationRequest(
				item(accountName, campaignId),
				ctx.key,
				{ method: 'DELETE' },
			),
		);
	},
	approve: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.approve>,
	) => {
		const { accountName, campaignId } = input.approve.parse(raw);
		return output.approve.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/approvals`,
				ctx.key,
				{ method: 'POST' },
			),
		);
	},
	deliveries: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.deliveries>,
	) => {
		const { accountName, campaignId, ...query } = input.deliveries.parse(raw);
		return output.deliveries.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/deliveries`,
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	preview: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.preview>,
	) => {
		const {
			accountName,
			campaignId,
			Accept = 'text/html',
		} = input.preview.parse(raw);
		return output.preview.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/preview`,
				ctx.key,
				{
					method: 'GET',
					headers: { Accept },
					responseType:
						Accept.startsWith('image/') && Accept !== 'image/svg+xml'
							? 'bytes'
							: 'text',
				},
			),
		);
	},
	resultsSummary: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.resultsSummary>,
	) => {
		const { accountName, campaignId } = input.resultsSummary.parse(raw);
		return output.resultsSummary.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/results-summary`,
				ctx.key,
				{ method: 'GET' },
			),
		);
	},
	unsubscribed: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.unsubscribed>,
	) => {
		const { accountName, campaignId, ...query } = input.unsubscribed.parse(raw);
		return output.unsubscribed.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/unsubscribed`,
				ctx.key,
				{ method: 'GET', query },
			),
		);
	},
	getContent: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.getContent>,
	) => {
		const { accountName, campaignId } = input.getContent.parse(raw);
		return output.getContent.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/content`,
				ctx.key,
				{
					method: 'GET',
					headers: { Accept: 'text/html' },
					responseType: 'text',
				},
			),
		);
	},
	updateContent: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.updateContent>,
	) => {
		const { accountName, campaignId, Body } = input.updateContent.parse(raw);
		return output.updateContent.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/content`,
				ctx.key,
				{ method: 'PUT', body: Body, mediaType: 'text/html' },
			),
		);
	},
	getTextAlternative: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.getTextAlternative>,
	) => {
		const { accountName, campaignId } = input.getTextAlternative.parse(raw);
		return output.getTextAlternative.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/content/text-alternative`,
				ctx.key,
				{ method: 'GET' },
			),
		);
	},
	updateTextAlternative: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.updateTextAlternative>,
	) => {
		const { accountName, campaignId, textAlternativeContent } =
			input.updateTextAlternative.parse(raw);
		return output.updateTextAlternative.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/content/text-alternative`,
				ctx.key,
				{ method: 'PUT', body: textAlternativeContent },
			),
		);
	},
	deleteTextAlternative: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.deleteTextAlternative>,
	) => {
		const { accountName, campaignId } = input.deleteTextAlternative.parse(raw);
		return output.deleteTextAlternative.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/content/text-alternative`,
				ctx.key,
				{ method: 'DELETE' },
			),
		);
	},
	getRecipients: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.getRecipients>,
	) => {
		const { accountName, campaignId } = input.getRecipients.parse(raw);
		return output.getRecipients.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/recipients`,
				ctx.key,
				{ method: 'GET' },
			),
		);
	},
	updateRecipients: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.updateRecipients>,
	) => {
		const { accountName, campaignId, recipients } =
			input.updateRecipients.parse(raw);
		return output.updateRecipients.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/recipients`,
				ctx.key,
				{ method: 'PUT', body: recipients },
			),
		);
	},
	createShipping: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.createShipping>,
	) => {
		const { accountName, campaignId, shipping } =
			input.createShipping.parse(raw);
		return output.createShipping.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/shippings`,
				ctx.key,
				{ method: 'POST', body: shipping },
			),
		);
	},
	getShipping: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.getShipping>,
	) => {
		const { accountName, campaignId, shippingId } =
			input.getShipping.parse(raw);
		return output.getShipping.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/shippings/${encodeURIComponent(shippingId)}`,
				ctx.key,
				{ method: 'GET' },
			),
		);
	},
	deleteShipping: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.deleteShipping>,
	) => {
		const { accountName, campaignId, shippingId } =
			input.deleteShipping.parse(raw);
		return output.deleteShipping.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/shippings/${encodeURIComponent(shippingId)}`,
				ctx.key,
				{ method: 'DELETE' },
			),
		);
	},
	getSocial: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.getSocial>,
	) => {
		const { accountName, campaignId } = input.getSocial.parse(raw);
		return output.getSocial.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/social-media`,
				ctx.key,
				{ method: 'GET' },
			),
		);
	},
	updateSocial: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.updateSocial>,
	) => {
		const { accountName, campaignId, socialMediaPreferences } =
			input.updateSocial.parse(raw);
		return output.updateSocial.parse(
			await makeDopplerMarketingAutomationRequest(
				`${item(accountName, campaignId)}/social-media`,
				ctx.key,
				{ method: 'PUT', body: socialMediaPreferences },
			),
		);
	},
} as const;
