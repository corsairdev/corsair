import { z } from 'zod';

const HostSchema = z
	.string()
	.regex(/^[a-z0-9-]+\.formdesk\.com$/i, 'Host must be a Formdesk host');
const DomainSchema = z.string().min(1);
const TenantSchema = {
	host: HostSchema,
	domain: DomainSchema,
};
const FormSchema = z.string().min(1);
const PositiveIdSchema = z.union([
	z.number().int().positive(),
	z.string().min(1),
]);
const JsonSchema = z.json();
const JsonRecordSchema = z.record(z.string(), JsonSchema);

function extensibleObject<const T extends z.ZodRawShape>(shape: T) {
	// Formdesk responses contain account-defined form fields and may add fields;
	// retaining those documented extension points avoids silently losing data.
	return z.object(shape).passthrough();
}

const ApiMetaSchema = extensibleObject({
	resourceType: z.string().optional(),
	created: z.string().nullable().optional(),
	lastModified: z.string().nullable().optional(),
	location: z.string().optional(),
});

const LinkSchema = extensibleObject({ href: z.string().url() });
const FileLinksSchema = extensibleObject({
	self: LinkSchema.optional(),
	content: LinkSchema.optional(),
});
const FileSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	_links: FileLinksSchema.optional(),
	id: z.number(),
	id_formresult: z.number().optional(),
	name: z.string().optional(),
	filename: z.string().optional(),
	orgfilename: z.string().optional(),
	filesize: z.number().optional(),
	contenttype: z.string().optional(),
	public: z.boolean().optional(),
	version: z.number().optional(),
});
const FormResourceSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	id: z.number(),
	name: z.string(),
	title: z.string().optional(),
	user_id: z.number().optional(),
});
const FormItemSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	id: z.number(),
	id_itemtype: z.number().optional(),
	itemtype: z.string(),
	identifier: z.string(),
	label: z.string().optional(),
	datatype: z.string().optional(),
	options: z.array(JsonSchema).nullable().optional(),
	defaultvalue: JsonSchema.optional(),
	position: z.number().optional(),
});
const FilterSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	id: z.number(),
	name: z.string(),
});
const FormResultIdSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	id: z.number(),
	status: z.string().optional(),
	sync_status: z.string().optional(),
});
const ResultDataSchema = extensibleObject({
	_fd_id: z.number(),
	_fd_status: z.string().optional(),
	_fd_syncstatus: z.string().optional(),
});
const FormResultSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	result: ResultDataSchema,
	files: z.array(FileSchema).optional(),
});
const UserSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	id: z.number(),
	active: z.boolean().optional(),
	type: z.string().optional(),
	firstname: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	username: z.string().optional(),
	cellphone_country: z.string().optional(),
	cellphone: z.string().optional(),
	allow_createform: z.boolean().optional(),
	allow_editprofile: z.boolean().optional(),
	allow_managelabels: z.boolean().optional(),
	newsletter: z.boolean().optional(),
	template: z.number().optional(),
	apikey: z.string().optional(),
	notwofactor: z.boolean().optional(),
	external_userid: z.string().optional(),
	external_force: z.boolean().optional(),
	external_provider: z.string().optional(),
	lastlogin: z.string().nullable().optional(),
});
const VisitorSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	id: z.number(),
	type: z.string().optional(),
	external_userid: z.string().optional(),
	external_provider: z.string().optional(),
	active: z.boolean().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	cellphone_country: z.string().optional(),
	cellphone: z.string().optional(),
	username: z.string().optional(),
	password: z.string().nullable().optional(),
});
const WorkflowSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	id: z.number(),
	id_message: z.number().optional(),
	description: z.string().optional(),
	datetime: z.string().optional(),
	code: z.string().optional(),
	signing_status: z.string().optional(),
	payment: z.boolean().optional(),
});
const SignOnSchema = extensibleObject({
	id: z.string(),
	url: z.string().url(),
});
const ErrorDetailSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	code: z.string().optional(),
	description: z.string().optional(),
	reason: z.string().optional(),
	data: JsonSchema.optional(),
});
const ResultsEnvelopeSchema = extensibleObject({
	results: z.array(ResultDataSchema),
	errors: z.array(ErrorDetailSchema).optional(),
	files: z.array(FileSchema).optional(),
});
const ExportedFileSchema = extensibleObject({
	meta: ApiMetaSchema.optional(),
	name: z.string(),
	contenttype: z.string(),
	content: z.string(),
});
const ExportSchema = extensibleObject({ files: z.array(ExportedFileSchema) });
const FileBinarySchema = extensibleObject({
	kind: z.literal('binary'),
	contentType: z.string(),
	base64: z.string(),
	filename: z.string().optional(),
	byteLength: z.number().int().nonnegative(),
});
const NoContentSchema = z.null();
const ResultStatuses = [
	'SAVED',
	'CFS',
	'CFD',
	'EVS',
	'EVD',
	'SVS',
	'SVD',
	'PMS',
	'PMD',
	'DNS',
	'DND',
	'WFS',
	'WFD',
	'DONE',
	'ALL',
] as const;
const SyncStatuses = ['N', 'C', 'D', 'X', 'R', 'P', 'ALL'] as const;
const csvEnum = <T extends readonly string[]>(values: T) =>
	z
		.string()
		.refine(
			(value) =>
				value
					.split(',')
					.every((part) => values.some((entry) => entry === part)),
			{ message: `Use comma-separated values from ${values.join(', ')}` },
		);

