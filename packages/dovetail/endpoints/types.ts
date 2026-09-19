import { z } from 'zod';
import {
	DovetailChannel,
	DovetailContact,
	DovetailData,
	DovetailDataPoint,
	DovetailDoc,
	DovetailFile,
	DovetailFolder,
	DovetailHighlight,
	DovetailInsight,
	DovetailNote,
	DovetailProject,
	DovetailTag,
	DovetailTopic,
} from '../schema';

// Common Schemas
export const PageInfoSchema = z.object({
	total_count: z.number().optional(),
	has_more: z.boolean().optional(),
	next_cursor: z.string().nullable().optional(),
});
export type PageInfo = z.infer<typeof PageInfoSchema>;

export const PageInputSchema = z
	.object({
		start_cursor: z.string().optional(),
		limit: z.number().optional(),
	})
	.optional();

export const DateFilterSchema = z
	.object({
		gt: z.string().optional(),
		gte: z.string().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
	})
	.optional();

export const CustomFieldInputSchema = z.object({
	label: z.string(),
	// Justification: unknown is used here because custom field values can be of varying primitive or array types depending on the field type
	value: z.unknown().optional(),
	type: z
		.enum([
			'BOOLEAN',
			'DATETIME',
			'EMAIL',
			'NPS',
			'NUMBER',
			'PERSON',
			'PHONE',
			'SELECT',
			'TEXT',
			'URL',
		])
		.optional(),
});

export const CustomFieldOutputSchema = z.object({
	id: z.string().optional(),
	label: z.string(),
	// Justification: unknown is used here because custom field output values can be of any JSON primitive, array, or object type
	value: z.unknown().optional(),
	type: z.string().optional(),
});

// Channels
export const ChannelsCreateInputSchema = z.object({
	title: z.string().min(1).max(200),
	content_type: z.enum([
		'APP_REVIEW',
		'CHURN_REASONS',
		'NPS_FEEDBACK',
		'PRODUCT_REVIEW',
		'SUPPORT_TICKETS',
	]),
	project_category_id: z.string().optional(),
});

export const ChannelsUpdateInputSchema = z.object({
	channel_id: z.string(),
	title: z.string().max(200),
	context: z.string().max(10000).optional(),
});

export const ChannelsDeleteInputSchema = z.object({
	channel_id: z.string(),
});

export const ChannelsCreateDataPointInputSchema = z.object({
	channel_id: z.string(),
	text: z.string().min(1).max(5000000),
	// Required by POST /v1/channels/data (OpenAPI required: text, channel_id, timestamp).
	// Records when the feedback was originally received, in ISO 8601 format.
	// offset:true because ISO 8601 allows numeric timezone offsets, not just Z.
	timestamp: z.iso.datetime({ offset: true }),
	source_title: z.string().min(1).max(100).optional(),
	source_url: z.string().min(1).max(5000).optional(),
	// Justification: unknown is used here because metadata represents arbitrary key-value pairs associated with a data point
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ChannelsCreateTopicInputSchema = z.object({
	channel_id: z.string(),
	title: z.string().min(1).max(300),
	description: z.string().min(1).max(2500),
});

export const ChannelsUpdateTopicInputSchema = z.object({
	topic_id: z.string(),
	title: z.string().max(300).optional(),
	description: z.string().max(2500).optional(),
});

export const ChannelsDeleteTopicInputSchema = z.object({
	topic_id: z.string(),
});

// Contacts
export const ContactsCreateInputSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const ContactsGetInputSchema = z.object({
	contact_id: z.string(),
});

export const ContactsListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			name: z.string().optional(),
		})
		.optional(),
	sort: z.string().optional(),
});

export const ContactsUpdateInputSchema = z.object({
	contact_id: z.string(),
	name: z.string().optional(),
	email: z.string().email().optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

// Data
export const DataCreateInputSchema = z.object({
	project_id: z.string(),
	title: z.string().max(200).optional(),
	content: z.string().optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const DataGetInputSchema = z.object({
	data_id: z.string(),
});

export const DataListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			project_id: z.string().optional(),
			folder_id: z.string().optional(),
			title: z.string().optional(),
			created_at: DateFilterSchema,
		})
		.optional(),
	sort: z.string().optional(),
});

