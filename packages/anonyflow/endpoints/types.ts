import { z } from 'zod';

// 1. Anonymize Text
const AnonymizeInputSchema = z.object({
	text: z.string().describe('The raw text to anonymize'),
});
export type AnonymizeInput = z.infer<typeof AnonymizeInputSchema>;

const AnonymizeOutputSchema = z.object({
	anonymizedText: z.string(),
	id: z.string().optional(),
});
export type AnonymizeOutput = z.infer<typeof AnonymizeOutputSchema>;

// 2. Deanonymize Text
const DeanonymizeInputSchema = z.object({
	anonymizedText: z.string().describe('The anonymized text to decode'),
	id: z.string().describe('The mapping ID'),
});
export type DeanonymizeInput = z.infer<typeof DeanonymizeInputSchema>;

const DeanonymizeOutputSchema = z.object({
	originalText: z.string(),
});
export type DeanonymizeOutput = z.infer<typeof DeanonymizeOutputSchema>;

// 3. Analyze Text
const AnalyzeInputSchema = z.object({
	text: z.string().describe('The text to analyze for PII'),
});
export type AnalyzeInput = z.infer<typeof AnalyzeInputSchema>;

const AnalyzeOutputSchema = z.object({
	entitiesFound: z.number(),
	entities: z.array(z.string()),
});
export type AnalyzeOutput = z.infer<typeof AnalyzeOutputSchema>;

// 4. List Entities
const ListEntitiesInputSchema = z.object({});
export type ListEntitiesInput = z.infer<typeof ListEntitiesInputSchema>;

const ListEntitiesOutputSchema = z.object({
	supportedEntities: z.array(z.string()),
});
export type ListEntitiesOutput = z.infer<typeof ListEntitiesOutputSchema>;

// 5. Get Status
const GetStatusInputSchema = z.object({});
export type GetStatusInput = z.infer<typeof GetStatusInputSchema>;

const GetStatusOutputSchema = z.object({
	status: z.string(),
	creditsRemaining: z.number().optional(),
});
export type GetStatusOutput = z.infer<typeof GetStatusOutputSchema>;

// --- MAPPINGS FOR CORSAIR ---

export type AnonyflowEndpointInputs = {
	anonymize: AnonymizeInput;
	deanonymize: DeanonymizeInput;
	analyze: AnalyzeInput;
	listEntities: ListEntitiesInput;
	getStatus: GetStatusInput;
};

export type AnonyflowEndpointOutputs = {
	anonymize: AnonymizeOutput;
	deanonymize: DeanonymizeOutput;
	analyze: AnalyzeOutput;
	listEntities: ListEntitiesOutput;
	getStatus: GetStatusOutput;
};

export const AnonyflowEndpointInputSchemas = {
	anonymize: AnonymizeInputSchema,
	deanonymize: DeanonymizeInputSchema,
	analyze: AnalyzeInputSchema,
	listEntities: ListEntitiesInputSchema,
	getStatus: GetStatusInputSchema,
} as const;

export const AnonyflowEndpointOutputSchemas = {
	anonymize: AnonymizeOutputSchema,
	deanonymize: DeanonymizeOutputSchema,
	analyze: AnalyzeOutputSchema,
	listEntities: ListEntitiesOutputSchema,
	getStatus: GetStatusOutputSchema,
} as const;
