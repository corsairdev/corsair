import { z } from 'zod';
import type { FlutterwaveRoute } from './routes';
import { flutterwaveRoutes } from './routes';

const QueryParamSchema = z.union([z.string(), z.number(), z.boolean()]);
const PaginationKeys = new Set(['page', 'from', 'to', 'limit', 'next_cursor']);

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

function schemaForValue(
	// unknown is necessary because route fixtures are JSON values; a closed primitive union is infeasible because provider examples can add new nested shapes
	value: unknown,
): z.ZodTypeAny {
	if (typeof value === 'string') return z.string().min(1);
	if (typeof value === 'number') return z.number();
	if (typeof value === 'boolean') return z.boolean();
	if (Array.isArray(value)) {
		if (value.length === 0) {
			// unknown is necessary because empty fixture arrays have no element to infer; a closed item type is infeasible without a per-field catalog
			return z.array(z.unknown());
		}
		return z.array(schemaForValue(value[0]));
	}
	if (value && typeof value === 'object') {
		return z
			.object(
				Object.fromEntries(
					Object.entries(value).map(([key, nested]) => [
						key,
						schemaForValue(nested),
					]),
				),
			)
			.loose();
	}
	// unknown is necessary because leftover fixture scalars are untyped JSON; a closed fallback union is infeasible because the generator is shared
	return z.unknown();
}

function pathParamSchema(key: string): z.ZodTypeAny {
	if (key === 'bulk_id') {
		return z.number().int().positive();
	}
	return z.union([z.string().min(1), z.number()]);
}

function buildInputSchema(route: FlutterwaveRoute): z.ZodTypeAny {
	const pathShape: Record<string, z.ZodTypeAny> = {};
	for (const key of route.pathParams ?? []) {
		pathShape[key] = pathParamSchema(key);
	}

	const queryRequired: Record<string, z.ZodTypeAny> = {};
	const queryOptional: Record<string, z.ZodTypeAny> = {};
	for (const key of route.queryParams ?? []) {
		const example = route.testInput?.[key];
		if (example !== undefined && !PaginationKeys.has(key)) {
			queryRequired[key] = schemaForValue(example);
		} else {
			queryOptional[key] = QueryParamSchema.optional();
		}
	}

	const pathAndQuery = new Set([
		...(route.pathParams ?? []),
		...(route.queryParams ?? []),
	]);
	const bodyEntries = Object.entries(route.testInput ?? {}).filter(
		([key]) => !pathAndQuery.has(key),
	);
	const requiredBodyShape = Object.fromEntries(
		bodyEntries.map(([key, value]) => [key, schemaForValue(value)]),
	);
	const optionalBodyShape = Object.fromEntries(
		bodyEntries.map(([key, value]) => [key, schemaForValue(value).optional()]),
	);

	const controls = {
		query: z.record(z.string(), QueryParamSchema).optional(),
		// unknown is necessary because nested body bags carry leftover provider fields; a closed extra-key union is infeasible because each write op adds different optional properties
		body: z.record(z.string(), z.unknown()).optional(),
	};

	const requireWriteBody =
		route.method === 'POST' && Object.keys(requiredBodyShape).length > 0;

	if (requireWriteBody) {
		return z.union([
			z
				.object({
					...pathShape,
					...queryRequired,
					...queryOptional,
					...requiredBodyShape,
					...controls,
				})
				.loose(),
			z
				.object({
					...pathShape,
					...queryRequired,
					...queryOptional,
					query: controls.query,
					body: z.object(requiredBodyShape).loose(),
				})
				.loose(),
		]);
	}

	return z
		.object({
			...pathShape,
			...queryRequired,
			...queryOptional,
			...optionalBodyShape,
			...controls,
		})
		.loose();
}

const PaymentLinkDataSchema = z
	.object({
		link: z.string().optional(),
	})
	.loose();

const TransactionDataSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		tx_ref: z.string().optional(),
		status: z.string().optional(),
		amount: z.number().optional(),
		currency: z.string().optional(),
	})
	.loose();

const ListDataSchema = z.union([
	// unknown is necessary because list rows differ by resource; a closed item union is infeasible because Flutterwave does not version-pin list element shapes
	z.array(z.unknown()),
	// unknown is necessary because some list endpoints wrap rows in an object; a closed wrapper union is infeasible because paging envelopes differ by product
	z.record(z.string(), z.unknown()),
]);