const ResultsQuerySchema = z
	.object({
		view: z.string().optional(),
		search: z.string().optional(),
		id_from: z.number().int().nonnegative().optional(),
		id_to: z.number().int().nonnegative().optional(),
		created_from: z.string().optional(),
		created_to: z.string().optional(),
		status: csvEnum(ResultStatuses).optional(),
		changed_from: z.string().optional(),
		changed_to: z.string().optional(),
		completed: z.boolean().optional(),
		completed_from: z.string().optional(),
		completed_to: z.string().optional(),
		id_visitor: z.number().int().positive().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		confirmed: z.boolean().optional(),
		verified: z.boolean().optional(),
		verified_from: z.string().optional(),
		verified_to: z.string().optional(),
		sync_status: csvEnum(SyncStatuses).optional(),
	})
	.strict();

const FormDataInputSchema = JsonRecordSchema;
const UserFieldsSchema = z
	.object({
		type: z.enum(['internal', 'external', 'API']).optional(),
		active: z.boolean().optional(),
		firstname: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		username: z.string().optional(),
		password: z.string().optional(),
		cellphone_country: z.string().optional(),
		cellphone: z.string().optional(),
		newsletter: z.boolean().optional(),
		notwofactor: z.boolean().optional(),
		allow_createform: z.boolean().optional(),
		allow_editprofile: z.boolean().optional(),
		allow_managelabels: z.boolean().optional(),
		template: z.number().int().optional(),
		external_userid: z.string().optional(),
		external_provider: z.string().optional(),
		external_force: z.boolean().optional(),
		apikey: z.string().optional(),
	})
	.strict();
const VisitorFieldsSchema = z
	.object({
		type: z.enum(['internal', 'external']).optional(),
		active: z.boolean().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		username: z.string().optional(),
		password: z.string().optional(),
		password_from_visitor: z.boolean().optional(),
		cellphone_country: z.string().optional(),
		cellphone: z.string().optional(),
		external_userid: z.string().optional(),
		external_provider: z.string().optional(),
	})
	.strict();
const SignOnInputSchema = z
	.object({
		id: z.union([z.number().int().positive(), z.string().min(1)]).optional(),
		email: z.string().email().optional(),
		username: z.string().min(1).optional(),
		password: z.string().optional(),
	})
	.strict()
	.refine(
		(value) =>
			Number(value.id !== undefined) +
				Number(value.email !== undefined) +
				Number(value.username !== undefined) ===
			1,
		{ message: 'Provide exactly one of id, email, or username' },
	);

const PdfSettingsSchema = z
	.object({
		hideunanswered: z.boolean().optional(),
		showhidden: z.boolean().optional(),
		ignoredependencies: z.boolean().optional(),
		noworkflow: z.boolean().optional(),
		papersize: z
			.union([
				z.enum(['A3', 'A4', 'A5', 'Letter', 'Executive', 'Auto']),
				z.string().regex(/^\d+(\.\d+)?x\d+(\.\d+)?$/),
			])
			.optional(),
		orientation: z.union([z.literal(1), z.literal(2)]).optional(),
		scaletype: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
		scaling: z.number().positive().optional(),
		marginLeft: z.number().optional(),
		marginRight: z.number().optional(),
		marginTop: z.number().optional(),
		marginBottom: z.number().optional(),
		editprotect: z.boolean().optional(),
		copyprotect: z.boolean().optional(),
		userpassword: z.string().optional(),
		ownerpassword: z.string().optional(),
	})
	.strict();