export const DataUpdateInputSchema = z.object({
	data_id: z.string(),
	title: z.string().max(200).optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const DataDeleteInputSchema = z.object({
	data_id: z.string(),
});

export const DataExportInputSchema = z.object({
	data_id: z.string(),
	type: z.enum(['html', 'markdown']),
	include_file_content: z.boolean().optional(),
});

export const DataImportFileInputSchema = z
	.object({
		project_id: z.string(),
		// Required by POST /v1/data/import/file (OpenAPI required: project_id, title).
		title: z.string().min(1),
		// POST /v1/data/import/file accepts exactly one of url or file_id.
		url: z.string().url().optional(),
		file_id: z.string().optional(),
		mime_type: z.string().optional(),
		author_id: z.string().optional(),
		created_at: z.string().optional(),
		fields: z.array(CustomFieldInputSchema).optional(),
	})
	.superRefine((val, ctx) => {
		const hasUrl = val.url !== undefined;
		const hasFileId = val.file_id !== undefined;
		if (hasUrl === hasFileId) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide exactly one of `url` or `file_id` (POST /v1/data/import/file).',
				path: hasUrl ? ['url', 'file_id'] : ['url'],
			});
		}
	});

// Docs
export const DocsCreateInputSchema = z.object({
	title: z.string().max(200).optional(),
	content: z.string().optional(),
	content_type: z.enum(['text', 'html', 'markdown']).optional(),
	project_id: z.string().optional(),
	folder_id: z.string().optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const DocsGetInputSchema = z.object({
	doc_id: z.string(),
});

export const DocsListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			project_id: z.string().optional(),
			folder_id: z.string().optional(),
			title: z.string().optional(),
			created_at: DateFilterSchema,
		})
		.optional(),
	sort: z.string().optional(),
});

export const DocsUpdateInputSchema = z.object({
	doc_id: z.string(),
	title: z.string().max(200).optional(),
	folder_id: z.string().optional(),
	cover_image_file_id: z.string().optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const DocsDeleteInputSchema = z.object({
	doc_id: z.string(),
});

export const DocsExportInputSchema = z.object({
	doc_id: z.string(),
	type: z.enum(['html', 'markdown']),
});

export const DocsImportFileInputSchema = z.object({
	title: z.string().min(1),
	project_id: z.string().optional(),
	folder_id: z.string().optional(),
	url: z.string().url().optional(),
	file_id: z.string().optional(),
	mime_type: z.string().optional(),
});

export const DocsListUserDocsInputSchema = z.object({
	user_id: z.string(),
	page: PageInputSchema,
	filter: z
		.object({
			project_id: z.string().optional(),
			folder_id: z.string().optional(),
			title: z.string().optional(),
			created_at: DateFilterSchema,
		})
		.optional(),
	sort: z.string().optional(),
});

// Insights
export const InsightsCreateInputSchema = z.object({
	title: z.string().max(200).optional(),
	content: z.string().optional(),
	content_type: z.enum(['text', 'html', 'markdown']).optional(),
	project_id: z.string().optional(),
	folder_id: z.string().optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const InsightsGetInputSchema = z.object({
	insight_id: z.string(),
});

export const InsightsListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			project_id: z.string().optional(),
			folder_id: z.string().optional(),
			title: z.string().optional(),
			created_at: DateFilterSchema,
		})
		.optional(),
	sort: z.string().optional(),
});

export const InsightsUpdateInputSchema = z.object({
	insight_id: z.string(),
	title: z.string().max(200).optional(),
	folder_id: z.string().optional(),
	cover_image_file_id: z.string().optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const InsightsDeleteInputSchema = z.object({
	insight_id: z.string(),
});

export const InsightsExportInputSchema = z.object({
	insight_id: z.string(),
	type: z.enum(['html', 'markdown']),
});

export const InsightsImportFileInputSchema = z.object({
	title: z.string().min(1),
	project_id: z.string().optional(),
	folder_id: z.string().optional(),
	url: z.string().url().optional(),
	file_id: z.string().optional(),
	mime_type: z.string().optional(),
});

export const InsightsListUserInsightsInputSchema = z.object({
	user_id: z.string(),
	page: PageInputSchema,
	filter: z
		.object({
			project_id: z.string().optional(),
			folder_id: z.string().optional(),
			title: z.string().optional(),
			created_at: DateFilterSchema,
		})
		.optional(),
	sort: z.string().optional(),
});

// Notes
export const NotesCreateInputSchema = z.object({
	project_id: z.string(),
	title: z.string().max(200).optional(),
	content: z.string().optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const NotesGetInputSchema = z.object({
	note_id: z.string(),
});

export const NotesListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			project_id: z.string().optional(),
			folder_id: z.string().optional(),
			created_at: DateFilterSchema,
		})
		.optional(),
	sort: z.string().optional(),
});

