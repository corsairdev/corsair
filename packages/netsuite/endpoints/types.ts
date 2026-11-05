import { z } from 'zod';

export const AsyncGetJobStatusInputSchema = z
	.object({
		jobId: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const AsyncGetJobStatusOutputSchema = z.object({}).passthrough();

export const AsyncGetJobTaskInputSchema = z
	.object({
		jobId: z.union([z.string(), z.number()]),
		taskId: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const AsyncGetJobTaskOutputSchema = z.object({}).passthrough();

export const AsyncGetJobTaskResultInputSchema = z
	.object({
		jobId: z.union([z.string(), z.number()]),
		taskId: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const AsyncGetJobTaskResultOutputSchema = z.object({}).passthrough();

export const CreateCustomerInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough();

export const CreateCustomerOutputSchema = z.object({}).passthrough();

export const CreateCustomerPaymentInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough();

export const CreateCustomerPaymentOutputSchema = z.object({}).passthrough();

export const CreateEmployeeInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough();

export const CreateEmployeeOutputSchema = z.object({}).passthrough();

export const CreateInvoiceInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough();

export const CreateInvoiceOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const CreateItemOutputSchema = z.object({}).passthrough();

export const CreateJournalEntryInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough();

export const CreateJournalEntryOutputSchema = z.object({}).passthrough();

export const CreateJwtClientAssertionInputSchema = z
	.object({
		alg: z.string().optional(),
		aud: z.string().optional(),
		exp: z.number().optional(),
		iat: z.number().optional(),
		scope: z.string(),
		client_id: z.string().optional(),
		certificate_id: z.string().optional(),
		private_key_pem: z.string().optional(),
	})
	.passthrough();

export const CreateJwtClientAssertionOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const CreatePurchaseOrderOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const CreateRecordOutputSchema = z.object({}).passthrough();

export const CreateSalesOrderInputSchema = z
	.object({
		item: z.record(z.string(), z.unknown()),
		memo: z.string().optional(),
		Prefer: z.string().optional(),
		entity: z.record(z.string(), z.unknown()),
		replace: z.string().optional(),
		tranDate: z.string().optional(),
		promocode: z.record(z.string(), z.unknown()).optional(),
		customForm: z.string().optional(),
		orderStatus: z.string().optional(),
		otherrefnum: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough();

export const CreateSalesOrderOutputSchema = z.object({}).passthrough();

export const CreateVendorInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough();

export const CreateVendorOutputSchema = z.object({}).passthrough();

export const CreateVendorBillInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		Prefer: z.string().optional(),
		replace: z.string().optional(),
		'X-NetSuite-Idempotency-Key': z.string().optional(),
		'X-NetSuite-PropertyNameValidation': z.string().optional(),
		'X-NetSuite-PropertyValueValidation': z.string().optional(),
	})
	.passthrough();

export const CreateVendorBillOutputSchema = z.object({}).passthrough();

export const DeleteCustomerInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const DeleteCustomerOutputSchema = z.object({}).passthrough();

export const DeleteCustomerPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const DeleteCustomerPaymentOutputSchema = z.object({}).passthrough();

export const DeleteEmployeeInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const DeleteEmployeeOutputSchema = z.object({}).passthrough();

export const DeleteInvoiceInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const DeleteInvoiceOutputSchema = z.object({}).passthrough();

export const DeleteItemInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		item_record_type: z.string().optional(),
	})
	.passthrough();

export const DeleteItemOutputSchema = z.object({}).passthrough();

export const DeleteItemFulfillmentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
	})
	.passthrough();

export const DeleteItemFulfillmentOutputSchema = z.object({}).passthrough();

export const DeleteItemReceiptInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const DeleteItemReceiptOutputSchema = z.object({}).passthrough();

export const DeleteJournalEntryInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
	})
	.passthrough();

export const DeleteJournalEntryOutputSchema = z.object({}).passthrough();

export const DeletePurchaseOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const DeletePurchaseOrderOutputSchema = z.object({}).passthrough();

export const DeleteSalesOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const DeleteSalesOrderOutputSchema = z.object({}).passthrough();

export const DeleteVendorPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
	})
	.passthrough();

export const DeleteVendorPaymentOutputSchema = z.object({}).passthrough();

export const ExecuteDatasetInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
		dataset_id: z.string(),
	})
	.passthrough();

export const ExecuteDatasetOutputSchema = z.object({}).passthrough();

export const GetCustomerInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetCustomerOutputSchema = z.object({}).passthrough();

export const GetCustomerPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetCustomerPaymentOutputSchema = z.object({}).passthrough();

