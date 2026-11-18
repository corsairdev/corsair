import { makeLapostaRequest } from '../client';
import type {
	CreateListInput,
	CreateListOutput,
	DeleteListInput,
	DeleteListOutput,
	GetListInput,
	GetListOutput,
	GetListsInput,
	GetListsOutput,
	UpdateListInput,
	UpdateListOutput,
} from './types';
import {
	CreateListOutputSchema,
	DeleteListOutputSchema,
	GetListOutputSchema,
	GetListsOutputSchema,
	UpdateListOutputSchema,
} from './types';

export const lists = {
	list: async (
		_input: GetListsInput,
		apiKey?: string,
	): Promise<GetListsOutput> => {
		const raw = await makeLapostaRequest<unknown>('/list', apiKey, {
			method: 'GET',
		});
		return GetListsOutputSchema.parse(raw);
	},

	get: async (
		input: GetListInput,
		apiKey?: string,
	): Promise<GetListOutput> => {
		const raw = await makeLapostaRequest<unknown>(
			`/list/${encodeURIComponent(input.list_id)}`,
			apiKey,
			{ method: 'GET' },
		);
		return GetListOutputSchema.parse(raw);
	},

	create: async (
		input: CreateListInput,
		apiKey?: string,
	): Promise<CreateListOutput> => {
		const raw = await makeLapostaRequest<unknown>('/list', apiKey, {
			method: 'POST',
			body: input as Record<string, unknown>,
		});
		return CreateListOutputSchema.parse(raw);
	},

	update: async (
		input: UpdateListInput,
		apiKey?: string,
	): Promise<UpdateListOutput> => {
		const { list_id, ...body } = input;
		const raw = await makeLapostaRequest<unknown>(
			`/list/${encodeURIComponent(list_id)}`,
			apiKey,
			{
				method: 'POST',
				body: body as Record<string, unknown>,
			},
		);
		return UpdateListOutputSchema.parse(raw);
	},

	delete: async (
		input: DeleteListInput,
		apiKey?: string,
	): Promise<DeleteListOutput> => {
		const raw = await makeLapostaRequest<unknown>(
			`/list/${encodeURIComponent(input.list_id)}`,
			apiKey,
			{ method: 'DELETE' },
		);
		return DeleteListOutputSchema.parse(raw);
	},
};
