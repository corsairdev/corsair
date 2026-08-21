import { z } from 'zod';

const ODataQuerySchema = z.object({
	$filter: z.string().optional(),
	$top: z.coerce.number().int().positive().optional(),
	$skip: z.coerce.number().int().nonnegative().optional(),
	$select: z.string().optional(),
	$orderby: z.string().optional(),
	$count: z.coerce.boolean().optional(),
});

export type ODataQuery = z.infer<typeof ODataQuerySchema>;

const OrganizationsGetInputSchema = ODataQuerySchema;

export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;

const OrganizationsGetResponseSchema = z.object({
	value: z.array(z.record(z.string(), z.unknown())),
	'@odata.count': z.number().optional(),
});

export type OrganizationsGetResponse = z.infer<
	typeof OrganizationsGetResponseSchema
>;

export type TwentyOneRiskEndpointInputs = {
	organizationsGet: OrganizationsGetInput;
};

export type TwentyOneRiskEndpointOutputs = {
	organizationsGet: OrganizationsGetResponse;
};

export const TwentyOneRiskEndpointInputSchemas = {
	organizationsGet: OrganizationsGetInputSchema,
} as const;

export const TwentyOneRiskEndpointOutputSchemas = {
	organizationsGet: OrganizationsGetResponseSchema,
} as const;
