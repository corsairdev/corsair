import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Channels,
	Contacts,
	Data,
	Docs,
	Files,
	Folders,
	Highlights,
	Insights,
	Notes,
	Projects,
	Search,
	Tags,
	Token,
} from './endpoints';
import type {
	DovetailEndpointInputs,
	DovetailEndpointOutputs,
} from './endpoints/types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DovetailSchema } from './schema';

export type DovetailPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDovetailPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dovetailEndpointsNested>;
};

export type DovetailContext = CorsairPluginContext<
	typeof DovetailSchema,
	DovetailPluginOptions
>;

export type DovetailKeyBuilderContext =
	KeyBuilderContext<DovetailPluginOptions>;

export type DovetailBoundEndpoints = BindEndpoints<
	typeof dovetailEndpointsNested
>;

type DovetailEndpoint<K extends keyof DovetailEndpointOutputs> =
	CorsairEndpoint<
		DovetailContext,
		DovetailEndpointInputs[K],
		DovetailEndpointOutputs[K]
	>;

export type DovetailEndpoints = {
	channelsCreate: DovetailEndpoint<'channelsCreate'>;
	channelsUpdate: DovetailEndpoint<'channelsUpdate'>;
	channelsDelete: DovetailEndpoint<'channelsDelete'>;
	channelsCreateDataPoint: DovetailEndpoint<'channelsCreateDataPoint'>;
	channelsCreateTopic: DovetailEndpoint<'channelsCreateTopic'>;
	channelsUpdateTopic: DovetailEndpoint<'channelsUpdateTopic'>;
	channelsDeleteTopic: DovetailEndpoint<'channelsDeleteTopic'>;
	contactsCreate: DovetailEndpoint<'contactsCreate'>;
	contactsGet: DovetailEndpoint<'contactsGet'>;
	contactsList: DovetailEndpoint<'contactsList'>;
	contactsUpdate: DovetailEndpoint<'contactsUpdate'>;
	dataCreate: DovetailEndpoint<'dataCreate'>;
	dataGet: DovetailEndpoint<'dataGet'>;
	dataList: DovetailEndpoint<'dataList'>;
	dataUpdate: DovetailEndpoint<'dataUpdate'>;
	dataDelete: DovetailEndpoint<'dataDelete'>;
	dataExport: DovetailEndpoint<'dataExport'>;
	dataImportFile: DovetailEndpoint<'dataImportFile'>;
	docsCreate: DovetailEndpoint<'docsCreate'>;
	docsGet: DovetailEndpoint<'docsGet'>;
	docsList: DovetailEndpoint<'docsList'>;
	docsUpdate: DovetailEndpoint<'docsUpdate'>;
	docsDelete: DovetailEndpoint<'docsDelete'>;
	docsExport: DovetailEndpoint<'docsExport'>;
	docsImportFile: DovetailEndpoint<'docsImportFile'>;
	docsListUserDocs: DovetailEndpoint<'docsListUserDocs'>;
	insightsCreate: DovetailEndpoint<'insightsCreate'>;
	insightsGet: DovetailEndpoint<'insightsGet'>;
	insightsList: DovetailEndpoint<'insightsList'>;
	insightsUpdate: DovetailEndpoint<'insightsUpdate'>;
	insightsDelete: DovetailEndpoint<'insightsDelete'>;
	insightsExport: DovetailEndpoint<'insightsExport'>;
	insightsImportFile: DovetailEndpoint<'insightsImportFile'>;
	insightsListUserInsights: DovetailEndpoint<'insightsListUserInsights'>;
	notesCreate: DovetailEndpoint<'notesCreate'>;
	notesGet: DovetailEndpoint<'notesGet'>;
	notesList: DovetailEndpoint<'notesList'>;
	notesUpdate: DovetailEndpoint<'notesUpdate'>;
	notesDelete: DovetailEndpoint<'notesDelete'>;
	notesExport: DovetailEndpoint<'notesExport'>;
	notesImportFile: DovetailEndpoint<'notesImportFile'>;
	projectsCreate: DovetailEndpoint<'projectsCreate'>;
	projectsGet: DovetailEndpoint<'projectsGet'>;
	projectsList: DovetailEndpoint<'projectsList'>;
	foldersGet: DovetailEndpoint<'foldersGet'>;
	foldersList: DovetailEndpoint<'foldersList'>;
	filesGet: DovetailEndpoint<'filesGet'>;
	highlightsList: DovetailEndpoint<'highlightsList'>;
	tagsList: DovetailEndpoint<'tagsList'>;
	tokenGetInfo: DovetailEndpoint<'tokenGetInfo'>;
	searchMagicSearch: DovetailEndpoint<'searchMagicSearch'>;
};

