import type {
	AuthTypes,
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	addOpportunityLinks,
	addOpportunitySources,
	addOpportunityTags,
	addRequisitionFieldOptions,
	applyToPosting,
	createFeedback,
	createFeedbackTemplate,
	createForm,
	createFormTemplate,
	createInterview,
	createNote,
	createOpportunity,
	createPanel,
	createPosting,
	createRequisition,
	createRequisitionField,
	createUser,
	createWebhook,
	deactivateUser,
	deleteFeedback,
	deleteFeedbackTemplate,
	deleteFile,
	deleteFormTemplate,
	deleteInterview,
	deleteNote,
	deletePanel,
	deleteRequisition,
	deleteRequisitionField,
	deleteRequisitionFieldOptions,
	deleteWebhook,
	downloadFile,
	downloadOpportunityOffer,
	downloadResume,
	listApplications,
	listArchiveReasons,
	listAuditEvents,
	listDeletedApplications,
	listDeletedOpportunities,
	listDeletedPostings,
	listDispositionStages,
	listFeedback,
	listFeedbackTemplates,
	listFiles,
	listForms,
	listFormTemplates,
	listInterviews,
	listNotes,
	listOpportunities,
	listOpportunityFileActions,
	listOpportunityOffers,
	listPanels,
	listPostings,
	listPostingUsers,
	listReferrals,
	listRequisitionFields,
	listRequisitions,
	listResumes,
	listSources,
	listStages,
	listTags,
	listUsers,
	listWebhooks,
	reactivateUser,
	removeOpportunityLinks,
	removeOpportunitySources,
	removeOpportunityTags,
	replaceRequisitionFieldOptions,
	retrieveApplication,
	retrieveArchiveReason,
	retrieveContact,
	retrieveDiversitySurvey,
	retrieveEeoResponsesAnonymous,
	retrieveEeoResponsesWithPii,
	retrieveFeedback,
	retrieveFeedbackTemplate,
	retrieveFile,
	retrieveForm,
	retrieveFormTemplate,
	retrieveInterview,
	retrieveNote,
	retrieveOpportunity,
	retrievePanel,
	retrievePosting,
	retrievePostingApplicationQuestions,
	retrieveReferral,
	retrieveRequisition,
	retrieveRequisitionField,
	retrieveResume,
	retrieveStage,
	retrieveUser,
	updateContact,
	updateFeedback,
	updateFeedbackTemplate,
	updateFormTemplate,
	updateInterview,
	updateNote,
	updateOpportunityArchivedState,
	updateOpportunityStage,
	updatePanel,
	updatePosting,
	updateRequisition,
	updateRequisitionField,
	updateUser,
	updateWebhook,
} from './endpoints';
import type {
	LeverEndpointInputs,
	LeverEndpointOutputs,
} from './endpoints/types';
import {
	LeverEndpointInputSchemas,
	LeverEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LeverSchema } from './schema';

export type LeverPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalLeverPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof leverEndpointsNested>;
};

export type LeverContext = CorsairPluginContext<
	typeof LeverSchema,
	LeverPluginOptions
>;

export type LeverKeyBuilderContext = KeyBuilderContext<LeverPluginOptions>;

export type LeverBoundEndpoints = BindEndpoints<typeof leverEndpointsNested>;

type LeverEndpoint<K extends keyof LeverEndpointOutputs> = CorsairEndpoint<
	LeverContext,
	LeverEndpointInputs[K],
	LeverEndpointOutputs[K]
>;

