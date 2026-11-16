import { createHmac, timingSafeEqual } from 'node:crypto';
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	CollectorsEndpoints,
	ContactListsEndpoints,
	ContactsEndpoints,
	FoldersEndpoints,
	MessagesEndpoints,
	PagesEndpoints,
	QuestionsEndpoints,
	RecipientsEndpoints,
	ResponsesEndpoints,
	SurveymonkeyEndpointInputSchemas,
	SurveymonkeyEndpointOutputSchemas,
	SurveysEndpoints,
	UsersEndpoints,
	WebhooksEndpoints,
} from './endpoints';
import type {
	SurveymonkeyEndpointInputs,
	SurveymonkeyEndpointOutputs,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SurveymonkeySchema } from './schema';

export type SurveymonkeyPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/**
	 * The API host, when the account lives on another datacenter. The OAuth token
	 * exchange reports the right one as `access_url`. Only a `surveymonkey.com`
	 * host is accepted, so a stored value cannot redirect the token.
	 */
	apiHost?: string;
	/** An access token. A private app's token from its settings page also works. */
	key?: string;
	/**
	 * The app's API secret, which is the second half of the webhook signature key.
	 * Without it an inbound webhook cannot be verified.
	 */
	clientSecret?: string;
	/** The app's client id, the first half of the webhook signature key. */
	clientId?: string;
	hooks?: InternalSurveymonkeyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof surveymonkeyEndpointsNested>;
};

export type SurveymonkeyContext = CorsairPluginContext<
	typeof SurveymonkeySchema,
	SurveymonkeyPluginOptions,
	undefined,
	typeof surveymonkeyAuthConfig
>;

export type SurveymonkeyKeyBuilderContext = KeyBuilderContext<
	SurveymonkeyPluginOptions,
	typeof surveymonkeyAuthConfig
>;

export type SurveymonkeyBoundEndpoints = BindEndpoints<
	typeof surveymonkeyEndpointsNested
>;

type SurveymonkeyEndpoint<K extends keyof SurveymonkeyEndpointOutputs> =
	CorsairEndpoint<
		SurveymonkeyContext,
		SurveymonkeyEndpointInputs[K],
		SurveymonkeyEndpointOutputs[K]
	>;

