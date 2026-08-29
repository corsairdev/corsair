import { z } from 'zod';

const GetBalanceInputSchema = z.object({});

const GetBalanceResponseSchema = z.object({
	credits: z.number(),
});

export type GetBalanceInput = z.infer<typeof GetBalanceInputSchema>;
export type GetBalanceResponse = z.infer<typeof GetBalanceResponseSchema>;

const GetAccountInputSchema = z.object({});

const GetAccountResponseSchema = z.object({
	email: z.string(),
	id: z.string(),
	organizations: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			role: z.string(),
			is_default: z.boolean(),
		}),
	),
});

export type GetAccountInput = z.infer<typeof GetAccountInputSchema>;
export type GetAccountResponse = z.infer<typeof GetAccountResponseSchema>;

const ListEnginesInputSchema = z.object({});

const ListEnginesResponseSchema = z.array(
	z.object({
		description: z.string(),
		id: z.string(),
		name: z.string(),
		type: z.string(),
	}),
);

export type ListEnginesInput = z.infer<typeof ListEnginesInputSchema>;
export type ListEnginesResponse = z.infer<typeof ListEnginesResponseSchema>;

export type DreamStudioEndpointInputs = {
	getBalance: GetBalanceInput;
	getAccount: GetAccountInput;
	listEngines: ListEnginesInput;
};

export type DreamStudioEndpointOutputs = {
	getBalance: GetBalanceResponse;
	getAccount: GetAccountResponse;
	listEngines: ListEnginesResponse;
};

export const DreamStudioEndpointInputSchemas = {
	getBalance: GetBalanceInputSchema,
	getAccount: GetAccountInputSchema,
	listEngines: ListEnginesInputSchema,
} as const;

export const DreamStudioEndpointOutputSchemas = {
	getBalance: GetBalanceResponseSchema,
	getAccount: GetAccountResponseSchema,
	listEngines: ListEnginesResponseSchema,
} as const;
