import { makeLangbaseRequest } from '../client';
import type { LangbasePluginContext } from '../index';
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
	LangbaseEndpointInputSchemas,
	ListPipesOutputSchema,
	RunPipeOutputSchema,
	UpdatePipeOutputSchema,
} from './types';

export const pipes = {
	run: async (
		ctx: LangbasePluginContext,
		input: RunPipeInput,
	): Promise<RunPipeOutput> => {
		const parsedInput = LangbaseEndpointInputSchemas['pipes.run'].parse(input);
		// unknown because response envelope varies between text completion and function call outputs.
		const raw = await makeLangbaseRequest<unknown>('/pipes/run', ctx.key, {
			method: 'POST',
			// unknown because request body is a dynamic JSON payload.
			body: parsedInput as Record<string, unknown>,
		});
		return RunPipeOutputSchema.parse(raw);
	},

	list: async (
		ctx: LangbasePluginContext,
		input: ListPipesInput,
	): Promise<ListPipesOutput> => {
		LangbaseEndpointInputSchemas['pipes.list'].parse(input);
		// unknown because pipe records contain model configs and metadata.
		const raw = await makeLangbaseRequest<unknown>('/pipes', ctx.key, {
			method: 'GET',
		});
		return ListPipesOutputSchema.parse(raw);
	},

	get: async (
		ctx: LangbasePluginContext,
		input: GetPipeInput,
	): Promise<GetPipeOutput> => {
		const parsedInput = LangbaseEndpointInputSchemas['pipes.get'].parse(input);
		// unknown because pipe definition contains provider-specific model configs.
		const raw = await makeLangbaseRequest<unknown>(
			`/pipes/${encodeURIComponent(parsedInput.name)}`,
			ctx.key,
			{ method: 'GET' },
		);
		return GetPipeOutputSchema.parse(raw);
	},

	create: async (
		ctx: LangbasePluginContext,
		input: CreatePipeInput,
	): Promise<CreatePipeOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['pipes.create'].parse(input);
		// unknown because created pipe includes deployment endpoints and keys.
		const raw = await makeLangbaseRequest<unknown>('/pipes', ctx.key, {
			method: 'POST',
			// unknown because request body is a dynamic JSON payload.
			body: parsedInput as Record<string, unknown>,
		});
		return CreatePipeOutputSchema.parse(raw);
	},

	update: async (
		ctx: LangbasePluginContext,
		input: UpdatePipeInput,
	): Promise<UpdatePipeOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['pipes.update'].parse(input);
		const { name, ...body } = parsedInput;
		// unknown because updated pipe includes updated configuration.
		const raw = await makeLangbaseRequest<unknown>(
			`/pipes/${encodeURIComponent(name)}`,
			ctx.key,
			{
				method: 'PATCH',
				// unknown because request body is a dynamic JSON payload.
				body: body as Record<string, unknown>,
			},
		);
		return UpdatePipeOutputSchema.parse(raw);
	},

	delete: async (
		ctx: LangbasePluginContext,
		input: DeletePipeInput,
	): Promise<DeletePipeOutput> => {
		const parsedInput =
			LangbaseEndpointInputSchemas['pipes.delete'].parse(input);
		// unknown because delete response contains confirmation status.
		const raw = await makeLangbaseRequest<unknown>(
			`/pipes/${encodeURIComponent(parsedInput.name)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		return DeletePipeOutputSchema.parse(raw);
	},
};
