import { encodeGiftUpPathId, makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	GroupsCreateInput,
	GroupsDeleteInput,
	GroupsGetInput,
	GroupsListInput,
	GroupsListResponse,
	GroupsUpdateInput,
	GroupsWriteResponse,
	ItemGroup,
	SuccessResponse,
} from './types';
import {
	GroupsCreateInputSchema,
	GroupsDeleteInputSchema,
	GroupsGetInputSchema,
	GroupsListInputSchema,
	GroupsListResponseSchema,
	GroupsUpdateInputSchema,
	GroupsWriteResponseSchema,
	ItemGroupSchema,
	SuccessResponseSchema,
} from './types';

export const Groups = {
	list: async (
		ctx: GiftUpContext,
		input: GroupsListInput,
	): Promise<GroupsListResponse> => {
		GroupsListInputSchema.parse(input);
		const response = await makeGiftUpRequest<GroupsListResponse>(
			'/groups',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return GroupsListResponseSchema.parse(response);
	},
	get: async (
		ctx: GiftUpContext,
		input: GroupsGetInput,
	): Promise<ItemGroup> => {
		const parsed = GroupsGetInputSchema.parse(input);
		const response = await makeGiftUpRequest<ItemGroup>(
			`/groups/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return ItemGroupSchema.parse(response);
	},
	create: async (
		ctx: GiftUpContext,
		input: GroupsCreateInput,
	): Promise<GroupsWriteResponse> => {
		const parsed = GroupsCreateInputSchema.parse(input);
		const response = await makeGiftUpRequest<GroupsWriteResponse>(
			'/groups',
			ctx.key,
			{
				method: 'POST',
				body: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return GroupsWriteResponseSchema.parse(response);
	},
	update: async (
		ctx: GiftUpContext,
		input: GroupsUpdateInput,
	): Promise<GroupsWriteResponse> => {
		const parsed = GroupsUpdateInputSchema.parse(input);
		const response = await makeGiftUpRequest<GroupsWriteResponse>(
			`/groups/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'PATCH',
				body: parsed.patch,
				testMode: ctx.options?.testMode,
			},
		);
		return GroupsWriteResponseSchema.parse(response);
	},
	delete: async (
		ctx: GiftUpContext,
		input: GroupsDeleteInput,
	): Promise<SuccessResponse> => {
		const parsed = GroupsDeleteInputSchema.parse(input);
		const response = await makeGiftUpRequest<SuccessResponse>(
			`/groups/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'DELETE',
				testMode: ctx.options?.testMode,
			},
		);
		return SuccessResponseSchema.parse(response);
	},
};
