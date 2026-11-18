import { makeLapostaRequest } from '../client';
import type {
	CreateMemberInput,
	CreateMemberOutput,
	DeleteMemberInput,
	DeleteMemberOutput,
	GetMemberInput,
	GetMemberOutput,
	GetMembersInput,
	GetMembersOutput,
	UpdateMemberInput,
	UpdateMemberOutput,
} from './types';
import {
	CreateMemberOutputSchema,
	DeleteMemberOutputSchema,
	GetMemberOutputSchema,
	GetMembersOutputSchema,
	UpdateMemberOutputSchema,
} from './types';

export const members = {
	list: async (
		input: GetMembersInput,
		apiKey?: string,
	): Promise<GetMembersOutput> => {
		const raw = await makeLapostaRequest<unknown>('/member', apiKey, {
			method: 'GET',
			query: {
				list_id: input.list_id,
				state: input.state,
			},
		});
		return GetMembersOutputSchema.parse(raw);
	},

	get: async (
		input: GetMemberInput,
		apiKey?: string,
	): Promise<GetMemberOutput> => {
		const raw = await makeLapostaRequest<unknown>(
			`/member/${encodeURIComponent(input.member_id)}`,
			apiKey,
			{
				method: 'GET',
				query: { list_id: input.list_id },
			},
		);
		return GetMemberOutputSchema.parse(raw);
	},

	create: async (
		input: CreateMemberInput,
		apiKey?: string,
	): Promise<CreateMemberOutput> => {
		const raw = await makeLapostaRequest<unknown>('/member', apiKey, {
			method: 'POST',
			body: input as Record<string, unknown>,
		});
		return CreateMemberOutputSchema.parse(raw);
	},

	update: async (
		input: UpdateMemberInput,
		apiKey?: string,
	): Promise<UpdateMemberOutput> => {
		const { list_id, member_id, ...body } = input;
		const raw = await makeLapostaRequest<unknown>(
			`/member/${encodeURIComponent(member_id)}`,
			apiKey,
			{
				method: 'POST',
				query: { list_id },
				body: body as Record<string, unknown>,
			},
		);
		return UpdateMemberOutputSchema.parse(raw);
	},

	delete: async (
		input: DeleteMemberInput,
		apiKey?: string,
	): Promise<DeleteMemberOutput> => {
		const raw = await makeLapostaRequest<unknown>(
			`/member/${encodeURIComponent(input.member_id)}`,
			apiKey,
			{
				method: 'DELETE',
				query: { list_id: input.list_id },
			},
		);
		return DeleteMemberOutputSchema.parse(raw);
	},
};