// unknown is necessary because resource payloads differ by operation; a closed field union is infeasible because v3 resources are not published as one schema
const ResourceDataSchema = z.record(z.string(), z.unknown());

function envelope(data: z.ZodTypeAny) {
	return z
		.object({
			status: z.string(),
			message: z.string().optional(),
			// unknown is necessary because Flutterwave meta keys vary by product; a closed key union is infeasible because v3 does not publish a stable meta catalog
			meta: z.record(z.string(), z.unknown()).optional(),
			data: data.optional(),
		})
		.loose();
}

function isListRoute(route: FlutterwaveRoute): boolean {
	return (
		route.name === 'list' ||
		route.name.startsWith('list') ||
		route.key.startsWith('list') ||
		route.key.startsWith('getAll') ||
		route.key.startsWith('getMultiple')
	);
}

function buildOutputSchema(route: FlutterwaveRoute): z.ZodTypeAny {
	if (route.key === 'createPaymentLink') {
		return envelope(PaymentLinkDataSchema);
	}
	if (
		route.key === 'getTransaction' ||
		route.key === 'verifyTransactionByReference'
	) {
		return envelope(TransactionDataSchema);
	}
	if (isListRoute(route)) {
		return envelope(ListDataSchema);
	}
	return envelope(ResourceDataSchema);
}

type RouteKey = (typeof flutterwaveRoutes)[number]['key'];

type InputSchemaMap = {
	[K in RouteKey]: z.ZodTypeAny;
};

type OutputSchemaMap = {
	[K in RouteKey]: z.ZodTypeAny;
};

function asSchemaMap(build: (route: FlutterwaveRoute) => z.ZodTypeAny): {
	[K in RouteKey]: z.ZodTypeAny;
} {
	return Object.fromEntries(
		flutterwaveRoutes.map((route) => [route.key, build(route)]),
	) as { [K in RouteKey]: z.ZodTypeAny };
}

export const FlutterwaveEndpointInputSchemas: InputSchemaMap =
	asSchemaMap(buildInputSchema);

export const FlutterwaveEndpointOutputSchemas: OutputSchemaMap =
	asSchemaMap(buildOutputSchema);

const createBeneficiaryFlatSchema = z
	.object({
		account_number: BeneficiaryBodySchema.shape.account_number,
		account_bank: BeneficiaryBodySchema.shape.account_bank,
		beneficiary_name: BeneficiaryBodySchema.shape.beneficiary_name,
		query: z.record(z.string(), QueryParamSchema).optional(),
		// unknown is necessary because leftover provider fields may sit beside required beneficiary keys; a closed extra-key union is infeasible because Flutterwave adds optional transfer fields over time
		body: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const createBulkVirtualAccountsFlatSchema = z
	.object({
		batch_ref: BulkVirtualAccountsBodySchema.shape.batch_ref,
		bulk_data: BulkVirtualAccountsBodySchema.shape.bulk_data,
		is_permanent: BulkVirtualAccountsBodySchema.shape.is_permanent,
		query: z.record(z.string(), QueryParamSchema).optional(),
		// unknown is necessary because leftover provider fields may sit beside required batch keys; a closed extra-key union is infeasible because bulk VA payloads are not version-pinned
		body: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

FlutterwaveEndpointInputSchemas.createBeneficiary = z.union([
	z
		.object({
			body: BeneficiaryBodySchema,
			query: z.record(z.string(), QueryParamSchema).optional(),
		})
		.loose(),
	createBeneficiaryFlatSchema,
]);

FlutterwaveEndpointInputSchemas.createBulkVirtualAccountNumbers = z.union([
	z
		.object({
			body: BulkVirtualAccountsBodySchema,
			query: z.record(z.string(), QueryParamSchema).optional(),
		})
		.loose(),
	createBulkVirtualAccountsFlatSchema,
]);

FlutterwaveEndpointInputSchemas.getBulkTokenizedCharge = z
	.object({
		bulk_id: z.number().int().positive(),
		query: z.record(z.string(), QueryParamSchema).optional(),
	})
	.loose();

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
	FlutterwaveEndpointInputs[keyof FlutterwaveEndpointInputs];
