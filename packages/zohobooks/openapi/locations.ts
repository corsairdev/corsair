import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	address: {
		type: 'object',
		properties: {
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			country: { $ref: '#/components/schemas/country' },
			attention: { $ref: '#/components/schemas/attention' },
			state_code: { $ref: '#/components/schemas/state_code' },
			street_address1: { $ref: '#/components/schemas/street_address1' },
			street_address2: { $ref: '#/components/schemas/street_address2' },
		},
	},
	associated_series_ids: {
		description: 'List of series IDs associated with the location.',
		type: 'array',
		items: { type: 'string' },
	},
	attention: { description: 'Attention of the location.', type: 'string' },
	autonumbergenerationgroup_id: {
		description: 'Autonumber generation group ID',
		type: 'string',
	},
	city: { description: 'City Name of the location.', type: 'string' },
	country: { description: 'Country Name of the location.', type: 'string' },
	'create-a-location-request': {
		required: ['location_name', 'country', 'tax_settings_id'],
		type: 'object',
		properties: {
			type: { $ref: '#/components/schemas/type' },
			email: { $ref: '#/components/schemas/email' },
			phone: { $ref: '#/components/schemas/phone' },
			address: { $ref: '#/components/schemas/address' },
			location_name: { $ref: '#/components/schemas/location_name' },
			country: { $ref: '#/components/schemas/country' },
			tax_settings_id: { $ref: '#/components/schemas/tax_settings_id' },
			parent_location_id: { $ref: '#/components/schemas/parent_location_id' },
			associated_series_ids: {
				$ref: '#/components/schemas/associated_series_ids',
			},
			auto_number_generation_id: {
				$ref: '#/components/schemas/autonumbergenerationgroup_id',
			},
			is_all_users_selected: {
				$ref: '#/components/schemas/is_all_users_selected',
			},
			user_ids: { $ref: '#/components/schemas/user_ids' },
		},
	},
	'create-a-location-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			locations: { $ref: '#/components/schemas/locations' },
		},
	},
	'delete-a-location-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	email: { description: 'Email id for the location', type: 'string' },
	'enable-location-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	is_all_users_selected: {
		description: 'Whether all users are selected or not',
		type: 'boolean',
	},
	is_primary: {
		description: 'Whether it is primary location or not',
		type: 'boolean',
	},
	'list-all-location-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			locations: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						type: { $ref: '#/components/schemas/type' },
						email: { $ref: '#/components/schemas/email' },
						phone: { $ref: '#/components/schemas/phone' },
						address: { $ref: '#/components/schemas/address' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						tax_settings_id: { $ref: '#/components/schemas/tax_settings_id' },
						parent_location_id: {
							$ref: '#/components/schemas/parent_location_id',
						},
						associated_series_ids: {
							$ref: '#/components/schemas/associated_series_ids',
						},
						auto_number_generation_id: {
							$ref: '#/components/schemas/autonumbergenerationgroup_id',
						},
						is_all_users_selected: {
							$ref: '#/components/schemas/is_all_users_selected',
						},
						associated_users: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									user_id: { $ref: '#/components/schemas/user_id' },
									user_name: { $ref: '#/components/schemas/user_name' },
								},
							},
						},
					},
				},
			},
		},
	},
	location_id: { description: 'Location ID', type: 'string' },
	location_name: { description: 'Name of the location', type: 'string' },
	locations: {
		type: 'object',
		properties: {
			address: { $ref: '#/components/schemas/address' },
			email: { $ref: '#/components/schemas/email' },
			is_primary: { $ref: '#/components/schemas/is_primary' },
			phone: { $ref: '#/components/schemas/phone' },
			status: { $ref: '#/components/schemas/status' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			type: { $ref: '#/components/schemas/type' },
			parent_location_id: { $ref: '#/components/schemas/parent_location_id' },
			associated_series_ids: {
				$ref: '#/components/schemas/associated_series_ids',
			},
			auto_number_generation_id: {
				$ref: '#/components/schemas/autonumbergenerationgroup_id',
			},
			associated_users: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						user_id: { $ref: '#/components/schemas/user_id' },
						user_name: { $ref: '#/components/schemas/user_name' },
					},
				},
			},
			tax_settings_id: { $ref: '#/components/schemas/tax_settings_id' },
		},
	},
	'mark-as-active-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-as-inactive-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-as-primary-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	parent_location_id: { description: 'Parent Location ID', type: 'string' },
	phone: { description: 'Mobile number for location', type: 'string' },
	state: { description: 'State Name of the location.', type: 'string' },
	state_code: { description: 'State code of the location.', type: 'string' },
	status: {
		description:
			'Status of the locations. Allowed Values: <code>active</code>, <code>inactive</code>',
	},
	street_address1: {
		description: 'Street Name of the location.',
		type: 'string',
	},
	street_address2: {
		description: 'Street Name of the location.',
		type: 'string',
	},
	tax_settings_id: {
		description: 'Tax Settings ID',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	type: { description: 'Type of the location', type: 'string' },
	'update-location-request': {
		required: ['location_name', 'country', 'tax_settings_id'],
		type: 'object',
		properties: {
			type: { $ref: '#/components/schemas/type' },
			email: { $ref: '#/components/schemas/email' },
			phone: { $ref: '#/components/schemas/phone' },
			address: { $ref: '#/components/schemas/address' },
			location_name: { $ref: '#/components/schemas/location_name' },
			country: { $ref: '#/components/schemas/country' },
			tax_settings_id: { $ref: '#/components/schemas/tax_settings_id' },
			parent_location_id: { $ref: '#/components/schemas/parent_location_id' },
			associated_series_ids: {
				$ref: '#/components/schemas/associated_series_ids',
			},
			auto_number_generation_id: {
				$ref: '#/components/schemas/autonumbergenerationgroup_id',
			},
			is_all_users_selected: {
				$ref: '#/components/schemas/is_all_users_selected',
			},
			user_ids: { $ref: '#/components/schemas/user_ids' },
		},
	},
	'update-location-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			locations: { $ref: '#/components/schemas/locations' },
		},
	},
	user_id: { description: 'User ID', type: 'string' },
	user_ids: { description: 'Comma separated user ids.', type: 'string' },
	user_name: { description: 'User Name', type: 'string' },
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'enable_locations',
		group: 'locations',
		groupSlug: 'locations',
		name: 'enableLocations',
		method: 'POST',
		path: '/settings/locations/enable',
		summary: 'Enable Locations',
		description: 'Enable Locations for an organisation.',
		docsUrl: 'https://www.zoho.com/books/api/v3/locations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/enable-location-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'create_location',
		group: 'locations',
		groupSlug: 'locations',
		name: 'createLocation',
		method: 'POST',
		path: '/locations',
		summary: 'Create a location',
		description: 'Create a location.',
		docsUrl: 'https://www.zoho.com/books/api/v3/locations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-location-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-location-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_locations',
		group: 'locations',
		groupSlug: 'locations',
		name: 'listLocations',
		method: 'GET',
		path: '/locations',
		summary: 'List all locations',
		description: 'List all the available locations in your zoho inventory.',
		docsUrl: 'https://www.zoho.com/books/api/v3/locations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-all-location-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_location',
		group: 'locations',
		groupSlug: 'locations',
		name: 'updateLocation',
		method: 'PUT',
		path: '/locations/{location_id}',
		summary: 'Update location',
		description: 'Update location',
		docsUrl: 'https://www.zoho.com/books/api/v3/locations/',
		parameters: [
			{
				name: 'location_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the location.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-location-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-location-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_location',
		group: 'locations',
		groupSlug: 'locations',
		name: 'deleteLocation',
		method: 'DELETE',
		path: '/locations/{location_id}',
		summary: 'Delete a location',
		description: 'Delete a location.',
		docsUrl: 'https://www.zoho.com/books/api/v3/locations/',
		parameters: [
			{
				name: 'location_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the location.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-a-location-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_location_active',
		group: 'locations',
		groupSlug: 'locations',
		name: 'markLocationActive',
		method: 'POST',
		path: '/locations/{location_id}/active',
		summary: 'Mark as Active',
		description: 'Mark location as Active.',
		docsUrl: 'https://www.zoho.com/books/api/v3/locations/',
		parameters: [
			{
				name: 'location_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the location.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-as-active-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_location_inactive',
		group: 'locations',
		groupSlug: 'locations',
		name: 'markLocationInactive',
		method: 'POST',
		path: '/locations/{location_id}/inactive',
		summary: 'Mark as Inactive',
		description: 'Mark location as Inactive.',
		docsUrl: 'https://www.zoho.com/books/api/v3/locations/',
		parameters: [
			{
				name: 'location_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the location.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-as-inactive-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_location_primary',
		group: 'locations',
		groupSlug: 'locations',
		name: 'markLocationPrimary',
		method: 'POST',
		path: '/locations/{location_id}/markasprimary',
		summary: 'Mark as Primary',
		description: 'Mark location as primary.',
		docsUrl: 'https://www.zoho.com/books/api/v3/locations/',
		parameters: [
			{
				name: 'location_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the location.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-as-primary-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
];
