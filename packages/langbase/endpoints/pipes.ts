import { makeLangbaseRequest } from '../client';
import type {
	CreatePipeInput,
	CreatePipeOutput,
	DeletePipeInput,
	DeletePipeOutput,
	GetPipeInput,
	GetPipeOutput,
	ListPipesInput,
	ListPipesOutput,
	RunPipeInput,
	RunPipeOutput,
	UpdatePipeInput,
	UpdatePipeOutput,
} from './types';
import {
	CreatePipeOutputSchema,
	DeletePipeOutputSchema,
	GetPipeOutputSchema,
	ListPipesOutputSchema,
	RunPipeOutputSchema,
	UpdatePipeOutputSchema,
} from './types';

export const pipes = {
	run: async (input: RunPipeInput, apiKey?: string): Promise<RunPipeOutput> => {
		const raw = await makeLangbaseRequest<unknown>('/pipes/run', apiKey, {
			method: 'POST',
			body: input as Record<string, unknown>,
		});
		return RunPipeOutputSchema.parse(raw);
	},

	list: async (
		_input: ListPipesInput,
		apiKey?: string,
	): Promise<ListPipesOutput> => {
		const raw = await makeLangbaseRequest<unknown>('/pipes', apiKey, {
			method: 'GET',
		});
		return ListPipesOutputSchema.parse(raw);
	},

	get: async (
		input: GetPipeInput,
		apiKey?: string,
	): Promise<GetPipeOutput> => {
		const raw = await makeLangbaseRequest<unknown>(
			`/pipes/${encodeURIComponent(input.name)}`,
			apiKey,
			{ method: 'GET' },
		);
		return GetPipeOutputSchema.parse(raw);
	},

	create: async (
		input: CreatePipeInput,
		apiKey?: string,
	): Promise<CreatePipeOutput> => {
		const raw = await makeLangbaseRequest<unknown>('/pipes', apiKey, {
			method: 'POST',
			body: input as Record<string, unknown>,
		});
		return CreatePipeOutputSchema.parse(raw);
	},

	update: async (
		input: UpdatePipeInput,
		apiKey?: string,
	): Promise<UpdatePipeOutput> => {
		const { name, ...body } = input;
		const raw = await makeLangbaseRequest<unknown>(
			`/pipes/${encodeURIComponent(name)}`,
			apiKey,
			{
				method: 'PATCH',
				body: body as Record<string, unknown>,
			},
		);
		return UpdatePipeOutputSchema.parse(raw);
	},

	delete: async (
		input: DeletePipeInput,
		apiKey?: string,
	): Promise<DeletePipeOutput> => {
		const raw = await makeLangbaseRequest<unknown>(
			`/pipes/${encodeURIComponent(input.name)}`,
			apiKey,
			{ method: 'DELETE' },
		);
		return DeletePipeOutputSchema.parse(raw);
	},
};