export const FormdeskEndpointInputSchemas = {
	connectByApiKey: z.object({ domain: DomainSchema }).strict(),
	connectWithCredentials: z
		.object({
			domain: DomainSchema,
			username: z.string().min(1),
			password: z.string().min(1),
		})
		.strict(),
	formsList: z.object(TenantSchema).strict(),
	formsPark: z
		.object({
			...TenantSchema,
			data: FormDataInputSchema,
			expires: z.number().int().positive(),
			reuse: z.boolean().optional(),
			preventchange: z.boolean().optional(),
		})
		.strict(),
	formsItems: z.object({ ...TenantSchema, form: FormSchema }).strict(),
	formsFilters: z.object({ ...TenantSchema, form: FormSchema }).strict(),
	resultsExport: z
		.object({
			...TenantSchema,
			form: FormSchema,
			format: z.enum([
				'excel',
				'excel-plain',
				'excel2007',
				'xml',
				'text',
				'csv',
				'csv-comma',
			]),
			query: ResultsQuerySchema.optional(),
		})
		.strict(),
	resultsList: z
		.object({
			...TenantSchema,
			form: FormSchema,
			query: ResultsQuerySchema.optional(),
		})
		.strict(),
	resultsGet: z.object({ ...TenantSchema, entryId: PositiveIdSchema }).strict(),
	resultsAdd: z
		.object({
			...TenantSchema,
			form: FormSchema,
			data: z.union([
				FormDataInputSchema,
				z.array(FormDataInputSchema).min(1).max(10),
			]),
			process_messages: z.boolean().optional(),
		})
		.strict(),
	resultsUpdate: z
		.object({
			...TenantSchema,
			entryId: PositiveIdSchema,
			data: FormDataInputSchema,
			process_messages: z.boolean().optional(),
		})
		.strict(),
	resultsRemove: z
		.object({ ...TenantSchema, entryId: PositiveIdSchema })
		.strict(),
	resultsIncrement: z
		.object({
			...TenantSchema,
			entryId: PositiveIdSchema,
			identifier: z.string().min(1),
			count: z.number(),
		})
		.strict(),
	resultsMarkProcessed: z
		.object({ ...TenantSchema, entryId: PositiveIdSchema })
		.strict(),
	resultsPdf: z
		.object({
			...TenantSchema,
			entryId: PositiveIdSchema,
			settings: PdfSettingsSchema.optional(),
		})
		.strict(),
	resultsWorkflows: z
		.object({ ...TenantSchema, entryId: PositiveIdSchema })
		.strict(),
	resultsFiles: z
		.object({ ...TenantSchema, entryId: PositiveIdSchema })
		.strict(),
	resultsAllFiles: z.object({ ...TenantSchema, form: FormSchema }).strict(),
	resultsDeleteFiles: z
		.object({ ...TenantSchema, entryId: PositiveIdSchema })
		.strict(),
	resultsDeleteAllFiles: z
		.object({ ...TenantSchema, form: FormSchema })
		.strict(),
	usersList: z.object(TenantSchema).strict(),
	usersGet: z.object({ ...TenantSchema, userId: PositiveIdSchema }).strict(),
	usersGetExternal: z
		.object({ ...TenantSchema, externalUserId: z.string().min(1) })
		.strict(),
	usersAdd: z
		.object({ ...TenantSchema, user: UserFieldsSchema })
		.strict()
		.refine(
			({ user }) =>
				user.type === 'external'
					? Boolean(user.external_userid && user.external_provider)
					: user.type === 'API'
						? Boolean(user.name)
						: Boolean(
								user.name && user.email && user.username && user.password,
							),
			{ message: 'Required fields depend on the user type' },
		),
	usersUpdate: z
		.object({
			...TenantSchema,
			userId: PositiveIdSchema,
			user: UserFieldsSchema,
		})
		.strict(),
	usersRemove: z.object({ ...TenantSchema, userId: PositiveIdSchema }).strict(),
	usersSignOn: z
		.object({ ...TenantSchema, credentials: SignOnInputSchema })
		.strict(),
	visitorsList: z.object(TenantSchema).strict(),
	visitorsGet: z
		.object({ ...TenantSchema, visitorId: PositiveIdSchema })
		.strict(),
	visitorsGetExternal: z
		.object({ ...TenantSchema, externalUserId: z.string().min(1) })
		.strict(),
	visitorsResults: z
		.object({ ...TenantSchema, visitorId: PositiveIdSchema })
		.strict(),
	visitorsAdd: z
		.object({ ...TenantSchema, visitor: VisitorFieldsSchema })
		.strict()
		.refine(
			({ visitor }) =>
				visitor.type === 'external'
					? Boolean(visitor.external_userid && visitor.external_provider)
					: Boolean(visitor.name && visitor.email && visitor.username),
			{ message: 'Required fields depend on the visitor type' },
		),
	visitorsUpdate: z
		.object({
			...TenantSchema,
			visitorId: PositiveIdSchema,
			visitor: VisitorFieldsSchema,
		})
		.strict(),
	visitorsRemove: z
		.object({ ...TenantSchema, visitorId: PositiveIdSchema })
		.strict(),
	visitorsSignOn: z
		.object({
			...TenantSchema,
			form: FormSchema,
			credentials: SignOnInputSchema,
		})
		.strict(),
	filesList: z
		.object({ ...TenantSchema, type: z.literal('all').optional() })
		.strict(),
	filesGet: z.object({ ...TenantSchema, fileId: PositiveIdSchema }).strict(),
	filesContent: z
		.object({ ...TenantSchema, fileId: PositiveIdSchema })
		.strict(),
	filesRemove: z.object({ ...TenantSchema, fileId: PositiveIdSchema }).strict(),
} as const;

