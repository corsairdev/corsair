import { z } from 'zod';

// ─── Existing example endpoint ────────────────────────────────
const ExampleGetInputSchema = z.object({
	id: z.string(),
});
export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});
export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

// ─── NEW: Summarize Text endpoint ─────────────────────────────
const SummarizeTextInputSchema = z.object({
	text: z.string().min(1, 'Text is required'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

const SummarizeTextOutputSchema = z.object({
	summary: z.string(),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

// ─── Union types for all endpoints ────────────────────────────
export type JigsawstackEndpointInputs = {
	exampleGet: ExampleGetInput;
	summarizeText: SummarizeTextInput; // ← added
};

export type JigsawstackEndpointOutputs = {
	exampleGet: ExampleGetResponse;
	summarizeText: SummarizeTextOutput; // ← added
};

// ─── Schema objects for validation ────────────────────────────
export const JigsawstackEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
	summarizeText: SummarizeTextInputSchema, // ← added
} as const;

export const JigsawstackEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
	summarizeText: SummarizeTextOutputSchema, // ← added
} as const;
