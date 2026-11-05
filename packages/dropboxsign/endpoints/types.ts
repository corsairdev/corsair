import { z } from 'zod';
import {
	DropboxSignAccount,
	DropboxSignApiApp,
	DropboxSignBulkSendJob,
	DropboxSignFax,
	DropboxSignSignatureRequest,
	DropboxSignTeam,
	DropboxSignTemplate,
} from '../schema/database';

const Signer = z
	.object({
		email_address: z.string().optional(),
		name: z.string().optional(),
		role: z.string().optional(),
		order: z.number().optional(),
	})
	.loose();

const Warnings = z
	.object({
		warning_msg: z.string(),
		warning_name: z.string(),
	})
	.loose();

const ListInfo = z
	.object({
		page: z.number().optional(),
		num_pages: z.number().optional(),
		num_results: z.number().optional(),
		page_size: z.number().optional(),
	})
	.loose();

const Envelope = {
	account: z
		.object({
			account: DropboxSignAccount,
			warnings: z.array(Warnings).optional(),
		})
		.loose(),
	signatureRequest: z
		.object({
			signature_request: DropboxSignSignatureRequest,
			warnings: z.array(Warnings).optional(),
		})
		.loose(),
	template: z
		.object({
			template: DropboxSignTemplate,
			warnings: z.array(Warnings).optional(),
		})
		.loose(),
	apiApp: z
		.object({
			api_app: DropboxSignApiApp,
			warnings: z.array(Warnings).optional(),
		})
		.loose(),
	team: z
		.object({ team: DropboxSignTeam, warnings: z.array(Warnings).optional() })
		.loose(),
	fax: z
		.object({ fax: DropboxSignFax, warnings: z.array(Warnings).optional() })
		.loose(),
	bulkSendJob: z
		.object({
			bulk_send_job: DropboxSignBulkSendJob,
			warnings: z.array(Warnings).optional(),
		})
		.loose(),
	loose: z.object({}).loose(),
};