export type LeverEndpoints = {
	listOpportunities: LeverEndpoint<'listOpportunities'>;
	retrieveOpportunity: LeverEndpoint<'retrieveOpportunity'>;
	listDeletedOpportunities: LeverEndpoint<'listDeletedOpportunities'>;
	listOpportunityFileActions: LeverEndpoint<'listOpportunityFileActions'>;
	createOpportunity: LeverEndpoint<'createOpportunity'>;
	updateOpportunityStage: LeverEndpoint<'updateOpportunityStage'>;
	updateOpportunityArchivedState: LeverEndpoint<'updateOpportunityArchivedState'>;
	addOpportunityLinks: LeverEndpoint<'addOpportunityLinks'>;
	removeOpportunityLinks: LeverEndpoint<'removeOpportunityLinks'>;
	addOpportunityTags: LeverEndpoint<'addOpportunityTags'>;
	removeOpportunityTags: LeverEndpoint<'removeOpportunityTags'>;
	addOpportunitySources: LeverEndpoint<'addOpportunitySources'>;
	removeOpportunitySources: LeverEndpoint<'removeOpportunitySources'>;
	listApplications: LeverEndpoint<'listApplications'>;
	retrieveApplication: LeverEndpoint<'retrieveApplication'>;
	listDeletedApplications: LeverEndpoint<'listDeletedApplications'>;
	listPostings: LeverEndpoint<'listPostings'>;
	retrievePosting: LeverEndpoint<'retrievePosting'>;
	listDeletedPostings: LeverEndpoint<'listDeletedPostings'>;
	createPosting: LeverEndpoint<'createPosting'>;
	updatePosting: LeverEndpoint<'updatePosting'>;
	retrievePostingApplicationQuestions: LeverEndpoint<'retrievePostingApplicationQuestions'>;
	listPostingUsers: LeverEndpoint<'listPostingUsers'>;
	applyToPosting: LeverEndpoint<'applyToPosting'>;
	listInterviews: LeverEndpoint<'listInterviews'>;
	retrieveInterview: LeverEndpoint<'retrieveInterview'>;
	createInterview: LeverEndpoint<'createInterview'>;
	updateInterview: LeverEndpoint<'updateInterview'>;
	deleteInterview: LeverEndpoint<'deleteInterview'>;
	listNotes: LeverEndpoint<'listNotes'>;
	retrieveNote: LeverEndpoint<'retrieveNote'>;
	createNote: LeverEndpoint<'createNote'>;
	updateNote: LeverEndpoint<'updateNote'>;
	deleteNote: LeverEndpoint<'deleteNote'>;
	listArchiveReasons: LeverEndpoint<'listArchiveReasons'>;
	retrieveArchiveReason: LeverEndpoint<'retrieveArchiveReason'>;
	listStages: LeverEndpoint<'listStages'>;
	retrieveStage: LeverEndpoint<'retrieveStage'>;
	listRequisitions: LeverEndpoint<'listRequisitions'>;
	createRequisition: LeverEndpoint<'createRequisition'>;
	retrieveRequisition: LeverEndpoint<'retrieveRequisition'>;
	updateRequisition: LeverEndpoint<'updateRequisition'>;
	deleteRequisition: LeverEndpoint<'deleteRequisition'>;
	listForms: LeverEndpoint<'listForms'>;
	retrieveForm: LeverEndpoint<'retrieveForm'>;
	createForm: LeverEndpoint<'createForm'>;
	listResumes: LeverEndpoint<'listResumes'>;
	retrieveResume: LeverEndpoint<'retrieveResume'>;
	downloadResume: LeverEndpoint<'downloadResume'>;
	listUsers: LeverEndpoint<'listUsers'>;
	retrieveUser: LeverEndpoint<'retrieveUser'>;
	createUser: LeverEndpoint<'createUser'>;
	updateUser: LeverEndpoint<'updateUser'>;
	deactivateUser: LeverEndpoint<'deactivateUser'>;
	reactivateUser: LeverEndpoint<'reactivateUser'>;
	listReferrals: LeverEndpoint<'listReferrals'>;
	retrieveReferral: LeverEndpoint<'retrieveReferral'>;
	retrieveContact: LeverEndpoint<'retrieveContact'>;
	updateContact: LeverEndpoint<'updateContact'>;
	retrieveEeoResponsesWithPii: LeverEndpoint<'retrieveEeoResponsesWithPii'>;
	retrieveEeoResponsesAnonymous: LeverEndpoint<'retrieveEeoResponsesAnonymous'>;
	listDispositionStages: LeverEndpoint<'listDispositionStages'>;
	retrieveDiversitySurvey: LeverEndpoint<'retrieveDiversitySurvey'>;
	listWebhooks: LeverEndpoint<'listWebhooks'>;
	createWebhook: LeverEndpoint<'createWebhook'>;
	updateWebhook: LeverEndpoint<'updateWebhook'>;
	deleteWebhook: LeverEndpoint<'deleteWebhook'>;
	listAuditEvents: LeverEndpoint<'listAuditEvents'>;
	listSources: LeverEndpoint<'listSources'>;
	listTags: LeverEndpoint<'listTags'>;
	listOpportunityOffers: LeverEndpoint<'listOpportunityOffers'>;
	downloadOpportunityOffer: LeverEndpoint<'downloadOpportunityOffer'>;
	listPanels: LeverEndpoint<'listPanels'>;
	retrievePanel: LeverEndpoint<'retrievePanel'>;
	createPanel: LeverEndpoint<'createPanel'>;
	updatePanel: LeverEndpoint<'updatePanel'>;
	deletePanel: LeverEndpoint<'deletePanel'>;
	listFeedback: LeverEndpoint<'listFeedback'>;
	retrieveFeedback: LeverEndpoint<'retrieveFeedback'>;
	createFeedback: LeverEndpoint<'createFeedback'>;
	updateFeedback: LeverEndpoint<'updateFeedback'>;
	deleteFeedback: LeverEndpoint<'deleteFeedback'>;
	listFeedbackTemplates: LeverEndpoint<'listFeedbackTemplates'>;
	retrieveFeedbackTemplate: LeverEndpoint<'retrieveFeedbackTemplate'>;
	createFeedbackTemplate: LeverEndpoint<'createFeedbackTemplate'>;
	updateFeedbackTemplate: LeverEndpoint<'updateFeedbackTemplate'>;
	deleteFeedbackTemplate: LeverEndpoint<'deleteFeedbackTemplate'>;
	listFiles: LeverEndpoint<'listFiles'>;
	retrieveFile: LeverEndpoint<'retrieveFile'>;
	downloadFile: LeverEndpoint<'downloadFile'>;
	deleteFile: LeverEndpoint<'deleteFile'>;
	listFormTemplates: LeverEndpoint<'listFormTemplates'>;
	retrieveFormTemplate: LeverEndpoint<'retrieveFormTemplate'>;
	createFormTemplate: LeverEndpoint<'createFormTemplate'>;
	updateFormTemplate: LeverEndpoint<'updateFormTemplate'>;
	deleteFormTemplate: LeverEndpoint<'deleteFormTemplate'>;
	listRequisitionFields: LeverEndpoint<'listRequisitionFields'>;
	retrieveRequisitionField: LeverEndpoint<'retrieveRequisitionField'>;
	createRequisitionField: LeverEndpoint<'createRequisitionField'>;
	updateRequisitionField: LeverEndpoint<'updateRequisitionField'>;
	deleteRequisitionField: LeverEndpoint<'deleteRequisitionField'>;
	addRequisitionFieldOptions: LeverEndpoint<'addRequisitionFieldOptions'>;
	replaceRequisitionFieldOptions: LeverEndpoint<'replaceRequisitionFieldOptions'>;
	deleteRequisitionFieldOptions: LeverEndpoint<'deleteRequisitionFieldOptions'>;
};

