import { z } from 'zod';

const QueryValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.union([z.string(), z.number(), z.boolean()])),
]);

export const FreshdeskRouteInputSchema = z
	.object({
		pathParams: z.record(z.string(), z.string()).optional(),
		query: z.record(z.string(), QueryValueSchema).optional(),
		// Freshdesk documents different JSON fields for each route, including
		// tenant-defined custom fields. This accepts JSON values only; each
		// operation separately validates its exact path-parameter set.
		body: z.record(z.string(), z.json()).optional(),
		attachments: z
			.array(
				z
					.object({
						filename: z.string().min(1),
						contentType: z.string().min(1),
						base64: z.string().min(1),
					})
					.strict(),
			)
			.optional(),
	})
	.strict()
	.superRefine((input, ctx) => {
		const perPageValue = input.query?.per_page;
		const perPage =
			typeof perPageValue === 'number' || typeof perPageValue === 'string'
				? Number(perPageValue)
				: undefined;
		if (
			perPage !== undefined &&
			(!Number.isInteger(perPage) || perPage < 1 || perPage > 100)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['query', 'per_page'],
				message: 'Freshdesk page size must be between 1 and 100',
			});
		}
		const pageValue = input.query?.page;
		const page =
			typeof pageValue === 'number' || typeof pageValue === 'string'
				? Number(pageValue)
				: undefined;
		if (page !== undefined && (!Number.isInteger(page) || page < 1)) {
			ctx.addIssue({
				code: 'custom',
				path: ['query', 'page'],
				message: 'Freshdesk page numbers start at 1',
			});
		}
	});

// Freshdesk JSON response shapes vary by resource; Zod validates that the
// response is JSON before returning it, while preserving documented fields.
export const FreshdeskRouteOutputSchema = z.union([z.json(), z.undefined()]);

export type FreshdeskRouteInput = z.infer<typeof FreshdeskRouteInputSchema>;
export type FreshdeskRouteOutput = z.infer<typeof FreshdeskRouteOutputSchema>;

export type FreshdeskRouteDefinition = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	title: string;
	source: string;
	pathParams: readonly string[];
	requiredQuery: readonly string[];
	queryDefaults: Readonly<Record<string, string>>;
	multipart: boolean;
};

export function createFreshdeskRouteInputSchema(
	definition: FreshdeskRouteDefinition,
) {
	const pathParamsSchema = definition.pathParams.length
		? z
				.object(
					Object.fromEntries(
						definition.pathParams.map((name) => [name, z.string().min(1)]),
					),
				)
				.strict()
		: z.object({}).strict().optional();
	const querySchema = z.record(z.string(), QueryValueSchema);
	const routeQuerySchema = definition.requiredQuery.length
		? querySchema.superRefine((query, ctx) => {
				for (const name of definition.requiredQuery) {
					if (!(name in query)) {
						ctx.addIssue({
							code: 'custom',
							path: [name],
							message: `Missing required query parameter: ${name}`,
						});
					}
				}
			})
		: querySchema.optional();
	return z
		.object({
			pathParams: pathParamsSchema,
			query: routeQuerySchema,
			body: z.record(z.string(), z.json()).optional(),
			attachments: z
				.array(
					z
						.object({
							filename: z.string().min(1),
							contentType: z.string().min(1),
							base64: z.string().min(1),
						})
						.strict(),
				)
				.optional(),
		})
		.strict()
		.superRefine((input, ctx) => {
			const perPageValue = input.query?.per_page;
			const perPage =
				typeof perPageValue === 'number' || typeof perPageValue === 'string'
					? Number(perPageValue)
					: undefined;
			if (
				perPage !== undefined &&
				(!Number.isInteger(perPage) || perPage < 1 || perPage > 100)
			) {
				ctx.addIssue({
					code: 'custom',
					path: ['query', 'per_page'],
					message: 'Freshdesk page size must be between 1 and 100',
				});
			}
			const pageValue = input.query?.page;
			const page =
				typeof pageValue === 'number' || typeof pageValue === 'string'
					? Number(pageValue)
					: undefined;
			if (page !== undefined && (!Number.isInteger(page) || page < 1)) {
				ctx.addIssue({
					code: 'custom',
					path: ['query', 'page'],
					message: 'Freshdesk page numbers start at 1',
				});
			}
		});
}

export type FreshdeskEndpointInputs = {
	route: FreshdeskRouteInput;
};

export type FreshdeskEndpointOutputs = {
	route: FreshdeskRouteOutput;
};

export const FreshdeskEndpointInputSchemas = {
	route: FreshdeskRouteInputSchema,
} as const;

export const FreshdeskEndpointOutputSchemas = {
	route: FreshdeskRouteOutputSchema,
} as const;
