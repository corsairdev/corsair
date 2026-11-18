import { z } from 'zod';

// Pipes Schemas
export const MessageSchema = z.object({
	role: z.enum(['system', 'user', 'assistant', 'tool']),
	content: z.string(),
	name: z.string().optional(),
});

export const PipeMemorySchema = z.object({
	name: z.string(),
});

export const RunPipeInputSchema = z
	.object({
		messages: z.array(MessageSchema),
		name: z.string().optional(),
		stream: z.boolean().optional(),
		memory: z.array(PipeMemorySchema).optional(),
		// `unknown` because variables accept dynamic prompt substitution parameters.
		variables: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();
export type RunPipeInput = z.infer<typeof RunPipeInputSchema>;

export const RunPipeOutputSchema = z.object({
	// `unknown` because response envelope varies between text completion and function call outputs.
	completion: z.string().optional(),
	raw: z.record(z.string(), z.unknown()).optional(),
	// `unknown` because thread context carries server-computed history.
	thread: z.record(z.string(), z.unknown()).optional(),
});
export type RunPipeOutput = z.infer<typeof RunPipeOutputSchema>;

export const ListPipesInputSchema = z.object({}).strict();
export type ListPipesInput = z.infer<typeof ListPipesInputSchema>;

export const ListPipesOutputSchema = z.object({
	// `unknown` because pipe records contain model configs and metadata.
	pipes: z.array(z.record(z.string(), z.unknown())),
});
export type ListPipesOutput = z.infer<typeof ListPipesOutputSchema>;

export const GetPipeInputSchema = z
	.object({
		name: z.string().min(1),
	})
	.strict();
export type GetPipeInput = z.infer<typeof GetPipeInputSchema>;

export const GetPipeOutputSchema = z.object({
	// `unknown` because pipe definition contains provider-specific model configs.
	pipe: z.record(z.string(), z.unknown()),
});
export type GetPipeOutput = z.infer<typeof GetPipeOutputSchema>;

export const CreatePipeInputSchema = z
	.object({
		name: z.string().min(1),
		description: z.string().optional(),
		model: z.string().optional(),
		// `unknown` because prompt templates contain dynamic placeholders.
		prompt: z.string().optional(),
		memory: z.array(PipeMemorySchema).optional(),
	})
	.strict();
export type CreatePipeInput = z.infer<typeof CreatePipeInputSchema>;

export const CreatePipeOutputSchema = z.object({
	// `unknown` because created pipe includes deployment endpoints and keys.
	pipe: z.record(z.string(), z.unknown()),
});
export type CreatePipeOutput = z.infer<typeof CreatePipeOutputSchema>;

export const UpdatePipeInputSchema = z
	.object({
		name: z.string().min(1),
		description: z.string().optional(),
		model: z.string().optional(),
		prompt: z.string().optional(),
		memory: z.array(PipeMemorySchema).optional(),
	})
	.strict();
export type UpdatePipeInput = z.infer<typeof UpdatePipeInputSchema>;

export const UpdatePipeOutputSchema = z.object({
	// `unknown` because updated pipe includes updated configuration.
	pipe: z.record(z.string(), z.unknown()),
});
export type UpdatePipeOutput = z.infer<typeof UpdatePipeOutputSchema>;

export const DeletePipeInputSchema = z
	.object({
		name: z.string().min(1),
	})
	.strict();
export type DeletePipeInput = z.infer<typeof DeletePipeInputSchema>;

export const DeletePipeOutputSchema = z.object({
	// `unknown` because delete response contains confirmation status.
	success: z.boolean().optional(),
	result: z.record(z.string(), z.unknown()).optional(),
});
export type DeletePipeOutput = z.infer<typeof DeletePipeOutputSchema>;

// Memory Schemas
export const ListMemoryInputSchema = z.object({}).strict();
export type ListMemoryInput = z.infer<typeof ListMemoryInputSchema>;

export const ListMemoryOutputSchema = z.object({
	// `unknown` because memory sets contain indexing state and metadata.
	memories: z.array(z.record(z.string(), z.unknown())),
});
export type ListMemoryOutput = z.infer<typeof ListMemoryOutputSchema>;

export const GetMemoryInputSchema = z
	.object({
		name: z.string().min(1),
	})
	.strict();
export type GetMemoryInput = z.infer<typeof GetMemoryInputSchema>;

export const GetMemoryOutputSchema = z.object({
	// `unknown` because memory details include vector dimension and document stats.
	memory: z.record(z.string(), z.unknown()),
});
export type GetMemoryOutput = z.infer<typeof GetMemoryOutputSchema>;

export const CreateMemoryInputSchema = z
	.object({
		name: z.string().min(1),
		description: z.string().optional(),
		embedding_model: z.string().optional(),
	})
	.strict();
export type CreateMemoryInput = z.infer<typeof CreateMemoryInputSchema>;

export const CreateMemoryOutputSchema = z.object({
	// `unknown` because created memory contains managed index metadata.
	memory: z.record(z.string(), z.unknown()),
});
export type CreateMemoryOutput = z.infer<typeof CreateMemoryOutputSchema>;

export const DeleteMemoryInputSchema = z
	.object({
		name: z.string().min(1),
	})
	.strict();
export type DeleteMemoryInput = z.infer<typeof DeleteMemoryInputSchema>;

export const DeleteMemoryOutputSchema = z.object({
	// `unknown` because deleted memory response contains status confirmation.
	success: z.boolean().optional(),
	result: z.record(z.string(), z.unknown()).optional(),
});
export type DeleteMemoryOutput = z.infer<typeof DeleteMemoryOutputSchema>;

// Tools Schemas
export const WebSearchInputSchema = z
	.object({
		query: z.string().min(1),
		totalResults: z.number().int().positive().optional(),
		domains: z.array(z.string()).optional(),
	})
	.strict();
export type WebSearchInput = z.infer<typeof WebSearchInputSchema>;

export const WebSearchOutputSchema = z.object({
	// `unknown` because search results contain arbitrary web page snippets and metadata.
	results: z.array(z.record(z.string(), z.unknown())),
});
export type WebSearchOutput = z.infer<typeof WebSearchOutputSchema>;

// Input Schemas Map
export const LangbaseEndpointInputSchemas = {
	'pipes.run': RunPipeInputSchema,
	'pipes.list': ListPipesInputSchema,
	'pipes.get': GetPipeInputSchema,
	'pipes.create': CreatePipeInputSchema,
	'pipes.update': UpdatePipeInputSchema,
	'pipes.delete': DeletePipeInputSchema,
	'memory.list': ListMemoryInputSchema,
	'memory.get': GetMemoryInputSchema,
	'memory.create': CreateMemoryInputSchema,
	'memory.delete': DeleteMemoryInputSchema,
	'tools.webSearch': WebSearchInputSchema,
} as const;

// Output Schemas Map
export const LangbaseEndpointOutputSchemas = {
	'pipes.run': RunPipeOutputSchema,
	'pipes.list': ListPipesOutputSchema,
	'pipes.get': GetPipeOutputSchema,
	'pipes.create': CreatePipeOutputSchema,
	'pipes.update': UpdatePipeOutputSchema,
	'pipes.delete': DeletePipeOutputSchema,
	'memory.list': ListMemoryOutputSchema,
	'memory.get': GetMemoryOutputSchema,
	'memory.create': CreateMemoryOutputSchema,
	'memory.delete': DeleteMemoryOutputSchema,
	'tools.webSearch': WebSearchOutputSchema,
} as const;

export type LangbaseEndpointInputs = {
	'pipes.run': RunPipeInput;
	'pipes.list': ListPipesInput;
	'pipes.get': GetPipeInput;
	'pipes.create': CreatePipeInput;
	'pipes.update': UpdatePipeInput;
	'pipes.delete': DeletePipeInput;
	'memory.list': ListMemoryInput;
	'memory.get': GetMemoryInput;
	'memory.create': CreateMemoryInput;
	'memory.delete': DeleteMemoryInput;
	'tools.webSearch': WebSearchInput;
};

export type LangbaseEndpointOutputs = {
	'pipes.run': RunPipeOutput;
	'pipes.list': ListPipesOutput;
	'pipes.get': GetPipeOutput;
	'pipes.create': CreatePipeOutput;
	'pipes.update': UpdatePipeOutput;
	'pipes.delete': DeletePipeOutput;
	'memory.list': ListMemoryOutput;
	'memory.get': GetMemoryOutput;
	'memory.create': CreateMemoryOutput;
	'memory.delete': DeleteMemoryOutput;
	'tools.webSearch': WebSearchOutput;
};