export const GetDatacenterUrlsInputSchema = z
	.object({
		c: z.string().optional(),
		account: z.string(),
	})
	.passthrough();

export const GetDatacenterUrlsOutputSchema = z.object({}).passthrough();

export const GetEmployeeInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetEmployeeOutputSchema = z.object({}).passthrough();

export const GetGovernanceLimitsInputSchema = z.object({}).passthrough();

export const GetGovernanceLimitsOutputSchema = z.object({}).passthrough();

export const GetInvoiceInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetInvoiceOutputSchema = z.object({}).passthrough();

export const GetItemInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		itemRecordType: z.string(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetItemOutputSchema = z.object({}).passthrough();

export const GetItemFulfillmentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetItemFulfillmentOutputSchema = z.object({}).passthrough();

export const GetItemReceiptInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetItemReceiptOutputSchema = z.object({}).passthrough();

export const GetJournalEntryInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetJournalEntryOutputSchema = z.object({}).passthrough();

export const GetPurchaseOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetPurchaseOrderOutputSchema = z.object({}).passthrough();

export const GetRecordMetadataInputSchema = z
	.object({
		accept: z.string().optional(),
		record_type: z.string(),
	})
	.passthrough();

export const GetRecordMetadataOutputSchema = z.object({}).passthrough();

export const GetReferenceSelectFieldInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		record_type: z.string(),
		select_field: z.string(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetReferenceSelectFieldOutputSchema = z.object({}).passthrough();

export const GetSalesOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetSalesOrderOutputSchema = z.object({}).passthrough();

export const GetServerTimeInputSchema = z.object({}).passthrough();

export const GetServerTimeOutputSchema = z.object({}).passthrough();

export const GetSublistCollectionInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		limit: z.number().optional(),
		offset: z.number().optional(),
		record_type: z.string(),
		sublist_name: z.string(),
	})
	.passthrough();

export const GetSublistCollectionOutputSchema = z.object({}).passthrough();

export const GetSublistLineInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		line_id: z.union([z.string(), z.number()]),
		record_type: z.string(),
		sublist_name: z.string(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetSublistLineOutputSchema = z.object({}).passthrough();

export const GetSubrecordInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		record_type: z.string(),
		subrecord_name: z.string(),
	})
	.passthrough();

export const GetSubrecordOutputSchema = z.object({}).passthrough();

export const GetVendorInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetVendorOutputSchema = z.object({}).passthrough();

export const GetVendorBillInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetVendorBillOutputSchema = z.object({}).passthrough();

export const GetVendorPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		fields: z.string().optional(),
		simpleEnumFormat: z.boolean().optional(),
		expandSubResources: z.boolean().optional(),
	})
	.passthrough();

export const GetVendorPaymentOutputSchema = z.object({}).passthrough();

export const ListCustomerPaymentsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListCustomerPaymentsOutputSchema = z.object({}).passthrough();

export const ListDatasetsInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListDatasetsOutputSchema = z.object({}).passthrough();

export const ListEmployeesInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListEmployeesOutputSchema = z.object({}).passthrough();

export const ListIntegrationsInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListIntegrationsOutputSchema = z.object({}).passthrough();

export const ListInvoicesInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListInvoicesOutputSchema = z.object({}).passthrough();

export const ListItemFulfillmentsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListItemFulfillmentsOutputSchema = z.object({}).passthrough();

export const ListItemReceiptsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListItemReceiptsOutputSchema = z.object({}).passthrough();

export const ListJournalEntriesInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListJournalEntriesOutputSchema = z.object({}).passthrough();

export const ListMetadataCatalogInputSchema = z
	.object({
		accept: z.string().optional(),
		select: z.string().optional(),
	})
	.passthrough();

export const ListMetadataCatalogOutputSchema = z.object({}).passthrough();

export const ListPurchaseOrdersInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListPurchaseOrdersOutputSchema = z.object({}).passthrough();

export const ListRecordsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		recordType: z.string(),
	})
	.passthrough();

export const ListRecordsOutputSchema = z.object({}).passthrough();

export const ListSalesOrdersInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListSalesOrdersOutputSchema = z.object({}).passthrough();

