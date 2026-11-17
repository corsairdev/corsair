import { logEventFromContext } from 'corsair/core';
import type { ThanksIoContext } from '..';
import type { ThanksIoRequest } from '../client';
import { makeThanksIoImageRequest, makeThanksIoRequest } from '../client';
import type { ThanksIoEndpointInputs, ThanksIoEndpointOutputs } from './types';
import {
	ThanksIoEndpointInputSchemas as Inputs,
	ThanksIoEndpointOutputSchemas as Outputs,
} from './types';

type Operation = keyof typeof Inputs;

function endpoint<K extends Operation>(
	key: K,
	event: string,
	build: (input: ThanksIoEndpointInputs[K]) => ThanksIoRequest,
) {
	return async (
		ctx: ThanksIoContext,
		raw: ThanksIoEndpointInputs[K],
	): Promise<ThanksIoEndpointOutputs[K]> => {
		// The input type is inferred from this keyed schema. TypeScript loses the
		// key-to-schema correlation on indexed access, while parse validates it.
		const input = Inputs[key].parse(raw ?? {}) as ThanksIoEndpointInputs[K];
		// The output type is inferred from the matching keyed schema. Indexed
		// access loses that correlation, but parse validates the untrusted response.
		const result = Outputs[key].parse(
			await makeThanksIoRequest(ctx.key, build(input)),
		) as ThanksIoEndpointOutputs[K];
		await logEventFromContext(ctx, `thanksio.${event}`, {}, 'completed');
		return result;
	};
}