const leverEndpointsNested = {
	opportunities: {
		list: listOpportunities,
		retrieve: retrieveOpportunity,
		listDeleted: listDeletedOpportunities,
		listFileActions: listOpportunityFileActions,
		create: createOpportunity,
		updateStage: updateOpportunityStage,
		updateArchivedState: updateOpportunityArchivedState,
		addLinks: addOpportunityLinks,
		removeLinks: removeOpportunityLinks,
		addTags: addOpportunityTags,
		removeTags: removeOpportunityTags,
		addSources: addOpportunitySources,
		removeSources: removeOpportunitySources,
	},
	applications: {
		list: listApplications,
		retrieve: retrieveApplication,
		listDeleted: listDeletedApplications,
	},
	postings: {
		list: listPostings,
		retrieve: retrievePosting,
		listDeleted: listDeletedPostings,
		create: createPosting,
		update: updatePosting,
		retrieveApplicationQuestions: retrievePostingApplicationQuestions,
		listUsers: listPostingUsers,
		apply: applyToPosting,
	},
	interviews: {
		list: listInterviews,
		retrieve: retrieveInterview,
		create: createInterview,
		update: updateInterview,
		delete: deleteInterview,
	},
	notes: {
		list: listNotes,
		retrieve: retrieveNote,
		create: createNote,
		update: updateNote,
		delete: deleteNote,
	},
	archiveReasons: {
		list: listArchiveReasons,
		retrieve: retrieveArchiveReason,
	},
	stages: {
		list: listStages,
		retrieve: retrieveStage,
	},
	panels: {
		list: listPanels,
		retrieve: retrievePanel,
		create: createPanel,
		update: updatePanel,
		delete: deletePanel,
	},
	feedback: {
		list: listFeedback,
		retrieve: retrieveFeedback,
		create: createFeedback,
		update: updateFeedback,
		delete: deleteFeedback,
	},
	feedbackTemplates: {
		list: listFeedbackTemplates,
		retrieve: retrieveFeedbackTemplate,
		create: createFeedbackTemplate,
		update: updateFeedbackTemplate,
		delete: deleteFeedbackTemplate,
	},
	files: {
		list: listFiles,
		retrieve: retrieveFile,
		download: downloadFile,
		delete: deleteFile,
	},
	formTemplates: {
		list: listFormTemplates,
		retrieve: retrieveFormTemplate,
		create: createFormTemplate,
		update: updateFormTemplate,
		delete: deleteFormTemplate,
	},
	requisitionFields: {
		list: listRequisitionFields,
		retrieve: retrieveRequisitionField,
		create: createRequisitionField,
		update: updateRequisitionField,
		delete: deleteRequisitionField,
		addOptions: addRequisitionFieldOptions,
		replaceOptions: replaceRequisitionFieldOptions,
		deleteOptions: deleteRequisitionFieldOptions,
	},
	requisitions: {
		list: listRequisitions,
		create: createRequisition,
		retrieve: retrieveRequisition,
		update: updateRequisition,
		delete: deleteRequisition,
	},
	forms: {
		list: listForms,
		retrieve: retrieveForm,
		create: createForm,
	},
	resumes: {
		list: listResumes,
		retrieve: retrieveResume,
		download: downloadResume,
	},
	users: {
		list: listUsers,
		retrieve: retrieveUser,
		create: createUser,
		update: updateUser,
		deactivate: deactivateUser,
		reactivate: reactivateUser,
	},
	referrals: {
		list: listReferrals,
		retrieve: retrieveReferral,
	},
	contacts: {
		retrieve: retrieveContact,
		update: updateContact,
	},
	eeo: {
		retrieveWithPii: retrieveEeoResponsesWithPii,
		retrieveAnonymous: retrieveEeoResponsesAnonymous,
	},
	dispositionStages: {
		list: listDispositionStages,
	},
	surveys: {
		retrieveDiversity: retrieveDiversitySurvey,
	},
	webhooks: {
		list: listWebhooks,
		create: createWebhook,
		update: updateWebhook,
		delete: deleteWebhook,
	},
	auditEvents: {
		list: listAuditEvents,
	},
	sources: {
		list: listSources,
	},
	tags: {
		list: listTags,
	},
	offers: {
		list: listOpportunityOffers,
		download: downloadOpportunityOffer,
	},
} as const;

