import { z } from 'zod';
import { flutterwaveRoutes } from './routes';

const QueryParamSchema = z.union([z.string(), z.number(), z.boolean()]);

export const FlutterwaveRequestInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()).optional(),
		query: z.record(z.string(), QueryParamSchema).optional(),
		headers: z.record(z.string(), z.string()).optional(),
	})
	.catchall(z.unknown());

const FlutterwaveResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
		meta: z.record(z.string(), z.unknown()).optional(),
		data: z.unknown().optional(),
	})
	.catchall(z.unknown());

const BeneficiaryBodySchema = z.object({
	account_number: z.string().min(1),
	account_bank: z.string().min(1),
	beneficiary_name: z.string().min(1),
});

const BulkVirtualAccountEntrySchema = z
	.object({
		firstname: z.string().min(1),
		lastname: z.string().min(1),
		email: z.string().email(),
		bvn: z.string().min(1).optional(),
		nin: z.string().min(1).optional(),
	})
	.refine((value) => Boolean(value.bvn || value.nin), {
		message: 'either bvn or nin is required',
	});

const BulkVirtualAccountsBodySchema = z.object({
	batch_ref: z.string().min(1),
	bulk_data: z.array(BulkVirtualAccountEntrySchema).min(1),
	is_permanent: z.boolean().optional(),
});

const BulkTokenizedChargePathSchema = z.object({
	bulk_id: z.number().int().positive(),
});

const RouteSpecificInputSchemas = {
	createBeneficiary: FlutterwaveRequestInputSchema.extend({
		body: BeneficiaryBodySchema.optional(),
	}).catchall(z.unknown()),
	createBulkVirtualAccountNumbers: FlutterwaveRequestInputSchema.extend({
		body: BulkVirtualAccountsBodySchema.optional(),
	}).catchall(z.unknown()),
	getBulkTokenizedCharge: FlutterwaveRequestInputSchema.extend({
		bulk_id: BulkTokenizedChargePathSchema.shape.bulk_id,
	}).catchall(z.unknown()),
} as const;

type RouteKey = (typeof flutterwaveRoutes)[number]['key'];

type InputSchemaMap = {
	[K in RouteKey]: typeof FlutterwaveRequestInputSchema;
};

type OutputSchemaMap = {
	[K in RouteKey]: typeof FlutterwaveResponseSchema;
};

function asSchemaMap<TSchema extends z.ZodTypeAny>(
	schema: TSchema,
): { [K in RouteKey]: TSchema } {
	return Object.fromEntries(
		flutterwaveRoutes.map((route) => [route.key, schema]),
	) as { [K in RouteKey]: TSchema };
}

export const FlutterwaveEndpointInputSchemas: InputSchemaMap = asSchemaMap(
	FlutterwaveRequestInputSchema,
);

for (const [key, schema] of Object.entries(RouteSpecificInputSchemas)) {
	FlutterwaveEndpointInputSchemas[key as RouteKey] =
		schema as (typeof FlutterwaveEndpointInputSchemas)[RouteKey];
}

export const FlutterwaveEndpointOutputSchemas: OutputSchemaMap = asSchemaMap(
	FlutterwaveResponseSchema,
);

export type FlutterwaveEndpointInputs = {
	[K in keyof typeof FlutterwaveEndpointInputSchemas]: z.infer<
		(typeof FlutterwaveEndpointInputSchemas)[K]
	>;
};

export type FlutterwaveEndpointOutputs = {
	[K in keyof typeof FlutterwaveEndpointOutputSchemas]: z.infer<
		(typeof FlutterwaveEndpointOutputSchemas)[K]
	>;
};

export type FlutterwaveEndpointInput =
	FlutterwaveEndpointInputs[keyof FlutterwaveEndpointInputs] & {
		[key: string]: unknown;
	};
