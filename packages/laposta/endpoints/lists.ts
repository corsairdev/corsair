import { makeLapostaRequest } from '../client';
import type { LapostaPluginContext } from '../index';
import type {
	CreateListInput,
	CreateListOutput,
	DeleteListInput,
	DeleteListOutput,
	GetListInput,
	GetListOutput,
	GetListsInput,
	GetListsOutput,
	ListMembersInput,
	ListMembersOutput,
	PurgeListMembersInput,
	PurgeListMembersOutput,
	UpdateListInput,
	UpdateListOutput,
} from './types';
import {
	CreateListOutputSchema,
	DeleteListOutputSchema,
	GetListOutputSchema,
	GetListsOutputSchema,
	LapostaEndpointInputSchemas,
	ListMembersOutputSchema,
	PurgeListMembersOutputSchema,
	UpdateListOutputSchema,
} from './types';

export const lists = {
	list: async (
		ctx: LapostaPluginContext,
		input: GetListsInput,
	): Promise<GetListsOutput> => {
		LapostaEndpointInputSchemas['lists.list'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/list', ctx.key, {
			method: 'GET',
		});
		return GetListsOutputSchema.parse(raw);
	},

	get: async (
		ctx: LapostaPluginContext,
		input: GetListInput,
	): Promise<GetListOutput> => {
		const parsedInput = LapostaEndpointInputSchemas['lists.get'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/list/${encodeURIComponent(parsedInput.list_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		return GetListOutputSchema.parse(raw);
	},

	create: async (
		ctx: LapostaPluginContext,
		input: CreateListInput,
	): Promise<CreateListOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['lists.create'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/list', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return CreateListOutputSchema.parse(raw);
	},

	update: async (
		ctx: LapostaPluginContext,
		input: UpdateListInput,
	): Promise<UpdateListOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['lists.update'].parse(input);
		const { list_id, ...body } = parsedInput;
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/list/${encodeURIComponent(list_id)}`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		return UpdateListOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LapostaPluginContext,
		input: DeleteListInput,
	): Promise<DeleteListOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['lists.delete'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/list/${encodeURIComponent(parsedInput.list_id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		return DeleteListOutputSchema.parse(raw);
	},

	purge_members: async (
		ctx: LapostaPluginContext,
		input: PurgeListMembersInput,
	): Promise<PurgeListMembersOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['lists.purge_members'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/list/${encodeURIComponent(parsedInput.list_id)}/members`,
			ctx.key,
			{ method: 'DELETE' },
		);
		return PurgeListMembersOutputSchema.parse(raw);
	},

	sync_members: async (
		ctx: LapostaPluginContext,
		input: ListMembersInput,
	): Promise<ListMembersOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['lists.sync_members'].parse(input);
		const { list_id, ...body } = parsedInput;
		// unknown because the documented bulk-sync response is validated below.
		const raw = await makeLapostaRequest<unknown>(
			`/list/${encodeURIComponent(list_id)}/members`,
			ctx.key,
			{ method: 'POST', body, bodyEncoding: 'json' },
		);
		return ListMembersOutputSchema.parse(raw);
	},
};