export type SurveymonkeyEndpoints = {
	surveysList: SurveymonkeyEndpoint<'surveysList'>;
	surveysCreate: SurveymonkeyEndpoint<'surveysCreate'>;
	surveysGet: SurveymonkeyEndpoint<'surveysGet'>;
	surveysGetDetails: SurveymonkeyEndpoint<'surveysGetDetails'>;
	surveysUpdate: SurveymonkeyEndpoint<'surveysUpdate'>;
	surveysReplace: SurveymonkeyEndpoint<'surveysReplace'>;
	surveysDelete: SurveymonkeyEndpoint<'surveysDelete'>;
	surveysListCategories: SurveymonkeyEndpoint<'surveysListCategories'>;
	surveysListTemplates: SurveymonkeyEndpoint<'surveysListTemplates'>;
	surveysListLanguages: SurveymonkeyEndpoint<'surveysListLanguages'>;
	pagesList: SurveymonkeyEndpoint<'pagesList'>;
	pagesCreate: SurveymonkeyEndpoint<'pagesCreate'>;
	pagesGet: SurveymonkeyEndpoint<'pagesGet'>;
	pagesUpdate: SurveymonkeyEndpoint<'pagesUpdate'>;
	pagesDelete: SurveymonkeyEndpoint<'pagesDelete'>;
	questionsList: SurveymonkeyEndpoint<'questionsList'>;
	questionsCreate: SurveymonkeyEndpoint<'questionsCreate'>;
	questionsGet: SurveymonkeyEndpoint<'questionsGet'>;
	questionsUpdate: SurveymonkeyEndpoint<'questionsUpdate'>;
	questionsDelete: SurveymonkeyEndpoint<'questionsDelete'>;
	responsesList: SurveymonkeyEndpoint<'responsesList'>;
	responsesListBulk: SurveymonkeyEndpoint<'responsesListBulk'>;
	responsesGet: SurveymonkeyEndpoint<'responsesGet'>;
	responsesGetDetails: SurveymonkeyEndpoint<'responsesGetDetails'>;
	responsesCreate: SurveymonkeyEndpoint<'responsesCreate'>;
	responsesDelete: SurveymonkeyEndpoint<'responsesDelete'>;
	responsesDeleteAll: SurveymonkeyEndpoint<'responsesDeleteAll'>;
	collectorsList: SurveymonkeyEndpoint<'collectorsList'>;
	collectorsCreate: SurveymonkeyEndpoint<'collectorsCreate'>;
	collectorsGet: SurveymonkeyEndpoint<'collectorsGet'>;
	collectorsUpdate: SurveymonkeyEndpoint<'collectorsUpdate'>;
	collectorsDelete: SurveymonkeyEndpoint<'collectorsDelete'>;
	messagesList: SurveymonkeyEndpoint<'messagesList'>;
	messagesCreate: SurveymonkeyEndpoint<'messagesCreate'>;
	messagesGet: SurveymonkeyEndpoint<'messagesGet'>;
	messagesUpdate: SurveymonkeyEndpoint<'messagesUpdate'>;
	messagesSend: SurveymonkeyEndpoint<'messagesSend'>;
	recipientsList: SurveymonkeyEndpoint<'recipientsList'>;
	recipientsCreate: SurveymonkeyEndpoint<'recipientsCreate'>;
	recipientsBulkCreate: SurveymonkeyEndpoint<'recipientsBulkCreate'>;
	contactListsList: SurveymonkeyEndpoint<'contactListsList'>;
	contactListsCreate: SurveymonkeyEndpoint<'contactListsCreate'>;
	contactListsGet: SurveymonkeyEndpoint<'contactListsGet'>;
	contactListsUpdate: SurveymonkeyEndpoint<'contactListsUpdate'>;
	contactListsDelete: SurveymonkeyEndpoint<'contactListsDelete'>;
	contactListsCopy: SurveymonkeyEndpoint<'contactListsCopy'>;
	contactListsMerge: SurveymonkeyEndpoint<'contactListsMerge'>;
	contactsList: SurveymonkeyEndpoint<'contactsList'>;
	contactsCreate: SurveymonkeyEndpoint<'contactsCreate'>;
	contactsBulkCreate: SurveymonkeyEndpoint<'contactsBulkCreate'>;
	contactsGet: SurveymonkeyEndpoint<'contactsGet'>;
	contactsUpdate: SurveymonkeyEndpoint<'contactsUpdate'>;
	contactsDelete: SurveymonkeyEndpoint<'contactsDelete'>;
	contactsListFields: SurveymonkeyEndpoint<'contactsListFields'>;
	contactsUpdateField: SurveymonkeyEndpoint<'contactsUpdateField'>;
	webhooksList: SurveymonkeyEndpoint<'webhooksList'>;
	webhooksCreate: SurveymonkeyEndpoint<'webhooksCreate'>;
	webhooksGet: SurveymonkeyEndpoint<'webhooksGet'>;
	webhooksUpdate: SurveymonkeyEndpoint<'webhooksUpdate'>;
	webhooksDelete: SurveymonkeyEndpoint<'webhooksDelete'>;
	usersGetMe: SurveymonkeyEndpoint<'usersGetMe'>;
	foldersList: SurveymonkeyEndpoint<'foldersList'>;
	foldersCreate: SurveymonkeyEndpoint<'foldersCreate'>;
};

const surveymonkeyEndpointsNested = {
	surveys: SurveysEndpoints,
	pages: PagesEndpoints,
	questions: QuestionsEndpoints,
	responses: ResponsesEndpoints,
	collectors: CollectorsEndpoints,
	messages: MessagesEndpoints,
	recipients: RecipientsEndpoints,
	contactLists: ContactListsEndpoints,
	contacts: ContactsEndpoints,
	webhooks: WebhooksEndpoints,
	users: UsersEndpoints,
	folders: FoldersEndpoints,
} as const;

