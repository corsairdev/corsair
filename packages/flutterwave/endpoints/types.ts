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
