import { z } from 'zod';
import type { FlutterwaveRoute } from './routes';
import { flutterwaveRoutes } from './routes';

const QueryParamSchema = z.union([z.string(), z.number(), z.boolean()]);

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

const CustomerSchema = z
	.object({
		email: z.string().min(1),
		name: z.string().optional(),
		phonenumber: z.string().optional(),
	})
	.loose();

const AmountSchema = z.union([z.string().min(1), z.number()]);
const IdSchema = z.union([z.string().min(1), z.number()]);

type RouteKey = (typeof flutterwaveRoutes)[number]['key'];

const RequiredFields = {
	createBeneficiary: ['account_number', 'account_bank', 'beneficiary_name'],
	createBulkTokenizedCharge: ['title', 'bulk_data'],
	createBulkVirtualAccountNumbers: ['batch_ref', 'bulk_data'],
	createPaymentLink: ['tx_ref', 'amount', 'customer'],
	createPaymentPlan: ['amount', 'name', 'interval'],
	createRefund: [],
	createSubaccount: [
		'account_bank',
		'account_number',
		'business_name',
		'split_value',
		'country',
		'business_mobile',
	],
	createVirtualAccount: ['email', 'firstname', 'lastname'],
	initiateBvnVerification: ['bvn', 'firstname', 'lastname'],
	initiateMobileMoneyTanzania: [
		'type',
		'tx_ref',
		'amount',
		'currency',
		'email',
		'phone_number',
	],
	resolveBankAccount: ['account_number', 'account_bank'],
	verifyTransactionByReference: ['tx_ref'],
	getTransactionFee: ['amount', 'currency'],
	getTransferFee: ['amount', 'currency'],
	getTransferRates: ['amount', 'destination_currency', 'source_currency'],
	validateBillItem: ['customer'],
} as const satisfies Partial<Record<RouteKey, readonly string[]>>;

const FieldSchemas: Record<string, z.ZodTypeAny> = {
	account_bank: z.string().min(1),
	account_number: z.string().min(1),
	amount: AmountSchema,
	batch_ref: z.string().min(1),
	beneficiary_name: z.string().min(1),
	// unknown is necessary because tokenized-charge rows accept leftover provider keys; a closed item union is infeasible because batch entries vary by payment method
	bulk_data: z.array(z.record(z.string(), z.unknown())).min(1),
	business_mobile: z.string().min(1),
	business_name: z.string().min(1),
	bvn: z.string().min(1),
	country: z.string().min(1),
	currency: z.string().min(1),
	customer: z.union([CustomerSchema, z.string().min(1)]),
	destination_currency: z.string().min(1),
	email: z.string().email(),
	firstname: z.string().min(1),
	interval: z.string().min(1),
	lastname: z.string().min(1),
	name: z.string().min(1),
	phone_number: z.string().min(1),
	source_currency: z.string().min(1),
	split_value: z.number(),
	title: z.string().min(1),
	tx_ref: z.string().min(1),
	type: z.string().min(1),
};

function fieldSchema(
	key: string,
	// unknown is necessary because leftover fixture values are untyped JSON; a closed primitive union is infeasible because optional extras vary by operation
	example?: unknown,
): z.ZodTypeAny {
	if (FieldSchemas[key]) return FieldSchemas[key];
	if (typeof example === 'string') return z.string().min(1);
	if (typeof example === 'number') return z.number();
	if (typeof example === 'boolean') return z.boolean();
	if (Array.isArray(example)) {
		// unknown is necessary because leftover fixture arrays have no element catalog; a closed item type is infeasible without a per-field OpenAPI pin
		return z.array(z.unknown());
	}
	if (example && typeof example === 'object') {
		// unknown is necessary because leftover fixture objects are untyped JSON; a closed field union is infeasible for optional extras
		return z.record(z.string(), z.unknown());
	}
	// unknown is necessary because leftover fixture scalars are untyped JSON; a closed fallback union is infeasible because optional extras are shared
	return z.unknown();
}

function pathParamSchema(key: string): z.ZodTypeAny {
	if (key === 'bulk_id') {
		return z.number().int().positive();
	}
	return IdSchema;
}

function requiredFieldsFor(route: FlutterwaveRoute): readonly string[] {
	return RequiredFields[route.key as keyof typeof RequiredFields] ?? [];
}