export const leverEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof leverEndpointsNested
> = {
	'opportunities.list': {
		input: LeverEndpointInputSchemas.listOpportunities,
		output: LeverEndpointOutputSchemas.listOpportunities,
	},
	'opportunities.retrieve': {
		input: LeverEndpointInputSchemas.retrieveOpportunity,
		output: LeverEndpointOutputSchemas.retrieveOpportunity,
	},
	'opportunities.listDeleted': {
		input: LeverEndpointInputSchemas.listDeletedOpportunities,
		output: LeverEndpointOutputSchemas.listDeletedOpportunities,
	},
	'opportunities.listFileActions': {
		input: LeverEndpointInputSchemas.listOpportunityFileActions,
		output: LeverEndpointOutputSchemas.listOpportunityFileActions,
	},
	'opportunities.create': {
		input: LeverEndpointInputSchemas.createOpportunity,
		output: LeverEndpointOutputSchemas.createOpportunity,
	},
	'opportunities.updateStage': {
		input: LeverEndpointInputSchemas.updateOpportunityStage,
		output: LeverEndpointOutputSchemas.updateOpportunityStage,
	},
	'opportunities.updateArchivedState': {
		input: LeverEndpointInputSchemas.updateOpportunityArchivedState,
		output: LeverEndpointOutputSchemas.updateOpportunityArchivedState,
	},
	'opportunities.addLinks': {
		input: LeverEndpointInputSchemas.addOpportunityLinks,
		output: LeverEndpointOutputSchemas.addOpportunityLinks,
	},
	'opportunities.removeLinks': {
		input: LeverEndpointInputSchemas.removeOpportunityLinks,
		output: LeverEndpointOutputSchemas.removeOpportunityLinks,
	},
	'opportunities.addTags': {
		input: LeverEndpointInputSchemas.addOpportunityTags,
		output: LeverEndpointOutputSchemas.addOpportunityTags,
	},
	'opportunities.removeTags': {
		input: LeverEndpointInputSchemas.removeOpportunityTags,
		output: LeverEndpointOutputSchemas.removeOpportunityTags,
	},
	'opportunities.addSources': {
		input: LeverEndpointInputSchemas.addOpportunitySources,
		output: LeverEndpointOutputSchemas.addOpportunitySources,
	},
	'opportunities.removeSources': {
		input: LeverEndpointInputSchemas.removeOpportunitySources,
		output: LeverEndpointOutputSchemas.removeOpportunitySources,
	},
	'applications.list': {
		input: LeverEndpointInputSchemas.listApplications,
		output: LeverEndpointOutputSchemas.listApplications,
	},
	'applications.retrieve': {
		input: LeverEndpointInputSchemas.retrieveApplication,
		output: LeverEndpointOutputSchemas.retrieveApplication,
	},
	'applications.listDeleted': {
		input: LeverEndpointInputSchemas.listDeletedApplications,
		output: LeverEndpointOutputSchemas.listDeletedApplications,
	},
	'postings.list': {
		input: LeverEndpointInputSchemas.listPostings,
		output: LeverEndpointOutputSchemas.listPostings,
	},
	'postings.retrieve': {
		input: LeverEndpointInputSchemas.retrievePosting,
		output: LeverEndpointOutputSchemas.retrievePosting,
	},
	'postings.listDeleted': {
		input: LeverEndpointInputSchemas.listDeletedPostings,
		output: LeverEndpointOutputSchemas.listDeletedPostings,
	},
	'postings.create': {
		input: LeverEndpointInputSchemas.createPosting,
		output: LeverEndpointOutputSchemas.createPosting,
	},
	'postings.update': {
		input: LeverEndpointInputSchemas.updatePosting,
		output: LeverEndpointOutputSchemas.updatePosting,
	},
	'postings.retrieveApplicationQuestions': {
		input: LeverEndpointInputSchemas.retrievePostingApplicationQuestions,
		output: LeverEndpointOutputSchemas.retrievePostingApplicationQuestions,
	},
	'postings.listUsers': {
		input: LeverEndpointInputSchemas.listPostingUsers,
		output: LeverEndpointOutputSchemas.listPostingUsers,
	},
	'postings.apply': {
		input: LeverEndpointInputSchemas.applyToPosting,
		output: LeverEndpointOutputSchemas.applyToPosting,
	},
	'interviews.list': {
		input: LeverEndpointInputSchemas.listInterviews,
		output: LeverEndpointOutputSchemas.listInterviews,
	},
	'interviews.retrieve': {
		input: LeverEndpointInputSchemas.retrieveInterview,
		output: LeverEndpointOutputSchemas.retrieveInterview,
	},
	'interviews.create': {
		input: LeverEndpointInputSchemas.createInterview,
		output: LeverEndpointOutputSchemas.createInterview,
	},
	'interviews.update': {
		input: LeverEndpointInputSchemas.updateInterview,
		output: LeverEndpointOutputSchemas.updateInterview,
	},
	'interviews.delete': {
		input: LeverEndpointInputSchemas.deleteInterview,
		output: LeverEndpointOutputSchemas.deleteInterview,
	},
	'notes.list': {
		input: LeverEndpointInputSchemas.listNotes,
		output: LeverEndpointOutputSchemas.listNotes,
	},
	'notes.retrieve': {
		input: LeverEndpointInputSchemas.retrieveNote,
		output: LeverEndpointOutputSchemas.retrieveNote,
	},
	'notes.create': {
		input: LeverEndpointInputSchemas.createNote,
		output: LeverEndpointOutputSchemas.createNote,
	},
	'notes.update': {
		input: LeverEndpointInputSchemas.updateNote,
		output: LeverEndpointOutputSchemas.updateNote,
	},
	'notes.delete': {
		input: LeverEndpointInputSchemas.deleteNote,
		output: LeverEndpointOutputSchemas.deleteNote,
	},
	'archiveReasons.list': {
		input: LeverEndpointInputSchemas.listArchiveReasons,
		output: LeverEndpointOutputSchemas.listArchiveReasons,
	},
	'archiveReasons.retrieve': {
		input: LeverEndpointInputSchemas.retrieveArchiveReason,
		output: LeverEndpointOutputSchemas.retrieveArchiveReason,
	},
	'stages.list': {
		input: LeverEndpointInputSchemas.listStages,
		output: LeverEndpointOutputSchemas.listStages,
	},
	'stages.retrieve': {
		input: LeverEndpointInputSchemas.retrieveStage,
		output: LeverEndpointOutputSchemas.retrieveStage,
	},
	'panels.list': {
		input: LeverEndpointInputSchemas.listPanels,
		output: LeverEndpointOutputSchemas.listPanels,
	},
	'panels.retrieve': {
		input: LeverEndpointInputSchemas.retrievePanel,
		output: LeverEndpointOutputSchemas.retrievePanel,
	},
	'panels.create': {
		input: LeverEndpointInputSchemas.createPanel,
		output: LeverEndpointOutputSchemas.createPanel,
	},
	'panels.update': {
		input: LeverEndpointInputSchemas.updatePanel,
		output: LeverEndpointOutputSchemas.updatePanel,
	},
	'panels.delete': {
		input: LeverEndpointInputSchemas.deletePanel,
		output: LeverEndpointOutputSchemas.deletePanel,
	},
	'feedback.list': {
		input: LeverEndpointInputSchemas.listFeedback,
		output: LeverEndpointOutputSchemas.listFeedback,
	},
	'feedback.retrieve': {
		input: LeverEndpointInputSchemas.retrieveFeedback,
		output: LeverEndpointOutputSchemas.retrieveFeedback,
	},
	'feedback.create': {
		input: LeverEndpointInputSchemas.createFeedback,
		output: LeverEndpointOutputSchemas.createFeedback,
	},
	'feedback.update': {
		input: LeverEndpointInputSchemas.updateFeedback,
		output: LeverEndpointOutputSchemas.updateFeedback,
	},
	'feedback.delete': {
		input: LeverEndpointInputSchemas.deleteFeedback,
		output: LeverEndpointOutputSchemas.deleteFeedback,
	},
	'feedbackTemplates.list': {
		input: LeverEndpointInputSchemas.listFeedbackTemplates,
		output: LeverEndpointOutputSchemas.listFeedbackTemplates,
	},
	'feedbackTemplates.retrieve': {
		input: LeverEndpointInputSchemas.retrieveFeedbackTemplate,
		output: LeverEndpointOutputSchemas.retrieveFeedbackTemplate,
	},
	'feedbackTemplates.create': {
		input: LeverEndpointInputSchemas.createFeedbackTemplate,
		output: LeverEndpointOutputSchemas.createFeedbackTemplate,
	},
	'feedbackTemplates.update': {
		input: LeverEndpointInputSchemas.updateFeedbackTemplate,
		output: LeverEndpointOutputSchemas.updateFeedbackTemplate,
	},
	'feedbackTemplates.delete': {
		input: LeverEndpointInputSchemas.deleteFeedbackTemplate,
		output: LeverEndpointOutputSchemas.deleteFeedbackTemplate,
	},
	'files.list': {
		input: LeverEndpointInputSchemas.listFiles,
		output: LeverEndpointOutputSchemas.listFiles,
	},
	'files.retrieve': {
		input: LeverEndpointInputSchemas.retrieveFile,
		output: LeverEndpointOutputSchemas.retrieveFile,
	},
	'files.download': {
		input: LeverEndpointInputSchemas.downloadFile,
		output: LeverEndpointOutputSchemas.downloadFile,
	},
	'files.delete': {
		input: LeverEndpointInputSchemas.deleteFile,
		output: LeverEndpointOutputSchemas.deleteFile,
	},
	'formTemplates.list': {
		input: LeverEndpointInputSchemas.listFormTemplates,
		output: LeverEndpointOutputSchemas.listFormTemplates,
	},
	'formTemplates.retrieve': {
		input: LeverEndpointInputSchemas.retrieveFormTemplate,
		output: LeverEndpointOutputSchemas.retrieveFormTemplate,
	},
	'formTemplates.create': {
		input: LeverEndpointInputSchemas.createFormTemplate,
		output: LeverEndpointOutputSchemas.createFormTemplate,
	},
	'formTemplates.update': {
		input: LeverEndpointInputSchemas.updateFormTemplate,
		output: LeverEndpointOutputSchemas.updateFormTemplate,
	},
	'formTemplates.delete': {
		input: LeverEndpointInputSchemas.deleteFormTemplate,
		output: LeverEndpointOutputSchemas.deleteFormTemplate,
	},
	'requisitionFields.list': {
		input: LeverEndpointInputSchemas.listRequisitionFields,
		output: LeverEndpointOutputSchemas.listRequisitionFields,
	},
	'requisitionFields.retrieve': {
		input: LeverEndpointInputSchemas.retrieveRequisitionField,
		output: LeverEndpointOutputSchemas.retrieveRequisitionField,
	},
	'requisitionFields.create': {
		input: LeverEndpointInputSchemas.createRequisitionField,
		output: LeverEndpointOutputSchemas.createRequisitionField,
	},
	'requisitionFields.update': {
		input: LeverEndpointInputSchemas.updateRequisitionField,
		output: LeverEndpointOutputSchemas.updateRequisitionField,
	},
	'requisitionFields.delete': {
		input: LeverEndpointInputSchemas.deleteRequisitionField,
		output: LeverEndpointOutputSchemas.deleteRequisitionField,
	},
	'requisitionFields.addOptions': {
		input: LeverEndpointInputSchemas.addRequisitionFieldOptions,
		output: LeverEndpointOutputSchemas.addRequisitionFieldOptions,
	},
	'requisitionFields.replaceOptions': {
		input: LeverEndpointInputSchemas.replaceRequisitionFieldOptions,
		output: LeverEndpointOutputSchemas.replaceRequisitionFieldOptions,
	},
	'requisitionFields.deleteOptions': {
		input: LeverEndpointInputSchemas.deleteRequisitionFieldOptions,
		output: LeverEndpointOutputSchemas.deleteRequisitionFieldOptions,
	},
	'requisitions.list': {
		input: LeverEndpointInputSchemas.listRequisitions,
		output: LeverEndpointOutputSchemas.listRequisitions,
	},
	'requisitions.create': {
		input: LeverEndpointInputSchemas.createRequisition,
		output: LeverEndpointOutputSchemas.createRequisition,
	},
	'requisitions.retrieve': {
		input: LeverEndpointInputSchemas.retrieveRequisition,
		output: LeverEndpointOutputSchemas.retrieveRequisition,
	},
	'requisitions.update': {
		input: LeverEndpointInputSchemas.updateRequisition,
		output: LeverEndpointOutputSchemas.updateRequisition,
	},
	'requisitions.delete': {
		input: LeverEndpointInputSchemas.deleteRequisition,
		output: LeverEndpointOutputSchemas.deleteRequisition,
	},
	'forms.list': {
		input: LeverEndpointInputSchemas.listForms,
		output: LeverEndpointOutputSchemas.listForms,
	},
	'forms.retrieve': {
		input: LeverEndpointInputSchemas.retrieveForm,
		output: LeverEndpointOutputSchemas.retrieveForm,
	},
	'forms.create': {
		input: LeverEndpointInputSchemas.createForm,
		output: LeverEndpointOutputSchemas.createForm,
	},
	'resumes.list': {
		input: LeverEndpointInputSchemas.listResumes,
		output: LeverEndpointOutputSchemas.listResumes,
	},
	'resumes.retrieve': {
		input: LeverEndpointInputSchemas.retrieveResume,
		output: LeverEndpointOutputSchemas.retrieveResume,
	},
	'resumes.download': {
		input: LeverEndpointInputSchemas.downloadResume,
		output: LeverEndpointOutputSchemas.downloadResume,
	},
	'users.list': {
		input: LeverEndpointInputSchemas.listUsers,
		output: LeverEndpointOutputSchemas.listUsers,
	},
	'users.retrieve': {
		input: LeverEndpointInputSchemas.retrieveUser,
		output: LeverEndpointOutputSchemas.retrieveUser,
	},
	'users.create': {
		input: LeverEndpointInputSchemas.createUser,
		output: LeverEndpointOutputSchemas.createUser,
	},
	'users.update': {
		input: LeverEndpointInputSchemas.updateUser,
		output: LeverEndpointOutputSchemas.updateUser,
	},
	'users.deactivate': {
		input: LeverEndpointInputSchemas.deactivateUser,
		output: LeverEndpointOutputSchemas.deactivateUser,
	},
	'users.reactivate': {
		input: LeverEndpointInputSchemas.reactivateUser,
		output: LeverEndpointOutputSchemas.reactivateUser,
	},
	'referrals.list': {
		input: LeverEndpointInputSchemas.listReferrals,
		output: LeverEndpointOutputSchemas.listReferrals,
	},
	'referrals.retrieve': {
		input: LeverEndpointInputSchemas.retrieveReferral,
		output: LeverEndpointOutputSchemas.retrieveReferral,
	},
	'contacts.retrieve': {
		input: LeverEndpointInputSchemas.retrieveContact,
		output: LeverEndpointOutputSchemas.retrieveContact,
	},
	'contacts.update': {
		input: LeverEndpointInputSchemas.updateContact,
		output: LeverEndpointOutputSchemas.updateContact,
	},
	'eeo.retrieveWithPii': {
		input: LeverEndpointInputSchemas.retrieveEeoResponsesWithPii,
		output: LeverEndpointOutputSchemas.retrieveEeoResponsesWithPii,
	},
	'eeo.retrieveAnonymous': {
		input: LeverEndpointInputSchemas.retrieveEeoResponsesAnonymous,
		output: LeverEndpointOutputSchemas.retrieveEeoResponsesAnonymous,
	},
	'dispositionStages.list': {
		input: LeverEndpointInputSchemas.listDispositionStages,
		output: LeverEndpointOutputSchemas.listDispositionStages,
	},
	'surveys.retrieveDiversity': {
		input: LeverEndpointInputSchemas.retrieveDiversitySurvey,
		output: LeverEndpointOutputSchemas.retrieveDiversitySurvey,
	},
	'webhooks.list': {
		input: LeverEndpointInputSchemas.listWebhooks,
		output: LeverEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.create': {
		input: LeverEndpointInputSchemas.createWebhook,
		output: LeverEndpointOutputSchemas.createWebhook,
	},
	'webhooks.update': {
		input: LeverEndpointInputSchemas.updateWebhook,
		output: LeverEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.delete': {
		input: LeverEndpointInputSchemas.deleteWebhook,
		output: LeverEndpointOutputSchemas.deleteWebhook,
	},
	'auditEvents.list': {
		input: LeverEndpointInputSchemas.listAuditEvents,
		output: LeverEndpointOutputSchemas.listAuditEvents,
	},
	'sources.list': {
		input: LeverEndpointInputSchemas.listSources,
		output: LeverEndpointOutputSchemas.listSources,
	},
	'tags.list': {
		input: LeverEndpointInputSchemas.listTags,
		output: LeverEndpointOutputSchemas.listTags,
	},
	'offers.list': {
		input: LeverEndpointInputSchemas.listOpportunityOffers,
		output: LeverEndpointOutputSchemas.listOpportunityOffers,
	},
	'offers.download': {
		input: LeverEndpointInputSchemas.downloadOpportunityOffer,
		output: LeverEndpointOutputSchemas.downloadOpportunityOffer,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof leverEndpointsNested>;

// unknown: the tree mixes group objects and handler functions at each level.
type LeverEndpointTree = Record<string, unknown>;
// unknown: wrappers receive core context/input before Zod parsing and re-parse output.
type LeverEndpointHandler = (ctx: unknown, input: unknown) => Promise<unknown>;

/**
 * Binds every Lever endpoint to its declared input and output schemas. Calls
 * use this validated tree at runtime; the schemas registry stays as
 * introspection metadata.
 */
function withLeverSchemas<T extends LeverEndpointTree>(
	tree: T,
	prefix = '',
): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				leverEndpointSchemas[operation as keyof typeof leverEndpointSchemas];
			if (!schema) {
				throw new Error(`Missing Lever endpoint schema for ${operation}`);
			}
			const endpoint = value as LeverEndpointHandler;
			const { input: inputSchema, output: outputSchema } = schema;
			if (!inputSchema || !outputSchema) {
				throw new Error();
			}
			const validated: LeverEndpointHandler = async (ctx, input) => {
				const parsedInput = inputSchema.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return outputSchema.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [key, withLeverSchemas(value as LeverEndpointTree, operation)];
		}
		return [key, value];
	});
	return Object.fromEntries(validatedEntries) as T;
}

