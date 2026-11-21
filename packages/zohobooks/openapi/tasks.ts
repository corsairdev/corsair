import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	'add-a-task-request': {
		type: 'object',
		properties: {
			task_id: { $ref: '#/components/schemas/task_id' },
			owner_ids: { $ref: '#/components/schemas/owner_ids' },
			owner_id: { $ref: '#/components/schemas/owner_id' },
			task_type: { $ref: '#/components/schemas/task_type' },
			title: { $ref: '#/components/schemas/title' },
			due_date: { $ref: '#/components/schemas/due_date' },
			contact_type: { $ref: '#/components/schemas/contact_type' },
			contact_id: { $ref: '#/components/schemas/contact_id' },
			can_push: { $ref: '#/components/schemas/can_push' },
			related_entity_type: { $ref: '#/components/schemas/related_entity_type' },
			related_entity_id: { $ref: '#/components/schemas/related_entity_id' },
			related_sub_entity_type: {
				$ref: '#/components/schemas/related_sub_entity_type',
			},
			related_sub_entity_id: {
				$ref: '#/components/schemas/related_sub_entity_id',
			},
			status: { $ref: '#/components/schemas/status' },
			billing_type: { $ref: '#/components/schemas/billing_type' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			task_rate: { $ref: '#/components/schemas/task_rate' },
			completion_percentage: {
				$ref: '#/components/schemas/completion_percentage',
			},
			priority: { $ref: '#/components/schemas/priority' },
			send_email_notification: {
				$ref: '#/components/schemas/send_email_notification',
			},
			mail_id: { $ref: '#/components/schemas/mail_id' },
			email_account_type: { $ref: '#/components/schemas/email_account_type' },
			email_folder_id: { $ref: '#/components/schemas/email_folder_id' },
			email_account_id: { $ref: '#/components/schemas/email_account_id' },
			mail_attachments: { $ref: '#/components/schemas/mail_attachments' },
			reminder: { $ref: '#/components/schemas/reminder' },
			task_description: { $ref: '#/components/schemas/task_description' },
			custom_fields: {
				type: 'array',
				description: 'Custom fields associated with the task.',
				items: {
					type: 'object',
					properties: {
						customfield_id: {
							description: 'ID of the custom field.',
							type: 'string',
						},
						index: {
							description: 'Index of the custom field.',
							type: 'integer',
						},
						label: {
							description: 'Label of the custom field.',
							type: 'string',
						},
						value: {
							description: 'Value of the custom field.',
							type: 'string',
						},
						value_formatted: {
							description: 'Formatted value of the custom field.',
							type: 'string',
						},
						api_name: {
							description: 'Name of the custom field.',
							type: 'string',
						},
					},
				},
			},
			due_after: { $ref: '#/components/schemas/due_after' },
			template_id: { $ref: '#/components/schemas/template_id' },
			task_number: { $ref: '#/components/schemas/task_number' },
			task_number_prefix: { $ref: '#/components/schemas/task_number_prefix' },
			task_number_suffix: { $ref: '#/components/schemas/task_number_suffix' },
			recurring_task_id: { $ref: '#/components/schemas/recurring_task_id' },
			is_sub_task: { $ref: '#/components/schemas/is_sub_task' },
			parent_id: { $ref: '#/components/schemas/parent_id' },
			dependencies: { $ref: '#/components/schemas/dependencies' },
			entity_tags: {
				description: 'List of tags to be associated with the task.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: { description: 'Name of the tag.', type: 'string' },
						color: { description: 'Color code of the tag.', type: 'string' },
					},
				},
			},
		},
	},
	'add-a-task-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			task: {
				type: 'object',
				properties: {
					task_id: { $ref: '#/components/schemas/task_id' },
					recurring_task_id: { $ref: '#/components/schemas/recurring_task_id' },
					owner_id: { $ref: '#/components/schemas/owner_id' },
					owner_ids: { $ref: '#/components/schemas/owner_ids' },
					owner_name: { $ref: '#/components/schemas/owner_name' },
					owners: { $ref: '#/components/schemas/owners' },
					title: { $ref: '#/components/schemas/title' },
					due_date: { $ref: '#/components/schemas/due_date' },
					due_date_formatted: {
						$ref: '#/components/schemas/due_date_formatted',
					},
					is_overdue: { $ref: '#/components/schemas/is_overdue' },
					contact_type: { $ref: '#/components/schemas/contact_type' },
					contact_id: { $ref: '#/components/schemas/contact_id' },
					color_code: { $ref: '#/components/schemas/color_code' },
					contact_name: { $ref: '#/components/schemas/contact_name' },
					parent_task_id: { $ref: '#/components/schemas/parent_task_id' },
					related_entity_id: { $ref: '#/components/schemas/related_entity_id' },
					related_entity_type: {
						$ref: '#/components/schemas/related_entity_type',
					},
					related_entity: { $ref: '#/components/schemas/related_entity' },
					related_entity_value: {
						$ref: '#/components/schemas/related_entity_value',
					},
					parent_status: { $ref: '#/components/schemas/parent_status' },
					status: { $ref: '#/components/schemas/status' },
					custom_status_id: { $ref: '#/components/schemas/custom_status_id' },
					billing_type: { $ref: '#/components/schemas/billing_type' },
					is_billable: { $ref: '#/components/schemas/is_billable' },
					task_rate: { $ref: '#/components/schemas/task_rate' },
					completion_percentage: {
						$ref: '#/components/schemas/completion_percentage',
					},
					is_subtask: { $ref: '#/components/schemas/is_subtask' },
					priority: { $ref: '#/components/schemas/priority' },
					reminder: { $ref: '#/components/schemas/reminder' },
					task_description: { $ref: '#/components/schemas/task_description' },
					is_accountant_task: {
						$ref: '#/components/schemas/is_accountant_task',
					},
					task_number: { $ref: '#/components/schemas/task_number' },
					task_number_prefix: {
						$ref: '#/components/schemas/task_number_prefix',
					},
					task_number_suffix: {
						$ref: '#/components/schemas/task_number_suffix',
					},
					can_push: { $ref: '#/components/schemas/can_push' },
					created_by_id: { $ref: '#/components/schemas/created_by_id' },
					last_modified_by_id: {
						$ref: '#/components/schemas/last_modified_by_id',
					},
					template_id: { $ref: '#/components/schemas/template_id' },
					due_after: { $ref: '#/components/schemas/due_after' },
					parent_task_name: { $ref: '#/components/schemas/parent_task_name' },
					parent_task_number: {
						$ref: '#/components/schemas/parent_task_number',
					},
					created_by_name: { $ref: '#/components/schemas/created_by_name' },
					documents: { $ref: '#/components/schemas/documents' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					statuses: { $ref: '#/components/schemas/statuses' },
					is_system_task: { $ref: '#/components/schemas/is_system_task' },
					system_task_type: { $ref: '#/components/schemas/system_task_type' },
					comments: { $ref: '#/components/schemas/comments' },
					dependencies: { $ref: '#/components/schemas/dependencies' },
					entity_tags: { $ref: '#/components/schemas/entity_tags' },
				},
			},
		},
	},
	'add-task-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			documents: { $ref: '#/components/schemas/documents' },
		},
	},
	'add-task-comment-request': {
		required: ['description'],
		type: 'object',
		properties: {
			description: {
				description: 'Description of the comment.',
				type: 'string',
			},
		},
	},
	'add-task-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comment: { $ref: '#/components/schemas/comment' },
		},
	},
	attachment_order: {
		description: 'Order of the attachment in the task.',
		type: 'integer',
	},
	billing_type: { description: 'Billing type of the task.', type: 'string' },
	can_push: {
		description: 'Indicates if the task can be sync to client',
		type: 'boolean',
	},
	can_show_in_portal: {
		description:
			'Indicates whether the document can be shown in the customer portal.',
		type: 'boolean',
	},
	client_id: {
		description: 'ID of the client associated with the task.',
		type: 'string',
	},
	client_name: {
		description: 'Name of the client associated with the task.',
		type: 'string',
	},
	color_code: { description: 'Color code of the task.', type: 'string' },
	comment: {
		description: 'Comment on the task.',
		type: 'object',
		properties: {
			comment_id: { $ref: '#/components/schemas/comment_id' },
			description: { $ref: '#/components/schemas/description' },
			commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
			commented_by: { $ref: '#/components/schemas/commented_by' },
			comment_type: { $ref: '#/components/schemas/comment_type' },
			date: {
				description: 'Date when the comment was made.',
				type: 'string',
				format: 'date-time',
			},
			date_description: { $ref: '#/components/schemas/date_description' },
			time: { $ref: '#/components/schemas/time' },
			operation_type: { $ref: '#/components/schemas/operation_type' },
			transaction_id: { $ref: '#/components/schemas/transaction_id' },
			transaction_type: { $ref: '#/components/schemas/transaction_type' },
		},
	},
	comment_id: { description: 'ID of the comment on the task.', type: 'string' },
	comment_type: { description: 'Type of the comment.', type: 'string' },
	commented_by: {
		description: 'Name of the user who commented on the task.',
		type: 'string',
	},
	commented_by_id: {
		description: 'ID of the user who commented on the task.',
		type: 'string',
	},
	comments: {
		description: 'List of comments for the task.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				comment_id: { $ref: '#/components/schemas/comment_id' },
				description: {
					description: 'Description of the comment.',
					type: 'string',
				},
				commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
				commented_by: { $ref: '#/components/schemas/commented_by' },
				comment_type: { $ref: '#/components/schemas/comment_type' },
				date: {
					description: 'Date when the comment was made.',
					type: 'string',
					format: 'date-time',
				},
				date_description: { $ref: '#/components/schemas/date_description' },
				time: { $ref: '#/components/schemas/time' },
				operation_type: { $ref: '#/components/schemas/operation_type' },
				transaction_id: { $ref: '#/components/schemas/transaction_id' },
				transaction_type: { $ref: '#/components/schemas/transaction_type' },
			},
		},
	},
	completion_percentage: {
		description: 'Completion percentage of the task.',
		type: 'integer',
	},
	contact_id: {
		description: 'ID of the contact associated with the task.',
		type: 'string',
	},
	contact_name: {
		description: 'Name of the contact associated with the task.',
		type: 'string',
	},
	contact_type: {
		description:
			'Type of the contact associated with the task. Allowed values are <code>customer</code> and <code>vendor</code>',
		type: 'string',
	},
	created_by_id: {
		description: 'ID of the user who created the task.',
		type: 'string',
	},
	created_by_name: {
		description: 'Name of the user who created the task.',
		type: 'string',
	},
	created_time: {
		description: 'Creation time of the task.',
		type: 'string',
		format: 'date-time',
	},
	created_time_formatted: {
		description: 'Formatted creation time of the task.',
		type: 'string',
	},
	custom_fields: {
		type: 'array',
		description: 'List of custom fields associated with the task',
		items: {
			type: 'object',
			properties: {
				customfield_id: {
					type: 'string',
					description: 'Unique identifier of the custom field',
				},
				edit_on_store: {
					type: 'boolean',
					description: 'Whether the custom field can be edited on store',
				},
				show_in_all_pdf: {
					type: 'boolean',
					description: 'Whether to show this custom field in all PDF documents',
				},
				search_entity: {
					type: 'string',
					description: 'Entity type to search when this is a lookup field',
				},
				value: {
					type: 'object',
					description: 'Value of the custom field, could be of any data type',
				},
				value_formatted: {
					type: 'string',
					description: 'Formatted string representation of the value',
				},
				show_in_store: {
					type: 'boolean',
					description: 'Whether to show this custom field in store',
				},
				is_active: {
					type: 'boolean',
					description: 'Whether the custom field is active',
				},
				order: {
					type: 'integer',
					description: 'Display order of the custom field',
				},
				label: {
					type: 'string',
					description: 'Display name of the custom field',
				},
				api_name: { type: 'string', description: 'API name of the field' },
				data_type: {
					type: 'string',
					description: 'Data type of the custom field',
				},
				is_dependent_field: {
					type: 'boolean',
					description: 'Whether the custom field depends on another field',
				},
				show_in_portal: {
					type: 'boolean',
					description:
						'Whether to show this custom field in the customer portal',
				},
				show_on_pdf: {
					type: 'boolean',
					description: 'Whether to show this custom field in PDF documents',
				},
				edit_on_portal: {
					type: 'boolean',
					description:
						'Whether the custom field can be edited on the customer portal',
				},
			},
		},
	},
	custom_status_id: {
		description: 'ID of the custom status of the task.',
		type: 'string',
	},
	date_description: {
		description: 'Description of the date when the comment was made.',
		type: 'string',
	},
	'delete-a-task-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-task-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-task-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-tasks-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	dependencies: {
		description: 'List of dependencies for the task.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				dependency_id: { description: 'ID of the dependency.', type: 'string' },
				dependency_type: {
					description: 'Type of the dependency.',
					type: 'integer',
				},
				depends_on_id: {
					description: 'ID of the entity on which the current task depends.',
					type: 'string',
				},
				depends_on_entity_type: {
					description: 'Type of the entity on which the current task depends.',
					type: 'integer',
				},
			},
		},
	},
	description: { description: 'Description of the comment.', type: 'string' },
	document: {
		description: 'Details of the document attached to the task.',
		type: 'object',
		properties: {
			can_show_in_portal: { $ref: '#/components/schemas/can_show_in_portal' },
			file_name: { $ref: '#/components/schemas/file_name' },
			file_type: { $ref: '#/components/schemas/file_type' },
			file_size: { $ref: '#/components/schemas/file_size' },
			file_size_formatted: { $ref: '#/components/schemas/file_size_formatted' },
			document_id: { $ref: '#/components/schemas/document_id' },
			attachment_order: { $ref: '#/components/schemas/attachment_order' },
		},
	},
	document_id: {
		description: 'ID of the document attached to the task.',
		type: 'string',
	},
	documents: {
		description: 'List of files attached to a particular task.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				can_show_in_portal: { $ref: '#/components/schemas/can_show_in_portal' },
				file_name: { $ref: '#/components/schemas/file_name' },
				file_type: { $ref: '#/components/schemas/file_type' },
				file_size: { $ref: '#/components/schemas/file_size' },
				file_size_formatted: {
					$ref: '#/components/schemas/file_size_formatted',
				},
				document_id: { $ref: '#/components/schemas/document_id' },
				attachment_order: { $ref: '#/components/schemas/attachment_order' },
			},
		},
	},
	due_after: {
		description: 'Number of days after which the task is due.',
		type: 'integer',
	},
	due_date: {
		description: 'Due date of the task.',
		type: 'string',
		format: 'date',
	},
	due_date_formatted: {
		description: 'Formatted due date of the task.',
		type: 'string',
	},
	email_account_id: {
		description: 'Email account ID to which the notification has to be sent.',
		type: 'string',
	},
	email_account_type: {
		description: 'Email account type to which the notification has to be sent.',
		type: 'string',
	},
	email_folder_id: {
		description:
			'Folder ID of the email account to which the notification has to be sent.',
		type: 'string',
	},
	entity_tags: {
		description: 'List of tags associated with the task.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: { description: 'ID of the tag.', type: 'string' },
				name: { description: 'Name of the tag.', type: 'string' },
				color: { description: 'Color code of the tag.', type: 'string' },
			},
		},
	},
	file_name: {
		description: 'Name of the file attached to the task.',
		type: 'string',
	},
	file_size: {
		description: 'Size of the file attached to the task in bytes.',
		type: 'integer',
	},
	file_size_formatted: {
		description: 'Formatted size of the file attached to the task.',
		type: 'string',
	},
	file_type: {
		description: 'Type of the file attached to the task.',
		type: 'string',
	},
	'get-a-task-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			documents: { $ref: '#/components/schemas/document' },
		},
	},
	'get-a-task-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			task: {
				type: 'object',
				properties: {
					task_id: { $ref: '#/components/schemas/task_id' },
					recurring_task_id: { $ref: '#/components/schemas/recurring_task_id' },
					owner_id: { $ref: '#/components/schemas/owner_id' },
					owner_ids: { $ref: '#/components/schemas/owner_ids' },
					owner_name: { $ref: '#/components/schemas/owner_name' },
					owners: { $ref: '#/components/schemas/owners' },
					title: { $ref: '#/components/schemas/title' },
					due_date: { $ref: '#/components/schemas/due_date' },
					due_date_formatted: {
						$ref: '#/components/schemas/due_date_formatted',
					},
					is_overdue: { $ref: '#/components/schemas/is_overdue' },
					contact_type: { $ref: '#/components/schemas/contact_type' },
					contact_id: { $ref: '#/components/schemas/contact_id' },
					color_code: { $ref: '#/components/schemas/color_code' },
					contact_name: { $ref: '#/components/schemas/contact_name' },
					parent_task_id: { $ref: '#/components/schemas/parent_task_id' },
					related_entity_id: { $ref: '#/components/schemas/related_entity_id' },
					related_entity_type: {
						$ref: '#/components/schemas/related_entity_type',
					},
					related_entity: { $ref: '#/components/schemas/related_entity' },
					related_entity_value: {
						$ref: '#/components/schemas/related_entity_value',
					},
					parent_status: { $ref: '#/components/schemas/parent_status' },
					status: { $ref: '#/components/schemas/status' },
					custom_status_id: { $ref: '#/components/schemas/custom_status_id' },
					billing_type: { $ref: '#/components/schemas/billing_type' },
					is_billable: { $ref: '#/components/schemas/is_billable' },
					task_rate: { $ref: '#/components/schemas/task_rate' },
					completion_percentage: {
						$ref: '#/components/schemas/completion_percentage',
					},
					is_subtask: { $ref: '#/components/schemas/is_subtask' },
					priority: { $ref: '#/components/schemas/priority' },
					reminder: { $ref: '#/components/schemas/reminder' },
					task_description: { $ref: '#/components/schemas/task_description' },
					is_accountant_task: {
						$ref: '#/components/schemas/is_accountant_task',
					},
					task_number: { $ref: '#/components/schemas/task_number' },
					task_number_prefix: {
						$ref: '#/components/schemas/task_number_prefix',
					},
					task_number_suffix: {
						$ref: '#/components/schemas/task_number_suffix',
					},
					can_push: { $ref: '#/components/schemas/can_push' },
					created_by_id: { $ref: '#/components/schemas/created_by_id' },
					last_modified_by_id: {
						$ref: '#/components/schemas/last_modified_by_id',
					},
					template_id: { $ref: '#/components/schemas/template_id' },
					due_after: { $ref: '#/components/schemas/due_after' },
					parent_task_name: { $ref: '#/components/schemas/parent_task_name' },
					parent_task_number: {
						$ref: '#/components/schemas/parent_task_number',
					},
					created_by_name: { $ref: '#/components/schemas/created_by_name' },
					documents: { $ref: '#/components/schemas/documents' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					statuses: { $ref: '#/components/schemas/statuses' },
					is_system_task: { $ref: '#/components/schemas/is_system_task' },
					system_task_type: { $ref: '#/components/schemas/system_task_type' },
					comments: { $ref: '#/components/schemas/comments' },
					dependencies: { $ref: '#/components/schemas/dependencies' },
					entity_tags: { $ref: '#/components/schemas/entity_tags' },
				},
			},
		},
	},
	is_accountant_task: {
		description: 'Indicates whether the task is an accountant task.',
		type: 'boolean',
	},
	is_billable: {
		description: 'Indicates whether the task is billable.',
		type: 'boolean',
	},
	is_overdue: {
		description: 'Indicates whether the task is overdue.',
		type: 'boolean',
	},
	is_sub_task: {
		description: 'Indicates whether the task is a sub task.',
		type: 'boolean',
	},
	is_subtask: {
		description: 'Indicates whether the task is a subtask.',
		type: 'boolean',
	},
	is_system_task: {
		description: 'Indicates whether the task is a system task.',
		type: 'boolean',
	},
	last_modified_by_id: {
		description: 'ID of the user who last modified the task.',
		type: 'string',
	},
	'list-task-comments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comments: { $ref: '#/components/schemas/comments' },
		},
	},
	'list-tasks-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tasks: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						task_id: { $ref: '#/components/schemas/task_id' },
						task_number: { $ref: '#/components/schemas/task_number' },
						owner_id: { $ref: '#/components/schemas/owner_id' },
						owner_name: { $ref: '#/components/schemas/owner_name' },
						contact_id: { $ref: '#/components/schemas/contact_id' },
						billing_type: { $ref: '#/components/schemas/billing_type' },
						is_billable: { $ref: '#/components/schemas/is_billable' },
						task_rate: { $ref: '#/components/schemas/task_rate' },
						completion_percentage: {
							$ref: '#/components/schemas/completion_percentage',
						},
						contact_name: { $ref: '#/components/schemas/contact_name' },
						contact_type: { $ref: '#/components/schemas/contact_type' },
						client_id: { $ref: '#/components/schemas/client_id' },
						client_name: { $ref: '#/components/schemas/client_name' },
						title: { $ref: '#/components/schemas/title' },
						created_time: { $ref: '#/components/schemas/created_time' },
						created_time_formatted: {
							$ref: '#/components/schemas/created_time_formatted',
						},
						due_date: { $ref: '#/components/schemas/due_date' },
						is_accountant_task: {
							$ref: '#/components/schemas/is_accountant_task',
						},
						is_overdue: { $ref: '#/components/schemas/is_overdue' },
						parent_task_id: { $ref: '#/components/schemas/parent_task_id' },
						parent_status: { $ref: '#/components/schemas/parent_status' },
						priority: { $ref: '#/components/schemas/priority' },
						status: { $ref: '#/components/schemas/status' },
						color_code: { $ref: '#/components/schemas/color_code' },
						task_description: { $ref: '#/components/schemas/task_description' },
						subtask_count: { $ref: '#/components/schemas/subtask_count' },
						is_subtask: { $ref: '#/components/schemas/is_subtask' },
						parent_task_name: { $ref: '#/components/schemas/parent_task_name' },
						parent_task_number: {
							$ref: '#/components/schemas/parent_task_number',
						},
						custom_fields: { $ref: '#/components/schemas/custom_fields' },
						owners: { $ref: '#/components/schemas/owners' },
						entity_tags: { $ref: '#/components/schemas/entity_tags' },
					},
				},
			},
		},
	},
	mail_attachments: {
		description:
			'List of attachments to be sent along with the email notification.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				attachment_id: {
					description:
						'ID of the attachment to be sent along with the email notification.',
					type: 'string',
				},
				file_name: {
					description: 'Name of the file attached to the email notification.',
					type: 'string',
				},
			},
		},
	},
	mail_id: {
		description: 'Email ID to which the notification has to be sent.',
		type: 'string',
	},
	'mark-completed-task-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-ongoing-task-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-open-task-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	operation_type: {
		description: 'Type of operation performed on the task.',
		type: 'string',
	},
	owner_id: { description: 'ID of the owner of the task.', type: 'string' },
	owner_ids: {
		description: 'Comma separated list of owner IDs of the task.',
		type: 'string',
	},
	owner_name: { description: 'Name of the owner of the task.', type: 'string' },
	owners: {
		description: 'List of owners of the task.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				owner_id: { $ref: '#/components/schemas/owner_id' },
				owner_name: { $ref: '#/components/schemas/owner_name' },
				owner_mail: {
					description: 'Email of the owner of the task.',
					type: 'string',
				},
				photo_url: {
					description: 'URL of the photo of the owner of the task.',
					type: 'string',
				},
			},
		},
	},
	parent_id: { description: 'ID of the parent task.', type: 'string' },
	parent_status: { description: 'Parent status of the task.', type: 'string' },
	parent_task_id: { description: 'ID of the parent task.', type: 'string' },
	parent_task_name: { description: 'Name of the parent task.', type: 'string' },
	parent_task_number: {
		description: 'Number of the parent task.',
		type: 'string',
	},
	priority: {
		description:
			'Priority of the task. Allowed values are <code>normal</code>, <code>low</code>, <code>high</code>, <code>lowest</code> and <code>highest</code>',
		type: 'string',
	},
	recurring_task_id: {
		description: 'ID of the recurring task.',
		type: 'string',
	},
	related_entity: {
		description: 'Unique value assigned to each entity.',
		type: 'integer',
	},
	related_entity_id: {
		description: 'ID of the related entity associated with the task.',
		type: 'string',
	},
	related_entity_type: {
		description: 'Type of the related entity associated with the task.',
		type: 'string',
	},
	related_entity_value: {
		description: 'Value of the related entity associated with the task.',
		type: 'string',
	},
	related_sub_entity_id: {
		description: 'ID of the related sub entity associated with the task.',
		type: 'string',
	},
	related_sub_entity_type: {
		description: 'Type of the related sub entity associated with the task.',
		type: 'string',
	},
	reminder: {
		description: 'Details of the reminder set for the task.',
		type: 'object',
		properties: {
			remind_before: {
				description:
					'Number of days, months or years before the task due date to send a reminder.',
				type: 'integer',
			},
			remind_at: {
				description: 'Specific date to send the reminder.',
				type: 'string',
				format: 'date',
			},
			remind_at_formatted: {
				description: 'Formatted date to send the reminder.',
				type: 'string',
			},
			remind_type: {
				description: 'Type of reminder which can be days, months or years.',
				type: 'string',
			},
			remind_type_formatted: {
				description:
					'Formatted type of reminder which can be days, months or years.',
				type: 'string',
			},
			alert_type: {
				description: 'Type of alert for the reminder.',
				type: 'string',
			},
			alert_type_formatted: {
				description: 'Formatted type of alert for the reminder.',
				type: 'string',
			},
		},
	},
	send_email_notification: {
		description: 'Indicates whether to send email notification for the task.',
		type: 'boolean',
	},
	status: { description: 'Status of the task.', type: 'string' },
	statuses: {
		description: 'List of statuses for the task.',
		type: 'array',
		items: { type: 'string' },
	},
	subtask_count: {
		description: 'Number of subtasks under the task.',
		type: 'integer',
	},
	system_task_type: {
		description: 'Type of the system task.',
		type: 'integer',
	},
	task_description: { description: 'Description of the task.', type: 'string' },
	task_id: { description: 'ID of the task.', type: 'string' },
	task_number: {
		description: 'Unique number assigned to the task.',
		type: 'string',
	},
	task_number_prefix: {
		description: 'Prefix of the task number.',
		type: 'string',
	},
	task_number_suffix: {
		description: 'Suffix of the task number.',
		type: 'string',
	},
	task_rate: {
		description: 'Rate of the task.',
		type: 'number',
		format: 'double',
	},
	task_type: { description: 'Type of the task.', type: 'string' },
	template_id: {
		description: 'ID of the template used for the task.',
		type: 'string',
	},
	time: { description: 'Time when the comment was made.', type: 'string' },
	title: { description: 'Title of the task.', type: 'string' },
	transaction_id: {
		description: 'ID of the transaction associated with the task.',
		type: 'string',
	},
	transaction_type: {
		description: 'Type of transaction associated with the task.',
		type: 'string',
	},
	'update-a-task-request': {
		type: 'object',
		properties: {
			task_id: { $ref: '#/components/schemas/task_id' },
			owner_ids: { $ref: '#/components/schemas/owner_ids' },
			owner_id: { $ref: '#/components/schemas/owner_id' },
			task_type: { $ref: '#/components/schemas/task_type' },
			title: { $ref: '#/components/schemas/title' },
			due_date: { $ref: '#/components/schemas/due_date' },
			contact_type: { $ref: '#/components/schemas/contact_type' },
			contact_id: { $ref: '#/components/schemas/contact_id' },
			can_push: { $ref: '#/components/schemas/can_push' },
			related_entity_type: { $ref: '#/components/schemas/related_entity_type' },
			related_entity_id: { $ref: '#/components/schemas/related_entity_id' },
			related_sub_entity_type: {
				$ref: '#/components/schemas/related_sub_entity_type',
			},
			related_sub_entity_id: {
				$ref: '#/components/schemas/related_sub_entity_id',
			},
			status: { $ref: '#/components/schemas/status' },
			billing_type: { $ref: '#/components/schemas/billing_type' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			task_rate: { $ref: '#/components/schemas/task_rate' },
			completion_percentage: {
				$ref: '#/components/schemas/completion_percentage',
			},
			priority: { $ref: '#/components/schemas/priority' },
			send_email_notification: {
				$ref: '#/components/schemas/send_email_notification',
			},
			mail_id: { $ref: '#/components/schemas/mail_id' },
			email_account_type: { $ref: '#/components/schemas/email_account_type' },
			email_folder_id: { $ref: '#/components/schemas/email_folder_id' },
			email_account_id: { $ref: '#/components/schemas/email_account_id' },
			mail_attachments: { $ref: '#/components/schemas/mail_attachments' },
			reminder: { $ref: '#/components/schemas/reminder' },
			task_description: { $ref: '#/components/schemas/task_description' },
			custom_fields: {
				type: 'array',
				description: 'List of custom fields associated with the task',
				items: {
					type: 'object',
					properties: {
						customfield_id: {
							description: 'ID of the custom field.',
							type: 'string',
						},
						index: {
							description: 'Index of the custom field.',
							type: 'integer',
						},
						label: {
							description: 'Label of the custom field.',
							type: 'string',
						},
						value: {
							description: 'Value of the custom field.',
							type: 'string',
						},
						value_formatted: {
							description: 'Formatted value of the custom field.',
							type: 'string',
						},
						api_name: {
							description: 'Name of the custom field.',
							type: 'string',
						},
					},
				},
			},
			due_after: { $ref: '#/components/schemas/due_after' },
			template_id: { $ref: '#/components/schemas/template_id' },
			task_number: { $ref: '#/components/schemas/task_number' },
			task_number_prefix: { $ref: '#/components/schemas/task_number_prefix' },
			task_number_suffix: { $ref: '#/components/schemas/task_number_suffix' },
			recurring_task_id: { $ref: '#/components/schemas/recurring_task_id' },
			is_sub_task: { $ref: '#/components/schemas/is_sub_task' },
			parent_id: { $ref: '#/components/schemas/parent_id' },
			dependencies: { $ref: '#/components/schemas/dependencies' },
			entity_tags: {
				description: 'List of tags to be associated with the task.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: { description: 'Name of the tag.', type: 'string' },
						color: { description: 'Color code of the tag.', type: 'string' },
					},
				},
			},
		},
	},
	'update-a-task-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			task: {
				type: 'object',
				properties: {
					task_id: { $ref: '#/components/schemas/task_id' },
					recurring_task_id: { $ref: '#/components/schemas/recurring_task_id' },
					owner_id: { $ref: '#/components/schemas/owner_id' },
					owner_ids: { $ref: '#/components/schemas/owner_ids' },
					owner_name: { $ref: '#/components/schemas/owner_name' },
					owners: { $ref: '#/components/schemas/owners' },
					title: { $ref: '#/components/schemas/title' },
					due_date: { $ref: '#/components/schemas/due_date' },
					due_date_formatted: {
						$ref: '#/components/schemas/due_date_formatted',
					},
					is_overdue: { $ref: '#/components/schemas/is_overdue' },
					contact_type: { $ref: '#/components/schemas/contact_type' },
					contact_id: { $ref: '#/components/schemas/contact_id' },
					color_code: { $ref: '#/components/schemas/color_code' },
					contact_name: { $ref: '#/components/schemas/contact_name' },
					parent_task_id: { $ref: '#/components/schemas/parent_task_id' },
					related_entity_id: { $ref: '#/components/schemas/related_entity_id' },
					related_entity_type: {
						$ref: '#/components/schemas/related_entity_type',
					},
					related_entity: { $ref: '#/components/schemas/related_entity' },
					related_entity_value: {
						$ref: '#/components/schemas/related_entity_value',
					},
					parent_status: { $ref: '#/components/schemas/parent_status' },
					status: { $ref: '#/components/schemas/status' },
					custom_status_id: { $ref: '#/components/schemas/custom_status_id' },
					billing_type: { $ref: '#/components/schemas/billing_type' },
					is_billable: { $ref: '#/components/schemas/is_billable' },
					task_rate: { $ref: '#/components/schemas/task_rate' },
					completion_percentage: {
						$ref: '#/components/schemas/completion_percentage',
					},
					is_subtask: { $ref: '#/components/schemas/is_subtask' },
					priority: { $ref: '#/components/schemas/priority' },
					reminder: { $ref: '#/components/schemas/reminder' },
					task_description: { $ref: '#/components/schemas/task_description' },
					is_accountant_task: {
						$ref: '#/components/schemas/is_accountant_task',
					},
					task_number: { $ref: '#/components/schemas/task_number' },
					task_number_prefix: {
						$ref: '#/components/schemas/task_number_prefix',
					},
					task_number_suffix: {
						$ref: '#/components/schemas/task_number_suffix',
					},
					can_push: { $ref: '#/components/schemas/can_push' },
					created_by_id: { $ref: '#/components/schemas/created_by_id' },
					last_modified_by_id: {
						$ref: '#/components/schemas/last_modified_by_id',
					},
					template_id: { $ref: '#/components/schemas/template_id' },
					due_after: { $ref: '#/components/schemas/due_after' },
					parent_task_name: { $ref: '#/components/schemas/parent_task_name' },
					parent_task_number: {
						$ref: '#/components/schemas/parent_task_number',
					},
					created_by_name: { $ref: '#/components/schemas/created_by_name' },
					documents: { $ref: '#/components/schemas/documents' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					statuses: { $ref: '#/components/schemas/statuses' },
					is_system_task: { $ref: '#/components/schemas/is_system_task' },
					system_task_type: { $ref: '#/components/schemas/system_task_type' },
					comments: { $ref: '#/components/schemas/comments' },
					dependencies: { $ref: '#/components/schemas/dependencies' },
					entity_tags: { $ref: '#/components/schemas/entity_tags' },
				},
			},
		},
	},
	'update-percentage-task-request': {
		required: ['completion_percentage'],
		type: 'object',
		properties: {
			completion_percentage: {
				$ref: '#/components/schemas/completion_percentage',
			},
		},
	},
	'update-percentage-task-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			task: {
				type: 'object',
				properties: {
					task_id: { $ref: '#/components/schemas/task_id' },
					recurring_task_id: { $ref: '#/components/schemas/recurring_task_id' },
					owner_id: { $ref: '#/components/schemas/owner_id' },
					owner_ids: { $ref: '#/components/schemas/owner_ids' },
					owner_name: { $ref: '#/components/schemas/owner_name' },
					owners: { $ref: '#/components/schemas/owners' },
					title: { $ref: '#/components/schemas/title' },
					due_date: { $ref: '#/components/schemas/due_date' },
					due_date_formatted: {
						$ref: '#/components/schemas/due_date_formatted',
					},
					is_overdue: { $ref: '#/components/schemas/is_overdue' },
					contact_type: { $ref: '#/components/schemas/contact_type' },
					contact_id: { $ref: '#/components/schemas/contact_id' },
					color_code: { $ref: '#/components/schemas/color_code' },
					contact_name: { $ref: '#/components/schemas/contact_name' },
					parent_task_id: { $ref: '#/components/schemas/parent_task_id' },
					related_entity_id: { $ref: '#/components/schemas/related_entity_id' },
					related_entity_type: {
						$ref: '#/components/schemas/related_entity_type',
					},
					related_entity: { $ref: '#/components/schemas/related_entity' },
					related_entity_value: {
						$ref: '#/components/schemas/related_entity_value',
					},
					parent_status: { $ref: '#/components/schemas/parent_status' },
					status: { $ref: '#/components/schemas/status' },
					custom_status_id: { $ref: '#/components/schemas/custom_status_id' },
					billing_type: { $ref: '#/components/schemas/billing_type' },
					is_billable: { $ref: '#/components/schemas/is_billable' },
					task_rate: { $ref: '#/components/schemas/task_rate' },
					completion_percentage: {
						$ref: '#/components/schemas/completion_percentage',
					},
					is_subtask: { $ref: '#/components/schemas/is_subtask' },
					priority: { $ref: '#/components/schemas/priority' },
					reminder: { $ref: '#/components/schemas/reminder' },
					task_description: { $ref: '#/components/schemas/task_description' },
					is_accountant_task: {
						$ref: '#/components/schemas/is_accountant_task',
					},
					task_number: { $ref: '#/components/schemas/task_number' },
					task_number_prefix: {
						$ref: '#/components/schemas/task_number_prefix',
					},
					task_number_suffix: {
						$ref: '#/components/schemas/task_number_suffix',
					},
					can_push: { $ref: '#/components/schemas/can_push' },
					created_by_id: { $ref: '#/components/schemas/created_by_id' },
					last_modified_by_id: {
						$ref: '#/components/schemas/last_modified_by_id',
					},
					template_id: { $ref: '#/components/schemas/template_id' },
					due_after: { $ref: '#/components/schemas/due_after' },
					parent_task_name: { $ref: '#/components/schemas/parent_task_name' },
					parent_task_number: {
						$ref: '#/components/schemas/parent_task_number',
					},
					created_by_name: { $ref: '#/components/schemas/created_by_name' },
					documents: { $ref: '#/components/schemas/documents' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					statuses: { $ref: '#/components/schemas/statuses' },
					is_system_task: { $ref: '#/components/schemas/is_system_task' },
					system_task_type: { $ref: '#/components/schemas/system_task_type' },
					comments: { $ref: '#/components/schemas/comments' },
					dependencies: { $ref: '#/components/schemas/dependencies' },
					entity_tags: { $ref: '#/components/schemas/entity_tags' },
				},
			},
		},
	},
	'update-tasks-request': {
		type: 'array',
		description: 'List of tasks to be updated.',
		items: {
			type: 'object',
			properties: {
				task_id: { $ref: '#/components/schemas/task_id' },
				owner_ids: { $ref: '#/components/schemas/owner_ids' },
				owner_id: { $ref: '#/components/schemas/owner_id' },
				task_type: { $ref: '#/components/schemas/task_type' },
				title: { $ref: '#/components/schemas/title' },
				due_date: { $ref: '#/components/schemas/due_date' },
				contact_type: { $ref: '#/components/schemas/contact_type' },
				contact_id: { $ref: '#/components/schemas/contact_id' },
				can_push: { $ref: '#/components/schemas/can_push' },
				related_entity_type: {
					$ref: '#/components/schemas/related_entity_type',
				},
				related_entity_id: { $ref: '#/components/schemas/related_entity_id' },
				related_sub_entity_type: {
					$ref: '#/components/schemas/related_sub_entity_type',
				},
				related_sub_entity_id: {
					$ref: '#/components/schemas/related_sub_entity_id',
				},
				status: { $ref: '#/components/schemas/status' },
				billing_type: { $ref: '#/components/schemas/billing_type' },
				is_billable: { $ref: '#/components/schemas/is_billable' },
				task_rate: { $ref: '#/components/schemas/task_rate' },
				completion_percentage: {
					$ref: '#/components/schemas/completion_percentage',
				},
				priority: { $ref: '#/components/schemas/priority' },
				send_email_notification: {
					$ref: '#/components/schemas/send_email_notification',
				},
				mail_id: { $ref: '#/components/schemas/mail_id' },
				email_account_type: { $ref: '#/components/schemas/email_account_type' },
				email_folder_id: { $ref: '#/components/schemas/email_folder_id' },
				email_account_id: { $ref: '#/components/schemas/email_account_id' },
				mail_attachments: { $ref: '#/components/schemas/mail_attachments' },
				reminder: { $ref: '#/components/schemas/reminder' },
				task_description: { $ref: '#/components/schemas/task_description' },
				custom_fields: {
					type: 'array',
					description: 'List of custom fields associated with the task',
					items: {
						type: 'object',
						properties: {
							customfield_id: {
								description: 'ID of the custom field.',
								type: 'string',
							},
							index: {
								description: 'Index of the custom field.',
								type: 'integer',
							},
							label: {
								description: 'Label of the custom field.',
								type: 'string',
							},
							value: {
								description: 'Value of the custom field.',
								type: 'string',
							},
							value_formatted: {
								description: 'Formatted value of the custom field.',
								type: 'string',
							},
							api_name: {
								description: 'Name of the custom field.',
								type: 'string',
							},
						},
					},
				},
				due_after: { $ref: '#/components/schemas/due_after' },
				template_id: { $ref: '#/components/schemas/template_id' },
				task_number: { $ref: '#/components/schemas/task_number' },
				task_number_prefix: { $ref: '#/components/schemas/task_number_prefix' },
				task_number_suffix: { $ref: '#/components/schemas/task_number_suffix' },
				recurring_task_id: { $ref: '#/components/schemas/recurring_task_id' },
				is_sub_task: { $ref: '#/components/schemas/is_sub_task' },
				parent_id: { $ref: '#/components/schemas/parent_id' },
				dependencies: { $ref: '#/components/schemas/dependencies' },
				entity_tags: {
					description: 'List of tags to be associated with the task.',
					type: 'array',
					items: {
						type: 'object',
						properties: {
							name: { description: 'Name of the tag.', type: 'string' },
							color: { description: 'Color code of the tag.', type: 'string' },
						},
					},
				},
			},
		},
	},
	'update-tasks-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tasks: {
				type: 'array',
				description: 'List of tasks updated.',
				items: {
					type: 'object',
					properties: {
						task_id: { $ref: '#/components/schemas/task_id' },
						recurring_task_id: {
							$ref: '#/components/schemas/recurring_task_id',
						},
						owner_id: { $ref: '#/components/schemas/owner_id' },
						owner_ids: { $ref: '#/components/schemas/owner_ids' },
						owner_name: { $ref: '#/components/schemas/owner_name' },
						owners: { $ref: '#/components/schemas/owners' },
						title: { $ref: '#/components/schemas/title' },
						due_date: { $ref: '#/components/schemas/due_date' },
						due_date_formatted: {
							$ref: '#/components/schemas/due_date_formatted',
						},
						is_overdue: { $ref: '#/components/schemas/is_overdue' },
						contact_type: { $ref: '#/components/schemas/contact_type' },
						contact_id: { $ref: '#/components/schemas/contact_id' },
						color_code: { $ref: '#/components/schemas/color_code' },
						contact_name: { $ref: '#/components/schemas/contact_name' },
						parent_task_id: { $ref: '#/components/schemas/parent_task_id' },
						related_entity_id: {
							$ref: '#/components/schemas/related_entity_id',
						},
						related_entity_type: {
							$ref: '#/components/schemas/related_entity_type',
						},
						related_entity: { $ref: '#/components/schemas/related_entity' },
						related_entity_value: {
							$ref: '#/components/schemas/related_entity_value',
						},
						parent_status: { $ref: '#/components/schemas/parent_status' },
						status: { $ref: '#/components/schemas/status' },
						custom_status_id: { $ref: '#/components/schemas/custom_status_id' },
						billing_type: { $ref: '#/components/schemas/billing_type' },
						is_billable: { $ref: '#/components/schemas/is_billable' },
						task_rate: { $ref: '#/components/schemas/task_rate' },
						completion_percentage: {
							$ref: '#/components/schemas/completion_percentage',
						},
						is_subtask: { $ref: '#/components/schemas/is_subtask' },
						priority: { $ref: '#/components/schemas/priority' },
						reminder: { $ref: '#/components/schemas/reminder' },
						task_description: { $ref: '#/components/schemas/task_description' },
						is_accountant_task: {
							$ref: '#/components/schemas/is_accountant_task',
						},
						task_number: { $ref: '#/components/schemas/task_number' },
						task_number_prefix: {
							$ref: '#/components/schemas/task_number_prefix',
						},
						task_number_suffix: {
							$ref: '#/components/schemas/task_number_suffix',
						},
						can_push: { $ref: '#/components/schemas/can_push' },
						created_by_id: { $ref: '#/components/schemas/created_by_id' },
						last_modified_by_id: {
							$ref: '#/components/schemas/last_modified_by_id',
						},
						template_id: { $ref: '#/components/schemas/template_id' },
						due_after: { $ref: '#/components/schemas/due_after' },
						parent_task_name: { $ref: '#/components/schemas/parent_task_name' },
						parent_task_number: {
							$ref: '#/components/schemas/parent_task_number',
						},
						created_by_name: { $ref: '#/components/schemas/created_by_name' },
						documents: { $ref: '#/components/schemas/documents' },
						custom_fields: { $ref: '#/components/schemas/custom_fields' },
						statuses: { $ref: '#/components/schemas/statuses' },
						is_system_task: { $ref: '#/components/schemas/is_system_task' },
						system_task_type: { $ref: '#/components/schemas/system_task_type' },
						comments: { $ref: '#/components/schemas/comments' },
						dependencies: { $ref: '#/components/schemas/dependencies' },
						entity_tags: { $ref: '#/components/schemas/entity_tags' },
					},
				},
			},
		},
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'add_task',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'addTask',
		method: 'POST',
		path: '/tasks',
		summary: 'Add a task',
		description: 'Add a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
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
			schema: { $ref: '#/components/schemas/add-a-task-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-a-task-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_tasks',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'listTasks',
		method: 'GET',
		path: '/tasks',
		summary: 'List tasks',
		description: 'List a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'entity_id',
				in: 'query',
				required: false,
				description: 'Search tasks by entity ID.',
				schema: { type: 'string' },
			},
			{
				name: 'sub_entity_id',
				in: 'query',
				required: false,
				description: 'Search tasks by sub entity ID.',
				schema: { type: 'string' },
			},
			{
				name: 'owner_id',
				in: 'query',
				required: false,
				description: 'Search tasks by owner ID.',
				schema: { type: 'string' },
			},
			{
				name: 'contact_id',
				in: 'query',
				required: false,
				description: 'Search tasks by contact ID.',
				schema: { type: 'string' },
			},
			{
				name: 'client_id',
				in: 'query',
				required: false,
				description: 'Search tasks by client ID.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search tasks by status. Allowed values are <code>open</code>, <code>ongoing</code>, <code>yet_to_started</code>, <code>in_progress</code>, <code>completed</code>, <code>deferred</code>, <code>waiting_for_input</code> and <code>any custom status</code>',
				schema: { type: 'string' },
			},
			{
				name: 'parent_status',
				in: 'query',
				required: false,
				description:
					'Search tasks by parent status. Allowed formats are <code>parent_status</code>, <code>parent_status_equal</code> and <code>parent_status_not_equal</code>. Allowed values are <code>open</code>, <code>ongoing</code> and <code>completed</code>',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description: 'Search tasks based on a search text.',
				schema: { type: 'string' },
			},
			{
				name: 'priority',
				in: 'query',
				required: false,
				description:
					'Search tasks by priority of the task. Allowed values are <code>normal</code>, <code>low</code>, <code>high</code>, <code>lowest</code> and <code>highest</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'entity_type',
				in: 'query',
				required: false,
				description: 'Search tasks by entity type.',
				schema: { type: 'string' },
			},
			{
				name: 'title',
				in: 'query',
				required: false,
				description: 'Search tasks by their title.',
				schema: { type: 'string' },
			},
			{
				name: 'task_description',
				in: 'query',
				required: false,
				description: 'Search tasks their description.',
				schema: { type: 'string' },
			},
			{
				name: 'is_overdue',
				in: 'query',
				required: false,
				description: 'Filter overdue tasks.',
				schema: { type: 'string' },
			},
			{
				name: 'created_by',
				in: 'query',
				required: false,
				description: 'Search tasks by the person who created them.',
				schema: { type: 'string' },
			},
			{
				name: 'is_accountant_task',
				in: 'query',
				required: false,
				description: 'Filter accountant tasks.',
				schema: { type: 'string' },
			},
			{
				name: 'contact_ids',
				in: 'query',
				required: false,
				description: 'Search tasks by contact IDs separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'client_ids',
				in: 'query',
				required: false,
				description: 'Search tasks by client IDs separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'owner_ids',
				in: 'query',
				required: false,
				description: 'Search tasks by owner IDs separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'date_start',
				in: 'query',
				required: false,
				description: 'Search tasks by start date.',
				schema: { type: 'string' },
			},
			{
				name: 'date_end',
				in: 'query',
				required: false,
				description: 'Search tasks by end date.',
				schema: { type: 'string' },
			},
			{
				name: 'task_number',
				in: 'query',
				required: false,
				description: 'Search tasks by task number.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort tasks. Allowed values are <code>owner_name</code>, <code>contact_name</code>, <code>client_name</code>, <code>due_date</code>, <code>title</code>, <code>created_time</code>, <code>completion_percentage</code> and <code>task_number</code>',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter tasks by status. Allowed values are <code>TaskStatus.All</code>, <code>TaskStatus.Overdue</code>, <code>TaskStatus.InProgress</code>, <code>TaskStatus.Completed</code>, <code>TaskStatus.YetToStarted</code>, <code>TaskStatus.MyPending</code>, <code>TaskStatus.DueToday</code>, <code>TaskStatus.PriorityOverdue</code> and <code>TaskStatus.Unassigned</code> ',
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
				schema: { $ref: '#/components/schemas/list-tasks-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_tasks',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'updateTasks',
		method: 'PUT',
		path: '/tasks',
		summary: 'Update tasks',
		description: 'Update tasks.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'bulk_update',
				in: 'query',
				required: true,
				description:
					'Indicate whether the request is for bulk update. Allowed values are <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-tasks-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-tasks-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_tasks',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'deleteTasks',
		method: 'DELETE',
		path: '/tasks',
		summary: 'Delete tasks',
		description: 'Delete tasks.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'task_ids',
				in: 'query',
				required: true,
				description: 'Comma separated list of task IDs to be deleted.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-tasks-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_task',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'getTask',
		method: 'GET',
		path: '/tasks/{task_id}',
		summary: 'Get a task',
		description: 'Get a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
				schema: { $ref: '#/components/schemas/get-a-task-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_a_task',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'updateATask',
		method: 'PUT',
		path: '/tasks/{task_id}',
		summary: 'Update a tasks',
		description: 'Update a tasks.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
			schema: { $ref: '#/components/schemas/update-a-task-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-task-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_task',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'deleteTask',
		method: 'DELETE',
		path: '/tasks/{task_id}',
		summary: 'Delete a tasks',
		description: 'Delete a tasks.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
				schema: { $ref: '#/components/schemas/delete-a-task-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_percentage_task',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'updatePercentageTask',
		method: 'POST',
		path: '/tasks/{task_id}/percentage',
		summary: 'Update completed percentage',
		description: 'Update completed percentage of a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
			schema: { $ref: '#/components/schemas/update-percentage-task-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-percentage-task-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_task_as_open',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'markTaskAsOpen',
		method: 'POST',
		path: '/tasks/{task_id}/markasopen',
		summary: 'Mark task as open',
		description: 'Mark a task as open.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
				schema: { $ref: '#/components/schemas/mark-open-task-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_task_as_ongoing',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'markTaskAsOngoing',
		method: 'POST',
		path: '/tasks/{task_id}/markasongoing',
		summary: 'Mark task as ongoing',
		description: 'Mark a task as ongoing.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
				schema: { $ref: '#/components/schemas/mark-ongoing-task-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_task_as_completed',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'markTaskAsCompleted',
		method: 'POST',
		path: '/tasks/{task_id}/markascompleted',
		summary: 'Mark task as completed',
		description: 'Mark a task as completed.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
				schema: { $ref: '#/components/schemas/mark-completed-task-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'add_task_comment',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'addTaskComment',
		method: 'POST',
		path: '/tasks/{task_id}/comments',
		summary: 'Add comment to task',
		description: 'Add comment to a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
			schema: { $ref: '#/components/schemas/add-task-comment-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-task-comment-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_task_comments',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'listTaskComments',
		method: 'GET',
		path: '/tasks/{task_id}/comments',
		summary: 'List comments of task',
		description: 'List comments of a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
				schema: { $ref: '#/components/schemas/list-task-comments-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_task_comment',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'deleteTaskComment',
		method: 'DELETE',
		path: '/tasks/{task_id}/comments/{comment_id}',
		summary: 'Delete comment of task',
		description: 'Delete a comment of a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
				schema: { type: 'string' },
			},
			{
				name: 'comment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the comment associated with the task.',
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
				schema: { $ref: '#/components/schemas/delete-task-comment-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'add_task_attachment',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'addTaskAttachment',
		method: 'POST',
		path: '/tasks/{task_id}/attachment',
		summary: 'Add attachment to task',
		description: 'Add attachment to a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
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
				name: 'attachment',
				in: 'query',
				required: false,
				description:
					'The file to be attached.Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code>, <code>pdf</code>, <code>xls</code>, <code>xlsx</code>, <code>doc</code>, <code>docx</code>, <code>xml</code>, <code>csv</code>, <code>txt</code>, <code>tif</code> and <code>tiff</code>',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-task-attachment-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_task_document',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'getTaskDocument',
		method: 'GET',
		path: '/tasks/{task_id}/documents/{document_id}',
		summary: 'Get document of task',
		description: 'Get a document of a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the document attached to the task.',
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
				name: 'image_size',
				in: 'query',
				required: false,
				description:
					'Size of the image to be fetched. Allowed values are <code>xlarge</code>, <code>large</code>, <code>small</code> and <code>tiny</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'inline',
				in: 'query',
				required: false,
				description:
					'Indicate whether the document should be displayed inline. Allowed values are <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
			{
				name: 'print',
				in: 'query',
				required: false,
				description:
					'Indicates whether the document should be printed. Allowed values are <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-task-document-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_task_document',
		group: 'tasks',
		groupSlug: 'tasks',
		name: 'deleteTaskDocument',
		method: 'DELETE',
		path: '/tasks/{task_id}/documents/{document_id}',
		summary: 'Delete document of task',
		description: 'Delete a document of a task.',
		docsUrl: 'https://www.zoho.com/books/api/v3/tasks/',
		parameters: [
			{
				name: 'task_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the task.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the document attached to the task.',
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
				name: 'un_associate',
				in: 'query',
				required: false,
				description:
					'Indicates whether the document should be unassociated from the task. Allowed values are <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-task-document-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
