import { z } from 'zod';

// ── Generic Response Envelope ───────────────────────────────────────────────

function createJotformEnvelope<T extends z.ZodTypeAny>(contentSchema: T) {
	// passthrough because provider response envelopes may include extra metadata (duration, info, etc.)
	return z
		.object({
			responseCode: z.number(),
			message: z.string(),
			content: contentSchema,
			duration: z.string().optional(),
			info: z.string().nullish(),
			'limit-left': z.union([z.number(), z.string()]).optional(),
		})
		.passthrough();
}

function createJotformListEnvelope<T extends z.ZodTypeAny>(contentSchema: T) {
	// passthrough because list responses can include additional pagination metadata
	return z
		.object({
			responseCode: z.number(),
			message: z.string(),
			content: contentSchema,
			duration: z.string().optional(),
			info: z.string().nullish(),
			resultSet: z
				.object({
					offset: z.union([z.number(), z.string()]).optional(),
					limit: z.union([z.number(), z.string()]).optional(),
					count: z.union([z.number(), z.string()]).optional(),
					orderby: z.string().optional(),
					// unknown because filter can be an arbitrary JSON object containing user-defined criteria
					filter: z.record(z.string(), z.unknown()).optional(),
				})
				.optional(),
			'limit-left': z.union([z.number(), z.string()]).optional(),
		})
		.passthrough();
}

// ── Common Shared Entity Schemas ────────────────────────────────────────────

export const JotformUserSchema = z
	.object({
		username: z.string(),
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		time_zone: z.string().nullable().optional(),
		account_type: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		is_verified: z.union([z.string(), z.number()]).nullable().optional(),
		usage: z.string().nullable().optional(),
		industry: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		avatarUrl: z.string().nullable().optional(),
	})
	.passthrough(); // passthrough because user profiles contain extensible settings