export const surveymonkeyEndpointSchemas = {
	'surveys.list': {
		input: SurveymonkeyEndpointInputSchemas.surveysList,
		output: SurveymonkeyEndpointOutputSchemas.surveysList,
	},
	'surveys.create': {
		input: SurveymonkeyEndpointInputSchemas.surveysCreate,
		output: SurveymonkeyEndpointOutputSchemas.surveysCreate,
	},
	'surveys.get': {
		input: SurveymonkeyEndpointInputSchemas.surveysGet,
		output: SurveymonkeyEndpointOutputSchemas.surveysGet,
	},
	'surveys.getDetails': {
		input: SurveymonkeyEndpointInputSchemas.surveysGetDetails,
		output: SurveymonkeyEndpointOutputSchemas.surveysGetDetails,
	},
	'surveys.update': {
		input: SurveymonkeyEndpointInputSchemas.surveysUpdate,
		output: SurveymonkeyEndpointOutputSchemas.surveysUpdate,
	},
	'surveys.replace': {
		input: SurveymonkeyEndpointInputSchemas.surveysReplace,
		output: SurveymonkeyEndpointOutputSchemas.surveysReplace,
	},
	'surveys.delete': {
		input: SurveymonkeyEndpointInputSchemas.surveysDelete,
		output: SurveymonkeyEndpointOutputSchemas.surveysDelete,
	},
	'surveys.listCategories': {
		input: SurveymonkeyEndpointInputSchemas.surveysListCategories,
		output: SurveymonkeyEndpointOutputSchemas.surveysListCategories,
	},
	'surveys.listTemplates': {
		input: SurveymonkeyEndpointInputSchemas.surveysListTemplates,
		output: SurveymonkeyEndpointOutputSchemas.surveysListTemplates,
	},
	'surveys.listLanguages': {
		input: SurveymonkeyEndpointInputSchemas.surveysListLanguages,
		output: SurveymonkeyEndpointOutputSchemas.surveysListLanguages,
	},
	'pages.list': {
		input: SurveymonkeyEndpointInputSchemas.pagesList,
		output: SurveymonkeyEndpointOutputSchemas.pagesList,
	},
	'pages.create': {
		input: SurveymonkeyEndpointInputSchemas.pagesCreate,
		output: SurveymonkeyEndpointOutputSchemas.pagesCreate,
	},
	'pages.get': {
		input: SurveymonkeyEndpointInputSchemas.pagesGet,
		output: SurveymonkeyEndpointOutputSchemas.pagesGet,
	},
	'pages.update': {
		input: SurveymonkeyEndpointInputSchemas.pagesUpdate,
		output: SurveymonkeyEndpointOutputSchemas.pagesUpdate,
	},
	'pages.delete': {
		input: SurveymonkeyEndpointInputSchemas.pagesDelete,
		output: SurveymonkeyEndpointOutputSchemas.pagesDelete,
	},
	'questions.list': {
		input: SurveymonkeyEndpointInputSchemas.questionsList,
		output: SurveymonkeyEndpointOutputSchemas.questionsList,
	},
	'questions.create': {
		input: SurveymonkeyEndpointInputSchemas.questionsCreate,
		output: SurveymonkeyEndpointOutputSchemas.questionsCreate,
	},
	'questions.get': {
		input: SurveymonkeyEndpointInputSchemas.questionsGet,
		output: SurveymonkeyEndpointOutputSchemas.questionsGet,
	},
	'questions.update': {
		input: SurveymonkeyEndpointInputSchemas.questionsUpdate,
		output: SurveymonkeyEndpointOutputSchemas.questionsUpdate,
	},
	'questions.delete': {
		input: SurveymonkeyEndpointInputSchemas.questionsDelete,
		output: SurveymonkeyEndpointOutputSchemas.questionsDelete,
	},
	'responses.list': {
		input: SurveymonkeyEndpointInputSchemas.responsesList,
		output: SurveymonkeyEndpointOutputSchemas.responsesList,
	},
	'responses.listBulk': {
		input: SurveymonkeyEndpointInputSchemas.responsesListBulk,
		output: SurveymonkeyEndpointOutputSchemas.responsesListBulk,
	},
	'responses.get': {
		input: SurveymonkeyEndpointInputSchemas.responsesGet,
		output: SurveymonkeyEndpointOutputSchemas.responsesGet,
	},
	'responses.getDetails': {
		input: SurveymonkeyEndpointInputSchemas.responsesGetDetails,
		output: SurveymonkeyEndpointOutputSchemas.responsesGetDetails,
	},
	'responses.create': {
		input: SurveymonkeyEndpointInputSchemas.responsesCreate,
		output: SurveymonkeyEndpointOutputSchemas.responsesCreate,
	},
	'responses.delete': {
		input: SurveymonkeyEndpointInputSchemas.responsesDelete,
		output: SurveymonkeyEndpointOutputSchemas.responsesDelete,
	},
	'responses.deleteAll': {
		input: SurveymonkeyEndpointInputSchemas.responsesDeleteAll,
		output: SurveymonkeyEndpointOutputSchemas.responsesDeleteAll,
	},
	'collectors.list': {
		input: SurveymonkeyEndpointInputSchemas.collectorsList,
		output: SurveymonkeyEndpointOutputSchemas.collectorsList,
	},
	'collectors.create': {
		input: SurveymonkeyEndpointInputSchemas.collectorsCreate,
		output: SurveymonkeyEndpointOutputSchemas.collectorsCreate,
	},
	'collectors.get': {
		input: SurveymonkeyEndpointInputSchemas.collectorsGet,
		output: SurveymonkeyEndpointOutputSchemas.collectorsGet,
	},
	'collectors.update': {
		input: SurveymonkeyEndpointInputSchemas.collectorsUpdate,
		output: SurveymonkeyEndpointOutputSchemas.collectorsUpdate,
	},
	'collectors.delete': {
		input: SurveymonkeyEndpointInputSchemas.collectorsDelete,
		output: SurveymonkeyEndpointOutputSchemas.collectorsDelete,
	},
	'messages.list': {
		input: SurveymonkeyEndpointInputSchemas.messagesList,
		output: SurveymonkeyEndpointOutputSchemas.messagesList,
	},
	'messages.create': {
		input: SurveymonkeyEndpointInputSchemas.messagesCreate,
		output: SurveymonkeyEndpointOutputSchemas.messagesCreate,
	},
	'messages.get': {
		input: SurveymonkeyEndpointInputSchemas.messagesGet,
		output: SurveymonkeyEndpointOutputSchemas.messagesGet,
	},
	'messages.update': {
		input: SurveymonkeyEndpointInputSchemas.messagesUpdate,
		output: SurveymonkeyEndpointOutputSchemas.messagesUpdate,
	},
	'messages.send': {
		input: SurveymonkeyEndpointInputSchemas.messagesSend,
		output: SurveymonkeyEndpointOutputSchemas.messagesSend,
	},
	'recipients.list': {
		input: SurveymonkeyEndpointInputSchemas.recipientsList,
		output: SurveymonkeyEndpointOutputSchemas.recipientsList,
	},
	'recipients.create': {
		input: SurveymonkeyEndpointInputSchemas.recipientsCreate,
		output: SurveymonkeyEndpointOutputSchemas.recipientsCreate,
	},
	'recipients.bulkCreate': {
		input: SurveymonkeyEndpointInputSchemas.recipientsBulkCreate,
		output: SurveymonkeyEndpointOutputSchemas.recipientsBulkCreate,
	},
	'contactLists.list': {
		input: SurveymonkeyEndpointInputSchemas.contactListsList,
		output: SurveymonkeyEndpointOutputSchemas.contactListsList,
	},
	'contactLists.create': {
		input: SurveymonkeyEndpointInputSchemas.contactListsCreate,
		output: SurveymonkeyEndpointOutputSchemas.contactListsCreate,
	},
	'contactLists.get': {
		input: SurveymonkeyEndpointInputSchemas.contactListsGet,
		output: SurveymonkeyEndpointOutputSchemas.contactListsGet,
	},
	'contactLists.update': {
		input: SurveymonkeyEndpointInputSchemas.contactListsUpdate,
		output: SurveymonkeyEndpointOutputSchemas.contactListsUpdate,
	},
	'contactLists.delete': {
		input: SurveymonkeyEndpointInputSchemas.contactListsDelete,
		output: SurveymonkeyEndpointOutputSchemas.contactListsDelete,
	},
	'contactLists.copy': {
		input: SurveymonkeyEndpointInputSchemas.contactListsCopy,
		output: SurveymonkeyEndpointOutputSchemas.contactListsCopy,
	},
	'contactLists.merge': {
		input: SurveymonkeyEndpointInputSchemas.contactListsMerge,
		output: SurveymonkeyEndpointOutputSchemas.contactListsMerge,
	},
	'contacts.list': {
		input: SurveymonkeyEndpointInputSchemas.contactsList,
		output: SurveymonkeyEndpointOutputSchemas.contactsList,
	},
	'contacts.create': {
		input: SurveymonkeyEndpointInputSchemas.contactsCreate,
		output: SurveymonkeyEndpointOutputSchemas.contactsCreate,
	},
	'contacts.bulkCreate': {
		input: SurveymonkeyEndpointInputSchemas.contactsBulkCreate,
		output: SurveymonkeyEndpointOutputSchemas.contactsBulkCreate,
	},
	'contacts.get': {
		input: SurveymonkeyEndpointInputSchemas.contactsGet,
		output: SurveymonkeyEndpointOutputSchemas.contactsGet,
	},
	'contacts.update': {
		input: SurveymonkeyEndpointInputSchemas.contactsUpdate,
		output: SurveymonkeyEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: SurveymonkeyEndpointInputSchemas.contactsDelete,
		output: SurveymonkeyEndpointOutputSchemas.contactsDelete,
	},
	'contacts.listFields': {
		input: SurveymonkeyEndpointInputSchemas.contactsListFields,
		output: SurveymonkeyEndpointOutputSchemas.contactsListFields,
	},
	'contacts.updateField': {
		input: SurveymonkeyEndpointInputSchemas.contactsUpdateField,
		output: SurveymonkeyEndpointOutputSchemas.contactsUpdateField,
	},
	'webhooks.list': {
		input: SurveymonkeyEndpointInputSchemas.webhooksList,
		output: SurveymonkeyEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: SurveymonkeyEndpointInputSchemas.webhooksCreate,
		output: SurveymonkeyEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.get': {
		input: SurveymonkeyEndpointInputSchemas.webhooksGet,
		output: SurveymonkeyEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.update': {
		input: SurveymonkeyEndpointInputSchemas.webhooksUpdate,
		output: SurveymonkeyEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: SurveymonkeyEndpointInputSchemas.webhooksDelete,
		output: SurveymonkeyEndpointOutputSchemas.webhooksDelete,
	},
	'users.getMe': {
		input: SurveymonkeyEndpointInputSchemas.usersGetMe,
		output: SurveymonkeyEndpointOutputSchemas.usersGetMe,
	},
	'folders.list': {
		input: SurveymonkeyEndpointInputSchemas.foldersList,
		output: SurveymonkeyEndpointOutputSchemas.foldersList,
	},
	'folders.create': {
		input: SurveymonkeyEndpointInputSchemas.foldersCreate,
		output: SurveymonkeyEndpointOutputSchemas.foldersCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof surveymonkeyEndpointsNested
>;

const defaultAuthType: 'oauth_2' = 'oauth_2';

/**
 * SurveyMonkey authenticates with an **OAuth 2.0 bearer token**, or a private
 * app's access token from its settings page, which is the same kind of token.
 * Either way one string is enough, so this is an `oauth_2` key and the host is
 * the only account field.
 *
 * The `api_host` account field exists because the token exchange reports an
 * `access_url` per account, and the vendor says an account may live on another
 * datacenter. A tenant controls that value, so it only ever becomes a
 * `surveymonkey.com` host (see `normalizeSurveymonkeyBase`).
 */
export const surveymonkeyAuthConfig = {
	oauth_2: {
		account: ['api_host'] as const,
	},
} as const satisfies PluginAuthConfig;

const surveymonkeyEndpointMeta = {
	'surveys.list': {
		riskLevel: 'read',
		description:
			'List surveys in last-modified order, filtered by title, folder or modification date',
	},
	'surveys.create': {
		riskLevel: 'write',
		description:
			'Create an empty survey, or a copy of a template or an existing survey',
	},
	'surveys.get': {
		riskLevel: 'read',
		description: 'Read one survey with its counts, links and response count',
	},
	'surveys.getDetails': {
		riskLevel: 'read',
		description:
			'Read a survey with every page and question, including choice ids and values',
	},
	'surveys.update': {
		riskLevel: 'write',
		description:
			'Change a survey title, nickname, language, button text, variables or folder',
	},
	'surveys.replace': {
		riskLevel: 'write',
		description:
			'Replace a survey wholesale. Fields left out reset to their defaults, so prefer update',
	},
	'surveys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a survey and its responses. There is no undo and the questions go with it',
	},
	'surveys.listCategories': {
		riskLevel: 'read',
		description: 'List the survey categories available for the language',
	},
	'surveys.listTemplates': {
		riskLevel: 'read',
		description:
			'List the survey templates, optionally filtered by language or category',
	},
	'surveys.listLanguages': {
		riskLevel: 'read',
		description: 'List the languages a survey can be written in',
	},
	'pages.list': {
		riskLevel: 'read',
		description: 'List the pages of a survey in their order',
	},
	'pages.create': {
		riskLevel: 'write',
		description: 'Add a page to a survey, optionally at a given position',
	},
	'pages.get': {
		riskLevel: 'read',
		description: 'Read one page of a survey',
	},
	'pages.update': {
		riskLevel: 'write',
		description: 'Change a page title, description or position',
	},
	'pages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a page and the questions on it. There is no undo',
	},
	'questions.list': {
		riskLevel: 'read',
		description: 'List the questions on one page of a survey',
	},
	'questions.create': {
		riskLevel: 'write',
		description:
			'Add a question to a page. The family and subtype decide the question type, and the headings carry the text',
	},
	'questions.get': {
		riskLevel: 'read',
		description: 'Read one question with its choices and settings',
	},
	'questions.update': {
		riskLevel: 'write',
		description:
			'Change a question heading, position, required rule, visibility or choices',
	},
	'questions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a question and the answers recorded for it. There is no undo',
	},
	'responses.list': {
		riskLevel: 'read',
		description:
			'List a survey response ids, filtered by date or status. Read one to see the answers',
	},
	'responses.listBulk': {
		riskLevel: 'read',
		description:
			'List survey responses with their answers in one call, up to 100 a page',
	},
	'responses.get': {
		riskLevel: 'read',
		description: 'Read one response with its answers',
	},
	'responses.getDetails': {
		riskLevel: 'read',
		description:
			'Read one response with its answers and the page and question detail',
	},
	'responses.create': {
		riskLevel: 'write',
		description:
			'Record a response through a collector, as data entry. Nothing is mailed to a respondent',
	},
	'responses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one response and its answers. The counts on the survey change and there is no undo',
	},
	'responses.deleteAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete every response a collector gathered. There is no undo, and the collector stays open',
	},
	'collectors.list': {
		riskLevel: 'read',
		description: 'List the collectors of a survey with their links and status',
	},
	'collectors.create': {
		riskLevel: 'write',
		description:
			'Create a weblink or email collector for a survey, which is what gives it a public link',
	},
	'collectors.get': {
		riskLevel: 'read',
		description: 'Read one collector with its settings, link and status',
	},
	'collectors.update': {
		riskLevel: 'write',
		description: 'Change a collector settings, or open and close it by status',
	},
	'collectors.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a collector. Its link stops working, and the responses it gathered stay',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List the invite and reminder messages of a collector',
	},
	'messages.create': {
		riskLevel: 'write',
		description:
			'Draft an invite or reminder for an email collector. Nothing is sent until send is called',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Read one message subject and body',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Change a message subject, body or type before it is sent',
	},
	'messages.send': {
		riskLevel: 'destructive',
		description:
			'Send a message to every recipient on it. This mails real people, so check the recipients first',
	},
	'recipients.list': {
		riskLevel: 'read',
		description:
			'List the recipients on one message with their delivery status',
	},
	'recipients.create': {
		riskLevel: 'write',
		description: 'Add one recipient to a message by email address',
	},
	'recipients.bulkCreate': {
		riskLevel: 'write',
		description: 'Add up to a few hundred recipients to a message in one call',
	},
	'contactLists.list': {
		riskLevel: 'read',
		description: 'List the contact lists on the account',
	},
	'contactLists.create': {
		riskLevel: 'write',
		description: 'Create an empty contact list',
	},
	'contactLists.get': {
		riskLevel: 'read',
		description: 'Read one contact list',
	},
	'contactLists.update': {
		riskLevel: 'write',
		description: 'Rename a contact list',
	},
	'contactLists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a contact list. The contacts on it stay on the account',
	},
	'contactLists.copy': {
		riskLevel: 'write',
		description: 'Copy a contact list, optionally under a new name',
	},
	'contactLists.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Move every contact from this list into another. The source list is left empty, so this effectively undoes it',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts on the account, filtered by status or a search field',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact with a name and an email or a phone number',
	},
	'contacts.bulkCreate': {
		riskLevel: 'write',
		description:
			'Create up to a few hundred contacts in one call, optionally updating existing ones',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact with its custom fields and status',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Change a contact name, email, phone number or custom fields',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a contact. It stops receiving invites and leaves every contact list',
	},
	'contacts.listFields': {
		riskLevel: 'read',
		description: 'List the custom contact fields and their labels',
	},
	'contacts.updateField': {
		riskLevel: 'write',
		description: 'Rename a custom contact field',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhooks on the account and what they subscribe to',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Subscribe a URL to an event on a survey or collector. SurveyMonkey then POSTs to it',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook subscription',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Change a webhook event, target objects or subscription URL',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook subscription. The URL stops receiving events',
	},
	'users.getMe': {
		riskLevel: 'read',
		description:
			'Read the account the token belongs to, which is the cheapest connection check',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List the survey folders on the account',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a folder to group surveys in',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof surveymonkeyEndpointsNested
>;

/**
 * The webhook signature key is `"{client id}&{api secret}"`, and the digest is
 * the base64 of an HMAC-SHA1 over the **raw request body**. SurveyMonkey sends
 * it in `Sm-Signature`; `Sm-Apikey` names which app sent it.
 *
 * The docs also show the pair reversed (`api_key&api_secret`), so both orders
 * are tried. Comparing in constant time keeps the failed attempt from leaking
 * how much of the digest matched.
 */
export function verifySurveymonkeySignature(
	payload: string,
	signature: string | undefined,
	clientId: string | undefined,
	clientSecret: string | undefined,
): boolean {
	if (!signature || !clientId || !clientSecret) return false;
	const expected = Buffer.from(signature, 'base64');
	if (expected.length === 0) return false;

	for (const key of [
		`${clientId}&${clientSecret}`,
		`${clientSecret}&${clientId}`,
	]) {
		const digest = createHmac('sha1', key).update(payload, 'utf8').digest();
		if (
			digest.length === expected.length &&
			timingSafeEqual(digest, expected)
		) {
			return true;
		}
	}
	return false;
}

export type BaseSurveymonkeyPlugin<T extends SurveymonkeyPluginOptions> =
	CorsairPlugin<
		'surveymonkey',
		typeof SurveymonkeySchema,
		typeof surveymonkeyEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof surveymonkeyAuthConfig
	>;

export type InternalSurveymonkeyPlugin =
	BaseSurveymonkeyPlugin<SurveymonkeyPluginOptions>;

export type ExternalSurveymonkeyPlugin<T extends SurveymonkeyPluginOptions> =
	BaseSurveymonkeyPlugin<T>;

export function surveymonkey<const T extends SurveymonkeyPluginOptions>(
	incomingOptions: SurveymonkeyPluginOptions &
		T = {} as SurveymonkeyPluginOptions & T,
): ExternalSurveymonkeyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as SurveymonkeyPluginOptions & T;
	return {
		id: 'surveymonkey',
		authConfig: surveymonkeyAuthConfig,
		oauthConfig: {
			providerName: 'SurveyMonkey',
			authUrl: 'https://api.surveymonkey.com/oauth/authorize',
			// The token endpoint sits outside `/v3`, and the exchange takes the
			// client credentials as form fields rather than a Basic header.
			tokenUrl: 'https://api.surveymonkey.com/oauth/token',
			scopes: [
				'surveys_read',
				'surveys_write',
				'collectors_read',
				'collectors_write',
				'contacts_read',
				'contacts_write',
				'responses_read',
				'responses_read_detail',
				'responses_write',
				'webhooks_read',
				'webhooks_write',
				'users_read',
			],
			tokenAuthMethod: 'body' as const,
			// The app's redirect URI is registered in its own settings page, so a
			// generated localhost URL would not match.
			requiresRegisteredRedirect: true,
		},
		schema: SurveymonkeySchema,
		options,
		hooks: options.hooks,
		endpoints: surveymonkeyEndpointsNested,
		webhooks: {},
		endpointMeta: surveymonkeyEndpointMeta,
		endpointSchemas: surveymonkeyEndpointSchemas,
		// Events are verified per request, so a delivery is only accepted when the
		// app's credentials are configured and the signature matches.
		pluginWebhookMatcher: (request) => 'sm-signature' in request.headers,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx, source) => {
			if (source !== 'endpoint' && source !== 'webhook') {
				throw new AuthMissingError('surveymonkey', 'oauth_2');
			}
			if (options.key) return options.key;
			// A context built without a key manager (a bare `key` option, a unit
			// test) has no `keys` at all, so this is guarded before reading it.
			if (!ctx.keys) throw new AuthMissingError('surveymonkey', 'oauth_2');
			const stored = await ctx.keys.get_access_token();
			if (!stored) throw new AuthMissingError('surveymonkey', 'oauth_2');
			return stored;
		},
	} satisfies InternalSurveymonkeyPlugin;
}

