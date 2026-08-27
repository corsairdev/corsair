import { z } from 'zod';

export const DropboxSignEndpointInputSchemas = {
	getAccount: z.object({
		account_id: z.string().optional(),
		email_address: z.string().email().optional(),
	}).optional(),
	createAccount: z.object({
		email_address: z.string().email(),
		client_id: z.string().optional(),
		client_secret: z.string().optional(),
		locale: z.string().optional(),
	}),
	updateAccount: z.object({
		callback_url: z.string().url().optional(),
		locale: z.string().optional(),
	}),
	verifyAccount: z.object({
		email_address: z.string().email(),
	}),

	getSignatureRequest: z.object({
		signature_request_id: z.string(),
	}),
	listSignatureRequests: z.object({
		account_id: z.string().optional(),
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
		query: z.string().optional(),
	}).optional(),
	sendSignatureRequest: z.object({
		title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		signers: z.array(z.record(z.string(), z.any())).optional(),
		files: z.array(z.string()).optional(),
		file_urls: z.array(z.string().url()).optional(),
		test_mode: z.boolean().optional(),
	}),
	createEmbeddedSignatureRequest: z.object({
		client_id: z.string(),
		title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		signers: z.array(z.record(z.string(), z.any())).optional(),
		files: z.array(z.string()).optional(),
		file_urls: z.array(z.string().url()).optional(),
		test_mode: z.boolean().optional(),
	}),
	createEmbeddedSignatureRequestWithTemplate: z.object({
		client_id: z.string(),
		template_ids: z.array(z.string()),
		title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		signers: z.array(z.record(z.string(), z.any())).optional(),
		test_mode: z.boolean().optional(),
	}),
	cancelSignatureRequest: z.object({
		signature_request_id: z.string(),
	}),
	sendRequestReminder: z.object({
		signature_request_id: z.string(),
		email_address: z.string().email(),
		name: z.string().optional(),
	}),
	updateSignatureRequest: z.object({
		signature_request_id: z.string(),
		signature_id: z.string().optional(),
		email_address: z.string().email().optional(),
		name: z.string().optional(),
	}),
	downloadSignatureRequestFiles: z.object({
		signature_request_id: z.string(),
		get_url: z.boolean().optional(),
		get_data_uri: z.boolean().optional(),
	}),
	getSignatureRequestFilesAsFileUrl: z.object({
		signature_request_id: z.string(),
	}),
	getSignatureRequestFilesAsDataUri: z.object({
		signature_request_id: z.string(),
	}),
	releaseSignatureRequestHold: z.object({
		signature_request_id: z.string(),
	}),
	editAndResendSignatureRequest: z.object({
		signature_request_id: z.string(),
		title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		signers: z.array(z.record(z.string(), z.any())).optional(),
		files: z.array(z.string()).optional(),
		file_urls: z.array(z.string().url()).optional(),
	}),
	editAndResendEmbeddedSignatureRequest: z.object({
		signature_request_id: z.string(),
		client_id: z.string().optional(),
		title: z.string().optional(),
		signers: z.array(z.record(z.string(), z.any())).optional(),
	}),
	editAndResendEmbeddedSignatureRequestTemplate: z.object({
		signature_request_id: z.string(),
		client_id: z.string().optional(),
		template_ids: z.array(z.string()).optional(),
		signers: z.array(z.record(z.string(), z.any())).optional(),
	}),

	getTemplate: z.object({
		template_id: z.string(),
	}),
	listTemplates: z.object({
		account_id: z.string().optional(),
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
		query: z.string().optional(),
	}).optional(),
	createTemplate: z.object({
		title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		signer_roles: z.array(z.record(z.string(), z.any())).optional(),
		files: z.array(z.string()).optional(),
	}),
	createEmbeddedTemplateDraft: z.object({
		client_id: z.string(),
		title: z.string().optional(),
		signer_roles: z.array(z.record(z.string(), z.any())).optional(),
		files: z.array(z.string()).optional(),
		test_mode: z.boolean().optional(),
	}),
	deleteTemplate: z.object({
		template_id: z.string(),
	}),
	addUserToTemplate: z.object({
		template_id: z.string(),
		account_id: z.string().optional(),
		email_address: z.string().email().optional(),
	}),
	removeUserFromTemplate: z.object({
		template_id: z.string(),
		account_id: z.string().optional(),
		email_address: z.string().email().optional(),
	}),
	getTemplateFiles: z.object({
		template_id: z.string(),
		get_url: z.boolean().optional(),
		get_data_uri: z.boolean().optional(),
	}),
	getTemplateFilesAsFileUrl: z.object({
		template_id: z.string(),
	}),
	getTemplateFilesAsDataUri: z.object({
		template_id: z.string(),
	}),
	updateTemplateFiles: z.object({
		template_id: z.string(),
		files: z.array(z.string()).optional(),
		file_urls: z.array(z.string().url()).optional(),
	}),

	createUnclaimedDraft: z.object({
		type: z.enum(['send_document', 'request_signature']).optional(),
		files: z.array(z.string()).optional(),
		file_urls: z.array(z.string().url()).optional(),
		signers: z.array(z.record(z.string(), z.any())).optional(),
	}),
	createEmbeddedUnclaimedDraftWithTemplate: z.object({
		client_id: z.string(),
		template_ids: z.array(z.string()),
		signers: z.array(z.record(z.string(), z.any())).optional(),
		requester_email_address: z.string().email().optional(),
	}),
	editAndResendUnclaimedDraft: z.object({
		signature_request_id: z.string(),
		client_id: z.string().optional(),
		files: z.array(z.string()).optional(),
	}),

	getEmbeddedSignUrl: z.object({
		signature_id: z.string(),
	}),
	getEmbeddedTemplateEditUrl: z.object({
		template_id: z.string(),
		skip_signer_roles: z.boolean().optional(),
		skip_subject_message: z.boolean().optional(),
	}),

	bulkSendWithTemplate: z.object({
		template_ids: z.array(z.string()),
		signer_list: z.array(z.record(z.string(), z.any())).optional(),
		title: z.string().optional(),
	}),
	bulkCreateEmbeddedSigReqWithTemplate: z.object({
		client_id: z.string(),
		template_ids: z.array(z.string()),
		signer_file: z.string().optional(),
		signer_list: z.array(z.record(z.string(), z.any())).optional(),
	}),
	getBulkSendJob: z.object({
		bulk_send_job_id: z.string(),
	}),
	listBulkSendJobs: z.object({
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
	}).optional(),

	getTeamInfo: z.object({
		team_id: z.string().optional(),
	}).optional(),
	getCurrentTeam: z.object({}).optional(),
	listTeams: z.object({
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
	}).optional(),
	listSubTeams: z.object({
		team_id: z.string(),
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
	}),
	listTeamMembers: z.object({
		team_id: z.string(),
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
	}),
	addUserToTeam: z.object({
		account_id: z.string().optional(),
		email_address: z.string().email().optional(),
		role: z.enum(['Admin', 'Member']).optional(),
	}),

	getApiApp: z.object({
		client_id: z.string(),
	}),
	listApiApps: z.object({
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
	}).optional(),
	createApiApp: z.object({
		name: z.string(),
		domains: z.array(z.string()).optional(),
		callback_url: z.string().url().optional(),
		custom_logo_file: z.string().optional(),
		oauth: z.record(z.string(), z.any()).optional(),
		white_labeling_options: z.record(z.string(), z.any()).optional(),
	}),
	updateApiApp: z.object({
		client_id: z.string(),
		name: z.string().optional(),
		domains: z.array(z.string()).optional(),
		callback_url: z.string().url().optional(),
	}),
	deleteApiApp: z.object({
		client_id: z.string(),
	}),
	oAuthAuthorize: z.object({
		client_id: z.string(),
		response_type: z.string().optional().default('code'),
		state: z.string().optional(),
	}),

	listFaxes: z.object({
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
	}).optional(),
	deleteFax: z.object({
		fax_id: z.string(),
	}),
	listFaxLines: z.object({
		page: z.number().int().positive().optional(),
		page_size: z.number().int().positive().max(100).optional(),
	}).optional(),
	getFaxLineAreaCodes: z.object({
		country: z.string(),
		state: z.string().optional(),
		city: z.string().optional(),
	}),
	createReport: z.object({
		report_type: z.array(z.enum(['user_activity', 'document_status', 'sms_activity'])),
		start_date: z.string(),
		end_date: z.string(),
	}),
};