export const NotesUpdateInputSchema = z.object({
	note_id: z.string(),
	title: z.string().max(200).optional(),
	fields: z.array(CustomFieldInputSchema).optional(),
});

export const NotesDeleteInputSchema = z.object({
	note_id: z.string(),
});

export const NotesExportInputSchema = z.object({
	note_id: z.string(),
	type: z.enum(['html', 'markdown']),
});

export const NotesImportFileInputSchema = z.object({
	project_id: z.string(),
	title: z.string().min(1),
	url: z.string().url(),
	mime_type: z.string().optional(),
});

// Projects
export const ProjectsCreateInputSchema = z.object({
	title: z.string().min(1).max(200),
	folder_id: z.string().optional(),
	template_id: z.string().optional(),
});

export const ProjectsGetInputSchema = z.object({
	project_id: z.string(),
});

export const ProjectsListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			folder_id: z.string().optional(),
			title: z.string().optional(),
		})
		.optional(),
	sort: z.string().optional(),
});

// Folders
export const FoldersGetInputSchema = z.object({
	folder_id: z.string(),
});

export const FoldersListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			parent_folder_id: z.string().nullable().optional(),
			title: z.string().optional(),
		})
		.optional(),
	sort: z.string().optional(),
});

// Files
export const FilesGetInputSchema = z.object({
	file_id: z.string(),
});

// Highlights
export const HighlightsListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			project_id: z.string().optional(),
			tag_id: z.string().optional(),
			highlight_id: z.string().optional(),
			created_at: DateFilterSchema,
			updated_at: DateFilterSchema,
		})
		.optional(),
	sort: z.string().optional(),
});

// Tags
export const TagsListInputSchema = z.object({
	page: PageInputSchema,
	filter: z
		.object({
			project_id: z.string().optional(),
			tag_board_id: z.string().optional(),
		})
		.optional(),
	sort: z.string().optional(),
});

// Token Info
export const TokenGetInfoInputSchema = z.object({});

// Magic Search
export const SearchMagicSearchInputSchema = z.object({
	query: z.string().optional(),
	offset: z.number().int().min(0).optional(),
	limit: z.number().int().min(0).max(250).optional(),
	// Justification: unknown is used here because search filters accept heterogeneous entity criteria with arbitrary nested operators
	filter: z.record(z.string(), z.unknown()).optional(),
});

// OUTPUT SCHEMAS

export const ChannelDataSchema = DovetailChannel.extend({
	url: z.string().optional(),
	topics: z.array(DovetailTopic).optional(),
	project_category: z.object({ id: z.string() }).nullable().optional(),
});

export const ChannelResponseSchema = z.object({
	data: ChannelDataSchema,
});

export const ChannelDeleteResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		title: z.string(),
		deleted_at: z.string(),
		deleted: z.boolean(),
		url: z.string().optional(),
	}),
});

export const DataPointResponseSchema = z.object({
	data: DovetailDataPoint.extend({
		topics: z
			.array(
				z.object({
					id: z.string(),
					title: z.string().optional(),
				}),
			)
			.optional(),
	}),
});

export const TopicResponseSchema = z.object({
	data: DovetailTopic.extend({
		channel: z.object({ id: z.string() }).optional(),
	}),
});

export const TopicDeleteResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		title: z.string(),
		description: z.string().optional(),
		deleted_at: z.string(),
		deleted: z.boolean(),
	}),
});

export const ContactDataSchema = DovetailContact.extend({
	fields: z.array(CustomFieldOutputSchema).optional(),
});

export const ContactResponseSchema = z.object({
	data: ContactDataSchema,
});

export const ContactsListResponseSchema = z.object({
	data: z.array(ContactDataSchema),
	page: PageInfoSchema.optional(),
});

export const DataItemSchema = DovetailData.extend({
	fields: z.array(CustomFieldOutputSchema).optional(),
});

export const DataResponseSchema = z.object({
	data: DataItemSchema,
});

export const DataListResponseSchema = z.object({
	data: z.array(DataItemSchema),
	page: PageInfoSchema.optional(),
});

export const DataExportResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		title: z.string().nullable().optional(),
		content_html: z.string().optional(),
		content_markdown: z.string().optional(),
		content_text: z.string().optional(),
		files: z
			.array(
				z.object({
					id: z.string(),
					name: z.string().optional(),
					text_status: z.string().optional(),
				}),
			)
			.optional(),
		indexed: z.boolean().optional(),
		truncated: z.boolean().optional(),
	}),
});