const validatedLeverEndpointsNested = withLeverSchemas(leverEndpointsNested);

const defaultAuthType: AuthTypes = 'api_key' as const;

// Lever OAuth access tokens expire after one hour; the refresh token (granted
// with offline_access) mints new ones at the same token endpoint.
const LEVER_OAUTH_TOKEN_URL = 'https://auth.lever.co/oauth/token';

const leverOAuthConfig = {
	providerName: 'Lever',
	authUrl: 'https://auth.lever.co/authorize',
	tokenUrl: LEVER_OAUTH_TOKEN_URL,
	// write:admin scopes include read access for the same resource.
	scopes: [
		'offline_access',
		'opportunities:write:admin',
		'applications:read:admin',
		'archive_reasons:read:admin',
		'audit_events:read:admin',
		'contact:write:admin',
		'diversity_surveys:read:admin',
		'eeo_responses:read:admin',
		'eeo_responses_pii:read:admin',
		'feedback:write:admin',
		'feedback_templates:write:admin',
		'files:write:admin',
		'forms:write:admin',
		'form_templates:write:admin',
		'interviews:write:admin',
		'notes:write:admin',
		'offers:read:admin',
		'panels:write:admin',
		'postings:write:admin',
		'referrals:read:admin',
		'requisitions:write:admin',
		'requisition_fields:write:admin',
		'resumes:read:admin',
		'sources:read:admin',
		'stages:read:admin',
		'tags:read:admin',
		'users:write:admin',
		'webhooks:write:admin',
	],
	// Lever's authorize endpoint rejects requests without the API audience.
	authParams: { audience: 'https://api.lever.co/v1/' },
};

