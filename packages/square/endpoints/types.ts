import { z } from 'zod';
import {
	BatchRetrieveInventoryCountsRequestSchema as InBatchRetrieveInventoryCountsRequestSchema,
	BulkCreateCustomersRequestSchema as InBulkCreateCustomersRequestSchema,
	BulkDeleteCustomersRequestSchema as InBulkDeleteCustomersRequestSchema,
	BulkDeleteLocationCustomAttributesRequestSchema as InBulkDeleteLocationCustomAttributesRequestSchema,
	BulkDeleteMerchantCustomAttributesRequestSchema as InBulkDeleteMerchantCustomAttributesRequestSchema,
	BulkRetrieveChannelsRequestSchema as InBulkRetrieveChannelsRequestSchema,
	BulkRetrieveCustomersRequestSchema as InBulkRetrieveCustomersRequestSchema,
	BulkUpdateCustomersRequestSchema as InBulkUpdateCustomersRequestSchema,
	BulkUpsertCustomerCustomAttributesRequestSchema as InBulkUpsertCustomerCustomAttributesRequestSchema,
	BulkUpsertLocationCustomAttributesRequestSchema as InBulkUpsertLocationCustomAttributesRequestSchema,
	BulkUpsertMerchantCustomAttributesRequestSchema as InBulkUpsertMerchantCustomAttributesRequestSchema,
	CalculateOrderRequestSchema as InCalculateOrderRequestSchema,
	CancelInvoiceRequestSchema as InCancelInvoiceRequestSchema,
	CancelPaymentByIdempotencyKeyRequestSchema as InCancelPaymentByIdempotencyKeyRequestSchema,
	ChannelStatusSchema as InChannelStatusSchema,
	CompletePaymentRequestSchema as InCompletePaymentRequestSchema,
	CreateCardRequestSchema as InCreateCardRequestSchema,
	CreateCustomerCustomAttributeDefinitionRequestForCreateSchema as InCreateCustomerCustomAttributeDefinitionRequestForCreateSchema,
	CreateCustomerGroupRequestSchema as InCreateCustomerGroupRequestSchema,
	CreateCustomerRequestSchema as InCreateCustomerRequestSchema,
	CreateDisputeEvidenceFileRequestSchema as InCreateDisputeEvidenceFileRequestSchema,
	CreateDisputeEvidenceTextRequestSchema as InCreateDisputeEvidenceTextRequestSchema,
	CreateInvoiceAttachmentRequestSchema as InCreateInvoiceAttachmentRequestSchema,
	CreateInvoiceRequestForCreateSchema as InCreateInvoiceRequestForCreateSchema,
	CreateLocationCustomAttributeDefinitionRequestForCreateSchema as InCreateLocationCustomAttributeDefinitionRequestForCreateSchema,
	CreateLocationRequestSchema as InCreateLocationRequestSchema,
	CreateMerchantCustomAttributeDefinitionRequestForCreateSchema as InCreateMerchantCustomAttributeDefinitionRequestForCreateSchema,
	CreateOrderRequestSchema as InCreateOrderRequestSchema,
	CreatePaymentLinkRequestSchema as InCreatePaymentLinkRequestSchema,
	CreatePaymentRequestSchema as InCreatePaymentRequestSchema,
	CreateWebhookSubscriptionRequestSchema as InCreateWebhookSubscriptionRequestSchema,
	CustomerSortFieldSchema as InCustomerSortFieldSchema,
	DisputeStateSchema as InDisputeStateSchema,
	ListPaymentRefundsRequestSortFieldSchema as InListPaymentRefundsRequestSortFieldSchema,
	ListPaymentsRequestSortFieldSchema as InListPaymentsRequestSortFieldSchema,
	PayOrderRequestSchema as InPayOrderRequestSchema,
	PublishInvoiceRequestSchema as InPublishInvoiceRequestSchema,
	ReferenceTypeSchema as InReferenceTypeSchema,
	RefundPaymentRequestSchema as InRefundPaymentRequestSchema,
	SearchCatalogObjectsRequestSchema as InSearchCatalogObjectsRequestSchema,
	SearchCustomersRequestSchema as InSearchCustomersRequestSchema,
	SearchInvoicesRequestSchema as InSearchInvoicesRequestSchema,
	SearchOrdersRequestSchema as InSearchOrdersRequestSchema,
	SortOrderSchema as InSortOrderSchema,
	TestWebhookSubscriptionRequestSchema as InTestWebhookSubscriptionRequestSchema,
	UpdateCustomerCustomAttributeDefinitionRequestSchema as InUpdateCustomerCustomAttributeDefinitionRequestSchema,
	UpdateCustomerGroupRequestSchema as InUpdateCustomerGroupRequestSchema,
	UpdateCustomerRequestSchema as InUpdateCustomerRequestSchema,
	UpdateInvoiceRequestSchema as InUpdateInvoiceRequestSchema,
	UpdateLocationCustomAttributeDefinitionRequestSchema as InUpdateLocationCustomAttributeDefinitionRequestSchema,
	UpdateLocationRequestSchema as InUpdateLocationRequestSchema,
	UpdateLocationSettingsRequestSchema as InUpdateLocationSettingsRequestSchema,
	UpdateMerchantCustomAttributeDefinitionRequestSchema as InUpdateMerchantCustomAttributeDefinitionRequestSchema,
	UpdateOrderRequestSchema as InUpdateOrderRequestSchema,
	UpdatePaymentLinkRequestSchema as InUpdatePaymentLinkRequestSchema,
	UpdatePaymentRequestSchema as InUpdatePaymentRequestSchema,
	UpdateWebhookSubscriptionRequestSchema as InUpdateWebhookSubscriptionRequestSchema,
	UpdateWebhookSubscriptionSignatureKeyRequestSchema as InUpdateWebhookSubscriptionSignatureKeyRequestSchema,
	UpsertCatalogObjectRequestSchema as InUpsertCatalogObjectRequestSchema,
	UpsertCustomerCustomAttributeRequestSchema as InUpsertCustomerCustomAttributeRequestSchema,
	UpsertLocationCustomAttributeRequestSchema as InUpsertLocationCustomAttributeRequestSchema,
	UpsertMerchantCustomAttributeRequestSchema as InUpsertMerchantCustomAttributeRequestSchema,
	VisibilityFilterSchema as InVisibilityFilterSchema,
} from './request-schemas';
import {
	AcceptDisputeResponseSchema as OutAcceptDisputeResponseSchema,
	AddGroupToCustomerResponseSchema as OutAddGroupToCustomerResponseSchema,
	BatchRetrieveInventoryCountsResponseSchema as OutBatchRetrieveInventoryCountsResponseSchema,
	BulkCreateCustomersResponseSchema as OutBulkCreateCustomersResponseSchema,
	BulkDeleteCustomersResponseSchema as OutBulkDeleteCustomersResponseSchema,
	BulkDeleteLocationCustomAttributesResponseSchema as OutBulkDeleteLocationCustomAttributesResponseSchema,
	BulkDeleteMerchantCustomAttributesResponseSchema as OutBulkDeleteMerchantCustomAttributesResponseSchema,
	BulkRetrieveChannelsResponseSchema as OutBulkRetrieveChannelsResponseSchema,
	BulkRetrieveCustomersResponseSchema as OutBulkRetrieveCustomersResponseSchema,
	BulkUpdateCustomersResponseSchema as OutBulkUpdateCustomersResponseSchema,
	BulkUpsertCustomerCustomAttributesResponseSchema as OutBulkUpsertCustomerCustomAttributesResponseSchema,
	BulkUpsertLocationCustomAttributesResponseSchema as OutBulkUpsertLocationCustomAttributesResponseSchema,
	BulkUpsertMerchantCustomAttributesResponseSchema as OutBulkUpsertMerchantCustomAttributesResponseSchema,
	CalculateOrderResponseSchema as OutCalculateOrderResponseSchema,
	CancelInvoiceResponseSchema as OutCancelInvoiceResponseSchema,
	CancelPaymentByIdempotencyKeyResponseSchema as OutCancelPaymentByIdempotencyKeyResponseSchema,
	CancelPaymentResponseSchema as OutCancelPaymentResponseSchema,
	CompletePaymentResponseSchema as OutCompletePaymentResponseSchema,
	CreateCardResponseSchema as OutCreateCardResponseSchema,
	CreateCustomerCustomAttributeDefinitionResponseSchema as OutCreateCustomerCustomAttributeDefinitionResponseSchema,
	CreateCustomerGroupResponseSchema as OutCreateCustomerGroupResponseSchema,
	CreateCustomerResponseSchema as OutCreateCustomerResponseSchema,
	CreateDisputeEvidenceFileResponseSchema as OutCreateDisputeEvidenceFileResponseSchema,
	CreateDisputeEvidenceTextResponseSchema as OutCreateDisputeEvidenceTextResponseSchema,
	CreateInvoiceAttachmentResponseSchema as OutCreateInvoiceAttachmentResponseSchema,
	CreateInvoiceResponseSchema as OutCreateInvoiceResponseSchema,
	CreateLocationCustomAttributeDefinitionResponseSchema as OutCreateLocationCustomAttributeDefinitionResponseSchema,
	CreateLocationResponseSchema as OutCreateLocationResponseSchema,
	CreateMerchantCustomAttributeDefinitionResponseSchema as OutCreateMerchantCustomAttributeDefinitionResponseSchema,
	CreateOrderResponseSchema as OutCreateOrderResponseSchema,
	CreatePaymentLinkResponseSchema as OutCreatePaymentLinkResponseSchema,
	CreatePaymentResponseSchema as OutCreatePaymentResponseSchema,
	CreateWebhookSubscriptionResponseSchema as OutCreateWebhookSubscriptionResponseSchema,
	DeleteCatalogObjectResponseSchema as OutDeleteCatalogObjectResponseSchema,
	DeleteCustomerCustomAttributeDefinitionResponseSchema as OutDeleteCustomerCustomAttributeDefinitionResponseSchema,
	DeleteCustomerCustomAttributeResponseSchema as OutDeleteCustomerCustomAttributeResponseSchema,
	DeleteCustomerGroupResponseSchema as OutDeleteCustomerGroupResponseSchema,
	DeleteCustomerResponseSchema as OutDeleteCustomerResponseSchema,
	DeleteDisputeEvidenceResponseSchema as OutDeleteDisputeEvidenceResponseSchema,
	DeleteInvoiceAttachmentResponseSchema as OutDeleteInvoiceAttachmentResponseSchema,
	DeleteInvoiceResponseSchema as OutDeleteInvoiceResponseSchema,
	DeleteLocationCustomAttributeDefinitionResponseSchema as OutDeleteLocationCustomAttributeDefinitionResponseSchema,
	DeleteLocationCustomAttributeResponseSchema as OutDeleteLocationCustomAttributeResponseSchema,
	DeleteMerchantCustomAttributeDefinitionResponseSchema as OutDeleteMerchantCustomAttributeDefinitionResponseSchema,
	DeleteMerchantCustomAttributeResponseSchema as OutDeleteMerchantCustomAttributeResponseSchema,
	DeletePaymentLinkResponseSchema as OutDeletePaymentLinkResponseSchema,
	DeleteWebhookSubscriptionResponseSchema as OutDeleteWebhookSubscriptionResponseSchema,
	DisableCardResponseSchema as OutDisableCardResponseSchema,
	GetInvoiceResponseSchema as OutGetInvoiceResponseSchema,
	GetPaymentRefundResponseSchema as OutGetPaymentRefundResponseSchema,
	GetPaymentResponseSchema as OutGetPaymentResponseSchema,
	ListCardsResponseSchema as OutListCardsResponseSchema,
	ListCatalogResponseSchema as OutListCatalogResponseSchema,
	ListChannelsResponseSchema as OutListChannelsResponseSchema,
	ListCustomerCustomAttributeDefinitionsResponseSchema as OutListCustomerCustomAttributeDefinitionsResponseSchema,
	ListCustomerCustomAttributesResponseSchema as OutListCustomerCustomAttributesResponseSchema,
	ListCustomerGroupsResponseSchema as OutListCustomerGroupsResponseSchema,
	ListCustomerSegmentsResponseSchema as OutListCustomerSegmentsResponseSchema,
	ListCustomersResponseSchema as OutListCustomersResponseSchema,
	ListDisputeEvidenceResponseSchema as OutListDisputeEvidenceResponseSchema,
	ListDisputesResponseSchema as OutListDisputesResponseSchema,
	ListInvoicesResponseSchema as OutListInvoicesResponseSchema,
	ListLocationCustomAttributeDefinitionsResponseSchema as OutListLocationCustomAttributeDefinitionsResponseSchema,
	ListLocationCustomAttributesResponseSchema as OutListLocationCustomAttributesResponseSchema,
	ListLocationsResponseSchema as OutListLocationsResponseSchema,
	ListMerchantCustomAttributeDefinitionsResponseSchema as OutListMerchantCustomAttributeDefinitionsResponseSchema,
	ListMerchantCustomAttributesResponseSchema as OutListMerchantCustomAttributesResponseSchema,
	ListMerchantsResponseSchema as OutListMerchantsResponseSchema,
	ListPaymentLinksResponseSchema as OutListPaymentLinksResponseSchema,
	ListPaymentRefundsResponseSchema as OutListPaymentRefundsResponseSchema,
	ListPaymentsResponseSchema as OutListPaymentsResponseSchema,
	ListWebhookEventTypesResponseSchema as OutListWebhookEventTypesResponseSchema,
	ListWebhookSubscriptionsResponseSchema as OutListWebhookSubscriptionsResponseSchema,
	PayOrderResponseSchema as OutPayOrderResponseSchema,
	PublishInvoiceResponseSchema as OutPublishInvoiceResponseSchema,
	RefundPaymentResponseSchema as OutRefundPaymentResponseSchema,
	RemoveGroupFromCustomerResponseSchema as OutRemoveGroupFromCustomerResponseSchema,
	RetrieveBusinessBookingProfileResponseSchema as OutRetrieveBusinessBookingProfileResponseSchema,
	RetrieveCardResponseSchema as OutRetrieveCardResponseSchema,
	RetrieveCatalogObjectResponseSchema as OutRetrieveCatalogObjectResponseSchema,
	RetrieveChannelResponseSchema as OutRetrieveChannelResponseSchema,
	RetrieveCustomerCustomAttributeDefinitionResponseSchema as OutRetrieveCustomerCustomAttributeDefinitionResponseSchema,
	RetrieveCustomerCustomAttributeResponseSchema as OutRetrieveCustomerCustomAttributeResponseSchema,
	RetrieveCustomerGroupResponseSchema as OutRetrieveCustomerGroupResponseSchema,
	RetrieveCustomerResponseSchema as OutRetrieveCustomerResponseSchema,
	RetrieveCustomerSegmentResponseSchema as OutRetrieveCustomerSegmentResponseSchema,
	RetrieveDisputeEvidenceResponseSchema as OutRetrieveDisputeEvidenceResponseSchema,
	RetrieveDisputeResponseSchema as OutRetrieveDisputeResponseSchema,
	RetrieveInventoryCountResponseSchema as OutRetrieveInventoryCountResponseSchema,
	RetrieveLocationCustomAttributeDefinitionResponseSchema as OutRetrieveLocationCustomAttributeDefinitionResponseSchema,
	RetrieveLocationCustomAttributeResponseSchema as OutRetrieveLocationCustomAttributeResponseSchema,
	RetrieveLocationResponseSchema as OutRetrieveLocationResponseSchema,
	RetrieveLocationSettingsResponseSchema as OutRetrieveLocationSettingsResponseSchema,
	RetrieveMerchantCustomAttributeDefinitionResponseSchema as OutRetrieveMerchantCustomAttributeDefinitionResponseSchema,
	RetrieveMerchantCustomAttributeResponseSchema as OutRetrieveMerchantCustomAttributeResponseSchema,
	RetrieveMerchantResponseSchema as OutRetrieveMerchantResponseSchema,
	RetrieveOrderResponseSchema as OutRetrieveOrderResponseSchema,
	RetrievePaymentLinkResponseSchema as OutRetrievePaymentLinkResponseSchema,
	RetrieveTokenStatusResponseSchema as OutRetrieveTokenStatusResponseSchema,
	RetrieveWebhookSubscriptionResponseSchema as OutRetrieveWebhookSubscriptionResponseSchema,
	SearchCatalogObjectsResponseSchema as OutSearchCatalogObjectsResponseSchema,
	SearchCustomersResponseSchema as OutSearchCustomersResponseSchema,
	SearchInvoicesResponseSchema as OutSearchInvoicesResponseSchema,
	SearchOrdersResponseSchema as OutSearchOrdersResponseSchema,
	SubmitEvidenceResponseSchema as OutSubmitEvidenceResponseSchema,
	TestWebhookSubscriptionResponseSchema as OutTestWebhookSubscriptionResponseSchema,
	UpdateCustomerCustomAttributeDefinitionResponseSchema as OutUpdateCustomerCustomAttributeDefinitionResponseSchema,
	UpdateCustomerGroupResponseSchema as OutUpdateCustomerGroupResponseSchema,
	UpdateCustomerResponseSchema as OutUpdateCustomerResponseSchema,
	UpdateInvoiceResponseSchema as OutUpdateInvoiceResponseSchema,
	UpdateLocationCustomAttributeDefinitionResponseSchema as OutUpdateLocationCustomAttributeDefinitionResponseSchema,
	UpdateLocationResponseSchema as OutUpdateLocationResponseSchema,
	UpdateLocationSettingsResponseSchema as OutUpdateLocationSettingsResponseSchema,
	UpdateMerchantCustomAttributeDefinitionResponseSchema as OutUpdateMerchantCustomAttributeDefinitionResponseSchema,
	UpdateOrderResponseSchema as OutUpdateOrderResponseSchema,
	UpdatePaymentLinkResponseSchema as OutUpdatePaymentLinkResponseSchema,
	UpdatePaymentResponseSchema as OutUpdatePaymentResponseSchema,
	UpdateWebhookSubscriptionResponseSchema as OutUpdateWebhookSubscriptionResponseSchema,
	UpdateWebhookSubscriptionSignatureKeyResponseSchema as OutUpdateWebhookSubscriptionSignatureKeyResponseSchema,
	UpsertCatalogObjectResponseSchema as OutUpsertCatalogObjectResponseSchema,
	UpsertCustomerCustomAttributeResponseSchema as OutUpsertCustomerCustomAttributeResponseSchema,
	UpsertLocationCustomAttributeResponseSchema as OutUpsertLocationCustomAttributeResponseSchema,
	UpsertMerchantCustomAttributeResponseSchema as OutUpsertMerchantCustomAttributeResponseSchema,
} from './response-schemas';

