import { z } from 'zod';
import { CapitalAssetWrite } from './capital-asset';
import { lazyModule } from './lazy-module';
import { defineOperation } from './operation';

// Schemas and handlers are built the first time one of these operations runs.
function build() {
	// Banking response fields are conditional on account type, explanation type, permissions, and the 2026 attachment API version.
	const PageQuery = z
		.object({
			page: z.number().int().positive().optional(),
			per_page: z.number().int().min(1).max(100).optional(),
		})
		.strict();
	const Pagination = z.object({
		link: z.string().nullable(),
		total_count: z.string().regex(/^\d+$/).nullable(),
	});
	// Updates and status changes answer with the changed record; deletes answer with no body.
	const EmptyResponse = z.union([z.object({}).passthrough(), z.undefined()]);
	const Decimal = z.union([z.string(), z.number()]);

	// FreeAgent documents these response objects as evolving resource records; known fields are checked while future provider fields remain intact.
	const Attachment = z
		.object({
			url: z.string().url(),
			content_src: z.string().url().optional(),
			content_src_medium: z.string().url().optional(),
			content_src_small: z.string().url().optional(),
			expires_at: z.string().optional(),
			content_type: z.string().optional(),
			file_name: z.string().optional(),
			file_size: z.number().int().nonnegative().optional(),
			description: z.string().optional(),
		})
		.passthrough();
	const TrackingGroupAssignment = z
		.object({
			url: z.string().url(),
			name: z.string(),
			status: z.enum(['active', 'hidden']),
			labels: z.array(
				z
					.object({
						url: z.string().url(),
						name: z.string(),
						status: z.enum(['active', 'hidden']),
					})
					.strict(),
			),
		})
		.strict();

	// Bank-account fields vary by account type, so the documented variants coexist in this response schema.
	const BankAccount = z
		.object({
			url: z.string().url().optional(),
			type: z.string().optional(),
			name: z.string().optional(),
			currency: z.string().optional(),
			is_personal: z.boolean().optional(),
			is_primary: z.boolean().optional(),
			status: z.string().optional(),
			bank_name: z.string().nullable().optional(),
			opening_balance: Decimal.optional(),
			bank_code: z.string().optional(),
			current_balance: Decimal.optional(),
			latest_activity_date: z.string().date().nullable().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			bank_guess_enabled: z.boolean().optional(),
			account_number: z.string().optional(),
			sort_code: z.string().optional(),
			secondary_sort_code: z.string().optional(),
			iban: z.string().optional(),
			bic: z.string().optional(),
			email: z.string().optional(),
		})
		.passthrough();
	const BankAccountInput = z
		.object({
			type: z
				.enum(['StandardBankAccount', 'CreditCardAccount', 'EcommerceAccount'])
				.optional(),
			name: z.string().min(1).optional(),
			currency: z.string().optional(),
			is_personal: z.boolean().optional(),
			opening_balance: Decimal.optional(),
			bank_name: z.string().optional(),
			bank_code: z.string().optional(),
			account_number: z.string().optional(),
			sort_code: z.string().optional(),
			secondary_sort_code: z.string().optional(),
			iban: z.string().optional(),
			bic: z.string().optional(),
			email: z.string().email().optional(),
		})
		.strict();

	// Bank-feed fields differ by API versus Open Banking feed type, as documented.
	const BankFeed = z
		.object({
			url: z.string().url().optional(),
			bank_account: z.string().url().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			last_fetched_at: z.string().nullable().optional(),
			status: z.string().optional(),
			// Bank feed reads document `state` ("enabled").
			state: z.string().optional(),
		})
		.passthrough();

	// Explanation attributes are conditional on transaction type, company type and API version.
	const BankTransactionExplanation = z
		.object({
			url: z.string().url().optional(),
			bank_account: z.string().url().optional(),
			bank_transaction: z.string().url().optional(),
			type: z.string().optional(),
			ec_status: z.string().optional(),
			place_of_supply: z.string().optional(),
			dated_on: z.string().date().optional(),
			gross_value: Decimal.optional(),
			sales_tax_rate: Decimal.optional(),
			second_sales_tax_rate: Decimal.optional(),
			sales_tax_value: Decimal.optional(),
			second_sales_tax_value: Decimal.optional(),
			sales_tax_status: z.string().optional(),
			second_sales_tax_status: z.string().optional(),
			description: z.string().optional(),
			category: z.string().url().optional(),
			cheque_number: z.string().optional(),
			attachments: z.array(z.object({ url: z.string().url() })).optional(),
			attachment: Attachment.optional(),
			marked_for_review: z.boolean().optional(),
			is_money_in: z.boolean().optional(),
			is_money_out: z.boolean().optional(),
			is_money_paid_to_user: z.boolean().optional(),
			is_locked: z.boolean().optional(),
			locked_attributes: z.array(z.string()).optional(),
			locked_reason: z.string().optional(),
			is_deletable: z.boolean().optional(),
			project: z.string().url().optional(),
			rebill_type: z.enum(['cost', 'markup', 'price']).optional(),
			rebill_factor: Decimal.optional(),
			receipt_reference: z.string().optional(),
			paid_invoice: z.string().url().optional(),
			paid_bill: z.string().url().optional(),
			paid_user: z.string().url().optional(),
			transfer_bank_account: z.string().url().optional(),
			stock_item: z.string().url().optional(),
			stock_altering_quantity: Decimal.optional(),
			capital_asset: z.string().url().optional(),
			asset_life_years: Decimal.optional(),
			disposed_asset: z.string().url().optional(),
			property: z.string().url().optional(),
			direct_contact: z.string().url().optional(),
			tracking_groups: z.array(TrackingGroupAssignment).optional(),
		})
		.passthrough();
	const BankTransactionExplanationOutput = z
		.object({ bank_transaction_explanation: BankTransactionExplanation })
		.passthrough();
	// The provider adds nested explanations and versioned attachment fields to transaction responses.
	const BankTransaction = z
		.object({
			url: z.string().url().optional(),
			amount: Decimal.optional(),
			bank_account: z.string().url().optional(),
			dated_on: z.string().date().optional(),
			description: z.string().optional(),
			full_description: z.string().optional(),
			uploaded_at: z.string().optional(),
			unexplained_amount: Decimal.optional(),
			is_manual: z.boolean().optional(),
			transaction_id: z.string().nullable().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			matching_transactions_count: z.number().int().optional(),
			bank_transaction_explanations: z
				.array(BankTransactionExplanation)
				.optional(),
			attachments: z.array(Attachment).optional(),
			attachment: Attachment.optional(),
		})
		.passthrough();

	const BankAccountListInput = z
		.object({
			query: PageQuery.extend({
				view: z
					.enum([
						'standard_bank_accounts',
						'credit_card_accounts',
						'paypal_accounts',
					])
					.optional(),
			}).optional(),
		})
		.strict();
	const BankAccountListData = z
		.object({ bank_accounts: z.array(BankAccount) })
		// Collection envelopes can acquire provider-defined metadata alongside the documented fields.
		.passthrough();
	const BankAccountListOutput = BankAccountListData.extend({
		pagination: Pagination,
	}).passthrough();

	const BankFeedListInput = z.object({ query: PageQuery.optional() }).strict();
	// Collection envelopes can acquire provider-defined metadata alongside the documented fields.
	const BankFeedListData = z
		.object({ bank_feeds: z.array(BankFeed) })
		.passthrough();
	const BankFeedListOutput = BankFeedListData.extend({
		pagination: Pagination,
	}).passthrough();

	const BankTransactionQuery = PageQuery.extend({
		bank_account: z.string().url(),
		from_date: z.string().date().optional(),
		to_date: z.string().date().optional(),
		updated_since: z.string().datetime({ offset: true }).optional(),
		view: z
			.enum([
				'all',
				'unexplained',
				'explained',
				'manual',
				'imported',
				'marked_for_review',
			])
			.optional(),
		last_uploaded: z.boolean().optional(),
	}).strict();
	const BankTransactionListInput = z
		.object({ query: BankTransactionQuery })
		.strict();
	const BankTransactionListData = z
		.object({ bank_transactions: z.array(BankTransaction) })
		// Collection envelopes can acquire provider-defined metadata alongside the documented fields.
		.passthrough();
	const BankTransactionListOutput = BankTransactionListData.extend({
		pagination: Pagination,
	}).passthrough();

	const ExplanationListInput = z
		.object({
			query: PageQuery.extend({
				bank_account: z.string().url(),
				from_date: z.string().date().optional(),
				to_date: z.string().date().optional(),
				updated_since: z.string().datetime({ offset: true }).optional(),
			}).strict(),
		})
		.strict();
	const ExplanationListData = z
		.object({
			bank_transaction_explanations: z.array(BankTransactionExplanation),
		})
		// Collection envelopes can acquire provider-defined metadata alongside the documented fields.
		.passthrough();
	const ExplanationListOutput = ExplanationListData.extend({
		pagination: Pagination,
	}).passthrough();
	const ExplanationFields = z
		.object({
			capital_asset: CapitalAssetWrite.optional(),
			bank_account: z.string().url().optional(),
			bank_transaction: z.string().url().optional(),
			ec_status: z.string().optional(),
			place_of_supply: z.string().optional(),
			dated_on: z.string().date(),
			gross_value: Decimal,
			sales_tax_rate: Decimal.optional(),
			second_sales_tax_rate: Decimal.optional(),
			sales_tax_value: Decimal.optional(),
			second_sales_tax_value: Decimal.optional(),
			sales_tax_status: z.string().optional(),
			second_sales_tax_status: z.string().optional(),
			description: z.string().optional(),
			category: z.string().url().optional(),
			cheque_number: z.string().optional(),
			project: z.string().url().optional(),
			rebill_type: z.enum(['cost', 'markup', 'price']).optional(),
			rebill_factor: Decimal.optional(),
			receipt_reference: z.string().optional(),
			paid_invoice: z.string().url().optional(),
			paid_bill: z.string().url().optional(),
			paid_user: z.string().url().optional(),
			transfer_bank_account: z.string().url().optional(),
			stock_item: z.string().url().optional(),
			stock_altering_quantity: Decimal.optional(),
			asset_life_years: Decimal.optional(),
			disposed_asset: z.string().url().optional(),
			property: z.string().url().optional(),
			direct_contact: z.string().url().optional(),
			tracking_group_labels: z.array(z.string().url()).optional(),
		})
		.strict();
	const ExplanationInput = ExplanationFields.superRefine((value, context) => {
		if (
			value.bank_account === undefined &&
			value.bank_transaction === undefined
		) {
			context.addIssue({
				code: 'custom',
				message: 'Provide bank_account or bank_transaction',
			});
		}
		if (
			value.bank_account !== undefined &&
			value.bank_transaction !== undefined
		) {
			context.addIssue({
				code: 'custom',
				message: 'Provide only one of bank_account or bank_transaction',
			});
		}
	});
	const ExplanationUpdateInput = ExplanationFields.partial().strict();
	const ExplanationCreateInput = z
		.object({ explanation: ExplanationInput })
		.strict();

	const AttachmentUploadInput = z
		.object({
			data: z
				.string()
				.min(1)
				.regex(/^[A-Za-z0-9+/]*={0,2}$/)
				// Base64 comes in complete 4-character groups ("YQ=" is cut short); a length check avoids a backtracking regex on multi-MB files.
				.refine((value) => value.length % 4 === 0, {
					message: 'Base64 data must be complete 4-character groups',
				}),
			file_name: z.string().min(1),
			content_type: z.string().min(1),
			description: z.string().optional(),
		})
		.strict();
	const AttachmentUpdateInput = z.union([
		AttachmentUploadInput.extend({ url: z.string().url() }).strict(),
		z.object({ url: z.string().url(), _destroy: z.literal('true') }).strict(),
		AttachmentUploadInput,
	]);
	const ExplanationAttachmentsBody = z
		.object({ attachments: z.array(AttachmentUpdateInput).min(1).max(10) })
		.strict();
	const ExplanationAttachmentsData = z
		.object({ attachments: z.array(Attachment) })
		.passthrough();

	const BankAccounts = {
		list: defineOperation(BankAccountListInput, BankAccountListOutput, {
			method: 'GET',
			path: () => '/v2/bank_accounts',
			query: (input) => input.query ?? {},
			paginated: {
				data: BankAccountListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			z.object({ bank_account: BankAccount }).passthrough(),
			{
				method: 'GET',
				path: (input) => `/v2/bank_accounts/${encodeURIComponent(input.id)}`,
			},
		),
		create: defineOperation(
			z
				.object({
					bank_account: BankAccountInput.extend({
						name: z.string().min(1),
						opening_balance: Decimal,
					}),
				})
				.strict(),
			z.object({ bank_account: BankAccount }).passthrough(),
			{
				method: 'POST',
				path: () => '/v2/bank_accounts',
				body: (input) => ({ bank_account: input.bank_account }),
			},
		),
		update: defineOperation(
			z
				.object({ id: z.string().min(1), bank_account: BankAccountInput })
				.strict(),
			EmptyResponse,
			{
				method: 'PUT',
				path: (input) => `/v2/bank_accounts/${encodeURIComponent(input.id)}`,
				body: (input) => ({ bank_account: input.bank_account }),
			},
		),
		delete: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			EmptyResponse,
			{
				method: 'DELETE',
				path: (input) => `/v2/bank_accounts/${encodeURIComponent(input.id)}`,
			},
		),
	};

	const Attachments = {
		get: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			z.object({ attachment: Attachment }).passthrough(),
			{
				method: 'GET',
				path: (input) => `/v2/attachments/${encodeURIComponent(input.id)}`,
			},
		),
		delete: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			EmptyResponse,
			{
				method: 'DELETE',
				path: (input) => `/v2/attachments/${encodeURIComponent(input.id)}`,
			},
		),
	};

	const BankFeeds = {
		list: defineOperation(BankFeedListInput, BankFeedListOutput, {
			method: 'GET',
			path: () => '/v2/bank_feeds',
			query: (input) => input.query ?? {},
			paginated: {
				data: BankFeedListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			z.object({ bank_feed: BankFeed }).passthrough(),
			{
				method: 'GET',
				path: (input) => `/v2/bank_feeds/${encodeURIComponent(input.id)}`,
			},
		),
	};

	const BankTransactions = {
		list: defineOperation(BankTransactionListInput, BankTransactionListOutput, {
			method: 'GET',
			path: () => '/v2/bank_transactions',
			query: (input) => input.query,
			paginated: {
				data: BankTransactionListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			z.object({ bank_transaction: BankTransaction }).passthrough(),
			{
				method: 'GET',
				path: (input) =>
					`/v2/bank_transactions/${encodeURIComponent(input.id)}`,
			},
		),
		delete: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			EmptyResponse,
			{
				method: 'DELETE',
				// The docs show /v2/bank_transaction/:id, which answers 404; the plural route deletes (checked on the sandbox).
				path: (input) =>
					`/v2/bank_transactions/${encodeURIComponent(input.id)}`,
			},
		),
		uploadStatement: defineOperation(
			z
				.object({
					bank_account: z.string().url(),
					statement: z
						.array(
							z
								.object({
									dated_on: z.string().date(),
									description: z.string().optional(),
									amount: Decimal.optional(),
									fitid: z.string().nullable().optional(),
									transaction_type: z
										.enum([
											'CREDIT',
											'DEBIT',
											'INT',
											'DIV',
											'FEE',
											'SRVCHG',
											'DEP',
											'ATM',
											'POS',
											'XFER',
											'CHECK',
											'PAYMENT',
											'CASH',
											'DIRECTDEP',
											'DIRECTDEBIT',
											'REPEATPMT',
											'OTHER',
										])
										.optional(),
								})
								.strict(),
						)
						.min(1),
				})
				.strict(),
			EmptyResponse,
			{
				method: 'POST',
				path: () => '/v2/bank_transactions/statement',
				query: (input) => ({ bank_account: input.bank_account }),
				body: (input) => ({ statement: input.statement }),
			},
		),
	};

	const BankTransactionExplanations = {
		list: defineOperation(ExplanationListInput, ExplanationListOutput, {
			method: 'GET',
			path: () => '/v2/bank_transaction_explanations',
			query: (input) => input.query,
			paginated: {
				data: ExplanationListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			BankTransactionExplanationOutput,
			{
				method: 'GET',
				path: (input) =>
					`/v2/bank_transaction_explanations/${encodeURIComponent(input.id)}`,
			},
		),
		create: defineOperation(
			ExplanationCreateInput,
			BankTransactionExplanationOutput,
			{
				method: 'POST',
				path: () => '/v2/bank_transaction_explanations',
				body: (input) => ({ bank_transaction_explanation: input.explanation }),
			},
		),
		update: defineOperation(
			z
				.object({ id: z.string().min(1), explanation: ExplanationUpdateInput })
				.strict(),
			BankTransactionExplanationOutput,
			{
				method: 'PUT',
				path: (input) =>
					`/v2/bank_transaction_explanations/${encodeURIComponent(input.id)}`,
				body: (input) => ({ bank_transaction_explanation: input.explanation }),
			},
		),
		delete: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			EmptyResponse,
			{
				method: 'DELETE',
				path: (input) =>
					`/v2/bank_transaction_explanations/${encodeURIComponent(input.id)}`,
			},
		),
		listAttachments: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			ExplanationAttachmentsData,
			{
				method: 'GET',
				path: (input) =>
					`/v2/bank_transaction_explanations/${encodeURIComponent(input.id)}/attachments`,
				apiVersion: '2026-09-01',
			},
		),
		createAttachments: defineOperation(
			z
				.object({
					id: z.string().min(1),
					attachments: z.array(AttachmentUploadInput).min(1).max(10),
				})
				.strict(),
			ExplanationAttachmentsData,
			{
				method: 'POST',
				path: (input) =>
					`/v2/bank_transaction_explanations/${encodeURIComponent(input.id)}/attachments`,
				body: (input) => ({ attachments: input.attachments }),
				apiVersion: '2026-09-01',
			},
		),
		updateAttachments: defineOperation(
			z
				.object({ id: z.string().min(1), ...ExplanationAttachmentsBody.shape })
				.strict(),
			ExplanationAttachmentsData,
			{
				method: 'PUT',
				path: (input) =>
					`/v2/bank_transaction_explanations/${encodeURIComponent(input.id)}/attachments`,
				body: (input) => ({ attachments: input.attachments }),
				apiVersion: '2026-09-01',
			},
		),
		deleteAttachments: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			ExplanationAttachmentsData,
			{
				method: 'DELETE',
				path: (input) =>
					`/v2/bank_transaction_explanations/${encodeURIComponent(input.id)}/attachments`,
				apiVersion: '2026-09-01',
			},
		),
	};

	const BankingEndpoints = {
		attachments: Attachments,
		bankAccounts: BankAccounts,
		bankFeeds: BankFeeds,
		bankTransactions: BankTransactions,
		bankTransactionExplanations: BankTransactionExplanations,
	} as const;

	const BankingEndpointSchemas = {
		'attachments.get': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: z.object({ attachment: Attachment }).passthrough(),
		},
		'attachments.delete': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: EmptyResponse,
		},
		'bankAccounts.list': {
			input: BankAccountListInput,
			output: BankAccountListOutput,
		},
		'bankAccounts.get': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: z.object({ bank_account: BankAccount }).passthrough(),
		},
		'bankAccounts.create': {
			input: z
				.object({
					bank_account: BankAccountInput.extend({
						name: z.string().min(1),
						opening_balance: Decimal,
					}),
				})
				.strict(),
			output: z.object({ bank_account: BankAccount }).passthrough(),
		},
		'bankAccounts.update': {
			input: z
				.object({ id: z.string().min(1), bank_account: BankAccountInput })
				.strict(),
			output: EmptyResponse,
		},
		'bankAccounts.delete': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: EmptyResponse,
		},
		'bankFeeds.list': { input: BankFeedListInput, output: BankFeedListOutput },
		'bankFeeds.get': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: z.object({ bank_feed: BankFeed }).passthrough(),
		},
		'bankTransactions.list': {
			input: BankTransactionListInput,
			output: BankTransactionListOutput,
		},
		'bankTransactions.get': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: z.object({ bank_transaction: BankTransaction }).passthrough(),
		},
		'bankTransactions.delete': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: EmptyResponse,
		},
		'bankTransactions.uploadStatement': {
			input: z
				.object({
					bank_account: z.string().url(),
					statement: z
						.array(
							z
								.object({
									dated_on: z.string().date(),
									description: z.string().optional(),
									amount: Decimal.optional(),
									fitid: z.string().nullable().optional(),
									transaction_type: z
										.enum([
											'CREDIT',
											'DEBIT',
											'INT',
											'DIV',
											'FEE',
											'SRVCHG',
											'DEP',
											'ATM',
											'POS',
											'XFER',
											'CHECK',
											'PAYMENT',
											'CASH',
											'DIRECTDEP',
											'DIRECTDEBIT',
											'REPEATPMT',
											'OTHER',
										])
										.optional(),
								})
								.strict(),
						)
						.min(1),
				})
				.strict(),
			output: EmptyResponse,
		},
		'bankTransactionExplanations.list': {
			input: ExplanationListInput,
			output: ExplanationListOutput,
		},
		'bankTransactionExplanations.get': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: BankTransactionExplanationOutput,
		},
		'bankTransactionExplanations.create': {
			input: ExplanationCreateInput,
			output: BankTransactionExplanationOutput,
		},
		'bankTransactionExplanations.update': {
			input: z
				.object({ id: z.string().min(1), explanation: ExplanationUpdateInput })
				.strict(),
			output: BankTransactionExplanationOutput,
		},
		'bankTransactionExplanations.delete': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: EmptyResponse,
		},
		'bankTransactionExplanations.listAttachments': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: ExplanationAttachmentsData,
		},
		'bankTransactionExplanations.createAttachments': {
			input: z
				.object({
					id: z.string().min(1),
					attachments: z.array(AttachmentUploadInput).min(1).max(10),
				})
				.strict(),
			output: ExplanationAttachmentsData,
		},
		'bankTransactionExplanations.updateAttachments': {
			input: z
				.object({ id: z.string().min(1), ...ExplanationAttachmentsBody.shape })
				.strict(),
			output: ExplanationAttachmentsData,
		},
		'bankTransactionExplanations.deleteAttachments': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: ExplanationAttachmentsData,
		},
	} as const;
	return { BankingEndpoints, BankingEndpointSchemas };
}

