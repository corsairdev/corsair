import { z } from 'zod';

const EmptyInputSchema = z.object({}).strict();

const CustomFieldSchema = z
	.object({
		name: z.string(),
		value: z.string(),
	})
	.strict();

const SourceMarketingSchema = z
	.object({
		source: z.string().optional(),
		medium: z.string().optional(),
		campaign: z.string().optional(),
		term: z.string().optional(),
		content: z.string().optional(),
	})
	.strict();

// Fields from GoDial's Contact - Add reference (godial.stoplight.io); phone and listId are required.
const AddContactInputSchema = z
	.object({
		name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().min(1),
		secondPhone: z.string().optional(),
		companyName: z.string().optional(),
		note: z.string().optional(),
		remarks: z.string().optional(),
		extra: z.string().optional(),
		assignmentMode: z.enum(['default', 'roundrobin']).optional(),
		customFields: z.array(CustomFieldSchema).optional(),
		listId: z.string().min(1),
		accountsId: z.string().optional(),
		source: z.string().optional(),
		address: z.string().optional(),
		source_marketing: SourceMarketingSchema.optional(),
	})
	.strict();

// unknown because the official overview does not specify response fields or nested values.
function isJsonValue(value: unknown): boolean {
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'boolean'
	) {
		return true;
	}
	if (typeof value === 'number') return Number.isFinite(value);
	if (Array.isArray(value)) return value.every(isJsonValue);
	if (typeof value !== 'object') return false;
	for (const key of Object.keys(value)) {
		// unknown because object properties are untrusted until recursively checked.
		const propertyValue: unknown = Reflect.get(value, key);
		if (!isJsonValue(propertyValue)) return false;
	}
	return true;
}

const GoDialResponseSchema = z.custom<unknown>(
	isJsonValue,
	'Expected JSON value',
);

export const GoDialEndpointInputSchemas = {
	listsList: EmptyInputSchema,
	contactsAdd: AddContactInputSchema,
} as const;

export const GoDialEndpointOutputSchemas = {
	listsList: GoDialResponseSchema,
	contactsAdd: GoDialResponseSchema,
} as const;

export type GoDialEndpointInputs = {
	listsList: z.infer<typeof GoDialEndpointInputSchemas.listsList>;
	contactsAdd: z.infer<typeof GoDialEndpointInputSchemas.contactsAdd>;
};

// unknown because the published overview gives no response fields to expose as a stable type.
export type GoDialEndpointOutputs = {
	listsList: unknown;
	contactsAdd: unknown;
};

export type AddContactInput = GoDialEndpointInputs['contactsAdd'];
