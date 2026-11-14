import { SquareEndpointOutputSchemas, squareEndpointMeta } from './index';
import {
	BASE,
	createClient,
	jsonBody,
	jsonResponse,
	mockFetch,
	SANDBOX_BASE,
	sentRequest,
	TOKEN,
	VERSION,
} from './test-fixtures';

type Client = Awaited<ReturnType<typeof createClient>>;

type Case = {
	/** The operation, as endpointMeta names it. */
	op: string;
	// unknown: each operation has its own input shape; its schema checks it.
	input: Record<string, unknown>;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** The path Square should receive, path parameters filled in. */
	path: string;
	/** Query parameters Square should receive. */
	query: Record<string, string>;
	/** Expected JSON body; absent when the request has none. */
	// unknown: request bodies differ per operation.
	body?: Record<string, unknown>;
	/** Multipart operations: the JSON `request` part and the file part. */
	multipart?: {
		filePart: string;
		// unknown: the JSON fields of the `request` part.
		requestPart: Record<string, unknown>;
		fileType: string;
	};
	// unknown: Square's JSON answer, which is also what the operation returns.
	reply: Record<string, unknown>;
};

// Inputs and answers follow the request and response schemas in Square's
// OpenAPI spec; paths and methods are the spec's.
const cases: Case[] = [
	{
		op: 'disputes.accept',
		input: {
			dispute_id: 'dispute_id-1',
		},
		method: 'POST',
		path: '/v2/disputes/dispute_id-1/accept',
		query: {},
		reply: {
			dispute: {
				dispute_id: 'dispute_id-1',
				id: 'id-1',
				reason: 'AMOUNT_DIFFERS',
				state: 'INQUIRY_EVIDENCE_REQUIRED',
			},
		},
	},
	{
		op: 'customers.addGroup',
		input: {
			customer_id: 'customer_id-1',
			group_id: 'group_id-1',
		},
		method: 'PUT',
		path: '/v2/customers/customer_id-1/groups/group_id-1',
		query: {},
		reply: {},
	},
	{
		op: 'customAttributes.customer.bulkUpsert',
		input: {
			values: {
				example: {
					customer_id: 'customer_id-1',
					custom_attribute: {},
				},
			},
		},
		method: 'POST',
		path: '/v2/customers/custom-attributes/bulk-upsert',
		query: {},
		body: {
			values: {
				example: {
					customer_id: 'customer_id-1',
					custom_attribute: {},
				},
			},
		},
		reply: {
			values: {
				example: {},
			},
		},
	},
	{
		op: 'customAttributes.location.bulkUpsert',
		input: {
			values: {
				example: {
					location_id: 'location_id-1',
					custom_attribute: {},
				},
			},
		},
		method: 'POST',
		path: '/v2/locations/custom-attributes/bulk-upsert',
		query: {},
		body: {
			values: {
				example: {
					location_id: 'location_id-1',
					custom_attribute: {},
				},
			},
		},
		reply: {
			values: {
				example: {},
			},
		},
	},
	{
		op: 'customAttributes.merchant.bulkUpsert',
		input: {
			values: {
				example: {
					merchant_id: 'merchant_id-1',
					custom_attribute: {},
				},
			},
		},
		method: 'POST',
		path: '/v2/merchants/custom-attributes/bulk-upsert',
		query: {},
		body: {
			values: {
				example: {
					merchant_id: 'merchant_id-1',
					custom_attribute: {},
				},
			},
		},
		reply: {
			values: {
				example: {},
			},
		},
	},
	{
		op: 'customers.bulkDelete',
		input: {
			customer_ids: ['customer_ids-1'],
		},
		method: 'POST',
		path: '/v2/customers/bulk-delete',
		query: {},
		body: {
			customer_ids: ['customer_ids-1'],
		},
		reply: {
			responses: {
				example: {},
			},
		},
	},
	{
		op: 'channels.bulkGet',
		input: {
			channel_ids: ['channel_ids-1'],
		},
		method: 'POST',
		path: '/v2/channels/bulk-retrieve',
		query: {},
		body: {
			channel_ids: ['channel_ids-1'],
		},
		reply: {
			responses: {
				example: {},
			},
		},
	},
	{
		op: 'customers.bulkUpdate',
		input: {
			customers: {
				example: {},
			},
		},
		method: 'POST',
		path: '/v2/customers/bulk-update',
		query: {},
		body: {
			customers: {
				example: {},
			},
		},
		reply: {
			responses: {
				example: {},
			},
		},
	},
	{
		op: 'orders.calculate',
		input: {
			order: {
				location_id: 'location_id-1',
			},
		},
		method: 'POST',
		path: '/v2/orders/calculate',
		query: {},
		body: {
			order: {
				location_id: 'location_id-1',
			},
		},
		reply: {
			order: {
				id: 'id-1',
				location_id: 'location_id-1',
				reference_id: 'reference_id-1',
				customer_id: 'customer_id-1',
			},
		},
	},
	{
		op: 'invoices.cancel',
		input: {
			invoice_id: 'invoice_id-1',
			version: 1,
		},
		method: 'POST',
		path: '/v2/invoices/invoice_id-1/cancel',
		query: {},
		body: {
			version: 1,
		},
		reply: {
			invoice: {
				id: 'id-1',
				version: 1,
				location_id: 'location_id-1',
				order_id: 'order_id-1',
			},
		},
	},
	{
		op: 'payments.cancel',
		input: {
			payment_id: 'payment_id-1',
		},
		method: 'POST',
		path: '/v2/payments/payment_id-1/cancel',
		query: {},
		reply: {
			payment: {
				id: 'id-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
				status: 'status-1',
			},
		},
	},
	{
		op: 'customers.bulkCreate',
		input: {
			customers: {
				example: {},
			},
		},
		method: 'POST',
		path: '/v2/customers/bulk-create',
		query: {},
		body: {
			customers: {
				example: {},
			},
		},
		reply: {
			responses: {
				example: {},
			},
		},
	},
	{
		op: 'cards.create',
		input: {
			idempotency_key: 'idempotency_key-1',
			source_id: 'source_id-1',
			card: {},
		},
		method: 'POST',
		path: '/v2/cards',
		query: {},
		body: {
			idempotency_key: 'idempotency_key-1',
			source_id: 'source_id-1',
			card: {},
		},
		reply: {
			card: {
				id: 'id-1',
				card_brand: 'OTHER_BRAND',
				last_4: 'last',
				exp_month: 1,
			},
		},
	},
	{
		op: 'customers.create',
		input: {},
		method: 'POST',
		path: '/v2/customers',
		query: {},
		body: {},
		reply: {
			customer: {
				id: 'id-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
				given_name: 'given_name-1',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.customer.create',
		input: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {
					$ref: 'https://developer-production-s.squarecdn.com/schemas/v1/common.json#squareup.common.String',
				},
			},
		},
		method: 'POST',
		path: '/v2/customers/custom-attribute-definitions',
		query: {},
		body: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {
					$ref: 'https://developer-production-s.squarecdn.com/schemas/v1/common.json#squareup.common.String',
				},
			},
		},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
	{
		op: 'customerGroups.create',
		input: {
			group: {
				name: 'name-1',
			},
		},
		method: 'POST',
		path: '/v2/customers/groups',
		query: {},
		body: {
			group: {
				name: 'name-1',
			},
		},
		reply: {
			group: {
				id: 'id-1',
				name: 'name-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
			},
		},
	},
	{
		op: 'disputes.createEvidenceFile',
		input: {
			dispute_id: 'dispute_id-1',
			idempotency_key: 'idempotency_key-1',
			file_base64: 'aGVsbG8gd29ybGQ=',
			filename: 'evidence.txt',
			content_type: 'image/png',
		},
		method: 'POST',
		path: '/v2/disputes/dispute_id-1/evidence-files',
		query: {},
		multipart: {
			filePart: 'image_file',
			requestPart: {
				idempotency_key: 'idempotency_key-1',
				content_type: 'image/png',
			},
			fileType: 'image/png',
		},
		reply: {
			evidence: {
				evidence_id: 'evidence_id-1',
				id: 'id-1',
				dispute_id: 'dispute_id-1',
				evidence_text: 'evidence_text-1',
			},
		},
	},
	{
		op: 'disputes.createEvidenceText',
		input: {
			dispute_id: 'dispute_id-1',
			idempotency_key: 'idempotency_key-1',
			evidence_text: 'evidence_text-1',
		},
		method: 'POST',
		path: '/v2/disputes/dispute_id-1/evidence-text',
		query: {},
		body: {
			idempotency_key: 'idempotency_key-1',
			evidence_text: 'evidence_text-1',
		},
		reply: {
			evidence: {
				evidence_id: 'evidence_id-1',
				id: 'id-1',
				dispute_id: 'dispute_id-1',
				evidence_text: 'evidence_text-1',
			},
		},
	},
	{
		op: 'invoices.createAttachment',
		input: {
			invoice_id: 'invoice_id-1',
			file_base64: 'aGVsbG8gd29ybGQ=',
			filename: 'evidence.txt',
		},
		method: 'POST',
		path: '/v2/invoices/invoice_id-1/attachments',
		query: {},
		multipart: {
			filePart: 'image_file',
			requestPart: {},
			fileType: 'image/jpeg',
		},
		reply: {
			attachment: {
				id: 'id-1',
				filename: 'filename-1',
				description: 'description-1',
				filesize: 1,
			},
		},
	},
	{
		op: 'locations.create',
		input: {},
		method: 'POST',
		path: '/v2/locations',
		query: {},
		body: {},
		reply: {
			location: {
				id: 'id-1',
				name: 'name-1',
				timezone: 'timezone-1',
				status: 'ACTIVE',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.location.create',
		input: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {
					$ref: 'https://developer-production-s.squarecdn.com/schemas/v1/common.json#squareup.common.String',
				},
			},
		},
		method: 'POST',
		path: '/v2/locations/custom-attribute-definitions',
		query: {},
		body: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {
					$ref: 'https://developer-production-s.squarecdn.com/schemas/v1/common.json#squareup.common.String',
				},
			},
		},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
	{
		op: 'customers.delete',
		input: {
			customer_id: 'customer_id-1',
		},
		method: 'DELETE',
		path: '/v2/customers/customer_id-1',
		query: {},
		reply: {},
	},
	{
		op: 'customAttributes.customer.delete',
		input: {
			customer_id: 'customer_id-1',
			key: 'key-1',
		},
		method: 'DELETE',
		path: '/v2/customers/customer_id-1/custom-attributes/key-1',
		query: {},
		reply: {},
	},
	{
		op: 'customAttributeDefinitions.customer.delete',
		input: {
			key: 'key-1',
		},
		method: 'DELETE',
		path: '/v2/customers/custom-attribute-definitions/key-1',
		query: {},
		reply: {},
	},
	{
		op: 'customerGroups.delete',
		input: {
			group_id: 'group_id-1',
		},
		method: 'DELETE',
		path: '/v2/customers/groups/group_id-1',
		query: {},
		reply: {},
	},
	{
		op: 'disputes.deleteEvidence',
		input: {
			dispute_id: 'dispute_id-1',
			evidence_id: 'evidence_id-1',
		},
		method: 'DELETE',
		path: '/v2/disputes/dispute_id-1/evidence/evidence_id-1',
		query: {},
		reply: {},
	},
	{
		op: 'invoices.delete',
		input: {
			invoice_id: 'invoice_id-1',
		},
		method: 'DELETE',
		path: '/v2/invoices/invoice_id-1',
		query: {},
		reply: {},
	},
	{
		op: 'invoices.deleteAttachment',
		input: {
			invoice_id: 'invoice_id-1',
			attachment_id: 'attachment_id-1',
		},
		method: 'DELETE',
		path: '/v2/invoices/invoice_id-1/attachments/attachment_id-1',
		query: {},
		reply: {},
	},
	{
		op: 'customAttributes.location.delete',
		input: {
			location_id: 'location_id-1',
			key: 'key-1',
		},
		method: 'DELETE',
		path: '/v2/locations/location_id-1/custom-attributes/key-1',
		query: {},
		reply: {},
	},
	{
		op: 'customAttributeDefinitions.location.delete',
		input: {
			key: 'key-1',
		},
		method: 'DELETE',
		path: '/v2/locations/custom-attribute-definitions/key-1',
		query: {},
		reply: {},
	},
	{
		op: 'customAttributes.location.bulkDelete',
		input: {
			values: {
				example: {},
			},
		},
		method: 'POST',
		path: '/v2/locations/custom-attributes/bulk-delete',
		query: {},
		body: {
			values: {
				example: {},
			},
		},
		reply: {
			values: {
				example: {},
			},
		},
	},
	{
		op: 'customAttributes.merchant.delete',
		input: {
			merchant_id: 'merchant_id-1',
			key: 'key-1',
		},
		method: 'DELETE',
		path: '/v2/merchants/merchant_id-1/custom-attributes/key-1',
		query: {},
		reply: {},
	},
	{
		op: 'customAttributeDefinitions.merchant.delete',
		input: {
			key: 'key-1',
		},
		method: 'DELETE',
		path: '/v2/merchants/custom-attribute-definitions/key-1',
		query: {},
		reply: {},
	},
	{
		op: 'customAttributes.merchant.bulkDelete',
		input: {
			values: {
				example: {},
			},
		},
		method: 'POST',
		path: '/v2/merchants/custom-attributes/bulk-delete',
		query: {},
		body: {
			values: {
				example: {},
			},
		},
		reply: {
			values: {
				example: {},
			},
		},
	},
	{
		op: 'webhookSubscriptions.delete',
		input: {
			subscription_id: 'subscription_id-1',
		},
		method: 'DELETE',
		path: '/v2/webhooks/subscriptions/subscription_id-1',
		query: {},
		reply: {},
	},
	{
		op: 'bookings.getBusinessProfile',
		input: {},
		method: 'GET',
		path: '/v2/bookings/business-booking-profile',
		query: {},
		reply: {
			business_booking_profile: {
				seller_id: 'seller_id-1',
				created_at: '2026-11-12T10:00:00Z',
				booking_enabled: true,
				customer_timezone_choice: 'BUSINESS_LOCATION_TIMEZONE',
			},
		},
	},
	{
		op: 'merchants.get',
		input: {
			merchant_id: 'merchant_id-1',
		},
		method: 'GET',
		path: '/v2/merchants/merchant_id-1',
		query: {},
		reply: {
			merchant: {
				id: 'id-1',
				business_name: 'business_name-1',
				country: 'ZZ',
				language_code: 'language_code-1',
			},
		},
	},
	{
		op: 'customAttributes.customer.get',
		input: {
			customer_id: 'customer_id-1',
			key: 'key-1',
		},
		method: 'GET',
		path: '/v2/customers/customer_id-1/custom-attributes/key-1',
		query: {},
		reply: {
			custom_attribute: {
				key: 'key-1',
				value: {},
				version: 1,
				visibility: 'VISIBILITY_HIDDEN',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.customer.get',
		input: {
			key: 'key-1',
		},
		method: 'GET',
		path: '/v2/customers/custom-attribute-definitions/key-1',
		query: {},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
	{
		op: 'disputes.getEvidence',
		input: {
			dispute_id: 'dispute_id-1',
			evidence_id: 'evidence_id-1',
		},
		method: 'GET',
		path: '/v2/disputes/dispute_id-1/evidence/evidence_id-1',
		query: {},
		reply: {
			evidence: {
				evidence_id: 'evidence_id-1',
				id: 'id-1',
				dispute_id: 'dispute_id-1',
				evidence_text: 'evidence_text-1',
			},
		},
	},
	{
		op: 'invoices.get',
		input: {
			invoice_id: 'invoice_id-1',
		},
		method: 'GET',
		path: '/v2/invoices/invoice_id-1',
		query: {},
		reply: {
			invoice: {
				id: 'id-1',
				version: 1,
				location_id: 'location_id-1',
				order_id: 'order_id-1',
			},
		},
	},
	{
		op: 'checkout.getLocationSettings',
		input: {
			location_id: 'location_id-1',
		},
		method: 'GET',
		path: '/v2/online-checkout/location-settings/location_id-1',
		query: {},
		reply: {
			location_settings: {
				location_id: 'location_id-1',
				customer_notes_enabled: true,
				updated_at: '2026-11-12T10:00:00Z',
			},
		},
	},
	{
		op: 'channels.list',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/channels',
		query: {
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			channels: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'customAttributeDefinitions.customer.list',
		input: {
			limit: 1,
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/customers/custom-attribute-definitions',
		query: {
			limit: '1',
			cursor: 'cursor-1',
		},
		reply: {
			custom_attribute_definitions: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'customAttributes.customer.list',
		input: {
			customer_id: 'customer_id-1',
			limit: 1,
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/customers/customer_id-1/custom-attributes',
		query: {
			limit: '1',
			cursor: 'cursor-1',
		},
		reply: {
			custom_attributes: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'customerGroups.list',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/customers/groups',
		query: {
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			groups: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'customerSegments.list',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/customers/segments',
		query: {
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			segments: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'customers.list',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/customers',
		query: {
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			customers: [{}],
			cursor: 'cursor-1',
			count: 1,
		},
	},
	{
		op: 'disputes.listEvidence',
		input: {
			dispute_id: 'dispute_id-1',
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/disputes/dispute_id-1/evidence',
		query: {
			cursor: 'cursor-1',
		},
		reply: {
			evidence: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'invoices.list',
		input: {
			location_id: 'location_id-1',
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/invoices',
		query: {
			location_id: 'location_id-1',
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			invoices: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'customAttributeDefinitions.location.list',
		input: {
			limit: 1,
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/locations/custom-attribute-definitions',
		query: {
			limit: '1',
			cursor: 'cursor-1',
		},
		reply: {
			custom_attribute_definitions: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'locations.list',
		input: {},
		method: 'GET',
		path: '/v2/locations',
		query: {},
		reply: {
			locations: [{}],
		},
	},
	{
		op: 'customAttributes.location.list',
		input: {
			location_id: 'location_id-1',
			limit: 1,
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/locations/location_id-1/custom-attributes',
		query: {
			limit: '1',
			cursor: 'cursor-1',
		},
		reply: {
			custom_attributes: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'customAttributeDefinitions.merchant.list',
		input: {
			limit: 1,
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/merchants/custom-attribute-definitions',
		query: {
			limit: '1',
			cursor: 'cursor-1',
		},
		reply: {
			custom_attribute_definitions: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'merchants.list',
		input: {
			cursor: 1,
		},
		method: 'GET',
		path: '/v2/merchants',
		query: {
			cursor: '1',
		},
		reply: {
			merchant: [{}],
			cursor: 1,
		},
	},
	{
		op: 'customAttributes.merchant.list',
		input: {
			merchant_id: 'merchant_id-1',
			limit: 1,
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/merchants/merchant_id-1/custom-attributes',
		query: {
			limit: '1',
			cursor: 'cursor-1',
		},
		reply: {
			custom_attributes: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'payments.list',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/payments',
		query: {
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			payments: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'webhookEventTypes.list',
		input: {},
		method: 'GET',
		path: '/v2/webhooks/event-types',
		query: {},
		reply: {
			event_types: ['event_types-1'],
			metadata: [{}],
		},
	},
	{
		op: 'webhookSubscriptions.list',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/webhooks/subscriptions',
		query: {
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			subscriptions: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'customers.removeGroup',
		input: {
			customer_id: 'customer_id-1',
			group_id: 'group_id-1',
		},
		method: 'DELETE',
		path: '/v2/customers/customer_id-1/groups/group_id-1',
		query: {},
		reply: {},
	},
	{
		op: 'customers.bulkGet',
		input: {
			customer_ids: ['customer_ids-1'],
		},
		method: 'POST',
		path: '/v2/customers/bulk-retrieve',
		query: {},
		body: {
			customer_ids: ['customer_ids-1'],
		},
		reply: {
			responses: {
				example: {},
			},
		},
	},
	{
		op: 'channels.get',
		input: {
			channel_id: 'channel_id-1',
		},
		method: 'GET',
		path: '/v2/channels/channel_id-1',
		query: {},
		reply: {
			channel: {
				id: 'id-1',
				merchant_id: 'merchant_id-1',
				name: 'name-1',
				version: 1,
			},
		},
	},
	{
		op: 'customers.get',
		input: {
			customer_id: 'customer_id-1',
		},
		method: 'GET',
		path: '/v2/customers/customer_id-1',
		query: {},
		reply: {
			customer: {
				id: 'id-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
				given_name: 'given_name-1',
			},
		},
	},
	{
		op: 'customerGroups.get',
		input: {
			group_id: 'group_id-1',
		},
		method: 'GET',
		path: '/v2/customers/groups/group_id-1',
		query: {},
		reply: {
			group: {
				id: 'id-1',
				name: 'name-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
			},
		},
	},
	{
		op: 'customerSegments.get',
		input: {
			segment_id: 'segment_id-1',
		},
		method: 'GET',
		path: '/v2/customers/segments/segment_id-1',
		query: {},
		reply: {
			segment: {
				id: 'id-1',
				name: 'name-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
			},
		},
	},
	{
		op: 'disputes.get',
		input: {
			dispute_id: 'dispute_id-1',
		},
		method: 'GET',
		path: '/v2/disputes/dispute_id-1',
		query: {},
		reply: {
			dispute: {
				dispute_id: 'dispute_id-1',
				id: 'id-1',
				reason: 'AMOUNT_DIFFERS',
				state: 'INQUIRY_EVIDENCE_REQUIRED',
			},
		},
	},
	{
		op: 'locations.get',
		input: {
			location_id: 'location_id-1',
		},
		method: 'GET',
		path: '/v2/locations/location_id-1',
		query: {},
		reply: {
			location: {
				id: 'id-1',
				name: 'name-1',
				timezone: 'timezone-1',
				status: 'ACTIVE',
			},
		},
	},
	{
		op: 'customAttributes.location.get',
		input: {
			location_id: 'location_id-1',
			key: 'key-1',
		},
		method: 'GET',
		path: '/v2/locations/location_id-1/custom-attributes/key-1',
		query: {},
		reply: {
			custom_attribute: {
				key: 'key-1',
				value: {},
				version: 1,
				visibility: 'VISIBILITY_HIDDEN',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.location.get',
		input: {
			key: 'key-1',
		},
		method: 'GET',
		path: '/v2/locations/custom-attribute-definitions/key-1',
		query: {},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
	{
		op: 'customAttributes.merchant.get',
		input: {
			merchant_id: 'merchant_id-1',
			key: 'key-1',
		},
		method: 'GET',
		path: '/v2/merchants/merchant_id-1/custom-attributes/key-1',
		query: {},
		reply: {
			custom_attribute: {
				key: 'key-1',
				value: {},
				version: 1,
				visibility: 'VISIBILITY_HIDDEN',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.merchant.get',
		input: {
			key: 'key-1',
		},
		method: 'GET',
		path: '/v2/merchants/custom-attribute-definitions/key-1',
		query: {},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
	{
		op: 'orders.get',
		input: {
			order_id: 'order_id-1',
		},
		method: 'GET',
		path: '/v2/orders/order_id-1',
		query: {},
		reply: {
			order: {
				id: 'id-1',
				location_id: 'location_id-1',
				reference_id: 'reference_id-1',
				customer_id: 'customer_id-1',
			},
		},
	},
	{
		op: 'paymentLinks.get',
		input: {
			id: 'id-1',
		},
		method: 'GET',
		path: '/v2/online-checkout/payment-links/id-1',
		query: {},
		reply: {
			payment_link: {
				id: 'id-1',
				version: 1,
				description: 'description-1',
				order_id: 'order_id-1',
			},
		},
	},
	{
		op: 'oauth.getTokenStatus',
		input: {},
		method: 'POST',
		path: '/oauth2/token/status',
		query: {},
		reply: {
			scopes: ['scopes-1'],
			expires_at: '2026-11-12T10:00:00Z',
			client_id: 'client_id-1',
			merchant_id: 'merchant_id-1',
		},
	},
	{
		op: 'webhookSubscriptions.get',
		input: {
			subscription_id: 'subscription_id-1',
		},
		method: 'GET',
		path: '/v2/webhooks/subscriptions/subscription_id-1',
		query: {},
		reply: {
			subscription: {
				id: 'id-1',
				name: 'name-1',
				enabled: true,
				notification_url: 'notification_url-1',
			},
		},
	},
	{
		op: 'customers.search',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'POST',
		path: '/v2/customers/search',
		query: {},
		body: {
			cursor: 'cursor-1',
			limit: 1,
		},
		reply: {
			customers: [{}],
			cursor: 'cursor-1',
			count: 1,
		},
	},
	{
		op: 'orders.search',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'POST',
		path: '/v2/orders/search',
		query: {},
		body: {
			cursor: 'cursor-1',
			limit: 1,
		},
		reply: {
			order_entries: [{}],
			orders: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'disputes.submitEvidence',
		input: {
			dispute_id: 'dispute_id-1',
		},
		method: 'POST',
		path: '/v2/disputes/dispute_id-1/submit-evidence',
		query: {},
		reply: {
			dispute: {
				dispute_id: 'dispute_id-1',
				id: 'id-1',
				reason: 'AMOUNT_DIFFERS',
				state: 'INQUIRY_EVIDENCE_REQUIRED',
			},
		},
	},
	{
		op: 'webhookSubscriptions.test',
		input: {
			subscription_id: 'subscription_id-1',
		},
		method: 'POST',
		path: '/v2/webhooks/subscriptions/subscription_id-1/test',
		query: {},
		body: {},
		reply: {
			subscription_test_result: {
				id: 'id-1',
				status_code: 1,
				payload: 'payload-1',
				created_at: '2026-11-12T10:00:00Z',
			},
		},
	},
	{
		op: 'customers.update',
		input: {
			customer_id: 'customer_id-1',
		},
		method: 'PUT',
		path: '/v2/customers/customer_id-1',
		query: {},
		body: {},
		reply: {
			customer: {
				id: 'id-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
				given_name: 'given_name-1',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.customer.update',
		input: {
			key: 'key-1',
			custom_attribute_definition: {},
		},
		method: 'PUT',
		path: '/v2/customers/custom-attribute-definitions/key-1',
		query: {},
		body: {
			custom_attribute_definition: {},
		},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
	{
		op: 'customerGroups.update',
		input: {
			group_id: 'group_id-1',
			group: {
				name: 'name-1',
			},
		},
		method: 'PUT',
		path: '/v2/customers/groups/group_id-1',
		query: {},
		body: {
			group: {
				name: 'name-1',
			},
		},
		reply: {
			group: {
				id: 'id-1',
				name: 'name-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
			},
		},
	},
	{
		op: 'locations.update',
		input: {
			location_id: 'location_id-1',
		},
		method: 'PUT',
		path: '/v2/locations/location_id-1',
		query: {},
		body: {},
		reply: {
			location: {
				id: 'id-1',
				name: 'name-1',
				timezone: 'timezone-1',
				status: 'ACTIVE',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.location.update',
		input: {
			key: 'key-1',
			custom_attribute_definition: {},
		},
		method: 'PUT',
		path: '/v2/locations/custom-attribute-definitions/key-1',
		query: {},
		body: {
			custom_attribute_definition: {},
		},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.merchant.update',
		input: {
			key: 'key-1',
			custom_attribute_definition: {},
		},
		method: 'PUT',
		path: '/v2/merchants/custom-attribute-definitions/key-1',
		query: {},
		body: {
			custom_attribute_definition: {},
		},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
	{
		op: 'checkout.updateLocationSettings',
		input: {
			location_id: 'location_id-1',
			location_settings: {},
		},
		method: 'PUT',
		path: '/v2/online-checkout/location-settings/location_id-1',
		query: {},
		body: {
			location_settings: {},
		},
		reply: {
			location_settings: {
				location_id: 'location_id-1',
				customer_notes_enabled: true,
				updated_at: '2026-11-12T10:00:00Z',
			},
		},
	},
	{
		op: 'orders.update',
		input: {
			order_id: 'order_id-1',
		},
		method: 'PUT',
		path: '/v2/orders/order_id-1',
		query: {},
		body: {},
		reply: {
			order: {
				id: 'id-1',
				location_id: 'location_id-1',
				reference_id: 'reference_id-1',
				customer_id: 'customer_id-1',
			},
		},
	},
	{
		op: 'webhookSubscriptions.update',
		input: {
			subscription_id: 'subscription_id-1',
		},
		method: 'PUT',
		path: '/v2/webhooks/subscriptions/subscription_id-1',
		query: {},
		body: {},
		reply: {
			subscription: {
				id: 'id-1',
				name: 'name-1',
				enabled: true,
				notification_url: 'notification_url-1',
			},
		},
	},
	{
		op: 'webhookSubscriptions.updateSignatureKey',
		input: {
			subscription_id: 'subscription_id-1',
		},
		method: 'POST',
		path: '/v2/webhooks/subscriptions/subscription_id-1/signature-key',
		query: {},
		body: {},
		reply: {
			signature_key: 'signature_key-1',
		},
	},
	{
		op: 'customAttributes.customer.upsert',
		input: {
			customer_id: 'customer_id-1',
			key: 'key-1',
			custom_attribute: {},
		},
		method: 'POST',
		path: '/v2/customers/customer_id-1/custom-attributes/key-1',
		query: {},
		body: {
			custom_attribute: {},
		},
		reply: {
			custom_attribute: {
				key: 'key-1',
				value: {},
				version: 1,
				visibility: 'VISIBILITY_HIDDEN',
			},
		},
	},
	{
		op: 'customAttributes.location.upsert',
		input: {
			location_id: 'location_id-1',
			key: 'key-1',
			custom_attribute: {},
		},
		method: 'POST',
		path: '/v2/locations/location_id-1/custom-attributes/key-1',
		query: {},
		body: {
			custom_attribute: {},
		},
		reply: {
			custom_attribute: {
				key: 'key-1',
				value: {},
				version: 1,
				visibility: 'VISIBILITY_HIDDEN',
			},
		},
	},
	{
		op: 'customAttributes.merchant.upsert',
		input: {
			merchant_id: 'merchant_id-1',
			key: 'key-1',
			custom_attribute: {},
		},
		method: 'POST',
		path: '/v2/merchants/merchant_id-1/custom-attributes/key-1',
		query: {},
		body: {
			custom_attribute: {},
		},
		reply: {
			custom_attribute: {
				key: 'key-1',
				value: {},
				version: 1,
				visibility: 'VISIBILITY_HIDDEN',
			},
		},
	},
	{
		op: 'payments.create',
		input: {
			source_id: 'source_id-1',
			idempotency_key: 'idempotency_key-1',
		},
		method: 'POST',
		path: '/v2/payments',
		query: {},
		body: {
			source_id: 'source_id-1',
			idempotency_key: 'idempotency_key-1',
		},
		reply: {
			payment: {
				id: 'id-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
				status: 'status-1',
			},
		},
	},
	{
		op: 'payments.get',
		input: {
			payment_id: 'payment_id-1',
		},
		method: 'GET',
		path: '/v2/payments/payment_id-1',
		query: {},
		reply: {
			payment: {
				id: 'id-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
				status: 'status-1',
			},
		},
	},
	{
		op: 'payments.update',
		input: {
			payment_id: 'payment_id-1',
			idempotency_key: 'idempotency_key-1',
		},
		method: 'PUT',
		path: '/v2/payments/payment_id-1',
		query: {},
		body: {
			idempotency_key: 'idempotency_key-1',
		},
		reply: {
			payment: {
				id: 'id-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
				status: 'status-1',
			},
		},
	},
	{
		op: 'payments.complete',
		input: {
			payment_id: 'payment_id-1',
		},
		method: 'POST',
		path: '/v2/payments/payment_id-1/complete',
		query: {},
		body: {},
		reply: {
			payment: {
				id: 'id-1',
				created_at: '2026-11-12T10:00:00Z',
				updated_at: '2026-11-12T10:00:00Z',
				status: 'status-1',
			},
		},
	},
	{
		op: 'payments.refund',
		input: {
			idempotency_key: 'idempotency_key-1',
			amount_money: {},
		},
		method: 'POST',
		path: '/v2/refunds',
		query: {},
		body: {
			idempotency_key: 'idempotency_key-1',
			amount_money: {},
		},
		reply: {
			refund: {
				id: 'id-1',
				status: 'status-1',
				location_id: 'location_id-1',
				unlinked: true,
			},
		},
	},
	{
		op: 'refunds.get',
		input: {
			refund_id: 'refund_id-1',
		},
		method: 'GET',
		path: '/v2/refunds/refund_id-1',
		query: {},
		reply: {
			refund: {
				id: 'id-1',
				status: 'status-1',
				location_id: 'location_id-1',
				unlinked: true,
			},
		},
	},
	{
		op: 'refunds.list',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/refunds',
		query: {
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			refunds: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'orders.create',
		input: {},
		method: 'POST',
		path: '/v2/orders',
		query: {},
		body: {},
		reply: {
			order: {
				id: 'id-1',
				location_id: 'location_id-1',
				reference_id: 'reference_id-1',
				customer_id: 'customer_id-1',
			},
		},
	},
	{
		op: 'orders.pay',
		input: {
			order_id: 'order_id-1',
			idempotency_key: 'idempotency_key-1',
		},
		method: 'POST',
		path: '/v2/orders/order_id-1/pay',
		query: {},
		body: {
			idempotency_key: 'idempotency_key-1',
		},
		reply: {
			order: {
				id: 'id-1',
				location_id: 'location_id-1',
				reference_id: 'reference_id-1',
				customer_id: 'customer_id-1',
			},
		},
	},
	{
		op: 'paymentLinks.create',
		input: {},
		method: 'POST',
		path: '/v2/online-checkout/payment-links',
		query: {},
		body: {},
		reply: {
			payment_link: {
				id: 'id-1',
				version: 1,
				description: 'description-1',
				order_id: 'order_id-1',
			},
			related_resources: {},
		},
	},
	{
		op: 'paymentLinks.list',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'GET',
		path: '/v2/online-checkout/payment-links',
		query: {
			cursor: 'cursor-1',
			limit: '1',
		},
		reply: {
			payment_links: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'paymentLinks.delete',
		input: {
			id: 'id-1',
		},
		method: 'DELETE',
		path: '/v2/online-checkout/payment-links/id-1',
		query: {},
		reply: {
			id: 'id-1',
			cancelled_order_id: 'cancelled_order_id-1',
		},
	},
	{
		op: 'invoices.create',
		input: {
			invoice: {
				order_id: 'order_id-1',
				payment_requests: [
					{
						request_type: 'BALANCE',
						due_date: '2026-11-30',
					},
				],
				accepted_payment_methods: {
					card: true,
				},
			},
		},
		method: 'POST',
		path: '/v2/invoices',
		query: {},
		body: {
			invoice: {
				order_id: 'order_id-1',
				payment_requests: [
					{
						request_type: 'BALANCE',
						due_date: '2026-11-30',
					},
				],
				accepted_payment_methods: {
					card: true,
				},
			},
		},
		reply: {
			invoice: {
				id: 'id-1',
				version: 1,
				location_id: 'location_id-1',
				order_id: 'order_id-1',
			},
		},
	},
	{
		op: 'invoices.publish',
		input: {
			invoice_id: 'invoice_id-1',
			version: 1,
		},
		method: 'POST',
		path: '/v2/invoices/invoice_id-1/publish',
		query: {},
		body: {
			version: 1,
		},
		reply: {
			invoice: {
				id: 'id-1',
				version: 1,
				location_id: 'location_id-1',
				order_id: 'order_id-1',
			},
		},
	},
	{
		op: 'invoices.update',
		input: {
			invoice_id: 'invoice_id-1',
			invoice: {},
		},
		method: 'PUT',
		path: '/v2/invoices/invoice_id-1',
		query: {},
		body: {
			invoice: {},
		},
		reply: {
			invoice: {
				id: 'id-1',
				version: 1,
				location_id: 'location_id-1',
				order_id: 'order_id-1',
			},
		},
	},
	{
		op: 'invoices.search',
		input: {
			query: {
				filter: {
					location_ids: ['location_ids-1'],
				},
			},
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'POST',
		path: '/v2/invoices/search',
		query: {},
		body: {
			query: {
				filter: {
					location_ids: ['location_ids-1'],
				},
			},
			cursor: 'cursor-1',
			limit: 1,
		},
		reply: {
			invoices: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'disputes.list',
		input: {
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/disputes',
		query: {
			cursor: 'cursor-1',
		},
		reply: {
			disputes: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'cards.list',
		input: {
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/cards',
		query: {
			cursor: 'cursor-1',
		},
		reply: {
			cards: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'cards.get',
		input: {
			card_id: 'card_id-1',
		},
		method: 'GET',
		path: '/v2/cards/card_id-1',
		query: {},
		reply: {
			card: {
				id: 'id-1',
				card_brand: 'OTHER_BRAND',
				last_4: 'last',
				exp_month: 1,
			},
		},
	},
	{
		op: 'cards.disable',
		input: {
			card_id: 'card_id-1',
		},
		method: 'POST',
		path: '/v2/cards/card_id-1/disable',
		query: {},
		reply: {
			card: {
				id: 'id-1',
				card_brand: 'OTHER_BRAND',
				last_4: 'last',
				exp_month: 1,
			},
		},
	},
	{
		op: 'webhookSubscriptions.create',
		input: {
			subscription: {},
		},
		method: 'POST',
		path: '/v2/webhooks/subscriptions',
		query: {},
		body: {
			subscription: {},
		},
		reply: {
			subscription: {
				id: 'id-1',
				name: 'name-1',
				enabled: true,
				notification_url: 'notification_url-1',
			},
		},
	},
	{
		op: 'catalog.list',
		input: {
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/catalog/list',
		query: {
			cursor: 'cursor-1',
		},
		reply: {
			cursor: 'cursor-1',
			objects: [{}],
		},
	},
	{
		op: 'catalog.search',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'POST',
		path: '/v2/catalog/search',
		query: {},
		body: {
			cursor: 'cursor-1',
			limit: 1,
		},
		reply: {
			cursor: 'cursor-1',
			objects: [{}],
			related_objects: [{}],
			latest_time: 'latest_time-1',
			included_resources: {},
		},
	},
	{
		op: 'catalog.get',
		input: {
			object_id: 'object_id-1',
		},
		method: 'GET',
		path: '/v2/catalog/object/object_id-1',
		query: {},
		reply: {
			object: {
				type: 'ITEM',
				id: 'id-1',
				updated_at: '2026-11-12T10:00:00Z',
				version: 1,
			},
			related_objects: [{}],
		},
	},
	{
		op: 'catalog.upsert',
		input: {
			idempotency_key: 'idempotency_key-1',
			object: {
				type: 'ITEM',
				id: 'id-1',
			},
		},
		method: 'POST',
		path: '/v2/catalog/object',
		query: {},
		body: {
			idempotency_key: 'idempotency_key-1',
			object: {
				type: 'ITEM',
				id: 'id-1',
			},
		},
		reply: {
			catalog_object: {
				type: 'ITEM',
				id: 'id-1',
				updated_at: '2026-11-12T10:00:00Z',
				version: 1,
			},
			id_mappings: [{}],
		},
	},
	{
		op: 'catalog.delete',
		input: {
			object_id: 'object_id-1',
		},
		method: 'DELETE',
		path: '/v2/catalog/object/object_id-1',
		query: {},
		reply: {
			deleted_object_ids: ['deleted_object_ids-1'],
			deleted_at: '2026-11-12T10:00:00Z',
		},
	},
	{
		op: 'inventory.batchGet',
		input: {
			cursor: 'cursor-1',
			limit: 1,
		},
		method: 'POST',
		path: '/v2/inventory/counts/batch-retrieve',
		query: {},
		body: {
			cursor: 'cursor-1',
			limit: 1,
		},
		reply: {
			counts: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'inventory.get',
		input: {
			catalog_object_id: 'catalog_object_id-1',
			cursor: 'cursor-1',
		},
		method: 'GET',
		path: '/v2/inventory/catalog_object_id-1',
		query: {
			cursor: 'cursor-1',
		},
		reply: {
			counts: [{}],
			cursor: 'cursor-1',
		},
	},
	{
		op: 'payments.cancelByIdempotencyKey',
		input: {
			idempotency_key: 'idempotency_key-1',
		},
		method: 'POST',
		path: '/v2/payments/cancel',
		query: {},
		body: {
			idempotency_key: 'idempotency_key-1',
		},
		reply: {},
	},
	{
		op: 'paymentLinks.update',
		input: {
			id: 'id-1',
			payment_link: {
				version: 1,
			},
		},
		method: 'PUT',
		path: '/v2/online-checkout/payment-links/id-1',
		query: {},
		body: {
			payment_link: {
				version: 1,
			},
		},
		reply: {
			payment_link: {
				id: 'id-1',
				version: 1,
				description: 'description-1',
				order_id: 'order_id-1',
			},
		},
	},
	{
		op: 'customAttributeDefinitions.merchant.create',
		input: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {
					$ref: 'https://developer-production-s.squarecdn.com/schemas/v1/common.json#squareup.common.String',
				},
			},
		},
		method: 'POST',
		path: '/v2/merchants/custom-attribute-definitions',
		query: {},
		body: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {
					$ref: 'https://developer-production-s.squarecdn.com/schemas/v1/common.json#squareup.common.String',
				},
			},
		},
		reply: {
			custom_attribute_definition: {
				key: 'key-1',
				schema: {},
				name: 'name-1',
				description: 'description-1',
			},
		},
	},
];

/** Looks an operation up in the client's endpoint tree by its dotted name. */
// unknown: each operation takes and returns its own shape; the schemas check it.
function endpoint(
	api: object,
	op: string,
): (input: unknown) => Promise<unknown> {
	// unknown: a node of the endpoint tree, narrowed below.
	let node: unknown = api;
	for (const part of op.split('.')) {
		node =
			typeof node === 'object' && node !== null
				? Reflect.get(node, part)
				: undefined;
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${op}`);
	const fn = node;
	return (input) => fn(input);
}

let fetchMock: jest.SpyInstance;
let client: Client;

beforeAll(async () => {
	client = await createClient();
});

afterAll(() => {
	client.testDb.cleanup();
});

beforeEach(() => {
	fetchMock = mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

const api = () => client.corsair.square.api;

describe('Square endpoints', () => {
	it('has one case per operation the plugin declares', () => {
		const declared = Object.keys(squareEndpointMeta).sort();
		expect(cases.map((c) => c.op).sort()).toEqual(declared);
		expect(declared).toHaveLength(123);
	});

	it.each(cases.map((c) => [c.op, c] as const))(
		'%s sends the documented request and returns the parsed answer',
		async (_op, c) => {
			fetchMock.mockResolvedValueOnce(jsonResponse(c.reply));

			const out = await endpoint(api(), c.op)(c.input);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			const sent = sentRequest(fetchMock);
			expect(`${sent.origin}${sent.pathname}`).toBe(`${BASE}${c.path}`);
			expect(sent.query).toEqual(c.query);
			expect(sent.method).toBe(c.method);
			expect(sent.headers.get('Authorization')).toBe(`Bearer ${TOKEN}`);
			expect(sent.headers.get('Square-Version')).toBe(VERSION);

			if (c.multipart) {
				// fetch sets the multipart boundary itself.
				expect(sent.headers.get('Content-Type')).toBeNull();
				expect(sent.body).toBeInstanceOf(FormData);
			} else if (c.body) {
				expect(sent.headers.get('Content-Type')).toBe('application/json');
				expect(jsonBody(sent)).toEqual(c.body);
			} else {
				expect(sent.body).toBeUndefined();
			}

			expect(out).toEqual(c.reply);
		},
	);
});

describe('Square request details', () => {
	it('URI-encodes path parameters', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ customer: {} }));
		await api().customers.get({ customer_id: 'a b/c' });
		expect(sentRequest(fetchMock).pathname).toBe('/v2/customers/a%20b%2Fc');
	});

	it('calls the sandbox host when the environment option says so', async () => {
		const sandbox = await createClient({ environment: 'sandbox' });
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ locations: [] }));
			await sandbox.corsair.square.api.locations.list({});
			expect(sentRequest(fetchMock).origin).toBe(SANDBOX_BASE);
		} finally {
			sandbox.testDb.cleanup();
		}
	});

	it('returns the cursor so the next page can be asked for', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ customers: [{ id: 'C1' }], cursor: 'NEXT' }),
		);
		const page = await api().customers.list({ limit: 1 });
		expect(sentRequest(fetchMock).query).toEqual({ limit: '1' });
		expect(page.cursor).toBe('NEXT');

		fetchMock.mockResolvedValueOnce(jsonResponse({ customers: [] }));
		await api().customers.list({ limit: 1, cursor: page.cursor ?? undefined });
		expect(sentRequest(fetchMock, 1).query).toEqual({
			limit: '1',
			cursor: 'NEXT',
		});
	});

	it('sends the cursor of a search in the body, where Square reads it', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ orders: [], cursor: 'N2' }));
		await api().orders.search({ location_ids: ['L1'], cursor: 'N1', limit: 5 });
		const sent = sentRequest(fetchMock);
		expect(sent.query).toEqual({});
		expect(jsonBody(sent)).toEqual({
			location_ids: ['L1'],
			cursor: 'N1',
			limit: 5,
		});
	});

	it('parses an answer with no body instead of returning undefined', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
		const out = await api().customers.delete({ customer_id: 'C1' });
		expect(out).toEqual({});
	});

	it('keeps fields and enum values Square adds later', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				payment: { id: 'P1', status: 'A_STATUS_SQUARE_ADDED', brand_new: 1 },
			}),
		);
		const out = await api().payments.get({ payment_id: 'P1' });
		expect(out.payment?.status).toBe('A_STATUS_SQUARE_ADDED');
		expect(out.payment).toMatchObject({ brand_new: 1 });
	});

	it('handles catalog objects that contain catalog objects', async () => {
		const item = {
			type: 'ITEM' as const,
			id: '#coffee',
			item_data: {
				name: 'Coffee',
				variations: [
					{
						type: 'ITEM_VARIATION' as const,
						id: '#small',
						item_variation_data: {
							name: 'Small',
							pricing_type: 'FIXED_PRICING' as const,
						},
					},
				],
			},
		};
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				catalog_object: {
					...item,
					item_data: {
						...item.item_data,
						variations: [{ ...item.item_data.variations[0], version: 7 }],
					},
				},
			}),
		);
		const out = await api().catalog.upsert({
			idempotency_key: 'catalog-1',
			object: item,
		});
		expect(jsonBody(sentRequest(fetchMock))).toEqual({
			idempotency_key: 'catalog-1',
			object: item,
		});
		expect(out.catalog_object?.item_data?.variations?.[0]).toMatchObject({
			id: '#small',
			version: 7,
		});
	});

	it('does not let a missing field fail a completed call', () => {
		expect(
			SquareEndpointOutputSchemas.paymentsCreate.safeParse({}).success,
		).toBe(true);
	});

	it('refuses input Square would reject, before calling Square', async () => {
		await expect(
			endpoint(api(), 'customers.get')({ customer_id: undefined }),
		).rejects.toThrow();
		await expect(
			endpoint(api(), 'orders.search')({ limit: 'many' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// Square's create and update share one schema, so what only creating needs is
	// not in its required list. The plugin requires it on the create operations.
	describe('fields only creating needs', () => {
		const invoice = {
			order_id: 'ORDER1',
			payment_requests: [
				{ request_type: 'BALANCE' as const, due_date: '2026-11-30' },
			],
			accepted_payment_methods: { card: true },
		};
		const without = (from: Record<string, unknown>, field: string) =>
			Object.fromEntries(Object.entries(from).filter(([k]) => k !== field));

		it('sends a complete invoice, without a delivery_method', async () => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ invoice: { id: 'INV1' } }),
			);
			await api().invoices.create({ idempotency_key: 'inv-1', invoice });
			expect(jsonBody(sentRequest(fetchMock))).toEqual({
				idempotency_key: 'inv-1',
				invoice,
			});
		});

		it.each(['order_id', 'payment_requests', 'accepted_payment_methods'])(
			'refuses invoices.create without %s, before calling Square',
			async (field) => {
				await expect(
					endpoint(
						api(),
						'invoices.create',
					)({
						idempotency_key: 'inv-1',
						invoice: without(invoice, field),
					}),
				).rejects.toThrow();
				expect(fetchMock).toHaveBeenCalledTimes(0);
			},
		);

		it.each(['request_type', 'due_date'])(
			'refuses a payment request without %s, before calling Square',
			async (field) => {
				await expect(
					endpoint(
						api(),
						'invoices.create',
					)({
						idempotency_key: 'inv-1',
						invoice: {
							...invoice,
							payment_requests: [
								without(
									{ request_type: 'BALANCE', due_date: '2026-11-30' },
									field,
								),
							],
						},
					}),
				).rejects.toThrow();
				expect(fetchMock).toHaveBeenCalledTimes(0);
			},
		);

		it.each(['customer', 'location', 'merchant'])(
			'refuses a %s attribute definition without key or schema, before calling Square',
			async (kind) => {
				const definition = {
					key: 'loyalty-tier',
					schema: {
						$ref: 'https://developer-production-s.squarecdn.com/schemas/v1/common.json#squareup.common.String',
					},
				};
				for (const field of ['key', 'schema']) {
					await expect(
						endpoint(
							api(),
							`customAttributeDefinitions.${kind}.create`,
						)({
							idempotency_key: 'def-1',
							custom_attribute_definition: without(definition, field),
						}),
					).rejects.toThrow();
				}
				expect(fetchMock).toHaveBeenCalledTimes(0);

				fetchMock.mockResolvedValueOnce(
					jsonResponse({
						custom_attribute_definition: { key: 'loyalty-tier' },
					}),
				);
				await endpoint(
					api(),
					`customAttributeDefinitions.${kind}.create`,
				)({
					idempotency_key: 'def-1',
					custom_attribute_definition: definition,
				});
				expect(fetchMock).toHaveBeenCalledTimes(1);
			},
		);

		it('lets invoices.update send a partial invoice', async () => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ invoice: { id: 'INV1' } }),
			);
			await api().invoices.update({
				invoice_id: 'INV1',
				invoice: { title: 'November' },
			});
			expect(jsonBody(sentRequest(fetchMock))).toEqual({
				invoice: { title: 'November' },
			});
		});

		it.each(['customer', 'location', 'merchant'])(
			'lets the %s attribute definition update send a partial definition',
			async (kind) => {
				fetchMock.mockResolvedValueOnce(
					jsonResponse({ custom_attribute_definition: { key: 'k' } }),
				);
				await endpoint(
					api(),
					`customAttributeDefinitions.${kind}.update`,
				)({
					key: 'k',
					custom_attribute_definition: { description: 'Updated' },
				});
				expect(jsonBody(sentRequest(fetchMock))).toEqual({
					custom_attribute_definition: { description: 'Updated' },
				});
			},
		);
	});

	it('drops fields that are not in the spec instead of sending them', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ customer: {} }));
		await endpoint(
			api(),
			'customers.create',
		)({
			given_name: 'Ada',
			not_a_field: 1,
		});
		expect(jsonBody(sentRequest(fetchMock))).toEqual({ given_name: 'Ada' });
	});
});

describe('Square money safety', () => {
	const charge = {
		source_id: 'cnon:card-nonce-ok',
		idempotency_key: 'order-1042-charge',
		amount_money: { amount: 1000, currency: 'USD' as const },
		location_id: 'L1',
	};

	it("sends the caller's idempotency_key and amount exactly as given", async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ payment: { id: 'P1' } }));
		await api().payments.create(charge);
		expect(jsonBody(sentRequest(fetchMock))).toEqual(charge);
	});

	it.each([
		['payments.create', { ...charge, idempotency_key: undefined }],
		['payments.update', { payment_id: 'P1' }],
		[
			'payments.refund',
			{ payment_id: 'P1', amount_money: charge.amount_money },
		],
		['orders.pay', { order_id: 'O1' }],
		['payments.cancelByIdempotencyKey', {}],
		['cards.create', { source_id: 'cnon:card-nonce-ok', card: {} }],
	])(
		'refuses %s without an idempotency_key, before calling Square',
		async (op, input) => {
			await expect(endpoint(api(), op)(input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('never makes up an idempotency_key where the caller gave none', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ customer: {} }));
		await api().customers.create({ given_name: 'Ada' });
		expect(jsonBody(sentRequest(fetchMock))).toEqual({ given_name: 'Ada' });
	});

	it('says in the description of every money-moving operation that it moves money', () => {
		const moving = [
			'payments.create',
			'payments.update',
			'payments.complete',
			'payments.cancel',
			'payments.refund',
			'payments.cancelByIdempotencyKey',
			'orders.pay',
			'invoices.publish',
			'disputes.accept',
		] as const;
		for (const op of moving) {
			expect(squareEndpointMeta[op].description).toContain('Moves money.');
		}
		for (const [op, entry] of Object.entries(squareEndpointMeta)) {
			if (!moving.some((m) => m === op)) {
				expect(entry.description).not.toContain('Moves money.');
			}
		}
	});

	it('tells the agent to reuse the key on every keyed money operation', () => {
		for (const op of [
			'payments.create',
			'payments.update',
			'payments.refund',
			'orders.pay',
			'invoices.publish',
		] as const) {
			expect(squareEndpointMeta[op].description).toContain(
				'Pass the same idempotency_key to retry safely.',
			);
		}
	});

	it('says the key of cancelByIdempotencyKey names the payment to cancel', () => {
		expect(
			squareEndpointMeta['payments.cancelByIdempotencyKey'].description,
		).toContain('idempotency_key names the payment to cancel');
	});
});

describe('Square file uploads', () => {
	const hello = Buffer.from('hello, world\n').toString('base64');

	// The header lines of one part as they go on the wire. Square treats a part
	// that has a filename as the file, so what the request part carries matters.
	async function wireHeaders(body: FormData, name: string): Promise<string[]> {
		const res = new Response(body);
		const boundary = /boundary=(.+)$/.exec(
			res.headers.get('content-type') ?? '',
		)?.[1];
		if (!boundary) throw new Error('no multipart boundary');
		const text = await res.text();
		const part = text
			.split('--' + boundary)
			.find((p) => p.includes('name="' + name + '"'));
		if (!part) throw new Error('no ' + name + ' part on the wire');
		return (part.split('\r\n\r\n')[0] ?? '').split('\r\n').filter(Boolean);
	}

	// unknown: the JSON the plugin put in the `request` part (a plain form field).
	async function parts(index = 0): Promise<{
		body: FormData;
		requestField: string | File | null;
		request: unknown;
		file: File;
	}> {
		const { body } = sentRequest(fetchMock, index);
		if (!(body instanceof FormData)) throw new Error('expected FormData');
		const requestField = body.get('request');
		const file = body.get('image_file');
		if (!(file instanceof File)) throw new Error('expected a file part');
		const text =
			typeof requestField === 'string'
				? requestField
				: requestField instanceof Blob
					? await requestField.text()
					: 'null';
		return { body, requestField, request: JSON.parse(text), file };
	}

	it('sends dispute evidence as a JSON request part and an image_file part', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ evidence: { id: 'E1' } }));
		await api().disputes.createEvidenceFile({
			dispute_id: 'D1',
			idempotency_key: 'evidence-1',
			evidence_type: 'GENERIC_EVIDENCE',
			content_type: 'image/png',
			file_base64: hello,
			filename: 'receipt.png',
		});
		const sent = sentRequest(fetchMock);
		expect(sent.pathname).toBe('/v2/disputes/D1/evidence-files');
		const { body, requestField, request, file } = await parts();
		// A plain form field: no Blob, so no filename and no content type.
		expect(typeof requestField).toBe('string');
		expect(request).toEqual({
			idempotency_key: 'evidence-1',
			evidence_type: 'GENERIC_EVIDENCE',
			content_type: 'image/png',
		});
		expect(await wireHeaders(body, 'request')).toEqual([
			'Content-Disposition: form-data; name="request"',
		]);
		expect(file.name).toBe('receipt.png');
		expect(file.type).toBe('image/png');
		expect(await file.text()).toBe('hello, world\n');
		expect(await wireHeaders(body, 'image_file')).toEqual([
			'Content-Disposition: form-data; name="image_file"; filename="receipt.png"',
			'Content-Type: image/png',
		]);
	});

	it('sends an invoice attachment as image/jpeg unless told otherwise', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ attachment: { id: 'A1' } }))
			.mockResolvedValueOnce(jsonResponse({ attachment: { id: 'A2' } }));
		await api().invoices.createAttachment({
			invoice_id: 'INV1',
			file_base64: hello,
			filename: 'terms.pdf',
			description: 'Terms',
		});
		const first = await parts(0);
		expect(first.file.type).toBe('image/jpeg');
		expect(first.requestField).toBe('{"description":"Terms"}');
		expect(await wireHeaders(first.body, 'request')).toEqual([
			'Content-Disposition: form-data; name="request"',
		]);

		await api().invoices.createAttachment({
			invoice_id: 'INV1',
			file_base64: hello,
			filename: 'terms.pdf',
			content_type: 'application/pdf',
		});
		const second = await parts(1);
		expect(second.file.type).toBe('application/pdf');
		expect(await wireHeaders(second.body, 'image_file')).toEqual([
			'Content-Disposition: form-data; name="image_file"; filename="terms.pdf"',
			'Content-Type: application/pdf',
		]);
		// The JSON part carries the spec's fields only, not the file's own.
		expect(second.requestField).toBe('{}');
	});

	it.each([
		['image/jpeg', 'attachment.jpg'],
		['image/png', 'attachment.png'],
		['application/pdf', 'attachment.pdf'],
		['image/tiff', 'attachment.tiff'],
		['image/heic', 'attachment.heic'],
		['application/octet-stream', 'attachment'],
	])(
		'names an upload without a filename after its type (%s)',
		async (contentType, name) => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ attachment: { id: 'A1' } }),
			);
			await api().invoices.createAttachment({
				invoice_id: 'INV1',
				file_base64: hello,
				content_type: contentType,
			});
			expect((await parts()).file.name).toBe(name);
		},
	);

	it('names a dispute evidence file without a filename after its type', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ evidence: { id: 'E1' } }));
		await api().disputes.createEvidenceFile({
			dispute_id: 'D1',
			idempotency_key: 'evidence-2',
			content_type: 'image/png',
			file_base64: hello,
		});
		expect((await parts()).file.name).toBe('attachment.png');
	});

	it.each([
		['not base64!', 'file_base64 is not valid base64'],
		['aGVsbG8gd29ybGQ', 'file_base64 is not valid base64'.slice(0, 0)],
	])('checks the base64 of %j before uploading', async (content, message) => {
		// The second sample is valid unpadded base64 and goes through.
		if (message) {
			await expect(
				api().disputes.createEvidenceFile({
					dispute_id: 'D1',
					idempotency_key: 'k',
					file_base64: content,
					filename: 'a.png',
				}),
			).rejects.toThrow(message);
			expect(fetchMock).not.toHaveBeenCalled();
		} else {
			fetchMock.mockResolvedValueOnce(jsonResponse({ evidence: {} }));
			await api().disputes.createEvidenceFile({
				dispute_id: 'D1',
				idempotency_key: 'k',
				file_base64: content,
				filename: 'a.png',
			});
			expect((await parts()).file.size).toBe(11);
		}
	});

	it('refuses a file that decodes to nothing', async () => {
		await expect(
			api().invoices.createAttachment({
				invoice_id: 'INV1',
				file_base64: 'data:image/png;base64,',
				filename: 'a.png',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
