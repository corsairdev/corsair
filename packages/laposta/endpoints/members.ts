import { makeLapostaRequest } from '../client';
import type { LapostaPluginContext } from '../index';
import type {
	CreateMemberInput,
	CreateMemberOutput,
	DeleteMemberInput,
	DeleteMemberOutput,
	GetMemberHistoryInput,
	GetMemberHistoryOutput,
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
	GetMemberHistoryOutputSchema,
	GetMemberOutputSchema,
	GetMembersOutputSchema,
	LapostaEndpointInputSchemas,
	UpdateMemberOutputSchema,
} from './types';

export const members = {
	list: async (
		ctx: LapostaPluginContext,
		input: GetMembersInput,
	): Promise<GetMembersOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['members.list'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/member', ctx.key, {
			method: 'GET',
			query: {
				list_id: parsedInput.list_id,
				state: parsedInput.state,
				limit: parsedInput.limit,
				cursor: parsedInput.cursor,
				order_by: parsedInput.order_by,
				order: parsedInput.order,
				search: parsedInput.search,
				label: parsedInput.label,
			},
		});
		return GetMembersOutputSchema.parse(raw);
	},

	get: async (
		ctx: LapostaPluginContext,
		input: GetMemberInput,
	): Promise<GetMemberOutput> => {
		const parsedInput = LapostaEndpointInputSchemas['members.get'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/member/${encodeMemberId(parsedInput.member_id)}`,
			ctx.key,
			{
				method: 'GET',
				query: { list_id: parsedInput.list_id },
			},
		);
		return GetMemberOutputSchema.parse(raw);
	},

	create: async (
		ctx: LapostaPluginContext,
		input: CreateMemberInput,
	): Promise<CreateMemberOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['members.create'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/member', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return CreateMemberOutputSchema.parse(raw);
	},

	update: async (
		ctx: LapostaPluginContext,
		input: UpdateMemberInput,
	): Promise<UpdateMemberOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['members.update'].parse(input);
		const { list_id, member_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/member/${encodeMemberId(member_id)}`,
			ctx.key,
			{
				method: 'POST',
				query: { list_id },
				body,
			},
		);
		return UpdateMemberOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LapostaPluginContext,
		input: DeleteMemberInput,
	): Promise<DeleteMemberOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['members.delete'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/member/${encodeMemberId(parsedInput.member_id)}`,
			ctx.key,
			{
				method: 'DELETE',
				query: { list_id: parsedInput.list_id },
			},
		);
		return DeleteMemberOutputSchema.parse(raw);
	},

	history: async (
		ctx: LapostaPluginContext,
		input: GetMemberHistoryInput,
	): Promise<GetMemberHistoryOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['members.history'].parse(input);
		const { list_id, member_id, ...query } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/member/${encodeMemberId(member_id)}/history`,
			ctx.key,
			{ method: 'GET', query: { list_id, ...query } },
		);
		return GetMemberHistoryOutputSchema.parse(raw);
	},
};

function encodeMemberId(memberId: string): string {
	return encodeURIComponent(memberId).replace(/%2B/gi, '%252B');
}
