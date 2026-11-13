import { encodeGiftUpPathId, makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	Item,
	ItemsCreateInput,
	ItemsDeleteInput,
	ItemsGetInput,
	ItemsListInput,
	ItemsListResponse,
	ItemsUpdateInput,
	SuccessResponse,
} from './types';
import {
	ItemSchema,
	ItemsCreateInputSchema,
	ItemsDeleteInputSchema,
	ItemsGetInputSchema,
	ItemsListInputSchema,
	ItemsListResponseSchema,
	ItemsUpdateInputSchema,
	SuccessResponseSchema,
} from './types';

export const Items = {
	list: async (
		ctx: GiftUpContext,
		input: ItemsListInput,
	): Promise<ItemsListResponse> => {
		const parsed = ItemsListInputSchema.parse(input);
		const response = await makeGiftUpRequest<ItemsListResponse>(
			'/items',
			ctx.key,
			{
				method: 'GET',
				query: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return ItemsListResponseSchema.parse(response);
	},
	get: async (ctx: GiftUpContext, input: ItemsGetInput): Promise<Item> => {
		const parsed = ItemsGetInputSchema.parse(input);
		const response = await makeGiftUpRequest<Item>(
			`/items/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return ItemSchema.parse(response);
	},
	create: async (
		ctx: GiftUpContext,
		input: ItemsCreateInput,
	): Promise<Item> => {
		const parsed = ItemsCreateInputSchema.parse(input);
		const response = await makeGiftUpRequest<Item>('/items', ctx.key, {
			method: 'POST',
			body: parsed,
			testMode: ctx.options?.testMode,
		});
		return ItemSchema.parse(response);
	},
	update: async (
		ctx: GiftUpContext,
		input: ItemsUpdateInput,
	): Promise<Item> => {
		const parsed = ItemsUpdateInputSchema.parse(input);
		const response = await makeGiftUpRequest<Item>(
			`/items/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'PATCH',
				body: parsed.patch,
				testMode: ctx.options?.testMode,
			},
		);
		return ItemSchema.parse(response);
	},
	delete: async (
		ctx: GiftUpContext,
		input: ItemsDeleteInput,
	): Promise<SuccessResponse> => {
		const parsed = ItemsDeleteInputSchema.parse(input);
		const response = await makeGiftUpRequest<SuccessResponse>(
			`/items/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'DELETE',
				testMode: ctx.options?.testMode,
			},
		);
		return SuccessResponseSchema.parse(response);
	},
};