export const ListVendorPaymentsInputSchema = z
	.object({
		q: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const ListVendorPaymentsOutputSchema = z.object({}).passthrough();

export const Oauth2AuthorizeAccountDomainInputSchema = z
	.object({
		scope: z.string(),
		state: z.string().optional(),
		prompt: z.string().optional(),
		client_id: z.string(),
		redirect_uri: z.string(),
		response_type: z.string().optional(),
		code_challenge: z.string().optional(),
		code_challenge_method: z.string().optional(),
	})
	.passthrough();

export const Oauth2AuthorizeAccountDomainOutputSchema = z
	.object({})
	.passthrough();

export const Oauth2AuthorizeSystemDomainInputSchema = z
	.object({
		nonce: z.string().optional(),
		scope: z.string(),
		state: z.string(),
		prompt: z.string().optional(),
		client_id: z.string(),
		redirect_uri: z.string(),
		response_type: z.string().optional(),
		code_challenge: z.string().optional(),
		code_challenge_method: z.string().optional(),
	})
	.passthrough();

export const Oauth2AuthorizeSystemDomainOutputSchema = z
	.object({})
	.passthrough();

export const Oauth2GetJwksKeysInputSchema = z.object({}).passthrough();

export const Oauth2GetJwksKeysOutputSchema = z.object({}).passthrough();

export const Oauth2LogoutInputSchema = z
	.object({
		id_token_hint: z.string(),
	})
	.passthrough();

export const Oauth2LogoutOutputSchema = z.object({}).passthrough();

export const Oauth2RevokeRefreshTokenInputSchema = z
	.object({
		token: z.string(),
		client_id: z.string().optional(),
	})
	.passthrough();

export const Oauth2RevokeRefreshTokenOutputSchema = z.object({}).passthrough();

export const Oauth2TokenAuthorizationCodeInputSchema = z
	.object({
		code: z.string(),
		client_id: z.string().optional(),
		grant_type: z.string().optional(),
		redirect_uri: z.string(),
		code_verifier: z.string(),
	})
	.passthrough();

export const Oauth2TokenAuthorizationCodeOutputSchema = z
	.object({})
	.passthrough();

export const Oauth2TokenClientCredentialsInputSchema = z
	.object({
		grant_type: z.string().optional(),
		client_assertion: z.string(),
		client_assertion_type: z.string().optional(),
	})
	.passthrough();

export const Oauth2TokenClientCredentialsOutputSchema = z
	.object({})
	.passthrough();

export const Oauth2TokenRefreshInputSchema = z
	.object({
		client_id: z.string().optional(),
		client_secret: z.string().optional(),
		refresh_token: z.string().optional(),
	})
	.passthrough();

export const Oauth2TokenRefreshOutputSchema = z.object({}).passthrough();

export const RunSuiteqlQueryInputSchema = z
	.object({
		q: z.string(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export const RunSuiteqlQueryOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const TransformRecordOutputSchema = z.object({}).passthrough();

export const UpdateCustomerInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.boolean().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough();

export const UpdateCustomerOutputSchema = z.object({}).passthrough();

export const UpdateCustomerPaymentInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.boolean().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough();

export const UpdateCustomerPaymentOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const UpdateEmployeeOutputSchema = z.object({}).passthrough();

export const UpdateInvoiceInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.boolean().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough();

export const UpdateInvoiceOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const UpdateItemOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const UpdateItemFulfillmentOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const UpdateItemReceiptOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const UpdateJournalEntryOutputSchema = z.object({}).passthrough();

export const UpdatePurchaseOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		replaceSelectedFields: z.boolean().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough();

export const UpdatePurchaseOrderOutputSchema = z.object({}).passthrough();

export const UpdateSalesOrderInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.boolean().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough();

export const UpdateSalesOrderOutputSchema = z.object({}).passthrough();

export const UpdateVendorInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		data: z.record(z.string(), z.unknown()),
		replace: z.boolean().optional(),
		replaceSelectedFields: z.boolean().optional(),
		prefer: z.string().optional(),
		idempotency_key: z.string().optional(),
		property_name_validation: z.string().optional(),
		property_value_validation: z.string().optional(),
	})
	.passthrough();

export const UpdateVendorOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const UpdateVendorBillOutputSchema = z.object({}).passthrough();

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
	.passthrough();

export const UpdateVendorPaymentOutputSchema = z.object({}).passthrough();

export const UpsertRecordByExternalIdInputSchema = z
	.object({
		body: z.record(z.string(), z.unknown()),
		external_id: z.string(),
		record_type: z.string(),
		replace: z.boolean().optional(),
	})
	.passthrough();

export const UpsertRecordByExternalIdOutputSchema = z.object({}).passthrough();

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
	listIntegrations: z.infer<typeof ListIntegrationsInputSchema>;
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
	listIntegrations: z.infer<typeof ListIntegrationsOutputSchema>;
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
	listIntegrations: ListIntegrationsInputSchema,
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
	listIntegrations: ListIntegrationsOutputSchema,
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
