import { makeLangbaseRequest } from '../client';
import type {
	CreateMemoryInput,
	CreateMemoryOutput,
	DeleteMemoryInput,
	DeleteMemoryOutput,
	GetMemoryInput,
	GetMemoryOutput,
	ListMemoryInput,
	ListMemoryOutput,
} from './types';
import {
	CreateMemoryOutputSchema,
	DeleteMemoryOutputSchema,
	GetMemoryOutputSchema,
	ListMemoryOutputSchema,
} from './types';

export const memory = {
	list: async (
		_input: ListMemoryInput,
		apiKey?: string,
	): Promise<ListMemoryOutput> => {
		const raw = await makeLangbaseRequest<unknown>('/memory', apiKey, {
			method: 'GET',
		});
		return ListMemoryOutputSchema.parse(raw);
	},

	get: async (
		input: GetMemoryInput,
		apiKey?: string,
	): Promise<GetMemoryOutput> => {
		const raw = await makeLangbaseRequest<unknown>(
			`/memory/${encodeURIComponent(input.name)}`,
			apiKey,
			{ method: 'GET' },
		);
		return GetMemoryOutputSchema.parse(raw);
	},

	create: async (
		input: CreateMemoryInput,
		apiKey?: string,
	): Promise<CreateMemoryOutput> => {
		const raw = await makeLangbaseRequest<unknown>('/memory', apiKey, {
			method: 'POST',
			body: input as Record<string, unknown>,
		});
		return CreateMemoryOutputSchema.parse(raw);
	},

	delete: async (
		input: DeleteMemoryInput,
		apiKey?: string,
	): Promise<DeleteMemoryOutput> => {
		const raw = await makeLangbaseRequest<unknown>(
			`/memory/${encodeURIComponent(input.name)}`,
			apiKey,
			{ method: 'DELETE' },
		);
		return DeleteMemoryOutputSchema.parse(raw);
	},
};