export const BankingEndpointMeta = {
	'attachments.get': {
		riskLevel: 'read',
		description: 'Get attachment metadata and temporary content URLs',
	},
	'attachments.delete': {
		riskLevel: 'destructive',
		description: 'Delete an attachment',
	},
	'bankAccounts.list': {
		riskLevel: 'read',
		description: 'List company bank accounts with pagination',
	},
	'bankAccounts.get': { riskLevel: 'read', description: 'Get a bank account' },
	'bankAccounts.create': {
		riskLevel: 'write',
		description: 'Create a bank account',
	},
	'bankAccounts.update': {
		riskLevel: 'write',
		description: 'Update a bank account',
	},
	'bankAccounts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a bank account',
	},
	'bankFeeds.list': {
		riskLevel: 'read',
		description: 'List bank feeds with pagination',
	},
	'bankFeeds.get': { riskLevel: 'read', description: 'Get a bank feed' },
	'bankTransactions.list': {
		riskLevel: 'read',
		description: 'List bank transactions with filters and pagination',
	},
	'bankTransactions.get': {
		riskLevel: 'read',
		description: 'Get a bank transaction and explanations',
	},
	'bankTransactions.delete': {
		riskLevel: 'destructive',
		description: 'Delete an eligible unexplained bank transaction',
	},
	'bankTransactions.uploadStatement': {
		riskLevel: 'write',
		description: 'Import JSON bank statement transactions',
	},
	'bankTransactionExplanations.list': {
		riskLevel: 'read',
		description: 'List bank transaction explanations with pagination',
	},
	'bankTransactionExplanations.get': {
		riskLevel: 'read',
		description: 'Get a bank transaction explanation',
	},
	'bankTransactionExplanations.create': {
		riskLevel: 'write',
		description: 'Create a bank transaction explanation',
	},
	'bankTransactionExplanations.update': {
		riskLevel: 'write',
		description: 'Update a bank transaction explanation',
	},
	'bankTransactionExplanations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a bank transaction explanation',
	},
	'bankTransactionExplanations.listAttachments': {
		riskLevel: 'read',
		description: 'List explanation attachments using API version 2026-09-01',
	},
	'bankTransactionExplanations.createAttachments': {
		riskLevel: 'write',
		description: 'Add up to ten explanation attachments in one call',
	},
	'bankTransactionExplanations.updateAttachments': {
		riskLevel: 'destructive',
		description: 'Update, add, or remove explanation attachments',
	},
	'bankTransactionExplanations.deleteAttachments': {
		riskLevel: 'destructive',
		description: 'Delete all attachments from an explanation',
	},
} as const;

const lazy = lazyModule(build, BankingEndpointMeta);
export const BankingEndpoints = lazy.endpoints(
	(module) => module.BankingEndpoints,
);
export const BankingEndpointSchemas = lazy.schemas(
	(module) => module.BankingEndpointSchemas,
);