export const thanksIoEndpointsNested = {
	recipients: {
		get: endpoint('recipientsGet', 'recipients.get', ({ recipientId }) => ({
			method: 'GET',
			path: `/recipients/${encodeURIComponent(recipientId)}`,
		})),
		update: endpoint(
			'recipientsUpdate',
			'recipients.update',
			({ recipientId, body }) => ({
				method: 'PUT',
				path: `/recipients/${encodeURIComponent(recipientId)}`,
				body,
			}),
		),
		delete: endpoint(
			'recipientsDelete',
			'recipients.delete',
			({ recipientId }) => ({
				method: 'DELETE',
				path: `/recipients/${encodeURIComponent(recipientId)}`,
			}),
		),
		create: endpoint('recipientsCreate', 'recipients.create', ({ body }) => ({
			method: 'POST',
			path: '/recipients',
			body,
		})),
		createMultiple: endpoint(
			'recipientsCreateMultiple',
			'recipients.createMultiple',
			({ body }) => ({
				method: 'POST',
				path: '/recipients-utils/create-multiple',
				body,
			}),
		),
		deleteByAddress: endpoint(
			'recipientsDeleteByAddress',
			'recipients.deleteByAddress',
			({ body }) => ({
				method: 'POST',
				path: '/recipients-utils/delete-by-address',
				body,
			}),
		),
	},
	mailingLists: {
		list: endpoint('mailingListsList', 'mailingLists.list', (query) => ({
			method: 'GET',
			path: '/mailing-lists/',
			query,
		})),
		create: endpoint(
			'mailingListsCreate',
			'mailingLists.create',
			({ body }) => ({ method: 'POST', path: '/mailing-lists/', body }),
		),
		get: endpoint(
			'mailingListsGet',
			'mailingLists.get',
			({ mailingListId }) => ({
				method: 'GET',
				path: `/mailing-lists/${encodeURIComponent(mailingListId)}`,
			}),
		),
		delete: endpoint(
			'mailingListsDelete',
			'mailingLists.delete',
			({ mailingListId }) => ({
				method: 'DELETE',
				path: `/mailing-lists/${encodeURIComponent(mailingListId)}`,
			}),
		),
		listRecipients: endpoint(
			'mailingListsListRecipients',
			'mailingLists.listRecipients',
			({ mailingListId, ...query }) => ({
				method: 'GET',
				path: `/mailing-lists-utils/recipients/${encodeURIComponent(mailingListId)}`,
				query,
			}),
		),
		buyRadiusSearch: endpoint(
			'mailingListsBuyRadiusSearch',
			'mailingLists.buyRadiusSearch',
			({ body }) => ({
				method: 'POST',
				path: '/mailing-lists-utils/buy-radius-search',
				body,
			}),
		),
		countRadiusSearch: endpoint(
			'mailingListsCountRadiusSearch',
			'mailingLists.countRadiusSearch',
			({ body }) => ({
				method: 'POST',
				path: '/mailing-lists-utils/count-radius-search',
				body,
			}),
		),
	},
	webhookDestinations: {
		list: endpoint(
			'webhookDestinationsList',
			'webhookDestinations.list',
			(query) => ({ method: 'GET', path: '/webhooks', query }),
		),
		create: endpoint(
			'webhookDestinationsCreate',
			'webhookDestinations.create',
			({ body }) => ({ method: 'POST', path: '/webhooks', body }),
		),
		update: endpoint(
			'webhookDestinationsUpdate',
			'webhookDestinations.update',
			({ webhookId, body }) => ({
				method: 'PUT',
				path: `/webhooks/${encodeURIComponent(webhookId)}`,
				body,
			}),
		),
		delete: endpoint(
			'webhookDestinationsDelete',
			'webhookDestinations.delete',
			({ webhookId }) => ({
				method: 'DELETE',
				path: `/webhooks/${encodeURIComponent(webhookId)}`,
			}),
		),
	},
	subAccounts: {
		list: endpoint('subAccountsList', 'subAccounts.list', () => ({
			method: 'GET',
			path: '/sub-accounts/',
		})),
		create: endpoint('subAccountsCreate', 'subAccounts.create', ({ body }) => ({
			method: 'POST',
			path: '/sub-accounts/',
			body,
		})),
		get: endpoint('subAccountsGet', 'subAccounts.get', ({ subAccountId }) => ({
			method: 'GET',
			path: `/sub-accounts/${encodeURIComponent(subAccountId)}`,
		})),
		update: endpoint(
			'subAccountsUpdate',
			'subAccounts.update',
			({ subAccountId, body }) => ({
				method: 'PUT',
				path: `/sub-accounts/${encodeURIComponent(subAccountId)}`,
				body,
			}),
		),
		delete: endpoint(
			'subAccountsDelete',
			'subAccounts.delete',
			({ subAccountId }) => ({
				method: 'DELETE',
				path: `/sub-accounts/${encodeURIComponent(subAccountId)}`,
			}),
		),
	},
	messageTemplates: {
		list: endpoint(
			'messageTemplatesList',
			'messageTemplates.list',
			(query) => ({ method: 'GET', path: '/message-templates/', query }),
		),
		create: endpoint(
			'messageTemplatesCreate',
			'messageTemplates.create',
			({ body }) => ({ method: 'POST', path: '/message-templates/', body }),
		),
		get: endpoint(
			'messageTemplatesGet',
			'messageTemplates.get',
			({ messageTemplateId }) => ({
				method: 'GET',
				path: `/message-templates/${encodeURIComponent(messageTemplateId)}`,
			}),
		),
		update: endpoint(
			'messageTemplatesUpdate',
			'messageTemplates.update',
			({ messageTemplateId, body }) => ({
				method: 'PATCH',
				path: `/message-templates/${encodeURIComponent(messageTemplateId)}`,
				body,
			}),
		),
		delete: endpoint(
			'messageTemplatesDelete',
			'messageTemplates.delete',
			({ messageTemplateId }) => ({
				method: 'DELETE',
				path: `/message-templates/${encodeURIComponent(messageTemplateId)}`,
			}),
		),
	},
	imageTemplates: {
		list: endpoint('imageTemplatesList', 'imageTemplates.list', (query) => ({
			method: 'GET',
			path: '/image-templates/',
			query,
		})),
	},
	creatives: {
		list: endpoint(
			'creativesList',
			'creatives.list',
			({ complete_only, include_hidden, ...query }) => ({
				method: 'GET',
				path: '/creatives/',
				query: {
					...query,
					complete_only:
						complete_only === undefined ? undefined : Number(complete_only),
					include_hidden:
						include_hidden === undefined ? undefined : Number(include_hidden),
				},
			}),
		),
		get: endpoint('creativesGet', 'creatives.get', ({ creativeId }) => ({
			method: 'GET',
			path: `/creatives/${encodeURIComponent(creativeId)}`,
		})),
	},
	handwritingStyles: {
		list: endpoint('handwritingStylesList', 'handwritingStyles.list', () => ({
			method: 'GET',
			path: '/handwriting-styles',
		})),
	},
	giftcardBrands: {
		list: endpoint('giftcardBrandsList', 'giftcardBrands.list', () => ({
			method: 'GET',
			path: '/giftcard-brands',
		})),
		listFlat: endpoint(
			'giftcardBrandsListFlat',
			'giftcardBrands.listFlat',
			() => ({ method: 'GET', path: '/giftcard-brands-list' }),
		),
	},
	orders: {
		list: endpoint('ordersList', 'orders.list', (query) => ({
			method: 'GET',
			path: '/orders/list',
			query,
		})),
		track: endpoint('ordersTrack', 'orders.track', ({ orderId }) => ({
			method: 'GET',
			path: `/orders/${encodeURIComponent(orderId)}/track`,
		})),
		listItems: endpoint(
			'ordersListItems',
			'orders.listItems',
			({ orderId, ...query }) => ({
				method: 'GET',
				path: `/orders/${encodeURIComponent(orderId)}/items`,
				query,
			}),
		),
		cancel: endpoint('ordersCancel', 'orders.cancel', ({ orderId }) => ({
			method: 'PUT',
			path: `/orders/${encodeURIComponent(orderId)}/cancel`,
		})),
		replay: endpoint('ordersReplay', 'orders.replay', ({ orderId, body }) => ({
			method: 'POST',
			path: `/orders/${encodeURIComponent(orderId)}/replay`,
			body,
		})),
	},
	orderItems: {
		invalidateGiftcard: endpoint(
			'orderItemsInvalidateGiftcard',
			'orderItems.invalidateGiftcard',
			({ orderItemId }) => ({
				method: 'PUT',
				path: `/order-items/${encodeURIComponent(orderItemId)}/invalidate-giftcard`,
			}),
		),
	},
	send: {
		postcard: endpoint('sendPostcard', 'send.postcard', ({ body }) => ({
			method: 'POST',
			path: '/send/postcard',
			body,
		})),
		magnacard: endpoint('sendMagnacard', 'send.magnacard', ({ body }) => ({
			method: 'POST',
			path: '/send/magnacard',
			body,
		})),
		windowedLetter: endpoint(
			'sendWindowedLetter',
			'send.windowedLetter',
			({ body }) => ({ method: 'POST', path: '/send/windowedletter', body }),
		),
		windowlessLetter: endpoint(
			'sendWindowlessLetter',
			'send.windowlessLetter',
			({ body }) => ({ method: 'POST', path: '/send/windowlessletter', body }),
		),
		notecard: endpoint('sendNotecard', 'send.notecard', ({ body }) => ({
			method: 'POST',
			path: '/send/notecard',
			body,
		})),
		giftcard: endpoint('sendGiftcard', 'send.giftcard', ({ body }) => ({
			method: 'POST',
			path: '/send/giftcard',
			body,
		})),
	},
	estimate: {
		postcard: endpoint('estimatePostcard', 'estimate.postcard', ({ body }) => ({
			method: 'POST',
			path: '/estimate/postcard',
			body,
		})),
		magnacard: endpoint(
			'estimateMagnacard',
			'estimate.magnacard',
			({ body }) => ({ method: 'POST', path: '/estimate/magnacard', body }),
		),
		windowedLetter: endpoint(
			'estimateWindowedLetter',
			'estimate.windowedLetter',
			({ body }) => ({
				method: 'POST',
				path: '/estimate/windowedletter',
				body,
			}),
		),
		windowlessLetter: endpoint(
			'estimateWindowlessLetter',
			'estimate.windowlessLetter',
			({ body }) => ({
				method: 'POST',
				path: '/estimate/windowlessletter',
				body,
			}),
		),
		notecard: endpoint('estimateNotecard', 'estimate.notecard', ({ body }) => ({
			method: 'POST',
			path: '/estimate/notecard',
			body,
		})),
		giftcard: endpoint('estimateGiftcard', 'estimate.giftcard', ({ body }) => ({
			method: 'POST',
			path: '/estimate/giftcard',
			body,
		})),
	},
	imageBuilder: {
		create: async (
			ctx: ThanksIoContext,
			raw: ThanksIoEndpointInputs['imageBuilderCreate'],
		): Promise<ThanksIoEndpointOutputs['imageBuilderCreate']> => {
			const input = Inputs.imageBuilderCreate.parse(raw);
			const result = Outputs.imageBuilderCreate.parse(
				await makeThanksIoImageRequest(ctx.key, input),
			);
			await logEventFromContext(
				ctx,
				'thanksio.imageBuilder.create',
				{},
				'completed',
			);
			return result;
		},
	},
} as const;