function buildInputSchema(route: FlutterwaveRoute): z.ZodTypeAny {
	const pathShape: Record<string, z.ZodTypeAny> = {};
	for (const key of route.pathParams ?? []) {
		pathShape[key] = pathParamSchema(key);
	}

	const required = new Set(requiredFieldsFor(route));
	const queryRequired: Record<string, z.ZodTypeAny> = {};
	const queryOptional: Record<string, z.ZodTypeAny> = {};
	for (const key of route.queryParams ?? []) {
		const schema = fieldSchema(key, route.testInput?.[key]);
		if (required.has(key)) {
			queryRequired[key] = schema;
		} else {
			queryOptional[key] = schema.optional();
		}
	}

	const pathAndQuery = new Set([
		...(route.pathParams ?? []),
		...(route.queryParams ?? []),
	]);
	const requiredBodyShape: Record<string, z.ZodTypeAny> = {};
	const optionalBodyShape: Record<string, z.ZodTypeAny> = {};
	for (const key of required) {
		if (pathAndQuery.has(key)) continue;
		requiredBodyShape[key] = fieldSchema(key, route.testInput?.[key]);
	}
	for (const [key, value] of Object.entries(route.testInput ?? {})) {
		if (pathAndQuery.has(key) || required.has(key)) continue;
		optionalBodyShape[key] = fieldSchema(key, value).optional();
	}

	const controls = {
		query: z.record(z.string(), QueryParamSchema).optional(),
		// unknown is necessary because nested body bags carry leftover provider fields; a closed extra-key union is infeasible because each write op adds different optional properties
		body: z.record(z.string(), z.unknown()).optional(),
	};

	if (Object.keys(requiredBodyShape).length > 0) {
		return z.union([
			z
				.object({
					...pathShape,
					...queryRequired,
					...queryOptional,
					...requiredBodyShape,
					...optionalBodyShape,
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

const BeneficiaryDataSchema = z
	.object({
		id: IdSchema.optional(),
		account_number: z.string().optional(),
		bank_name: z.string().optional(),
		full_name: z.string().optional(),
	})
	.loose();
const PaymentPlanDataSchema = z
	.object({
		id: IdSchema.optional(),
		name: z.string().optional(),
		amount: AmountSchema.optional(),
		interval: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
const RefundDataSchema = z
	.object({
		id: IdSchema.optional(),
		amount: AmountSchema.optional(),
		status: z.string().optional(),
		tx_id: IdSchema.optional(),
	})
	.loose();
const SubaccountDataSchema = z
	.object({
		id: IdSchema.optional(),
		account_number: z.string().optional(),
		business_name: z.string().optional(),
		split_value: z.number().optional(),
	})
	.loose();
const VirtualAccountDataSchema = z
	.object({
		account_number: z.string().optional(),
		bank_name: z.string().optional(),
		order_ref: z.string().optional(),
		flw_ref: z.string().optional(),
		amount: AmountSchema.optional(),
	})
	.loose();
const TransactionDataSchema = z
	.object({
		id: IdSchema.optional(),
		tx_ref: z.string().optional(),
		flw_ref: z.string().optional(),
		status: z.string().optional(),
		amount: AmountSchema.optional(),
		currency: z.string().optional(),
	})
	.loose();
const TransferDataSchema = z
	.object({
		id: IdSchema.optional(),
		amount: AmountSchema.optional(),
		status: z.string().optional(),
		reference: z.string().optional(),
	})
	.loose();
const SettlementDataSchema = z
	.object({
		id: IdSchema.optional(),
		amount: AmountSchema.optional(),
		status: z.string().optional(),
	})
	.loose();
const ChargeDataSchema = z
	.object({
		id: IdSchema.optional(),
		tx_ref: z.string().optional(),
		flw_ref: z.string().optional(),
		status: z.string().optional(),
		amount: AmountSchema.optional(),
		currency: z.string().optional(),
	})
	.loose();

const OutputDataSchemas = {
	cancelPaymentPlan: PaymentPlanDataSchema,
	createBeneficiary: BeneficiaryDataSchema,
	createBulkTokenizedCharge: z
		.object({
			id: IdSchema.optional(),
			status: z.string().optional(),
		})
		.loose(),
	createBulkVirtualAccountNumbers: z
		.object({
			batch_id: z.string().optional(),
			response_code: z.string().optional(),
		})
		.loose(),
	createPaymentLink: z
		.object({
			link: z.string().optional(),
		})
		.loose(),
	createPaymentPlan: PaymentPlanDataSchema,
	createRefund: RefundDataSchema,
	createSubaccount: SubaccountDataSchema,
	createVirtualAccount: VirtualAccountDataSchema,
	deleteBeneficiary: z.object({ id: IdSchema.optional() }).loose(),
	deleteSubaccount: z.object({ id: IdSchema.optional() }).loose(),
	disablePaymentLink: z
		.object({
			id: IdSchema.optional(),
			status: z.string().optional(),
		})
		.loose(),
	fetchBeneficiary: BeneficiaryDataSchema,
	fetchSubaccount: SubaccountDataSchema,
	generateTransactionReference: z
		.object({
			tx_ref: z.string().optional(),
			reference: z.string().optional(),
		})
		.loose(),
	getAllSubscriptions: z.array(
		z
			.object({
				id: IdSchema.optional(),
				status: z.string().optional(),
				// unknown is necessary because subscription customer objects vary by plan product; a closed customer union is infeasible because Flutterwave does not version-pin that payload
				customer: z.unknown().optional(),
				plan: IdSchema.optional(),
			})
			.loose(),
	),
	getAllWalletBalances: z.array(
		z
			.object({
				currency: z.string().optional(),
				available_balance: AmountSchema.optional(),
			})
			.loose(),
	),
	getBalancesPerCurrency: z
		.object({
			currency: z.string().optional(),
			available_balance: AmountSchema.optional(),
		})
		.loose(),
	getBankBranches: z.array(
		z
			.object({
				id: IdSchema.optional(),
				branch_name: z.string().optional(),
				branch_code: z.string().optional(),
			})
			.loose(),
	),
	getBanksByCountry: z.array(
		z
			.object({
				id: IdSchema.optional(),
				code: z.string().optional(),
				name: z.string().optional(),
			})
			.loose(),
	),
	getBillCategories: z.array(
		z
			.object({
				id: IdSchema.optional(),
				name: z.string().optional(),
			})
			.loose(),
	),
	getBulkTokenizedCharge: z
		.object({
			id: IdSchema.optional(),
			status: z.string().optional(),
			pending: z.number().optional(),
		})
		.loose(),
	getBulkVirtualAccount: z
		.object({
			batch_id: z.string().optional(),
			status: z.string().optional(),
		})
		.loose(),
	getMultipleRefundTransactions: z.array(RefundDataSchema),
	getPaymentPlan: PaymentPlanDataSchema,
	getPaymentPlans: z.array(PaymentPlanDataSchema),
	getRefund: RefundDataSchema,
	getTransaction: TransactionDataSchema,
	getTransactionFee: z
		.object({
			charge_amount: AmountSchema.optional(),
			fee: AmountSchema.optional(),
			merchant_fee: AmountSchema.optional(),
		})
		.loose(),
	getTransferFee: z
		.object({
			fee: AmountSchema.optional(),
			currency: z.string().optional(),
		})
		.loose(),
	getTransferRates: z
		.object({
			rate: AmountSchema.optional(),
			// unknown is necessary because transfer rate legs mix numeric and object quotes; a closed quote union is infeasible because v3 rate payloads are not version-pinned
			source: z.unknown().optional(),
			destination: z.unknown().optional(),
		})
		.loose(),
	getVirtualAccountNumber: VirtualAccountDataSchema,
	getWalletStatement: z.array(
		z
			.object({
				type: z.string().optional(),
				amount: AmountSchema.optional(),
				currency: z.string().optional(),
				created_at: z.string().optional(),
			})
			.loose(),
	),
	initiateBvnVerification: z
		.object({
			url: z.string().optional(),
			reference: z.string().optional(),
		})
		.loose(),
	initiateMobileMoneyTanzania: ChargeDataSchema,
	listAllBeneficiaries: z.array(BeneficiaryDataSchema),
	listSubaccounts: z.array(SubaccountDataSchema),
	listBillerProducts: z.array(
		z
			.object({
				item_code: z.string().optional(),
				name: z.string().optional(),
				amount: AmountSchema.optional(),
			})
			.loose(),
	),
	listBillers: z.array(
		z
			.object({
				name: z.string().optional(),
				biller_code: z.string().optional(),
			})
			.loose(),
	),
	listChargebacks: z.array(
		z
			.object({
				id: IdSchema.optional(),
				amount: AmountSchema.optional(),
				status: z.string().optional(),
			})
			.loose(),
	),
	listPayoutSubaccountRefunds: z.array(RefundDataSchema),
	listPayoutSubaccounts: z.array(
		z
			.object({
				id: IdSchema.optional(),
				account_reference: z.string().optional(),
			})
			.loose(),
	),
	listRecurringBills: z.array(
		z
			.object({
				id: IdSchema.optional(),
				status: z.string().optional(),
			})
			.loose(),
	),
	listTransfers: z.array(TransferDataSchema),
	listSettlements: z.array(SettlementDataSchema),
	resolveBankAccount: z
		.object({
			account_number: z.string().optional(),
			account_name: z.string().optional(),
		})
		.loose(),
	resolveCardBin: z
		.object({
			issuing_country: z.string().optional(),
			bin: z.string().optional(),
			card_type: z.string().optional(),
			issuer: z.string().optional(),
		})
		.loose(),
	getAllTransactions: z.array(TransactionDataSchema),
	updatePaymentPlan: PaymentPlanDataSchema,
	updateSubaccount: SubaccountDataSchema,
	validateBillItem: z
		.object({
			response_code: z.string().optional(),
			response_message: z.string().optional(),
			name: z.string().optional(),
		})
		.loose(),
	verifyTransactionByReference: TransactionDataSchema,
	viewTransactionTimeline: z.array(
		z
			.object({
				note: z.string().optional(),
				action: z.string().optional(),
			})
			.loose(),
	),
} as const satisfies Record<RouteKey, z.ZodTypeAny>;

function buildOutputSchema(route: FlutterwaveRoute): z.ZodTypeAny {
	return envelope(OutputDataSchemas[route.key as RouteKey]);
}

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
