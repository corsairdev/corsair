import { z } from 'zod';

// Shapes follow https://api.typesafe.ai/openapi.json (System One API 0.2.0).
// Outputs type the fields callers read and pass the rest through
// (`.loose()`), so a field TypeSafe adds later still reaches the caller.

// unknown: TypeSafe reads state, instructions and criteria as free-form
// content ("string | object | array"), so their values have no fixed shape.
const Content = z.union([
	z.string(),
	z.record(z.string(), z.unknown()),
	z.array(z.unknown()),
]);

const Instructions = Content.nullish().describe(
	'The question, as plain text or as structured JSON. Refer to parts of the state by path in backticks, e.g. `lead.title`.',
);

const NoulQuestionSchema = z.object({
	type: z.literal('noul'),
	instructions: Instructions,
	criteria: z
		.object({
			true: Content.nullish().describe('What counts as yes'),
			false: Content.nullish().describe('What counts as no'),
		})
		.nullish(),
});

const ChoiceQuestionSchema = z.object({
	type: z.literal('choice'),
	instructions: Instructions,
	criteria: z
		.record(z.string(), Content.nullable())
		.refine((options) => {
			const count = Object.keys(options).length;
			return count >= 1 && count <= 255;
		}, 'A choice needs between 1 and 255 options')
		.describe(
			'Option names mapped to when each applies. Names are sent to the model, so use descriptive ones (refund_request, not A).',
		),
});

const ScoreQuestionSchema = z.object({
	type: z.literal('score'),
	instructions: Instructions,
	criteria: z
		.array(Content)
		.min(1)
		.max(10)
		.describe(
			'Ordered level descriptions, lowest first. A level scores its position, starting at 0.',
		),
});

const BoxQuestionSchema = z.object({
	type: z.literal('box'),
	instructions: Instructions,
});

const QuestionSchema = z.discriminatedUnion('type', [
	NoulQuestionSchema,
	ChoiceQuestionSchema,
	ScoreQuestionSchema,
	BoxQuestionSchema,
]);

export type TypeSafeQuestion = z.infer<typeof QuestionSchema>;

const ImageAssetSchema = z.object({
	type: z.literal('image'),
	format: z.enum(['png', 'jpg', 'jpeg']),
	data_base64: z.string().min(1).describe('Base64-encoded image bytes'),
});

const SystemOneAskInputSchema = z.object({
	model: z
		.string()
		.min(1)
		.default('jev-latest')
		.describe(
			'Model name or alias from models.list. jev-latest moves with each release; pin a version such as jev-1.14.0 to keep answers stable.',
		),
	state: Content.describe(
		'The content every question is about: text, or JSON with descriptive keys. Leave out fields no question needs.',
	),
	questions: z
		.record(z.string(), QuestionSchema)
		.refine(
			(questions) => Object.keys(questions).length > 0,
			'Ask at least one question',
		)
		.describe(
			'Questions keyed by a name you choose; answers come back under the same names. Questions run in parallel and cannot see each other.',
		),
	assets: z
		.record(z.string(), ImageAssetSchema)
		.optional()
		.describe(
			'Images keyed by a placeholder string. Each placeholder in state, instructions or criteria is replaced by its image. Images are experimental at TypeSafe.',
		),
	longContext: z
		.boolean()
		.optional()
		.describe(
			'Raise the context limit from 64k (32k per question) to 262k tokens. Slower and less accurate, same price per token.',
		),
});

export type SystemOneAskInput = z.input<typeof SystemOneAskInputSchema>;

const NoulAnswerSchema = z
	.object({
		type: z.literal('noul'),
		noul: z.number().describe('Probability of yes, from 0 to 1'),
	})
	.loose();

const ChoiceAnswerSchema = z
	.object({
		type: z.literal('choice'),
		choice: z.string(),
		confidence: z.number(),
		probabilities: z.record(z.string(), z.number()),
	})
	.loose();

const ScoreAnswerSchema = z
	.object({
		type: z.literal('score'),
		score: z.number(),
		confidence: z.number(),
		// unknown: the legend echoes the request's criteria, which are free-form.
		legend: z.record(z.string(), z.unknown()).optional(),
		probabilities: z.record(z.string(), z.number()).optional(),
	})
	.loose();

const BoxAnswerSchema = z
	.object({
		type: z.literal('box'),
		box: z.object({
			top: z.number(),
			bottom: z.number(),
			left: z.number(),
			right: z.number(),
		}),
		confidence: z.number().nullable(),
	})
	.loose();

const AnswerSchema = z.discriminatedUnion('type', [
	NoulAnswerSchema,
	ChoiceAnswerSchema,
	ScoreAnswerSchema,
	BoxAnswerSchema,
]);

export type TypeSafeAnswer = z.infer<typeof AnswerSchema>;

const SystemOneAskResponseSchema = z
	.object({
		model: z.string().describe('Versioned model that answered'),
		answers: z.record(z.string(), AnswerSchema),
		usage: z
			.object({
				input_tokens: z.number(),
				output_tokens: z.number(),
			})
			.loose(),
	})
	.loose();

export type SystemOneAskResponse = z.infer<typeof SystemOneAskResponseSchema>;

const ModelsListInputSchema = z.object({});

export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;

const ModelsListResponseSchema = z
	.object({
		models: z.array(
			z
				.object({
					name: z.string(),
					description: z.string(),
					release_date: z.string(),
				})
				.loose(),
		),
	})
	.loose();

export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>;

export type TypeSafeEndpointInputs = {
	systemOneAsk: SystemOneAskInput;
	modelsList: ModelsListInput;
};

export type TypeSafeEndpointOutputs = {
	systemOneAsk: SystemOneAskResponse;
	modelsList: ModelsListResponse;
};

export const TypeSafeEndpointInputSchemas = {
	systemOneAsk: SystemOneAskInputSchema,
	modelsList: ModelsListInputSchema,
} as const;

export const TypeSafeEndpointOutputSchemas = {
	systemOneAsk: SystemOneAskResponseSchema,
	modelsList: ModelsListResponseSchema,
} as const;
