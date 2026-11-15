import * as account from './account';
import * as calendar from './calendar';
import * as conversations from './conversations';
import * as people from './people';
import * as smartLists from './smart-lists';
import * as tasks from './tasks';

export const People = {
	list: people.list,
	get: people.get,
	create: people.create,
	update: people.update,
	delete: people.remove,
	checkDuplicate: people.checkDuplicate,
	unclaimed: people.unclaimed,
	claim: people.claim,
	ignoreUnclaimed: people.ignoreUnclaimed,
};

export const PersonAttachments = {
	create: people.attachmentCreate,
	get: people.attachmentGet,
	update: people.attachmentUpdate,
	delete: people.attachmentDelete,
};

export const PeopleRelationships = {
	list: people.relationshipsList,
	create: people.relationshipsCreate,
	get: people.relationshipsGet,
	update: people.relationshipsUpdate,
	delete: people.relationshipsDelete,
};

export const Calls = {
	list: conversations.callsList,
	create: conversations.callsCreate,
	get: conversations.callsGet,
	update: conversations.callsUpdate,
};

export const TextMessages = {
	list: conversations.textMessagesList,
	create: conversations.textMessagesCreate,
	get: conversations.textMessagesGet,
};

export const Notes = {
	create: conversations.notesCreate,
	get: conversations.notesGet,
	update: conversations.notesUpdate,
	delete: conversations.notesDelete,
};

export const Events = {
	list: conversations.eventsList,
	get: conversations.eventsGet,
	create: conversations.eventsCreate,
};

export const Tasks = {
	list: tasks.list,
	create: tasks.create,
	get: tasks.get,
	update: tasks.update,
	delete: tasks.remove,
};

export const Appointments = {
	list: calendar.appointmentsList,
	create: calendar.appointmentsCreate,
	get: calendar.appointmentsGet,
	update: calendar.appointmentsUpdate,
	delete: calendar.appointmentsDelete,
};

export const AppointmentTypes = {
	list: calendar.appointmentTypesList,
	create: calendar.appointmentTypesCreate,
	get: calendar.appointmentTypesGet,
	update: calendar.appointmentTypesUpdate,
	delete: calendar.appointmentTypesDelete,
};

export const Timeframes = {
	list: calendar.timeframesList,
};

export const SmartLists = {
	list: smartLists.list,
	get: smartLists.get,
};

export const Account = {
	me: account.me,
	identity: account.identity,
};

export {
	call as callFollowUpBoss,
	envelopeMany,
	envelopeMeta,
	envelopeOne,
} from './call';

import {
	Groups as GroupsFamily,
	Ponds as PondsFamily,
	RateLimit as RateLimitFamily,
	Teams as TeamsFamily,
	Users as UsersFamily,
} from './admin';
import {
	ActionPlans as ActionPlansFamily,
	ActionPlansPeople as ActionPlansPeopleFamily,
	Automations as AutomationsFamily,
	AutomationsPeople as AutomationsPeopleFamily,
} from './automations';
import { create, get, list, remove, update } from './custom-fields';
import {
	appointmentOutcomesCreate,
	appointmentOutcomesDelete,
	appointmentOutcomesGet,
	appointmentOutcomesList,
	appointmentOutcomesUpdate,
	dealAttachmentsCreate,
	dealAttachmentsDelete,
	dealAttachmentsGet,
	dealAttachmentsUpdate,
	dealCustomFieldsCreate,
	dealCustomFieldsDelete,
	dealCustomFieldsGet,
	dealCustomFieldsList,
	dealCustomFieldsUpdate,
	dealsCreate,
	dealsDelete,
	dealsGet,
	dealsList,
	dealsUpdate,
	pipelinesCreate,
	pipelinesDelete,
	pipelinesGet,
	pipelinesList,
	pipelinesUpdate,
	stagesCreate,
	stagesDelete,
	stagesGet,
	stagesList,
	stagesUpdate,
} from './deals';
import {
	inboxAppsAddMessage,
	inboxAppsAddNote,
	inboxAppsAddSystemConfirmationMessage,
	inboxAppsCreateParticipant,
	inboxAppsDeactivate,
	inboxAppsDeleteParticipant,
	inboxAppsGetParticipants,
	inboxAppsInstall,
	inboxAppsInstalledApp,
	inboxAppsUpdateConversation,
	inboxAppsUpdateMessage,
	reactionsCreate,
	reactionsDelete,
	reactionsGet,
	teamInboxesList,
	threadedRepliesGet,
} from './inbox';
import {
	emCampaignsCreate,
	emCampaignsList,
	emCampaignsUpdate,
	emEventsCreate,
	emEventsList,
	templatesCreate,
	templatesDelete,
	templatesGet,
	templatesList,
	templatesMerge,
	templatesUpdate,
	textMessageTemplatesCreate,
	textMessageTemplatesDelete,
	textMessageTemplatesGet,
	textMessageTemplatesList,
	textMessageTemplatesMerge,
	textMessageTemplatesUpdate,
} from './marketing';
import {
	webhookEventsGet,
	webhooksCreate,
	webhooksDelete,
	webhooksGet,
	webhooksList,
	webhooksUpdate,
} from './webhooks';