export type {
	CollectorsCreateInput,
	CollectorsCreateResponse,
	CollectorsDeleteInput,
	CollectorsDeleteResponse,
	CollectorsGetInput,
	CollectorsGetResponse,
	CollectorsListInput,
	CollectorsListResponse,
	CollectorsUpdateInput,
	CollectorsUpdateResponse,
	ContactListsCopyInput,
	ContactListsCopyResponse,
	ContactListsCreateInput,
	ContactListsCreateResponse,
	ContactListsDeleteInput,
	ContactListsDeleteResponse,
	ContactListsGetInput,
	ContactListsGetResponse,
	ContactListsListInput,
	ContactListsListResponse,
	ContactListsMergeInput,
	ContactListsMergeResponse,
	ContactListsUpdateInput,
	ContactListsUpdateResponse,
	ContactsBulkCreateInput,
	ContactsBulkCreateResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListFieldsInput,
	ContactsListFieldsResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateFieldInput,
	ContactsUpdateFieldResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	FoldersCreateInput,
	FoldersCreateResponse,
	FoldersListInput,
	FoldersListResponse,
	MessagesCreateInput,
	MessagesCreateResponse,
	MessagesGetInput,
	MessagesGetResponse,
	MessagesListInput,
	MessagesListResponse,
	MessagesSendInput,
	MessagesSendResponse,
	MessagesUpdateInput,
	MessagesUpdateResponse,
	PagesCreateInput,
	PagesCreateResponse,
	PagesDeleteInput,
	PagesDeleteResponse,
	PagesGetInput,
	PagesGetResponse,
	PagesListInput,
	PagesListResponse,
	PagesUpdateInput,
	PagesUpdateResponse,
	QuestionsCreateInput,
	QuestionsCreateResponse,
	QuestionsDeleteInput,
	QuestionsDeleteResponse,
	QuestionsGetInput,
	QuestionsGetResponse,
	QuestionsListInput,
	QuestionsListResponse,
	QuestionsUpdateInput,
	QuestionsUpdateResponse,
	RecipientsBulkCreateInput,
	RecipientsBulkCreateResponse,
	RecipientsCreateInput,
	RecipientsCreateResponse,
	RecipientsListInput,
	RecipientsListResponse,
	ResponsesCreateInput,
	ResponsesCreateResponse,
	ResponsesDeleteAllInput,
	ResponsesDeleteAllResponse,
	ResponsesDeleteInput,
	ResponsesDeleteResponse,
	ResponsesGetDetailsInput,
	ResponsesGetDetailsResponse,
	ResponsesGetInput,
	ResponsesGetResponse,
	ResponsesListBulkInput,
	ResponsesListBulkResponse,
	ResponsesListInput,
	ResponsesListResponse,
	SurveymonkeyEndpointInputs,
	SurveymonkeyEndpointOutputs,
	SurveysCreateInput,
	SurveysCreateResponse,
	SurveysDeleteInput,
	SurveysDeleteResponse,
	SurveysGetDetailsInput,
	SurveysGetDetailsResponse,
	SurveysGetInput,
	SurveysGetResponse,
	SurveysListCategoriesInput,
	SurveysListCategoriesResponse,
	SurveysListInput,
	SurveysListLanguagesInput,
	SurveysListLanguagesResponse,
	SurveysListResponse,
	SurveysListTemplatesInput,
	SurveysListTemplatesResponse,
	SurveysReplaceInput,
	SurveysReplaceResponse,
	SurveysUpdateInput,
	SurveysUpdateResponse,
	UsersGetMeInput,
	UsersGetMeResponse,
	WebhooksCreateInput,
	WebhooksCreateResponse,
	WebhooksDeleteInput,
	WebhooksDeleteResponse,
	WebhooksGetInput,
	WebhooksGetResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebhooksUpdateInput,
	WebhooksUpdateResponse,
} from './endpoints/types';