// One input and one output schema per operation, keyed by the camelCase
// operation name (`paymentsCreate` for `payments.create`). An input is the
// operation's path parameters, query parameters and request body as one flat
// object, with Square's own field names.

export const SquareEndpointInputSchemas = {
	disputesAccept: z.object({
		dispute_id: z
			.string()
			.describe('The ID of the dispute you want to accept.'),
	}),
	customersAddGroup: z.object({
		customer_id: z
			.string()
			.describe('The ID of the customer to add to a group.'),
		group_id: z
			.string()
			.describe('The ID of the customer group to add the customer to.'),
	}),
	customAttributesCustomerBulkUpsert:
		InBulkUpsertCustomerCustomAttributesRequestSchema,
	customAttributesLocationBulkUpsert:
		InBulkUpsertLocationCustomAttributesRequestSchema,
	customAttributesMerchantBulkUpsert:
		InBulkUpsertMerchantCustomAttributesRequestSchema,
	customersBulkDelete: InBulkDeleteCustomersRequestSchema,
	channelsBulkGet: InBulkRetrieveChannelsRequestSchema,
	customersBulkUpdate: InBulkUpdateCustomersRequestSchema,
	ordersCalculate: InCalculateOrderRequestSchema,
	invoicesCancel: InCancelInvoiceRequestSchema.extend({
		invoice_id: z.string().describe('The ID of the invoice to cancel.'),
	}),
	paymentsCancel: z.object({
		payment_id: z.string().describe('The ID of the payment to cancel.'),
	}),
	customersBulkCreate: InBulkCreateCustomersRequestSchema,
	cardsCreate: InCreateCardRequestSchema,
	customersCreate: InCreateCustomerRequestSchema,
	customAttributeDefinitionsCustomerCreate:
		InCreateCustomerCustomAttributeDefinitionRequestForCreateSchema,
	customerGroupsCreate: InCreateCustomerGroupRequestSchema,
	disputesCreateEvidenceFile: InCreateDisputeEvidenceFileRequestSchema.extend({
		dispute_id: z
			.string()
			.describe('The ID of the dispute for which you want to upload evidence.'),
		file_base64: z
			.string()
			.min(1)
			.describe(
				"The file's bytes, base64-encoded (standard or URL-safe; a data: URL prefix is accepted).",
			),
		filename: z
			.string()
			.min(1)
			.describe('File name sent with the upload, for example receipt.jpg.'),
	}),
	disputesCreateEvidenceText: InCreateDisputeEvidenceTextRequestSchema.extend({
		dispute_id: z
			.string()
			.describe('The ID of the dispute for which you want to upload evidence.'),
	}),
	invoicesCreateAttachment: InCreateInvoiceAttachmentRequestSchema.extend({
		invoice_id: z
			.string()
			.describe('The ID of the invoice to attach the file to.'),
		file_base64: z
			.string()
			.min(1)
			.describe(
				"The file's bytes, base64-encoded (standard or URL-safe; a data: URL prefix is accepted).",
			),
		filename: z
			.string()
			.min(1)
			.describe('File name sent with the upload, for example receipt.jpg.'),
		content_type: z
			.string()
			.min(1)
			.optional()
			.describe(
				"MIME type of the file, for example application/pdf or image/png. Defaults to the type Square's spec shows, image/jpeg.",
			),
	}),
	locationsCreate: InCreateLocationRequestSchema,
	customAttributeDefinitionsLocationCreate:
		InCreateLocationCustomAttributeDefinitionRequestForCreateSchema,
	customersDelete: z.object({
		customer_id: z.string().describe('The ID of the customer to delete.'),
		version: z
			.number()
			.int()
			.describe('The current version of the customer profile.')
			.optional(),
	}),
	customAttributesCustomerDelete: z.object({
		customer_id: z.string().describe('The ID of the target customer profile.'),
		key: z
			.string()
			.describe(
				'The key of the custom attribute to delete. This key must match the `key` of a custom attribute definition in the Square seller account.',
			),
	}),
	customAttributeDefinitionsCustomerDelete: z.object({
		key: z
			.string()
			.describe('The key of the custom attribute definition to delete.'),
	}),
	customerGroupsDelete: z.object({
		group_id: z.string().describe('The ID of the customer group to delete.'),
	}),
	disputesDeleteEvidence: z.object({
		dispute_id: z
			.string()
			.describe(
				'The ID of the dispute from which you want to remove evidence.',
			),
		evidence_id: z
			.string()
			.describe('The ID of the evidence you want to remove.'),
	}),
	invoicesDelete: z.object({
		invoice_id: z.string().describe('The ID of the invoice to delete.'),
		version: z
			.number()
			.int()
			.describe(
				'The version of the invoice to delete. If you do not know the version, you can call GetInvoice or ListInvoices.',
			)
			.optional(),
	}),
	invoicesDeleteAttachment: z.object({
		invoice_id: z
			.string()
			.describe('The ID of the invoice to delete the attachment from.'),
		attachment_id: z.string().describe('The ID of the attachment to delete.'),
	}),
	customAttributesLocationDelete: z.object({
		location_id: z.string().describe('The ID of the target location.'),
		key: z
			.string()
			.describe(
				'The key of the custom attribute to delete. This key must match the `key` of a custom attribute definition in the Square seller account.',
			),
	}),
	customAttributeDefinitionsLocationDelete: z.object({
		key: z
			.string()
			.describe('The key of the custom attribute definition to delete.'),
	}),
	customAttributesLocationBulkDelete:
		InBulkDeleteLocationCustomAttributesRequestSchema,
	customAttributesMerchantDelete: z.object({
		merchant_id: z.string().describe('The ID of the target merchant.'),
		key: z
			.string()
			.describe(
				'The key of the custom attribute to delete. This key must match the `key` of a custom attribute definition in the Square seller account.',
			),
	}),
	customAttributeDefinitionsMerchantDelete: z.object({
		key: z
			.string()
			.describe('The key of the custom attribute definition to delete.'),
	}),
	customAttributesMerchantBulkDelete:
		InBulkDeleteMerchantCustomAttributesRequestSchema,
	webhookSubscriptionsDelete: z.object({
		subscription_id: z
			.string()
			.describe('[REQUIRED] The ID of the Subscription to delete.'),
	}),
	bookingsGetBusinessProfile: z.object({}),
	merchantsGet: z.object({
		merchant_id: z
			.string()
			.describe(
				'The ID of the merchant to retrieve. If the string "me" is supplied as the ID, then retrieve the merchant that is currently accessible to this call.',
			),
	}),
	customAttributesCustomerGet: z.object({
		customer_id: z.string().describe('The ID of the target customer profile.'),
		key: z
			.string()
			.describe(
				'The key of the custom attribute to retrieve. This key must match the `key` of a custom attribute definition in the Square seller account.',
			),
		with_definition: z
			.boolean()
			.describe(
				'Indicates whether to return the custom attribute definition in the `definition` field of the custom attribute.',
			)
			.optional(),
		version: z
			.number()
			.int()
			.describe(
				'The current version of the custom attribute, which is used for strongly consistent reads to guarantee that you receive the most up-to-date data.',
			)
			.optional(),
	}),
	customAttributeDefinitionsCustomerGet: z.object({
		key: z
			.string()
			.describe(
				'The key of the custom attribute definition to retrieve. If the requesting application is not the definition owner, you must use the qualified key.',
			),
		version: z
			.number()
			.int()
			.describe(
				'The current version of the custom attribute definition, which is used for strongly consistent reads to guarantee that you receive the most up-to-date data.',
			)
			.optional(),
	}),
	disputesGetEvidence: z.object({
		dispute_id: z
			.string()
			.describe(
				'The ID of the dispute from which you want to retrieve evidence metadata.',
			),
		evidence_id: z.string().describe('The ID of the evidence to retrieve.'),
	}),
	invoicesGet: z.object({
		invoice_id: z.string().describe('The ID of the invoice to retrieve.'),
	}),
	checkoutGetLocationSettings: z.object({
		location_id: z
			.string()
			.describe('The ID of the location for which to retrieve settings.'),
	}),
	channelsList: z.object({
		reference_type: InReferenceTypeSchema.describe(
			'Type of reference associated to channel',
		).optional(),
		reference_id: z
			.string()
			.describe('id of reference associated to channel')
			.optional(),
		status: InChannelStatusSchema.describe('Status of channel').optional(),
		cursor: z.string().describe('Cursor to fetch the next result').optional(),
		limit: z
			.number()
			.int()
			.describe(
				'Maximum number of results to return. When not provided the returned results will be cap at 100 channels.',
			)
			.optional(),
	}),
	customAttributeDefinitionsCustomerList: z.object({
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single paged response. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'The cursor returned in the paged response from the previous call to this endpoint. Provide this cursor to retrieve the next page of results for your original request.',
			)
			.optional(),
	}),
	customAttributesCustomerList: z.object({
		customer_id: z.string().describe('The ID of the target customer profile.'),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single paged response. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'The cursor returned in the paged response from the previous call to this endpoint. Provide this cursor to retrieve the next page of results for your original request.',
			)
			.optional(),
		with_definitions: z
			.boolean()
			.describe(
				'Indicates whether to return the custom attribute definition in the `definition` field of each custom attribute.',
			)
			.optional(),
	}),
	customerGroupsList: z.object({
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for your original query.',
			)
			.optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single page. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
	}),
	customerSegmentsList: z.object({
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by previous calls to `ListCustomerSegments`. This cursor is used to retrieve the next set of query results.',
			)
			.optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single page. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
	}),
	customersList: z.object({
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for your original query.',
			)
			.optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single page. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
		sort_field: InCustomerSortFieldSchema.describe(
			'Indicates how customers should be sorted.',
		).optional(),
		sort_order: InSortOrderSchema.describe(
			'Indicates whether customers should be sorted in ascending (`ASC`) or descending (`DESC`) order.',
		).optional(),
		count: z
			.boolean()
			.describe(
				'Indicates whether to return the total count of customers in the `count` field of the response.',
			)
			.optional(),
	}),
	disputesListEvidence: z.object({
		dispute_id: z.string().describe('The ID of the dispute.'),
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for the original query.',
			)
			.optional(),
	}),
	invoicesList: z.object({
		location_id: z
			.string()
			.describe('The ID of the location for which to list invoices.'),
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for your original query.',
			)
			.optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of invoices to return (200 is the maximum `limit`). If not provided, the server uses a default limit of 100 invoices.',
			)
			.optional(),
	}),
	customAttributeDefinitionsLocationList: z.object({
		visibility_filter: InVisibilityFilterSchema.describe(
			'Filters the `CustomAttributeDefinition` results by their `visibility` values.',
		).optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single paged response. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'The cursor returned in the paged response from the previous call to this endpoint. Provide this cursor to retrieve the next page of results for your original request.',
			)
			.optional(),
	}),
	locationsList: z.object({}),
	customAttributesLocationList: z.object({
		location_id: z.string().describe('The ID of the target location.'),
		visibility_filter: InVisibilityFilterSchema.describe(
			'Filters the `CustomAttributeDefinition` results by their `visibility` values.',
		).optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single paged response. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'The cursor returned in the paged response from the previous call to this endpoint. Provide this cursor to retrieve the next page of results for your original request.',
			)
			.optional(),
		with_definitions: z
			.boolean()
			.describe(
				'Indicates whether to return the custom attribute definition in the `definition` field of each custom attribute.',
			)
			.optional(),
	}),
	customAttributeDefinitionsMerchantList: z.object({
		visibility_filter: InVisibilityFilterSchema.describe(
			'Filters the `CustomAttributeDefinition` results by their `visibility` values.',
		).optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single paged response. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'The cursor returned in the paged response from the previous call to this endpoint. Provide this cursor to retrieve the next page of results for your original request.',
			)
			.optional(),
	}),
	merchantsList: z.object({
		cursor: z
			.number()
			.int()
			.describe('The cursor generated by the previous response.')
			.optional(),
	}),
	customAttributesMerchantList: z.object({
		merchant_id: z.string().describe('The ID of the target merchant.'),
		visibility_filter: InVisibilityFilterSchema.describe(
			'Filters the `CustomAttributeDefinition` results by their `visibility` values.',
		).optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to return in a single paged response. This limit is advisory. The response might contain more or fewer results.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'The cursor returned in the paged response from the previous call to this endpoint. Provide this cursor to retrieve the next page of results for your original request.',
			)
			.optional(),
		with_definitions: z
			.boolean()
			.describe(
				'Indicates whether to return the custom attribute definition in the `definition` field of each custom attribute.',
			)
			.optional(),
	}),
	paymentsList: z.object({
		begin_time: z
			.string()
			.describe(
				'Indicates the start of the time range to retrieve payments for, in RFC 3339 format. The range is determined using the `created_at` field for each Payment. Inclusive.',
			)
			.optional(),
		end_time: z
			.string()
			.describe(
				'Indicates the end of the time range to retrieve payments for, in RFC 3339 format. The range is determined using the `created_at` field for each Payment.',
			)
			.optional(),
		sort_order: z
			.string()
			.describe(
				'The order in which results are listed by `ListPaymentsRequest.sort_field`: - `ASC` - Oldest to newest. - `DESC` - Newest to oldest (default).',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for the original query.',
			)
			.optional(),
		location_id: z
			.string()
			.describe(
				'Limit results to the location supplied. By default, results are returned for the default (main) location associated with the seller.',
			)
			.optional(),
		total: z
			.number()
			.int()
			.describe('The exact amount in the `total_money` for a payment.')
			.optional(),
		last_4: z
			.string()
			.describe('The last four digits of a payment card.')
			.optional(),
		card_brand: z
			.string()
			.describe('The brand of the payment card (for example, VISA).')
			.optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to be returned in a single page. It is possible to receive fewer results than the specified limit on a given page.',
			)
			.optional(),
		is_offline_payment: z
			.boolean()
			.describe('Whether the payment was taken offline or not.')
			.optional(),
		offline_begin_time: z
			.string()
			.describe(
				'Indicates the start of the time range for which to retrieve offline payments, in RFC 3339 format for timestamps. The range is determined using the `offline_payment_details.',
			)
			.optional(),
		offline_end_time: z
			.string()
			.describe(
				'Indicates the end of the time range for which to retrieve offline payments, in RFC 3339 format for timestamps. The range is determined using the `offline_payment_details.',
			)
			.optional(),
		updated_at_begin_time: z
			.string()
			.describe(
				'Indicates the start of the time range to retrieve payments for, in RFC 3339 format. The range is determined using the `updated_at` field for each Payment.',
			)
			.optional(),
		updated_at_end_time: z
			.string()
			.describe(
				'Indicates the end of the time range to retrieve payments for, in RFC 3339 format. The range is determined using the `updated_at` field for each Payment.',
			)
			.optional(),
		sort_field: InListPaymentsRequestSortFieldSchema.describe(
			'The field used to sort results by. The default is `CREATED_AT`.',
		).optional(),
	}),
	webhookEventTypesList: z.object({
		api_version: z
			.string()
			.describe(
				'The API version for which to list event types. Setting this field overrides the default version used by the application.',
			)
			.optional(),
	}),
	webhookSubscriptionsList: z.object({
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this to retrieve the next set of results for your original query.',
			)
			.optional(),
		include_disabled: z
			.boolean()
			.describe(
				'Includes disabled Subscriptions. By default, all enabled Subscriptions are returned.',
			)
			.optional(),
		sort_order: InSortOrderSchema.describe(
			'Sorts the returned list by when the Subscription was created with the specified order. This field defaults to ASC.',
		).optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to be returned in a single page. It is possible to receive fewer results than the specified limit on a given page.',
			)
			.optional(),
	}),
	customersRemoveGroup: z.object({
		customer_id: z
			.string()
			.describe('The ID of the customer to remove from the group.'),
		group_id: z
			.string()
			.describe('The ID of the customer group to remove the customer from.'),
	}),
	customersBulkGet: InBulkRetrieveCustomersRequestSchema,
	channelsGet: z.object({
		channel_id: z.string().describe('A channel id'),
	}),
	customersGet: z.object({
		customer_id: z.string().describe('The ID of the customer to retrieve.'),
	}),
	customerGroupsGet: z.object({
		group_id: z.string().describe('The ID of the customer group to retrieve.'),
	}),
	customerSegmentsGet: z.object({
		segment_id: z
			.string()
			.describe('The Square-issued ID of the customer segment.'),
	}),
	disputesGet: z.object({
		dispute_id: z
			.string()
			.describe('The ID of the dispute you want more details about.'),
	}),
	locationsGet: z.object({
		location_id: z
			.string()
			.describe(
				'The ID of the location to retrieve. Specify the string "main" to return the main location.',
			),
	}),
	customAttributesLocationGet: z.object({
		location_id: z.string().describe('The ID of the target location.'),
		key: z
			.string()
			.describe(
				'The key of the custom attribute to retrieve. This key must match the `key` of a custom attribute definition in the Square seller account.',
			),
		with_definition: z
			.boolean()
			.describe(
				'Indicates whether to return the custom attribute definition in the `definition` field of the custom attribute.',
			)
			.optional(),
		version: z
			.number()
			.int()
			.describe(
				'The current version of the custom attribute, which is used for strongly consistent reads to guarantee that you receive the most up-to-date data.',
			)
			.optional(),
	}),
	customAttributeDefinitionsLocationGet: z.object({
		key: z
			.string()
			.describe(
				'The key of the custom attribute definition to retrieve. If the requesting application is not the definition owner, you must use the qualified key.',
			),
		version: z
			.number()
			.int()
			.describe(
				'The current version of the custom attribute definition, which is used for strongly consistent reads to guarantee that you receive the most up-to-date data.',
			)
			.optional(),
	}),
	customAttributesMerchantGet: z.object({
		merchant_id: z.string().describe('The ID of the target merchant.'),
		key: z
			.string()
			.describe(
				'The key of the custom attribute to retrieve. This key must match the `key` of a custom attribute definition in the Square seller account.',
			),
		with_definition: z
			.boolean()
			.describe(
				'Indicates whether to return the custom attribute definition in the `definition` field of the custom attribute.',
			)
			.optional(),
		version: z
			.number()
			.int()
			.describe(
				'The current version of the custom attribute, which is used for strongly consistent reads to guarantee that you receive the most up-to-date data.',
			)
			.optional(),
	}),
	customAttributeDefinitionsMerchantGet: z.object({
		key: z
			.string()
			.describe(
				'The key of the custom attribute definition to retrieve. If the requesting application is not the definition owner, you must use the qualified key.',
			),
		version: z
			.number()
			.int()
			.describe(
				'The current version of the custom attribute definition, which is used for strongly consistent reads to guarantee that you receive the most up-to-date data.',
			)
			.optional(),
	}),
	ordersGet: z.object({
		order_id: z.string().describe('The ID of the order to retrieve.'),
	}),
	paymentLinksGet: z.object({
		id: z.string().describe('The ID of link to retrieve.'),
	}),
	oauthGetTokenStatus: z.object({}),
	webhookSubscriptionsGet: z.object({
		subscription_id: z
			.string()
			.describe('[REQUIRED] The ID of the Subscription to retrieve.'),
	}),
	customersSearch: InSearchCustomersRequestSchema,
	ordersSearch: InSearchOrdersRequestSchema,
	disputesSubmitEvidence: z.object({
		dispute_id: z
			.string()
			.describe('The ID of the dispute for which you want to submit evidence.'),
	}),
	webhookSubscriptionsTest: InTestWebhookSubscriptionRequestSchema.extend({
		subscription_id: z
			.string()
			.describe('[REQUIRED] The ID of the Subscription to test.'),
	}),
	customersUpdate: InUpdateCustomerRequestSchema.extend({
		customer_id: z.string().describe('The ID of the customer to update.'),
	}),
	customAttributeDefinitionsCustomerUpdate:
		InUpdateCustomerCustomAttributeDefinitionRequestSchema.extend({
			key: z
				.string()
				.describe('The key of the custom attribute definition to update.'),
		}),
	customerGroupsUpdate: InUpdateCustomerGroupRequestSchema.extend({
		group_id: z.string().describe('The ID of the customer group to update.'),
	}),
	locationsUpdate: InUpdateLocationRequestSchema.extend({
		location_id: z.string().describe('The ID of the location to update.'),
	}),
	customAttributeDefinitionsLocationUpdate:
		InUpdateLocationCustomAttributeDefinitionRequestSchema.extend({
			key: z
				.string()
				.describe('The key of the custom attribute definition to update.'),
		}),
	customAttributeDefinitionsMerchantUpdate:
		InUpdateMerchantCustomAttributeDefinitionRequestSchema.extend({
			key: z
				.string()
				.describe('The key of the custom attribute definition to update.'),
		}),
	checkoutUpdateLocationSettings: InUpdateLocationSettingsRequestSchema.extend({
		location_id: z
			.string()
			.describe('The ID of the location for which to retrieve settings.'),
	}),
	ordersUpdate: InUpdateOrderRequestSchema.extend({
		order_id: z.string().describe('The ID of the order to update.'),
	}),
	webhookSubscriptionsUpdate: InUpdateWebhookSubscriptionRequestSchema.extend({
		subscription_id: z
			.string()
			.describe('[REQUIRED] The ID of the Subscription to update.'),
	}),
	webhookSubscriptionsUpdateSignatureKey:
		InUpdateWebhookSubscriptionSignatureKeyRequestSchema.extend({
			subscription_id: z
				.string()
				.describe('[REQUIRED] The ID of the Subscription to update.'),
		}),
	customAttributesCustomerUpsert:
		InUpsertCustomerCustomAttributeRequestSchema.extend({
			customer_id: z
				.string()
				.describe('The ID of the target customer profile.'),
			key: z
				.string()
				.describe(
					'The key of the custom attribute to create or update. This key must match the `key` of a custom attribute definition in the Square seller account.',
				),
		}),
	customAttributesLocationUpsert:
		InUpsertLocationCustomAttributeRequestSchema.extend({
			location_id: z.string().describe('The ID of the target location.'),
			key: z
				.string()
				.describe(
					'The key of the custom attribute to create or update. This key must match the `key` of a custom attribute definition in the Square seller account.',
				),
		}),
	customAttributesMerchantUpsert:
		InUpsertMerchantCustomAttributeRequestSchema.extend({
			merchant_id: z.string().describe('The ID of the target merchant.'),
			key: z
				.string()
				.describe(
					'The key of the custom attribute to create or update. This key must match the `key` of a custom attribute definition in the Square seller account.',
				),
		}),
	paymentsCreate: InCreatePaymentRequestSchema,
	paymentsGet: z.object({
		payment_id: z.string().describe('A unique ID for the desired payment.'),
	}),
	paymentsUpdate: InUpdatePaymentRequestSchema.extend({
		payment_id: z.string().describe('The ID of the payment to update.'),
	}),
	paymentsComplete: InCompletePaymentRequestSchema.extend({
		payment_id: z
			.string()
			.describe('The unique ID identifying the payment to be completed.'),
	}),
	paymentsRefund: InRefundPaymentRequestSchema,
	refundsGet: z.object({
		refund_id: z
			.string()
			.describe('The unique ID for the desired `PaymentRefund`.'),
	}),
	refundsList: z.object({
		begin_time: z
			.string()
			.describe(
				'Indicates the start of the time range to retrieve each `PaymentRefund` for, in RFC 3339 format. The range is determined using the `created_at` field for each `PaymentRefund`.',
			)
			.optional(),
		end_time: z
			.string()
			.describe(
				'Indicates the end of the time range to retrieve each `PaymentRefund` for, in RFC 3339 format. The range is determined using the `created_at` field for each `PaymentRefund`.',
			)
			.optional(),
		sort_order: z
			.string()
			.describe(
				'The order in which results are listed by `PaymentRefund.created_at`: - `ASC` - Oldest to newest. - `DESC` - Newest to oldest (default).',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for the original query.',
			)
			.optional(),
		location_id: z
			.string()
			.describe(
				'Limit results to the location supplied. By default, results are returned for all locations associated with the seller.',
			)
			.optional(),
		status: z
			.string()
			.describe(
				'If provided, only refunds with the given status are returned. For a list of refund status values, see PaymentRefund.',
			)
			.optional(),
		source_type: z
			.string()
			.describe(
				'If provided, only returns refunds whose payments have the indicated source type. Current values include `CARD`, `BANK_ACCOUNT`, `WALLET`, `CASH`, and `EXTERNAL`.',
			)
			.optional(),
		limit: z
			.number()
			.int()
			.describe(
				'The maximum number of results to be returned in a single page.',
			)
			.optional(),
		updated_at_begin_time: z
			.string()
			.describe(
				'Indicates the start of the time range to retrieve each `PaymentRefund` for, in RFC 3339 format. The range is determined using the `updated_at` field for each `PaymentRefund`.',
			)
			.optional(),
		updated_at_end_time: z
			.string()
			.describe(
				'Indicates the end of the time range to retrieve each `PaymentRefund` for, in RFC 3339 format. The range is determined using the `updated_at` field for each `PaymentRefund`.',
			)
			.optional(),
		sort_field: InListPaymentRefundsRequestSortFieldSchema.describe(
			'The field used to sort results by. The default is `CREATED_AT`.',
		).optional(),
	}),
	ordersCreate: InCreateOrderRequestSchema,
	ordersPay: InPayOrderRequestSchema.extend({
		order_id: z.string().describe('The ID of the order being paid.'),
	}),
	paymentLinksCreate: InCreatePaymentLinkRequestSchema,
	paymentLinksList: z.object({
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for the original query.',
			)
			.optional(),
		limit: z
			.number()
			.int()
			.describe(
				'A limit on the number of results to return per page. The limit is advisory and the implementation might return more or less results.',
			)
			.optional(),
	}),
	paymentLinksDelete: z.object({
		id: z.string().describe('The ID of the payment link to delete.'),
	}),
	invoicesCreate: InCreateInvoiceRequestForCreateSchema,
	invoicesPublish: InPublishInvoiceRequestSchema.extend({
		invoice_id: z.string().describe('The ID of the invoice to publish.'),
	}),
	invoicesUpdate: InUpdateInvoiceRequestSchema.extend({
		invoice_id: z.string().describe('The ID of the invoice to update.'),
	}),
	invoicesSearch: InSearchInvoicesRequestSchema,
	disputesList: z.object({
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this cursor to retrieve the next set of results for the original query.',
			)
			.optional(),
		states: InDisputeStateSchema.describe(
			'The dispute states used to filter the result. If not specified, the endpoint returns all disputes.',
		).optional(),
		location_id: z
			.string()
			.describe(
				'The ID of the location for which to return a list of disputes. If not specified, the endpoint returns disputes associated with all locations.',
			)
			.optional(),
	}),
	cardsList: z.object({
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this to retrieve the next set of results for your original query.',
			)
			.optional(),
		customer_id: z
			.string()
			.describe(
				'Limit results to cards associated with the customer supplied. By default, all cards owned by the merchant are returned.',
			)
			.optional(),
		include_disabled: z
			.boolean()
			.describe(
				'Includes disabled cards. By default, all enabled cards owned by the merchant are returned.',
			)
			.optional(),
		reference_id: z
			.string()
			.describe(
				'Limit results to cards associated with the reference_id supplied.',
			)
			.optional(),
		sort_order: InSortOrderSchema.describe(
			'Sorts the returned list by when the card was created with the specified order. This field defaults to ASC.',
		).optional(),
	}),
	cardsGet: z.object({
		card_id: z.string().describe('Unique ID for the desired Card.'),
	}),
	cardsDisable: z.object({
		card_id: z.string().describe('Unique ID for the desired Card.'),
	}),
	webhookSubscriptionsCreate: InCreateWebhookSubscriptionRequestSchema,
	catalogList: z.object({
		cursor: z
			.string()
			.describe(
				'The pagination cursor returned in the previous response. Leave unset for an initial request. The page size is currently set to be 100. See Pagination for more information.',
			)
			.optional(),
		types: z
			.string()
			.describe(
				'An optional case-insensitive, comma-separated list of object types to retrieve.',
			)
			.optional(),
		catalog_version: z
			.number()
			.int()
			.describe(
				'The specific version of the catalog objects to be included in the response. This allows you to retrieve historical versions of objects.',
			)
			.optional(),
	}),
	catalogSearch: InSearchCatalogObjectsRequestSchema,
	catalogGet: z.object({
		object_id: z
			.string()
			.describe(
				'The object ID of any type of catalog objects to be retrieved.',
			),
		include_related_objects: z
			.boolean()
			.describe(
				'If `true`, the response will include additional objects that are related to the requested objects.',
			)
			.optional(),
		catalog_version: z
			.number()
			.int()
			.describe(
				'Requests objects as of a specific version of the catalog. This allows you to retrieve historical versions of objects.',
			)
			.optional(),
		include_category_path_to_root: z
			.boolean()
			.describe(
				'Specifies whether or not to include the `path_to_root` list for each returned category instance.',
			)
			.optional(),
	}),
	catalogUpsert: InUpsertCatalogObjectRequestSchema,
	catalogDelete: z.object({
		object_id: z
			.string()
			.describe('The ID of the catalog object to be deleted.'),
	}),
	inventoryBatchGet: InBatchRetrieveInventoryCountsRequestSchema,
	inventoryGet: z.object({
		catalog_object_id: z
			.string()
			.describe('ID of the CatalogObject to retrieve.'),
		location_ids: z
			.string()
			.describe(
				'The Location IDs to look up as a comma-separated list. An empty list queries all locations.',
			)
			.optional(),
		cursor: z
			.string()
			.describe(
				'A pagination cursor returned by a previous call to this endpoint. Provide this to retrieve the next set of results for the original query.',
			)
			.optional(),
	}),
	paymentsCancelByIdempotencyKey: InCancelPaymentByIdempotencyKeyRequestSchema,
	paymentLinksUpdate: InUpdatePaymentLinkRequestSchema.extend({
		id: z.string().describe('The ID of the payment link to update.'),
	}),
	customAttributeDefinitionsMerchantCreate:
		InCreateMerchantCustomAttributeDefinitionRequestForCreateSchema,
} as const;

