import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	cost_rate: {
		description: 'Hourly cost rate',
		type: 'number',
		format: 'double',
	},
	'create-a-user-request': {
		required: ['name', 'email'],
		type: 'object',
		properties: {
			name: { $ref: '#/components/schemas/name' },
			email: { $ref: '#/components/schemas/email' },
			role_id: { $ref: '#/components/schemas/role_id' },
			cost_rate: { $ref: '#/components/schemas/cost_rate' },
		},
	},
	'create-a-user-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	created_time: {
		type: 'string',
		description: 'Time at which the user is created.',
	},
	custom_fields: {
		type: 'array',
		items: { type: 'object' },
		description: 'Custom fields added for the user.',
	},
	'delete-a-user-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	email: { description: 'email address of the user', type: 'string' },
	'get-a-user-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			user: {
				type: 'object',
				properties: {
					user_id: { $ref: '#/components/schemas/user_id' },
					name: { $ref: '#/components/schemas/name' },
					email_ids: {
						description: 'EmailIDs of an user',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								email: { $ref: '#/components/schemas/email' },
								is_selected: { $ref: '#/components/schemas/is_selected' },
							},
						},
					},
					status: { $ref: '#/components/schemas/status' },
					user_role: { $ref: '#/components/schemas/user_role' },
					user_type: { $ref: '#/components/schemas/user_type' },
					role_id: { $ref: '#/components/schemas/role_id' },
					cost_rate: { $ref: '#/components/schemas/cost_rate' },
					photo_url: { $ref: '#/components/schemas/photo_url' },
					is_employee: { $ref: '#/components/schemas/is_employee' },
					created_time: { $ref: '#/components/schemas/created_time' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
				},
			},
		},
	},
	'get-current-user-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			user: {
				type: 'object',
				properties: {
					user_id: { $ref: '#/components/schemas/user_id' },
					name: { $ref: '#/components/schemas/name' },
					email_ids: {
						description: 'EmailIDs of an user',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								email: { $ref: '#/components/schemas/email' },
								is_selected: { $ref: '#/components/schemas/is_selected' },
							},
						},
					},
					status: { $ref: '#/components/schemas/status' },
					user_role: { $ref: '#/components/schemas/user_role' },
					user_type: { $ref: '#/components/schemas/user_type' },
					role_id: { $ref: '#/components/schemas/role_id' },
					cost_rate: { $ref: '#/components/schemas/cost_rate' },
					photo_url: { $ref: '#/components/schemas/photo_url' },
					is_employee: { $ref: '#/components/schemas/is_employee' },
					created_time: { $ref: '#/components/schemas/created_time' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
				},
			},
		},
	},
	has_more_page: {
		type: 'boolean',
		description: 'Indicates whether there are more pages to be fetched or not.',
	},
	'invite-a-user-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	is_current_user: {
		type: 'boolean',
		description: 'Indicates whether the user is the current user.',
	},
	is_customer_segmented: {
		type: 'boolean',
		description: 'Indicates whether the user is segmented as customer.',
	},
	is_employee: {
		type: 'boolean',
		description: 'Indicates whether the user is an employee.',
	},
	is_selected: {
		type: 'boolean',
		description:
			'Indicates whether the email is selected as primary email or not.',
	},
	is_vendor_segmented: {
		type: 'boolean',
		description: 'Indicates whether the user is segmented as vendor.',
	},
	'list-users-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			users: {
				type: 'array',
				description: 'List of users in the organization.',
				items: {
					type: 'object',
					properties: {
						user_id: { $ref: '#/components/schemas/user_id' },
						role_id: { $ref: '#/components/schemas/role_id' },
						name: { $ref: '#/components/schemas/name' },
						email: { $ref: '#/components/schemas/email' },
						user_role: { $ref: '#/components/schemas/user_role' },
						status: { $ref: '#/components/schemas/status' },
						is_current_user: { $ref: '#/components/schemas/is_current_user' },
						photo_url: { $ref: '#/components/schemas/photo_url' },
						is_customer_segmented: {
							$ref: '#/components/schemas/is_customer_segmented',
						},
						is_vendor_segmented: {
							$ref: '#/components/schemas/is_vendor_segmented',
						},
						user_type: { $ref: '#/components/schemas/user_type' },
					},
				},
			},
			page_context: {
				type: 'object',
				properties: {
					page: { $ref: '#/components/schemas/page' },
					per_page: { $ref: '#/components/schemas/per_page' },
					has_more_page: { $ref: '#/components/schemas/has_more_page' },
					report_name: { $ref: '#/components/schemas/report_name' },
					sort_column: { $ref: '#/components/schemas/sort_column' },
					sort_order: { $ref: '#/components/schemas/sort_order' },
				},
			},
		},
	},
	'mark-user-as-active-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-user-as-inactive-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	name: { description: 'name of the user', type: 'string' },
	page: {
		type: 'number',
		description: 'Number of pages to be fetched.',
		format: 'double',
	},
	per_page: {
		type: 'number',
		description: 'Number of records to be fetched per page.',
		format: 'double',
	},
	photo_url: { type: 'string', description: "URL of the user's photo." },
	report_name: { type: 'string', description: 'Name of the report.' },
	role_id: {
		type: 'string',
		description:
			'Unique identifier of the role assigned to the user. Note: This value is a set of numeric characters.',
	},
	sort_column: {
		type: 'string',
		description: 'The column name on which the sorting has to be done.',
	},
	sort_order: {
		type: 'string',
		description: 'Order in which the records has to be sorted.',
	},
	status: { type: 'string', description: 'Status of the user.' },
	'update-a-user-request': {
		required: ['name', 'email'],
		type: 'object',
		properties: {
			name: { $ref: '#/components/schemas/name' },
			email: { $ref: '#/components/schemas/email' },
			role_id: { $ref: '#/components/schemas/role_id' },
			cost_rate: { $ref: '#/components/schemas/cost_rate' },
		},
	},
	'update-a-user-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	user_id: {
		type: 'string',
		description:
			'Unique identifier of the user. Note: This value is a set of numeric characters.',
	},
	user_role: {
		description:
			'Role to be assigned. Allowed Values: <code>staff</code>, <code>admin</code> and <code>timesheetstaff</code>.',
		type: 'string',
	},
	user_type: { type: 'string', description: 'Type of the user.' },
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_user',
		group: 'users',
		groupSlug: 'users',
		name: 'createUser',
		method: 'POST',
		path: '/users',
		summary: 'Create a user',
		description: 'Create a user for your organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-user-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-user-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_users',
		group: 'users',
		groupSlug: 'users',
		name: 'listUsers',
		method: 'GET',
		path: '/users',
		summary: 'List Users',
		description: 'Get the list of all users in the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Allowed Values: <code>Status.All, Status.Active, Status.Inactive, Status.Invited and Status.Deleted</code>',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort users. Allowed Values: <code>name, email, user_role and status</code>',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description: 'Page number to be fetched. Default value is 1.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description: 'Number of records to be fetched per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-users-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_user',
		group: 'users',
		groupSlug: 'users',
		name: 'updateUser',
		method: 'PUT',
		path: '/users/{user_id}',
		summary: 'Update a user',
		description: 'Update the details of a user.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'user_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the user. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-user-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-user-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_user',
		group: 'users',
		groupSlug: 'users',
		name: 'getUser',
		method: 'GET',
		path: '/users/{user_id}',
		summary: 'Get an user details',
		description: 'Get the details of a user.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'user_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the user. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-user-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_user',
		group: 'users',
		groupSlug: 'users',
		name: 'deleteUser',
		method: 'DELETE',
		path: '/users/{user_id}',
		summary: 'Delete a user',
		description: 'Delete a user associated to the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'user_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the user. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-a-user-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_current_user',
		group: 'users',
		groupSlug: 'users',
		name: 'getCurrentUser',
		method: 'GET',
		path: '/users/me',
		summary: 'Get current user',
		description: 'Get the details of the current user.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-current-user-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'invite_user',
		group: 'users',
		groupSlug: 'users',
		name: 'inviteUser',
		method: 'POST',
		path: '/users/{user_id}/invite',
		summary: 'Invite a user',
		description: 'Send invitation email to a user.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'user_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the user. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/invite-a-user-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_user_active',
		group: 'users',
		groupSlug: 'users',
		name: 'markUserActive',
		method: 'POST',
		path: '/users/{user_id}/active',
		summary: 'Mark user as active',
		description: 'Mark an inactive user as active.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'user_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the user. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-user-as-active-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_user_inactive',
		group: 'users',
		groupSlug: 'users',
		name: 'markUserInactive',
		method: 'POST',
		path: '/users/{user_id}/inactive',
		summary: 'Mark user as inactive',
		description: 'Mark an active user as inactive.',
		docsUrl: 'https://www.zoho.com/books/api/v3/users/',
		parameters: [
			{
				name: 'user_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the user. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-user-as-inactive-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
