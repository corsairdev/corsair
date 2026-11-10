import { z } from 'zod';

const objectType = z.enum(['ACCOUNT', 'CONTACT', 'DEAL', 'LEAD']);
const uploadObjectType = z.enum([
	'ACCOUNT',
	'CONTACT',
	'DEAL',
	'LEAD',
	'BUSINESS_USER',
	'STAGE',
]);
const field = z
	.object({
		uniqueName: z.string(),
		label: z.string(),
		type: z.enum([
			'DATE',
			'DATETIME',
			'NUMBER',
			'PERCENT',
			'CURRENCY',
			'ID',
			'URL',
			'STRING',
			'BOOLEAN',
			'PHONENUMBER',
			'EMAILADDRESS',
			'PICKLIST',
			'REFERENCE',
			'STRINGARRAY',
		]),
		lastModified: z.string().optional(),
		isDeleted: z.boolean().optional(),
		referenceTo: z.string().optional(),
		orderedValueList: z.array(z.string()).optional(),
	})
	.passthrough();
// The same field as Gong returns it: a field type added later must not fail the read.
const returnedField = field.extend({ type: z.string() });
const integration = z.record(z.string(), z.unknown());
const requestResponse = z.object({ requestId: z.string() }).passthrough();
const asyncResponse = z
	.object({ requestId: z.string(), clientRequestId: z.string() })
	.passthrough();

export const GongCrmInputSchemas = {
	listIntegrations: z.object({}),
	registerIntegration: z.object({
		name: z.string(),
		ownerEmail: z.string().email(),
	}),
	deleteIntegration: z.object({
		integrationId: z.number().int().nonnegative(),
		clientRequestId: z.string().regex(/^[A-Za-z0-9_-]+$/),
	}),
	listSchemaFields: z.object({
		integrationId: z.number().int().nonnegative(),
		objectType,
	}),
	uploadSchemaFields: z.object({
		integrationId: z.number().int().nonnegative(),
		objectType,
		fields: z.array(field),
	}),
	getObjects: z.object({
		integrationId: z.number().int().nonnegative(),
		objectType,
		objectsCrmIds: z.array(z.string()).min(1).max(100),
	}),
	uploadObjects: z.object({
		integrationId: z.number().int().nonnegative(),
		objectType: uploadObjectType,
		clientRequestId: z.string().regex(/^[A-Za-z0-9_-]+$/),
		dataFile: z.instanceof(Blob),
	}),
	getRequestStatus: z.object({
		integrationId: z.number().int().nonnegative(),
		clientRequestId: z.string(),
	}),
} as const;

export const GongCrmOutputSchemas = {
	listIntegrations: z
		.object({ requestId: z.string(), integrations: z.array(integration) })
		.passthrough(),
	registerIntegration: z
		.object({ requestId: z.string(), integrationId: z.number() })
		.passthrough(),
	deleteIntegration: asyncResponse,
	listSchemaFields: z
		.object({
			requestId: z.string(),
			objectTypeToSelectedFields: z.record(z.string(), z.array(returnedField)),
		})
		.passthrough(),
	uploadSchemaFields: requestResponse,
	getObjects: z
		.object({
			requestId: z.string(),
			// CRM id -> the object's fields (name -> value of any JSON type), or null when Gong has no such object.
			crmObjectsMap: z.record(
				z.string(),
				z.record(z.string(), z.unknown()).nullable(),
			),
		})
		.passthrough(),
	uploadObjects: asyncResponse,
	getRequestStatus: z
		.object({
			requestId: z.string(),
			status: z.string(),
			errors: z
				.array(
					z
						.object({
							line: z.number().int().optional(),
							description: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
			totalErrorCount: z.number().int().optional(),
			totalSuccessCount: z.number().int().optional(),
		})
		.passthrough(),
} as const;

export type GongCrmInputs = {
	[K in keyof typeof GongCrmInputSchemas]: z.infer<
		(typeof GongCrmInputSchemas)[K]
	>;
};
export type GongCrmOutputs = {
	[K in keyof typeof GongCrmOutputSchemas]: z.infer<
		(typeof GongCrmOutputSchemas)[K]
	>;
};