export const DocItemSchema = DovetailDoc.extend({
	fields: z.array(CustomFieldOutputSchema).optional(),
});

export const DocResponseSchema = z.object({
	data: DocItemSchema,
});

export const DocsListResponseSchema = z.object({
	data: z.array(DocItemSchema),
	page: PageInfoSchema.optional(),
});

export const DocExportResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		title: z.string().nullable().optional(),
		content_html: z.string().optional(),
		content_markdown: z.string().optional(),
	}),
});

export const InsightItemSchema = DovetailInsight.extend({
	fields: z.array(CustomFieldOutputSchema).optional(),
});

export const InsightResponseSchema = z.object({
	data: InsightItemSchema,
});

export const InsightsListResponseSchema = z.object({
	data: z.array(InsightItemSchema),
	page: PageInfoSchema.optional(),
});

export const InsightExportResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		title: z.string().nullable().optional(),
		content_html: z.string().optional(),
		content_markdown: z.string().optional(),
	}),
});

export const NoteItemSchema = DovetailNote.extend({
	fields: z.array(CustomFieldOutputSchema).optional(),
});

export const NoteResponseSchema = z.object({
	data: NoteItemSchema,
});

export const NotesListResponseSchema = z.object({
	data: z.array(NoteItemSchema),
	page: PageInfoSchema.optional(),
});

export const NoteExportResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		title: z.string().nullable().optional(),
		content_html: z.string().optional(),
		content_markdown: z.string().optional(),
	}),
});

export const ProjectItemSchema = DovetailProject.extend({
	overview: z.string().nullable().optional(),
});

export const ProjectResponseSchema = z.object({
	data: ProjectItemSchema,
});

export const ProjectsListResponseSchema = z.object({
	data: z.array(ProjectItemSchema),
	page: PageInfoSchema.optional(),
});

export const FolderItemSchema = DovetailFolder.extend({
	folders: z.array(z.string()).nullable().optional(),
});

export const FolderResponseSchema = z.object({
	data: FolderItemSchema,
});

export const FoldersListResponseSchema = z.object({
	data: z.array(FolderItemSchema),
	page: PageInfoSchema.optional(),
});

export const FileResponseSchema = z.object({
	data: DovetailFile.extend({
		download_url: z.string().optional(),
	}),
});

export const HighlightsListResponseSchema = z.object({
	data: z.array(DovetailHighlight),
	page: PageInfoSchema.optional(),
});

export const TagsListResponseSchema = z.object({
	data: z.array(DovetailTag),
	page: PageInfoSchema.optional(),
});

export const TokenInfoResponseSchema = z.object({
	data: z.object({
		id: z.string(),
		subdomain: z.string(),
	}),
});

export const MagicSearchResponseSchema = z.object({
	// Justification: unknown is used here because search results contain heterogeneous entity formats (highlights, notes, insights, channels, tags, themes)
	highlights: z.array(z.unknown()).optional(),
	// Justification: unknown is used here because search results contain heterogeneous entity formats
	notes: z.array(z.unknown()).optional(),
	// Justification: unknown is used here because search results contain heterogeneous entity formats
	insights: z.array(z.unknown()).optional(),
	// Justification: unknown is used here because search results contain heterogeneous entity formats
	channels: z.array(z.unknown()).optional(),
	// Justification: unknown is used here because search results contain heterogeneous entity formats
	tags: z.array(z.unknown()).optional(),
	// Justification: unknown is used here because search results contain heterogeneous entity formats
	themes: z.array(z.unknown()).optional(),
});

// MAPS FOR CORSAIR ENDPOINTS

