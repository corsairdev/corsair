import { z } from 'zod';

const GetAccountsInputSchema = z.object({
	ids: z.array(z.string()).optional(),
});

export type GetAccountsInput = z.infer<typeof GetAccountsInputSchema>;

const GetAccountsResponseSchema = z.any();

export type GetAccountsResponse = z.infer<typeof GetAccountsResponseSchema>;

export type FaradayEndpointInputs = {
	getAccounts: GetAccountsInput;
};

export type FaradayEndpointOutputs = {
	getAccounts: GetAccountsResponse;
};

export const FaradayEndpointInputSchemas = {
	getAccounts: GetAccountsInputSchema,
} as const;

export const FaradayEndpointOutputSchemas = {
	getAccounts: GetAccountsResponseSchema,
} as const;