export const FormdeskEndpointOutputSchemas = {
	connectByApiKey: extensibleObject({ apikey: z.string(), host: HostSchema }),
	connectWithCredentials: extensibleObject({
		apikey: z.string(),
		host: HostSchema,
	}),
	formsList: z.array(FormResourceSchema),
	formsPark: extensibleObject({
		meta: ApiMetaSchema.optional(),
		ticket: z.string().length(32),
		expires: z.string(),
	}),
	formsItems: z.array(FormItemSchema),
	formsFilters: z.array(FilterSchema),
	resultsExport: ExportSchema,
	resultsList: z.array(FormResultIdSchema),
	resultsGet: FormResultSchema,
	resultsAdd: ResultsEnvelopeSchema,
	resultsUpdate: ResultsEnvelopeSchema,
	resultsRemove: NoContentSchema,
	resultsIncrement: extensibleObject({
		meta: ApiMetaSchema.optional(),
		count: z.number(),
	}),
	resultsMarkProcessed: NoContentSchema,
	resultsPdf: FileBinarySchema,
	resultsWorkflows: z.array(WorkflowSchema),
	resultsFiles: z.array(FileSchema),
	resultsAllFiles: z.array(FileSchema),
	resultsDeleteFiles: NoContentSchema,
	resultsDeleteAllFiles: NoContentSchema,
	usersList: z.array(UserSchema),
	usersGet: UserSchema,
	usersGetExternal: UserSchema,
	usersAdd: UserSchema,
	usersUpdate: UserSchema,
	usersRemove: NoContentSchema,
	usersSignOn: SignOnSchema,
	visitorsList: z.array(VisitorSchema),
	visitorsGet: VisitorSchema,
	visitorsGetExternal: VisitorSchema,
	visitorsResults: z.array(
		extensibleObject({
			meta: ApiMetaSchema.optional(),
			id: z.number(),
			name: z.string(),
			title: z.string().optional(),
			results: z.array(
				extensibleObject({
					meta: ApiMetaSchema.optional(),
					id: z.number(),
				}),
			),
		}),
	),
	visitorsAdd: VisitorSchema,
	visitorsUpdate: VisitorSchema,
	visitorsRemove: NoContentSchema,
	visitorsSignOn: SignOnSchema,
	filesList: z.array(FileSchema),
	filesGet: FileSchema,
	filesContent: FileBinarySchema,
	filesRemove: NoContentSchema,
} as const;

export type FormdeskJson = z.infer<typeof JsonSchema>;
export type FormdeskEndpointInputs = {
	[K in keyof typeof FormdeskEndpointInputSchemas]: z.infer<
		(typeof FormdeskEndpointInputSchemas)[K]
	>;
};
export type FormdeskEndpointOutputs = {
	[K in keyof typeof FormdeskEndpointOutputSchemas]: z.infer<
		(typeof FormdeskEndpointOutputSchemas)[K]
	>;
};
