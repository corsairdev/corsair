import { encodeGiftUpPathId, makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	GiftCard,
	GiftCardsGetInput,
	GiftCardsListInput,
	GiftCardsListResponse,
	GiftCardsReactivateInput,
	GiftCardsReactivateResponse,
	GiftCardsRedeemInFullInput,
	GiftCardsRedeemInFullResponse,
	GiftCardsRedeemInput,
	GiftCardsRedeemResponse,
	GiftCardsTopUpInput,
	GiftCardsTopUpResponse,
	GiftCardsTransferBalancesInput,
	GiftCardsTransferBalancesResponse,
	GiftCardsUndoRedemptionInput,
	GiftCardsUndoRedemptionResponse,
	GiftCardsUpdateInput,
	GiftCardsVoidInput,
	GiftCardsVoidResponse,
} from './types';
import {
	GiftCardSchema,
	GiftCardsGetInputSchema,
	GiftCardsListInputSchema,
	GiftCardsListResponseSchema,
	GiftCardsReactivateInputSchema,
	GiftCardsReactivateResponseSchema,
	GiftCardsRedeemInFullInputSchema,
	GiftCardsRedeemInFullResponseSchema,
	GiftCardsRedeemInputSchema,
	GiftCardsRedeemResponseSchema,
	GiftCardsTopUpInputSchema,
	GiftCardsTopUpResponseSchema,
	GiftCardsTransferBalancesInputSchema,
	GiftCardsTransferBalancesResponseSchema,
	GiftCardsUndoRedemptionInputSchema,
	GiftCardsUndoRedemptionResponseSchema,
	GiftCardsUpdateInputSchema,
	GiftCardsVoidInputSchema,
	GiftCardsVoidResponseSchema,
} from './types';

export const GiftCards = {
	list: async (
		ctx: GiftUpContext,
		input: GiftCardsListInput,
	): Promise<GiftCardsListResponse> => {
		const parsed = GiftCardsListInputSchema.parse(input);
		const response = await makeGiftUpRequest<GiftCardsListResponse>(
			'/gift-cards',
			ctx.key,
			{
				method: 'GET',
				query: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardsListResponseSchema.parse(response);
	},
	get: async (
		ctx: GiftUpContext,
		input: GiftCardsGetInput,
	): Promise<GiftCard> => {
		const parsed = GiftCardsGetInputSchema.parse(input);
		const response = await makeGiftUpRequest<GiftCard>(
			`/gift-cards/${encodeGiftUpPathId(parsed.code)}`,
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardSchema.parse(response);
	},
	update: async (
		ctx: GiftUpContext,
		input: GiftCardsUpdateInput,
	): Promise<GiftCard> => {
		const parsed = GiftCardsUpdateInputSchema.parse(input);
		const response = await makeGiftUpRequest<GiftCard>(
			`/gift-cards/${encodeGiftUpPathId(parsed.code)}`,
			ctx.key,
			{
				method: 'PATCH',
				body: parsed.patch,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardSchema.parse(response);
	},
	reactivate: async (
		ctx: GiftUpContext,
		input: GiftCardsReactivateInput,
	): Promise<GiftCardsReactivateResponse> => {
		const parsed = GiftCardsReactivateInputSchema.parse(input);
		const { code, ...body } = parsed;
		const response = await makeGiftUpRequest<GiftCardsReactivateResponse>(
			`/gift-cards/${encodeGiftUpPathId(code)}/reactivate`,
			ctx.key,
			{
				method: 'POST',
				body,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardsReactivateResponseSchema.parse(response);
	},
	void: async (
		ctx: GiftUpContext,
		input: GiftCardsVoidInput,
	): Promise<GiftCardsVoidResponse> => {
		const parsed = GiftCardsVoidInputSchema.parse(input);
		const { code, ...body } = parsed;
		const response = await makeGiftUpRequest<GiftCardsVoidResponse>(
			`/gift-cards/${encodeGiftUpPathId(code)}/void`,
			ctx.key,
			{
				method: 'POST',
				body,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardsVoidResponseSchema.parse(response);
	},
	topUp: async (
		ctx: GiftUpContext,
		input: GiftCardsTopUpInput,
	): Promise<GiftCardsTopUpResponse> => {
		const parsed = GiftCardsTopUpInputSchema.parse(input);
		const { code, ...body } = parsed;
		const response = await makeGiftUpRequest<GiftCardsTopUpResponse>(
			`/gift-cards/${encodeGiftUpPathId(code)}/top-up`,
			ctx.key,
			{
				method: 'POST',
				body,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardsTopUpResponseSchema.parse(response);
	},
	redeem: async (
		ctx: GiftUpContext,
		input: GiftCardsRedeemInput,
	): Promise<GiftCardsRedeemResponse> => {
		const parsed = GiftCardsRedeemInputSchema.parse(input);
		const { code, ...body } = parsed;
		const response = await makeGiftUpRequest<GiftCardsRedeemResponse>(
			`/gift-cards/${encodeGiftUpPathId(code)}/redeem`,
			ctx.key,
			{
				method: 'POST',
				body,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardsRedeemResponseSchema.parse(response);
	},
	redeemInFull: async (
		ctx: GiftUpContext,
		input: GiftCardsRedeemInFullInput,
	): Promise<GiftCardsRedeemInFullResponse> => {
		const parsed = GiftCardsRedeemInFullInputSchema.parse(input);
		const { code, ...body } = parsed;
		const response = await makeGiftUpRequest<GiftCardsRedeemInFullResponse>(
			`/gift-cards/${encodeGiftUpPathId(code)}/redeem-in-full`,
			ctx.key,
			{
				method: 'POST',
				body,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardsRedeemInFullResponseSchema.parse(response);
	},
	undoRedemption: async (
		ctx: GiftUpContext,
		input: GiftCardsUndoRedemptionInput,
	): Promise<GiftCardsUndoRedemptionResponse> => {
		const parsed = GiftCardsUndoRedemptionInputSchema.parse(input);
		const { code, ...body } = parsed;
		const response = await makeGiftUpRequest<GiftCardsUndoRedemptionResponse>(
			`/gift-cards/${encodeGiftUpPathId(code)}/undo-redemption`,
			ctx.key,
			{
				method: 'POST',
				body,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardsUndoRedemptionResponseSchema.parse(response);
	},
	transferBalances: async (
		ctx: GiftUpContext,
		input: GiftCardsTransferBalancesInput,
	): Promise<GiftCardsTransferBalancesResponse> => {
		const parsed = GiftCardsTransferBalancesInputSchema.parse(input);
		const response = await makeGiftUpRequest<GiftCardsTransferBalancesResponse>(
			'/gift-cards/transfer-balances',
			ctx.key,
			{
				method: 'POST',
				body: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardsTransferBalancesResponseSchema.parse(response);
	},
};