const leverEndpointMeta = {
	'opportunities.list': {
		riskLevel: 'read',
		description: 'List pipeline opportunities with filters and pagination',
	},
	'opportunities.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single pipeline opportunity by ID',
	},
	'opportunities.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted pipeline opportunities',
	},
	'opportunities.listFileActions': {
		riskLevel: 'read',
		description: 'List file actions recorded for a pipeline opportunity',
	},
	'opportunities.create': {
		riskLevel: 'write',
		description: 'Create a pipeline opportunity for a candidate profile',
	},
	'opportunities.updateStage': {
		riskLevel: 'write',
		description: 'Move a pipeline opportunity to a different hiring stage',
	},
	'opportunities.updateArchivedState': {
		riskLevel: 'write',
		description: 'Archive or unarchive a pipeline opportunity',
	},
	'opportunities.addLinks': {
		riskLevel: 'write',
		description:
			"Add web links (LinkedIn, portfolio) to an opportunity's contact",
	},
	'opportunities.removeLinks': {
		riskLevel: 'write',
		description: "Remove web links from an opportunity's contact",
	},
	'opportunities.addTags': {
		riskLevel: 'write',
		description: 'Add tags to a pipeline opportunity',
	},
	'opportunities.removeTags': {
		riskLevel: 'write',
		description: 'Remove tags from a pipeline opportunity',
	},
	'opportunities.addSources': {
		riskLevel: 'write',
		description: 'Add sourcing sources to a pipeline opportunity',
	},
	'opportunities.removeSources': {
		riskLevel: 'write',
		description: 'Remove sourcing sources from a pipeline opportunity',
	},
	'applications.list': {
		riskLevel: 'read',
		description: 'List applications belonging to a pipeline opportunity',
	},
	'applications.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single application of a pipeline opportunity',
	},
	'applications.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted applications',
	},
	'postings.list': {
		riskLevel: 'read',
		description: 'List job postings',
	},
	'postings.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single job posting by ID',
	},
	'postings.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted job postings',
	},
	'postings.create': {
		riskLevel: 'write',
		description: 'Create a job posting',
	},
	'postings.update': {
		riskLevel: 'write',
		description: 'Update an existing job posting',
	},
	'postings.retrieveApplicationQuestions': {
		riskLevel: 'read',
		description: 'Retrieve the application questions configured for a posting',
	},
	'postings.listUsers': {
		riskLevel: 'read',
		description: 'List users with access to a job posting',
	},
	'postings.apply': {
		riskLevel: 'write',
		description: 'Submit an application to a job posting',
	},
	'interviews.list': {
		riskLevel: 'read',
		description: 'List interviews scheduled for a pipeline opportunity',
	},
	'interviews.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single interview by ID',
	},
	'interviews.create': {
		riskLevel: 'write',
		description: 'Schedule an interview for a pipeline opportunity',
	},
	'interviews.update': {
		riskLevel: 'write',
		description: 'Update a scheduled interview',
	},
	'interviews.delete': {
		riskLevel: 'destructive',
		description: 'Delete a scheduled interview',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'List notes on a pipeline opportunity',
	},
	'notes.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single note on a pipeline opportunity',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Add a note to a pipeline opportunity',
	},
	'notes.update': {
		riskLevel: 'write',
		description: 'Update a note on a pipeline opportunity',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a note from a pipeline opportunity',
	},
	'archiveReasons.list': {
		riskLevel: 'read',
		description: 'List archive reasons configured for the workspace',
	},
	'archiveReasons.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single archive reason by ID',
	},
	'stages.list': {
		riskLevel: 'read',
		description: 'List hiring stages configured for the workspace',
	},
	'stages.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single hiring stage by ID',
	},
	'panels.list': {
		riskLevel: 'read',
		description: 'List interview panels for a pipeline opportunity',
	},
	'panels.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single interview panel by ID',
	},
	'panels.create': {
		riskLevel: 'write',
		description: 'Create an interview panel for a pipeline opportunity',
	},
	'panels.update': {
		riskLevel: 'write',
		description: 'Update an interview panel',
	},
	'panels.delete': {
		riskLevel: 'destructive',
		description: 'Delete an interview panel',
	},
	'feedback.list': {
		riskLevel: 'read',
		description: 'List feedback forms on a pipeline opportunity',
	},
	'feedback.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single feedback form by ID',
	},
	'feedback.create': {
		riskLevel: 'write',
		description: 'Submit a feedback form for a pipeline opportunity',
	},
	'feedback.update': {
		riskLevel: 'write',
		description: 'Update a feedback form on a pipeline opportunity',
	},
	'feedback.delete': {
		riskLevel: 'destructive',
		description: 'Delete a feedback form from a pipeline opportunity',
	},
	'feedbackTemplates.list': {
		riskLevel: 'read',
		description: 'List feedback templates configured for the workspace',
	},
	'feedbackTemplates.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single feedback template by ID',
	},
	'feedbackTemplates.create': {
		riskLevel: 'write',
		description: 'Create a feedback template for the workspace',
	},
	'feedbackTemplates.update': {
		riskLevel: 'write',
		description: 'Update a feedback template',
	},
	'feedbackTemplates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a feedback template',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List files attached to a pipeline opportunity',
	},
	'files.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single file attached to a pipeline opportunity',
	},
	'files.download': {
		riskLevel: 'read',
		description: 'Download the raw bytes of an opportunity file',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Delete a file from a pipeline opportunity',
	},
	'formTemplates.list': {
		riskLevel: 'read',
		description: 'List form templates configured for the workspace',
	},
	'formTemplates.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single form template by ID',
	},
	'formTemplates.create': {
		riskLevel: 'write',
		description: 'Create a form template for the workspace',
	},
	'formTemplates.update': {
		riskLevel: 'write',
		description: 'Update a form template',
	},
	'formTemplates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a form template',
	},
	'requisitionFields.list': {
		riskLevel: 'read',
		description: 'List requisition fields configured for the workspace',
	},
	'requisitionFields.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single requisition field by ID',
	},
	'requisitionFields.create': {
		riskLevel: 'write',
		description: 'Create a requisition field for the workspace',
	},
	'requisitionFields.update': {
		riskLevel: 'write',
		description: 'Update a requisition field',
	},
	'requisitionFields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a requisition field',
	},
	'requisitionFields.addOptions': {
		riskLevel: 'write',
		description: 'Add dropdown options to a requisition field',
	},
	'requisitionFields.replaceOptions': {
		riskLevel: 'destructive',
		description: 'Replace the dropdown options of a requisition field',
	},
	'requisitionFields.deleteOptions': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove dropdown option values from a requisition field',
	},
	'requisitions.list': {
		riskLevel: 'read',
		description: 'List requisitions',
	},
	'requisitions.create': {
		riskLevel: 'write',
		description: 'Create a requisition',
	},
	'requisitions.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single requisition by ID',
	},
	'requisitions.update': {
		riskLevel: 'write',
		description: 'Update a requisition',
	},
	'requisitions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a requisition',
	},
	'forms.list': {
		riskLevel: 'read',
		description: 'List form submissions on a pipeline opportunity',
	},
	'forms.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single form submission by ID',
	},
	'forms.create': {
		riskLevel: 'write',
		description: 'Submit a form for a pipeline opportunity',
	},
	'resumes.list': {
		riskLevel: 'read',
		description: 'List resumes attached to a pipeline opportunity',
	},
	'resumes.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single resume by ID',
	},
	'resumes.download': {
		riskLevel: 'read',
		description: 'Download the raw bytes of an opportunity resume',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List workspace users',
	},
	'users.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single workspace user by ID',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a workspace user',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a workspace user',
	},
	'users.deactivate': {
		riskLevel: 'write',
		description: 'Deactivate a workspace user',
	},
	'users.reactivate': {
		riskLevel: 'write',
		description: 'Reactivate a workspace user',
	},
	'referrals.list': {
		riskLevel: 'read',
		description: 'List referrals on a pipeline opportunity',
	},
	'referrals.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single referral by ID',
	},
	'contacts.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single contact by ID',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact',
	},
	'eeo.retrieveWithPii': {
		riskLevel: 'read',
		description:
			'Retrieve EEO responses including personally identifiable information',
	},
	'eeo.retrieveAnonymous': {
		riskLevel: 'read',
		description: 'Retrieve anonymized EEO responses',
	},
	'dispositionStages.list': {
		riskLevel: 'read',
		description: 'List disposition stages configured for the workspace',
	},
	'surveys.retrieveDiversity': {
		riskLevel: 'read',
		description: 'Retrieve the diversity survey for a job posting',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List registered webhooks',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Register a webhook',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a registered webhook',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a registered webhook',
	},
	'auditEvents.list': {
		riskLevel: 'read',
		description: 'List workspace audit events',
	},
	'sources.list': {
		riskLevel: 'read',
		description: 'List sourcing sources configured for the workspace',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags configured for the workspace',
	},
	'offers.list': {
		riskLevel: 'read',
		description: 'List offers for a pipeline opportunity',
	},
	'offers.download': {
		riskLevel: 'read',
		description: 'Download the raw bytes of an offer file',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof leverEndpointsNested>;

export const leverAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLeverPlugin<T extends LeverPluginOptions> = CorsairPlugin<
	'lever',
	typeof LeverSchema,
	typeof leverEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalLeverPlugin = BaseLeverPlugin<LeverPluginOptions>;

export type ExternalLeverPlugin<T extends LeverPluginOptions> =
	BaseLeverPlugin<T>;

export function lever<const T extends LeverPluginOptions>(
	incomingOptions: LeverPluginOptions & T = {} as LeverPluginOptions & T,
): ExternalLeverPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lever',
		authConfig: leverAuthConfig,
		oauthConfig: leverOAuthConfig,
		schema: LeverSchema,
		options: options,
		hooks: options.hooks,
		endpoints: validatedLeverEndpointsNested,
		webhooks: {},
		endpointMeta: leverEndpointMeta,
		endpointSchemas: leverEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LeverKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('lever', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				// Refreshes the one-hour access token when it has expired instead
				// of returning a stale one.
				return getOAuthAccessToken(ctx, {
					plugin: 'lever',
					tokenUrl: LEVER_OAUTH_TOKEN_URL,
				});
			}

			return '';
		},
	} satisfies InternalLeverPlugin;
}

export type {
	LeverEndpointInputs,
	LeverEndpointOutputs,
} from './endpoints/types';