export const Deals = {
	list: dealsList,
	get: dealsGet,
	create: dealsCreate,
	update: dealsUpdate,
	delete: dealsDelete,
};

export const Pipelines = {
	list: pipelinesList,
	get: pipelinesGet,
	create: pipelinesCreate,
	update: pipelinesUpdate,
	delete: pipelinesDelete,
};

export const Stages = {
	list: stagesList,
	get: stagesGet,
	create: stagesCreate,
	update: stagesUpdate,
	delete: stagesDelete,
};

export const DealCustomFields = {
	list: dealCustomFieldsList,
	get: dealCustomFieldsGet,
	create: dealCustomFieldsCreate,
	update: dealCustomFieldsUpdate,
	delete: dealCustomFieldsDelete,
};

export const DealAttachments = {
	create: dealAttachmentsCreate,
	get: dealAttachmentsGet,
	update: dealAttachmentsUpdate,
	delete: dealAttachmentsDelete,
};

export const AppointmentOutcomes = {
	list: appointmentOutcomesList,
	get: appointmentOutcomesGet,
	create: appointmentOutcomesCreate,
	update: appointmentOutcomesUpdate,
	delete: appointmentOutcomesDelete,
};

export const CustomFields = {
	list: list,
	get: get,
	create: create,
	update: update,
	delete: remove,
};

export const Templates = {
	list: templatesList,
	get: templatesGet,
	create: templatesCreate,
	update: templatesUpdate,
	delete: templatesDelete,
	merge: templatesMerge,
};

export const TextMessageTemplates = {
	list: textMessageTemplatesList,
	get: textMessageTemplatesGet,
	create: textMessageTemplatesCreate,
	update: textMessageTemplatesUpdate,
	delete: textMessageTemplatesDelete,
	merge: textMessageTemplatesMerge,
};

export const EmCampaigns = {
	list: emCampaignsList,
	create: emCampaignsCreate,
	update: emCampaignsUpdate,
};

export const EmEvents = {
	list: emEventsList,
	create: emEventsCreate,
};

export const Users = {
	list: UsersFamily.list,
	get: UsersFamily.get,
	delete: UsersFamily.delete,
};

export const Teams = {
	list: TeamsFamily.list,
	create: TeamsFamily.create,
	get: TeamsFamily.get,
	update: TeamsFamily.update,
	delete: TeamsFamily.delete,
};

export const Groups = {
	list: GroupsFamily.list,
	create: GroupsFamily.create,
	get: GroupsFamily.get,
	update: GroupsFamily.update,
	delete: GroupsFamily.delete,
	roundRobin: GroupsFamily.roundRobin,
};

export const Ponds = {
	list: PondsFamily.list,
	create: PondsFamily.create,
	get: PondsFamily.get,
	update: PondsFamily.update,
	delete: PondsFamily.delete,
};

export const RateLimit = {
	limits: RateLimitFamily.limits,
	usage: RateLimitFamily.usage,
};

export const Automations = {
	list: AutomationsFamily.list,
	get: AutomationsFamily.get,
};

export const AutomationsPeople = {
	list: AutomationsPeopleFamily.list,
	get: AutomationsPeopleFamily.get,
	create: AutomationsPeopleFamily.create,
	update: AutomationsPeopleFamily.update,
};

export const ActionPlans = {
	list: ActionPlansFamily.list,
};

export const ActionPlansPeople = {
	list: ActionPlansPeopleFamily.list,
	create: ActionPlansPeopleFamily.create,
	update: ActionPlansPeopleFamily.update,
};

export const Webhooks = {
	list: webhooksList,
	create: webhooksCreate,
	get: webhooksGet,
	update: webhooksUpdate,
	delete: webhooksDelete,
};

export const WebhookEvents = {
	get: webhookEventsGet,
};

export const InboxApps = {
	deactivate: inboxAppsDeactivate,
	deleteParticipant: inboxAppsDeleteParticipant,
	getParticipants: inboxAppsGetParticipants,
	createParticipant: inboxAppsCreateParticipant,
	addMessage: inboxAppsAddMessage,
	addNote: inboxAppsAddNote,
	addSystemConfirmationMessage: inboxAppsAddSystemConfirmationMessage,
	install: inboxAppsInstall,
	updateConversation: inboxAppsUpdateConversation,
	updateMessage: inboxAppsUpdateMessage,
	installedApp: inboxAppsInstalledApp,
};

export const TeamInboxes = {
	list: teamInboxesList,
};

export const Reactions = {
	create: reactionsCreate,
	get: reactionsGet,
	delete: reactionsDelete,
};

export const ThreadedReplies = {
	get: threadedRepliesGet,
};

export * from './types';