export const SquareEndpointOutputSchemas = {
	disputesAccept: OutAcceptDisputeResponseSchema,
	customersAddGroup: OutAddGroupToCustomerResponseSchema,
	customAttributesCustomerBulkUpsert:
		OutBulkUpsertCustomerCustomAttributesResponseSchema,
	customAttributesLocationBulkUpsert:
		OutBulkUpsertLocationCustomAttributesResponseSchema,
	customAttributesMerchantBulkUpsert:
		OutBulkUpsertMerchantCustomAttributesResponseSchema,
	customersBulkDelete: OutBulkDeleteCustomersResponseSchema,
	channelsBulkGet: OutBulkRetrieveChannelsResponseSchema,
	customersBulkUpdate: OutBulkUpdateCustomersResponseSchema,
	ordersCalculate: OutCalculateOrderResponseSchema,
	invoicesCancel: OutCancelInvoiceResponseSchema,
	paymentsCancel: OutCancelPaymentResponseSchema,
	customersBulkCreate: OutBulkCreateCustomersResponseSchema,
	cardsCreate: OutCreateCardResponseSchema,
	customersCreate: OutCreateCustomerResponseSchema,
	customAttributeDefinitionsCustomerCreate:
		OutCreateCustomerCustomAttributeDefinitionResponseSchema,
	customerGroupsCreate: OutCreateCustomerGroupResponseSchema,
	disputesCreateEvidenceFile: OutCreateDisputeEvidenceFileResponseSchema,
	disputesCreateEvidenceText: OutCreateDisputeEvidenceTextResponseSchema,
	invoicesCreateAttachment: OutCreateInvoiceAttachmentResponseSchema,
	locationsCreate: OutCreateLocationResponseSchema,
	customAttributeDefinitionsLocationCreate:
		OutCreateLocationCustomAttributeDefinitionResponseSchema,
	customersDelete: OutDeleteCustomerResponseSchema,
	customAttributesCustomerDelete:
		OutDeleteCustomerCustomAttributeResponseSchema,
	customAttributeDefinitionsCustomerDelete:
		OutDeleteCustomerCustomAttributeDefinitionResponseSchema,
	customerGroupsDelete: OutDeleteCustomerGroupResponseSchema,
	disputesDeleteEvidence: OutDeleteDisputeEvidenceResponseSchema,
	invoicesDelete: OutDeleteInvoiceResponseSchema,
	invoicesDeleteAttachment: OutDeleteInvoiceAttachmentResponseSchema,
	customAttributesLocationDelete:
		OutDeleteLocationCustomAttributeResponseSchema,
	customAttributeDefinitionsLocationDelete:
		OutDeleteLocationCustomAttributeDefinitionResponseSchema,
	customAttributesLocationBulkDelete:
		OutBulkDeleteLocationCustomAttributesResponseSchema,
	customAttributesMerchantDelete:
		OutDeleteMerchantCustomAttributeResponseSchema,
	customAttributeDefinitionsMerchantDelete:
		OutDeleteMerchantCustomAttributeDefinitionResponseSchema,
	customAttributesMerchantBulkDelete:
		OutBulkDeleteMerchantCustomAttributesResponseSchema,
	webhookSubscriptionsDelete: OutDeleteWebhookSubscriptionResponseSchema,
	bookingsGetBusinessProfile: OutRetrieveBusinessBookingProfileResponseSchema,
	merchantsGet: OutRetrieveMerchantResponseSchema,
	customAttributesCustomerGet: OutRetrieveCustomerCustomAttributeResponseSchema,
	customAttributeDefinitionsCustomerGet:
		OutRetrieveCustomerCustomAttributeDefinitionResponseSchema,
	disputesGetEvidence: OutRetrieveDisputeEvidenceResponseSchema,
	invoicesGet: OutGetInvoiceResponseSchema,
	checkoutGetLocationSettings: OutRetrieveLocationSettingsResponseSchema,
	channelsList: OutListChannelsResponseSchema,
	customAttributeDefinitionsCustomerList:
		OutListCustomerCustomAttributeDefinitionsResponseSchema,
	customAttributesCustomerList: OutListCustomerCustomAttributesResponseSchema,
	customerGroupsList: OutListCustomerGroupsResponseSchema,
	customerSegmentsList: OutListCustomerSegmentsResponseSchema,
	customersList: OutListCustomersResponseSchema,
	disputesListEvidence: OutListDisputeEvidenceResponseSchema,
	invoicesList: OutListInvoicesResponseSchema,
	customAttributeDefinitionsLocationList:
		OutListLocationCustomAttributeDefinitionsResponseSchema,
	locationsList: OutListLocationsResponseSchema,
	customAttributesLocationList: OutListLocationCustomAttributesResponseSchema,
	customAttributeDefinitionsMerchantList:
		OutListMerchantCustomAttributeDefinitionsResponseSchema,
	merchantsList: OutListMerchantsResponseSchema,
	customAttributesMerchantList: OutListMerchantCustomAttributesResponseSchema,
	paymentsList: OutListPaymentsResponseSchema,
	webhookEventTypesList: OutListWebhookEventTypesResponseSchema,
	webhookSubscriptionsList: OutListWebhookSubscriptionsResponseSchema,
	customersRemoveGroup: OutRemoveGroupFromCustomerResponseSchema,
	customersBulkGet: OutBulkRetrieveCustomersResponseSchema,
	channelsGet: OutRetrieveChannelResponseSchema,
	customersGet: OutRetrieveCustomerResponseSchema,
	customerGroupsGet: OutRetrieveCustomerGroupResponseSchema,
	customerSegmentsGet: OutRetrieveCustomerSegmentResponseSchema,
	disputesGet: OutRetrieveDisputeResponseSchema,
	locationsGet: OutRetrieveLocationResponseSchema,
	customAttributesLocationGet: OutRetrieveLocationCustomAttributeResponseSchema,
	customAttributeDefinitionsLocationGet:
		OutRetrieveLocationCustomAttributeDefinitionResponseSchema,
	customAttributesMerchantGet: OutRetrieveMerchantCustomAttributeResponseSchema,
	customAttributeDefinitionsMerchantGet:
		OutRetrieveMerchantCustomAttributeDefinitionResponseSchema,
	ordersGet: OutRetrieveOrderResponseSchema,
	paymentLinksGet: OutRetrievePaymentLinkResponseSchema,
	oauthGetTokenStatus: OutRetrieveTokenStatusResponseSchema,
	webhookSubscriptionsGet: OutRetrieveWebhookSubscriptionResponseSchema,
	customersSearch: OutSearchCustomersResponseSchema,
	ordersSearch: OutSearchOrdersResponseSchema,
	disputesSubmitEvidence: OutSubmitEvidenceResponseSchema,
	webhookSubscriptionsTest: OutTestWebhookSubscriptionResponseSchema,
	customersUpdate: OutUpdateCustomerResponseSchema,
	customAttributeDefinitionsCustomerUpdate:
		OutUpdateCustomerCustomAttributeDefinitionResponseSchema,
	customerGroupsUpdate: OutUpdateCustomerGroupResponseSchema,
	locationsUpdate: OutUpdateLocationResponseSchema,
	customAttributeDefinitionsLocationUpdate:
		OutUpdateLocationCustomAttributeDefinitionResponseSchema,
	customAttributeDefinitionsMerchantUpdate:
		OutUpdateMerchantCustomAttributeDefinitionResponseSchema,
	checkoutUpdateLocationSettings: OutUpdateLocationSettingsResponseSchema,
	ordersUpdate: OutUpdateOrderResponseSchema,
	webhookSubscriptionsUpdate: OutUpdateWebhookSubscriptionResponseSchema,
	webhookSubscriptionsUpdateSignatureKey:
		OutUpdateWebhookSubscriptionSignatureKeyResponseSchema,
	customAttributesCustomerUpsert:
		OutUpsertCustomerCustomAttributeResponseSchema,
	customAttributesLocationUpsert:
		OutUpsertLocationCustomAttributeResponseSchema,
	customAttributesMerchantUpsert:
		OutUpsertMerchantCustomAttributeResponseSchema,
	paymentsCreate: OutCreatePaymentResponseSchema,
	paymentsGet: OutGetPaymentResponseSchema,
	paymentsUpdate: OutUpdatePaymentResponseSchema,
	paymentsComplete: OutCompletePaymentResponseSchema,
	paymentsRefund: OutRefundPaymentResponseSchema,
	refundsGet: OutGetPaymentRefundResponseSchema,
	refundsList: OutListPaymentRefundsResponseSchema,
	ordersCreate: OutCreateOrderResponseSchema,
	ordersPay: OutPayOrderResponseSchema,
	paymentLinksCreate: OutCreatePaymentLinkResponseSchema,
	paymentLinksList: OutListPaymentLinksResponseSchema,
	paymentLinksDelete: OutDeletePaymentLinkResponseSchema,
	invoicesCreate: OutCreateInvoiceResponseSchema,
	invoicesPublish: OutPublishInvoiceResponseSchema,
	invoicesUpdate: OutUpdateInvoiceResponseSchema,
	invoicesSearch: OutSearchInvoicesResponseSchema,
	disputesList: OutListDisputesResponseSchema,
	cardsList: OutListCardsResponseSchema,
	cardsGet: OutRetrieveCardResponseSchema,
	cardsDisable: OutDisableCardResponseSchema,
	webhookSubscriptionsCreate: OutCreateWebhookSubscriptionResponseSchema,
	catalogList: OutListCatalogResponseSchema,
	catalogSearch: OutSearchCatalogObjectsResponseSchema,
	catalogGet: OutRetrieveCatalogObjectResponseSchema,
	catalogUpsert: OutUpsertCatalogObjectResponseSchema,
	catalogDelete: OutDeleteCatalogObjectResponseSchema,
	inventoryBatchGet: OutBatchRetrieveInventoryCountsResponseSchema,
	inventoryGet: OutRetrieveInventoryCountResponseSchema,
	paymentsCancelByIdempotencyKey:
		OutCancelPaymentByIdempotencyKeyResponseSchema,
	paymentLinksUpdate: OutUpdatePaymentLinkResponseSchema,
	customAttributeDefinitionsMerchantCreate:
		OutCreateMerchantCustomAttributeDefinitionResponseSchema,
} as const;

type InputSchemas = typeof SquareEndpointInputSchemas;
type OutputSchemas = typeof SquareEndpointOutputSchemas;

export type SquareEndpointInputs = {
	[K in keyof InputSchemas]: z.input<InputSchemas[K]>;
};

export type SquareEndpointOutputs = {
	[K in keyof OutputSchemas]: z.output<OutputSchemas[K]>;
};

export type SquareOperation = keyof InputSchemas;
