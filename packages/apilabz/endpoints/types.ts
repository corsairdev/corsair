import { z } from 'zod';

/** Catalog: API_LABZ_INTEGRATE_DEAL */
const DealsIntegrateInputSchema = z.object({
	title: z.string().min(1),
	amount: z.number().nonnegative(),
	dealId: z.string().min(1),
	status: z.string().min(1),
	currency: z.string().optional(),
	customFields: z.record(z.string(), z.unknown()).optional(),
});

export type DealsIntegrateInput = z.infer<typeof DealsIntegrateInputSchema>;

/** Catalog: API_LABZ_LIST_TABLES */
const AirtableListTablesInputSchema = z.object({
	base_id: z.string().min(1),
});

export type AirtableListTablesInput = z.infer<
	typeof AirtableListTablesInputSchema
>;

/** Catalog: API_LABZ_TRELLO_AI_SEARCH_ENGINE */
const TrelloAiSearchEngineInputSchema = z.object({
	query: z.string().min(1),
	limit: z.number().int().min(1).max(50).optional(),
	listId: z.string().optional(),
	boardId: z.string().optional(),
	includeArchived: z.boolean().optional(),
});

export type TrelloAiSearchEngineInput = z.infer<
	typeof TrelloAiSearchEngineInputSchema
>;

/** Catalog: API_LABZ_IBAN_VALIDATOR */
const IbanValidateInputSchema = z.object({
	iban: z.string().min(5),
});

export type IbanValidateInput = z.infer<typeof IbanValidateInputSchema>;

/** Live hub envelope: `{ message, response }` */
const HubEnvelopeSchema = z.object({
	message: z.string(),
	response: z.unknown(),
});

const IbanValidateResponseSchema = z.object({
	message: z.string(),
	response: z.object({
		iban: z.string(),
		is_valid: z.boolean(),
	}),
});

export type IbanValidateOutput = z.infer<typeof IbanValidateResponseSchema>;
export type ApiLabzHubResponse = z.infer<typeof HubEnvelopeSchema>;

export type ApiLabzEndpointInputs = {
	dealsIntegrate: DealsIntegrateInput;
	airtableListTables: AirtableListTablesInput;
	trelloAiSearchEngine: TrelloAiSearchEngineInput;
	ibanValidate: IbanValidateInput;
};

export type ApiLabzEndpointOutputs = {
	dealsIntegrate: ApiLabzHubResponse;
	airtableListTables: ApiLabzHubResponse;
	trelloAiSearchEngine: ApiLabzHubResponse;
	ibanValidate: IbanValidateOutput;
};

export const ApiLabzEndpointInputSchemas = {
	dealsIntegrate: DealsIntegrateInputSchema,
	airtableListTables: AirtableListTablesInputSchema,
	trelloAiSearchEngine: TrelloAiSearchEngineInputSchema,
	ibanValidate: IbanValidateInputSchema,
} as const;

export const ApiLabzEndpointOutputSchemas = {
	dealsIntegrate: HubEnvelopeSchema,
	airtableListTables: HubEnvelopeSchema,
	trelloAiSearchEngine: HubEnvelopeSchema,
	ibanValidate: IbanValidateResponseSchema,
} as const;
