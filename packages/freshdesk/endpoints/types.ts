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
	bodyFields: readonly FreshdeskBodyFieldDefinition[];
	multipart: boolean;
	multipartField?: string;
	multipartMaxFiles?: number;
};

export type FreshdeskBodyFieldDefinition = {
	name: string;
	type:
		| 'string'
		| 'number'
		| 'boolean'
		| 'stringArray'
		| 'numberArray'
		| 'jsonArray'
		| 'object'
		| 'json';
};

export function defineFreshdeskBodyFields(
	fields: FreshdeskBodyFieldDefinition[],
): readonly FreshdeskBodyFieldDefinition[] {
	return fields;
}

function bodyFieldSchema(type: FreshdeskBodyFieldDefinition['type']) {
	switch (type) {
		case 'string':
			return z.string().nullable();
		case 'number':
			return z.number().nullable();
		case 'boolean':
			return z.boolean().nullable();
		case 'stringArray':
			return z.array(z.string()).nullable();
		case 'numberArray':
			return z.array(z.number()).nullable();
		case 'jsonArray':
			return z.array(z.json()).nullable();
		case 'object':
			return z.record(z.string(), z.json()).nullable();
		case 'json':
			return z.json();
	}
}

export function createFreshdeskRouteInputSchema(
	definition: FreshdeskRouteDefinition,
): z.ZodType<FreshdeskRouteInput> {
	return FreshdeskRouteInputSchema.superRefine((input, ctx) => {
		const expectedPathParams = new Set(definition.pathParams);
		const receivedPathParams = Object.keys(input.pathParams ?? {});
		if (
			receivedPathParams.length !== expectedPathParams.size ||
			receivedPathParams.some((name) => !expectedPathParams.has(name))
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['pathParams'],
				message: 'Path parameters must match the selected Freshdesk v2 route',
			});
		}
		for (const name of definition.requiredQuery) {
			if (!(name in (input.query ?? {}))) {
				ctx.addIssue({
					code: 'custom',
					path: ['query', name],
					message: `Missing required query parameter: ${name}`,
				});
			}
		}
		if (input.attachments?.length && !definition.multipart) {
			ctx.addIssue({
				code: 'custom',
				path: ['attachments'],
				message:
					'This Freshdesk route does not document multipart file uploads',
			});
		}
		if (
			definition.multipartMaxFiles !== undefined &&
			(input.attachments?.length ?? 0) > definition.multipartMaxFiles
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['attachments'],
				message: `This Freshdesk route accepts at most ${definition.multipartMaxFiles} file upload(s)`,
			});
		}
		if (
			definition.multipartField === 'avatar' &&
			input.attachments?.length &&
			input.body?.avatar !== undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['body', 'avatar'],
				message:
					'Provide the contact avatar as a file, not both a file and JSON object',
			});
		}
		const allowedBodyFields = new Map(
			definition.bodyFields.map((field) => [field.name, field.type]),
		);
		for (const [name, value] of Object.entries(input.body ?? {})) {
			const fieldType = allowedBodyFields.get(name);
			if (!fieldType) {
				ctx.addIssue({
					code: 'custom',
					path: ['body', name],
					message: `Undocumented Freshdesk request field: ${name}`,
				});
				continue;
			}
			if (!bodyFieldSchema(fieldType).safeParse(value).success) {
				ctx.addIssue({
					code: 'custom',
					path: ['body', name],
					message: `Invalid value for Freshdesk request field: ${name}`,
				});
			}
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