export const DropboxSignEndpointOutputSchemas = {
	getAccount: z.record(z.string(), z.any()),
	createAccount: z.record(z.string(), z.any()),
	updateAccount: z.record(z.string(), z.any()),
	verifyAccount: z.record(z.string(), z.any()),

	getSignatureRequest: z.record(z.string(), z.any()),
	listSignatureRequests: z.record(z.string(), z.any()),
	sendSignatureRequest: z.record(z.string(), z.any()),
	createEmbeddedSignatureRequest: z.record(z.string(), z.any()),
	createEmbeddedSignatureRequestWithTemplate: z.record(z.string(), z.any()),
	cancelSignatureRequest: z.record(z.string(), z.any()),
	sendRequestReminder: z.record(z.string(), z.any()),
	updateSignatureRequest: z.record(z.string(), z.any()),
	downloadSignatureRequestFiles: z.record(z.string(), z.any()),
	getSignatureRequestFilesAsFileUrl: z.record(z.string(), z.any()),
	getSignatureRequestFilesAsDataUri: z.record(z.string(), z.any()),
	releaseSignatureRequestHold: z.record(z.string(), z.any()),
	editAndResendSignatureRequest: z.record(z.string(), z.any()),
	editAndResendEmbeddedSignatureRequest: z.record(z.string(), z.any()),
	editAndResendEmbeddedSignatureRequestTemplate: z.record(z.string(), z.any()),

	getTemplate: z.record(z.string(), z.any()),
	listTemplates: z.record(z.string(), z.any()),
	createTemplate: z.record(z.string(), z.any()),
	createEmbeddedTemplateDraft: z.record(z.string(), z.any()),
	deleteTemplate: z.record(z.string(), z.any()),
	addUserToTemplate: z.record(z.string(), z.any()),
	removeUserFromTemplate: z.record(z.string(), z.any()),
	getTemplateFiles: z.record(z.string(), z.any()),
	getTemplateFilesAsFileUrl: z.record(z.string(), z.any()),
	getTemplateFilesAsDataUri: z.record(z.string(), z.any()),
	updateTemplateFiles: z.record(z.string(), z.any()),

	createUnclaimedDraft: z.record(z.string(), z.any()),
	createEmbeddedUnclaimedDraftWithTemplate: z.record(z.string(), z.any()),
	editAndResendUnclaimedDraft: z.record(z.string(), z.any()),

	getEmbeddedSignUrl: z.record(z.string(), z.any()),
	getEmbeddedTemplateEditUrl: z.record(z.string(), z.any()),

	bulkSendWithTemplate: z.record(z.string(), z.any()),
	bulkCreateEmbeddedSigReqWithTemplate: z.record(z.string(), z.any()),
	getBulkSendJob: z.record(z.string(), z.any()),
	listBulkSendJobs: z.record(z.string(), z.any()),

	getTeamInfo: z.record(z.string(), z.any()),
	getCurrentTeam: z.record(z.string(), z.any()),
	listTeams: z.record(z.string(), z.any()),
	listSubTeams: z.record(z.string(), z.any()),
	listTeamMembers: z.record(z.string(), z.any()),
	addUserToTeam: z.record(z.string(), z.any()),

	getApiApp: z.record(z.string(), z.any()),
	listApiApps: z.record(z.string(), z.any()),
	createApiApp: z.record(z.string(), z.any()),
	updateApiApp: z.record(z.string(), z.any()),
	deleteApiApp: z.record(z.string(), z.any()),
	oAuthAuthorize: z.object({
		url: z.string().url(),
	}),

	listFaxes: z.record(z.string(), z.any()),
	deleteFax: z.record(z.string(), z.any()),
	listFaxLines: z.record(z.string(), z.any()),
	getFaxLineAreaCodes: z.record(z.string(), z.any()),
	createReport: z.record(z.string(), z.any()),
};

export type DropboxSignEndpointInputs = {
	[K in keyof typeof DropboxSignEndpointInputSchemas]: z.infer<
		(typeof DropboxSignEndpointInputSchemas)[K]
	>;
};

export type DropboxSignEndpointOutputs = {
	[K in keyof typeof DropboxSignEndpointOutputSchemas]: z.infer<
		(typeof DropboxSignEndpointOutputSchemas)[K]
	>;
};
