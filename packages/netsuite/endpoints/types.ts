import { z } from 'zod';

// NetSuite record bodies vary by record type and can contain arbitrary properties.
// `z.record(z.string(), z.unknown())` is used for request bodies to allow any record fields.
// `.passthrough()` is used on input/output schemas because NetSuite API responses may
// include additional fields beyond those declared in the Zod schema.

const idSchema = z.union([z.string(), z.number()]);

// NetSuite HATEOAS links are represented as objects with rel and href strings.
// .passthrough() allows additional link properties NetSuite may include in future API versions.
const netSuiteLinkSchema = z
	.object({
		rel: z.string().optional(),
		href: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

// NetSuite collection items can contain any record type exposed by REST Web Services.
// Unknown values are used because custom and built-in record properties vary widely.
const netSuiteItemSchema = z.record(z.string(), z.unknown());

/**
 * NetSuite responses vary by record type, so unknown fields pass through. The
 * fields the plugin itself relies on are declared here to reject malformed
 * values (for example a numeric `access_token`).
 */
const passthroughResponse = z
	.object({
		id: idSchema.optional(),
		externalId: z.string().optional(),
		// NetSuite navigation links follow standard HATEOAS format with rel and href.
		links: z.array(netSuiteLinkSchema).optional(),
		// In write/job responses, location is the HTTP Location header string (record or job URL).
		// In NetSuite records (e.g. PurchaseOrder, SalesOrder, Item), location is a reference object or name.
		location: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.optional(),
		// Collection responses contain polymorphic record items varying by entity type;
		// unknown values allow arbitrary record properties to pass through safely.
		items: z.array(netSuiteItemSchema).optional(),
		count: z.number().optional(),
		offset: z.number().optional(),
		totalResults: z.number().optional(),
		hasMore: z.boolean().optional(),
		access_token: z.string().optional(),
		refresh_token: z.string().optional(),
		id_token: z.string().optional(),
		token_type: z.string().optional(),
		// NetSuite sends expires_in as the string "3600".
		expires_in: z.union([z.number(), z.string().regex(/^\d+$/)]).optional(),
		expires_at: z.number().optional(),
		scope: z.string().optional(),
		authorization_url: z.string().optional(),
		url: z.string().optional(),
		client_assertion: z.string().optional(),
		client_assertion_type: z.string().optional(),
		token_url: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const AsyncGetJobStatusInputSchema = z
	.object({
		jobId: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite async job responses may include additional fields beyond jobId.

export const AsyncGetJobStatusOutputSchema = passthroughResponse;

export const AsyncGetJobTaskInputSchema = z
	.object({
		jobId: z.union([z.string(), z.number()]),
		taskId: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite async job responses may include additional fields beyond jobId and taskId.

export const AsyncGetJobTaskOutputSchema = passthroughResponse;

export const AsyncGetJobTaskResultInputSchema = z
	.object({
		jobId: z.union([z.string(), z.number()]),
		taskId: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite async job result responses may include additional fields beyond jobId and taskId.

export const AsyncGetJobTaskResultOutputSchema = passthroughResponse;

export const CreateCustomerInputSchema = z
	.object({
		// NetSuite record bodies vary by record type; unknown values allow arbitrary record properties to pass through safely.
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite create responses may include additional fields beyond those declared.

export const CreateCustomerOutputSchema = passthroughResponse;

export const CreateCustomerPaymentInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateCustomerPaymentOutputSchema = passthroughResponse;

export const CreateEmployeeInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateEmployeeOutputSchema = passthroughResponse;

export const CreateInvoiceInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateInvoiceOutputSchema = passthroughResponse;

export const CreateItemInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		record_type: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateItemOutputSchema = passthroughResponse;

export const CreateJournalEntryInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateJournalEntryOutputSchema = passthroughResponse;

export const CreateJwtClientAssertionInputSchema = z
	.object({
		// NetSuite accepts only RSA-PSS and ECDSA signatures.
		alg: z
			.enum(['PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'])
			.optional(),
		aud: z.string().optional(),
		exp: z.number().optional(),
		iat: z.number().optional(),
		scope: z.string(),
		client_id: z.string().optional(),
		certificate_id: z.string().optional(),
		private_key_pem: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateJwtClientAssertionOutputSchema = passthroughResponse;

export const CreatePurchaseOrderInputSchema = z
	.object({
		item: z.record(z.string(), z.unknown()),
		memo: z.string().optional(),
		Prefer: z.string().optional(),
		entity: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		location: z.record(z.string(), z.unknown()).optional(),
		tranDate: z.string().optional(),
		customForm: z.record(z.string(), z.unknown()).optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreatePurchaseOrderOutputSchema = passthroughResponse;

export const CreateRecordInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		record_type: z.string(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateRecordOutputSchema = passthroughResponse;

export const CreateSalesOrderInputSchema = z
	.object({
		item: z.record(z.string(), z.unknown()),
		memo: z.string().optional(),
		Prefer: z.string().optional(),
		entity: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		tranDate: z.string().optional(),
		promocode: z.record(z.string(), z.unknown()).optional(),
		// Select fields: NetSuite takes the internal ID or a reference object ({ id }).
		customForm: z
			.union([z.string(), z.number(), z.record(z.string(), z.unknown())])
			.optional(),
		orderStatus: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.optional(),
		otherrefnum: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateSalesOrderOutputSchema = passthroughResponse;

export const CreateVendorInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateVendorOutputSchema = passthroughResponse;

export const CreateVendorBillInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const CreateVendorBillOutputSchema = passthroughResponse;

export const DeleteCustomerInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteCustomerOutputSchema = passthroughResponse;

export const DeleteCustomerPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteCustomerPaymentOutputSchema = passthroughResponse;

export const DeleteEmployeeInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteEmployeeOutputSchema = passthroughResponse;

export const DeleteInvoiceInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteInvoiceOutputSchema = passthroughResponse;

export const DeleteItemInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		item_record_type: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteItemOutputSchema = passthroughResponse;

export const DeleteItemFulfillmentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteItemFulfillmentOutputSchema = passthroughResponse;

export const DeleteItemReceiptInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteItemReceiptOutputSchema = passthroughResponse;

export const DeleteJournalEntryInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteJournalEntryOutputSchema = passthroughResponse;

export const DeletePurchaseOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeletePurchaseOrderOutputSchema = passthroughResponse;

export const DeleteSalesOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteSalesOrderOutputSchema = passthroughResponse;

export const DeleteVendorPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const DeleteVendorPaymentOutputSchema = passthroughResponse;

export const ExecuteDatasetInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
		dataset_id: z.string(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ExecuteDatasetOutputSchema = passthroughResponse;

export const GetCustomerInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetCustomerOutputSchema = passthroughResponse;

export const GetCustomerPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetCustomerPaymentOutputSchema = passthroughResponse;

export const GetDatacenterUrlsInputSchema = z
	.object({
		c: z.string().optional(),
		account: z.string(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetDatacenterUrlsOutputSchema = passthroughResponse;

export const GetEmployeeInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetEmployeeOutputSchema = passthroughResponse;

export const GetGovernanceLimitsInputSchema = z.object({}).passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetGovernanceLimitsOutputSchema = passthroughResponse;

export const GetInvoiceInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetInvoiceOutputSchema = passthroughResponse;

export const GetItemInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		itemRecordType: z.string(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetItemOutputSchema = passthroughResponse;

export const GetItemFulfillmentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetItemFulfillmentOutputSchema = passthroughResponse;

export const GetItemReceiptInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetItemReceiptOutputSchema = passthroughResponse;

export const GetJournalEntryInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetJournalEntryOutputSchema = passthroughResponse;

export const GetPurchaseOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetPurchaseOrderOutputSchema = passthroughResponse;

export const GetRecordMetadataInputSchema = z
	.object({
		accept: z.string().optional(),
		record_type: z.string(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetRecordMetadataOutputSchema = passthroughResponse;

export const GetReferenceSelectFieldInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		record_type: z.string(),
		select_field: z.string(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetReferenceSelectFieldOutputSchema = passthroughResponse;

export const GetSalesOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetSalesOrderOutputSchema = passthroughResponse;

export const GetServerTimeInputSchema = z.object({}).passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetServerTimeOutputSchema = passthroughResponse;

export const GetSublistCollectionInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		limit: z.number().optional(),
		offset: z.number().optional(),
		record_type: z.string(),
		sublist_name: z.string(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetSublistCollectionOutputSchema = passthroughResponse;

export const GetSublistLineInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		line_id: z.union([z.string(), z.number()]),
		record_type: z.string(),
		sublist_name: z.string(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetSublistLineOutputSchema = passthroughResponse;

export const GetSubrecordInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		record_type: z.string(),
		subrecord_name: z.string(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetSubrecordOutputSchema = passthroughResponse;

export const GetVendorInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetVendorOutputSchema = passthroughResponse;

export const GetVendorBillInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetVendorBillOutputSchema = passthroughResponse;

export const GetVendorPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const GetVendorPaymentOutputSchema = passthroughResponse;

export const ListCustomerPaymentsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListCustomerPaymentsOutputSchema = passthroughResponse;

export const ListDatasetsInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListDatasetsOutputSchema = passthroughResponse;

export const ListEmployeesInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListEmployeesOutputSchema = passthroughResponse;

export const ListInvoicesInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListInvoicesOutputSchema = passthroughResponse;

export const ListItemFulfillmentsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListItemFulfillmentsOutputSchema = passthroughResponse;

export const ListItemReceiptsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListItemReceiptsOutputSchema = passthroughResponse;

export const ListJournalEntriesInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListJournalEntriesOutputSchema = passthroughResponse;

export const ListMetadataCatalogInputSchema = z
	.object({
		accept: z.string().optional(),
		select: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListMetadataCatalogOutputSchema = passthroughResponse;

export const ListPurchaseOrdersInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListPurchaseOrdersOutputSchema = passthroughResponse;

export const ListRecordsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		recordType: z.string(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListRecordsOutputSchema = passthroughResponse;

export const ListSalesOrdersInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListSalesOrdersOutputSchema = passthroughResponse;

export const ListVendorPaymentsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const ListVendorPaymentsOutputSchema = passthroughResponse;

// NetSuite requires a state of 22 to 1024 characters on every authorize request.
const oauthStateSchema = z.string().min(22).max(1024);

export const Oauth2AuthorizeAccountDomainInputSchema = z
	.object({
		scope: z.string(),
		state: oauthStateSchema,
		prompt: z.string().optional(),
		client_id: z.string(),
		redirect_uri: z.string(),
		response_type: z.string().optional(),
		code_challenge: z.string().optional(),
		code_challenge_method: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const Oauth2AuthorizeAccountDomainOutputSchema = passthroughResponse;

export const Oauth2AuthorizeSystemDomainInputSchema = z
	.object({
		nonce: z.string().optional(),
		scope: z.string(),
		state: oauthStateSchema,
		prompt: z.string().optional(),
		client_id: z.string(),
		redirect_uri: z.string(),
		response_type: z.string().optional(),
		code_challenge: z.string().optional(),
		code_challenge_method: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const Oauth2AuthorizeSystemDomainOutputSchema = passthroughResponse;

export const Oauth2GetJwksKeysInputSchema = z.object({}).passthrough(); // NetSuite responses may include additional fields beyond those declared

export const Oauth2GetJwksKeysOutputSchema = passthroughResponse;

export const Oauth2LogoutInputSchema = z
	.object({
		id_token_hint: z.string(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const Oauth2LogoutOutputSchema = passthroughResponse;

export const Oauth2RevokeRefreshTokenInputSchema = z
	.object({
		token: z.string(),
		client_id: z.string().optional(),
		client_secret: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const Oauth2RevokeRefreshTokenOutputSchema = passthroughResponse;

export const Oauth2TokenAuthorizationCodeInputSchema = z
	.object({
		code: z.string(),
		client_id: z.string().optional(),
		client_secret: z.string().optional(),
		grant_type: z.string().optional(),
		redirect_uri: z.string(),
		code_verifier: z.string(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const Oauth2TokenAuthorizationCodeOutputSchema = passthroughResponse;

export const Oauth2TokenClientCredentialsInputSchema = z
	.object({
		grant_type: z.string().optional(),
		client_assertion: z.string(),
		client_assertion_type: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const Oauth2TokenClientCredentialsOutputSchema = passthroughResponse;

export const Oauth2TokenRefreshInputSchema = z
	.object({
		client_id: z.string().optional(),
		client_secret: z.string().optional(),
		refresh_token: z.string().min(1),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const Oauth2TokenRefreshOutputSchema = passthroughResponse;

export const RunSuiteqlQueryInputSchema = z
	.object({
		q: z.string(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const RunSuiteqlQueryOutputSchema = passthroughResponse;

export const TransformRecordInputSchema = z
	.object({
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		record_id: z.union([z.string(), z.number()]),
		record_body: z.record(z.string(), z.unknown()).optional(),
		source_record_type: z.string(),
		target_record_type: z.string(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const TransformRecordOutputSchema = passthroughResponse;

export const UpdateCustomerInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateCustomerOutputSchema = passthroughResponse;

export const UpdateCustomerPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateCustomerPaymentOutputSchema = passthroughResponse;

export const UpdateEmployeeInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateEmployeeOutputSchema = passthroughResponse;

export const UpdateInvoiceInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateInvoiceOutputSchema = passthroughResponse;

export const UpdateItemInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		prefer: z.string().optional(),
		replace: z.string().optional(),
		item_type: z.string(),
		idempotency_key: z.string().optional(),
		replace_selected_fields: z.boolean().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateItemOutputSchema = passthroughResponse;

export const UpdateItemFulfillmentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		prefer: z.string().optional(),
		replace: z.string().optional(),
		idempotency_key: z.string().optional(),
		replace_selected_fields: z.boolean().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateItemFulfillmentOutputSchema = passthroughResponse;

export const UpdateItemReceiptInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		prefer: z.string().optional(),
		replace: z.string().optional(),
		idempotency_key: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateItemReceiptOutputSchema = passthroughResponse;

export const UpdateJournalEntryInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		prefer: z.string().optional(),
		replace: z.string().optional(),
		idempotency_key: z.string().optional(),
		replace_selected_fields: z.boolean().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateJournalEntryOutputSchema = passthroughResponse;

export const UpdatePurchaseOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdatePurchaseOrderOutputSchema = passthroughResponse;

export const UpdateSalesOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateSalesOrderOutputSchema = passthroughResponse;

export const UpdateVendorInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateVendorOutputSchema = passthroughResponse;

export const UpdateVendorBillInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		prefer: z.string().optional(),
		replace: z.string().optional(),
		idempotency_key: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateVendorBillOutputSchema = passthroughResponse;

export const UpdateVendorPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		prefer: z.string().optional(),
		replace: z.string().optional(),
		idempotency_key: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpdateVendorPaymentOutputSchema = passthroughResponse;

export const UpsertRecordByExternalIdInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		external_id: z.string(),
		record_type: z.string(),
		replace: z.string().optional(),
	})
	.passthrough(); // NetSuite responses may include additional fields beyond those declared

export const UpsertRecordByExternalIdOutputSchema = passthroughResponse;

export type NetSuiteEndpointInputs = {
	asyncGetJobStatus: z.infer<typeof AsyncGetJobStatusInputSchema>;
	asyncGetJobTask: z.infer<typeof AsyncGetJobTaskInputSchema>;
	asyncGetJobTaskResult: z.infer<typeof AsyncGetJobTaskResultInputSchema>;
	createCustomer: z.infer<typeof CreateCustomerInputSchema>;
	createCustomerPayment: z.infer<typeof CreateCustomerPaymentInputSchema>;
	createEmployee: z.infer<typeof CreateEmployeeInputSchema>;
	createInvoice: z.infer<typeof CreateInvoiceInputSchema>;
	createItem: z.infer<typeof CreateItemInputSchema>;
	createJournalEntry: z.infer<typeof CreateJournalEntryInputSchema>;
	createJwtClientAssertion: z.infer<typeof CreateJwtClientAssertionInputSchema>;
	createPurchaseOrder: z.infer<typeof CreatePurchaseOrderInputSchema>;
	createRecord: z.infer<typeof CreateRecordInputSchema>;
	createSalesOrder: z.infer<typeof CreateSalesOrderInputSchema>;
	createVendor: z.infer<typeof CreateVendorInputSchema>;
	createVendorBill: z.infer<typeof CreateVendorBillInputSchema>;
	deleteCustomer: z.infer<typeof DeleteCustomerInputSchema>;
	deleteCustomerPayment: z.infer<typeof DeleteCustomerPaymentInputSchema>;
	deleteEmployee: z.infer<typeof DeleteEmployeeInputSchema>;
	deleteInvoice: z.infer<typeof DeleteInvoiceInputSchema>;
	deleteItem: z.infer<typeof DeleteItemInputSchema>;
	deleteItemFulfillment: z.infer<typeof DeleteItemFulfillmentInputSchema>;
	deleteItemReceipt: z.infer<typeof DeleteItemReceiptInputSchema>;
	deleteJournalEntry: z.infer<typeof DeleteJournalEntryInputSchema>;
	deletePurchaseOrder: z.infer<typeof DeletePurchaseOrderInputSchema>;
	deleteSalesOrder: z.infer<typeof DeleteSalesOrderInputSchema>;
	deleteVendorPayment: z.infer<typeof DeleteVendorPaymentInputSchema>;
	executeDataset: z.infer<typeof ExecuteDatasetInputSchema>;
	getCustomer: z.infer<typeof GetCustomerInputSchema>;
	getCustomerPayment: z.infer<typeof GetCustomerPaymentInputSchema>;
	getDatacenterUrls: z.infer<typeof GetDatacenterUrlsInputSchema>;
	getEmployee: z.infer<typeof GetEmployeeInputSchema>;
	getGovernanceLimits: z.infer<typeof GetGovernanceLimitsInputSchema>;
	getInvoice: z.infer<typeof GetInvoiceInputSchema>;
	getItem: z.infer<typeof GetItemInputSchema>;
	getItemFulfillment: z.infer<typeof GetItemFulfillmentInputSchema>;
	getItemReceipt: z.infer<typeof GetItemReceiptInputSchema>;
	getJournalEntry: z.infer<typeof GetJournalEntryInputSchema>;
	getPurchaseOrder: z.infer<typeof GetPurchaseOrderInputSchema>;
	getRecordMetadata: z.infer<typeof GetRecordMetadataInputSchema>;
	getReferenceSelectField: z.infer<typeof GetReferenceSelectFieldInputSchema>;
	getSalesOrder: z.infer<typeof GetSalesOrderInputSchema>;
	getServerTime: z.infer<typeof GetServerTimeInputSchema>;
	getSublistCollection: z.infer<typeof GetSublistCollectionInputSchema>;
	getSublistLine: z.infer<typeof GetSublistLineInputSchema>;
	getSubrecord: z.infer<typeof GetSubrecordInputSchema>;
	getVendor: z.infer<typeof GetVendorInputSchema>;
	getVendorBill: z.infer<typeof GetVendorBillInputSchema>;
	getVendorPayment: z.infer<typeof GetVendorPaymentInputSchema>;
	listCustomerPayments: z.infer<typeof ListCustomerPaymentsInputSchema>;
	listDatasets: z.infer<typeof ListDatasetsInputSchema>;
	listEmployees: z.infer<typeof ListEmployeesInputSchema>;
	listInvoices: z.infer<typeof ListInvoicesInputSchema>;
	listItemFulfillments: z.infer<typeof ListItemFulfillmentsInputSchema>;
	listItemReceipts: z.infer<typeof ListItemReceiptsInputSchema>;
	listJournalEntries: z.infer<typeof ListJournalEntriesInputSchema>;
	listMetadataCatalog: z.infer<typeof ListMetadataCatalogInputSchema>;
	listPurchaseOrders: z.infer<typeof ListPurchaseOrdersInputSchema>;
	listRecords: z.infer<typeof ListRecordsInputSchema>;
	listSalesOrders: z.infer<typeof ListSalesOrdersInputSchema>;
	listVendorPayments: z.infer<typeof ListVendorPaymentsInputSchema>;
	oauth2AuthorizeAccountDomain: z.infer<
		typeof Oauth2AuthorizeAccountDomainInputSchema
	>;
	oauth2AuthorizeSystemDomain: z.infer<
		typeof Oauth2AuthorizeSystemDomainInputSchema
	>;
	oauth2GetJwksKeys: z.infer<typeof Oauth2GetJwksKeysInputSchema>;
	oauth2Logout: z.infer<typeof Oauth2LogoutInputSchema>;
	oauth2RevokeRefreshToken: z.infer<typeof Oauth2RevokeRefreshTokenInputSchema>;
	oauth2TokenAuthorizationCode: z.infer<
		typeof Oauth2TokenAuthorizationCodeInputSchema
	>;
	oauth2TokenClientCredentials: z.infer<
		typeof Oauth2TokenClientCredentialsInputSchema
	>;
	oauth2TokenRefresh: z.infer<typeof Oauth2TokenRefreshInputSchema>;
	runSuiteqlQuery: z.infer<typeof RunSuiteqlQueryInputSchema>;
	transformRecord: z.infer<typeof TransformRecordInputSchema>;
	updateCustomer: z.infer<typeof UpdateCustomerInputSchema>;
	updateCustomerPayment: z.infer<typeof UpdateCustomerPaymentInputSchema>;
	updateEmployee: z.infer<typeof UpdateEmployeeInputSchema>;
	updateInvoice: z.infer<typeof UpdateInvoiceInputSchema>;
	updateItem: z.infer<typeof UpdateItemInputSchema>;
	updateItemFulfillment: z.infer<typeof UpdateItemFulfillmentInputSchema>;
	updateItemReceipt: z.infer<typeof UpdateItemReceiptInputSchema>;
	updateJournalEntry: z.infer<typeof UpdateJournalEntryInputSchema>;
	updatePurchaseOrder: z.infer<typeof UpdatePurchaseOrderInputSchema>;
	updateSalesOrder: z.infer<typeof UpdateSalesOrderInputSchema>;
	updateVendor: z.infer<typeof UpdateVendorInputSchema>;
	updateVendorBill: z.infer<typeof UpdateVendorBillInputSchema>;
	updateVendorPayment: z.infer<typeof UpdateVendorPaymentInputSchema>;
	upsertRecordByExternalId: z.infer<typeof UpsertRecordByExternalIdInputSchema>;
};

export type NetSuiteEndpointOutputs = {
	asyncGetJobStatus: z.infer<typeof AsyncGetJobStatusOutputSchema>;
	asyncGetJobTask: z.infer<typeof AsyncGetJobTaskOutputSchema>;
	asyncGetJobTaskResult: z.infer<typeof AsyncGetJobTaskResultOutputSchema>;
	createCustomer: z.infer<typeof CreateCustomerOutputSchema>;
	createCustomerPayment: z.infer<typeof CreateCustomerPaymentOutputSchema>;
	createEmployee: z.infer<typeof CreateEmployeeOutputSchema>;
	createInvoice: z.infer<typeof CreateInvoiceOutputSchema>;
	createItem: z.infer<typeof CreateItemOutputSchema>;
	createJournalEntry: z.infer<typeof CreateJournalEntryOutputSchema>;
	createJwtClientAssertion: z.infer<
		typeof CreateJwtClientAssertionOutputSchema
	>;
	createPurchaseOrder: z.infer<typeof CreatePurchaseOrderOutputSchema>;
	createRecord: z.infer<typeof CreateRecordOutputSchema>;
	createSalesOrder: z.infer<typeof CreateSalesOrderOutputSchema>;
	createVendor: z.infer<typeof CreateVendorOutputSchema>;
	createVendorBill: z.infer<typeof CreateVendorBillOutputSchema>;
	deleteCustomer: z.infer<typeof DeleteCustomerOutputSchema>;
	deleteCustomerPayment: z.infer<typeof DeleteCustomerPaymentOutputSchema>;
	deleteEmployee: z.infer<typeof DeleteEmployeeOutputSchema>;
	deleteInvoice: z.infer<typeof DeleteInvoiceOutputSchema>;
	deleteItem: z.infer<typeof DeleteItemOutputSchema>;
	deleteItemFulfillment: z.infer<typeof DeleteItemFulfillmentOutputSchema>;
	deleteItemReceipt: z.infer<typeof DeleteItemReceiptOutputSchema>;
	deleteJournalEntry: z.infer<typeof DeleteJournalEntryOutputSchema>;
	deletePurchaseOrder: z.infer<typeof DeletePurchaseOrderOutputSchema>;
	deleteSalesOrder: z.infer<typeof DeleteSalesOrderOutputSchema>;
	deleteVendorPayment: z.infer<typeof DeleteVendorPaymentOutputSchema>;
	executeDataset: z.infer<typeof ExecuteDatasetOutputSchema>;
	getCustomer: z.infer<typeof GetCustomerOutputSchema>;
	getCustomerPayment: z.infer<typeof GetCustomerPaymentOutputSchema>;
	getDatacenterUrls: z.infer<typeof GetDatacenterUrlsOutputSchema>;
	getEmployee: z.infer<typeof GetEmployeeOutputSchema>;
	getGovernanceLimits: z.infer<typeof GetGovernanceLimitsOutputSchema>;
	getInvoice: z.infer<typeof GetInvoiceOutputSchema>;
	getItem: z.infer<typeof GetItemOutputSchema>;
	getItemFulfillment: z.infer<typeof GetItemFulfillmentOutputSchema>;
	getItemReceipt: z.infer<typeof GetItemReceiptOutputSchema>;
	getJournalEntry: z.infer<typeof GetJournalEntryOutputSchema>;
	getPurchaseOrder: z.infer<typeof GetPurchaseOrderOutputSchema>;
	getRecordMetadata: z.infer<typeof GetRecordMetadataOutputSchema>;
	getReferenceSelectField: z.infer<typeof GetReferenceSelectFieldOutputSchema>;
	getSalesOrder: z.infer<typeof GetSalesOrderOutputSchema>;
	getServerTime: z.infer<typeof GetServerTimeOutputSchema>;
	getSublistCollection: z.infer<typeof GetSublistCollectionOutputSchema>;
	getSublistLine: z.infer<typeof GetSublistLineOutputSchema>;
	getSubrecord: z.infer<typeof GetSubrecordOutputSchema>;
	getVendor: z.infer<typeof GetVendorOutputSchema>;
	getVendorBill: z.infer<typeof GetVendorBillOutputSchema>;
	getVendorPayment: z.infer<typeof GetVendorPaymentOutputSchema>;
	listCustomerPayments: z.infer<typeof ListCustomerPaymentsOutputSchema>;
	listDatasets: z.infer<typeof ListDatasetsOutputSchema>;
	listEmployees: z.infer<typeof ListEmployeesOutputSchema>;
	listInvoices: z.infer<typeof ListInvoicesOutputSchema>;
	listItemFulfillments: z.infer<typeof ListItemFulfillmentsOutputSchema>;
	listItemReceipts: z.infer<typeof ListItemReceiptsOutputSchema>;
	listJournalEntries: z.infer<typeof ListJournalEntriesOutputSchema>;
	listMetadataCatalog: z.infer<typeof ListMetadataCatalogOutputSchema>;
	listPurchaseOrders: z.infer<typeof ListPurchaseOrdersOutputSchema>;
	listRecords: z.infer<typeof ListRecordsOutputSchema>;
	listSalesOrders: z.infer<typeof ListSalesOrdersOutputSchema>;
	listVendorPayments: z.infer<typeof ListVendorPaymentsOutputSchema>;
	oauth2AuthorizeAccountDomain: z.infer<
		typeof Oauth2AuthorizeAccountDomainOutputSchema
	>;
	oauth2AuthorizeSystemDomain: z.infer<
		typeof Oauth2AuthorizeSystemDomainOutputSchema
	>;
	oauth2GetJwksKeys: z.infer<typeof Oauth2GetJwksKeysOutputSchema>;
	oauth2Logout: z.infer<typeof Oauth2LogoutOutputSchema>;
	oauth2RevokeRefreshToken: z.infer<
		typeof Oauth2RevokeRefreshTokenOutputSchema
	>;
	oauth2TokenAuthorizationCode: z.infer<
		typeof Oauth2TokenAuthorizationCodeOutputSchema
	>;
	oauth2TokenClientCredentials: z.infer<
		typeof Oauth2TokenClientCredentialsOutputSchema
	>;
	oauth2TokenRefresh: z.infer<typeof Oauth2TokenRefreshOutputSchema>;
	runSuiteqlQuery: z.infer<typeof RunSuiteqlQueryOutputSchema>;
	transformRecord: z.infer<typeof TransformRecordOutputSchema>;
	updateCustomer: z.infer<typeof UpdateCustomerOutputSchema>;
	updateCustomerPayment: z.infer<typeof UpdateCustomerPaymentOutputSchema>;
	updateEmployee: z.infer<typeof UpdateEmployeeOutputSchema>;
	updateInvoice: z.infer<typeof UpdateInvoiceOutputSchema>;
	updateItem: z.infer<typeof UpdateItemOutputSchema>;
	updateItemFulfillment: z.infer<typeof UpdateItemFulfillmentOutputSchema>;
	updateItemReceipt: z.infer<typeof UpdateItemReceiptOutputSchema>;
	updateJournalEntry: z.infer<typeof UpdateJournalEntryOutputSchema>;
	updatePurchaseOrder: z.infer<typeof UpdatePurchaseOrderOutputSchema>;
	updateSalesOrder: z.infer<typeof UpdateSalesOrderOutputSchema>;
	updateVendor: z.infer<typeof UpdateVendorOutputSchema>;
	updateVendorBill: z.infer<typeof UpdateVendorBillOutputSchema>;
	updateVendorPayment: z.infer<typeof UpdateVendorPaymentOutputSchema>;
	upsertRecordByExternalId: z.infer<
		typeof UpsertRecordByExternalIdOutputSchema
	>;
};

export const NetSuiteEndpointInputSchemas = {
	asyncGetJobStatus: AsyncGetJobStatusInputSchema,
	asyncGetJobTask: AsyncGetJobTaskInputSchema,
	asyncGetJobTaskResult: AsyncGetJobTaskResultInputSchema,
	createCustomer: CreateCustomerInputSchema,
	createCustomerPayment: CreateCustomerPaymentInputSchema,
	createEmployee: CreateEmployeeInputSchema,
	createInvoice: CreateInvoiceInputSchema,
	createItem: CreateItemInputSchema,
	createJournalEntry: CreateJournalEntryInputSchema,
	createJwtClientAssertion: CreateJwtClientAssertionInputSchema,
	createPurchaseOrder: CreatePurchaseOrderInputSchema,
	createRecord: CreateRecordInputSchema,
	createSalesOrder: CreateSalesOrderInputSchema,
	createVendor: CreateVendorInputSchema,
	createVendorBill: CreateVendorBillInputSchema,
	deleteCustomer: DeleteCustomerInputSchema,
	deleteCustomerPayment: DeleteCustomerPaymentInputSchema,
	deleteEmployee: DeleteEmployeeInputSchema,
	deleteInvoice: DeleteInvoiceInputSchema,
	deleteItem: DeleteItemInputSchema,
	deleteItemFulfillment: DeleteItemFulfillmentInputSchema,
	deleteItemReceipt: DeleteItemReceiptInputSchema,
	deleteJournalEntry: DeleteJournalEntryInputSchema,
	deletePurchaseOrder: DeletePurchaseOrderInputSchema,
	deleteSalesOrder: DeleteSalesOrderInputSchema,
	deleteVendorPayment: DeleteVendorPaymentInputSchema,
	executeDataset: ExecuteDatasetInputSchema,
	getCustomer: GetCustomerInputSchema,
	getCustomerPayment: GetCustomerPaymentInputSchema,
	getDatacenterUrls: GetDatacenterUrlsInputSchema,
	getEmployee: GetEmployeeInputSchema,
	getGovernanceLimits: GetGovernanceLimitsInputSchema,
	getInvoice: GetInvoiceInputSchema,
	getItem: GetItemInputSchema,
	getItemFulfillment: GetItemFulfillmentInputSchema,
	getItemReceipt: GetItemReceiptInputSchema,
	getJournalEntry: GetJournalEntryInputSchema,
	getPurchaseOrder: GetPurchaseOrderInputSchema,
	getRecordMetadata: GetRecordMetadataInputSchema,
	getReferenceSelectField: GetReferenceSelectFieldInputSchema,
	getSalesOrder: GetSalesOrderInputSchema,
	getServerTime: GetServerTimeInputSchema,
	getSublistCollection: GetSublistCollectionInputSchema,
	getSublistLine: GetSublistLineInputSchema,
	getSubrecord: GetSubrecordInputSchema,
	getVendor: GetVendorInputSchema,
	getVendorBill: GetVendorBillInputSchema,
	getVendorPayment: GetVendorPaymentInputSchema,
	listCustomerPayments: ListCustomerPaymentsInputSchema,
	listDatasets: ListDatasetsInputSchema,
	listEmployees: ListEmployeesInputSchema,
	listInvoices: ListInvoicesInputSchema,
	listItemFulfillments: ListItemFulfillmentsInputSchema,
	listItemReceipts: ListItemReceiptsInputSchema,
	listJournalEntries: ListJournalEntriesInputSchema,
	listMetadataCatalog: ListMetadataCatalogInputSchema,
	listPurchaseOrders: ListPurchaseOrdersInputSchema,
	listRecords: ListRecordsInputSchema,
	listSalesOrders: ListSalesOrdersInputSchema,
	listVendorPayments: ListVendorPaymentsInputSchema,
	oauth2AuthorizeAccountDomain: Oauth2AuthorizeAccountDomainInputSchema,
	oauth2AuthorizeSystemDomain: Oauth2AuthorizeSystemDomainInputSchema,
	oauth2GetJwksKeys: Oauth2GetJwksKeysInputSchema,
	oauth2Logout: Oauth2LogoutInputSchema,
	oauth2RevokeRefreshToken: Oauth2RevokeRefreshTokenInputSchema,
	oauth2TokenAuthorizationCode: Oauth2TokenAuthorizationCodeInputSchema,
	oauth2TokenClientCredentials: Oauth2TokenClientCredentialsInputSchema,
	oauth2TokenRefresh: Oauth2TokenRefreshInputSchema,
	runSuiteqlQuery: RunSuiteqlQueryInputSchema,
	transformRecord: TransformRecordInputSchema,
	updateCustomer: UpdateCustomerInputSchema,
	updateCustomerPayment: UpdateCustomerPaymentInputSchema,
	updateEmployee: UpdateEmployeeInputSchema,
	updateInvoice: UpdateInvoiceInputSchema,
	updateItem: UpdateItemInputSchema,
	updateItemFulfillment: UpdateItemFulfillmentInputSchema,
	updateItemReceipt: UpdateItemReceiptInputSchema,
	updateJournalEntry: UpdateJournalEntryInputSchema,
	updatePurchaseOrder: UpdatePurchaseOrderInputSchema,
	updateSalesOrder: UpdateSalesOrderInputSchema,
	updateVendor: UpdateVendorInputSchema,
	updateVendorBill: UpdateVendorBillInputSchema,
	updateVendorPayment: UpdateVendorPaymentInputSchema,
	upsertRecordByExternalId: UpsertRecordByExternalIdInputSchema,
} as const;

export const NetSuiteEndpointOutputSchemas = {
	asyncGetJobStatus: AsyncGetJobStatusOutputSchema,
	asyncGetJobTask: AsyncGetJobTaskOutputSchema,
	asyncGetJobTaskResult: AsyncGetJobTaskResultOutputSchema,
	createCustomer: CreateCustomerOutputSchema,
	createCustomerPayment: CreateCustomerPaymentOutputSchema,
	createEmployee: CreateEmployeeOutputSchema,
	createInvoice: CreateInvoiceOutputSchema,
	createItem: CreateItemOutputSchema,
	createJournalEntry: CreateJournalEntryOutputSchema,
	createJwtClientAssertion: CreateJwtClientAssertionOutputSchema,
	createPurchaseOrder: CreatePurchaseOrderOutputSchema,
	createRecord: CreateRecordOutputSchema,
	createSalesOrder: CreateSalesOrderOutputSchema,
	createVendor: CreateVendorOutputSchema,
	createVendorBill: CreateVendorBillOutputSchema,
	deleteCustomer: DeleteCustomerOutputSchema,
	deleteCustomerPayment: DeleteCustomerPaymentOutputSchema,
	deleteEmployee: DeleteEmployeeOutputSchema,
	deleteInvoice: DeleteInvoiceOutputSchema,
	deleteItem: DeleteItemOutputSchema,
	deleteItemFulfillment: DeleteItemFulfillmentOutputSchema,
	deleteItemReceipt: DeleteItemReceiptOutputSchema,
	deleteJournalEntry: DeleteJournalEntryOutputSchema,
	deletePurchaseOrder: DeletePurchaseOrderOutputSchema,
	deleteSalesOrder: DeleteSalesOrderOutputSchema,
	deleteVendorPayment: DeleteVendorPaymentOutputSchema,
	executeDataset: ExecuteDatasetOutputSchema,
	getCustomer: GetCustomerOutputSchema,
	getCustomerPayment: GetCustomerPaymentOutputSchema,
	getDatacenterUrls: GetDatacenterUrlsOutputSchema,
	getEmployee: GetEmployeeOutputSchema,
	getGovernanceLimits: GetGovernanceLimitsOutputSchema,
	getInvoice: GetInvoiceOutputSchema,
	getItem: GetItemOutputSchema,
	getItemFulfillment: GetItemFulfillmentOutputSchema,
	getItemReceipt: GetItemReceiptOutputSchema,
	getJournalEntry: GetJournalEntryOutputSchema,
	getPurchaseOrder: GetPurchaseOrderOutputSchema,
	getRecordMetadata: GetRecordMetadataOutputSchema,
	getReferenceSelectField: GetReferenceSelectFieldOutputSchema,
	getSalesOrder: GetSalesOrderOutputSchema,
	getServerTime: GetServerTimeOutputSchema,
	getSublistCollection: GetSublistCollectionOutputSchema,
	getSublistLine: GetSublistLineOutputSchema,
	getSubrecord: GetSubrecordOutputSchema,
	getVendor: GetVendorOutputSchema,
	getVendorBill: GetVendorBillOutputSchema,
	getVendorPayment: GetVendorPaymentOutputSchema,
	listCustomerPayments: ListCustomerPaymentsOutputSchema,
	listDatasets: ListDatasetsOutputSchema,
	listEmployees: ListEmployeesOutputSchema,
	listInvoices: ListInvoicesOutputSchema,
	listItemFulfillments: ListItemFulfillmentsOutputSchema,
	listItemReceipts: ListItemReceiptsOutputSchema,
	listJournalEntries: ListJournalEntriesOutputSchema,
	listMetadataCatalog: ListMetadataCatalogOutputSchema,
	listPurchaseOrders: ListPurchaseOrdersOutputSchema,
	listRecords: ListRecordsOutputSchema,
	listSalesOrders: ListSalesOrdersOutputSchema,
	listVendorPayments: ListVendorPaymentsOutputSchema,
	oauth2AuthorizeAccountDomain: Oauth2AuthorizeAccountDomainOutputSchema,
	oauth2AuthorizeSystemDomain: Oauth2AuthorizeSystemDomainOutputSchema,
	oauth2GetJwksKeys: Oauth2GetJwksKeysOutputSchema,
	oauth2Logout: Oauth2LogoutOutputSchema,
	oauth2RevokeRefreshToken: Oauth2RevokeRefreshTokenOutputSchema,
	oauth2TokenAuthorizationCode: Oauth2TokenAuthorizationCodeOutputSchema,
	oauth2TokenClientCredentials: Oauth2TokenClientCredentialsOutputSchema,
	oauth2TokenRefresh: Oauth2TokenRefreshOutputSchema,
	runSuiteqlQuery: RunSuiteqlQueryOutputSchema,
	transformRecord: TransformRecordOutputSchema,
	updateCustomer: UpdateCustomerOutputSchema,
	updateCustomerPayment: UpdateCustomerPaymentOutputSchema,
	updateEmployee: UpdateEmployeeOutputSchema,
	updateInvoice: UpdateInvoiceOutputSchema,
	updateItem: UpdateItemOutputSchema,
	updateItemFulfillment: UpdateItemFulfillmentOutputSchema,
	updateItemReceipt: UpdateItemReceiptOutputSchema,
	updateJournalEntry: UpdateJournalEntryOutputSchema,
	updatePurchaseOrder: UpdatePurchaseOrderOutputSchema,
	updateSalesOrder: UpdateSalesOrderOutputSchema,
	updateVendor: UpdateVendorOutputSchema,
	updateVendorBill: UpdateVendorBillOutputSchema,
	updateVendorPayment: UpdateVendorPaymentOutputSchema,
	upsertRecordByExternalId: UpsertRecordByExternalIdOutputSchema,
} as const;