export type DovetailWebhooks = Record<string, never>;
export type DovetailBoundWebhooks = Record<string, never>;

const dovetailEndpointsNested = {
	channels: {
		create: Channels.create,
		update: Channels.update,
		delete: Channels.deleteChannel,
		createDataPoint: Channels.createDataPoint,
		createTopic: Channels.createTopic,
		updateTopic: Channels.updateTopic,
		deleteTopic: Channels.deleteTopic,
	},
	contacts: {
		create: Contacts.create,
		get: Contacts.get,
		list: Contacts.list,
		update: Contacts.update,
	},
	data: {
		create: Data.create,
		get: Data.get,
		list: Data.list,
		update: Data.update,
		delete: Data.deleteData,
		export: Data.exportData,
		importFile: Data.importFile,
	},
	docs: {
		create: Docs.create,
		get: Docs.get,
		list: Docs.list,
		update: Docs.update,
		delete: Docs.deleteDoc,
		export: Docs.exportDoc,
		importFile: Docs.importFile,
		listUserDocs: Docs.listUserDocs,
	},
	insights: {
		create: Insights.create,
		get: Insights.get,
		list: Insights.list,
		update: Insights.update,
		delete: Insights.deleteInsight,
		export: Insights.exportInsight,
		importFile: Insights.importFile,
		listUserInsights: Insights.listUserInsights,
	},
	notes: {
		create: Notes.create,
		get: Notes.get,
		list: Notes.list,
		update: Notes.update,
		delete: Notes.deleteNote,
		export: Notes.exportNote,
		importFile: Notes.importFile,
	},
	projects: {
		create: Projects.create,
		get: Projects.get,
		list: Projects.list,
	},
	folders: {
		get: Folders.get,
		list: Folders.list,
	},
	files: {
		get: Files.get,
	},
	highlights: {
		list: Highlights.list,
	},
	tags: {
		list: Tags.list,
	},
	token: {
		getInfo: Token.getInfo,
	},
	search: {
		magicSearch: Search.magicSearch,
	},
} as const;

const dovetailWebhooksNested = {} as const;

