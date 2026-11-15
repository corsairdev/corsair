import { z } from 'zod';

const NoInput = z.object({}).strict();

export const ListCampaignsInputSchema = NoInput;
export const GetUserInputSchema = NoInput;
export const ListActivityInputSchema = NoInput;

export const CampaignSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		name: z.string(),
		domain: z
			.object({
				domain: z.string(),
				subdomains: z.boolean(),
			})
			.optional(),
		enabled: z.boolean().optional(),
		created: z.string().optional(),
	})
	.passthrough();

export const ListCampaignsResponseSchema = z
	.object({
		ok: z.literal(true),
		status: z.number().optional(),
		data: z.array(CampaignSchema),
	})
	.passthrough();

export const UserSchema = z
	.object({
		name: z.string().optional(),
		email: z.string(),
		meta: z
			.object({
				logins: z.number().optional(),
				registered: z.string().optional(),
			})
			.optional(),
		impressions: z
			.object({
				period: z.number().optional(),
				total: z.number().optional(),
			})
			.optional(),
		pixel: z
			.object({
				key: z.string().optional(),
				debug: z.boolean().optional(),
			})
			.optional(),
	})
	.passthrough();

export const GetUserResponseSchema = z
	.object({
		ok: z.literal(true),
		status: z.number().optional(),
		data: UserSchema,
	})
	.passthrough();

export const ActivitySchema = z
	.object({
		type: z.string(),
		ip: z.string().optional(),
		date: z.string().optional(),
	})
	.passthrough();

export const ListActivityResponseSchema = z
	.object({
		ok: z.literal(true),
		status: z.number().optional(),
		data: z.array(ActivitySchema),
	})
	.passthrough();

export type ListCampaignsInput = z.infer<typeof ListCampaignsInputSchema>;
export type ListCampaignsResponse = z.infer<typeof ListCampaignsResponseSchema>;
export type GetUserInput = z.infer<typeof GetUserInputSchema>;
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
export type ListActivityInput = z.infer<typeof ListActivityInputSchema>;
export type ListActivityResponse = z.infer<typeof ListActivityResponseSchema>;

export const ProoflyEndpointInputSchemas = {
	'campaigns.list': ListCampaignsInputSchema,
	'user.get': GetUserInputSchema,
	'activity.list': ListActivityInputSchema,
};

export const ProoflyEndpointOutputSchemas = {
	'campaigns.list': ListCampaignsResponseSchema,
	'user.get': GetUserResponseSchema,
	'activity.list': ListActivityResponseSchema,
};