export const DovetailEndpointInputSchemas = {
	channelsCreate: ChannelsCreateInputSchema,
	channelsUpdate: ChannelsUpdateInputSchema,
	channelsDelete: ChannelsDeleteInputSchema,
	channelsCreateDataPoint: ChannelsCreateDataPointInputSchema,
	channelsCreateTopic: ChannelsCreateTopicInputSchema,
	channelsUpdateTopic: ChannelsUpdateTopicInputSchema,
	channelsDeleteTopic: ChannelsDeleteTopicInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsList: ContactsListInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	dataCreate: DataCreateInputSchema,
	dataGet: DataGetInputSchema,
	dataList: DataListInputSchema,
	dataUpdate: DataUpdateInputSchema,
	dataDelete: DataDeleteInputSchema,
	dataExport: DataExportInputSchema,
	dataImportFile: DataImportFileInputSchema,
	docsCreate: DocsCreateInputSchema,
	docsGet: DocsGetInputSchema,
	docsList: DocsListInputSchema,
	docsUpdate: DocsUpdateInputSchema,
	docsDelete: DocsDeleteInputSchema,
	docsExport: DocsExportInputSchema,
	docsImportFile: DocsImportFileInputSchema,
	docsListUserDocs: DocsListUserDocsInputSchema,
	insightsCreate: InsightsCreateInputSchema,
	insightsGet: InsightsGetInputSchema,
	insightsList: InsightsListInputSchema,
	insightsUpdate: InsightsUpdateInputSchema,
	insightsDelete: InsightsDeleteInputSchema,
	insightsExport: InsightsExportInputSchema,
	insightsImportFile: InsightsImportFileInputSchema,
	insightsListUserInsights: InsightsListUserInsightsInputSchema,
	notesCreate: NotesCreateInputSchema,
	notesGet: NotesGetInputSchema,
	notesList: NotesListInputSchema,
	notesUpdate: NotesUpdateInputSchema,
	notesDelete: NotesDeleteInputSchema,
	notesExport: NotesExportInputSchema,
	notesImportFile: NotesImportFileInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsList: ProjectsListInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersList: FoldersListInputSchema,
	filesGet: FilesGetInputSchema,
	highlightsList: HighlightsListInputSchema,
	tagsList: TagsListInputSchema,
	tokenGetInfo: TokenGetInfoInputSchema,
	searchMagicSearch: SearchMagicSearchInputSchema,
};

export const DovetailEndpointOutputSchemas = {
	channelsCreate: ChannelResponseSchema,
	channelsUpdate: ChannelResponseSchema,
	channelsDelete: ChannelDeleteResponseSchema,
	channelsCreateDataPoint: DataPointResponseSchema,
	channelsCreateTopic: TopicResponseSchema,
	channelsUpdateTopic: TopicResponseSchema,
	channelsDeleteTopic: TopicDeleteResponseSchema,
	contactsCreate: ContactResponseSchema,
	contactsGet: ContactResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsUpdate: ContactResponseSchema,
	dataCreate: DataResponseSchema,
	dataGet: DataResponseSchema,
	dataList: DataListResponseSchema,
	dataUpdate: DataResponseSchema,
	dataDelete: DataResponseSchema,
	dataExport: DataExportResponseSchema,
	dataImportFile: DataResponseSchema,
	docsCreate: DocResponseSchema,
	docsGet: DocResponseSchema,
	docsList: DocsListResponseSchema,
	docsUpdate: DocResponseSchema,
	docsDelete: DocResponseSchema,
	docsExport: DocExportResponseSchema,
	docsImportFile: DocResponseSchema,
	docsListUserDocs: DocsListResponseSchema,
	insightsCreate: InsightResponseSchema,
	insightsGet: InsightResponseSchema,
	insightsList: InsightsListResponseSchema,
	insightsUpdate: InsightResponseSchema,
	insightsDelete: InsightResponseSchema,
	insightsExport: InsightExportResponseSchema,
	insightsImportFile: InsightResponseSchema,
	insightsListUserInsights: InsightsListResponseSchema,
	notesCreate: NoteResponseSchema,
	notesGet: NoteResponseSchema,
	notesList: NotesListResponseSchema,
	notesUpdate: NoteResponseSchema,
	notesDelete: NoteResponseSchema,
	notesExport: NoteExportResponseSchema,
	notesImportFile: NoteResponseSchema,
	projectsCreate: ProjectResponseSchema,
	projectsGet: ProjectResponseSchema,
	projectsList: ProjectsListResponseSchema,
	foldersGet: FolderResponseSchema,
	foldersList: FoldersListResponseSchema,
	filesGet: FileResponseSchema,
	highlightsList: HighlightsListResponseSchema,
	tagsList: TagsListResponseSchema,
	tokenGetInfo: TokenInfoResponseSchema,
	searchMagicSearch: MagicSearchResponseSchema,
};

// Aliases required by scripts/validate-plugins.ts
export const EndpointInputSchemas = DovetailEndpointInputSchemas;
export const EndpointOutputSchemas = DovetailEndpointOutputSchemas;

export type DovetailEndpointInputs = {
	[K in keyof typeof DovetailEndpointInputSchemas]: z.infer<
		(typeof DovetailEndpointInputSchemas)[K]
	>;
};

export type DovetailEndpointOutputs = {
	[K in keyof typeof DovetailEndpointOutputSchemas]: z.infer<
		(typeof DovetailEndpointOutputSchemas)[K]
	>;
};