export const JotformUsageSchema = z
	.object({
		submissions: z.union([z.string(), z.number()]).optional(),
		ssl_submissions: z.union([z.string(), z.number()]).optional(),
		payments: z.union([z.string(), z.number()]).optional(),
		uploads: z.union([z.string(), z.number()]).optional(),
		mobile_submissions: z.union([z.string(), z.number()]).optional(),
		views: z.union([z.string(), z.number()]).optional(),
		api: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();

export const JotformFormSummarySchema = z
	.object({
		id: z.string(),
		username: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		height: z.union([z.string(), z.number()]).nullable().optional(),
		status: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		last_submission: z.string().nullable().optional(),
		new: z.union([z.string(), z.number()]).nullable().optional(),
		count: z.union([z.string(), z.number()]).nullable().optional(),
		type: z.string().nullable().optional(),
		favorite: z.union([z.number(), z.string()]).nullable().optional(),
		archived: z.union([z.number(), z.string()]).nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.passthrough();

export const JotformFormDetailSchema = z
	.object({
		id: z.string(),
		username: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		height: z.union([z.string(), z.number()]).nullable().optional(),
		status: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		last_submission: z.string().nullable().optional(),
		new: z.union([z.string(), z.number()]).nullable().optional(),
		count: z.union([z.string(), z.number()]).nullable().optional(),
		type: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.passthrough();

export const JotformSubmissionSchema = z
	.object({
		id: z.string(),
		form_id: z.string().nullable().optional(),
		ip: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		new: z.union([z.string(), z.number()]).nullable().optional(),
		flag: z.union([z.string(), z.number()]).nullable().optional(),
		// unknown because submission answers contain dynamic question fields and user answers
		answers: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const JotformLabelSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		color: z.string().nullable().optional(),
		parent: z.string().nullable().optional(),
	})
	.passthrough();

export const JotformResourceSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		title: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const JotformReportSchema = z
	.object({
		id: z.string(),
		form_id: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		fields: z.string().nullable().optional(),
	})
	.passthrough();

export const JotformHistoryItemSchema = z
	.object({
		type: z.string().nullable().optional(),
		date: z.union([z.number(), z.string()]).nullable().optional(),
		ip: z.string().nullable().optional(),
		form_id: z.string().nullable().optional(),
		username: z.string().nullable().optional(),
		parent: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
	})
	.passthrough();

export const JotformFileSchema = z
	.object({
		name: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		size: z.union([z.string(), z.number()]).nullable().optional(),
		username: z.string().nullable().optional(),
		form_id: z.string().nullable().optional(),
		submission_id: z.string().nullable().optional(),
		date: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.passthrough();

export const JotformSubuserSchema = z
	.object({
		owner: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		username: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		// unknown because subuser permission objects have heterogeneous structures per resource type
		permissions: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const JotformPlanSchema = z
	.object({
		name: z.string().nullable().optional(),
		price: z.union([z.string(), z.number()]).nullable().optional(),
		submissions: z.union([z.string(), z.number()]).nullable().optional(),
		uploads: z.union([z.string(), z.number()]).nullable().optional(),
		paymentSubmissions: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

// ── Path Segments ────────────────────────────────────────────────────────────

// encodeURIComponent leaves `.` and `..` alone, so an id of `..` would walk up
// the URL path (`/form/123/question/..` is `/form/123`). Ids never take that form.
const PathIdSchema = z
	.string()
	.min(1)
	.refine((value) => value !== '.' && value !== '..', {
		message: 'Not a valid id',
	});

// Jotform question ids are integers.
const QuestionIdSchema = z
	.string()
	.regex(/^\d+$/, { message: 'Question ids are numeric, such as "3"' });

// ── Operation Input & Output Schemas ────────────────────────────────────────

export const JotformEndpointInputSchemas = {
	// ── User ──
	'user.get': z.object({}).strict(),
	'user.getForms': z
		.object({
			offset: z.number().int().nonnegative().optional(),
			limit: z.number().int().positive().max(1000).optional(),
			filter: z.string().optional(),
			orderby: z.string().optional(),
		})
		.strict(),
	'user.getSubmissions': z
		.object({
			offset: z.number().int().nonnegative().optional(),
			limit: z.number().int().positive().max(1000).optional(),
			filter: z.string().optional(),
			orderby: z.string().optional(),
		})
		.strict(),
	'user.getHistory': z
		.object({
			action: z.string().optional(),
			date: z.string().optional(),
			sortBy: z.string().optional(),
			startDate: z.string().optional(),
			endDate: z.string().optional(),
		})
		.strict(),
	'user.getSettings': z.object({}).strict(),
	'user.updateSettings': z
		.object({
			name: z.string().optional(),
			email: z.string().optional(),
			website: z.string().optional(),
			time_zone: z.string().optional(),
			company: z.string().optional(),
			securityQuestion: z.string().optional(),
			securityAnswer: z.string().optional(),
			industry: z.string().optional(),
		})
		.strict(),
	'user.getSettingByKey': z
		.object({
			key: PathIdSchema,
		})
		.strict(),
	'user.getSubusers': z.object({}).strict(),
	'user.getUsage': z.object({}).strict(),
	'user.getReports': z.object({}).strict(),
	'user.getInvoices': z.object({}).strict(),
	'user.getLabels': z
		.object({
			addResources: z.union([z.string(), z.boolean()]).optional(),
		})
		.strict(),

	// ── Forms ──
	'forms.get': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'forms.create': z
		.object({
			// unknown because form questions and properties in form creation can have arbitrary custom fields
			questions: z.array(z.record(z.string(), z.unknown())).optional(),
			// unknown because form properties are extensible key-value settings
			properties: z.record(z.string(), z.unknown()).optional(),
			// unknown because email notification configurations contain arbitrary custom properties
			emails: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.strict(),
	'forms.createForms': z
		.object({
			// unknown because formContent represents complete JSON schema definition of questions/properties
			formContent: z.record(z.string(), z.unknown()),
		})
		.strict(),
	'forms.delete': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'forms.clone': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'forms.getFiles': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'forms.getQuestions': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'forms.getQuestion': z
		.object({
			id: PathIdSchema,
			qid: QuestionIdSchema,
		})
		.strict(),
	'forms.createQuestion': z
		.object({
			id: PathIdSchema,
			// unknown because single question properties vary across question types (radio, text, date, etc.)
			question: z.record(z.string(), z.unknown()),
		})
		.strict(),
	'forms.createQuestions': z
		.object({
			id: PathIdSchema,
			// unknown because batch questions payload can be an array or map of question definitions
			questions: z.union([
				z.array(z.record(z.string(), z.unknown())),
				z.record(z.string(), z.unknown()),
			]),
		})
		.strict(),
	'forms.updateQuestion': z
		.object({
			id: PathIdSchema,
			qid: QuestionIdSchema,
			// unknown because edited question properties vary by question type
			question: z.record(z.string(), z.unknown()),
		})
		.strict(),
	'forms.deleteQuestion': z
		.object({
			id: PathIdSchema,
			qid: QuestionIdSchema,
		})
		.strict(),
	'forms.getProperties': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'forms.getProperty': z
		.object({
			id: PathIdSchema,
			key: PathIdSchema,
		})
		.strict(),
	'forms.setProperties': z
		.object({
			id: PathIdSchema,
			// unknown because form properties are extensible configuration options
			properties: z.record(z.string(), z.unknown()),
		})
		.strict(),
	'forms.getReports': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'forms.createReport': z
		.object({
			id: PathIdSchema,
			title: z.string().min(1),
			list_type: z.string().min(1),
			fields: z.string().optional(),
		})
		.strict(),
	'forms.getSubmissions': z
		.object({
			id: PathIdSchema,
			offset: z.number().int().nonnegative().optional(),
			limit: z.number().int().positive().max(1000).optional(),
			filter: z.string().optional(),
			orderby: z.string().optional(),
		})
		.strict(),
	'forms.createSubmission': z
		.object({
			id: PathIdSchema,
			// unknown because submission field answers are keyed by question ID with dynamic response values
			submission: z.record(z.string(), z.unknown()),
		})
		.strict(),
	'forms.createSubmissions': z
		.object({
			id: PathIdSchema,
			// unknown because each submission in the batch contains dynamic question field answers
			submissions: z.array(z.record(z.string(), z.unknown())),
		})
		.strict(),

	// ── Submissions ──
	'submissions.get': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'submissions.update': z
		.object({
			id: PathIdSchema,
			// unknown because edited submission data is keyed by question ID with dynamic answer values
			submission: z.record(z.string(), z.unknown()),
		})
		.strict(),
	'submissions.delete': z
		.object({
			id: PathIdSchema,
		})
		.strict(),

	// ── Reports ──
	'reports.get': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'reports.delete': z
		.object({
			id: PathIdSchema,
		})
		.strict(),

	// ── Labels ──
	'labels.get': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'labels.create': z
		.object({
			name: z.string().min(1),
			color: z.string().optional(),
			parent: z.string().optional(),
		})
		.strict(),
	'labels.update': z
		.object({
			id: PathIdSchema,
			name: z.string().optional(),
			color: z.string().optional(),
			parent: z.string().optional(),
		})
		.strict(),
	'labels.delete': z
		.object({
			id: PathIdSchema,
		})
		.strict(),
	'labels.getResources': z
		.object({
			id: PathIdSchema,
			offset: z.number().int().nonnegative().optional(),
			limit: z.number().int().positive().max(1000).optional(),
			orderby: z.string().optional(),
			status: z.string().optional(),
		})
		.strict(),
	'labels.addResources': z
		.object({
			id: PathIdSchema,
			resources: z.array(
				z.object({
					id: z.string(),
					type: z.string(),
				}),
			),
		})
		.strict(),
	'labels.removeResources': z
		.object({
			id: PathIdSchema,
			resources: z.array(
				z.object({
					id: z.string(),
					type: z.string(),
				}),
			),
		})
		.strict(),

	// ── System ──
	'system.getPlan': z
		.object({
			planName: PathIdSchema,
		})
		.strict(),
} as const;

export const JotformEndpointOutputSchemas = {
	// ── User ──
	'user.get': createJotformEnvelope(JotformUserSchema),
	'user.getForms': createJotformListEnvelope(z.array(JotformFormSummarySchema)),
	'user.getSubmissions': createJotformListEnvelope(
		z.array(JotformSubmissionSchema),
	),
	'user.getHistory': createJotformEnvelope(z.array(JotformHistoryItemSchema)),
	// unknown because user settings map contains arbitrary key-value pairs
	'user.getSettings': createJotformEnvelope(z.record(z.string(), z.unknown())),
	// unknown because updated user settings return the modified settings map
	'user.updateSettings': createJotformEnvelope(
		z.record(z.string(), z.unknown()),
	),
	// unknown because single setting value can be string, number, boolean, or nested JSON object.
	// Live API: a set key returns `{ key: value }`, an unset key returns `[]`.
	'user.getSettingByKey': createJotformEnvelope(
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.record(z.string(), z.unknown()),
			z.array(z.unknown()),
			z.null(),
		]),
	),
	'user.getSubusers': createJotformEnvelope(z.array(JotformSubuserSchema)),
	'user.getUsage': createJotformEnvelope(JotformUsageSchema),
	'user.getReports': createJotformEnvelope(z.array(JotformReportSchema)),
	// unknown because invoices contain billing metadata with provider-specific item structures
	'user.getInvoices': createJotformEnvelope(
		z.array(z.record(z.string(), z.unknown())),
	),
	// unknown because labels endpoint returns hierarchical label dictionary.
	// Live API: `[]` until the account has a label, then the root label with `sublabels`.
	'user.getLabels': createJotformEnvelope(
		z.union([z.record(z.string(), z.unknown()), z.array(z.unknown())]),
	),

	// ── Forms ──
	'forms.get': createJotformEnvelope(
		z.union([JotformFormDetailSchema, z.array(JotformFormDetailSchema)]),
	),
	// unknown because created form returns form ID, URL and configuration details
	'forms.create': createJotformEnvelope(z.record(z.string(), z.unknown())),
	// unknown because PUT form creation returns the full created form object
	'forms.createForms': createJotformEnvelope(z.record(z.string(), z.unknown())),
	// unknown because deleted form response includes form deletion status confirmation
	'forms.delete': createJotformEnvelope(z.record(z.string(), z.unknown())),
	// unknown because cloned form returns newly created form details
	'forms.clone': createJotformEnvelope(z.record(z.string(), z.unknown())),
	'forms.getFiles': createJotformEnvelope(z.array(JotformFileSchema)),
	// unknown because form questions dictionary is keyed by question ID (e.g. "1", "2").
	// Live API: a form without questions returns `[]`.
	'forms.getQuestions': createJotformEnvelope(
		z.union([z.record(z.string(), z.unknown()), z.array(z.unknown())]),
	),
	// unknown because single question returns the specific question configuration properties
	'forms.getQuestion': createJotformEnvelope(
		z.union([
			z.record(z.string(), z.unknown()),
			z.array(z.record(z.string(), z.unknown())),
		]),
	),
	// unknown because created question returns newly added question properties
	'forms.createQuestion': createJotformEnvelope(
		z.record(z.string(), z.unknown()),
	),
	// unknown because batch created questions return the added questions.
	// Live API: a list of the new questions, each with its `qid`.
	'forms.createQuestions': createJotformEnvelope(
		z.union([
			z.array(z.record(z.string(), z.unknown())),
			z.record(z.string(), z.unknown()),
		]),
	),
	// unknown because updated question returns modified question properties
	'forms.updateQuestion': createJotformEnvelope(
		z.union([
			z.record(z.string(), z.unknown()),
			z.array(z.record(z.string(), z.unknown())),
		]),
	),
	// unknown because question deletion returns string confirmation or status object
	'forms.deleteQuestion': createJotformEnvelope(
		z.union([z.string(), z.record(z.string(), z.unknown())]),
	),
	// unknown because form properties contain arbitrary form styling, thank-you page and redirect settings
	'forms.getProperties': createJotformEnvelope(
		z.record(z.string(), z.unknown()),
	),
	// unknown because single property value can be string, number or JSON object
	'forms.getProperty': createJotformEnvelope(
		z.union([
			z.string(),
			z.number(),
			z.record(z.string(), z.unknown()),
			z.null(),
		]),
	),
	// unknown because setting form properties returns the updated properties dictionary
	'forms.setProperties': createJotformEnvelope(
		z.record(z.string(), z.unknown()),
	),
	'forms.getReports': createJotformEnvelope(z.array(JotformReportSchema)),
	'forms.createReport': createJotformEnvelope(JotformReportSchema),
	'forms.getSubmissions': createJotformListEnvelope(
		z.array(JotformSubmissionSchema),
	),
	// unknown because created submission returns submission ID and URL confirmation
	'forms.createSubmission': createJotformEnvelope(
		z.record(z.string(), z.unknown()),
	),
	// unknown because batch submissions return array of created submission records
	'forms.createSubmissions': createJotformEnvelope(
		z.array(z.record(z.string(), z.unknown())),
	),

	// ── Submissions ──
	'submissions.get': createJotformEnvelope(JotformSubmissionSchema),
	// unknown because updated submission returns modified submission fields
	'submissions.update': createJotformEnvelope(
		z.record(z.string(), z.unknown()),
	),
	// unknown because submission deletion returns string confirmation or status object
	'submissions.delete': createJotformEnvelope(
		z.union([z.string(), z.record(z.string(), z.unknown())]),
	),

	// ── Reports ──
	'reports.get': createJotformEnvelope(
		z.union([JotformReportSchema, z.array(JotformReportSchema)]),
	),
	// unknown because report deletion returns boolean or status object
	'reports.delete': createJotformEnvelope(
		z.union([z.boolean(), z.record(z.string(), z.unknown())]),
	),

	// ── Labels ──
	'labels.get': createJotformEnvelope(JotformLabelSchema),
	'labels.create': createJotformEnvelope(JotformLabelSchema),
	// The update response echoes only the changed properties, without id.
	'labels.update': createJotformEnvelope(
		JotformLabelSchema.extend({ id: z.string().optional() }),
	),
	// unknown because label deletion returns string status or status object
	'labels.delete': createJotformEnvelope(
		z.union([z.string(), z.record(z.string(), z.unknown()), z.boolean()]),
	),
	'labels.getResources': createJotformListEnvelope(
		z.array(JotformResourceSchema),
	),
	'labels.addResources': createJotformEnvelope(z.array(JotformResourceSchema)),
	'labels.removeResources': createJotformEnvelope(
		z.array(JotformResourceSchema),
	),

	// ── System ──
	'system.getPlan': createJotformEnvelope(JotformPlanSchema),
} as const;

export type JotformEndpointInputs = {
	[K in keyof typeof JotformEndpointInputSchemas]: z.infer<
		(typeof JotformEndpointInputSchemas)[K]
	>;
};

export type JotformEndpointOutputs = {
	[K in keyof typeof JotformEndpointOutputSchemas]: z.infer<
		(typeof JotformEndpointOutputSchemas)[K]
	>;
};