export const DropboxSignEndpointInputSchemas = {
	getAccount: z
		.object({
			account_id: z.string().optional(),
			email_address: z.string().email().optional(),
		})
		.optional(),
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
	listSignatureRequests: z
		.object({
			account_id: z.string().optional(),
			page: z.number().int().positive().optional(),
			page_size: z.number().int().positive().max(100).optional(),
			query: z.string().optional(),
		})
		.optional(),
	sendSignatureRequest: z.object({
		title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		signers: z.array(Signer).optional(),
		files: z.array(z.string()).optional(),
		file_urls: z.array(z.string().url()).optional(),
		test_mode: z.boolean().optional(),
	}),
	createEmbeddedSignatureRequest: z.object({
		client_id: z.string(),
		title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		signers: z.array(Signer).optional(),
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
		signers: z.array(Signer).optional(),
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
		file_type: z.enum(['pdf', 'zip']).optional(),
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
		signers: z.array(Signer).optional(),
		files: z.array(z.string()).optional(),
		file_urls: z.array(z.string().url()).optional(),
	}),
	editAndResendEmbeddedSignatureRequest: z.object({
		signature_request_id: z.string(),
		client_id: z.string().optional(),
		title: z.string().optional(),
		signers: z.array(Signer).optional(),
	}),
	editAndResendEmbeddedSignatureRequestTemplate: z.object({
		signature_request_id: z.string(),
		client_id: z.string().optional(),
		template_ids: z.array(z.string()).optional(),
		signers: z.array(Signer).optional(),
	}),

	getTemplate: z.object({
		template_id: z.string(),
	}),
	listTemplates: z
		.object({
			account_id: z.string().optional(),
			page: z.number().int().positive().optional(),
			page_size: z.number().int().positive().max(100).optional(),
			query: z.string().optional(),
		})
		.optional(),
	createTemplate: z.object({
		title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		signer_roles: z
			.array(
				z.object({ name: z.string(), order: z.number().optional() }).loose(),
			)
			.optional(),
		files: z.array(z.string()).optional(),
		file_urls: z.array(z.string().url()).optional(),
	}),
	createEmbeddedTemplateDraft: z.object({
		client_id: z.string(),
		title: z.string().optional(),
		signer_roles: z
			.array(
				z.object({ name: z.string(), order: z.number().optional() }).loose(),
			)
			.optional(),
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
		file_type: z.enum(['pdf', 'zip']).optional(),
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
		signers: z.array(Signer).optional(),
	}),
	createEmbeddedUnclaimedDraftWithTemplate: z.object({
		client_id: z.string(),
		template_ids: z.array(z.string()),
		signers: z.array(Signer).optional(),
		requester_email_address: z.string().email().optional(),
	}),
	editAndResendUnclaimedDraft: z.object({
		signature_request_id: z.string(),
		client_id: z.string(),
		test_mode: z.boolean().optional(),
	}),

	getEmbeddedSignUrl: z.object({
		signature_id: z.string(),
	}),
	getEmbeddedTemplateEditUrl: z.object({
		template_id: z.string(),
		force_signer_roles: z.boolean().optional(),
		force_subject_message: z.boolean().optional(),
		test_mode: z.boolean().optional(),
	}),

	bulkSendWithTemplate: z.object({
		template_ids: z.array(z.string()),
		signer_list: z.array(z.record(z.string(), z.unknown())).optional(),
		title: z.string().optional(),
	}),
	bulkCreateEmbeddedSigReqWithTemplate: z.object({
		client_id: z.string(),
		template_ids: z.array(z.string()),
		signer_file: z.string().optional(),
		signer_list: z.array(z.record(z.string(), z.unknown())).optional(),
	}),
	getBulkSendJob: z.object({
		bulk_send_job_id: z.string(),
	}),
	listBulkSendJobs: z
		.object({
			page: z.number().int().positive().optional(),
			page_size: z.number().int().positive().max(100).optional(),
		})
		.optional(),

	getTeamInfo: z
		.object({
			team_id: z.string().optional(),
		})
		.optional(),
	getCurrentTeam: z.object({}).optional(),
	listTeams: z
		.object({
			page: z.number().int().positive().optional(),
			page_size: z.number().int().positive().max(100).optional(),
		})
		.optional(),
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
	}),

	getApiApp: z.object({
		client_id: z.string(),
	}),
	listApiApps: z
		.object({
			page: z.number().int().positive().optional(),
			page_size: z.number().int().positive().max(100).optional(),
		})
		.optional(),
	createApiApp: z.object({
		name: z.string(),
		domains: z.array(z.string()).optional(),
		callback_url: z.string().url().optional(),
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

	listFaxes: z
		.object({
			page: z.number().int().positive().optional(),
			page_size: z.number().int().positive().max(100).optional(),
		})
		.optional(),
	deleteFax: z.object({
		fax_id: z.string(),
	}),
	listFaxLines: z
		.object({
			page: z.number().int().positive().optional(),
			page_size: z.number().int().positive().max(100).optional(),
		})
		.optional(),
	getFaxLineAreaCodes: z.object({
		country: z.string(),
		state: z.string().optional(),
		city: z.string().optional(),
	}),
	createReport: z.object({
		report_type: z.array(
			z.enum(['user_activity', 'document_status', 'sms_activity', 'fax_usage']),
		),
		start_date: z.string(),
		end_date: z.string(),
	}),
};

export const DropboxSignEndpointOutputSchemas = {
	getAccount: Envelope.account,
	createAccount: Envelope.account,
	updateAccount: Envelope.account,
	verifyAccount: z
		.object({
			account: z.object({ email_address: z.string() }).loose(),
			warnings: z.array(Warnings).optional(),
		})
		.loose(),

	getSignatureRequest: Envelope.signatureRequest,
	listSignatureRequests: z
		.object({
			signature_requests: z.array(DropboxSignSignatureRequest),
			list_info: ListInfo.optional(),
			warnings: z.array(Warnings).optional(),
		})
		.loose(),
	sendSignatureRequest: Envelope.signatureRequest,
	createEmbeddedSignatureRequest: Envelope.signatureRequest,
	createEmbeddedSignatureRequestWithTemplate: Envelope.signatureRequest,
	cancelSignatureRequest: Envelope.loose,
	sendRequestReminder: Envelope.signatureRequest,
	updateSignatureRequest: Envelope.signatureRequest,
	downloadSignatureRequestFiles: Envelope.loose,
	getSignatureRequestFilesAsFileUrl: z
		.object({
			file_url: z.string().optional(),
			expires_at: z.number().optional(),
		})
		.loose(),
	getSignatureRequestFilesAsDataUri: z
		.object({ data_uri: z.string().optional() })
		.loose(),
	releaseSignatureRequestHold: Envelope.signatureRequest,
	editAndResendSignatureRequest: Envelope.signatureRequest,
	editAndResendEmbeddedSignatureRequest: Envelope.signatureRequest,
	editAndResendEmbeddedSignatureRequestTemplate: Envelope.signatureRequest,

	getTemplate: Envelope.template,
	listTemplates: z
		.object({
			templates: z.array(DropboxSignTemplate),
			list_info: ListInfo.optional(),
			warnings: z.array(Warnings).optional(),
		})
		.loose(),
	createTemplate: Envelope.template,
	createEmbeddedTemplateDraft: Envelope.template,
	deleteTemplate: Envelope.loose,
	addUserToTemplate: Envelope.template,
	removeUserFromTemplate: Envelope.template,
	getTemplateFiles: Envelope.loose,
	getTemplateFilesAsFileUrl: z
		.object({
			file_url: z.string().optional(),
			expires_at: z.number().optional(),
		})
		.loose(),
	getTemplateFilesAsDataUri: z
		.object({ data_uri: z.string().optional() })
		.loose(),
	updateTemplateFiles: Envelope.template,

	createUnclaimedDraft: Envelope.loose,
	createEmbeddedUnclaimedDraftWithTemplate: Envelope.loose,
	editAndResendUnclaimedDraft: Envelope.loose,

	getEmbeddedSignUrl: z
		.object({
			embedded: z
				.object({
					sign_url: z.string().optional(),
					expires_at: z.number().optional(),
				})
				.loose(),
		})
		.loose(),
	getEmbeddedTemplateEditUrl: z
		.object({
			embedded: z
				.object({
					edit_url: z.string().optional(),
					expires_at: z.number().optional(),
				})
				.loose(),
		})
		.loose(),

	bulkSendWithTemplate: Envelope.bulkSendJob,
	bulkCreateEmbeddedSigReqWithTemplate: Envelope.bulkSendJob,
	getBulkSendJob: Envelope.bulkSendJob,
	listBulkSendJobs: z
		.object({
			bulk_send_jobs: z.array(DropboxSignBulkSendJob),
			list_info: ListInfo.optional(),
		})
		.loose(),

	getTeamInfo: Envelope.team,
	getCurrentTeam: Envelope.team,
	listTeams: Envelope.team,
	listSubTeams: z
		.object({
			teams: z.array(DropboxSignTeam),
			list_info: ListInfo.optional(),
		})
		.loose(),
	listTeamMembers: z
		.object({
			team_members: z.array(DropboxSignAccount),
			list_info: ListInfo.optional(),
		})
		.loose(),
	addUserToTeam: Envelope.team,

	getApiApp: Envelope.apiApp,
	listApiApps: z
		.object({
			api_apps: z.array(DropboxSignApiApp),
			list_info: ListInfo.optional(),
		})
		.loose(),
	createApiApp: Envelope.apiApp,
	updateApiApp: Envelope.apiApp,
	deleteApiApp: Envelope.loose,
	oAuthAuthorize: z.object({
		url: z.string().url(),
	}),

	listFaxes: z
		.object({
			faxes: z.array(DropboxSignFax),
			list_info: ListInfo.optional(),
		})
		.loose(),
	deleteFax: Envelope.loose,
	listFaxLines: Envelope.loose,
	getFaxLineAreaCodes: Envelope.loose,
	createReport: z
		.object({
			report: z
				.object({
					success: z.string().optional(),
					start_date: z.string().optional(),
					end_date: z.string().optional(),
					report_type: z.array(z.string()).optional(),
				})
				.loose(),
		})
		.loose(),
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
