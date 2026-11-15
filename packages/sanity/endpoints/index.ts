import {
	generate as agentActionsGenerate,
	prompt as agentActionsPrompt,
	transform as agentActionsTransform,
	translate as agentActionsTranslate,
} from './agent-actions';
import { upload as assetsUpload } from './assets';
import {
	create as datasetsCreate,
	deleteDataset as datasetsDelete,
	list as datasetsList,
} from './datasets';
import {
	create as documentsCreate,
	deleteDocuments as documentsDelete,
	discardDraft as documentsDiscardDraft,
	edit as documentsEdit,
	get as documentsGet,
	history as documentsHistory,
	mutate as documentsMutate,
	patch as documentsPatch,
	publish as documentsPublish,
	query as documentsQuery,
	transactions as documentsTransactions,
	unpublish as documentsUnpublish,
} from './documents';
import { list as schemasList } from './schemas';
import {
	attempts as webhooksAttempts,
	create as webhooksCreate,
	deleteWebhook as webhooksDelete,
	list as webhooksList,
	update as webhooksUpdate,
} from './webhooks';

export const Documents = {
	query: documentsQuery,
	get: documentsGet,
	create: documentsCreate,
	edit: documentsEdit,
	patch: documentsPatch,
	publish: documentsPublish,
	unpublish: documentsUnpublish,
	discardDraft: documentsDiscardDraft,
	delete: documentsDelete,
	mutate: documentsMutate,
	history: documentsHistory,
	transactions: documentsTransactions,
};

export const Assets = {
	upload: assetsUpload,
};

export const Datasets = {
	list: datasetsList,
	create: datasetsCreate,
	delete: datasetsDelete,
};

export const Schemas = {
	list: schemasList,
};

export const AgentActions = {
	generate: agentActionsGenerate,
	transform: agentActionsTransform,
	translate: agentActionsTranslate,
	prompt: agentActionsPrompt,
};

export const Webhooks = {
	list: webhooksList,
	create: webhooksCreate,
	update: webhooksUpdate,
	delete: webhooksDelete,
	attempts: webhooksAttempts,
};

export * from './types';