export const dovetailEndpointSchemas = {
	'channels.create': {
		input: DovetailEndpointInputSchemas.channelsCreate,
		output: DovetailEndpointOutputSchemas.channelsCreate,
	},
	'channels.update': {
		input: DovetailEndpointInputSchemas.channelsUpdate,
		output: DovetailEndpointOutputSchemas.channelsUpdate,
	},
	'channels.delete': {
		input: DovetailEndpointInputSchemas.channelsDelete,
		output: DovetailEndpointOutputSchemas.channelsDelete,
	},
	'channels.createDataPoint': {
		input: DovetailEndpointInputSchemas.channelsCreateDataPoint,
		output: DovetailEndpointOutputSchemas.channelsCreateDataPoint,
	},
	'channels.createTopic': {
		input: DovetailEndpointInputSchemas.channelsCreateTopic,
		output: DovetailEndpointOutputSchemas.channelsCreateTopic,
	},
	'channels.updateTopic': {
		input: DovetailEndpointInputSchemas.channelsUpdateTopic,
		output: DovetailEndpointOutputSchemas.channelsUpdateTopic,
	},
	'channels.deleteTopic': {
		input: DovetailEndpointInputSchemas.channelsDeleteTopic,
		output: DovetailEndpointOutputSchemas.channelsDeleteTopic,
	},
	'contacts.create': {
		input: DovetailEndpointInputSchemas.contactsCreate,
		output: DovetailEndpointOutputSchemas.contactsCreate,
	},
	'contacts.get': {
		input: DovetailEndpointInputSchemas.contactsGet,
		output: DovetailEndpointOutputSchemas.contactsGet,
	},
	'contacts.list': {
		input: DovetailEndpointInputSchemas.contactsList,
		output: DovetailEndpointOutputSchemas.contactsList,
	},
	'contacts.update': {
		input: DovetailEndpointInputSchemas.contactsUpdate,
		output: DovetailEndpointOutputSchemas.contactsUpdate,
	},
	'data.create': {
		input: DovetailEndpointInputSchemas.dataCreate,
		output: DovetailEndpointOutputSchemas.dataCreate,
	},
	'data.get': {
		input: DovetailEndpointInputSchemas.dataGet,
		output: DovetailEndpointOutputSchemas.dataGet,
	},
	'data.list': {
		input: DovetailEndpointInputSchemas.dataList,
		output: DovetailEndpointOutputSchemas.dataList,
	},
	'data.update': {
		input: DovetailEndpointInputSchemas.dataUpdate,
		output: DovetailEndpointOutputSchemas.dataUpdate,
	},
	'data.delete': {
		input: DovetailEndpointInputSchemas.dataDelete,
		output: DovetailEndpointOutputSchemas.dataDelete,
	},
	'data.export': {
		input: DovetailEndpointInputSchemas.dataExport,
		output: DovetailEndpointOutputSchemas.dataExport,
	},
	'data.importFile': {
		input: DovetailEndpointInputSchemas.dataImportFile,
		output: DovetailEndpointOutputSchemas.dataImportFile,
	},
	'docs.create': {
		input: DovetailEndpointInputSchemas.docsCreate,
		output: DovetailEndpointOutputSchemas.docsCreate,
	},
	'docs.get': {
		input: DovetailEndpointInputSchemas.docsGet,
		output: DovetailEndpointOutputSchemas.docsGet,
	},
	'docs.list': {
		input: DovetailEndpointInputSchemas.docsList,
		output: DovetailEndpointOutputSchemas.docsList,
	},
	'docs.update': {
		input: DovetailEndpointInputSchemas.docsUpdate,
		output: DovetailEndpointOutputSchemas.docsUpdate,
	},
	'docs.delete': {
		input: DovetailEndpointInputSchemas.docsDelete,
		output: DovetailEndpointOutputSchemas.docsDelete,
	},
	'docs.export': {
		input: DovetailEndpointInputSchemas.docsExport,
		output: DovetailEndpointOutputSchemas.docsExport,
	},
	'docs.importFile': {
		input: DovetailEndpointInputSchemas.docsImportFile,
		output: DovetailEndpointOutputSchemas.docsImportFile,
	},
	'docs.listUserDocs': {
		input: DovetailEndpointInputSchemas.docsListUserDocs,
		output: DovetailEndpointOutputSchemas.docsListUserDocs,
	},
	'insights.create': {
		input: DovetailEndpointInputSchemas.insightsCreate,
		output: DovetailEndpointOutputSchemas.insightsCreate,
	},
	'insights.get': {
		input: DovetailEndpointInputSchemas.insightsGet,
		output: DovetailEndpointOutputSchemas.insightsGet,
	},
	'insights.list': {
		input: DovetailEndpointInputSchemas.insightsList,
		output: DovetailEndpointOutputSchemas.insightsList,
	},
	'insights.update': {
		input: DovetailEndpointInputSchemas.insightsUpdate,
		output: DovetailEndpointOutputSchemas.insightsUpdate,
	},
	'insights.delete': {
		input: DovetailEndpointInputSchemas.insightsDelete,
		output: DovetailEndpointOutputSchemas.insightsDelete,
	},
	'insights.export': {
		input: DovetailEndpointInputSchemas.insightsExport,
		output: DovetailEndpointOutputSchemas.insightsExport,
	},
	'insights.importFile': {
		input: DovetailEndpointInputSchemas.insightsImportFile,
		output: DovetailEndpointOutputSchemas.insightsImportFile,
	},
	'insights.listUserInsights': {
		input: DovetailEndpointInputSchemas.insightsListUserInsights,
		output: DovetailEndpointOutputSchemas.insightsListUserInsights,
	},
	'notes.create': {
		input: DovetailEndpointInputSchemas.notesCreate,
		output: DovetailEndpointOutputSchemas.notesCreate,
	},
	'notes.get': {
		input: DovetailEndpointInputSchemas.notesGet,
		output: DovetailEndpointOutputSchemas.notesGet,
	},
	'notes.list': {
		input: DovetailEndpointInputSchemas.notesList,
		output: DovetailEndpointOutputSchemas.notesList,
	},
	'notes.update': {
		input: DovetailEndpointInputSchemas.notesUpdate,
		output: DovetailEndpointOutputSchemas.notesUpdate,
	},
	'notes.delete': {
		input: DovetailEndpointInputSchemas.notesDelete,
		output: DovetailEndpointOutputSchemas.notesDelete,
	},
	'notes.export': {
		input: DovetailEndpointInputSchemas.notesExport,
		output: DovetailEndpointOutputSchemas.notesExport,
	},
	'notes.importFile': {
		input: DovetailEndpointInputSchemas.notesImportFile,
		output: DovetailEndpointOutputSchemas.notesImportFile,
	},
	'projects.create': {
		input: DovetailEndpointInputSchemas.projectsCreate,
		output: DovetailEndpointOutputSchemas.projectsCreate,
	},
	'projects.get': {
		input: DovetailEndpointInputSchemas.projectsGet,
		output: DovetailEndpointOutputSchemas.projectsGet,
	},
	'projects.list': {
		input: DovetailEndpointInputSchemas.projectsList,
		output: DovetailEndpointOutputSchemas.projectsList,
	},
	'folders.get': {
		input: DovetailEndpointInputSchemas.foldersGet,
		output: DovetailEndpointOutputSchemas.foldersGet,
	},
	'folders.list': {
		input: DovetailEndpointInputSchemas.foldersList,
		output: DovetailEndpointOutputSchemas.foldersList,
	},
	'files.get': {
		input: DovetailEndpointInputSchemas.filesGet,
		output: DovetailEndpointOutputSchemas.filesGet,
	},
	'highlights.list': {
		input: DovetailEndpointInputSchemas.highlightsList,
		output: DovetailEndpointOutputSchemas.highlightsList,
	},
	'tags.list': {
		input: DovetailEndpointInputSchemas.tagsList,
		output: DovetailEndpointOutputSchemas.tagsList,
	},
	'token.getInfo': {
		input: DovetailEndpointInputSchemas.tokenGetInfo,
		output: DovetailEndpointOutputSchemas.tokenGetInfo,
	},
	'search.magicSearch': {
		input: DovetailEndpointInputSchemas.searchMagicSearch,
		output: DovetailEndpointOutputSchemas.searchMagicSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dovetailEndpointsNested
>;

const dovetailWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof dovetailWebhooksNested
	>;

const defaultAuthType: 'api_key' = 'api_key';

export const dovetailEndpointMeta = {
	'channels.create': {
		riskLevel: 'write',
		description:
			'Creates a new channel in Dovetail to organize and collect feedback data. Channels are containers for specific types of customer feedback such as app reviews, NPS responses, churn reasons, product reviews, or support tickets. Use this to set up a new data collection source before importing feedback data.',
	},
	'channels.update': {
		riskLevel: 'write',
		description:
			"Tool to update an existing channel's title or context. Use after confirming the channel ID and fields to change.",
	},
	'channels.delete': {
		riskLevel: 'destructive',
		description:
			"Tool to delete an existing channel. Use when you need to remove a channel and move it to the project's trash (restorable for 30 days). Confirm the channel ID before calling.",
	},
	'channels.createDataPoint': {
		riskLevel: 'write',
		description:
			'Tool to create a data point within a channel. Use after capturing new content to record and classify it in Dovetail.',
	},
	'channels.createTopic': {
		riskLevel: 'write',
		description:
			'Tool to create a new topic in a Dovetail channel. Requires channel_id, title, and description. Use to organize feedback within channels by creating themed discussion topics.',
	},
	'channels.updateTopic': {
		riskLevel: 'write',
		description:
			'Tool to update an existing topic. Use after confirming the topic ID and fields to change. Example: "Update topic with id 123... to have title \'New\'".',
	},
	'channels.deleteTopic': {
		riskLevel: 'destructive',
		description:
			'Tool to delete an existing topic. Use when you have confirmed the topic ID and want to move it to trash (restorable for 30 days). Example: "Delete topic with ID 123e4567-e89b-12d3-a456-426614174000."',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Tool to create a new contact in Dovetail. Use when you need to register a contact before logging interactions.',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific contact. Use when you have confirmed the contact ID and need full contact metadata from Dovetail.',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'Retrieves a paginated list of contacts from a Dovetail workspace. Returns contact IDs, names, creation timestamps, and custom fields. Use cursor-based pagination (limit + start_cursor) to navigate large contact lists efficiently.',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			"Tool to update an existing contact in Dovetail. Use when you need to modify a contact's name, email, or custom fields.",
	},
	'data.create': {
		riskLevel: 'write',
		description:
			'Tool to create a data item in a Dovetail project with text content, title, and/or structured fields. Use when you need to capture and store research data, interview notes, or other content in a project.',
	},
	'data.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific data item by ID. Use when you have confirmed the data ID and need full metadata including custom fields, files, and project information from Dovetail.',
	},
	'data.list': {
		riskLevel: 'read',
		description:
			'Tool to list data items in Dovetail. Use when you need to retrieve, filter, sort, or paginate through your workspace data. Supports filtering by created_at (date range), project_id, and title. Results can be sorted by created_at or title. Uses cursor-based pagination with configurable page size.',
	},
	'data.update': {
		riskLevel: 'write',
		description:
			'Tool to update a data item in Dovetail. Use when you need to modify the title or fields of an existing data item.',
	},
	'data.delete': {
		riskLevel: 'destructive',
		description:
			'Tool to delete an existing data item. Use when you have confirmed the data ID and want to move it to trash (restorable for 30 days). Example: "Delete data with ID 1tFfvvAmYPCLUqb9zO8dgN."',
	},
	'data.export': {
		riskLevel: 'read',
		description:
			'Tool to export data in HTML or Markdown format. Use when you need to retrieve a formatted version of data items from Dovetail.',
	},
	'data.importFile': {
		riskLevel: 'write',
		description:
			'Tool to import a public URL of a file as new data in Dovetail. Use when you need to add external files to a project.',
	},
	'docs.create': {
		riskLevel: 'write',
		description:
			'Tool to create a doc in a Dovetail project with text content, title and/or custom fields. Use when you need to document research findings, store notes, or create structured content within a project. The doc content is stored but not returned in the response.',
	},
	'docs.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific doc by ID. Use when you have confirmed the doc ID and need full doc metadata from Dovetail.',
	},
	'docs.list': {
		riskLevel: 'read',
		description:
			'Tool to list docs in a Dovetail workspace with optional filtering, sorting, and pagination. Use when you need to retrieve docs, optionally filtered by project, title, content, or creation date.',
	},
	'docs.update': {
		riskLevel: 'write',
		description:
			"Tool to update a doc in Dovetail. Use when you need to modify a doc's title or custom fields.",
	},
	'docs.delete': {
		riskLevel: 'destructive',
		description:
			"Tool to delete an existing doc. Use when you need to remove a doc and move it to the project's trash (restorable for 30 days).",
	},
	'docs.export': {
		riskLevel: 'read',
		description:
			'Tool to export a doc in HTML or Markdown format. Use when you need to retrieve the full content of a doc from Dovetail in a specific format.',
	},
	'docs.importFile': {
		riskLevel: 'write',
		description:
			'Tool to import a public file URL as a new doc in Dovetail. Use when you need to create a doc from an external file source. The file must be publicly accessible at the provided URL.',
	},
	'docs.listUserDocs': {
		riskLevel: 'read',
		description:
			"Tool to get a list of docs associated with a user in Dovetail. Use when you need to retrieve documents for a specific user or the authenticated user (use 'me' as user_id).",
	},
	'insights.create': {
		riskLevel: 'write',
		description:
			"Creates a new insight in Dovetail to store synthesized research findings, observations, or conclusions. Use this tool when you need to document and save key findings from user research, interviews, or data analysis. Insights can optionally be linked to a project for better organization. Returns the created insight's ID, title, creation timestamp, and other metadata. Note: The body content is stored but not included in the response.",
	},
	'insights.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific insight by ID. Use when you need full insight metadata from Dovetail.',
	},
	'insights.list': {
		riskLevel: 'read',
		description:
			'Tool to get a list of insights associated with a workspace. Use when you need to retrieve insights with optional filtering by project, publication status, or title, and support for cursor-based pagination.',
	},
	'insights.update': {
		riskLevel: 'write',
		description:
			'Updates an existing insight in Dovetail, allowing you to modify the title and custom fields. Use when you need to revise insight information, correct titles, or update custom field values.',
	},
	'insights.delete': {
		riskLevel: 'destructive',
		description:
			'Tool to delete an existing insight. Use when you have confirmed the insight ID and want to move it to trash (restorable for 30 days).',
	},
	'insights.export': {
		riskLevel: 'read',
		description:
			"Tool to export an insight in HTML or Markdown format. Use when you need to retrieve the full content of an insight for documentation, reporting, or sharing purposes. The exported content includes the insight's title and body in the specified format.",
	},
	'insights.importFile': {
		riskLevel: 'write',
		description:
			'Tool to import a file from a public URL as a new insight in Dovetail. Use when you need to create an insight from an external file source such as PDFs, images, or documents. The file must be publicly accessible for Dovetail to fetch and import it. After import, the insight can be analyzed, tagged, and connected to projects.',
	},
	'insights.listUserInsights': {
		riskLevel: 'read',
		description:
			'List personal insights for a user in Dovetail. Returns a paginated list of insights including their IDs, titles, creation dates, and published status. Use DOVETAIL_GET_TOKEN_INFO to obtain a valid user_id.',
	},
	'notes.create': {
		riskLevel: 'write',
		description:
			'Tool to create a note in a Dovetail project with text content, title and/or custom fields. Use when you need to document research notes, store interview findings, or create structured content within a project. The note content is stored but not returned in the response.',
	},
	'notes.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific note. Use when you have confirmed the note ID and need full note metadata from Dovetail.',
	},
	'notes.list': {
		riskLevel: 'read',
		description:
			'List notes in Dovetail workspace with optional pagination and sorting. Use this tool to retrieve notes from your Dovetail workspace. Supports pagination for large result sets and sorting options. Returns note metadata including IDs, titles, timestamps, and associated project information.',
	},
	'notes.update': {
		riskLevel: 'write',
		description:
			"Tool to update an existing note in Dovetail. Use when you need to modify a note's title, content, or custom fields. Example: \"Update note 8IFq5LEC6hV1Vgsu0jPNJ with new title 'Q1 Review'\".",
	},
	'notes.delete': {
		riskLevel: 'destructive',
		description:
			'Tool to delete an existing note. Use when you have confirmed the note ID and want to move it to trash (restorable for 30 days).',
	},
	'notes.export': {
		riskLevel: 'read',
		description:
			'Tool to export a note from Dovetail in HTML or Markdown format. Use when you need to retrieve the full content of a note in a specific export format.',
	},
	'notes.importFile': {
		riskLevel: 'write',
		description:
			'Tool to import a file from a public URL as a new note in Dovetail. Use when you need to create a note by importing content from an accessible file URL (PDF, video, audio, etc.).',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Tool to create a new project in your Dovetail workspace. Use when you need to create a project to organize research data.',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific project. Use when you have confirmed the project ID and need full project metadata from Dovetail.',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'Tool to list all projects in Dovetail. Use after authenticating with a valid workspace token when you need to retrieve the full project list.',
	},
	'folders.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific folder. Use when you have confirmed the folder ID and need full folder metadata from Dovetail.',
	},
	'folders.list': {
		riskLevel: 'read',
		description:
			'Tool to get a list of folders associated with a workspace. Use when you need to retrieve folder hierarchy, search for folders by title, or navigate the folder structure with pagination support.',
	},
	'files.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific file by its ID. Use when you need file metadata, download URL, or processing status from Dovetail.',
	},
	'highlights.list': {
		riskLevel: 'read',
		description:
			'List highlights from your Dovetail workspace with optional filtering and pagination. Use this action to retrieve highlights that have been created across your notes and projects. Supports filtering by project or note, and cursor-based pagination for large result sets.',
	},
	'tags.list': {
		riskLevel: 'read',
		description:
			'List all tags in the authenticated Dovetail workspace. Returns tag details including title, color, highlight count, and timestamps. Supports pagination for workspaces with many tags.',
	},
	'token.getInfo': {
		riskLevel: 'read',
		description:
			'Retrieves information about the current API token, including its unique identifier and the associated workspace subdomain. Use this to verify which workspace the token belongs to.',
	},
	'search.magicSearch': {
		riskLevel: 'read',
		description:
			'Tool to perform a magic search across workspace data. Use when you need to retrieve relevant highlights, notes, insights, channels, themes, or tags by query.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof dovetailEndpointsNested>;

export const dovetailAuthConfig = {
	api_key: {
		account: ['tenant_external_id'],
	},
} as const satisfies PluginAuthConfig;

export type BaseDovetailPlugin<T extends DovetailPluginOptions> = CorsairPlugin<
	'dovetail',
	typeof DovetailSchema,
	typeof dovetailEndpointsNested,
	typeof dovetailWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDovetailPlugin = BaseDovetailPlugin<DovetailPluginOptions>;

export type ExternalDovetailPlugin<T extends DovetailPluginOptions> =
	BaseDovetailPlugin<T>;

export function dovetail(
	incomingOptions?: DovetailPluginOptions,
): InternalDovetailPlugin {
	const options: DovetailPluginOptions = {
		...(incomingOptions ?? {}),
		authType: incomingOptions?.authType ?? defaultAuthType,
	};
	return {
		id: 'dovetail',
		authConfig: dovetailAuthConfig,
		schema: DovetailSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: dovetailEndpointsNested,
		webhooks: dovetailWebhooksNested,
		endpointMeta: dovetailEndpointMeta,
		endpointSchemas: dovetailEndpointSchemas,
		webhookSchemas: dovetailWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DovetailKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalDovetailPlugin;
}

export type {
	DovetailEndpointInputs,
	DovetailEndpointOutputs,
} from './endpoints/types';
