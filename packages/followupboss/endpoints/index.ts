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
export * from './types';
