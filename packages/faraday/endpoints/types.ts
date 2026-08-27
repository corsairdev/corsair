import { z } from 'zod';

const GetAccountsInputSchema = z.object({
	ids: z.array(z.string()).max(100).optional(),
});

export type GetAccountsInput = z.infer<typeof GetAccountsInputSchema>;

const AccountSchema = z.object({
	api_key: z.string(),
	archived_at: z.string().nullable(),
	branding: z.object({
		suppress_from_reports: z.boolean().optional(),
	}).optional(),
	commitment: z.object({
		monthly_cost: z.number().optional(),
		renewal_date: z.string().optional(),
	}).optional(),
	contract_started_at: z.string(),
	created_at: z.string(),
	id: z.string(),
	identity_graph: z.object({
		feature_store_id: z.string().optional(),
	}).optional(),
	last_read_input_at: z.string().optional(),
	last_updated_config_at: z.string().optional(),
	last_updated_output_at: z.string().optional(),
	name: z.string(),
	parent_account_id: z.string().optional(),
	resource_type: z.string(),
	status: z.string(),
	status_changed_at: z.string(),
	status_error: z.string().nullable(),
	stripe_customer_id: z.string().optional(),
	updated_at: z.string(),
}).passthrough();

const GetAccountsResponseSchema = z.array(AccountSchema);

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
