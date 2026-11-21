import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	communication_preference: {
		description: 'Preferred modes of communication for the contact person.',
		type: 'object',
		properties: {
			is_sms_enabled: { $ref: '#/components/schemas/is_sms_enabled' },
			is_whatsapp_enabled: { $ref: '#/components/schemas/is_whatsapp_enabled' },
		},
	},
	contact_id: { description: 'Contact id of the contact', type: 'string' },
	'contact_person-response': {
		type: 'object',
		properties: {
			contact_id: { $ref: '#/components/schemas/contact_id' },
			contact_person_id: { $ref: '#/components/schemas/contact_person_id' },
			salutation: { $ref: '#/components/schemas/salutation' },
			first_name: { $ref: '#/components/schemas/first_name' },
			last_name: { $ref: '#/components/schemas/last_name' },
			email: { $ref: '#/components/schemas/email' },
			phone: { $ref: '#/components/schemas/phone' },
			mobile: { $ref: '#/components/schemas/mobile' },
			is_primary_contact: { $ref: '#/components/schemas/is_primary_contact' },
			skype: { $ref: '#/components/schemas/skype' },
			designation: { $ref: '#/components/schemas/designation' },
			department: { $ref: '#/components/schemas/department' },
			is_added_in_portal: { $ref: '#/components/schemas/is_added_in_portal' },
			communication_preference: {
				$ref: '#/components/schemas/communication_preference',
			},
		},
	},
	contact_person_id: {
		description: 'The id of the contact person',
		type: 'string',
	},
	'create-a-contact-person-request': {
		required: ['first_name'],
		type: 'object',
		properties: {
			contact_id: { $ref: '#/components/schemas/contact_id' },
			salutation: { $ref: '#/components/schemas/salutation' },
			first_name: { $ref: '#/components/schemas/first_name' },
			last_name: { $ref: '#/components/schemas/last_name' },
			email: { $ref: '#/components/schemas/email' },
			phone: { $ref: '#/components/schemas/phone' },
			mobile: { $ref: '#/components/schemas/mobile' },
			skype: { $ref: '#/components/schemas/skype' },
			designation: { $ref: '#/components/schemas/designation' },
			department: { $ref: '#/components/schemas/department' },
			enable_portal: { $ref: '#/components/schemas/enable_portal' },
			communication_preference: {
				$ref: '#/components/schemas/communication_preference',
			},
		},
	},
	'create-a-contact-person-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contact_person: {
				type: 'array',
				items: { $ref: '#/components/schemas/contact_person-response' },
			},
		},
	},
	'delete-a-contact-person-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	department: {
		description: 'department on which a person belongs. Max-length [50]',
		type: 'string',
	},
	designation: {
		description: 'designation of a person. Max-length [50]',
		type: 'string',
	},
	email: {
		description: 'Email address of the contact person.  Max-length [100]',
		type: 'string',
	},
	enable_portal: {
		description:
			'option to enable the portal access. allowed values <code>true</code>,<code>false</code>',
		type: 'boolean',
	},
	first_name: {
		description: 'First name of the contact person. Max-length [100]',
		type: 'string',
	},
	'get-a-contact-person-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contact_person: {
				type: 'object',
				properties: {
					contact_id: { $ref: '#/components/schemas/contact_id' },
					contact_person_id: { $ref: '#/components/schemas/contact_person_id' },
					salutation: { $ref: '#/components/schemas/salutation' },
					first_name: { $ref: '#/components/schemas/first_name' },
					last_name: { $ref: '#/components/schemas/last_name' },
					email: { $ref: '#/components/schemas/email' },
					phone: { $ref: '#/components/schemas/phone' },
					mobile: { $ref: '#/components/schemas/mobile' },
					is_primary_contact: {
						$ref: '#/components/schemas/is_primary_contact',
					},
					skype: { $ref: '#/components/schemas/skype' },
					designation: { $ref: '#/components/schemas/designation' },
					department: { $ref: '#/components/schemas/department' },
					is_added_in_portal: {
						$ref: '#/components/schemas/is_added_in_portal',
					},
					communication_preference: {
						$ref: '#/components/schemas/communication_preference',
					},
				},
			},
		},
	},
	has_more_page: { description: 'Check if has more pages', type: 'boolean' },
	is_added_in_portal: {
		description: 'tells whether the contact person has portal access/not',
		type: 'boolean',
	},
	is_primary_contact: {
		description: 'To mark contact person as primary for contact',
		type: 'boolean',
	},
	is_sms_enabled: {
		description:
			'Used to check if SMS communication preference is enabled for the contact person.',
		type: 'boolean',
		'x-node_available_in': ['SMS integration'],
	},
	is_whatsapp_enabled: {
		description:
			'Used to check if WhatsApp communication preference is enabled for the contact person.',
		type: 'boolean',
		'x-node_available_in': ['WhatsApp integration'],
	},
	last_name: {
		description: 'Last name of the contact person. Max-length [100]',
		type: 'string',
	},
	'list-contact-persons-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contact_persons: {
				description: 'Contact persons of a contact.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						contact_person_id: {
							$ref: '#/components/schemas/contact_person_id',
						},
						salutation: { $ref: '#/components/schemas/salutation' },
						first_name: { $ref: '#/components/schemas/first_name' },
						last_name: { $ref: '#/components/schemas/last_name' },
						email: { $ref: '#/components/schemas/email' },
						phone: { $ref: '#/components/schemas/phone' },
						mobile: { $ref: '#/components/schemas/mobile' },
						is_primary_contact: {
							$ref: '#/components/schemas/is_primary_contact',
						},
						skype: { $ref: '#/components/schemas/skype' },
						designation: { $ref: '#/components/schemas/designation' },
						department: { $ref: '#/components/schemas/department' },
						is_added_in_portal: {
							$ref: '#/components/schemas/is_added_in_portal',
						},
						communication_preference: {
							$ref: '#/components/schemas/communication_preference',
						},
					},
				},
			},
			page_context: {
				description: 'The context of a particular page.',
				type: 'object',
				properties: {
					page: { $ref: '#/components/schemas/page' },
					per_page: { $ref: '#/components/schemas/per_page' },
					has_more_page: { $ref: '#/components/schemas/has_more_page' },
					sort_column: { $ref: '#/components/schemas/sort_column' },
					sort_order: { $ref: '#/components/schemas/sort_order' },
				},
			},
		},
	},
	'mark-as-primary-contact-person-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	mobile: { description: 'Max-length [50]', type: 'string' },
	page: { description: 'Number of pages', type: 'integer' },
	per_page: { description: 'Per page values', type: 'integer' },
	phone: { description: 'Max-length [50]', type: 'string' },
	salutation: {
		description: 'Salutation for the contact. Max-length [25]',
		type: 'string',
	},
	skype: { description: 'skype address. Max-length [50]', type: 'string' },
	sort_column: {
		description:
			'Param Description.Allowed Values: <code>contact_person_id</code>',
		type: 'string',
	},
	sort_order: { description: 'The order for sorting', type: 'string' },
	'update-a-contact-person-request': {
		required: ['contact_id', 'first_name'],
		type: 'object',
		properties: {
			contact_id: { $ref: '#/components/schemas/contact_id' },
			salutation: { $ref: '#/components/schemas/salutation' },
			first_name: { $ref: '#/components/schemas/first_name' },
			last_name: { $ref: '#/components/schemas/last_name' },
			email: { $ref: '#/components/schemas/email' },
			phone: { $ref: '#/components/schemas/phone' },
			mobile: { $ref: '#/components/schemas/mobile' },
			skype: { $ref: '#/components/schemas/skype' },
			designation: { $ref: '#/components/schemas/designation' },
			department: { $ref: '#/components/schemas/department' },
			enable_portal: { $ref: '#/components/schemas/enable_portal' },
			is_primary_contact: { $ref: '#/components/schemas/is_primary_contact' },
			communication_preference: {
				$ref: '#/components/schemas/communication_preference',
			},
		},
	},
	'update-a-contact-person-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contact_person: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						contact_id: { $ref: '#/components/schemas/contact_id' },
						contact_person_id: {
							$ref: '#/components/schemas/contact_person_id',
						},
						salutation: { $ref: '#/components/schemas/salutation' },
						first_name: { $ref: '#/components/schemas/first_name' },
						last_name: { $ref: '#/components/schemas/last_name' },
						email: { $ref: '#/components/schemas/email' },
						phone: { $ref: '#/components/schemas/phone' },
						mobile: { $ref: '#/components/schemas/mobile' },
						is_primary_contact: {
							$ref: '#/components/schemas/is_primary_contact',
						},
						skype: { $ref: '#/components/schemas/skype' },
						designation: { $ref: '#/components/schemas/designation' },
						department: { $ref: '#/components/schemas/department' },
						is_added_in_portal: {
							$ref: '#/components/schemas/is_added_in_portal',
						},
						communication_preference: {
							$ref: '#/components/schemas/communication_preference',
						},
					},
				},
			},
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_contact_person',
		group: 'contactPersons',
		groupSlug: 'contact-persons',
		name: 'createContactPerson',
		method: 'POST',
		path: '/contacts/contactpersons',
		summary: 'Create a contact person',
		description: 'Create a contact person for contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contact-persons/',
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
			schema: { $ref: '#/components/schemas/create-a-contact-person-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-contact-person-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_contact_person',
		group: 'contactPersons',
		groupSlug: 'contact-persons',
		name: 'updateContactPerson',
		method: 'PUT',
		path: '/contacts/contactpersons/{contact_person_id}',
		summary: 'Update a contact person',
		description: 'Update an existing contact person.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contact-persons/',
		parameters: [
			{
				name: 'contact_person_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the contact person.',
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
			schema: { $ref: '#/components/schemas/update-a-contact-person-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-contact-person-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_contact_person',
		group: 'contactPersons',
		groupSlug: 'contact-persons',
		name: 'deleteContactPerson',
		method: 'DELETE',
		path: '/contacts/contactpersons/{contact_person_id}',
		summary: 'Delete a contact person',
		description: 'Delete an existing contact person.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contact-persons/',
		parameters: [
			{
				name: 'contact_person_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the contact person.',
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
				schema: {
					$ref: '#/components/schemas/delete-a-contact-person-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_contact_persons',
		group: 'contactPersons',
		groupSlug: 'contact-persons',
		name: 'listContactPersons',
		method: 'GET',
		path: '/contacts/{contact_id}/contactpersons',
		summary: 'List contact persons',
		description: 'List all contacts with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contact-persons/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the contact.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
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
				schema: { $ref: '#/components/schemas/list-contact-persons-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_person',
		group: 'contactPersons',
		groupSlug: 'contact-persons',
		name: 'getContactPerson',
		method: 'GET',
		path: '/contacts/{contact_id}/contactpersons/{contact_person_id}',
		summary: 'Get a contact person',
		description: 'Get the contact person details.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contact-persons/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the contact.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'contact_person_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the contact person.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-contact-person-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'mark_contact_person_primary',
		group: 'contactPersons',
		groupSlug: 'contact-persons',
		name: 'markContactPersonPrimary',
		method: 'POST',
		path: '/contacts/contactpersons/{contact_person_id}/primary',
		summary: 'Mark as primary contact person',
		description: 'Mark a contact person as primary for the contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contact-persons/',
		parameters: [
			{
				name: 'contact_person_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the contact person.',
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
				schema: {
					$ref: '#/components/schemas/mark-as-primary-contact-person-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
];
