import { encodeGiftUpPathId, makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	SuccessResponse,
	User,
	UsersDeleteInput,
	UsersGetInput,
	UsersInviteInput,
	UsersListInput,
	UsersListResponse,
	UsersUpdateInput,
} from './types';
import {
	SuccessResponseSchema,
	UserSchema,
	UsersDeleteInputSchema,
	UsersGetInputSchema,
	UsersInviteInputSchema,
	UsersListInputSchema,
	UsersListResponseSchema,
	UsersUpdateInputSchema,
} from './types';

export const Users = {
	list: async (
		ctx: GiftUpContext,
		input: UsersListInput,
	): Promise<UsersListResponse> => {
		UsersListInputSchema.parse(input);
		const response = await makeGiftUpRequest<UsersListResponse>(
			'/users',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return UsersListResponseSchema.parse(response);
	},
	get: async (ctx: GiftUpContext, input: UsersGetInput): Promise<User> => {
		const parsed = UsersGetInputSchema.parse(input);
		const response = await makeGiftUpRequest<User>(
			`/users/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return UserSchema.parse(response);
	},
	invite: async (
		ctx: GiftUpContext,
		input: UsersInviteInput,
	): Promise<User> => {
		const parsed = UsersInviteInputSchema.parse(input);
		const response = await makeGiftUpRequest<User>('/users', ctx.key, {
			method: 'POST',
			body: parsed,
			testMode: ctx.options?.testMode,
		});
		return UserSchema.parse(response);
	},
	update: async (
		ctx: GiftUpContext,
		input: UsersUpdateInput,
	): Promise<User> => {
		const parsed = UsersUpdateInputSchema.parse(input);
		const response = await makeGiftUpRequest<User>(
			`/users/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'PATCH',
				body: parsed.patch,
				testMode: ctx.options?.testMode,
			},
		);
		return UserSchema.parse(response);
	},
	delete: async (
		ctx: GiftUpContext,
		input: UsersDeleteInput,
	): Promise<SuccessResponse> => {
		const parsed = UsersDeleteInputSchema.parse(input);
		const response = await makeGiftUpRequest<SuccessResponse>(
			`/users/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'DELETE',
				testMode: ctx.options?.testMode,
			},
		);
		return SuccessResponseSchema.parse(response ?? { success: true });
	},
};
